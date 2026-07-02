import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import './AssignmentResultPage.css'

export default function AssignmentResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { score, max_score, submitted_at, alreadySubmitted } = location.state ?? {}

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My courses', path: '/student' },
  ]

  if (score === undefined) {
    return (
      <div className='result-page'>
        <Topnav links={navLinks} />
        <div className='result-container'>
          <p>No result data found.</p>
          <button className='result-back-btn' onClick={() => navigate(`/Coursepage/${id}`)}>
            Back to course
          </button>
        </div>
      </div>
    )
  }

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
