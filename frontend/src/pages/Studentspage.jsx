import React, { useEffect, useState } from 'react'
import Topnav from '../components/topnav/Topnav'
import Toolcard from '../components/toolcard/toolcard'
import { getMyEnrolledCourses } from '../services/courseService'
import './Studentspage.css'

export default function Studentspage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyEnrolledCourses()
      .then(data => setCourses(data.courses))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Topnav />
      <div className='students-page'>
        <h1>My courses</h1>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p>You are not enrolled in any courses yet.</p>
        )}

        <div className='tools-grid'>
          {courses.map(course => (
            <Toolcard
              key={course.id}
              title={course.title}
              path={`/Coursepage/${course.id}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
