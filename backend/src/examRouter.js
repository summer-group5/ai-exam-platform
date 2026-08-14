const express = require("express");
const { supabaseAdmin } = require("./supabaseAdmin");

const router = express.Router({ mergeParams: true });

// GET /api/courses/:courseId/exam
router.get("/", async (req, res) => {
  const { courseId } = req.params;

  const { data, error } = await supabaseAdmin
    .from("exams")
    .select("*")
    .eq("course_id", courseId)
    .single();

  if (error) {
    return res.status(404).json({
      error: "Exam not found"
    });
  }

  res.json(data);
});

module.exports = router;