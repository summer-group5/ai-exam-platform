# AI Exam Platform

Oulu University of Applied Sciences (OAMK) Summer project (2026).
Web-based platform for weekly programming assignments and supervised online exams,
with AI-assisted monitoring during exams.

## Status
Phase 1 - research and setup.

## Documentation
- [Git practices](GIT_PRACTICES.md)
- [Project plan](PROJECT_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- Research notes in `docs/research/`

## How to run
TBD once tech stack is finalized.

1. Copy `.env.example` to `.env` in the repository root:
   ```bash
   cp .env.example .env
   ```
2. Start the application stack using Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Open the frontend in your browser at: `http://localhost:3000`
4. Enter a message and click **Send to backend**.

The frontend sends a request to the backend at `http://localhost:4000/api/message`, the backend writes the message to PostgreSQL, and the response is displayed on the page.
