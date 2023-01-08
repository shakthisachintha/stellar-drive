provider "aws" {
  region = "us-east-1"
  access_key = ""
  secret_key = ""
}

resource "aws_s3_bucket" "stellar_drive_main_bucket" {
  bucket = "stellar-drive-bucket-terra"
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.stellar_drive_main_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "object_ownership" {
  bucket = aws_s3_bucket.stellar_drive_main_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

output "bucket_id" {
  value = aws_s3_bucket.stellar_drive_main_bucket.id
}