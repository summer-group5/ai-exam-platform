import React from 'react'
import './ExamMonitoringpage.css'

export default function ExamMonitoringpage() {
  
     const students = [
        {
            id: 1,
            name: "Alice",
            status: "Active",
            question: 12,
            progress: "12 / 20",
            warnings: 0
        },
        {
            id: 2,
            name: "Bob",
            status: "Tab Changed",
            question: 10,
            progress: "10 / 20",
            warnings: 2
        },
        {
            id: 3,
            name: "Charlie",
            status: "Submitted",
            question: 20,
            progress: "20 / 20",
            warnings: 0
        }
    ];
  
  
  
  return (
    <>
    <div className="ExamMonitoring-page">
        <div className="ExamMonitoring-header">
            <h1>ExamMonitoringpage</h1> 
        
        </div>
       
       <div className="ExamMonitoring-container">
  <table>
    <thead>
      <tr>
        <th>Student</th>
        <th>Status</th>
        <th>Current Question</th>
        <th>Progress</th>
        <th>Warnings</th>
      </tr>
    </thead>

    <tbody>
      {students.map(student => (
        <tr key={student.id}>
          <td>{student.name}</td>
          <td>{student.status}</td>
          <td>{student.question}</td>
          <td>{student.progress}</td>
          <td>{student.warnings}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        
        
        
        </div>
 
 </>

)
}
