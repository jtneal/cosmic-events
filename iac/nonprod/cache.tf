module "elasticache" {
  source = "terraform-aws-modules/elasticache/aws"

  replication_group_id = "nonprod-cosmic-events-cache"

  engine         = "valkey"
  engine_version = "8.1"
  node_type      = "cache.t4g.small"

  maintenance_window = "sun:05:00-sun:09:00"
  apply_immediately  = true

  vpc_id = module.vpc.vpc_id
  security_group_rules = {
    ingress_vpc = {
      description = "VPC traffic"
      cidr_ipv4   = module.vpc.vpc_cidr_block
    }
  }

  subnet_group_name        = "nonprod-cosmic-events-cache"
  subnet_group_description = "Valkey replication group subnet group"
  subnet_ids               = module.vpc.private_subnets

  tags = {
    Environment = "nonprod"
    Terraform   = "true"
  }
}
