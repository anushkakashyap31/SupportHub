terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# AWS Provider — connects Terraform to your AWS account
provider "aws" {
  region = var.aws_region
}

# VPC — Virtual Private Cloud (your isolated network on AWS)
resource "aws_vpc" "supporthub_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Internet Gateway — allows your server to talk to the internet
resource "aws_internet_gateway" "supporthub_igw" {
  vpc_id = aws_vpc.supporthub_vpc.id

  tags = {
    Name    = "${var.project_name}-igw"
    Project = var.project_name
  }
}

# Subnet — a section of your VPC where EC2 lives
resource "aws_subnet" "supporthub_subnet" {
  vpc_id                  = aws_vpc.supporthub_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-subnet"
    Project = var.project_name
  }
}

# Route Table — routes internet traffic through the gateway
resource "aws_route_table" "supporthub_rt" {
  vpc_id = aws_vpc.supporthub_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.supporthub_igw.id
  }

  tags = {
    Name    = "${var.project_name}-rt"
    Project = var.project_name
  }
}

resource "aws_route_table_association" "supporthub_rta" {
  subnet_id      = aws_subnet.supporthub_subnet.id
  route_table_id = aws_route_table.supporthub_rt.id
}

# Security Group — firewall rules for your server
resource "aws_security_group" "supporthub_sg" {
  name        = "${var.project_name}-sg"
  description = "SupportHub security group"
  vpc_id      = aws_vpc.supporthub_vpc.id

  # SSH — only you can access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP — everyone can access SupportHub
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Nginx gateway HTTP"
  }

  # Kubernetes Nodes
  ingress {
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Kubernetes NodePort"
  }

  # TriageAgent backend
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "TriageAgent Backend API"
  }

  # QuizBot backend
  ingress {
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "QuizBot Backend API"
  }

  # TriageAgent frontend
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "TriageAgent Frontend"
  }

  # QuizBot frontend
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "QuizBot Frontend"
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-sg"
    Project = var.project_name
  }
}

# Key Pair — for SSH access to your EC2 instance
resource "aws_key_pair" "supporthub_key" {
  key_name   = "${var.project_name}-key"
  public_key = file(var.public_key_path)

  tags = {
    Project = var.project_name
  }
}

# EC2 Instance — your actual server
resource "aws_instance" "supporthub_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.supporthub_subnet.id
  vpc_security_group_ids = [aws_security_group.supporthub_sg.id]
  key_name               = aws_key_pair.supporthub_key.key_name

  # Storage — 20 GB for Docker images
  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  # User data — runs automatically when server boots
  # This is the IaC magic — zero manual steps
  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Update system
    apt-get update -y
    apt-get upgrade -y

    # Install Git
    apt-get install -y git curl

    # Clone SupportHub repo
    git clone https://github.com/anushkakashyap31/SupportHub.git /home/ubuntu/SupportHub
    cd /home/ubuntu/SupportHub

    # Run automated installer — installs Docker, Terraform, kubectl
    chmod +x terraform/scripts/install.sh
    bash terraform/scripts/install.sh

    curl -sfL https://get.k3s.io | sh -

    # Set ownership
    chown -R ubuntu:ubuntu /home/ubuntu/SupportHub

    echo "SupportHub server ready!"
  EOF

  tags = {
    Name        = "${var.project_name}-server"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP — gives your server a permanent public IP
# Without this, IP changes every time server restarts
resource "aws_eip" "supporthub_eip" {
  instance = aws_instance.supporthub_server.id
  domain   = "vpc"

  tags = {
    Name    = "${var.project_name}-eip"
    Project = var.project_name
  }
}

# Outputs — printed after terraform apply
output "server_public_ip" {
  description = "SupportHub public IP address"
  value       = aws_eip.supporthub_eip.public_ip
}

output "supporthub_url" {
  description = "SupportHub platform URL"
  value       = "http://${aws_eip.supporthub_eip.public_ip}"
}

output "triage_url" {
  description = "TriageAgent URL"
  value       = "http://${aws_eip.supporthub_eip.public_ip}/triage/"
}

output "quiz_url" {
  description = "QuizBot URL"
  value       = "http://${aws_eip.supporthub_eip.public_ip}/quiz/"
}

output "kubernetes_url" {
  description = "SupportHub via Kubernetes"
  value       = "http://${aws_eip.supporthub_eip.public_ip}:30080"
}

output "ssh_command" {
  description = "SSH command to connect to server"
  value       = "ssh -i supporthub-key.pem ubuntu@${aws_eip.supporthub_eip.public_ip}"
}