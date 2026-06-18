import React from 'react'
import ExamTimer from '../components/timer/ExamTimer'
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import './SubmitExampage.css'

import { evaluateExam } from '../services/examEvaluator'; // imported exam evaluator as service

export default function SubmitExampage() {
 
    
 // timer protype constants
   const location = useLocation();
   const exam = location.state?.exam;
   const timeLimit = location.state?.timeLimit ?? 60;
 


const navigate = useNavigate();
const { id } = useParams();
 
  const answers = location.state?.answers ?? [];
  const questions = location.state?.questions ?? [];



 const handleSubmit = () => {
  try {
    console.log('Submitted answers:', answers);
   
    alert('All answers are saved and submitted');
    const score = evaluateExam(questions, answers);
    // Example:
    // send answers to backend
    // navigate('/results')
    // calculate score

    navigate(`/Coursepage/${id}/exam/results`, {
      state: { 
        score,
        questions,
        answers


       }
    });
  } catch (err) {
    console.error(err);
    alert('Cannot evaluate exam: missing data');
  }
};


 
const returnToExam = () => {

 navigate(`/Coursepage/${id}/exam`, {
    state: {
      exam,
      timeLimit,
      answers,
      questions
  
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
<h3 className='submit-heading'>Are you sure to submit all answers and return to course page ?</h3>

<button className='submit-btn' type='submit' onClick={handleSubmit}>Submit all tasks and return to course</button>

<button className='submit-btn' onClick={returnToExam}>Return to exam</button>

</section>
        
        
        </div>
  )
}
