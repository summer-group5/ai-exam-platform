import React from 'react'
import "./Topnav.css"
import { Link } from "react-router-dom"

export default function Topnav() {
  return (
    <nav className='topnav'>
        <Link to = "/" className='nav-link'>Home</Link>
        <Link to = "/teacher" className='nav-link'>Teacher</Link>
        <Link to = "/student" className='nav-link'>Student</Link>
        <Link to = "/help" className='nav-link'>Help</Link>
        <Link to = "/login" className='nav-link'>Login</Link>
        
    </nav>
  )
}
