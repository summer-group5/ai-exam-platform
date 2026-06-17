export function evaluateExam(question, answers) {
    let score =0;

    questions.forEach((question, index) => {
        if (answers[index]=== question.correctAnswer) {
            score+= question.points ?? 1;
        }
    })
    return score;
}
