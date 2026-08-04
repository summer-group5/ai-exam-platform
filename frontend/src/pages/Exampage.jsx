//Exampage.jsx
import React, {useState, useEffect} from 'react'
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';


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
 

  // introduction before exam demo
  const [showIntro, setShowIntro] = useState(isDemo);

  
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
      
      
        toast(
          'Demo notice: You exited fullscreen. In real exam this will be recorded',
         
        );
      } else {
        toast(
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
        
        toast('Demo: Browser tab change detected.');
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


// tutorial for exam demo
const [tutorialStep, setTutorialStep] = useState(
  isDemo ? 0 : -1
);

const tutorial = [
  'Welcome to exam training mode.',
  'This timer shows remaining exam time.',
  'This monitoring means that any exit from fullcreen may be recorded and any browser tab changes may be recorded ',
  'Use question navigation to move between tasks.',
  'Choose one answer for each question.',
  'Submit when finished.'
];

const [accepted, setAccepted] = useState(false);

const [cameraAllowed, setCameraAllowed] = useState(false);
const [cameraError, setCameraError] = useState('');
const [stream, setStream] = useState(null);


// requesting camera access

const requestCamera = async() => {
 try {
  const mediaStream = await navigator.mediaDevices.getUserMedia(
    {
      video: true,
      audio: false
    });

    setStream(mediaStream);
    setCameraAllowed(true);
    setCameraError('');

    return true; // fixed camera allowance and start exam functionality


    } catch (err) {

      setCameraAllowed(false);
      setCameraError('Camera acces is required to start the exam')
      
      return false;
  }

}; 
// camera stop use effect
useEffect(() => {
  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, [stream]);



if (showIntro) {
  return (
    <div className="exam-intro-overlay">

      <div className="exam-intro-box">

        <h2>Exam Instructions</h2>

        <p>
          Before starting, please read the following rules:
        </p>

        <ul>
          <li>Fullscreen mode will be required</li>
          <li>Leaving the tab may be recorded</li>
          <li>Exiting fullscreen may be recorded</li>
          <li>Timer starts immediately after start</li>
        </ul>

        {isDemo && (
          <p style={{ color: 'orange' }}>
            This is a training preview of monitoring features.
          </p>
        )}

<input
  type="checkbox"
  onChange={(e) => setAccepted(e.target.checked)}
/>
I understand the exam rules

        <button   disabled={!accepted}
  onClick={async () => {
    const success = await requestCamera();
  

    if (!success) return;

    setShowIntro(false);

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      toast.error("Fullscreen required");
    }

  }}
        >
          Start Exam
        </button>

      </div>

    </div>
  );
}

    return (
 
 <div className='exam-page'>
  
  <Toaster
position="top-center"
reverseOrder={false}
/>

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
      {tutorialStep >= 0 && (
<div className="tutorial-box">

<p>{tutorial[tutorialStep]}</p>

<button
onClick={() =>
setTutorialStep(prev =>
prev < tutorial.length - 1
? prev + 1
: -1
)}
>
Next
</button>

</div>
)}
      
      <div className={
tutorialStep === 1
? 'highlight'
: ''
}>
       <div className="timer-container">
      
        <span className="timer-span"><ExamTimer
 
   initialHours={Math.floor(timeLimit / 60)}
  initialMinutes={timeLimit % 60}
  onFinish={handleSubmit}
/></span>
        


       </div>
   </div>   
      <div className={
tutorialStep === 2
? 'highlight'
: ''
}>
   <div className="monitor-container">

<span className="monitor-span">

{isDemo
? 'Demo monitoring preview'
: 'Monitoring active'}

</span>

</div></div>
         
         </div> 
       
       <div className="row-container">
        <section className='exam-section'>
        
         <div className={
tutorialStep === 3
? 'highlight'
: ''
}> 
        <div className="progress-bar">
         <QuestionProgress
  questions={questions}
  currentQuestion={currentQuestion}
  setCurrentQuestion={setCurrentQuestion}
  answers= {answers}
/>
      </div> 
          <div className={
tutorialStep === 5
? 'highlight'
: ''
}>   
         <div className="button-container">
         
            <button className='submit'id="submit-grad" onClick={goToSubmitPage}>Submit</button>
         
          </div> 
         </div> 
        </div> 
         </section>
           
            <section className='exam-section'>
              <div className={
tutorialStep === 4
? 'highlight'
: ''
}>   
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
        /> </div> 
        
        </section>   
           
        </div>
      
        
        
        </div>
  )
}

