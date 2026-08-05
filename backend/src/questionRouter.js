const express = require("express");
const { supabaseAdmin } = require("./supabaseAdmin");

const router = express.Router();


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


// GET /api/exams/:examId/questions
router.get("/:examId/questions", requireAuth, async (req, res) => {
  const { examId } = req.params;

  const { data, error } = await supabaseAdmin
    .from("questions")
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
    .eq("exam_id", examId)
    .order("order_number");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

module.exports = router;