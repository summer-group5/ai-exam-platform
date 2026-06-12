import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Topnav from '../components/topnav/Topnav'
import { getMyCourses, deleteCourse } from '../services/courseService'
import './MyCoursespage.css'

export default function MyCoursespage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyCourses()
      .then(setCourses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      setCourses(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  return (
    <>
      <Topnav />

      <div className="my-courses-page">

        <div className="my-courses-header">
          <h1>My Courses</h1>
          <Link to="/create-course" className="btn-primary">+ New Course</Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && courses.length === 0 && (
          <p className="empty-state">No courses yet. <Link to="/create-course">Create one.</Link></p>
        )}

        <div className="courses-list">
          {courses.map(course => (
            <div key={course.id} className="course-row">
              <div className="course-info">
                <h3>{course.name}</h3>
                {course.description && <p>{course.description}</p>}
              </div>
              <div className="course-actions">
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
