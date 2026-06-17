import React from 'react'

import { useLocation } from 'react-router-dom';


export default function ExamResultspage() {
  
    const location = useLocation();

    const score = location.state?.score ?? 0;

  
    return (
    
    <div className='exam-results-page'>
        
        <h1>Exam Results</h1>
      <p>Score: {score}</p>
        
        </div>
  )
}
