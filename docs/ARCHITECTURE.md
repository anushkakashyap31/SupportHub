# SupportHub — System Architecture

**DO-15 | Group 03D2 | Medicaps University × Datagami | April 2026**

---

## Overview

SupportHub is a production-grade microservices platform built on a 5-container Docker architecture, orchestrated with Kubernetes, provisioned with Terraform on AWS EC2, and deployed through a GitHub Actions CI/CD pipeline.

All external traffic enters through a single **Nginx API gateway** on port 80, which routes requests to the appropriate microservice based on URL path prefix.

---

## System Architecture Diagram

```
                     ┌─────────────────────────┐
                     │      CLIENT BROWSER     │
                     │    http://EC2-IP:8080   │
                     └───────────┬─────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    NGINX API GATEWAY    │
                    │   supporthub-nginx :80  │
                    │                         │
                    │  /triage/* → triage     │
                    │  /quiz/*   → quiz       │
                    │  /         → portal     │
                    └────┬─────────────────┬──┘
                         │                 │
          ┌──────────────▼─────┐  ┌────────▼─────────────┐
          │   TRIAGEAGENT      │  │     QUIZBOT          │
          │   MICROSERVICE     │  │     MICROSERVICE     │
          │                    │  │                      │
          │ triage-frontend    │  │  quiz-frontend       │
          │    :3000           │  │     :3001            │
          │                    │  │                      │
          │ triage-backend     │  │  quiz-backend        │
          │    :8000           │  │     :8001            │
          │ FastAPI+LangChain  │  │  FastAPI+ChromaDB    │
          │ Gemini 2.5 Flash   │  │  Sentence Transform. │
          │ spaCy NER          │  │  RAG Pipeline        │
          └────────┬───────────┘  └───────────┬──────────┘
                   └──────────┬───────────────┘
                              │
                 ┌────────────▼────────────┐
                 │     FIREBASE CLOUD      │
                 │  Firestore + Auth       │
                 └─────────────────────────┘

  All containers connected via: supporthub-network (Docker bridge)
```

---

## Container Architecture

SupportHub consists of exactly **5 Docker containers** running in a shared Docker bridge network (`supporthub-network`):

| Container | Image | Port | Technology |
|---|---|---|---|
| `supporthub-nginx` | nginx:alpine | 80 | Nginx API Gateway |
| `triage-backend` | python:3.11-slim | 8000 | FastAPI + LangChain + spaCy |
| `triage-frontend` | node:20-alpine | 3000 | React 19 + Vite 7 |
| `quiz-backend` | python:3.11-slim | 8001 | FastAPI + ChromaDB + PyTorch |
| `quiz-frontend` | node:20-alpine | 3001 | React 19 + Vite 7 |

Internal communication between containers uses Docker DNS (e.g., `triage-backend:8000`) — no external ports exposed for inter-service communication.

---

## Nginx Routing Rules

```nginx
# /triage/api/* → TriageAgent backend
location /triage/api/ {
    rewrite ^/triage/api/(.*) /api/$1 break;
    proxy_pass http://triage_backend:8000;
}

# /triage/* → TriageAgent frontend
location /triage/ {
    rewrite ^/triage/(.*) /$1 break;
    proxy_pass http://triage_frontend:3000;
}

# /quiz/api/* → QuizBot backend
location /quiz/api/ {
    rewrite ^/quiz/api/(.*) /api/$1 break;
    proxy_pass http://quiz_backend:8001;
}

# /quiz/* → QuizBot frontend
location /quiz/ {
    rewrite ^/quiz/(.*) /$1 break;
    proxy_pass http://quiz_frontend:3001;
}

# / → SupportHub portal
location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

---

## TriageAgent Architecture

### Processing Pipeline

```
  INPUT: Donor email / support message
         │
         ▼
  ┌──────────────────┐
  │  Stage 1         │  LangChain Agent
  │  Classification  │  Gemini 2.5 Flash
  │  Agent           │  → urgency: CRITICAL/HIGH/NORMAL/LOW
  └──────┬───────────┘  → intent: DONATION/VOLUNTEER/COMPLAINT/etc.
         │
         ▼
  ┌──────────────────┐
  │  Stage 2         │  spaCy NER Agent
  │  Named Entity    │  en_core_web_sm model
  │  Recognition     │  → persons, organizations, dates, amounts
  └──────┬───────────┘
         │
         ▼
  ┌──────────────────┐
  │  Stage 3         │  Gemini 2.5 Flash
  │  Response        │  Context-aware draft
  │  Generation      │  → professional reply draft
  └──────┬───────────┘
         │
         ▼
  ┌──────────────────┐
  │  Stage 4         │  Routing Logic
  │  Department      │  → DONOR_RELATIONS / VOLUNTEER / FINANCE
  │  Routing         │
  └──────┬───────────┘
         │
         ▼
  OUTPUT: Structured triage result
  Triage ID: TRG-{YYYYMMDDHHMMSS}-{uuid8}
  Stored in Firebase Firestore
```

### API Routes (16 endpoints)

| Module | Prefix | Endpoints |
|---|---|---|
| Triage | `/api/triage` | process, queue, update status, feedback, stats |
| Messages | `/api/messages` | list, get, update status, delete |
| Analytics | `/api/analytics` | stats, dashboard, urgency, intent, performance, trending |
| Auth | `/api/auth` | register, login, me, logout |

---

## QuizBot Architecture

### RAG Pipeline

```
  INPUT: Donor email content
         │
         ▼
  ┌─────────────────────────┐
  │  1. Text Parsing        │
  │  Extract sentences and  │
  │  meaningful chunks      │
  └──────────┬──────────────┘
             │
             ▼
  ┌─────────────────────────┐
  │  2. Embedding Generation│
  │  Sentence Transformers  │
  │  all-MiniLM-L6-v2       │
  │  → 384-dimensional vec. │
  └──────────┬──────────────┘
             │
             ▼
  ┌─────────────────────────┐
  │  3. ChromaDB Storage    │
  │  Store embeddings +     │
  │  text chunks            │
  │  Cosine similarity      │
  │  search for context     │
  └──────────┬──────────────┘
             │
             ▼
  ┌─────────────────────────┐
  │  4. Quiz Generation     │
  │  Gemini 2.5 Flash       │
  │  Retrieved context →    │
  │  3–10 MCQ questions     │
  │  with 4 options each    │
  └──────────┬──────────────┘
             │
             ▼
  ┌─────────────────────────┐
  │  5. Answer Evaluation   │
  │  Gemini 2.5 Flash       │
  │  → score, explanations  │
  │  → progress tracking    │
  └──────────┬──────────────┘
             │
             ▼
  OUTPUT: Quiz results + explanations
  Stored in SQLite + Firebase
```

### Data Storage (QuizBot)

| Store | Technology | Data |
|---|---|---|
| Vector DB | ChromaDB 0.4.18 | 384-dim email embeddings |
| Relational | SQLite + SQLAlchemy | Quiz history, questions, results |
| Auth | Firebase Auth | User accounts and sessions |
| Real-time | Firebase Firestore | Progress and analytics |

---

## DevOps Architecture

### CI/CD Pipeline

```
git push main
     │
     ▼
┌──────────────┐   PASS   ┌─────────────────┐   PASS   ┌──────────────┐
│ Job 1        ├─────────►│ Job 2           ├─────────►│ Job 3        │
│ Run Tests    │          │ Build & Push    │          │ Deploy       │
│              │          │ Docker Images   │          │              │
│ py_compile   │          │ 5 images to     │          │ docker       │
│ syntax check │          │ Docker Hub      │          │ compose      │
│ ~1m 12s      │          │ ~5m 28s         │          │ config check │
└──────────────┘          └─────────────────┘          └──────────────┘
```

### Terraform Infrastructure

```
terraform apply
     │
     ▼ Creates 8 AWS resources:
     │
     ├── aws_vpc               (10.0.0.0/16)
     ├── aws_internet_gateway
     ├── aws_subnet            (10.0.1.0/24, ap-south-1a)
     ├── aws_route_table       (0.0.0.0/0 → IGW)
     ├── aws_security_group    (ports: 22, 80, 8000, 8001, 3000, 3001)
     ├── aws_key_pair          (SSH access)
     ├── aws_instance          (t3.small, Ubuntu 24.04)
     └── aws_eip               (permanent public IP)
          │
          └── user_data auto-runs:
              - git clone github.com/anushkakashyap31/SupportHub
              - bash terraform/scripts/install.sh
              (installs Docker, Terraform, kubectl)
```

### Kubernetes Architecture (K3s on EC2)

```
K3s Cluster (AWS EC2 t3.small)
│
├── Deployments (5)
│   ├── nginx-deployment           (replicas: 1)
│   ├── triage-backend-deployment  (replicas: 1, scalable)
│   ├── triage-frontend-deployment (replicas: 1)
│   ├── quiz-backend-deployment    (replicas: 1, scalable)
│   └── quiz-frontend-deployment   (replicas: 1)
│
├── Services (5)
│   ├── nginx-external   (NodePort  80:30080)
│   ├── triage-backend   (ClusterIP :8000)
│   ├── triage-frontend  (ClusterIP :3000)
│   ├── quiz-backend     (ClusterIP :8001)
│   └── quiz-frontend    (ClusterIP :3001)
│
├── Ingress
│   └── supporthub-ingress
│
└── Secrets
    ├── triage-secrets  (gemini-api-key, jwt-secret, frontend-url)
    └── quiz-secrets    (gemini-api-key, jwt-secret, firebase-database-url)
```

---

## Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
Firebase Auth (email + password)
    │
    ▼
Firebase ID Token issued
    │
    ▼
POST /api/auth/login (ID token sent to backend)
    │
    ▼
Backend verifies ID token with Firebase Admin SDK
    │
    ▼
Backend issues short-lived JWT (30 min expiry)
    │
    ▼
Frontend stores JWT in localStorage
    │
    ▼
All API requests include: Authorization: Bearer <JWT>
    │
    ▼
Backend verifies JWT on every protected endpoint
```

### Security Layers

| Layer | Mechanism |
|---|---|
| User Auth | Firebase Authentication (email/password) |
| API Access | JWT tokens via python-jose |
| Password Storage | Firebase-managed (bcrypt) |
| Secrets | `.env` files — gitignored |
| CI/CD Secrets | GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN) |
| Network | AWS Security Group — only required ports open |
| SSH | Key-pair only (supporthub-key.pem) |
| Firebase | Credentials file gitignored, never in Docker Hub |

---

## Data Flow

### TriageAgent Message Flow

```
Staff Member → POST /api/triage/process
                    │
                    ▼
            FastAPI receives message
                    │
                    ▼
            LangChain 4-stage pipeline
            (Classification → NER → Response → Routing)
                    │
                    ▼
            Result stored in Firebase Firestore
            ID: TRG-{YYYYMMDDHHMMSS}-{uuid8}
                    │
                    ▼
            Dashboard updates in real-time
            (Firebase listener on frontend)
```

### QuizBot Generation Flow

```
Staff Member → POST /api/quiz/generate
               {email_content, num_questions: 5}
                    │
                    ▼
            Text parsed → Embeddings generated (384-dim)
                    │
                    ▼
            ChromaDB stores vectors
            Similarity search retrieves context
                    │
                    ▼
            Gemini generates MCQs with context
                    │
                    ▼
            Quiz stored in SQLite
                    │
                    ▼
            Staff submits answers → POST /api/quiz/evaluate
                    │
                    ▼
            Gemini evaluates → explanations generated
            Progress stored → Firebase + SQLite
```

---

## Performance Targets

| Metric | Target |
|---|---|
| Triage end-to-end | 5–10 seconds |
| Quiz generation | 5–10 seconds |
| ChromaDB vector search | < 50ms |
| Frontend initial load | < 2 seconds |
| API authentication | < 500ms |
| Concurrent users | 50+ |

---

*SupportHub Architecture Document — Group 03D2 — DO-15 — April 2026*