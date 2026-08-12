import React from 'react'
import Topnav from '../components/topnav/Topnav'
import ToolCard from '../components/toolcard/toolcard'
import "./Teacherspage.css"

export default function Teacherspage() {


   const tools = [
    { id: 1, title: "Create new course", path: "/create-course" },
    { id: 2, title: "My Courses", path: "/my-courses" },
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
