# Database documentation

## Overview

Project uses Supabase as the primary database platform.

## Database Schema 

![Database Schema](./images/Schema_v2.0.png)

Database model version: 2.0

## **Explanation of table groups:**

### ***User management***

### users
Stores app-specific user data. `id` references `auth.users(id)` from Supabase Auth — Supabase Auth is the source of truth for authentication.

Roles:

- Administrator
- Teacher
- Student

### course_enrollments
Links students to courses.

------

### Course Management

### courses
Stores course information. Column `name` was renamed to `title` in v2.0 for consistency with `exams` and `assignments`.

### assignments
Stores assignments belonging to a course.

### assignment_submissions
Stores student assignment submissions and grading results.

-----

### Exam System

### exams
Stores exam definitons and settings.

### questions
Stores questions. A question can belong to either an exam (`exam_id`) or an assignment (`assignment_id`) — both are nullable. `order_number` defines the display order within an exam or assignment.

### question_options
Stores answer options for multi-choice questions.

### answers
Stores submitted answers during exam sessions.

### exam_sessions
Stores individual student exam attemps.

-----

### Monitoring

### monitoring_events
Stores suspicious events during a session. `duration_ms` records how long the event lasted (e.g. how long a tab was switched away). The teacher reviews events and makes the final decision — the system does not auto-penalise.

Examples:
- Tab switch
- Focus loss

---

# **Supabase Setup**

## Enviroment variables

Create:
    frontend/.env

Copy / paste the following information to .env from Supabase:

VITE_SUPABASE_URL=< project-url >     
VITE_SUPABASE_PUBLISHABLE_KEY=< key >

## Client location

frontend/src/utils/supabase.js

------

# Notes

- Tables require policies before frontend can read or modify data.
- If not set, data will not be shown.

## Common issues 

### Query returns empty array

Possible cause:
- Row Level Security (RLS) is enabled

### Solution:

Table needs an appropriate SELECT policy for the table.