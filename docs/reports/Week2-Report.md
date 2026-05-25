# Weekly Status Report

**Project:** AI-Powered Exam & Assignment Platform

**Team:** Group 5

**Week:** 2

**Reporting date:** 21.5.2026

**Team members present:** 

- Sandip Bade
- Markku Putaala
- Alicja Williams

---

## 1. Summary

Group 5 has completed the initial project setup and is now in Phase 1 (research and foundations). The GitHub repository is in place with the recommended structure, branching model, and Git practices documented. 

Three research spikes are in progress: tech stack selection, gaze tracking comparison, and code evaluation strategies. We hope to have a tech stack decision and initial research notes ready for this week's meeting

No major risks have appeared yet.

---

## 2. Completed This Week

- First internal team kickoff meeting (agenda followed; roles and working agreements discussed)
- Drafted `GIT_PRACTICES.md` covering branching, commits, PRs, code review, and merging
- Created the GitHub repository with the recommended folder structure (`frontend/`, `backend/`, `ai/`, `docs/research/`, `docker/`, etc.)
- Added `.gitignore`, `README.md`, and placeholder files for `PROJECT_PLAN.md`, `ARCHITECTURE.md`, and `.env.example`
- Set up `main` and `dev` branches
- Configured branch protection (1 approval required for merges to `main` and `dev`)
- Added all team members as collaborators
- Set up GitHub Projects board with Backlog / To Do / In Progress / Review / Done columns

---

## 3. Visible Demo for Customer Meeting

We plan to demonstrate the following on Friday:

- GitHub repository structure
- `GIT_PRACTICES.md`
- GitHub Projects board with current sprint cards
- Research spikes underway (initial notes in `docs/research/`)


---

## 4. Current Challenges & Risks

- **Tech stack not yet finalized** — blocks coding work


---

## 5. Technical Decisions Made This Week

- **Branching model:** `main` / `dev` / `feature/*` with PR-based merges and 1 required reviewer.
- **Commit convention:**  (`feat:`, `fix:`, `docs:`, `chore:`, `spike:`).
- **Merge strategy:** squash-merge for `feature/*` → `dev`; merge commit for `dev` → `main` 
- **Tech stack:** hopefully :)


---

## 6. Research & Experimentation

Three Phase 1 research spikes are running in parallel:

- **Tech stack recommendation** - owner: Marrku Putaala
- **Gaze tracking comparison** - owner: Sandip Bade
- **Code evaluation strategies** - owner: Alicja Williams


---

## 7. Questions for the Customer

- what are the guidelines / recommendations for tracking hours?



---

## 8. Planned Goals for Next Week

- ARCHITECTURE.md & PROJECT_PLAN.md
- design the initial DB schema
- build end-to-end working skeleton (hello-world)
- auth backend & frontend
- complete and commit research docs 
- research spike for browser plug-ins

---

## 9. Scope & Prioritization Notes

- We are following the customer's MVP-first guidance with understanding that the core system (auth, assignments, exam mode, basic monitoring, reporting etc.) will be built before any AI-heavy features.
- Programming-assignment evaluation and gaze tracking are framed as **experimental / proof-of-concept**.


---

## 10. Technical Debt & Known Limitations

Nothing significant yet - the project is in early phase.

Known limitations going forward:
- Empty placeholder files (`PROJECT_PLAN.md`, `ARCHITECTURE.md`, `.env.example`) will be filled in as decisions are made.
- Branch protection is currently enforced via classic branch protection rules (rulesets require GitHub Team plan, which we do not have).

---

## 11. GitHub & Project Management Status

- **Repository:** https://github.com/summer-group5/ai-exam-platform
- **Branches:** `main`, `dev`
- **Projects board:** active, columns set up (Backlog, To Do, In Progress, Review, Done)
- **Open PRs:** 1


---

## 12. Additional Notes

We are finding the kickoff phase productive. Communication is working, and we are following the customer's guidance to build foundations before chasing AI features.


