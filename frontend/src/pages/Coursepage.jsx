// Coursepage.jsx
import React from 'react'
import { useParams } from 'react-router-dom'


export default function Coursepage() {
  
  const { id } = useParams();
  
  const courses = [
    { id: 1, title: 'Java basics',  description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 2, title: 'Linux basics' ,description: 'Introduction to Java programming.',teacher: 'John Smith'},
    { id: 3, title: 'HTML5 and css',description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 4, title: 'Advanced mobile development',description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 5, title: 'Web development project' ,description: 'Introduction to Java programming.',teacher: 'John Smith'},
    { id: 6, title: 'Svenska för arbetlivet' ,description: 'Introduction to Java programming.',teacher: 'John Smith'}
  ];


  const course = courses.find(
    course => course.id === Number(id)
  );


  return (
      <div className='coursepage'>
        
        
        <div className='course-container'>

        {/* Top image for header*/ }  

<img src="#" alt="course image" />

            <h1>{course?.title}</h1>
            <h3>Course id: {id}</h3>
            <p>{course.description}</p>

            <h3>Course Teacher: {course?.teacher}</h3>
            

          <section>
          <h1> Course header</h1>

          </section>

           
           <section>
            <h3>Course materials</h3>
           <ul>
          <li>Week 1 Slides</li>
           
           <li>Installation guide</li>

           </ul>
             <ul>
          <li>Week 2 Slides</li>
           
           <li>Basic script</li>

           </ul>
           
           
           
           </section>

        <section>
          <h3>Assignments</h3>
<ul>
  
  <li>week 1 assignment</li>
<li>week2 assignmen</li>
<li>week3 assignmen</li>

</ul>
        </section>
        
        <section>
          <h3>Exam</h3>
          <p>Exam is using browser detection and eye tracking and student must have web camera on during the exam. </p>
          <button>Join</button>
        </section>

        </div>

    </div>

   
    
  )
}
