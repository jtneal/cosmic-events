locals {
  name = "nonprod-cosmic-events"
}

########################################################################################################################
# IAM
########################################################################################################################

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "ecs_task" {
  name = "${local.name}-role-task"
  path = "/ECS/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "ecs_task_execution" {
  name = "${local.name}-role-task-execution"
  path = "/ECS/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy
resource "aws_iam_role_policy" "ecs_task_execution_policy" {
  name = "${local.name}-policy-task-execution"
  role = aws_iam_role.ecs_task_execution.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = module.ecr.repository_arn
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters"
        ]
        Resource = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/*"
      }
    ]
  })
}

################################################################################
# ALB
################################################################################

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/acm_certificate
data "aws_acm_certificate" "certs" {
  domain      = "nonprod.cosmicevents.app"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone
data "aws_route53_zone" "nonprod" {
  name = "nonprod.cosmicevents.app."
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
resource "aws_security_group" "alb" {
  name   = "${local.name}-sg-alb"
  vpc_id = module.vpc.vpc_id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "outbound_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "inbound_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "inbound_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb
resource "aws_lb" "alb" {
  name               = "${local.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.certs.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs.arn
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record
resource "aws_route53_record" "nonprod_apex" {
  zone_id = data.aws_route53_zone.nonprod.zone_id
  name    = "nonprod.cosmicevents.app"
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = false
  }
}

########################################################################################################################
# ECS Cluster
########################################################################################################################

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster
resource "aws_ecs_cluster" "nonprod" {
  name = "${local.name}-cluster"
}

########################################################################################################################
# ECS Task
########################################################################################################################

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group
resource "aws_cloudwatch_log_group" "default" {
  name              = local.name
  retention_in_days = 7
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition
resource "aws_ecs_task_definition" "service" {
  family                   = "${local.name}-task-definition"
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name        = "${local.name}-api"
      image       = "186050465172.dkr.ecr.us-east-2.amazonaws.com/nonprod-cosmic-events-ecr:4e8b543"
      cpu         = 256
      memory      = 512
      essential   = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = aws_cloudwatch_log_group.default.name
          awslogs-region = "us-east-2"
          awslogs-stream-prefix = "api"
        }
      }
      secrets = [
        {
          name      = "AWS_ACCESS_KEY_ID"
          valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/AWS_ACCESS_KEY_ID"
        },
        {
          name      = "AWS_REGION"
          valueFrom = "arn:aws:ssm:us-east-2:186050465172:parameter/nonprod/AWS_REGION"
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
    }
  ])
}

########################################################################################################################
# ECS Service
########################################################################################################################

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group
resource "aws_security_group" "ecs" {
  name   = "${local.name}-sg-ecs"
  vpc_id = module.vpc.vpc_id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "ecs_outbound_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ecs.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "ecs_allow_cluster_traffic" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  self              = true
  security_group_id = aws_security_group.ecs.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule
resource "aws_security_group_rule" "ecs_allow_alb_traffic" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.ecs.id
  source_security_group_id = aws_security_group.alb.id
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group
resource "aws_lb_target_group" "ecs" {
  name                 = "${local.name}-tg"
  port                 = 80
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = module.vpc.vpc_id

  health_check {
    path                = "/health"
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service
resource "aws_ecs_service" "ecs" {
  name                               = "${local.name}-service"
  cluster                            = aws_ecs_cluster.nonprod.arn
  task_definition                    = aws_ecs_task_definition.service.arn
  desired_count                      = 1
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs.arn
    container_name   = "${local.name}-api"
    container_port   = 3000
  }
}
