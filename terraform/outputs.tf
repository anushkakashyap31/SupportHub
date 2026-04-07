output "platform_name" {
  description = "Name of the platform"
  value       = var.project_name
}

output "environment" {
  description = "Current deployment environment"
  value       = var.environment
}

output "service_urls" {
  description = "URLs for all SupportHub services"
  value = {
    platform         = "http://localhost:${var.nginx_port}"
    triage_agent     = "http://localhost:${var.nginx_port}/triage/"
    quizbot          = "http://localhost:${var.nginx_port}/quiz/"
    triage_api       = "http://localhost:${var.triage_backend_port}/docs"
    quiz_api         = "http://localhost:${var.quiz_backend_port}/docs"
  }
}

output "docker_services" {
  description = "All Docker services in the platform"
  value = [
    "triage-backend  → port ${var.triage_backend_port}",
    "triage-frontend → port ${var.triage_frontend_port}",
    "quiz-backend    → port ${var.quiz_backend_port}",
    "quiz-frontend   → port ${var.quiz_frontend_port}",
    "nginx           → port ${var.nginx_port}"
  ]
}