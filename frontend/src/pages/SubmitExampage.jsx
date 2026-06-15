import React from 'react'
import ExamTimer from '../components/timer/ExamTimer'
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import './SubmitExampage.css'
export default function SubmitExampage() {
 
    
 // timer protype constants
   const location = useLocation();
   const exam = location.state?.exam;
   const timeLimit = location.state?.timeLimit ?? 60;
 

const navigate = useNavigate();
const { id } = useParams();
 

  
  const answers = location.state?.answers ?? [];

 const handleSubmit = () => {
  console.log('Submitted answers:', answers);
  alert('All answers are saved and submitted')
  // Example: 
  // send answers to backend
  // navigate('/results')
  // calculate score
    navigate(`/Coursepage/${id}/`)
}; 

const returnToExam = () => {

 navigate(`/Coursepage/${id}/exam`, {
    state: {
      exam,
      timeLimit,
      answers
    }
  });
};


    return (
    <div className='submit-exam-page'>
        <div className="submit-header">  
        
        <div className="timer-container">
      <span className="timer-span">
        <ExamTimer
          initialHours={Math.floor(timeLimit / 60)}
         initialMinutes={timeLimit % 60}
         onFinish={handleSubmit}
       /></span>    
       
        </div> 
     </div>



<section className='submit-section'>
<button type='submit' onClick={handleSubmit}>Submit all tasks and return to course</button>

<button onClick={returnToExam}>Return to exam</button>

</section>
        
        
        </div>
  )
}
