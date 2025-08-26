terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

########################################################################################################################
# VARIABLES
########################################################################################################################

variable "name_prefix" {
  description = "Prefix for all resource names"
  type        = string
  default     = "nonprod-cosmic-events"
}

########################################################################################################################
# DATABASE - Aurora Serverless v2 (Postgres)
########################################################################################################################

resource "aws_rds_cluster" "nonprod" {
  cluster_identifier      = "${var.name_prefix}-cluster"
  engine                  = "aurora-postgresql"
  availability_zones      = ["us-east-2a", "us-east-2b", "us-east-2c"]
  database_name           = "NonProdCosmicEvents"
  master_username         = "postgres"
  master_password         = "%1#C2WWXpL#KtL1^mvGqp0cAI3sdzMfT"
  backup_retention_period = 7
  preferred_backup_window = "04:00-06:00"
  enable_http_endpoint    = true
  apply_immediately       = true

  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 2
  }

  tags = { Name = "${var.name_prefix}-cluster" }
}

resource "aws_rds_cluster_instance" "nonprod" {
  count              = 1
  identifier         = "${var.name_prefix}-instance-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.nonprod.id
  engine             = aws_rds_cluster.nonprod.engine
  engine_version     = aws_rds_cluster.nonprod.engine_version
  instance_class     = "db.serverless"
  apply_immediately  = true

  tags = { Name = "${var.name_prefix}-instance-${count.index + 1}" }
}
