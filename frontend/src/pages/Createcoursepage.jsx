import React from 'react'
import Topnav from '../components/topnav/Topnav'
import './Createcoursepage.css'

export default function Createcoursepage() {

  return (
    <>
      <Topnav />

      <div className='createcourse-page'>

        <h1>Create Course</h1>

        <div className="form-group">

          <label>Course name:</label>

          <input
            type="text"
            placeholder='Give name for course'
          />

        </div>

        <div className="selection-row">

          {/* QUIZ SECTION */}

          <div className="selection-box">

            <label>Select quiz to add for this course:</label>

            <div className="selection-controls">

              <select name="quiz" id="quiz-select">
                <option value="Quiz1">Quiz1</option>
                <option value="Quiz2">Quiz2</option>
                <option value="Quiz3">Quiz3</option>
              </select>

              <button type="button">
                Add Quiz
              </button>

            </div>

            <div className="added-box">

              <h3>Added Quizzes</h3>

              <div className="item-row">
                <span>Quiz 1 Web Development</span>
                <button>🗑</button>
              </div>

            </div>

          </div>

          {/* EXAM SECTION */}

          <div className="selection-box">

            <label>Select exam to add for this course:</label>

            <div className="selection-controls">

              <select>
                <option>Select</option>
              </select>

              <button>
                Add Exam
              </button>

            </div>

            <div className="added-box">

              <h3>Added Exams</h3>

              <div className="item-row">
                <span>Exam 1 Web Development</span>
                <button>🗑</button>
              </div>

            </div>

<div className='save-exam'>

<button>Save and Quit</button>

<button>Publish Quiz</button>

</div>

          </div>

        </div>

      </div>
    </>
  )
}