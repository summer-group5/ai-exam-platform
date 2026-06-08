// Coursepage.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import './Coursepage.css'
import Topnav from '../components/topnav/Topnav';



export default function Coursepage() {
  
  const { id } = useParams();
  
  const courses = [
    { id: 1, title: 'Java basics',  description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 2, title: 'Linux basics' ,description: 'Linux commands and basics.',teacher: 'John Smith'},
    { id: 3, title: 'HTML5 and css',description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 4, title: 'Advanced mobile development',description: 'Introduction to Java programming.',teacher: 'John Smith' },
    { id: 5, title: 'Web development project' ,description: 'Introduction to Java programming.',teacher: 'John Smith'},
    { id: 6, title: 'Svenska för arbetlivet' ,description: 'Introduction to Java programming.',teacher: 'John Smith'}
  ];

  const course = courses.find(
    course => course.id === Number(id)
  );

  // course page links prop for topnav topnav component
 const courseLinks = [
    { text: "Home", path: "/" },
    { text: "My courses", path: "/student" },
    { text: "Help", path: "/help" },
    { text: "Login", path: "/login" }
  ];


  return (
      <div className='coursepage'>
        <Topnav links={courseLinks}/>
       
        <div className='course-container'>

        {/* Top image for header*/ }  
 <div className='image-container'> 
<img className='course-image' src="../images/course_image.jpg" alt="course image" /> 
    
    </div>
   
            <h1>{course?.title}</h1>
            <h3>Course id: {id}</h3>
            <p>{course.description}</p>

            <p>Course Teacher: {course?.teacher}</p>
            

          <section>
          <h1> Course header</h1>

          </section>

           
           <section>
            <h3>Course materials</h3>
           <ul>
          <li><div className="file-item">
  <span className='course-span'> Week 1 Slides</span>
  <a href="/files/week1.pdf" target="_blank">
    Open
  </a>
</div>
</li>



              {/* Word document embedded to course page*/}
            

           <li>Installation guide:</li>
 
     {/* Youtube video embedded to course page*/}
    
 
    <iframe width="560" height="315" 
    src="https://www.youtube.com/embed/#placeholder"
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; 
               encrypted-media; gyroscope; 
               picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
    </iframe>

           </ul>
             <ul>
          <li>Week 2 Slides</li>
           
           <li> <div className="file-item">
  <span className='course-span'> Basic script</span>
  <a href="/files/week1.pdf" target="_blank">
    Open 
  </a>
</div>
</li>

 <li> <div className="file-item">
  <span className='course-span'> Variables</span>
  <a href="/files/week1.pdf" target="_blank">
    Open 
  </a>
</div>
</li>


           </ul>
   
           
           </section>

        <section>
          <h3>Assignments</h3>
<ul>
  
  <li>week 1 assignment</li>
<li>week 2 assignment</li>
<li>week 3 assignment</li>

</ul>
        </section>
        
       <div className='exam-container'>
        <section>
          <h3 className='exam-title'> Final Exam</h3>
          <p>Exam is using browser detection and eye tracking. Students must have web camera on during the exam. </p>
          
         <Link to={`/Coursepage/${id}/exam`} className="join-btn">
  Join
</Link>
        
        </section>


</div>
        </div>

    </div>

   
    
  )
}
