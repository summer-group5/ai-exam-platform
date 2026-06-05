import React from 'react'
import "./Frontpage.css"
import Topnav from '../components/topnav/Topnav'


export default function Frontpage() {
  return (
  
  <>
   <Topnav/>
   <div className="frontContainer"> 
    <div className='Front-title'>
   
    <h1>Exam app</h1>
   
    
   <div className='image-container'> 
  <img className='front-image' src="../images/5834.jpg" alt="image of study" />
 </div>   
 </div>
  </div>
</>
)
}
        