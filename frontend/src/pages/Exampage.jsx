import React, { useEffect, useState } from 'react';
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createExamSession } from '../services/monitoringService';
import { logMonitoringEvent } from '../services/monitoringService';
import { Toaster, toast } from 'react-hot-toast';

import { getExam } from "../services/examService";
import { getExamQuestions } from '../services/questionService';

export default function Exampage() {
const [exam, setExam] = useState(null);
 console.log("Exampage rendered");

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
  

  const [sessionId, setSessionId] = useState(null);
 
  // introduction before exam demo
  const [showIntro, setShowIntro] = useState(true);

console.log("location.state =", location.state);
console.log("isDemo =", isDemo);
console.log("showIntro =", showIntro);

const [questions, setQuestions] = useState([]);

useEffect(() => {
  if (showIntro) return;

  if (isDemo) {
    setQuestions(
      demoQuestions.map(q => ({
        title: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    );

    setExam({
      title: "Demo Exam"
    });

    return;
  }

  async function loadQuestions() {
    try {
      const loadedExam = await getExam(id);

      setExam(loadedExam);

      const data = await getExamQuestions(loadedExam.id);

      const formatted = data.map(q => ({
        title: q.question_text,
        options: q.question_options.map(o => o.option_text),
        correctAnswer:
          q.question_options.find(o => o.is_correct)?.option_text
      }));

      setQuestions(formatted);

    } catch (err) {
      console.error(err);
    }
  }

  loadQuestions();

}, [id, showIntro, isDemo]);


console.log("Course ID:", id);
console.log("Exam:", exam);


// session use effect
useEffect(() => {
  if (showIntro) return;

  if (isDemo) return;

  async function startSession() {
    try {
      const loadedExam = await getExam(id);

      setExam(loadedExam);

      const session = await createExamSession(loadedExam.id);

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

}, [id, showIntro, isDemo]);

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

// handle submit
const handleSubmit = async () => {

    if (isDemo) {
        alert("Demo completed.");
        navigate(`/Coursepage/${id}`);
        return;
    }

    if (sessionId) {
        await logMonitoringEvent(sessionId, {
            type: "EXAM_SUBMITTED",
            details: "Student submitted the exam"
        });
    }

    navigate(`/Coursepage/${id}/exam/submit`, {
        state: {
            exam,
            answers
        }
    });
};

// new fullscreen exit
useEffect(() => {
  let wasFullscreen = true;

  const handleFullscreenChange = async () => {
    const fullscreen =
      !!document.fullscreenElement ||
      window.innerHeight === screen.height;

    if (wasFullscreen && !fullscreen) {

      setFullscreenViolations(prev => prev + 1);
      setFullscreenWarning(true);

      if (sessionId) {
        try {
          await logMonitoringEvent(sessionId, {
            type: "FULLSCREEN_EXIT",
            details: "Student exited fullscreen"
          });
        } catch (err) {
          console.error(err);
        }
      }

      toast(
        isDemo
          ? "Demo: Fullscreen exited."
          : "Warning: Fullscreen exited."
      );
    }

    if (fullscreen) {
      setFullscreenWarning(false);
    }

    wasFullscreen = fullscreen;
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  window.addEventListener("resize", handleFullscreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    window.removeEventListener("resize", handleFullscreenChange);
  };
}, [sessionId, isDemo]);

// return to fullscreen button
const returnFullscreen = async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch {
    alert('Could not enter fullscreen');
  }
};

useEffect(() => {
  const handleVisibilityChange = async () => {
    if (!document.hidden) return;

    setTabWarnings(prev => prev + 1);
    setTabWarningVisible(true);

    if (sessionId) {
      try {
        await logMonitoringEvent(sessionId, {
          type: "TAB_CHANGE",
          details: "Student switched browser tab"
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (isDemo) {
      toast("Demo: Browser tab change detected.");
    } else {
      toast("Warning: Browser tab changed.");
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [sessionId, isDemo]);

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


const demoQuestions = [
  {
    id: 1,
    question: "Which keyword declares a variable in Java?",
    options: ["type", "var", "declare", "define"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which collection does not allow duplicates?",
    options: ["List", "Queue", "Set", "Array"],
    correctAnswer: 2,
  },
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
{cameraError && (
  <p className="camera-error">
    {cameraError}
  </p>
)}
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

if (questions.length === 0) {
  return <div>Loading exam...</div>;
}

    return (
   
   <>
  <Toaster position="top-right" />

  {isDemo && tutorialStep >= 0 && (
    <div className="tutorial-overlay">
      <div className="tutorial-box">
        <h3>Training Tutorial</h3>

        <p>{tutorial[tutorialStep]}</p>

        <div className="tutorial-buttons">
          <button
            disabled={tutorialStep === 0}
            onClick={() => setTutorialStep(prev => prev - 1)}
          >
            Previous
          </button>

          <button
            onClick={() => {
              if (tutorialStep === tutorial.length - 1) {
                setTutorialStep(-1);
              } else {
                setTutorialStep(prev => prev + 1);
              }
            }}
          >
            {tutorialStep === tutorial.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )}
 
 
 <div className='exam-page'>
      
        <div className="exam-header">
           <h1>{isDemo ? "Demo Exam" : exam?.title}</h1>
       <div  className={
    tutorialStep === 1
      ? "timer-container highlight"
      : "timer-container"
  }>
        
        <span className="timer-span"><ExamTimer
 
   initialHours={Math.floor(timeLimit / 60)}
  initialMinutes={timeLimit % 60}
  onFinish={handleSubmit}
/></span>
          
       </div>
        <div className={
    tutorialStep === 2
      ? "monitor-container highlight"
      : "monitor-container"
  }>
           <span className="monitor-span">  Monitoring active</span>
        
        </div>
          
         </div> 
       
       <div className="row-container">
        <section className='exam-section'>
        
        <div className={
    tutorialStep === 3
      ? "progress-bar highlight"
      : "progress-bar"
  }>
         <QuestionProgress
  questions={questions}
  currentQuestion={currentQuestion}
  setCurrentQuestion={setCurrentQuestion}
  answers= {answers}
/>
         <div className={
    tutorialStep === 5
      ? "button-container highlight"
      : "button-container"
  }>
            <button className='submit'id="submit-grad" onClick={goToSubmitPage}>Submit</button>
          </div> 
       
        </div> 
         </section>
           
            <section className='exam-section'>
           <div
  className={
    tutorialStep === 4
      ? "highlight"
      : ""
  }
>
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
</div>  
        
        
        
        </section>   
           
        </div>
      
             
        
        </div>
        </>
  )
}
