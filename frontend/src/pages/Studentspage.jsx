import React from 'react'
import Topnav from '../components/topnav/Topnav'
import Toolcard from '../components/toolcard/toolcard'
import './Studentspage.css'
export default function Studentspage() {
  
  const tools = [
    { id: 1, title: "Java basics", path: "/" },
    { id: 2, title: "Linux basics", path: "/" },
    { id: 3, title: "HTML5 and css", path: "/" },
    { id: 4, title: "Advanced mobile development", path: "/" },
    { id: 5, title: "Web development project", path: "/" },
    { id: 6, title: "Svenska för arbetlivet", path: "/" }
  
  
  ] 

  return (
  <>
  <Topnav/>
  
    <div className='students-page'>
 <h1>My courses</h1>
 <div className='tools-grid'>
    {tools.map(tool => (
    <Toolcard
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
