// Coursepage.jsx
import React from 'react'
import { useParams } from 'react-router-dom'


export default function Coursepage() {
  
  const { id } = useParams();
  
  const courses = [
    { id: 1, title: "Java basics" },
    { id: 2, title: "Linux basics" },
    { id: 3, title: "HTML5 and css" },
    { id: 4, title: "Advanced mobile development" },
    { id: 5, title: "Web development project" },
    { id: 6, title: "Svenska för arbetlivet" }
  ];

  const course = courses.find(
    course => course.id === Number(id)
  );


  return (
      <div className='coursepage'>
        <div className='course-container'>
            
            <h1>{course?.title}</h1>

            <h3>Course id: {id}</h3>

           

        

        </div>

    </div>

   
    
  )
}
