import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { getAssignment, getMySubmission, submitAssignment } from '../services/assignmentService'
import './AssignmentPage.css'

export default function AssignmentPage() {
  const { id, assignmentId } = useParams()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState(null)
  const [answers, setAnswers] = useState({}) // { [question_id]: option_id }
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        // Check if already submitted
        const existing = await getMySubmission(id, assignmentId).catch(() => null)
        if (existing) {
          navigate(`/Coursepage/${id}/assignments/${assignmentId}/result`, {
            replace: true,
            state: { score: existing.score, submitted_at: existing.submitted_at, alreadySubmitted: true }
          })
          return
        }

        const data = await getAssignment(id, assignmentId)
        setAssignment(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, assignmentId, navigate])

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async () => {
    const questions = assignment?.questions ?? []
    if (questions.length > 0 && Object.keys(answers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Submit anyway?')) return
    }

    const payload = Object.entries(answers).map(([question_id, option_id]) => ({
      question_id,
      option_id
    }))

    try {
      setSubmitting(true)
      const result = await submitAssignment(id, assignmentId, payload)
      navigate(`/Coursepage/${id}/assignments/${assignmentId}/result`, {
        state: { score: result.score, max_score: result.max_score, submitted_at: result.submitted_at }
      })
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My courses', path: '/student' },
  ]

  if (loading) return <div className='assignment-page'><Topnav links={navLinks} /><p className='assignment-status'>Loading...</p></div>
  if (error) return <div className='assignment-page'><Topnav links={navLinks} /><p className='assignment-status'>Error: {error}</p></div>

  const questions = assignment?.questions ?? []

  return (
    <div className='assignment-page'>
      <Topnav links={navLinks} />

      <div className='assignment-container'>
        <h1>{assignment?.title}</h1>
        {assignment?.description && <p className='assignment-description'>{assignment.description}</p>}
        {assignment?.due_date && (
          <p className='assignment-due'>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
        )}

        {questions.length === 0 ? (
          <p className='assignment-status'>No questions available for this assignment yet.</p>
        ) : (
          <form className='questions-form' onSubmit={e => e.preventDefault()}>
            {questions
              .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
              .map((question, index) => (
                <div key={question.id} className='question-card'>
                  <p className='question-text'>
                    <span className='question-number'>{index + 1}.</span> {question.question_text}
                  </p>
                  <ul className='options-list'>
                    {question.question_options?.map(option => (
                      <li key={option.id}>
                        <label className='option-label'>
                          <input
                            type='radio'
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={answers[question.id] === option.id}
                            onChange={() => handleSelect(question.id, option.id)}
                          />
                          {option.option_text}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            <div className='assignment-actions'>
              <button
                className='submit-btn'
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
              <button
                className='back-btn'
                onClick={() => navigate(`/Coursepage/${id}`)}
              >
                Back to course
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
