// Coursepage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Coursepage.css'
import Topnav from '../components/topnav/Topnav';
import { getCourse } from '../services/courseService'
import { getAssignments } from '../services/assignmentService'
import { supabase } from '../utils/supabase'
import { getExam, getMyExamSession } from '../services/examService'


function getExamStatus(exam) {
  if (!exam?.start_time) return 'open';
  const start = new Date(exam.start_time);
  const end = new Date(start.getTime() + (exam.duration_minutes ?? 60) * 60 * 1000);
  const now = new Date();
  if (now < start) return { status: 'upcoming', start };
  if (now > end) return { status: 'ended' };
  return 'open';
}

export default function Coursepage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const [exam, setExam] = useState(null)
  const [mySession, setMySession] = useState(null)

  useEffect(() => {
    async function loadPage() {
      const [courseData, assignmentsData, examData, { data: { user } }] = await Promise.all([
        getCourse(id).catch(() => null),
        getAssignments(id).catch(() => ({ assignments: [] })),
        getExam(id).catch(() => null),
        supabase.auth.getUser()
      ])
      setCourse(courseData)
      setAssignments(assignmentsData?.assignments ?? [])
      setExam(examData)
      const owner = !!user && courseData?.teacher_id === user.id
      setIsOwner(owner)
      if (!owner && examData) {
        const session = await getMyExamSession(id).catch(() => null)
        setMySession(session)
      }
    }
    loadPage()
  }, [id])

  const courseLinks = [
    { text: 'Home', path: '/' },
    { text: 'My Courses', path: isOwner ? '/my-courses' : '/student' },
  ]

  return (
    
    <div className='coursepage'>
      <Topnav links={courseLinks} />

      <div className='course-container'>

        <h1>{course?.title ?? 'Loading...'}</h1>
        {course?.description && <p>{course.description}</p>}

        <section>
          <div className='assignments-header'>
            <h3>Assignments</h3>
            {isOwner && (
              <Link to={`/Coursepage/${id}/create-assignment`} className='create-assignment-link'>
                + Create Assignment
              </Link>
            )}
          </div>
          {assignments.length === 0 ? (
            <p className='no-assignments'>No assignments yet.</p>
          ) : (
            <ul>
              {assignments.map(a => (
                <li key={a.id}>
                  <Link
                    to={isOwner
                      ? `/Coursepage/${id}/assignments/${a.id}/submissions`
                      : `/Coursepage/${id}/assignments/${a.id}`}
                    className='assignment-link'
                  >
                    {a.week_number ? `Week ${a.week_number} — ` : ''}{a.title}
                  </Link>
                  {a.due_date && <span className='due-date'> (Due: {new Date(a.due_date).toLocaleDateString()})</span>}
                  {isOwner && a.available_from && new Date(a.available_from) > new Date() && (
                    <span className='due-date'> (Available: {new Date(a.available_from).toLocaleDateString()})</span>
                  )}
                  {isOwner && (
                    <Link
                      to={`/Coursepage/${id}/assignments/${a.id}/edit`}
                      className='assignment-edit-link'
                    >
                      Edit
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        
      <div className='exam-container'>
        <section>
          <h3 className='exam-title'>Final Exam</h3>
          <p>Exam uses browser detection and eye tracking. Students must have a web camera on during the exam.</p>
          {exam ? (
            <div className='exam-buttons'>
              <Link
                to={`/Coursepage/${id}/exam`}
                state={{ demo: true, exam }}
                className="demo-btn"
              >
                Try Exam Demo
              </Link>
              {!isOwner && (() => {
                const examStatus = getExamStatus(exam);
                if (examStatus === 'open') {
                  return (
                    <Link
                      to={`/Coursepage/${id}/exam`}
                      state={{ demo: false, exam }}
                      className="exam-btn"
                    >
                      Final Exam
                    </Link>
                  );
                }
                if (examStatus?.status === 'upcoming') {
                  return (
                    <div className="exam-status exam-status--upcoming">
                      <span className="exam-status__label">Opens</span>
                      <span className="exam-status__time">{examStatus.start.toLocaleString()}</span>
                    </div>
                  );
                }
                if (examStatus?.status === 'ended') {
                  return (
                    <div className="exam-status exam-status--ended">
                      <span className="exam-status__label">Exam closed</span>
                    </div>
                  );
                }
              })()}
              {isOwner && (
                <Link to={`/Coursepage/${id}/design-exam`} className="manage-students-btn">
                  Edit Exam
                </Link>
              )}
            </div>
          ) : null}
          {!isOwner && mySession?.status === 'submitted' && (
            <Link
              to={`/Coursepage/${id}/exam/results`}
              state={{ score: mySession.final_score, max_score: mySession.max_score }}
              className="demo-btn"
            >
              View Exam Results
            </Link>
          )}
          {exam ? null : course !== null && isOwner ? (
            <Link to={`/Coursepage/${id}/design-exam`} className='exam-btn'>
              + Create Exam
            </Link>
          ) : course !== null ? (
            <p>No exam scheduled yet.</p>
          ) : (
            <p>Loading...</p>
          )}
        </section>
      </div>

      {isOwner && (
        <div className='teacher-tools'>
          <Link to={`/Coursepage/${id}/enrollments`} className='manage-students-btn'>
            Manage Students
          </Link>
          <Link to={`/Coursepage/${id}/exam-monitoring`} className='manage-students-btn'>
            Exam Monitoring
          </Link>
        </div>
      )}

    </div>
  </div>
  )
}
