import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { getMySubmission } from '../services/assignmentService'
import './AssignmentResultPage.css'

export default function AssignmentResultPage() {
  const { id, assignmentId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const stateData = location.state ?? {}
  const [score, setScore] = useState(stateData.score)
  const [maxScore, setMaxScore] = useState(stateData.max_score)
  const [submittedAt, setSubmittedAt] = useState(stateData.submitted_at)
  const [alreadySubmitted] = useState(stateData.alreadySubmitted ?? false)
  const [loading, setLoading] = useState(stateData.score === undefined)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    if (stateData.score !== undefined) return
    getMySubmission(id, assignmentId)
      .then(data => {
        setScore(data.score)
        setMaxScore(data.max_score)
        setSubmittedAt(data.submitted_at)
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false))
  }, [id, assignmentId])

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My courses', path: '/student' },
  ]

  if (loading) return <div className='result-page'><Topnav links={navLinks} /><p style={{ margin: '2rem' }}>Loading...</p></div>

  if (fetchError || score === undefined) {
    return (
      <div className='result-page'>
        <Topnav links={navLinks} />
        <div className='result-container'>
          <p>{fetchError ?? 'No result data found.'}</p>
          <button className='result-back-btn' onClick={() => navigate(`/Coursepage/${id}`)}>
            Back to course
          </button>
        </div>
      </div>
    )
  }

  const max_score = maxScore
  const submitted_at = submittedAt
  const percentage = max_score > 0 ? Math.round((score / max_score) * 100) : null

  return (
    <div className='result-page'>
      <Topnav links={navLinks} />

      <div className='result-container'>
        <h1 className='result-title'>
          {alreadySubmitted ? 'Your Submission' : 'Assignment Submitted!'}
        </h1>

        <div className='score-box'>
          <p className='score-label'>Your score</p>
          <p className='score-value'>
            {score}{max_score !== undefined ? ` / ${max_score}` : ''}
          </p>
          {percentage !== null && (
            <p className='score-percentage'>{percentage}%</p>
          )}
        </div>

        {submitted_at && (
          <p className='result-date'>
            Submitted: {new Date(submitted_at).toLocaleString()}
          </p>
        )}

        <button className='result-back-btn' onClick={() => navigate(`/Coursepage/${id}`)}>
          Back to course
        </button>
      </div>
    </div>
  )
}
