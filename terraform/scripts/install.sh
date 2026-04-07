#!/bin/bash

set -e

echo "=============================================="
echo "  SupportHub - Automated Dependency Installer"
echo "=============================================="

OS="$(uname -s)"
echo "Detected OS: $OS"

install_docker() {
  if command -v docker &> /dev/null; then
    echo "Docker already installed: $(docker --version)"
    return
  fi

  echo "Installing Docker..."

  if [[ "$OS" == "Linux" ]]; then
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
      | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "Docker installed successfully"
  else
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
  fi
}

install_terraform() {
  if command -v terraform &> /dev/null; then
    echo "Terraform already installed: $(terraform --version | head -1)"
    return
  fi

  echo "Installing Terraform..."

  if [[ "$OS" == "Linux" ]]; then
    apt-get update -y && apt-get install -y gnupg software-properties-common
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
      https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
      | tee /etc/apt/sources.list.d/hashicorp.list
    apt-get update -y
    apt-get install -y terraform
    echo "Terraform installed successfully"
  else
    echo "Please install Terraform from https://developer.hashicorp.com/terraform/downloads"
  fi
}

install_kubectl() {
  if command -v kubectl &> /dev/null; then
    echo "kubectl already installed: $(kubectl version --client --short 2>/dev/null)"
    return
  fi

  echo "Installing kubectl..."

  if [[ "$OS" == "Linux" ]]; then
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    mv kubectl /usr/local/bin/
    echo "kubectl installed successfully"
  else
    echo "Please install kubectl from https://kubernetes.io/docs/tasks/tools/"
  fi
}

verify_installations() {
  echo ""
  echo "=============================================="
  echo "  Verifying Installations"
  echo "=============================================="
  command -v docker    &> /dev/null && echo "Docker    : $(docker --version)"    || echo "Docker    : NOT FOUND"
  command -v terraform &> /dev/null && echo "Terraform : $(terraform --version | head -1)" || echo "Terraform : NOT FOUND"
  command -v kubectl   &> /dev/null && echo "kubectl   : $(kubectl version --client 2>/dev/null | head -1)" || echo "kubectl   : NOT FOUND"
  echo "=============================================="
  echo "  SupportHub dependencies ready!"
  echo "=============================================="
}

install_docker
install_terraform
install_kubectl
verify_installations