//Topnav.jsx
import React from 'react'
import "./Topnav.css"
import { Link } from "react-router-dom"

export default function Topnav({ links }) {
  
   const defaultLinks = [
    { text: "Home", path: "/" },
    { text: "Teacher", path: "/teacher" },
    { text: "Student", path: "/student" },
    { text: "Help", path: "/help" },
    { text: "Login", path: "/login" }
  ];

  const navLinks = links || defaultLinks;
  
  
  return (
    <nav className='topnav'>
        {navLinks.map(link => (
          <Link
          key={link.path}
          to={link.path}
          className='nav-link'
          >
          {link.text}

          </Link>

        ))}
        
   
    </nav>
  )
}
