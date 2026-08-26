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

router.post('/exam-sessions', requireAuth, async (req, res) => {
  try {
    const { exam_id } = req.body;

    if (!exam_id) {
      return res.status(400).json({
        error: 'exam_id is required'
      });
    }

    // Check that exam exists
    const { data: exam, error: examError } = await supabaseAdmin
      .from('exams')
      .select('id, course_id, title')
      .eq('id', exam_id)
      .single();

    if (examError || !exam) {
      return res.status(404).json({
        error: 'Exam not found'
      });
    }

    // Create session
    const { data: session, error: sessionError } =
      await supabaseAdmin
        .from('exam_sessions')
        .insert({
          exam_id: exam_id,
          student_id: req.user.id,
          attempt_number: 1,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

    if (sessionError) {
      console.error('Failed to create exam session:', sessionError);

      return res.status(500).json({
        error: sessionError.message
      });
    }

    return res.status(201).json(session);

  } catch (error) {
    console.error('Create session error:', error);

    return res.status(500).json({
      error: error.message
    });
  }
});




//POST /api/exam-sessions/:sessionId/events
router.post(
  '/exam-sessions/:sessionId/events',
  requireAuth,
  async (req, res) => {

    const { sessionId } = req.params;

    const {
      type,
      duration_ms = 0,
      details
    } = req.body;

    if (!type) {
      return res.status(400).json({
        error: 'type is required'
      });
    }

    // Find session
    const { data: session, error: sessionError } =
      await supabaseAdmin
        .from('exam_sessions')
        .select('id, student_id')
        .eq('id', sessionId)
        .single();

    if (sessionError || !session) {
      return res.status(404).json({
        error: 'Exam session not found'
      });
    }

    // Make sure this session belongs to the logged-in student
    if (session.student_id !== req.user.id) {
      return res.status(403).json({
        error: 'You do not own this exam session'
      });
    }

    // Insert monitoring event
    const { data, error } = await supabaseAdmin
      .from('monitoring_events')
      .insert({
        session_id: sessionId,
        type,
        duration_ms,
        details
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to insert monitoring event:', error);

      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(201).json(data);
  }
);


//GET /api/monitoring/courses/:courseId/events


router.get(
  '/monitoring/courses/:courseId/sessions',
  requireAuth,
  requireCourseOwner,
  async (req, res) => {
    try {
      const { courseId } = req.params;
       
      const { data: sessions, error } =
        await supabaseAdmin
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
              ),
              users!exam_sessions_student_id_fkey (
              id,
              name,
              email
              )
          `)
          .eq('exams.course_id', courseId)
          .order('started_at', {
            ascending: false
          });

      if (error) {
        console.error(
          'Failed to get exam sessions:',
          error
        );

        return res.status(500).json({
          error: error.message
        });
      }

      return res.json(sessions);

    } catch (error) {
      console.error('Get sessions error:', error);

      return res.status(500).json({
        error: error.message
      });
    }
  }
);


// GET /api/monitoring/courses/:courseId/events

router.get(
  '/monitoring/courses/:courseId/events',
  requireAuth,
  requireCourseOwner,
  async (req, res) => {
    const { courseId } = req.params;
try {
    const { data, error } = await supabaseAdmin
      .from('exam_sessions')
      .select(`
        id,
        exam_id,
        student_id,
        attempt_number,
        status,
        started_at,
        final_score,

        exams!inner (
        id,
        course_id,
        title),
        users!exam_sessions_student_id_fkey (
            id,
            name,
            email
          ),

          monitoring_events (
            id,
            type,
            duration_ms,
            details,
            created_at
          )
      `)
      .eq('exams.course_id', courseId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Failed to get monitoring events:', error);

      return res.status(500).json({
        error: error.message
      });
    }
    return res.json(data);
    }   catch (error) {
        console.error('Get monitoring events error:', error);
        return res.status(500).json({
        error: error.message
      });
    
    }
      
  }
);



// POST /api/exam-sessions/:sessionId/submit
router.post('/exam-sessions/:sessionId/submit', requireAuth, async (req, res) => {
  const { sessionId } = req.params;
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array' });
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('exam_sessions')
    .select('id, student_id, status, exam_id')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return res.status(404).json({ error: 'Exam session not found' });
  }

  if (session.student_id !== req.user.id) {
    return res.status(403).json({ error: 'You do not own this exam session' });
  }

  if (session.status === 'submitted') {
    return res.status(409).json({ error: 'Exam already submitted' });
  }

  const { data: questions, error: questionsError } = await supabaseAdmin
    .from('questions')
    .select('id, max_points, question_options(id, is_correct)')
    .eq('exam_id', session.exam_id);

  if (questionsError) {
    return res.status(500).json({ error: questionsError.message });
  }

  let score = 0;
  let maxScore = 0;
  const answerRows = [];

  for (const question of questions) {
    const qMaxPoints = question.max_points ?? 1;
    maxScore += qMaxPoints;

    const submitted = answers.find(a => a.question_id === question.id);
    if (!submitted) continue;

    const selectedOption = question.question_options.find(o => o.id === submitted.option_id);
    const earnedPoints = selectedOption?.is_correct ? qMaxPoints : 0;
    score += earnedPoints;

    answerRows.push({
      session_id: sessionId,
      question_id: question.id,
      selected_option_id: submitted.option_id,
      score: earnedPoints
    });
  }

  if (answerRows.length > 0) {
    const { error: answersError } = await supabaseAdmin
      .from('answers')
      .insert(answerRows);

    if (answersError) {
      return res.status(500).json({ error: answersError.message });
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('exam_sessions')
    .update({
      status: 'submitted',
      final_score: score,
      submitted_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.status(200).json({ score, max_score: maxScore });
});

module.exports = router;