import React, {useState} from 'react'
import './Exampage.css'




export default function Exampage() {
 
   const [selectedAnswer, setSelectedAnswer] = useState('');


 
    return (
 
 <div className='exam-page'>
        
        <div className="exam-header">
            <h1> Exam</h1>
        <p>timer here</p>
         <p>Monitoring active here</p>
        </div>
       
       <div className="row-container">
        <section className='exam-section'>
        <div className="progress-bar">
            <h2>Questions</h2>
            <p>progress cards</p>
            <p>progress cards</p>
            <p>progress cards</p>
          
        
        </div> 
         </section>
           
            <section className='exam-section'>
             <div className="timer-container">
                 <h2>Questions 2 OF 5</h2>
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
             <button className='submit'>Submit</button>
           
        </div>    
        
        
        </section>   
           
        </div>
      
        
        
        </div>
  )
}
