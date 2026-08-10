const express = require('express')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router()

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing auth token' })

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  req.user = user
  next()
}

// GET /api/courses/my-enrollments
// Returns courses the logged-in student is enrolled in
router.get('/my-enrollments', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('course_enrollments')
    .select('courses(id, title, description, teacher_id)')
    .eq('student_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })

  const courses = data.map(row => row.courses).filter(Boolean)
  return res.json({ courses })
})

module.exports = router
