import React, { useEffect, useState } from 'react';
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createExamSession } from '../services/monitoringService';
import { logMonitoringEvent } from '../services/monitoringService';



export default function Exampage() {

 console.log("Exampage rendered");

  const location = useLocation();
const [currentQuestion, setCurrentQuestion] = useState(
  location.state?.currentQuestion ?? 0
);
const [answers, setAnswers] = useState(
  location.state?.answers ?? []
);

  const navigate = useNavigate();// navigation to submit page
  const isAnswered = (index) => answers[index] !== undefined;
  const { id } = useParams();
  
  // timer protype constants
  const exam = location.state?.exam;
  const timeLimit = location.state?.timeLimit ?? 60;

  const [sessionId, setSessionId] = useState(null);



  const questions = [
  {
    title: 'What does the acronym HTTP stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Transfer Text Process',
      'Hyper Transfer Tool Protocol',
      'Host Transfer Text Protocol'
    ],
    correctAnswer: 'HyperText Transfer Protocol'
  },

  {
    title: 'Which HTML tag creates a hyperlink?',
    options: [
      '<a>',
      '<link>',
      '<href>',
      '<url>'
    ],
    correctAnswer: '<a>'
  },

  {
    title: 'Which CSS property changes text color?',
    options: [
      'color',
      'font-color',
      'text-style',
      'background'
    ],
    correctAnswer: 'color'
  },

  {
    title: 'What is React mainly used for?',
    options: [
      'Building user interfaces',
      'Database management',
      'Server hosting',
      'Operating systems'
    ],
    correctAnswer: 'Building user interfaces'
  },

  {
    title: 'Which JavaScript method prints to the browser console?',
    options: [
      'console.log()',
      'print()',
      'write()',
      'display()'
    ],
    correctAnswer: 'console.log()'
  }
];
console.log("Course ID:", id);
console.log("Exam:", exam);
// session use effect
useEffect(() => {
  async function startSession() {
    try {
      const session = await createExamSession(id);

      setSessionId(session.id);

      await logMonitoringEvent(session.id, {
        type: "EXAM_STARTED",
        details: "Student started the exam"
      });

    } catch (err) {
      console.error(err);
    }
  }

  startSession();
}, [id]);

// tab changes
useEffect(() => {
  if (!sessionId) return;

  const handleVisibility = async () => {
    if (document.hidden) {
      try {
        await logMonitoringEvent(sessionId, {
          type: "TAB_CHANGE",
          details: "Student switched browser tab"
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibility
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibility
    );
  };

}, [sessionId]);


// detect screen changes 

useEffect(() => {
  if (!sessionId) return;

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await logMonitoringEvent(sessionId, {
          type: "FULLSCREEN_EXIT",
          details: "Student exited fullscreen"
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreen
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreen
    );
  };

}, [sessionId]);






// navigating to submit page
const goToSubmitPage = () => {
  navigate(`/Coursepage/${id}/exam/submit`, {
    state: {
      exam,
      timeLimit,
      answers
      
    }
  });
};

// handle submit
const handleSubmit =  async () => {
 
   if (sessionId) {
    await logMonitoringEvent(sessionId, {
      type: "EXAM_SUBMITTED",
      details: "Student submitted the exam"
    });
  }
 
 
  console.log('Submitted answers:', answers);
  alert('time is up.')
  alert('All answers are saved and submitted')
   navigate(`/Coursepage/${id}/exam/submit`, {
    state: {
      exam,
      answers
    }
 
  // Example: 
  // send answers to backend
  // navigate('/results')
  // calculate score
 });
};


    return (
 
 <div className='exam-page'>
      
        <div className="exam-header">
            <h1>Final Exam</h1>
       <div className="timer-container">
        
        <span className="timer-span"><ExamTimer
 
   initialHours={Math.floor(timeLimit / 60)}
  initialMinutes={timeLimit % 60}
  onFinish={handleSubmit}
/></span>
        
       


       </div>
        <div className="monitor-container">
           <span className="monitor-span">  Monitoring active</span>
        
        </div>
         
         
         </div> 
       
       <div className="row-container">
        <section className='exam-section'>
        
        <div className="progress-bar">
         <QuestionProgress
  questions={questions}
  currentQuestion={currentQuestion}
  setCurrentQuestion={setCurrentQuestion}
  answers= {answers}
/>
         <div className="button-container">
            <button className='submit'id="submit-grad" onClick={goToSubmitPage}>Submit</button>
          </div> 
       
        </div> 
         </section>
           
            <section className='exam-section'>
             
        <Questionscard
          questionNumber={currentQuestion+1}
          totalQuestions={questions.length}
          question={questions[currentQuestion].title}
          options={questions[currentQuestion].options}
          selectedAnswer={answers[currentQuestion]}
setSelectedAnswer={(answer) =>
  setAnswers((prev) => {
    const newAnswers = [...prev];      // create copy of array
    newAnswers[currentQuestion] = answer; // updates index of current question
    return newAnswers;
  })
  
}
        />
        
        </section>   
           
        </div>
      
             
        
        </div>
  )
}
