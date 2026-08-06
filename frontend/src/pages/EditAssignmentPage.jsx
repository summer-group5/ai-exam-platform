import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import QuestionEditor from '../components/QuestionEditor/QuestionEditor'
import { getAssignment } from '../services/assignmentService'
import './EditAssignmentPage.css'

export default function EditAssignmentPage() {
  const { id: courseId, assignmentId } = useParams()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAssignment = useCallback(async () => {
    try {
      const data = await getAssignment(courseId, assignmentId)
      setAssignment(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [courseId, assignmentId])

  useEffect(() => {
    loadAssignment()
  }, [loadAssignment])

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My courses', path: '/my-courses' },
  ]

  if (loading) return (
    <div className='edit-assignment-page'>
      <Topnav links={navLinks} />
      <p className='edit-status'>Loading...</p>
    </div>
  )

  if (error) return (
    <div className='edit-assignment-page'>
      <Topnav links={navLinks} />
      <p className='edit-status'>Error: {error}</p>
    </div>
  )

  return (
    <div className='edit-assignment-page'>
      <Topnav links={navLinks} />

      <div className='edit-assignment-container'>
        <button className='edit-back-link' onClick={() => navigate(`/Coursepage/${courseId}`)}>
          &larr; Back to course
        </button>

        <h1>{assignment.title}</h1>
        {assignment.description && (
          <p className='edit-assignment-description'>{assignment.description}</p>
        )}

        <QuestionEditor
          courseId={courseId}
          assignmentId={assignmentId}
          questions={assignment.questions ?? []}
          onQuestionsChanged={loadAssignment}
        />

        <div className='edit-assignment-actions'>
          <button className='btn-primary' onClick={() => navigate(`/Coursepage/${courseId}`)}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
