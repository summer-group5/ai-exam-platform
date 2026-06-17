import React from 'react'
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
import './ExamResultspage.css'


export default function ExamResultspage() {
  
    const location = useLocation();
    const score = location.state?.score ?? 0;
    const navigate = useNavigate();
    const { id } = useParams();


    const goTocourse = () => {
 
    alert('All answers are saved and submitted');
   
    // Example:
    // send answers to backend
    
    navigate(`/Coursepage/${id}`, {
     
    });
  
};

  
    return (
    
    <div className='exam-results-page'>
        
    <div className="results-header"><h1 className='results-heding'>Exam Results</h1></div>
    <div className="results-container">  
      
       <p>Question 1</p>
        <p>right answer here </p>
            <p>points from question1 1point(s)</p>
        <p>Question 2</p>
 <p>right answer here </p>
<p>points from question2 1point(s)</p>
        <p>Question 3</p>
 <p>right answer here </p> <p>points from question3 0point(s)</p>
      <p>Total points: {score}</p>
        
<button className='return-btn' onClick={goTocourse}> return to course</button>
</div> 
        </div>



)
}
