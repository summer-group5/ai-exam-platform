# Project Plan
## AI-Powered Exam & Assignment Platform
**Project duration:** 12 weeks

---

## Project Phases

### Phase 1 - Guided Phase (Weeks 1-5)

Active customer interaction is available during this phase. The goal is to establish a solid technical foundation, validate architecture decisions, and resolve open questions before the customer steps back.

**Focus areas:**
- Project setup and tooling (repo, CI, Docker, Supabase)
- Database schema and core architecture
- Authentication and role-based access
- Beginning of assignment workflow
- Wireframes and UI structure

---

### Phase 2 - Independent Development (Weeks 6-11)

The team works independently. The customer is no longer actively available but weekly status reports continue.

The goal of this phase is to build and connect all core MVP features into a working system.

**Focus areas:**
- Complete assignment workflow (create, schedule, submit, evaluate)
- Exam mode (timed, locked, multiple choice)
- Monitoring (tab tracking, focus loss, event logging)
- Teacher dashboard and reporting
- Experimental features if MVP is complete (gaze tracking, CodeRunner prototype)

Experimental features are only attempted after the core MVP is working. If the MVP is not stable, experimental work is skipped in favour of stability.

---

### Phase 3 - Final Delivery (Week 12)

No new features. The focus is on stability, documentation, and the final demonstration.

**Focus areas:**
- Bug fixes and polish
- Demo preparation (student flow + teacher flow)
- Architecture and decision documentation
- Research findings documented regardless of outcome
- Lessons learned

---

## Feature Priorities

### Must Have (MVP)
| Feature | Notes |
|---------|-------|
| Authentication (login/logout) | Via Supabase Auth |
| Role-based access (teacher/student) | Different views and permissions |
| CSV student import | Teacher imports student list |
| Weekly assignment packages | Create and group by week |
| Assignment scheduling | Set availability dates per week |
| Multiple choice questions | Create, answer, auto-evaluate |
| Immediate feedback | Correct/incorrect shown to student |
| Timed exam mode | Countdown timer, locked view |
| Tab switch detection + logging | Event logged with timestamp |
| Focus loss detection + logging | Event logged with timestamp |
| Student warning overlay | Visible feedback on suspicious behavior |
| Teacher event log | Per-student, per-exam view |
| Assignment completion dashboard | Basic reporting for teacher |

### Experimental (If Time Allows)
| Feature | Notes |
|---------|-------|
| Gaze tracking  | MediaPipe in browser, proof-of-concept only |
| Code evaluation - CodeRunner prototype | Code submission and evaluation, if time allows |

Research findings are documented regardless of whether the feature is fully implemented.

### Out of Scope
| Feature | Reason |
|---------|--------|
| Webcam recording / screenshots | 
| Automatic cheating decisions | 
| Mobile support | 
| University Auth | 

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gaze tracking accuracy too low to be useful | Low - it is experimental | POC is enough, document findings |
| CodeRunner integration more complex than expected | Low - it is optional | Timebox to one sprint max, skip if needed |
| Scope too large for a 3-person team | High | MVP strictly first, no experimental work until core is stable |
| Docker issues blocking local development | Medium | Make Docker optional locally if needed, required for deployment only |
| Supabase real-time more complex than expected | Medium | Fall back to polling if real-time proves too difficult |
| Open questions not resolved before teacher leaves (week 5) | High | Raise all blockers and clarifications before end of week 5 |

---

## Definition of Done

A feature is considered done when:
- It works on all team members' machines
- It is merged to `dev` via PR
- No console errors or debug logs left in
- Basic edge cases handled 

---

## Research Log

| Topic | Status | Location |
|-------|--------|----------|
| Gaze tracking (MediaPipe vs WebGazer) | `docs/research/gaze-tracking.md` |
| Code evaluation strategies | `docs/research/code-evaluation.md` |
| Tech stack decision | `ARCHITECTURE.md` |

---

## Notes

- Experimental features start only after MVP is solid
- Honest reporting matters - if something is falling behind, raise it early
- Keep PRs small and merge often
- Responsibilities rotate - agree on ownership at the start of each week