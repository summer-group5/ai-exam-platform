# Architecture

## Overview

```
React (Frontend) ->
Supabase (Auth + Database + Real-time events) ->
PostgreSQL (via Supabase)

+ CodeRunner (code evaluation, isolated)
+ MediaPipe (gaze tracking, runs in browser)
+ Docker (local dev environment)
```

## Tech Stack

### 1. Frontend - React (JavaScript)
React was selected due to the team's prior experience. It enables fast development, easy collaboration, and has strong ecosystem support for the features we need (real-time UI updates, monitoring overlays, exam timer components).

No TypeScript for now - we keep it simple and can add it later if needed.

### 2. Backend & Database - Supabase
[https://supabase.com](https://supabase.com)

Supabase handles authentication, database, and real-time event handling in one platform. This removes the need to build and maintain a custom backend infrastructure, which allows the team to focus on core exam features.

**Why Supabase:**
- Built-in role-based access control (teacher / student)
- PostgreSQL database - relational, reliable, standard
- Real-time event handling for exam monitoring (tab switches, focus loss)
- Authentication out of the box
- Fast to develop with, minimal configuration

**Note on future authentication:**
The university may provide an institutional authentication system (LDAP/OAuth) later. Supabase supports OAuth providers and custom auth integrations, so this can be plugged in without major changes to the rest of the system.

### 3. Docker
[https://www.docker.com](https://www.docker.com)

Docker is used to simplify local development and prepare for deployment. Running services in containers ensures consistency across all team members' machines.

**Why Docker:**
- Consistent environment across all devices
- Easy setup for new team members
- Frontend and backend services run locally without manual configuration
- Prepares the project for cloud deployment later

### 4. CodeRunner
[https://coderunner.org.nz](https://coderunner.org.nz)

CodeRunner is used to execute and evaluate programming-related exam tasks in an isolated environment. This enables automatic testing and immediate feedback for submitted code without running untrusted code on our own servers.

**Why CodeRunner:**
- Isolated code execution (safe)
- Supports multiple programming languages (Java, C, JavaScript)
- Automatic evaluation and feedback
- Reduces need to build a custom code execution environment

**Status:** See `docs/research/code-evaluation.md` for research findings.

### 5. MediaPipe (Gaze Tracking)
[https://mediapipe.org](https://mediapipe.org)

MediaPipe runs entirely in the browser and is used to detect gaze direction and head position during exams. This is the AI-powered monitoring component of the platform.

**Why MediaPipe:**
- Runs client-side — no video or images are sent to the server
- No webcam recordings stored (privacy-compliant)
- Detects gaze leaving the screen and head turning
- Only event data (timestamps, flags) is logged to the database

**Status:** See `docs/research/gaze-tracking.md` for detailed research and findings.

---

## Data Flow

### Exam Monitoring Flow
```
Student takes exam (browser)
      ↓
MediaPipe detects suspicious behavior (gaze, head position)
Browser API detects tab switch / focus loss
      ↓
Event logged to Supabase (timestamp, student_id, event_type)
No video or screenshots stored — event data only
      ↓
Teacher reviews event log in dashboard after exam
Teacher makes final decision — system does not auto-punish
```

### Authentication Flow
```
Student / Teacher logs in
      ↓
Supabase Auth (current)
      ↓
Role assigned (teacher / student)
      ↓
Protected routes based on role
```

### Code Evaluation Flow
```
Student submits code answer
      ↓
CodeRunner executes in isolated environment
      ↓
Result returned (pass/fail + feedback)
      ↓
Result stored in Supabase
```

---

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend framework | React | Team knows it, fast to build with |
| Backend | Supabase | Auth + DB + real-time in one platform |
| Database | PostgreSQL (via Supabase) | Relational, reliable, standard |
| Language | JavaScript (no TypeScript) | Keep it simple, add later if needed |
| Local dev | Docker | Consistent environment across all machines |
| Code execution | CodeRunner | Isolated, safe, multi-language |
| Gaze tracking | MediaPipe | Client-side, no video storage, privacy-safe |
| Webcam recordings | Not stored | Customer requirement |

---

## What We Are Not Building

- Custom backend server (Supabase handles this)
- Webcam recording or screenshot storage (privacy + GDPR)
- Automatic cheating decisions (teacher always decides)
- Mobile support (desktop-first per customer requirement)

---

## Known Limitations & Technical Debt

- Gaze tracking accuracy is not guaranteed 
- CodeRunner integration is experimental
- University authentication (LDAP/OAuth) not yet integrated - using Supabase Auth for now
- Mobile not supported
---

## Further Reading

- `docs/research/gaze-tracking.md` - MediaPipe research and findings
- `docs/research/code-evaluation.md` - Code evaluation strategy research
