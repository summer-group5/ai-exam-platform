//Exampage.jsx
import React, { useEffect, useState } from 'react';
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createExamSession, logMonitoringEvent } from '../services/monitoringService';
import { Toaster, toast } from 'react-hot-toast';

import { getExam } from "../services/examService";
import { getExamQuestions } from '../services/questionService';



export default function Exampage() {
const [exam, setExam] = useState(null);
 
const [sessionId, setSessionId] = useState(null); // session id 
  
const location = useLocation();
const navigate = useNavigate();// navigation to submit page  
const { id } = useParams();


useEffect(() => {
  if (location.state?.exam) {
    setExam(location.state.exam)
  }
}, [location.state])


const [currentQuestion, setCurrentQuestion] = useState(location.state?.currentQuestion ?? 0);

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


  // introduction before exam demo
  const [showIntro, setShowIntro] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState('');

  useEffect(() => {
    if (!exam?.id) return;

    setQuestionsLoading(true);
    setQuestionsError('');

    getExamQuestions(exam.id)
      .then(data => {
        const mapped = data.map(q => ({
          id: q.id,
          title: q.question_text,
          options: q.question_options.map(o => o.option_text),
          question_options: q.question_options,
          correctAnswer: (q.question_options.find(o => o.is_correct) ?? {}).option_text ?? '',
          points: q.max_points ?? 1
        }));
        setQuestions(mapped);
      })
      .catch(err => {
        setQuestionsError('Failed to load exam questions: ' + err.message);
      })
      .finally(() => {
        setQuestionsLoading(false);
      });
  }, [exam]);


const handleStartExam = async () => {
  try {
    if (!exam?.id) return

    const cameraGranted = await requestCamera();
    if (!cameraGranted) return;

    const session = await createExamSession(exam.id)
    setSessionId(session.id)

    setShowIntro(false)

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      toast.error('Could not enter fullscreen');
    }

  } catch (error) {
    console.error('Failed to create exam session:', error)
    alert(`Could not start exam: ${error.message}`)
  }
}


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
      answers,
      questions,
      sessionId
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
            answers,
            questions
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
  'Exiting fullscreen or switching browser tabs may be recorded.',
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
      setCameraError('Camera access is required to start the exam.')
      
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
          <li>Timer starts immediately when you click Start</li>
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
{cameraAllowed && (
  <p className="camera-success">
    ✓ Camera access granted
  </p>
)}
{cameraError && (
  <p className="camera-error">
    {cameraError}
  </p>
)}
        <button  onClick={handleStartExam} disabled={!accepted} >
          Start Exam
        </button>

      </div>

    </div>
  );
}

if (questionsError) {
  return <div className="exam-error">{questionsError}</div>;
}

if (questionsLoading || questions.length === 0) {
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
          <div className={tutorialStep === 1 ? "timer-container highlight" : "timer-container"}>
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
