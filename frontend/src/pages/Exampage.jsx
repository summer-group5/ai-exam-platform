//Exampage.jsx
import React, {useState, useEffect} from 'react'
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';



export default function Exampage() {
const location = useLocation();
const [currentQuestion, setCurrentQuestion] = useState(
  location.state?.currentQuestion ?? 0
);

// tab change costants
const [tabWarnings, setTabWarnings] = useState(0);
const [tabWarningVisible, setTabWarningVisible] = useState(false);

const [answers, setAnswers] = useState(
  location.state?.answers ?? []
);


// fullscreen nitification for demo exam
const [fullscreenWarning, setFullscreenWarning] = useState(false);
const [fullscreenViolations, setFullscreenViolations] = useState(0);



// exam demo 
const isDemo = location.state?.demo ?? false;
 const timeLimit = location.state?.timeLimit || (isDemo ? 5 : 60);
  
  
  const navigate = useNavigate();// navigation to submit page
  const isAnswered = (index) => answers[index] !== undefined;
  const { id } = useParams();
  
  // timer protype constants
  const exam = location.state?.exam;
 
  

  
  const questions = [
  {
    title: 'What does the acronym HTTP stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Transfer Text Process',
      'Hyper Transfer Tool Protocol',
      'Host Transfer Text Protocol'
    ],
   
  },

  {
    title: 'Which HTML tag creates a hyperlink?',
    options: [
      '<a>',
      '<link>',
      '<href>',
      '<url>'
    ],
  
  },

  {
    title: 'Which CSS property changes text color?',
    options: [
      'color',
      'font-color',
      'text-style',
      'background'
    ],
 
  },

  {
    title: 'What is React mainly used for?',
    options: [
      'Building user interfaces',
      'Database management',
      'Server hosting',
      'Operating systems'
    ],

  },

  {
    title: 'Which JavaScript method prints to the browser console?',
    options: [
      'console.log()',
      'print()',
      'write()',
      'display()'
    ],
  
  }
];

// navigating to submit page
const goToSubmitPage = () => {
  
   if (isDemo) {
    alert('Demo completed. No answers were submitted.');
    navigate(`/Coursepage/${id}`);
    return;
  }
  navigate(`/Coursepage/${id}/exam/submit`, {
    state: {
      exam,
      timeLimit,
      answers
      
    }
  });
};


const handleSubmit = () => {
  console.log('Submitted answers:', answers);
  alert('time is up.')
  alert('All answers are saved and submitted')
  // Example: 
  // send answers to backend
  // navigate('/results')
  // calculate score
}; 

useEffect(() => {

  const startFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen denied");
    }
  };

  startFullscreen();

}, []);




// check fullsceen exit
useEffect(() => {

  let wasFullscreen = true;

  const checkFullscreen = () => {

    const browserFullscreen =
      window.innerHeight === screen.height;

    const apiFullscreen =
      !!document.fullscreenElement;

    const fullscreen =
      browserFullscreen || apiFullscreen;

    // count only transition fullscreen → not fullscreen
    if (wasFullscreen && !fullscreen) {

      setFullscreenWarning(true);

      setFullscreenViolations(prev => prev + 1);

      if (isDemo) {
        alert(
          'Demo notice: You exited fullscreen. In real exam this will be recorded'
        );
      } else {
        alert(
          'Warning: Fullscreen exited.'
        );
      }

    }

    // hide warning when returning
    if (fullscreen) {
      setFullscreenWarning(false);
    }

    wasFullscreen = fullscreen;
  };

  document.addEventListener(
    'fullscreenchange',
    checkFullscreen
  );

  window.addEventListener(
    'resize',
    checkFullscreen
  );

  return () => {

    document.removeEventListener(
      'fullscreenchange',
      checkFullscreen
    );

    window.removeEventListener(
      'resize',
      checkFullscreen
    );

  };

}, [isDemo]);


// return to fullscreen button
const returnFullscreen = async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch {
    alert('Could not enter fullscreen');
  }
};


useEffect(() => {

  const handleVisibilityChange = () => {

    const hidden =
      document.visibilityState === 'hidden';

    if (hidden) {

      setTabWarningVisible(true);

      setTabWarnings(prev => prev + 1);

      if (isDemo) {
        alert(
          'Demo notice: You left the exam tab.'
        );
      } else {
        alert(
          'Warning: Tab switch detected.'
        );
      }

    } else {

      setTabWarningVisible(false);

    }
  };

  document.addEventListener(
    'visibilitychange',
    handleVisibilityChange
  );

  return () => {
    document.removeEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
  };

}, [isDemo]);




    return (
 
 <div className='exam-page'>
      


        <div className="exam-header">
            <h1> {isDemo ? 'Exam Demo' : 'Final Exam'}</h1>
             {fullscreenWarning && (
<div className="fullscreen-alert">

  <p>⚠️ Fullscreen exited</p>

  <p>Warnings: {fullscreenViolations}</p>

  <button onClick={returnFullscreen}>
    Return to fullscreen
  </button>

</div>
)}
      
       <div className="timer-container">
      
        <span className="timer-span"><ExamTimer
 
   initialHours={Math.floor(timeLimit / 60)}
  initialMinutes={timeLimit % 60}
  onFinish={handleSubmit}
/></span>
        
  


       </div>
       {!isDemo && (

      
        <div className="monitor-container">
          
           <span className="monitor-span">  
            Monitoring active</span>
        
        </div>
         ) }
         
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
  setAnswers((prev) => ({
    ...prev,
    [currentQuestion]: answer
  }))
}
        />
        
        </section>   
           
        </div>
      
        
        
        </div>
  )
}

