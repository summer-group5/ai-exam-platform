import React, {useState} from 'react'
import './Exampage.css'
import Questionscard from '../components/questionscard/Questionscard';
import QuestionProgress from '../components/questionscard/questionprogress/QuestionProgress';
import ExamTimer from '../components/timer/ExamTimer';
import { useLocation } from 'react-router-dom';



export default function Exampage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]); 
  const isAnswered = (index) => answers[index] !== undefined;
  
  // timer protype constants
  const location = useLocation();
  const exam = location.state?.exam;
  const timeLimit = location.state?.timeLimit ?? 60;



  
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

const handleSubmit = () => {
  console.log('Submitted answers:', answers);
  alert('time is up.')
  alert('All answers are saved and submitted')
  // Example: 
  // send answers to backend
  // navigate('/results')
  // calculate score
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
            <button className='submit'id="submit-grad">Submit</button>
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
