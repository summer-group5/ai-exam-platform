# Git Practices

How we use Git on this project. Read it once, refer back when something breaks.

If something here isn't working, say so and we'll change it. The only bad outcome is quietly ignoring it.

---

## Branches

Three branches that always exist:

| Branch | What it is |
|--------|------------|
| `main` | Works. Always. No exceptions. |
| `dev` | Where finished features land before going to `main`. |
| your branch | Where you actually work. |

Nobody commits directly to `main` or `dev`. Everything goes through a PR. GitHub is configured to enforce this — you physically can't push there directly.

`main` = what we'd show at the Friday demo. If it's broken, it's a problem.

---

## Naming your branch

`<type>/<what-it-does>`

```
feature/auth-login
feature/exam-timer
fix/exam-reload-bug
spike/gaze-tracking-mediapipe
docs/architecture-overview
chore/setup-eslint
```

Types: `feature`, `fix`, `docs`, `spike`, `chore`

Lowercase, hyphens, no spaces. Don't name it `test` or `johns-stuff` or `update` — that tells nobody anything.

---

## Day-to-day

```bash
# Start something new
git checkout dev && git pull
git checkout -b feature/whatever-you're-doing

# Commit as you go
git add .
git commit -m "feat: add countdown timer component"
git push

# When dev has moved on and you need to sync
git fetch origin
git merge origin/dev
```

We use **merge** (not rebase) when syncing with `dev`. It's messier history but easier to deal with when things go wrong.

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) loosely:

```
feat: add tab-switch detection to exam mode
fix: prevent exam timer reset on page reload
refactor: extract event logger into service
chore: add dotenv to backend
docs: add gaze tracking research notes
spike: compare WebGazer.js vs MediaPipe
```

Not this:
```
stuff
fixed it
WIP
final version
asdf
```

A few rules that actually matter:
- Under ~70 characters in the summary
- Imperative tense — "add", not "added"
- One thing per commit. If you're writing "and" in the message, split it.

---

## Pull Requests

Everything merges to `dev` via PR. Yes, even the small thing.

Before you open it:
- [ ] Runs on your machine
- [ ] Branch is synced with `dev`
- [ ] No debug logs, commented-out code, or real `.env` values left in

PR description should cover: what it does, why, and how to test it. This isn't bureaucracy — it's so the reviewer doesn't have to guess.

```markdown
## What
Adds tab-switch detection during exam mode and logs events to the backend.

## Why
Customer wants visibility into focus loss during exams (CRD 4.6).

## How to test
1. `docker compose up`
2. Log in as a student, start an exam
3. Switch tabs
4. Check backend logs for `tab_blur` event

## Notes
- Still logging to console too — will clean up once dashboard exists
- Alt+Tab on Windows not handled yet (separate issue)
```

Keep PRs under ~400 lines if you can. Big PRs sit unreviewed for days and that's on the author.

---

## Code Review

Need 1 approval to merge.

**If you're reviewing:**
- Pull the branch and run it if you can
- Be specific — "rename `x` to `studentId`" is useful, "this is unclear" is not
- Don't leave PRs sitting — approve, request changes, or leave a comment

**If your PR is being reviewed:**
- Don't take it personally
- Reply to every comment, even just "done" or "won't fix, because..."
- Re-request review once you've addressed things

If a comment thread is going in circles, just call each other.

---

## Merging

- Topic branches → `dev`: **Squash and merge** on GitHub
- `dev` → `main`: **Merge commit** (at sprint end or before a demo) — [team lead's name] does this
- Delete the branch after merge

---

## Conflicts

They'll happen. Usually when two people edited the same file in the same area. Here's how to deal with it.

**Trigger the merge:**
```bash
git checkout feature/your-branch
git fetch origin
git merge origin/dev
```

If there's a conflict, Git stops mid-merge and tells you which files need attention:
```
CONFLICT (content): Merge conflict in src/components/ExamTimer.tsx
Automatic merge failed; fix conflicts then commit the result.
```

**After fixing all the marked files:**
```bash
git add <the-files-you-fixed>
git commit     # Git pre-fills the message, that's fine
git push
```

Run the app before you push. A resolved conflict that breaks the build is worse than leaving it unresolved.

**What not to do:**
- Don't `git push --force` on `dev` or `main` - you'll overwrite someone else's work
- Don't blindly click "Accept All Incoming" - that throws away your changes
- Don't keep committing on top of unresolved markers

**If it's genuinely messy**, ask someone to pair on it. Two people on the same diff is faster than one person staring at it for an hour. Share your screen and walk through it - usually takes 10 minutes.

---

## Don't commit this stuff

`.gitignore` catches most of it, but double-check:

- `.env` with real keys or passwords
- `node_modules/`, `venv/`, `__pycache__/`
- `.DS_Store`, `Thumbs.db`
- `dist/`, `build/`, `.next/`
- Real student data
- Files over ~50 MB

Do commit:
- `.env.example` with placeholder values
- Lock files (`package-lock.json`, `yarn.lock`)

**Accidentally pushed a secret?** Tell the team now. The secret needs to be rotated — deleting it from history doesn't help once it's been pushed.

---

## GitHub Projects

- Every non-trivial PR links to an issue
- Move your card: To Do → In Progress → Review → Done
- Use `Closes #12` in the PR description to auto-close the issue on merge
- If your card has been "In Progress" for a week with no commits, bring it up

---

## Cheatsheet

```bash
# New branch
git checkout dev && git pull
git checkout -b feature/my-thing

# Save work
git add . && git commit -m "feat: ..." && git push

# Sync with dev
git fetch origin && git merge origin/dev

# Undo last commit (not pushed yet)
git reset --soft HEAD~1

# Check before committing
git status
git diff --staged

# See history
git log --oneline --graph --all
```

---

## If this doc gets in the way

Bring it up, propose a change, update this file via PR. Following rules that don't make sense is just as bad as ignoring them.
