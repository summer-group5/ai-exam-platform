
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

// POST /api/courses/:courseId/assignments
router.post('/', requireCourseOwner, async (req, res) => {
  const { title, description, week_number, available_from, due_date, max_points } = req.body

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' })
  }
  if (available_from && isNaN(Date.parse(available_from))) {
    return res.status(400).json({ error: 'Invalid available_from date' })
  }
  if (due_date && isNaN(Date.parse(due_date))) {
    return res.status(400).json({ error: 'Invalid due_date' })
  }
  if (available_from && due_date && new Date(due_date) < new Date(available_from)) {
    return res.status(400).json({ error: 'Due date cannot be before available from date' })
  }

  const { data, error } = await supabaseAdmin
    .from('assignments')
    .insert({
      course_id: req.params.courseId,
      title: title.trim(),
      description: description ?? null,
      week_number: week_number ?? null,
      available_from: available_from ?? null,
      due_date: due_date ?? null,
      max_points: max_points ?? null
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(data)
})

// GET /api/courses/:courseId/assignments
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('assignments')
    .select('*')
    .eq('course_id', req.params.courseId)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ assignments: data })
})

// GET /api/courses/:courseId/assignments/:assignmentId
router.get('/:assignmentId', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('assignments')
    .select('*, questions(id, question_text, question_type, order_number, max_points, question_options(id, option_text))')
    .eq('id', req.params.assignmentId)
    .eq('course_id', req.params.courseId)
    .single()

  if (error) return res.status(404).json({ error: 'Assignment not found' })
  return res.json(data)
})

// PUT /api/courses/:courseId/assignments/:assignmentId
router.put('/:assignmentId', requireCourseOwner, async (req, res) => {
  const { title, description, week_number, available_from, due_date, max_points } = req.body

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' })
  }
  if (available_from && isNaN(Date.parse(available_from))) {
    return res.status(400).json({ error: 'Invalid available_from date' })
  }
  if (due_date && isNaN(Date.parse(due_date))) {
    return res.status(400).json({ error: 'Invalid due_date' })
  }
  if (available_from && due_date && new Date(due_date) < new Date(available_from)) {
    return res.status(400).json({ error: 'Due date cannot be before available from date' })
  }

  const updates = {}
  if (title !== undefined) updates.title = title.trim()
  if (description !== undefined) updates.description = description
  if (week_number !== undefined) updates.week_number = week_number
  if (available_from !== undefined) updates.available_from = available_from
  if (due_date !== undefined) updates.due_date = due_date
  if (max_points !== undefined) updates.max_points = max_points

  const { data, error } = await supabaseAdmin
    .from('assignments')
    .update(updates)
    .eq('id', req.params.assignmentId)
    .eq('course_id', req.params.courseId)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
})

// DELETE /api/courses/:courseId/assignments/:assignmentId
router.delete('/:assignmentId', requireCourseOwner, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('assignments')
    .delete()
    .eq('id', req.params.assignmentId)
    .eq('course_id', req.params.courseId)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(204).send()
})

module.exports = router
