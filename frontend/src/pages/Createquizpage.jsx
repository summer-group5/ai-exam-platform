import React, { useEffect, useState } from 'react'
import Topnav from '../components/topnav/Topnav'
import './Examdesignpage.css'


export default function Createquizpage() {
  const [tasks, setTasks] = useState([])

  const [selectedTask, setSelectedTask] = useState('')

  const [quizTasks, setQuizTasks] = useState([])
  useEffect(() => {

    fetch('http://localhost:5000/api/questions')

    .then(res => res.json())

    .then(data => {
      setTasks(data)
    })

    .catch(err => {
      console.error(err)
    })

}, [])
  // add tasks to a list 
const handleAddTask = () => {

    const taskToAdd = tasks.find(
      task => task.question_id === Number(selectedTask)
    )

    if (!taskToAdd) return

    setQuizTasks(prev => [...prev, taskToAdd])
  }

// remove task from list
  const handleRemoveTask = (id) => {

  setQuizTasks(prev =>
    prev.filter(task => task.question_id !== id)
  )
}


  return (
   
   <>
    
    <Topnav/>
    <div className='exam-designpage'> 
    
    <h1> Create Quiz</h1>
    
    <div className='design-container'>

   <div className="task-section">

<div className="form-group">

<label>Quiz name:</label>
<input type="text" placeholder='Give name for quiz' />
</div>

<div className="form-group">


<label>Quiz opens:</label>
<input type="datetime-local" id='quiz-open'name="available-from" />
</div>

<label>Quiz due date:</label>
<input type="datetime-local" id='quiz-due'name="due-date" />
</div>

<div className='form-group'>
<label>Quiz closes:</label>
<input type="datetime-local" id='quiz-close'name="available-until" />    


<label>Quiz time limit:</label>
<select name="timelimits" id="time-limit-select">
  <option value="">Select time limit for quiz</option>
  <option value="">No time limit</option>
  <option value="60">60min</option>
  <option value="90">90min</option>
  <option value="120">120min</option>
  
</select>


</div>


<h3>Create tasks:</h3>

<select name="tasks" id="task-select" value={selectedTask} onChange={(e => setSelectedTask(e.target.value))}>
  
  <option value="">Select task from database</option>
  
  {tasks.map(task => (

 <option key={task.question_id} value={task.question_id}>
 
  {task.question}
 
 </option>
  ))}
 
</select>


</div>

<button onClick={handleAddTask}>Add task</button>


<div className='added-tasks'>

<h3>Selected tasks:</h3>


<ul>
 {quizTasks.map(task =>(
  <li key={task.question_id}>

    {task.question}

<button onClick={() => handleRemoveTask(task.question_id)}>Remove</button>

  </li>
 
))}
    
</ul>

</div>


<div className='ai-generator'>

<h3>Generate quiz tasks with AI</h3>

<textarea  id="ai-assistant" name="assistant" placeholder='Example: Create 5 React questions for beginners' >

</textarea>

</div>
 <button>Generate with AI</button>

<div className='save-exam'>

<button>Save and Quit</button>

<button>Publish Quiz</button>

</div>


</div>

  

</>
    
  )
}