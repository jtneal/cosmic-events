terraform {
  backend "s3" {
    bucket         = "cosmic-events-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-2"
  }
}
