# SupportHub — Deployment Guide

**DO-15 | Group 03D2 | Medicaps University × Datagami | April 2026**

---

## Deployment Options

| Option | Environment | Command |
|---|---|---|
| Local Docker | Development/Demo | `docker compose up -d` |
| AWS EC2 (Manual) | Cloud Production | SSH + docker compose |
| AWS EC2 (Terraform) | Cloud IaC | `terraform apply` |
| Kubernetes (Local) | Demo | kubectl via Docker Desktop |
| Kubernetes (K3s) | Cloud Production | K3s on EC2 |

---

## Option 1 — Local Docker Deployment

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/anushkakashyap31/SupportHub.git
cd SupportHub

# 2. Create environment file
cp .env.example .env
```

Edit `.env` with your actual keys:
```env
TRIAGE_GEMINI_API_KEY=your_gemini_api_key
TRIAGE_JWT_SECRET=your_jwt_secret_here
TRIAGE_FRONTEND_URL=http://localhost

QUIZ_GEMINI_API_KEY=your_gemini_api_key
QUIZ_JWT_SECRET=your_jwt_secret_here
QUIZ_FRONTEND_URL=http://localhost
```

```bash
# 3. Add Firebase credentials
# Place files at:
# TriageAgent/backend/firebase-credentials.json
# QuizBot/backend/firebase-credentials.json

# 4. Build all images
docker compose build

# 5. Start all containers
docker compose up -d

# 6. Verify
docker compose ps
```

### Access URLs (Local)

| URL | Service |
|---|---|
| `http://localhost` | SupportHub Portal |
| `http://localhost/triage/` | TriageAgent |
| `http://localhost/quiz/` | QuizBot |
| `http://localhost:8000/docs` | TriageAgent API Docs |
| `http://localhost:8001/docs` | QuizBot API Docs |

### Useful Commands

```bash
# View logs
docker compose logs -f
docker compose logs triage-backend --tail=30

# Rebuild specific service
docker compose build quiz-backend --no-cache

# Restart a service
docker compose restart nginx

# Stop everything
docker compose down

# Remove everything including volumes
docker compose down -v --rmi all
```

---

## Option 2 — AWS EC2 Manual Deployment

### Prerequisites

- AWS Account (free tier eligible)
- `.pem` key file downloaded when creating EC2

### Step 1 — Launch EC2 Instance

In AWS Console → EC2 → Launch Instance:

| Setting | Value |
|---|---|
| Name | SupportHub-Server |
| OS | Ubuntu 24.04 LTS |
| Instance type | t3.small (2 GiB RAM) |
| Key pair | Create new → supporthub-key → download .pem |
| Storage | 20 GB gp2 |

**Security Group inbound rules:**

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | 0.0.0.0/0 | SSH access |
| 80 | TCP | 0.0.0.0/0 | HTTP / Nginx |
| 8080 | TCP | 0.0.0.0/0 | Alternative HTTP |
| 8000 | TCP | 0.0.0.0/0 | TriageAgent API |
| 8001 | TCP | 0.0.0.0/0 | QuizBot API |
| 3000 | TCP | 0.0.0.0/0 | TriageAgent frontend |
| 3001 | TCP | 0.0.0.0/0 | QuizBot frontend |
| 30080 | TCP | 0.0.0.0/0 | Kubernetes NodePort |

### Step 2 — Connect to EC2

```powershell
# Windows PowerShell — fix key permissions
icacls "C:\path\to\supporthub-key.pem" /inheritance:r /grant:r "$($env:USERNAME):(R)"

# SSH into server
ssh -i "C:\path\to\supporthub-key.pem" ubuntu@YOUR-EC2-PUBLIC-IP
```

### Step 3 — Install Dependencies on EC2

```bash
# Update system
sudo apt-get update -y
sudo apt-get install -y git curl

# Clone repo
git clone https://github.com/anushkakashyap31/SupportHub.git
cd SupportHub

# Run automated installer (Docker + Terraform + kubectl)
chmod +x terraform/scripts/install.sh
sudo bash terraform/scripts/install.sh

# Verify Docker
docker --version
docker compose version
```

### Step 4 — Configure Secrets on EC2

```bash
cd ~/SupportHub

# Create .env file
nano .env
```

Paste with your actual keys:
```env
TRIAGE_GEMINI_API_KEY=your_actual_key
TRIAGE_JWT_SECRET=your_actual_jwt_secret
TRIAGE_FRONTEND_URL=http://YOUR-EC2-PUBLIC-IP

QUIZ_GEMINI_API_KEY=your_actual_key
QUIZ_JWT_SECRET=your_actual_jwt_secret
QUIZ_FRONTEND_URL=http://YOUR-EC2-PUBLIC-IP
```

Save: `Ctrl+X` → `Y` → `Enter`

Also update backend and frontend `.env` files on EC2:

```bash
# TriageAgent backend
nano TriageAgent/backend/.env
# Set FRONTEND_URL=http://YOUR-EC2-PUBLIC-IP

# QuizBot backend
nano QuizBot/backend/.env
# Set FRONTEND_URL=http://YOUR-EC2-PUBLIC-IP

# TriageAgent frontend
nano TriageAgent/frontend/.env
# Set VITE_API_URL=http://YOUR-EC2-PUBLIC-IP:8000
# Set VITE_API_BASE_URL=http://YOUR-EC2-PUBLIC-IP:8000

# QuizBot frontend
nano QuizBot/frontend/.env
# Set VITE_API_URL=http://YOUR-EC2-PUBLIC-IP:8001
# Set VITE_API_BASE_URL=http://YOUR-EC2-PUBLIC-IP:8001
```

### Step 5 — Upload Firebase Credentials

From your **laptop** (new PowerShell window):

```powershell
# Upload TriageAgent credentials
scp -i "C:\path\to\supporthub-key.pem" "D:\path\to\TriageAgent\backend\firebase-credentials.json" ubuntu@YOUR-EC2-IP:~/SupportHub/TriageAgent/backend/

# Upload QuizBot credentials
scp -i "C:\path\to\supporthub-key.pem" "D:\path\to\QuizBot\backend\firebase-credentials.json" ubuntu@YOUR-EC2-IP:~/SupportHub/QuizBot/backend/
```

### Step 6 — Build and Deploy

Back on EC2:

```bash
cd ~/SupportHub

# Build all images (takes 15–25 minutes first time)
sudo docker compose build

# Start all containers
sudo docker compose up -d

# Verify
sudo docker compose ps
```

### Step 7 — Add Firebase Authorized Domain

- Go to Firebase Console → TriageAgent project → Authentication → Settings → Authorized domains
- Click **Add domain** → enter `YOUR-EC2-PUBLIC-IP` (no http://)
- Repeat for QuizBot Firebase project

### Access URLs (AWS)

| URL | Service |
|---|---|
| `http://EC2-IP:8080` | SupportHub Portal |
| `http://EC2-IP:8080/triage/` | TriageAgent |
| `http://EC2-IP:8080/quiz/` | QuizBot |
| `http://EC2-IP:8000/docs` | TriageAgent API |
| `http://EC2-IP:8001/docs` | QuizBot API |

---

## Option 3 — Terraform IaC Deployment

### Prerequisites

- AWS CLI installed
- AWS IAM Access Key and Secret Key
- Terraform installed

### Step 1 — Setup on Your Laptop

```powershell
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\supporthub-key"
# Press Enter twice (no passphrase)

# Install AWS CLI
winget install -e --id Amazon.AWSCLI

# Configure AWS credentials
aws configure
# AWS Access Key ID: (from IAM → Security credentials)
# AWS Secret Access Key: (same place)
# Default region: ap-south-1
# Default output format: json

# Verify connection
aws sts get-caller-identity
```

### Step 2 — Run Terraform

```powershell
cd "D:\path\to\SupportHub\terraform"

# Initialize AWS provider
terraform init

# Preview resources to be created
terraform plan

# Create everything on AWS (type "yes" when prompted)
terraform apply
```

After 3–5 minutes you'll see:
```
server_public_ip = "13.xxx.xxx.xxx"
supporthub_url   = "http://13.xxx.xxx.xxx"
kubernetes_url   = "http://13.xxx.xxx.xxx:30080"
ssh_command      = "ssh -i ~/.ssh/supporthub-key ubuntu@13.xxx.xxx.xxx"
```

### Step 3 — Verify Server Setup

```bash
# SSH into the newly created EC2
ssh -i ~/.ssh/supporthub-key ubuntu@YOUR-EC2-IP

# Check if repo was auto-cloned
ls ~/SupportHub

# If not, clone manually
git clone https://github.com/anushkakashyap31/SupportHub.git
cd SupportHub
sudo bash terraform/scripts/install.sh
```

Then follow Steps 4–7 from Option 2 above.

### Terraform Resources Created

| Resource | Type | Description |
|---|---|---|
| SupportHub-vpc | aws_vpc | Isolated network (10.0.0.0/16) |
| SupportHub-igw | aws_internet_gateway | Internet access |
| SupportHub-subnet | aws_subnet | Public subnet (ap-south-1a) |
| SupportHub-rt | aws_route_table | Routes traffic to IGW |
| SupportHub-sg | aws_security_group | Firewall rules |
| SupportHub-key | aws_key_pair | SSH access |
| SupportHub-server | aws_instance | EC2 t3.small Ubuntu |
| SupportHub-eip | aws_eip | Permanent public IP |

### Destroy After Use

```powershell
cd "D:\path\to\SupportHub\terraform"
terraform destroy
# Type "yes" — deletes all AWS resources, stops billing
```

---

## Option 4 — Kubernetes Deployment (K3s on EC2)

### Step 1 — Install K3s on EC2

```bash
# Install lightweight Kubernetes
curl -sfL https://get.k3s.io | sh -

# Wait for startup
sleep 30

# Verify node is ready
sudo k3s kubectl get nodes
# Expected: STATUS = Ready
```

### Step 2 — Deploy SupportHub on Kubernetes

```bash
cd ~/SupportHub

# Apply secrets first
sudo k3s kubectl apply -f k8s/secrets.yml

# Deploy all manifests
sudo k3s kubectl apply -f k8s/

# Verify pods
sudo k3s kubectl get pods
sudo k3s kubectl get services
```

Expected output:
```
NAME                               READY   STATUS    RESTARTS
nginx-xxx                          1/1     Running   0
triage-frontend-xxx                1/1     Running   0
quiz-frontend-xxx                  1/1     Running   0
triage-backend-xxx                 1/1     Running   0
quiz-backend-xxx                   1/1     Running   0
```

### Step 3 — Access via Kubernetes

SupportHub is accessible at: `http://EC2-IP:30080`

### Kubernetes Demo Commands

```bash
# Show all pods
sudo k3s kubectl get pods

# Show all services
sudo k3s kubectl get services

# Scale TriageAgent to 3 instances (live demo)
sudo k3s kubectl scale deployment triage-backend --replicas=3
sudo k3s kubectl get pods --watch

# Show self-healing — delete a pod, K8s restarts it
sudo k3s kubectl delete pod <pod-name>
sudo k3s kubectl get pods --watch

# Rollback to previous version
sudo k3s kubectl rollout undo deployment/triage-backend

# View deployment history
sudo k3s kubectl rollout history deployment/triage-backend

# Scale back down
sudo k3s kubectl scale deployment triage-backend --replicas=1
```

### K3s Service Management

```bash
# Stop K3s (frees RAM for Docker Compose)
sudo systemctl stop k3s
sudo k3s-killall.sh

# Start K3s again
sudo systemctl start k3s

# Enable K3s auto-start on reboot
sudo systemctl enable k3s

# Disable K3s auto-start
sudo systemctl disable k3s
```

> **Note:** Running Docker Compose and K3s simultaneously on t3.small (2 GiB RAM) may cause memory pressure. Stop Docker Compose before running K8s demo, or vice versa.

---

## CI/CD Pipeline

The GitHub Actions pipeline runs automatically on every push to `main`:

```yaml
# .github/workflows/ci-cd.yml
# 3 jobs: test → build-and-push → deploy
```

### Secrets Required in GitHub

Go to Repository → Settings → Secrets → Actions → New repository secret:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |

### Pipeline Status

- **Run Tests** — Python syntax check via `py_compile`
- **Build and Push Docker Images** — Builds 5 images, pushes to Docker Hub
- **Deploy to Server** — Validates `docker compose config`

---

## Environment Variables Reference

### Root `.env` (docker-compose)

```env
# TriageAgent
TRIAGE_GEMINI_API_KEY=       # Google Gemini API Key
TRIAGE_JWT_SECRET=           # Random secret string (32+ chars)
TRIAGE_FRONTEND_URL=         # http://localhost or http://EC2-IP

# QuizBot
QUIZ_GEMINI_API_KEY=         # Google Gemini API Key
QUIZ_JWT_SECRET=             # Random secret string (32+ chars)
QUIZ_FRONTEND_URL=           # http://localhost or http://EC2-IP
```

### TriageAgent Backend `.env`

```env
APP_NAME=TriageAgent
DEBUG=True
HOST=0.0.0.0
PORT=8000
GEMINI_API_KEY=              # Your Gemini API key
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
SECRET_KEY=                  # JWT secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=                # http://localhost:3000 or EC2-IP
```

### QuizBot Backend `.env`

```env
APP_NAME=QuizBot
DEBUG=True
HOST=0.0.0.0
PORT=8001
GEMINI_API_KEY=              # Your Gemini API key
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
FIREBASE_DATABASE_URL=       # https://your-project.firebaseio.com
VECTOR_DB_TYPE=chromadb
VECTOR_DB_PATH=./data/vector_store
SECRET_KEY=                  # JWT secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=                # http://localhost:3001 or EC2-IP
```

### Frontend `.env` Files

```env
# TriageAgent/frontend/.env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# QuizBot/frontend/.env
VITE_API_URL=http://localhost:8001
VITE_API_BASE_URL=http://localhost:8001
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Troubleshooting

### Container not starting

```bash
# Check logs
docker compose logs <service-name> --tail=50

# Common fixes
docker compose down
docker builder prune -f
docker compose build <service-name> --no-cache
docker compose up -d
```

### quiz-backend CrashLoopBackOff (torch/transformers)

The quiz-backend requires pinned versions. Ensure `requirements.txt` has:
```
torch==2.1.0+cpu
torchvision==0.16.0+cpu
transformers==4.41.0
sentence-transformers==2.2.2
```

### Nginx 404 on /triage/ or /quiz/

K3s ingress may be intercepting port 80. Stop K3s:
```bash
sudo k3s-killall.sh
sudo systemctl stop k3s
sudo docker compose restart nginx
```

### SSH connection refused

Check security group allows port 22 from `0.0.0.0/0` in AWS Console.

### Site not loading on browser but curl works

Port 80 may be blocked by your network. Use port 8080 instead:
```yaml
# docker-compose.yml nginx section
ports:
  - "8080:80"
```

Then access via `http://EC2-IP:8080`.

### Build timeout (pip install)

EC2 has fast internet. If local builds timeout:
```dockerfile
ENV PIP_DEFAULT_TIMEOUT=300
```

---

*SupportHub Deployment Guide — Group 03D2 — DO-15 — April 2026*