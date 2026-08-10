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

// require course owner
async function requireCourseOwner(req, res, next) {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({
      error: 'courseId is required'
    });
  }

  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select('id, teacher_id')
    .eq('id', courseId)
    .single();

  if (error || !course) {
    return res.status(404).json({
      error: 'Course not found'
    });
  }

  if (course.teacher_id !== req.user.id) {
    return res.status(403).json({
      error: 'You are not the owner of this course'
    });
  }

  req.course = course;

  next();
}
// POST /api/courses/:courseId/exam-sessions
router.post('/exam-sessions', requireAuth, async (req, res) => {
  const { exam_id } = req.body;

  if (!exam_id) {
    return res.status(400).json({
      error: 'exam_id is required'
    });
  }

  const { data, error } = await supabaseAdmin
    .from('exam_sessions')
    .insert({
      exam_id,
      student_id: req.user.id,
      attempt_number: 1,
      status: 'active',
      started_at: new Date()
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});




//POST /api/exam-sessions/:sessionId/events
router.post('/exam-sessions/:sessionId/events', requireAuth, async (req, res) => {
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

router.get('/exam-sessions/:sessionId/events', requireAuth, async (req, res) => {
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



// GET /api/monitoring/courses/:courseId/sessions
 

router.get(
  '/monitoring/courses/:courseId/sessions',
  requireAuth,
  requireCourseOwner,
  async (req, res) => {
    const { courseId } = req.params;

    const { data: sessions, error } = await supabaseAdmin
      .from('exam_sessions')
      .select(`
        id,
        exam_id,
        student_id,
        attempt_number,
        status,
        started_at,
        exams!inner (
          id,
          course_id,
          title
        )
      `)
      .eq('exams.course_id', courseId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Failed to get exam sessions:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    // Get unique student IDs
    const studentIds = [
      ...new Set(
        sessions
          .map(session => session.student_id)
          .filter(Boolean)
      )
    ];

    let students = [];

    if (studentIds.length > 0) {
      const { data: studentData, error: studentError } =
        await supabaseAdmin
          .from('users')
          .select('id, name, email')
          .in('id', studentIds);

      if (studentError) {
        console.error('Failed to get students:', studentError);

        return res.status(500).json({
          error: studentError.message
        });
      }

      students = studentData ?? [];
    }

    // Add student information to each session
    const sessionsWithStudents = sessions.map(session => ({
      ...session,
      student: students.find(
        student => student.id === session.student_id
      ) ?? null
    }));

    return res.json(sessionsWithStudents);
  }
);



/*router.get(
  '/monitoring/courses/:courseId/sessions',
  requireAuth,
  requireCourseOwner,
  async (req, res) => {
    const { courseId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('exam_sessions')
      .select(`
        id,
    exam_id,
    student_id,
    attempt_number,
    status,
    started_at,
    exams!inner (
      id,
      course_id,
      title
        )
      `)
      .eq('exams.course_id', courseId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Failed to get exam sessions:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  }
);
*/




// GET /api/monitoring/courses/:courseId/events

router.get(
  '/monitoring/courses/:courseId/events',
  requireAuth,
  requireCourseOwner,
  async (req, res) => {
    const { courseId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('monitoring_events')
      .select(`
        id,
        session_id,
        type,
        duration_ms,
        details,
        created_at,
        exam_sessions!inner (
          id,
          student_id,
          exam_id,
          exams!inner (
            id,
            course_id
          )
        )
      `)
      .eq('exam_sessions.exams.course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get monitoring events:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    return res.json(data);
  }
);



module.exports = router;