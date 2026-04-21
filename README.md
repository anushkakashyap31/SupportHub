# SupportHub — AI-Powered Microservices Platform for Non-Profit Support Operations

---

**SupportHub** is a production-grade DevOps project that deploys two AI-powered applications — **TriageAgent** and **QuizBot** — as a unified microservices platform on AWS EC2.

The platform demonstrates real-world infrastructure automation using:
- **Docker** — containerization of all services
- **Kubernetes (K3s)** — container orchestration
- **Terraform** — Infrastructure as Code (IaC)
- **GitHub Actions** — CI/CD pipeline
- **AWS EC2 Server** — Deployment

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| SupportHub Platform | http://13.206.119.123:8080 |
| TriageAgent | http://13.206.119.123:8080/triage/ |
| QuizBot | http://13.206.119.123:8080/quiz/ |
| TriageAgent API Docs | http://13.206.119.123:8000/docs |
| QuizBot API Docs | http://13.206.119.123:8001/docs |

---

## Project Details

**Project Code: DO-15 | Batch D2 | Group 03D2 | Medicaps University × Datagami | AY 2026**

---

## Problem Statement - IaC Provisioning for Non-Profit System

Automate the provisioning of infrastructure for a Non-Profit system using Infrastructure as Code (IaC) tools like Terraform or Ansible. The project involves script-based deployment of local Docker environments or cloud instances (e.g., AWS), including the automated installation of core dependencies such as Terraform or Ansible. This approach eliminates manual configuration errors and enables repeatable, scalable environment setup.

## Major Tools	

Docker, Kubernetes, Terraform, GitHub Actions, AWS Console, Nginx 

---

## 👥 Team Members

| Name | Enrollment No |
|---|---|
| Ananya Subramanya Rao | EN22CS301120 |
| Anirudh Vyas | EN22CS301131 |
| Anushka Kashyap | EN22CS301180 |
| Atharv Chaturvedi | EN22CS301228 |
| Harshit Panchal | EN23CS3L1010 |

---

## 🤖 The Two AI Services

### ⚡ TriageAgent
An AI-powered communication triage system for non-profit organizations.

**What it does:**
- Automatically classifies incoming messages by urgency (Critical/High/Normal/Low) and intent
- Extracts named entities using spaCy NER (names, dates, amounts, emails)
- Generates professional draft responses using Google Gemini 2.5 Flash via LangChain
- Routes messages to correct departments automatically
- Processes each message in 5-10 seconds

**Tech Stack:** FastAPI · LangChain · Gemini 2.5 Flash · spaCy NER · React 19 · Firebase

**Ports:** Backend `:8000` | Frontend `:3000`

---

### 🧠 QuizBot
An AI-driven educational assessment platform for non-profit staff training.

**What it does:**
- Parses donor emails and builds vector embeddings using Sentence Transformers
- Generates contextual MCQ quizzes using RAG pipeline powered by Gemini AI
- Evaluates answers with deep contextual explanations
- Tracks learning progress over time with SQLite persistence

**Tech Stack:** FastAPI · ChromaDB · Sentence Transformers · Gemini 2.5 Flash · React 19 · Firebase · SQLite

**Ports:** Backend `:8001` | Frontend `:3001`

---

## 🏗️ System Architecture

SupportHub unifies two AI agents — TriageAgent and QuizBot — under one containerized platform with a shared Nginx API gateway.

```
                    ┌─────────────────────────┐
                    │     CLIENT BROWSER      |
                    |   http://EC2-IP:8080    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Nginx API Gateway     │
                    │   supporthub-nginx :80  │
                    └──────┬──────────┬───────┘
                           │          │
              /triage/*    │          │    /quiz/*
                    ┌──────▼────┐  ┌──▼──────┐
                    │TriageAgent│  │ QuizBot │
                    │Backend    │  │ Backend │
                    │  :8000    │  │  :8001  │
                    ├───────────┤  ├─────────┤
                    │TriageAgent│  │ QuizBot │
                    │Frontend   │  │Frontend │
                    │  :3000    │  │  :3001  │
                    └────┬──────┘  └────┬────┘
                         │              │
                    ┌────▼──────────────▼────┐
                    │     Firebase Cloud     │
                    │    Auth + Firestore    │
                    └────────────────────────┘
                    
        All containers on: supporthub-network (bridge)
```

---

# 🤖 SupportHub — AI-Powered Microservices Platform for Non-Profit Support Operations

[![CI/CD Pipeline](https://github.com/anushkakashyap31/SupportHub/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/anushkakashyap31/SupportHub/actions)
[![Docker](https://img.shields.io/badge/Docker-5%20Containers-2496ED?logo=docker)](https://hub.docker.com/u/anushkakashyap31)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s-326CE5?logo=kubernetes)](https://k3s.io/)
[![Terraform](https://img.shields.io/badge/Terraform-AWS-7B42BC?logo=terraform)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws)](https://aws.amazon.com/)

---

## Problem Statement

Non-profit organizations face two critical operational challenges:

1. **Communication Overload** — Support teams receive hundreds of donor emails, volunteer requests, and support messages daily. Manual triage is slow, error-prone, and delays urgent responses.
2. **Knowledge Gaps** — Staff members handling donor communications lack sufficient training on non-profit management and fundraising strategies. Traditional training is passive and doesn't measure actual comprehension.

**SupportHub** solves both challenges through two specialized AI microservices deployed on a shared production-grade DevOps infrastructure.

---

## Major Tools

Docker · Kubernetes · Terraform · GitHub Actions · AWS EC2 · Nginx · Python · FastAPI · React · Firebase · Gemini 2.5 Flash · LangChain · ChromaDB

---

## Platform Overview

SupportHub unifies two AI agents — **TriageAgent** and **QuizBot** — under one containerized platform with a shared Nginx API gateway.

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
│              http://EC2-IP:8080                         │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │     NGINX API GATEWAY      │
         │     supporthub-nginx :80   │
         │                            │
         │  /triage/* → TriageAgent   │
         │  /quiz/*   → QuizBot       │
         │  /         → Portal        │
         └────────┬──────────┬────────┘
                  │          │
    ┌─────────────▼───┐  ┌───▼─────────────┐
    │  TRIAGEAGENT    │  │    QUIZBOT       │
    │  :3000 frontend │  │  :3001 frontend  │
    │  :8000 backend  │  │  :8001 backend   │
    │  LangChain +    │  │  ChromaDB + RAG  │
    │  Gemini + spaCy │  │  Gemini + Torch  │
    └────────┬────────┘  └────────┬─────────┘
             └──────────┬─────────┘
                        │
           ┌────────────▼──────────────┐
           │      FIREBASE CLOUD       │
           │   Firestore + Auth        │
           └───────────────────────────┘
```

---

## Architecture & Infrastructure

| Component | Technology | Purpose |
|---|---|---|
| Containerization | Docker + Docker Compose | 5-service container orchestration |
| Kubernetes | K3s (lightweight K8s) | Auto-scaling, self-healing, health probes |
| Infrastructure as Code | Terraform 1.14 | Automated AWS provisioning |
| CI/CD | GitHub Actions | 3-job pipeline: test → build → deploy |
| API Gateway | Nginx | Path-based routing for all services |
| Cloud | AWS EC2 t3.small | Ubuntu 24.04, Mumbai region (ap-south-1) |
| Container Registry | Docker Hub | 5 images pushed on every commit |

---

## 🐳 Docker Architecture

### 5 Containers

| Container | Image | Port | Purpose |
|---|---|---|---|
| supporthub-nginx | supporthub-nginx | 80 | API Gateway |
| triage-backend | supporthub-triage-backend | 8000 | TriageAgent API |
| triage-frontend | supporthub-triage-frontend | 3000 | TriageAgent UI |
| quiz-backend | supporthub-quiz-backend | 8001 | QuizBot API |
| quiz-frontend | supporthub-quiz-frontend | 3001 | QuizBot UI |

### Docker Hub
All images pushed to: `hub.docker.com/u/anushkakashyap31`

```
anushkakashyap31/supporthub-nginx
anushkakashyap31/supporthub-triage-backend
anushkakashyap31/supporthub-triage-frontend
anushkakashyap31/supporthub-quiz-backend
anushkakashyap31/supporthub-quiz-frontend
```

---

## ☸️ Kubernetes Architecture

K3s (lightweight Kubernetes) runs on AWS EC2 with 12 manifest files:

```
k8s/
├── triage-backend-deployment.yml   # TriageAgent backend deployment
├── triage-backend-service.yml      # TriageAgent backend service
├── triage-frontend-deployment.yml  # TriageAgent frontend deployment
├── triage-frontend-service.yml     # TriageAgent frontend service
├── quizbot-backend-deployment.yml  # QuizBot backend deployment
├── quizbot-backend-service.yml     # QuizBot backend service
├── quizbot-frontend-deployment.yml # QuizBot frontend deployment
├── quizbot-frontend-service.yml    # QuizBot frontend service
├── nginx-deployment.yml            # Nginx gateway deployment
├── nginx-service.yml               # Nginx external service (NodePort)
├── ingress.yml                     # Kubernetes ingress rules
└── secrets.yml                     # API keys and secrets (gitignored)
```

### K8s Features Demonstrated
- **Auto-restart** — pods restart automatically on crash
- **Health probes** — liveness checks every 10 seconds
- **Resource limits** — CPU and memory limits per container
- **Horizontal scaling** — scale replicas with one command
- **Self-healing** — K8s recreates deleted pods automatically

---

## 🏗️ Terraform IaC

Terraform provisions the entire AWS infrastructure automatically:

```hcl
Resources created by terraform apply:
├── aws_vpc              → Virtual Private Cloud
├── aws_subnet           → Public subnet (ap-south-1a)
├── aws_internet_gateway → Internet access
├── aws_route_table      → Traffic routing
├── aws_security_group   → Firewall (ports 22,80,8000,8001,3000,3001,30080)
├── aws_key_pair         → SSH access
├── aws_instance         → t3.small EC2 Ubuntu 24.04
└── aws_eip              → Elastic IP (permanent public IP)
```

### Automated Installation
`terraform/scripts/install.sh` automatically installs:
- Docker + Docker Compose
- Terraform
- kubectl
- K3s (Kubernetes)

### IaC Commands
```bash
terraform init    # Initialize AWS provider
terraform plan    # Preview infrastructure
terraform apply   # Create all resources
terraform destroy # Remove all resources
```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

Every push to `main` branch triggers a 3-job GitHub Actions pipeline:

```
Push to main
    ↓
1. Test Job
   → Install Python dependencies
   → Syntax check both backends
    ↓
2. Build and Push Job (main branch only)
   → Build 5 Docker images
   → Push to Docker Hub
    ↓
3. Deploy Job
   → Validate docker-compose config
   → Deploy to server
```

**GitHub Actions file:** `.github/workflows/ci-cd.yml`

---

## 🛠️ Tech Stack

### DevOps
| Tool | Version | Purpose |
|---|---|---|
| Docker | 29.4.0 | Containerization |
| Docker Compose | 5.1.3 | Multi-container orchestration |
| Kubernetes (K3s) | v1.34.6 | Production orchestration |
| Terraform | 1.14.8 | Infrastructure as Code |
| GitHub Actions | — | CI/CD Pipeline |
| Nginx | 1.29.8 | API Gateway |
| AWS EC2 | t3.small | Cloud server |

### AI / ML
| Tool | Purpose |
|---|---|
| Google Gemini 2.5 Flash | LLM for classification + generation |
| LangChain | Multi-agent orchestration |
| spaCy (en_core_web_sm) | Named Entity Recognition |
| ChromaDB | Vector database |
| Sentence Transformers | 384-dim embeddings |

### Backend
| Tool | Purpose |
|---|---|
| Python 3.11 | Language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pydantic V2 | Data validation |
| Firebase Admin SDK | Auth + Firestore |
| SQLite + SQLAlchemy | QuizBot persistence |

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| Tailwind CSS 3.4 | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| Recharts | Analytics charts |

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git
- AWS account (for cloud deployment)

### Local Deployment

```bash
# Clone repository
git clone https://github.com/anushkakashyap31/SupportHub.git
cd SupportHub

# Configure secrets
cp .env.example .env
# Fill in your API keys in .env

# Add Firebase credentials
# Place firebase-credentials.json in:
# TriageAgent/backend/firebase-credentials.json
# QuizBot/backend/firebase-credentials.json

# Build and start all 5 containers
# Start all services
docker compose build
docker compose up -d

# Check status
docker compose ps
```

Access at: `http://localhost`

### Using Makefile shortcuts

```bash
make up       # Start all services
make down     # Stop all services
make build    # Rebuild all images
make logs     # View live logs
make ps       # Check status
make restart  # Restart all services
make clean    # Remove everything
```

---

## ☁️ AWS Deployment

### Using Terraform (IaC)

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/supporthub-key

# Configure AWS credentials
aws configure

# Deploy infrastructure
cd terraform
terraform init
terraform plan
terraform apply
```

### Manual EC2 Setup

```bash
# SSH into server
ssh -i supporthub-key.pem ubuntu@YOUR-EC2-IP

# Clone and deploy
git clone https://github.com/anushkakashyap31/SupportHub.git
cd SupportHub
sudo bash terraform/scripts/install.sh
nano .env  # add your keys
docker compose up -d
```

---

## ☸️ Kubernetes Deployment

```bash
# Install K3s
curl -sfL https://get.k3s.io | sh -

# Apply manifests
sudo k3s kubectl apply -f k8s/secrets.yml
sudo k3s kubectl apply -f k8s/

# Check pods
sudo k3s kubectl get pods
sudo k3s kubectl get services

# Scale deployment
sudo k3s kubectl scale deployment triage-backend --replicas=3

# Watch scaling live
sudo k3s kubectl get pods --watch
```

---

## 📁 Project Structure

```
SupportHub/
├── docker-compose.yml              # Multi-container orchestration
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── Makefile                        # Shortcut commands
├── README.md                       # This file
│
├── TriageAgent/                    # AI triage microservice
│   ├── backend/                    # FastAPI + LangChain + Gemini
│   │   ├── app/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── frontend/                   # React 19 + Vite + Tailwind
│       ├── src/
│       ├── package.json
│       └── Dockerfile
│
├── QuizBot/                        # AI quiz microservice
│   ├── backend/                    # FastAPI + ChromaDB + Gemini
│   │   ├── app/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── frontend/                   # React 19 + Vite + Tailwind
│       ├── src/
│       ├── package.json
│       └── Dockerfile
│
├── nginx/                          # API Gateway
│   ├── nginx.conf
│   └── Dockerfile
│
├── portal/                         # SupportHub landing page
│   └── index.html
│
├── terraform/                      # Infrastructure as Code
│   ├── main.tf                     # AWS resources
│   ├── variables.tf                # Input variables
│   ├── outputs.tf                  # Output values
│   └── scripts/
│       ├── install.sh              # Automated dependency installer
│       └── deploy.sh               # Automated deployment
│
├── k8s/                            # Kubernetes manifests
│   ├── *-deployment.yml            # 5 deployment files
│   ├── *-service.yml               # 5 service files
│   ├── nginx-service.yml           # NodePort service
│   └── ingress.yml                 # Ingress rules
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions pipeline
│
└── docs/
    ├── ARCHITECTURE.md             # System design
    ├── DEPLOYMENT.md               # Deployment guide
    └── USER_GUIDE.md               # Usage instructions
```

---

## 🔒 Security

- JWT-based authentication for all API endpoints
- Firebase Authentication for user management
- Secrets managed via environment variables (never hardcoded)
- Firebase credentials mounted as read-only volumes
- CORS configured for authorized domains only
- Rate limiting middleware on all endpoints
- Security group firewall rules on AWS

---
