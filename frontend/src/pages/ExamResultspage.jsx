import React from 'react'
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
import './ExamResultspage.css'


export default function ExamResultspage() {
  
    const location = useLocation();
    const score = location.state?.score ?? 0;
    const navigate = useNavigate();
    const { id } = useParams();
    const questions = location.state?.questions ?? [];
    const answers = location.state?.answers ?? [];
    
// max score for different points weights 
   const maxScore = questions.reduce(
  (sum, q) => sum + (q.points ?? 1),
  0
);



    const goTocourse = () => {
 
    alert('All answers are saved and submitted');
   
    // Example:
    // send answers to backend
    
    navigate(`/Coursepage/${id}`, 
     
  );
  
};

    if (!questions.length) {
    return (
      <div className="exam-results-page">
        <h3>No exam results found</h3>
      </div>
    );
  }
    return (
    
    <div className='exam-results-page'>
        
    <div className="results-header"><h1 className='results-heding'>Exam Results</h1></div>
    <div className="results-container">  
      {questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        return (
           <div
  key={index}
  className={`question-result ${
    isCorrect
      ? 'correct-answer'
      : 'wrong-answer'
  }`}
>
              <h3>
                Question {index + 1}
              </h3>

              <h3>
                {question.title}
              </h3>

              <p>
                Your answer:
                {" "}
                {userAnswer ?? 'No answer'}
              </p>

              <p>
                Correct answer:
                {" "}
                {question.correctAnswer}
              </p>

      <p className="result-status">
  {isCorrect
    ? `✅ Correct — ${question.points ?? 1} point(s)`
    : '❌ Incorrect — 0 points'}
</p>

              

            </div>
          );
        })}

   <h2 className="total-score">
  Total points: {score} / {maxScore}
</h2>
    
<button className='return-btn' onClick={goTocourse}>Return to Course</button>
</div> 
        </div>



)
}
