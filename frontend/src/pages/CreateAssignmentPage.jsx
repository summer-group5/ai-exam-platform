import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { createAssignment } from '../services/assignmentService'
import './CreateAssignmentPage.css'

export default function CreateAssignmentPage() {
  const { id: courseId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [weekNumber, setWeekNumber] = useState('')
  const [availableFrom, setAvailableFrom] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxPoints, setMaxPoints] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (availableFrom && dueDate && new Date(dueDate) < new Date(availableFrom)) {
      setError('Due date cannot be before available from date.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await createAssignment(courseId, {
        title: title.trim(),
        description: description.trim() || null,
        week_number: weekNumber ? Number(weekNumber) : null,
        available_from: availableFrom || null,
        due_date: dueDate || null,
        max_points: maxPoints ? Number(maxPoints) : null
      })
      navigate(`/Coursepage/${courseId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My Courses', path: '/my-courses' },
    { text: 'Back to Course', path: `/Coursepage/${courseId}` }
  ]

  return (
    <>
      <Topnav links={navLinks} />

      <div className="create-assignment-page">
        <h1>Create Assignment</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              placeholder="Assignment title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              placeholder="Describe this assignment (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Week number:</label>
              <input
                type="number"
                min="1"
                max="7"
                placeholder="e.g. 1"
                value={weekNumber}
                onChange={e => setWeekNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Max points:</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 100"
                value={maxPoints}
                onChange={e => setMaxPoints(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Available from:</label>
              <input
                type="datetime-local"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Due date:</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="questions-placeholder">
            <h2>Questions</h2>
            <p className="placeholder-text">Question management will be here soon.</p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate(`/Coursepage/${courseId}`)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create Assignment'}
            </button>
          </div>

        </form>
      </div>
    </>
  )
}
