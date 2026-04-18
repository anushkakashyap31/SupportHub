variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "SupportHub"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region — Mumbai is closest to India"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
  # t2.micro  = 1 GB RAM  (free tier, might struggle)
  # t2.small  = 2 GB RAM  (~$17/month, recommended)
  # t2.medium = 4 GB RAM  (~$34/month, comfortable)
}

variable "ami_id" {
  description = "Ubuntu 24.04 LTS AMI for ap-south-1 (Mumbai)"
  type        = string
  default     = "ami-05d2839d4f73aafb"
  # This is Ubuntu 22.04 LTS in Mumbai region
  # If expired, find latest at: EC2 → AMI Catalog → search Ubuntu 22.04
}

variable "public_key_path" {
  description = "Path to your SSH public key"
  type        = string
  default     = "~/.ssh/supporthub-key.pub"
}

variable "triage_backend_port" {
  type    = number
  default = 8000
}

variable "triage_frontend_port" {
  type    = number
  default = 3000
}

variable "quiz_backend_port" {
  type    = number
  default = 8001
}

variable "quiz_frontend_port" {
  type    = number
  default = 3001
}

variable "nginx_port" {
  type    = number
  default = 80
}