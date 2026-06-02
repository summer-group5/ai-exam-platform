// Coursepage.jsx
import React from 'react'
import { useParams } from 'react-router-dom'


export default function Coursepage() {
  
    const {id} = useParams();

  return (
      <div className='coursepage'>
        <div className='course-container'>
            
            <h1>Course name:</h1>

            <h3>Course id: {id}</h3>

           

        

        </div>

    </div>

   
    
  )
}
