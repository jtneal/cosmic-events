module "s3" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "cdn.nonprod.cosmicevents.app"
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "cdn.nonprod.cosmicevents.app-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_response_headers_policy" "cors" {
  name = "cosmic-cors"

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS"]
    }

    access_control_allow_origins {
      items = [
        "https://nonprod.cosmicevents.app",
        "http://localhost:4200",
      ]
    }

    origin_override = true
  }
}

module "cdn" {
  source = "terraform-aws-modules/cloudfront/aws"

  origin = {
    s3 = {
      domain_name              = module.s3.s3_bucket_bucket_regional_domain_name
      origin_id                = "s3"
      origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"
    # Allow preflight but only cache GET/HEAD
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors.id
  }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_policy" "allow_cf_oac" {
  bucket = module.s3.s3_bucket_id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AllowCloudFrontReadOnlyWithOAC",
        Effect    = "Allow",
        Principal = { Service = "cloudfront.amazonaws.com" },
        Action    = ["s3:GetObject"],
        Resource  = "arn:aws:s3:::${module.s3.s3_bucket_id}/*",
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${module.cdn.cloudfront_distribution_id}"
          }
        }
      }
    ]
  })
}
