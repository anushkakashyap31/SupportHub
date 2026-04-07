terraform {
  required_version = ">= 1.0"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

variable "project_name" {
  description = "Name of the project"
  default     = "SupportHub"
}

variable "environment" {
  description = "Deployment environment"
  default     = "local"
}

resource "local_file" "env_config" {
  content  = <<-EOF
    PROJECT_NAME=${var.project_name}
    ENVIRONMENT=${var.environment}
    TRIAGE_BACKEND_PORT=8000
    QUIZ_BACKEND_PORT=8001
    TRIAGE_FRONTEND_PORT=3000
    QUIZ_FRONTEND_PORT=3001
    NGINX_PORT=80
  EOF
  filename = "${path.module}/../.env.terraform"
}

resource "null_resource" "install_dependencies" {
  provisioner "local-exec" {
    command = "bash ${path.module}/scripts/install.sh"
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "deploy_supporthub" {
  depends_on = [null_resource.install_dependencies]

  provisioner "local-exec" {
    command     = "bash ${path.module}/scripts/deploy.sh"
    working_dir = path.module
  }

  triggers = {
    always_run = timestamp()
  }
}

output "project_info" {
  value = {
    name        = var.project_name
    environment = var.environment
    services    = ["TriageAgent", "QuizBot", "Nginx"]
    ports = {
      nginx            = 80
      triage_backend   = 8000
      triage_frontend  = 3000
      quiz_backend     = 8001
      quiz_frontend    = 3001
    }
  }
}