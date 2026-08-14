import React from 'react'
import Topnav from '../components/topnav/Topnav'
import ToolCard from '../components/toolcard/toolcard'
import "./Teacherspage.css"

export default function Teacherspage() {


   const tools = [
    { id: 1, title: "Create new course", path: "/create-course" },
    { id: 2, title: "My Courses", path: "/my-courses" },
    { id: 3, title: "Design an Exam", path: "/design-exam" },
    { id: 4, title: "Create a quiz", path: "/create-quiz" },
    { id: 6, title: "List of students", path: "/student-list" },
    { id: 7, title: "Reports", path: "/reports" }


  ]


  return (


    <>

    <Topnav links={[{ text: 'Dashboard', path: '/teacher' }, { text: 'My Courses', path: '/my-courses' }]} />


    <div className='teachers-page'>
    <h1>Teachers tool box</h1>
    <div className='tools-grid'>
      {tools.map(tool => (
        <ToolCard
         key={tool.id}
         title={tool.title}
         path={tool.path}

         />

      ))}
          </div>

    </div>


    </>

  )
}
