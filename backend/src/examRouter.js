const express = require("express");
const { supabaseAdmin } = require("./supabaseAdmin");

const router = express.Router({ mergeParams: true });

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
}

async function requireCourseOwner(req, res, next) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  const { data: course, error: courseError } = await supabaseAdmin
    .from('courses')
    .select('teacher_id')
    .eq('id', req.params.courseId)
    .single();

  if (courseError || !course) return res.status(404).json({ error: 'Course not found' });
  if (course.teacher_id !== user.id) return res.status(403).json({ error: 'Forbidden' });

  req.user = user;
  next();
}

// GET /api/courses/:courseId/exam/my-session
router.get("/my-session", requireAuth, async (req, res) => {
  const { courseId } = req.params;

  const { data: exam, error: examError } = await supabaseAdmin
    .from('exams')
    .select('id')
    .eq('course_id', courseId)
    .single();

  if (examError || !exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('exam_sessions')
    .select('id, status, final_score, started_at, submitted_at')
    .eq('exam_id', exam.id)
    .eq('student_id', req.user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) return res.status(500).json({ error: sessionError.message });
  if (!session) return res.status(404).json({ error: 'No session found' });

  const { data: questions } = await supabaseAdmin
    .from('questions')
    .select('max_points')
    .eq('exam_id', exam.id);

  const maxScore = (questions ?? []).reduce((sum, q) => sum + (q.max_points ?? 1), 0);

  return res.json({ ...session, max_score: maxScore });
});

// GET /api/courses/:courseId/exam
router.get("/", async (req, res) => {
  const { courseId } = req.params;

  const { data, error } = await supabaseAdmin
    .from("exams")
    .select("*")
    .eq("course_id", courseId)
    .single();

  if (error) {
    return res.status(404).json({ error: "Exam not found" });
  }

  res.json(data);
});

// POST /api/courses/:courseId/exam
router.post("/", requireCourseOwner, async (req, res) => {
  const { courseId } = req.params;
  const { title, duration_minutes, start_time } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const { data: existing } = await supabaseAdmin
    .from('exams')
    .select('id')
    .eq('course_id', courseId)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ error: 'An exam already exists for this course' });
  }

  const { data, error } = await supabaseAdmin
    .from('exams')
    .insert({
      course_id: courseId,
      title,
      duration_minutes: duration_minutes ?? 60,
      start_time: start_time ?? null
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data);
});

// POST /api/courses/:courseId/exam/questions
router.post("/questions", requireCourseOwner, async (req, res) => {
  const { courseId } = req.params;
  const { question_text, order_number } = req.body;

  if (!question_text) {
    return res.status(400).json({ error: 'question_text is required' });
  }

  const { data: exam, error: examError } = await supabaseAdmin
    .from('exams')
    .select('id')
    .eq('course_id', courseId)
    .single();

  if (examError || !exam) {
    return res.status(404).json({ error: 'Exam not found for this course' });
  }

  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({
      exam_id: exam.id,
      question_text,
      question_type: 'multiple_choice',
      order_number: order_number ?? 1,
      max_points: 1
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data);
});

// POST /api/courses/:courseId/exam/questions/:questionId/options
router.post("/questions/:questionId/options", requireCourseOwner, async (req, res) => {
  const { questionId } = req.params;
  const { option_text, is_correct } = req.body;

  if (!option_text) {
    return res.status(400).json({ error: 'option_text is required' });
  }

  const { data, error } = await supabaseAdmin
    .from('question_options')
    .insert({
      question_id: questionId,
      option_text,
      is_correct: is_correct ?? false
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data);
});

// DELETE /api/courses/:courseId/exam/questions/:questionId
router.delete("/questions/:questionId", requireCourseOwner, async (req, res) => {
  const { questionId } = req.params;

  const { error } = await supabaseAdmin
    .from('questions')
    .delete()
    .eq('id', questionId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(204).send();
});

module.exports = router;
