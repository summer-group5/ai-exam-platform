import React from 'react';
import'./QuestionProgress.css'
export default function QuestionProgress({
  questions,
  currentQuestion,
  setCurrentQuestion
}) {
  return (
    <div className="question-list">

      <h2>QUESTIONS</h2>

      {questions.map((question, index) => (

       <div
  key={index}
  className={`
    question-progress-card
    ${question.answered ? 'done' : ''}
    ${currentQuestion === index ? 'current' : ''}
  `}
  onClick={() => setCurrentQuestion(index)}
>

  <span className="question-number">
    {index + 1}
  </span>

  <span className="question-status">
    {
      question.answered
      ? 'Done'
      : currentQuestion === index
      ? 'Current'
      : ''
    }
  </span>

</div>

      ))}

    </div>
  );
}