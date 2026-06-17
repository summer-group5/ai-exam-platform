# AI Exam Platform

Oulu University of Applied Sciences (OAMK) Summer project (2026).
Web-based platform for weekly programming assignments and supervised online exams,
with AI-assisted monitoring during exams.

## Status
Phase 1 - research and setup.
** Phase 2 - active development. **

## Documentation
- [Git practices](GIT_PRACTICES.md)
- [Project plan](PROJECT_PLAN.md)
- [Architecture](ARCHITECTURE.md)
- Research notes in `docs/research/`

## How to run

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

> **Note:** Docker is not yet configured for local development. Use the manual setup below.

### Supabase setup

Create `frontend/.env` and add your Supabase project credentials:

```
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

Both values are found in your Supabase project under **Settings → API**.

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Docker (not ready for development)

Docker setup exists but is not yet configured for local development. The following commands are for future use:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Start the stack:
   ```bash
   docker compose up --build
   ```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:4000        |
| Database | Supabase (cloud)             |

**Stop:** `docker compose down`
**Next time:** `docker compose up` (no `--build` needed unless Dockerfiles or dependencies changed)
**Wipe database:** `docker compose down -v`

## Wireframes


**Login**


![Login](docs/wireframes/login.png)


**Student dashboard**


![Student dashboard](docs/wireframes/student-dashboard.png)


**Assignment view**


![Assignment view](docs/wireframes/assignment-view.png)


**Assignment exam**


![Exam view](docs/wireframes/exam.png)


## Dependencies for development 

### Front end 

npm install react-router-dom

### Required backend dependencies
npm install express pg cors dotenv nodemon
