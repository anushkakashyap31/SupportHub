# SupportHub — User Guide

**DO-15 | Group 03D2 | Medicaps University × Datagami | April 2026**

---

## Overview

SupportHub is an AI-powered platform for non-profit organizations with two applications:

| Application | What it does |
|---|---|
| **TriageAgent** | Automatically classifies and processes support messages using AI |
| **QuizBot** | Generates AI-powered quizzes from donor emails to train your staff |

**Live Platform:** `http://13.206.119.123:8080`

---

## Getting Started

### Access the Platform

1. Open your browser and go to `http://13.206.119.123:8080` (or `http://localhost` if running locally)
2. You'll see the **SupportHub landing page** with two options
3. Click **Launch TriageAgent** or **Launch QuizBot** to begin

---

## TriageAgent — User Guide

**URL:** `http://localhost/triage/` or `http://EC2-IP:8080/triage/`

### What TriageAgent Does

TriageAgent processes incoming non-profit support messages through a 4-stage AI pipeline:

1. **Classifies** the message urgency (Critical / High / Normal / Low) and intent (Donation / Volunteer / Complaint / Question / etc.)
2. **Extracts** named entities — people, organizations, dates, dollar amounts
3. **Generates** a professional draft response
4. **Routes** the message to the correct department

---

### Step 1 — Create an Account

1. Click **Register** on the TriageAgent landing page
2. Enter your **full name**, **email address**, and **password**
3. Click **Create Account**
4. You'll be redirected to the dashboard

### Step 2 — Login

1. Click **Sign In**
2. Enter your **email** and **password**
3. Click **Login**

---

### Step 3 — Process a Support Message

1. From the dashboard, click **New Triage** or go to the Triage section
2. Paste the incoming message into the text area

**Example message:**
```
Dear Team,

My name is Rajesh Mehta from the Pratham Foundation. 
We would like to make a donation of ₹50,000 to your 
digital literacy program. Could you please send us 
the bank account details and the tax exemption 
certificate?

Best regards,
Rajesh Mehta
+91-9876543210
```

3. Click **Process Message**
4. Wait 5–10 seconds for the AI pipeline to complete

---

### Step 4 — Review Triage Results

After processing, you'll see:

| Field | Description |
|---|---|
| **Triage ID** | Unique ID like `TRG-20260420143022-a3b4c5d6` |
| **Urgency** | CRITICAL / HIGH / NORMAL / LOW |
| **Intent** | DONATION / VOLUNTEER / QUESTION / etc. |
| **Named Entities** | People, organizations, amounts extracted |
| **Department** | DONOR_RELATIONS / FINANCE / VOLUNTEER / etc. |
| **Draft Response** | AI-generated professional reply |

### Step 5 — Manage Messages

- **Approve draft** — Send the AI-generated response
- **Edit response** — Modify before sending
- **Update status** — Mark as Pending / Resolved / Archived
- **View history** — See all past messages in the Messages section

---

### Dashboard Features

- **Total Messages** — Count of all processed messages
- **Urgency Breakdown** — Chart of Critical/High/Normal/Low
- **Intent Distribution** — Pie chart of message categories
- **Recent Activity** — Latest triage results
- **Performance Metrics** — Average processing time, accuracy stats

---

### TriageAgent API (for developers)

Interactive API documentation: `http://localhost:8000/docs`

**Key endpoints:**

```
POST /api/triage/process    — Process a new message
GET  /api/triage/queue      — View pending queue
GET  /api/messages          — List all messages
GET  /api/analytics/stats   — View platform statistics
POST /api/auth/register     — Create account
POST /api/auth/login        — Get JWT token
```

---

## QuizBot — User Guide

**URL:** `http://localhost/quiz/` or `http://EC2-IP:8080/quiz/`

### What QuizBot Does

QuizBot generates context-aware multiple-choice quizzes from real donor emails to train non-profit staff on donor relations, fundraising, and non-profit management.

How it works:
1. You paste a donor email
2. QuizBot creates 384-dimensional vector embeddings using Sentence Transformers
3. ChromaDB stores the embeddings for semantic search
4. Gemini 2.5 Flash generates relevant MCQ questions
5. You take the quiz and get detailed explanations

---

### Step 1 — Create an Account

1. Click **Get Started Free** on the QuizBot landing page
2. Enter your **full name**, **email**, and **password**
3. Click **Register**
4. You'll be taken to your dashboard

### Step 2 — Login

1. Click **Sign In**
2. Enter your credentials
3. You'll land on your dashboard showing your progress

---

### Step 3 — Generate a Quiz

1. Click **New Quiz** from the dashboard or navigate to **Generate**
2. Paste a donor email into the **Donor Email Content** field

**Example donor email:**
```
Dear Ms. Patel,

We are thrilled to acknowledge your generous donation of 50 
laptops to our digital literacy program. These devices will 
directly benefit 150 rural students who previously had no 
access to computers.

Our foundation has been bridging the digital divide for 8 
years across 12 villages in the region. Your contribution is 
valued at $15,000 and is fully tax-deductible under our 
501(c)(3) status.

A formal donation receipt will be emailed to you within 3 
business days. We would love to invite you to our annual 
tech fair on June 15th.

Warm regards,
The Foundation Team
```

3. Select the **Number of Questions** (3–10, recommended: 5)
4. Click **Generate Quiz**
5. Wait 5–10 seconds for AI to create your quiz

---

### Step 4 — Take the Quiz

1. Read each question carefully
2. Select one answer from the 4 options (A, B, C, D)
3. Navigate through all questions using Next/Previous
4. Click **Submit Quiz** when done

**Example question generated from the email above:**
```
Q: What type of donation did Ms. Patel make to the foundation?

A) Cash donation of $15,000
B) 50 laptops for digital literacy program  ✓
C) Sponsorship of annual tech fair
D) Monthly recurring donation
```

---

### Step 5 — Review Your Results

After submission you'll see:

- **Your Score** — e.g., 4/5 (80%)
- **Correct/Incorrect** for each question
- **AI Explanation** — Detailed explanation for every question
- **AI Summary** — Overall performance summary

**Example explanation:**
```
Question 2 — CORRECT ✓
The email clearly states "your generous donation of 50 laptops 
to our digital literacy program." In-kind donations (non-cash 
items) are common in non-profit fundraising and still qualify 
for tax deduction at fair market value.
```

---

### Step 6 — Track Your Progress

Navigate to **My Progress** to see:

- **Total quizzes taken**
- **Average score trend** (line chart)
- **Best score** and **recent score**
- **Score distribution** over time

Navigate to **Quiz History** to see:

- All past quizzes with dates
- Score for each quiz
- Ability to review any past quiz

---

### Dashboard Overview

| Section | Description |
|---|---|
| Welcome Header | Your name and quick stats |
| New Quiz | Start a fresh quiz |
| Quiz History | View past quizzes |
| My Progress | Analytics and trends |
| Performance Overview | Charts of your scores |
| Recent Quizzes | Last 5 quiz results |

---

### QuizBot API (for developers)

Interactive API documentation: `http://localhost:8001/docs`

**Key endpoints:**

```
POST /api/quiz/generate      — Generate quiz from email
POST /api/quiz/evaluate      — Submit answers for evaluation
GET  /api/analytics/history  — Past quiz records
GET  /api/analytics/progress — Progress trends
GET  /api/analytics/stats    — User statistics
POST /api/auth/login         — Authenticate user
```

---

## Tips for Best Results

### TriageAgent

- **Longer messages** give better classification results
- Include **contact details** in messages for better NER extraction
- Messages with **specific amounts** (donations) get more accurate intents
- The draft response works best when the message has a clear ask

### QuizBot

- **Longer donor emails** (200+ words) produce better questions
- Emails with **specific facts** (numbers, dates, names) make the most interesting questions
- Use **5 questions** for a balanced quiz session
- Re-take quizzes on the same topic to reinforce learning
- Check the **AI explanations** even on correct answers — they add context

---

## Frequently Asked Questions

**Q: How long does triage processing take?**
A: Typically 5–10 seconds for a complete analysis through all 4 AI stages.

**Q: How many questions can QuizBot generate?**
A: Between 3 and 10 questions per quiz. 5 is recommended for a focused session.

**Q: Is my data stored securely?**
A: Yes. All authentication is handled by Firebase, passwords are never stored in plain text, and API access requires JWT tokens.

**Q: Can I retake the same quiz?**
A: You can generate a new quiz from the same email — the AI may generate different questions each time based on vector similarity search.

**Q: What types of messages work best with TriageAgent?**
A: Emails, support tickets, volunteer inquiries, donor communications, and complaint messages all work well.

**Q: Why is my login not working on the live EC2 server?**
A: The EC2 IP address needs to be added to Firebase Authorized Domains. Contact your administrator.

**Q: Can multiple staff members use the platform simultaneously?**
A: Yes, the platform supports 50+ concurrent users.

---

## Performance Expectations

| Action | Expected Time |
|---|---|
| Page load | < 2 seconds |
| Login / Register | < 1 second |
| TriageAgent processing | 5–10 seconds |
| QuizBot quiz generation | 5–10 seconds |
| Dashboard load | < 1 second |
| Quiz history load | < 1 second |

---

## Support

For technical issues:
- Check `http://localhost:8000/health` (TriageAgent backend health)
- Check `http://localhost:8001/health` (QuizBot backend health)
- View logs: `docker compose logs -f`

---

*SupportHub User Guide — Group 03D2 — DO-15 — April 2026*