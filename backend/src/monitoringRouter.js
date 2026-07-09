//monitoringRouter.js
const express = require('express')
const { supabaseAdmin } = require('./supabaseAdmin')

const router = express.Router({ mergeParams: true })


// require auth
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing auth token' })

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  req.user = user
  next()
}


// POST /api/courses/:courseId/exam-sessions
router.post('/courses/:courseId/exam-sessions', requireAuth, async (req, res) => {
  const { courseId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('exam_sessions')
    .insert({
      course_id: courseId,
      student_id: req.user.id,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  return res.status(201).json(data);
});




//POST /api/exam-sessions/:sessionId/events
router.post('/:sessionId/events', requireAuth, async (req, res) => {
  const { sessionId } = req.params
  
  const {
    type,
    duration_ms = 0,
    details
  } = req.body
  if (!type) {
    return res.status(400).json({
      error: 'type is required'
    });
  }
  
  const { data: session, error: sessionError } = await supabaseAdmin
  .from('exam_sessions')
  .select('id')
  .eq('id', sessionId)
  .single();

if (sessionError || !session) {
  return res.status(404).json({
    error: 'Exam session not found'
  });
}
  
  const { data, error } = await supabaseAdmin
    .from('monitoring_events')
    .insert({
      session_id: sessionId,
      type,
      duration_ms,
      details
    })
    .select()
    .single()

  if (error)
    return res.status(500).json({ error: error.message })

 return res.status(201).json(data)
})


//GET /api/exam-sessions/:sessionId/events

router.get('/:sessionId/events', requireAuth, async (req, res) => {
  const { sessionId } = req.params

  const { data, error } = await supabaseAdmin
    .from('monitoring_events')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error)
    return res.status(500).json({ error: error.message })

 return   res.json(data)
})



module.exports = router;