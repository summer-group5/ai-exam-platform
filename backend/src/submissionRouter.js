const express = require('express')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router({ mergeParams: true })

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing auth token' })

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  req.user = user
  next()
}

async function requireCourseOwner(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing auth token' })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

  const { data: course, error: courseError } = await supabaseAdmin
    .from('courses')
    .select('id, teacher_id')
    .eq('id', req.params.courseId)
    .single()

  if (courseError || !course) return res.status(404).json({ error: 'Course not found' })
  if (course.teacher_id !== user.id) return res.status(403).json({ error: 'Forbidden' })

  req.user = user
  next()
}

// POST /api/courses/:courseId/assignments/:assignmentId/submit
router.post('/submit', requireAuth, async (req, res) => {
  const { courseId, assignmentId } = req.params
  const studentId = req.user.id
  const { answers } = req.body // [{ question_id, option_id }]

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array' })
  }

  // Check student is enrolled in the course
  const { data: enrollment } = await supabaseAdmin
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', studentId)
    .maybeSingle()

  if (!enrollment) {
    return res.status(403).json({ error: 'You are not enrolled in this course' })
  }

  // Block duplicate submission
  const { data: existing } = await supabaseAdmin
    .from('assignment_submissions')
    .select('id')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .maybeSingle()

  if (existing) {
    return res.status(409).json({ error: 'You have already submitted this assignment' })
  }

  // Fetch assignment questions with correct options
  const { data: assignment, error: assignmentError } = await supabaseAdmin
    .from('assignments')
    .select('id, max_points, questions(id, max_points, question_options(id, is_correct))')
    .eq('id', assignmentId)
    .eq('course_id', courseId)
    .single()

  if (assignmentError || !assignment) {
    return res.status(404).json({ error: 'Assignment not found' })
  }

  // Grade answers
  const questions = assignment.questions ?? []
  let score = 0
  let maxScore = 0

  for (const question of questions) {
    const questionMaxPoints = question.max_points ?? 1
    maxScore += questionMaxPoints

    const submitted = answers.find(a => a.question_id === question.id)
    if (!submitted) continue

    const selectedOption = question.question_options.find(o => o.id === submitted.option_id)
    if (selectedOption?.is_correct) {
      score += questionMaxPoints
    }
  }

  // Save submission
  const { data: submission, error: insertError } = await supabaseAdmin
    .from('assignment_submissions')
    .insert({
      assignment_id: assignmentId,
      student_id: studentId,
      score,
      status: 'submitted'
    })
    .select()
    .single()

  if (insertError) return res.status(500).json({ error: insertError.message })

  return res.status(201).json({ score, max_score: maxScore, status: submission.status, submitted_at: submission.submitted_at })
})

// GET /api/courses/:courseId/assignments/:assignmentId/my-submission
router.get('/my-submission', requireAuth, async (req, res) => {
  const { assignmentId } = req.params
  const studentId = req.user.id

  const [{ data, error }, { data: assignmentData }] = await Promise.all([
    supabaseAdmin
      .from('assignment_submissions')
      .select('id, score, status, submitted_at')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .maybeSingle(),
    supabaseAdmin
      .from('assignments')
      .select('questions(max_points)')
      .eq('id', assignmentId)
      .single()
  ])

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'No submission found' })

  const questions = assignmentData?.questions ?? []
  const max_score = questions.reduce((sum, q) => sum + (q.max_points ?? 1), 0)

  return res.json({ ...data, max_score })
})

// GET /api/courses/:courseId/assignments/:assignmentId/submissions  (teacher)
router.get('/submissions', requireCourseOwner, async (req, res) => {
  const { courseId, assignmentId } = req.params

  // Get all enrolled students
  const { data: enrollments, error: enrollError } = await supabaseAdmin
    .from('course_enrollments')
    .select('student_id')
    .eq('course_id', courseId)

  if (enrollError) return res.status(500).json({ error: enrollError.message })

  const studentIds = enrollments.map(e => e.student_id)

  // Get user info for enrolled students
  const { data: users, error: usersError } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .in('id', studentIds)

  if (usersError) return res.status(500).json({ error: usersError.message })

  // Get all submissions for this assignment
  const { data: submissions, error: subError } = await supabaseAdmin
    .from('assignment_submissions')
    .select('student_id, score, status, submitted_at')
    .eq('assignment_id', assignmentId)

  if (subError) return res.status(500).json({ error: subError.message })

  // Merge: one row per enrolled student
  const report = users.map(user => {
    const submission = submissions.find(s => s.student_id === user.id) ?? null
    return {
      student: user,
      submission
    }
  })

  return res.json({ report })
})

// GET /api/courses/:courseId/assignments/:assignmentId/submissions/:studentId  (teacher)
router.get('/submissions/:studentId', requireCourseOwner, async (req, res) => {
  const { assignmentId, studentId } = req.params

  const { data, error } = await supabaseAdmin
    .from('assignment_submissions')
    .select('id, score, status, submitted_at')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .maybeSingle()

  if (error) return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'No submission found for this student' })

  return res.json(data)
})

module.exports = router
