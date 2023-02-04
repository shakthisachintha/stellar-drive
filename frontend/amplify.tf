provider "aws" {
  region = "us-east-1"
  access_key = ""
  secret_key = ""
}

resource "aws_amplify_app" "stellar_drive_frontend" {
  name     = "my-react-app"
  repository = "https://github.com/shakthisachintha/stellar-drive.git"
  access_token = ""
}

resource "aws_amplify_branch" "frontend_development" {
  app_id      = aws_amplify_app.stellar_drive_frontend.id
  branch_name = "frontend/development"

  framework = "React"
  stage     = "DEVELOPMENT"

  enable_auto_build = true
}

resource "aws_amplify_webhook" "stellar_drive_frontend_webhook" {
  app_id       = aws_amplify_app.stellar_drive_frontend.id
  branch_name  = aws_amplify_branch.frontend_development.branch_name
  description  = "Webhook for development branch"
}
