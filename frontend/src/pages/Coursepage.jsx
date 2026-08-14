// Coursepage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Coursepage.css'
import Topnav from '../components/topnav/Topnav';
import { getCourse } from '../services/courseService'
import { getAssignments } from '../services/assignmentService'
import { supabase } from '../utils/supabase'
import { getExam } from '../services/examService'


export default function Coursepage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [isOwner, setIsOwner] = useState(false)
  const [exam, setExam] = useState(null)


  
  useEffect(() => {
    async function loadPage() {
      const [courseData, assignmentsData, examData, { data: { user } }] = await Promise.all([
        getCourse(id).catch(() => null),
        getAssignments(id).catch(() => ({ assignments: [] })),
        getExam(id).catch((error) => {
         console.error('Failed to load exam:', error)
          return null
    }),
        
          supabase.auth.getUser()
      ])
      console.log('Course:', courseData)
      console.log('Exam:', examData)
      console.log('User:', user)
      
      setCourse(courseData)
      setAssignments(assignmentsData?.assignments ?? [])
      setExam(examData)
      setIsOwner(!!user && courseData?.teacher_id === user.id) 
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

        <div className='image-container'>
          <img className='course-image' src="../images/course_image.jpg" alt="course image" />
        </div>

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

    <p>
      Exam is using browser detection and eye tracking.
      Students must have web camera on during the exam.
    </p>

    {exam ? (
      <div className='exam-buttons'>

        <Link
          to={`/Coursepage/${id}/exam`}
          state={{
            demo: true,
            exam
          }}
          className="demo-btn"
        >
          Try Exam Demo
        </Link>

        <Link
          to={`/Coursepage/${id}/exam`}
          state={{
            demo: false,
            exam
          }}
          className="exam-btn"
        >
          Final Exam
        </Link>

      </div>
    ) : (
      <p>Loading exam...</p>
    )}
  </section>

  {isOwner && (
    <div className='teacher-tools'>

      <Link
        to={`/Coursepage/${id}/enrollments`}
        className='manage-students-btn'
      >
        Manage Students
      </Link>

      <Link
        to={`/Coursepage/${id}/exam-monitoring`}
        className='manage-students-btn'
      >
        Exam Monitoring
      </Link>

    </div>
  )}
</div>

</div>
</div> 
  )
}
