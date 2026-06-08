import React from 'react'
import './Exampage.css'




export default function Exampage() {
 
 


 
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
            <h3>Questions</h3>
            <p>progress cards</p>
            <p>progress cards</p>
            <p>progress cards</p>
            <button>Submit</button>
        
        </div> 
         </section>
           
            <section className='exam-section'>
             <div className="timer-container">
                 <h2>Questions 2 OF 5</h2>
        

            <h3>What does the acronym HTTP stand for</h3>

        </div>    
         </section>   
           
        </div>
      
        
        
        </div>
  )
}
