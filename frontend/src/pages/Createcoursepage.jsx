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
      <Topnav links={[{ text: 'Dashboard', path: '/teacher' }, { text: 'My Courses', path: '/my-courses' }]} />

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

          <div className='save-exam'>
            <button type="button" onClick={() => navigate('/my-courses')}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          </div>

        </form>

      </div>
    </>
  )
}
