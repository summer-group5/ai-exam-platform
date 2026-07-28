const express = require('express')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router({ mergeParams: true })

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

// POST /api/courses/:courseId/assignments/:assignmentId/questions
router.post('/questions', requireCourseOwner, async (req, res) => {
  const { assignmentId } = req.params
  const { question_text, order_number, max_points } = req.body

  if (!question_text || !question_text.trim()) {
    return res.status(400).json({ error: 'question_text is required' })
  }

  // Verify the assignment belongs to this course
  const { data: assignment, error: assignmentError } = await supabaseAdmin
    .from('assignments')
    .select('id')
    .eq('id', assignmentId)
    .eq('course_id', req.params.courseId)
    .single()

  if (assignmentError || !assignment) {
    return res.status(404).json({ error: 'Assignment not found' })
  }

  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({
      assignment_id: assignmentId,
      question_text: question_text.trim(),
      question_type: 'multiple_choice',
      order_number: order_number ?? 1,
      max_points: max_points ?? 1
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(data)
})

// DELETE /api/courses/:courseId/assignments/:assignmentId/questions/:questionId
router.delete('/questions/:questionId', requireCourseOwner, async (req, res) => {
  const { assignmentId, questionId } = req.params

  // Verify the question belongs to this assignment
  const { data: question, error: questionError } = await supabaseAdmin
    .from('questions')
    .select('id')
    .eq('id', questionId)
    .eq('assignment_id', assignmentId)
    .single()

  if (questionError || !question) {
    return res.status(404).json({ error: 'Question not found' })
  }

  const { error } = await supabaseAdmin
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(204).send()
})

// POST /api/courses/:courseId/assignments/:assignmentId/questions/:questionId/options
router.post('/questions/:questionId/options', requireCourseOwner, async (req, res) => {
  const { assignmentId, questionId } = req.params
  const { option_text, is_correct } = req.body

  if (!option_text || !option_text.trim()) {
    return res.status(400).json({ error: 'option_text is required' })
  }

  // Verify the question belongs to this assignment
  const { data: question, error: questionError } = await supabaseAdmin
    .from('questions')
    .select('id')
    .eq('id', questionId)
    .eq('assignment_id', assignmentId)
    .single()

  if (questionError || !question) {
    return res.status(404).json({ error: 'Question not found' })
  }

  // If this option is correct, clear the correct flag on all other options first
  if (is_correct) {
    const { error: clearError } = await supabaseAdmin
      .from('question_options')
      .update({ is_correct: false })
      .eq('question_id', questionId)

    if (clearError) return res.status(500).json({ error: clearError.message })
  }

  const { data, error } = await supabaseAdmin
    .from('question_options')
    .insert({
      question_id: questionId,
      option_text: option_text.trim(),
      is_correct: is_correct ?? false
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(data)
})

// DELETE /api/courses/:courseId/assignments/:assignmentId/questions/:questionId/options/:optionId
router.delete('/questions/:questionId/options/:optionId', requireCourseOwner, async (req, res) => {
  const { questionId, optionId } = req.params

  // Verify the option belongs to this question
  const { data: option, error: optionError } = await supabaseAdmin
    .from('question_options')
    .select('id')
    .eq('id', optionId)
    .eq('question_id', questionId)
    .single()

  if (optionError || !option) {
    return res.status(404).json({ error: 'Option not found' })
  }

  const { error } = await supabaseAdmin
    .from('question_options')
    .delete()
    .eq('id', optionId)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(204).send()
})

module.exports = router
