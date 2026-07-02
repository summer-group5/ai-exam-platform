import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { getAssignment, getSubmissions } from '../services/assignmentService'
import './AssignmentSubmissionsPage.css'

export default function AssignmentSubmissionsPage() {
  const { id, assignmentId } = useParams()
  const navigate = useNavigate()

  const [assignment, setAssignment] = useState(null)
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [assignmentData, submissionsData] = await Promise.all([
          getAssignment(id, assignmentId),
          getSubmissions(id, assignmentId)
        ])
        setAssignment(assignmentData)
        setReport(submissionsData.report ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, assignmentId])

  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'My courses', path: '/student' },
  ]

  if (loading) return <div className='submissions-page'><Topnav links={navLinks} /><p className='submissions-status'>Loading...</p></div>
  if (error) return <div className='submissions-page'><Topnav links={navLinks} /><p className='submissions-status'>Error: {error}</p></div>

  const submitted = report.filter(r => r.submission !== null).length
  const total = report.length

  return (
    <div className='submissions-page'>
      <Topnav links={navLinks} />

      <div className='submissions-container'>
        <button className='back-btn' onClick={() => navigate(`/Coursepage/${id}`)}>
          &larr; Back to course
        </button>

        <h1>{assignment?.title}</h1>
        <p className='submissions-summary'>
          {submitted} / {total} students submitted
        </p>

        {report.length === 0 ? (
          <p className='submissions-status'>No enrolled students found.</p>
        ) : (
          <table className='submissions-table'>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Status</th>
                <th>Score</th>
                <th>Submitted at</th>
              </tr>
            </thead>
            <tbody>
              {report.map(({ student, submission }) => (
                <tr key={student.id} className={submission ? 'row-submitted' : 'row-pending'}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <span className={`status-badge ${submission ? 'badge-submitted' : 'badge-pending'}`}>
                      {submission ? 'Submitted' : 'Not submitted'}
                    </span>
                  </td>
                  <td>{submission ? submission.score : '—'}</td>
                  <td>{submission ? new Date(submission.submitted_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
