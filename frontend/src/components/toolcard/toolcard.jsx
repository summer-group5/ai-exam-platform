import React from 'react'
import "./toolcard.css"
import { Link } from "react-router-dom"

export default function Toolcard({title, path}) {
  return (
    
    
    <Link to={path} className='tool-card'>
        <h3>{title}</h3>

 <div className="image-placeholder">
        <img src="/placeholder.png" alt="" />
      </div>

    </Link>
  

)
}
