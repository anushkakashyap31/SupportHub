#!/bin/bash

set -e

echo "=============================================="
echo "  SupportHub - Automated Deployment Script"
echo "=============================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "Project root: $ROOT_DIR"

cd "$ROOT_DIR"

check_requirements() {
  echo "Checking requirements..."
  command -v docker &> /dev/null || { echo "Docker not found. Run install.sh first."; exit 1; }
  command -v docker compose version &> /dev/null || { echo "Docker Compose not found."; exit 1; }
  echo "All requirements satisfied"
}

check_env_files() {
  echo "Checking environment files..."

  files=(
    "TriageAgent/backend/.env"
    "TriageAgent/backend/firebase-credentials.json"
    "QuizBot/backend/.env"
    "QuizBot/backend/firebase-credentials.json"
  )

  for f in "${files[@]}"; do
    if [ ! -f "$ROOT_DIR/$f" ]; then
      echo "WARNING: Missing $f"
    else
      echo "Found: $f"
    fi
  done
}

build_images() {
  echo ""
  echo "Building Docker images..."
  docker compose build --no-cache
  echo "All images built successfully"
}

deploy_services() {
  echo ""
  echo "Starting all services..."
  docker compose up -d
  echo "All services started"
}

health_check() {
  echo ""
  echo "Waiting for services to be ready..."
  sleep 10

  echo "Running health checks..."

  check_service() {
    local name=$1
    local url=$2
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
      echo "$name : HEALTHY"
    else
      echo "$name : NOT READY (may still be starting)"
    fi
  }

  check_service "TriageAgent Backend" "http://localhost:8000/health"
  check_service "QuizBot Backend"     "http://localhost:8001/health"
  check_service "Nginx Gateway"       "http://localhost:80"
}

show_summary() {
  echo ""
  echo "=============================================="
  echo "  SupportHub Deployment Complete!"
  echo "=============================================="
  echo "  Platform     : http://localhost"
  echo "  TriageAgent  : http://localhost/triage/"
  echo "  QuizBot      : http://localhost/quiz/"
  echo "  Triage API   : http://localhost:8000/docs"
  echo "  Quiz API     : http://localhost:8001/docs"
  echo "=============================================="
  echo ""
  echo "  Useful commands:"
  echo "  docker compose ps          → see all containers"
  echo "  docker compose logs -f     → see live logs"
  echo "  docker compose down        → stop everything"
  echo "=============================================="
}

check_requirements
check_env_files
build_images
deploy_services
health_check
show_summary