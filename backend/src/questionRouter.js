const express = require('express')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router({ mergeParams: true })

// Require course owner
async function requireCourseOwner(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' })
  }

  const {
    data: { user },
    error: authError
  } = await supabaseAdmin.auth.getUser(token)

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { data: course, error: courseError } = await supabaseAdmin
    .from('courses')
    .select('teacher_id')
    .eq('id', req.params.courseId)
    .single()

  if (courseError || !course) {
    return res.status(404).json({ error: 'Course not found' })
  }

  if (course.teacher_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  req.user = user
  next()
}

// GET /api/exams/:examId/questions
router.get('/:examId/questions', async (req, res) => {
  const { examId } = req.params

  const { data, error } = await supabaseAdmin
    .from('questions')
    .select(`
      id,
      question_text,
      order_number,
      max_points,
      question_options (
        id,
        option_text,
        is_correct
      )
    `)
    .eq('exam_id', examId)
    .order('order_number')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
})

// POST question
router.post('/questions', requireCourseOwner, async (req, res) => {
  const { assignmentId } = req.params
  const { question_text, order_number, max_points } = req.body

  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({
      assignment_id: assignmentId,
      question_text,
      question_type: 'multiple_choice',
      order_number: order_number ?? 1,
      max_points: max_points ?? 1
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json(data)
})

// DELETE question
router.delete('/questions/:questionId', requireCourseOwner, async (req, res) => {
  const { questionId } = req.params

  const { error } = await supabaseAdmin
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) return res.status(500).json({ error: error.message })

  res.status(204).send()
})

// POST option
router.post('/questions/:questionId/options', requireCourseOwner, async (req, res) => {
  const { questionId } = req.params
  const { option_text, is_correct } = req.body

  if (is_correct) {
    await supabaseAdmin
      .from('question_options')
      .update({ is_correct: false })
      .eq('question_id', questionId)
  }

  const { data, error } = await supabaseAdmin
    .from('question_options')
    .insert({
      question_id: questionId,
      option_text,
      is_correct: is_correct ?? false
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json(data)
})

// DELETE option
router.delete('/questions/:questionId/options/:optionId', requireCourseOwner, async (req, res) => {
  const { optionId } = req.params

  const { error } = await supabaseAdmin
    .from('question_options')
    .delete()
    .eq('id', optionId)

  if (error) return res.status(500).json({ error: error.message })

  res.status(204).send()
})

module.exports = router