## API end points tested and documented for Exam platform

Base URL:http://localhost:3000/api

# Authentication

All endpoints require:

Authorization: Bearer <SUPABASE_ACCESS_TOKEN>

Courses - Enrollments

GET /courses/:courseId/enrollments

Response
```json
{
  "students": [
    {
      "id": "enrollment-id",
      "enrolled_at": "2026-07-01T00:00:00Z",
      "student": {
        "id": "student-id",
        "name": "Test Student",
        "email": "test@mail.com"
      }
    }
  ]
}

POST enroll student

{
  "course_id": 1,
  "student_id": "uuid"
}


POST /courses/:courseId/enroll

{
  "message": "Enrollment successful",
  "enrollment": {
    "id": "uuid",
    "course_id": 1,
    "student_id": "uuid"
  }
}


DELETE enrollment

DELETE /courses/:courseId/enrollments/:studentId

Response

204 No Content


POST  enrollment (CSV import)

Response:

{
  "imported": 1,
  "skipped": []
}

POST /courses/:courseId/assignments


Body

{
  "title": "Assignment 1",
  "description": "Intro task",
  "week_number": 1,
  "available_from": "2026-07-01",
  "due_date": "2026-07-10",
  "max_points": 100
}

Response:

{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Assignment 1",
  "description": "Intro task",
  "week_number": 1,
  "available_from": "2026-07-01T00:00:00Z",
  "due_date": "2026-07-10T00:00:00Z",
  "max_points": 100
}



Get all assignments


GET /courses/:courseId/assignments

Response:

{
  "assignments": []
}


Get single assignment

GET /courses/:courseId/assignments/:assignmentId

Response: 

{
  "id": "uuid",
  "title": "Assignment 1",
  "questions": []
}


Update assignment

PUT /courses/:courseId/assignments/:assignmentId

Body

{
  "title": "Updated title",
  "max_points": 120
}

Response:

{
  "id": "uuid",
  "title": "Updated title"
}


Delete assignment (teacher only)

DELETE /courses/:courseId/assignments/:assignmentId

Response

204 No Content


Errors:


Missing token

{
  "error": "Missing auth token"
}

Invalid token

{
  "error": "Invalid token"
}
Forbidden (not course owner)

{
  "error": "Forbidden"
}
Not found

{
  "error": "Course not found"
}