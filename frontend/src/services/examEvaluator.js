export function evaluateExam(questions, answers) {
  try {
    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      throw new Error("Invalid input: questions or answers missing");
    }

    let score = 0;

    questions.forEach((q, index) => {
      if (q.correctAnswer && answers[index] === q.correctAnswer) {
        score++;
      }
    });

    return score;

  } catch (error) {
    console.error("Evaluation failed:", error);
    return 0; // fallback score
  }
}