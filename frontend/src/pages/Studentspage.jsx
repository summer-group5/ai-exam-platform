import React from 'react'
import Topnav from '../components/topnav/Topnav'
import Toolcard from '../components/toolcard/toolcard'
import './Studentspage.css'


export default function Studentspage() {
  
  const tools = [
    { id: 1, title: "Java basics" },
    { id: 2, title: "Linux basics"},
    { id: 3, title: "HTML5 and css" },
    { id: 4, title: "Advanced mobile development" },
    { id: 5, title: "Web development project" },
    { id: 6, title: "Svenska för arbetlivet" }
  
  
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
    path={`/Coursepage/${tool.id}`}
    /> 
  
  ))}
 
 </div>
 
    </div>
   </>
  )
}
