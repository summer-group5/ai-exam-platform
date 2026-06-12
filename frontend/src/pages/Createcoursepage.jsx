import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { createCourse } from '../services/courseService'
import './Createcoursepage.css'

export default function Createcoursepage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Course name is required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await createCourse({ title: title.trim(), description: description.trim() })
      navigate('/my-courses')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topnav />

      <div className='createcourse-page'>

        <h1>Create Course</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Course name:</label>
            <input
              type="text"
              placeholder='Give name for course'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              placeholder='Describe this course (optional)'
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

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
                  <button type="button">🗑</button>
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

                <button type="button">
                  Add Exam
                </button>

              </div>

              <div className="added-box">

                <h3>Added Exams</h3>

                <div className="item-row">
                  <span>Exam 1 Web Development</span>
                  <button type="button">🗑</button>
                </div>

              </div>

              <div className='save-exam'>

                <button type="button" onClick={() => navigate('/my-courses')}>Cancel</button>

                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Course'}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>
    </>
  )
}
