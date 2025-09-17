module "ecs" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "nonprod-cosmic-events-cluster"

  create_task_exec_iam_role = true
  create_task_exec_policy = true

  services = {
    cosmic-events-api = {
      cpu    = 256
      memory = 512

      container_definitions = {
        cosmic-events-api = {
          cpu       = 256
          memory    = 512
          essential = true
          image     = "186050465172.dkr.ecr.us-east-2.amazonaws.com/nonprod-cosmic-events-ecr:d5d2c2f"
          portMappings = [
            {
              name          = "cosmic-events-api"
              containerPort = 80
              protocol      = "tcp"
            }
          ]
          secrets = [
            {
              name      = "AWS_REGION"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/AWS_REGION"
            },
            {
              name      = "AWS_ACCESS_KEY_ID"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/AWS_ACCESS_KEY_ID"
            },
            {
              name      = "AWS_SECRET_ACCESS_KEY"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/AWS_SECRET_ACCESS_KEY"
            },
            {
              name      = "CACHE_URL"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/CACHE_URL"
            },
            {
              name      = "CDN_BUCKET"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/CDN_BUCKET"
            },
            {
              name      = "DATABASE_NAME"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/DATABASE_NAME"
            },
            {
              name      = "DATABASE_RESOURCE_ARN"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/DATABASE_RESOURCE_ARN"
            },
            {
              name      = "DATABASE_SECRET_ARN"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/DATABASE_SECRET_ARN"
            },
            {
              name      = "GOOGLE_CLIENT_ID"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/GOOGLE_CLIENT_ID"
            },
            {
              name      = "SESSION_SECRET"
              valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/SESSION_SECRET"
            }
          ]

          enable_cloudwatch_logging = true

          memoryReservation = 128
        }
      }

      load_balancer = {
        service = {
          target_group_arn = aws_lb_target_group.fargate.arn
          container_name   = "cosmic-events-api"
          container_port   = 80
        }
      }

      subnet_ids = module.vpc.public_subnets
      assign_public_ip = false
      security_group_ingress_rules = {
        alb_3000 = {
          description                  = "Service port"
          from_port                    = 3000
          ip_protocol                  = "tcp"
          referenced_security_group_id = aws_security_group.alb.id
        }
      }
      security_group_egress_rules = {
        all = {
          ip_protocol = "-1"
          cidr_ipv4   = "0.0.0.0/0"
        }
      }
    }
  }

  tags = {
    Environment = "nonprod"
    Terraform   = "true"
  }
}
