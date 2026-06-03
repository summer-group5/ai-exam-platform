//Tasklist.jsx
import React from 'react'

export default function Tasklist({
  quizTasks,
  onRemoveTask
}) {

  return (

    <div className='added-tasks'>

      <h3>Selected tasks:</h3>

      <ul>

        {quizTasks.map(task => (

          <li key={task.question_id}>

            {task.question}

            <button
              onClick={() =>
                onRemoveTask(task.question_id)
              }
            >
              Remove
            </button>

          </li>

        ))}

      </ul>

    </div>

  )
}