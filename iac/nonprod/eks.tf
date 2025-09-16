module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = "nonprod-cosmic-events-eks"
  kubernetes_version = "1.33"

  authentication_mode                      = "API_AND_CONFIG_MAP"
  endpoint_public_access                   = true
  enable_cluster_creator_admin_permissions = true

  access_entries = {
    console-admin = {
      principal_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"

      policy_associations = {
        admin = {
          policy_arn  = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = { type = "cluster" }
        }
      }
    }
  }

  encryption_config = {
    resources        = ["secrets"]
    provider_key_arn = aws_kms_key.eks_secrets_key.arn
  }

  compute_config = {
    enabled    = true
    node_pools = ["general-purpose"]
  }

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  tags = {
    Environment = "nonprod"
    Terraform   = "true"
  }
}

resource "aws_kms_key" "eks_secrets_key" {
  description             = "KMS key for EKS secrets encryption"
  deletion_window_in_days = 7
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable KMS key usage for EKS"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow EKS service to use KMS key"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })
}
