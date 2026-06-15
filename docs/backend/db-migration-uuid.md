# DB Migration — int4 → uuid

## Status: Proposed — pending team review

This is a proposal. Please review and leave feedback on the PR. If the team agrees, the migration will be run.

---

## Changes in this version

On top of the int4 → uuid conversion, the following schema fixes are folded in:

1. **`questions.exam_id`** — made nullable (a question now belongs to either an exam or an assignment, not both)
2. **`questions.assignment_id`** — new nullable uuid FK referencing `assignments(id)` on delete cascade
3. **`questions.order_number`** — new `int4` column for explicit question ordering within an exam or assignment
4. **`monitoring_events.confidence`** — removed (implies AI scoring, conflicts with teacher-makes-final-decision requirement)
5. **`monitoring_events.duration_ms`** — new `int4` column to record how long a tab was switched away or focus was lost
6. **`courses.name`** — renamed to `courses.title` for consistency with `exams` and `assignments`

---

## Follow-up required

`docs/backend/database.md` must be updated to reflect all schema changes above. The two documents need to stay in sync.

---

## Why

All table `id` columns and foreign keys are currently `int4`. Supabase Auth identifies users by UUID, so `auth.uid()` and RLS policies cannot work until user references are `uuid`. Changing all ids to `uuid` at the same time keeps the schema consistent.

##  Warning

This drops and recreates all tables. All existing data will be lost. Only run this in development.

---

## SQL — Run in Supabase SQL Editor

Drop all tables first (order matters - children before parents):

```sql
drop table if exists monitoring_events cascade;
drop table if exists answers cascade;
drop table if exists exam_sessions cascade;
drop table if exists question_options cascade;
drop table if exists questions cascade;
drop table if exists assignment_submissions cascade;
drop table if exists assignments cascade;
drop table if exists course_enrollments cascade;
drop table if exists exams cascade;
drop table if exists courses cascade;
drop table if exists users cascade;
```

Recreate with `uuid`:

```sql
-- Users (profiles linked to Supabase Auth)
create table users (
  id uuid references auth.users(id) on delete cascade primary key,
  name varchar,
  role varchar,
  email varchar
);

-- Courses
create table courses (
  id uuid default gen_random_uuid() primary key,
  title varchar not null, -- RENAMED: name -> title
  description text,
  teacher_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Assignments
create table assignments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade,
  title varchar,
  description text,
  due_date timestamp with time zone,
  max_points int4,
  created_at timestamp with time zone default now()
);

-- Course enrollments
create table course_enrollments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade,
  student_id uuid references auth.users(id),
  enrolled_at timestamp with time zone default now()
);

-- Exams
create table exams (
  id uuid default gen_random_uuid() primary key,
  title varchar,
  course_id uuid references courses(id) on delete cascade,
  description text,
  created_by uuid references auth.users(id),
  max_attempts int4,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_minutes int4,
  created_at timestamp with time zone default now()
);

-- Questions
create table questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references exams(id) on delete cascade,         -- CHANGED: now nullable
  assignment_id uuid references assignments(id) on delete cascade, -- ADDED: assignment_id
  order_number int4,                                           -- ADDED: order_number
  question_type varchar,
  question_text text,
  max_points int4,
  created_at timestamp with time zone default now()
);

-- Question options
create table question_options (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id) on delete cascade,
  option_text text,
  is_correct boolean
);

-- Exam sessions
create table exam_sessions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references exams(id) on delete cascade,
  student_id uuid references auth.users(id),
  attempt_number int4,
  final_score float8,
  status varchar,
  started_at timestamp with time zone,
  submitted_at timestamp with time zone
);

-- Answers
create table answers (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references exam_sessions(id) on delete cascade,
  question_id uuid references questions(id),
  selected_option_id uuid references question_options(id),
  answer_text text,
  code_submission text,
  score float8,
  submitted_at timestamp with time zone
);

-- Assignment submissions
create table assignment_submissions (
  id uuid default gen_random_uuid() primary key,
  assignment_id uuid references assignments(id) on delete cascade,
  student_id uuid references auth.users(id),
  score float8,
  submitted_at timestamp with time zone,
  status varchar
);

-- Monitoring events
create table monitoring_events (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references exam_sessions(id) on delete cascade,
  type varchar,
  created_at timestamp with time zone default now(),
  -- REMOVED: confidence (implied AI scoring, conflicts with teacher-makes-final-decision requirement)
  duration_ms int4, -- ADDED: duration_ms
  details text
);
```

---

## RLS policies for `courses`

Enable RLS after recreating the table:

```sql
alter table courses enable row level security;

create policy "teacher_select" on courses
  for select using (auth.uid() = teacher_id);

create policy "teacher_insert" on courses
  for insert with check (auth.uid() = teacher_id);

create policy "teacher_update" on courses
  for update using (auth.uid() = teacher_id);

create policy "teacher_delete" on courses
  for delete using (auth.uid() = teacher_id);
```

