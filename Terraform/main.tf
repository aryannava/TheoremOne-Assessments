provider "aws" {
  region = "ca-central-1" # Change this to your desired AWS region
}

resource "aws_s3_bucket" "main" {
  provider = aws
  bucket   = "aryan-bucket-789123"
  tags = {
    Name        = "aryan-bucket-789123"
    Environment = "Development"
    Project     = "MyDemo"
  }
}


resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket   = aws_s3_bucket.main.id
  provider = aws
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_versioning" "main" {
  bucket   = aws_s3_bucket.main.id
  provider = aws
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket                  = aws_s3_bucket.main.id
  provider                = aws
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}


resource "aws_s3_bucket_policy" "main" {
  bucket   = aws_s3_bucket.main.id
  provider = aws
  policy   = data.aws_iam_policy_document.bucket_policy.json
}

data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid     = "AllowOnly"
    effect  = "Allow"
    actions = ["s3:*"]

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::187450732934:user/terraformuser"]
    }

    resources = ["arn:aws:s3:::aryan-bucket-789123/*"]
  }
}