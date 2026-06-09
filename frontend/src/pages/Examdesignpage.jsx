import React from 'react'
import "./Examdesignpage.css"
import Topnav from '../components/topnav/Topnav'




export default function Examdesignpage() {
  return (
<>
<Topnav/>

<div className='exam-designpage'>
  

 <h1>Design Exam</h1>
  
<div className='design-container'>


<div className="task-section">

<div className="form-group">

<label>Exam name:</label>
<input type="text" placeholder='Give name for exam' />
</div>

<div className="form-group">

<label>Exam date:</label>
<input type="date" id='start'name="exam-date" />
</div>


<div className="form-group">
<label>Start time:</label>
<input type="time" name='exam-time' />


<label>Exam time limit:</label>


<select name="timelimits" id="time-limit-select">
  <option value="">Select time limit for exam</option>
  <option value="60">60min</option>
  <option value="90">90min</option>
  <option value="120">120min</option>
  
</select>
</div>



<h3>Create tasks:</h3>

<select name="tasks" id="task-select">
  
  <option value="">Select tasks for Exam from Task database</option>
  <option value="Task1">Task 1</option>
  <option value="Task2">Task 2</option>
  <option value="Task3">Task 3</option>
  
</select>
  


</div>

<button>Add task</button>

<div className='ai-generator'>

<h3>Generate exam tasks with AI</h3>

<textarea  id="ai-assistant" name="assistant" placeholder='Example: Create 5 React questions for beginners' >

</textarea>


</div>
 <button>Generate with AI</button>

<div className='save-exam'>

<button>save and quit</button>


<button>Publish exam</button>

</div>


</div>

  </div> 

</>
    
  )
}
