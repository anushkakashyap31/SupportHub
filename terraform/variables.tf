variable "project_name" {
  description = "Name of the SupportHub platform"
  type        = string
  default     = "SupportHub"
}

variable "environment" {
  description = "Deployment environment (local, staging, production)"
  type        = string
  default     = "local"
  validation {
    condition     = contains(["local", "staging", "production"], var.environment)
    error_message = "Environment must be local, staging, or production."
  }
}

variable "triage_backend_port" {
  description = "Port for TriageAgent backend service"
  type        = number
  default     = 8000
}

variable "triage_frontend_port" {
  description = "Port for TriageAgent frontend service"
  type        = number
  default     = 3000
}

variable "quiz_backend_port" {
  description = "Port for QuizBot backend service"
  type        = number
  default     = 8001
}

variable "quiz_frontend_port" {
  description = "Port for QuizBot frontend service"
  type        = number
  default     = 3001
}

variable "nginx_port" {
  description = "Port for Nginx API gateway"
  type        = number
  default     = 80
}

variable "docker_compose_file" {
  description = "Path to docker-compose file"
  type        = string
  default     = "../docker-compose.yml"
}