import React from 'react'


export default function Questionscard( {
     questionNumber,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  setSelectedAnswer

  }) {
  
    return (

    <div className="question-container">
                 
                 <h2>QUESTIONS {questionNumber}  OF {totalQuestions}</h2>
         <h3>{question}</h3>
                  
           <div className="question-options">

  {options.map((option) => (
    <div className="option" key={option}>
    
    <input
      type="radio"
      name="exam-question"
      value={option}
      checked={selectedAnswer === option}
      onChange={(e) => setSelectedAnswer(e.target.value)}
     
    />
 

    <span>{option}</span>
  
  </div>

   ))}
   
  </div>

</div>   
           
           
   
    
  )
}
