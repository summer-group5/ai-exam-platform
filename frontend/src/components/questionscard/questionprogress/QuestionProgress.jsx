import React from 'react';
import'./QuestionProgress.css'
export default function QuestionProgress({
  questions,
  currentQuestion,
  setCurrentQuestion,
  answers
}) {
  return (
    <div className="question-list">

      <h2>QUESTIONS</h2>

      {questions.map((question, index) => {
           const isDone = answers[index] !== undefined;
    
    return (
           <div
  key={index}
  className={`
    question-progress-card
    ${isDone ? 'done' : ''}
    ${currentQuestion === index ? 'current' : ''}
  `}
  onClick={() => setCurrentQuestion(index)}
>

  <span className="question-number">
    {index + 1}
  </span>

  <span className="question-status">
    {
      isDone
      ? 'Done'
      : currentQuestion === index
      ? 'Current'
      : ''
    }
  </span>

</div>

      ); })}

    </div>
  );
}