# # Providing a reference to our default VPC
resource "aws_vpc" "stellar_drive_vpc" {
  cidr_block = "10.1.0.0/16"
}

# Providing a reference to our default subnets
resource "aws_subnet" "public_subnet_a" {
  vpc_id                  = aws_vpc.stellar_drive_vpc.id
  cidr_block              = "10.1.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id                  = aws_vpc.stellar_drive_vpc.id
  cidr_block              = "10.1.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
}

# Create a new ECS cluster
resource "aws_ecs_cluster" "cluster" {
  name = "sd-cluster"
}


# Create a security group for the ECS cluster
resource "aws_security_group" "sg" {
  name        = "ecs-security-group"
  description = "Security group for the ECS cluster"
  vpc_id      = aws_vpc.stellar_drive_vpc.id

  # Allow incoming traffic on port 80
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow outgoing traffic from the ECS cluster
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.stellar_drive_vpc.id
}

# Create a route table
resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.stellar_drive_vpc.id

  # Create a route that sends traffic to the Internet Gateway
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }
}

# Create two route table associations for the subnets
resource "aws_route_table_association" "rta_1" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.rt.id
}

# Create two route table associations for the subnets
resource "aws_route_table_association" "rta_2" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.rt.id
}

resource "aws_ecr_repository" "stellar_driver_backend" {
  name = "stellar-drive"
}

resource "aws_ecr_repository_policy" "repository_policy" {
  repository = aws_ecr_repository.stellar_driver_backend.name

  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "new policy",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeRepositories",
                "ecr:GetRepositoryPolicy",
                "ecr:ListImages",
                "ecr:DeleteRepository",
                "ecr:BatchDeleteImage",
                "ecr:SetRepositoryPolicy",
                "ecr:DeleteRepositoryPolicy"
            ]
        }
    ]
}
EOF
}

resource "aws_ecs_task_definition" "stellar_drive_task" {
  family                   = "sd-task-definition" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "sd-container",
      "image": "${aws_ecr_repository.stellar_driver_backend.repository_url}",
      "essential": true,
      "environmentFiles": [
        {
          "value": "arn:aws:s3:::stellar-drive/.env",
          "type": "s3"
        }
      ],
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001
        }
      ],
      "memory": 512,
      "cpu": 256,
      "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "sd-log-group",
                "awslogs-region": "us-east-1",
                "awslogs-stream-prefix": "ecs"
            }
        }
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires
  cpu                      = 256         # Specifying the CPU our container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "sd-TaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "stellar_driver_service" {
  name            = "sd-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.stellar_drive_task.arn
  desired_count   = 2
  # Rolling Update Deployment Strategy  
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"

  network_configuration {
    security_groups  = [aws_security_group.ecs_service_security_group.id]
    subnets          = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = "sd-container"
    container_port   = 3001
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
  #   depends_on = [aws_ecs_task_definition.task]

}


# Create a security group that allows incoming traffic on TCP port 3001
resource "aws_security_group" "ecs_service_security_group" {
  name        = "sd-service-security-group"
  description = "Security group for ECS service"
  vpc_id      = aws_vpc.stellar_drive_vpc.id

  ingress {
    from_port = 3001
    to_port   = 3001
    protocol  = "tcp"
    # Only allowing traffic in from the load balancer security group
    security_groups = [aws_security_group.load_balancer_security_group.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_alb" "application_load_balancer" {
  name               = "sd-load-balancer" # Naming our load balancer
  internal           = false
  load_balancer_type = "application"
  subnets = [ # Referencing the default subnets
    aws_subnet.public_subnet_a.id,
    aws_subnet.public_subnet_b.id
  ]
  # Referencing the security group
  security_groups = [aws_security_group.load_balancer_security_group.id]
}

# Creating a security group for the load balancer:
resource "aws_security_group" "load_balancer_security_group" {
  name   = "sd-lb-security-group"
  vpc_id = aws_vpc.stellar_drive_vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic in from all sources
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "target_group" {
  name        = "sd-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.stellar_drive_vpc.id # Referencing the default VPC
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn # Referencing our load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn # Referencing our target group
  }
}

# Create an S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "stellar-drive"
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.bucket.id
  acl    = "private"
}