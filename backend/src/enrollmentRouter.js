const express = require('express')
const multer = require('multer')
const { parse } = require('csv-parse/sync')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router({ mergeParams: true })
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1_000_000 } })

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

  req.teacher = user
  next()
}

// POST /api/courses/:courseId/enrollments/import
router.post('/import', requireCourseOwner, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  let rows
  try {
    rows = parse(req.file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    })
  } catch {
    return res.status(400).json({ error: 'Could not parse CSV' })
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const seenEmails = new Set()
  let imported = 0
  const skipped = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const name = (row.name ?? '').trim()
    const email = (row.email ?? '').trim().toLowerCase()
    const rowNum = i + 2 // +2: 1-based index + skip header row

    if (!name || !email) {
      skipped.push({ row: rowNum, email: email || null, reason: 'invalid' })
      continue
    }
    if (!EMAIL_RE.test(email)) {
      skipped.push({ row: rowNum, email, reason: 'invalid' })
      continue
    }
    if (seenEmails.has(email)) {
      skipped.push({ row: rowNum, email, reason: 'duplicate-in-file' })
      continue
    }
    seenEmails.add(email)

    // resolve or create student
    let studentId
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      studentId = existingUser.id
    } else {
      const { data: invited, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
      if (inviteErr) {
        skipped.push({ row: rowNum, email, reason: 'invalid' })
        continue
      }
      studentId = invited.user.id

      const { error: insertUserErr } = await supabaseAdmin
        .from('users')
        .insert({ id: studentId, name, email, role: 'student' })
      if (insertUserErr) {
        skipped.push({ row: rowNum, email, reason: 'invalid' })
        continue
      }
    }

    // check for existing enrollment
    const { data: existingEnrollment } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('course_id', req.params.courseId)
      .eq('student_id', studentId)
      .maybeSingle()

    if (existingEnrollment) {
      skipped.push({ row: rowNum, email, reason: 'already-enrolled' })
      continue
    }

    // enroll
    const { error: enrollErr } = await supabaseAdmin
      .from('course_enrollments')
      .insert({ course_id: req.params.courseId, student_id: studentId })
    if (enrollErr) {
      skipped.push({ row: rowNum, email, reason: 'invalid' })
      continue
    }

    imported++
  }

  return res.json({ imported, skipped })
})

// GET /api/courses/:courseId/enrollments
router.get('/', requireCourseOwner, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('course_enrollments')
    .select('id, enrolled_at, student:student_id(id, name, email)')
    .eq('course_id', req.params.courseId)
    .order('enrolled_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ students: data })
})

// DELETE /api/courses/:courseId/enrollments/:studentId
router.delete('/:studentId', requireCourseOwner, async (req, res) => {
  const { error } = await supabaseAdmin
    .from('course_enrollments')
    .delete()
    .eq('course_id', req.params.courseId)
    .eq('student_id', req.params.studentId)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(204).send()
})

module.exports = router
