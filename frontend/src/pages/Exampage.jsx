import React, {useState} from 'react'
import './Exampage.css'




export default function Exampage() {
 
   const [selectedAnswer, setSelectedAnswer] = useState('');


 
    return (
 
 <div className='exam-page'>
      
        <div className="exam-header">
            <h1>Final Exam</h1>
       <div className="timer-container">
        <span className="timer-span">timer here</span>
        
        
       </div>
        <div className="monitor-container">
           <span className="monitor-span">  Monitoring active</span>
        
        </div>
         
         
         </div> 
       
       <div className="row-container">
        <section className='exam-section'>
        
        <div className="progress-bar">
            <h2>QUESTIONS</h2>
            <p>progress cards</p>
            <p>progress cards</p>
            <p>progress cards</p>
         <div className="button-container">
            <button className='submit'id="submit-grad">Submit</button>
          </div> 
       
        </div> 
         </section>
           
            <section className='exam-section'>
             <div className="question-container">
                 <h2>QUESTIONS 2 OF 5</h2>
         <h3>What does the acronym HTTP stand for ?</h3>
                  
           <div className="question-options">

  <div className="option">
    <input
      type="radio"
      name="http-question"
      value="HyperText Transfer Protocol"
      checked={selectedAnswer === 'HyperText Transfer Protocol'}
      onChange={(e) => setSelectedAnswer(e.target.value)}
    />
    <span>HyperText Transfer Protocol</span>
  </div>

  <div className="option">
    <input
      type="radio"
      name="http-question"
      value="High Transfer Text Process"
      checked={selectedAnswer === 'High Transfer Text Process'}
      onChange={(e) => setSelectedAnswer(e.target.value)}
    />
    <span>High Transfer Text Process</span>
  </div>

  <div className="option">
    <input
      type="radio"
      name="http-question"
      value="Hyper Transfer Tool Protocol"
      checked={selectedAnswer === 'Hyper Transfer Tool Protocol'}
      onChange={(e) => setSelectedAnswer(e.target.value)}
    />
    <span>Hyper Transfer Tool Protocol</span>
  </div>

  <div className="option">
    <input
      type="radio"
      name="http-question"
      value="Host Transfer Text Protocol"
      checked={selectedAnswer === 'Host Transfer Text Protocol'}
      onChange={(e) => setSelectedAnswer(e.target.value)}
    />
    <span>Host Transfer Text Protocol</span>
  </div>

</div>   
            
           
        </div>    
        
        
        </section>   
           
        </div>
      
        
        
        </div>
  )
}
