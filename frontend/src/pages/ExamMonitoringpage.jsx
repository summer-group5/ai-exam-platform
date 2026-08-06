import React, { useEffect, useState } from 'react';
import './ExamMonitoringpage.css'

import {
  getExamSessions,
  getAllMonitoringEvents
} from '../services/monitoringService';


export default function ExamMonitoringpage() {
  
    const [sessions, setSessions] = useState([]);
    const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionData = await getExamSessions();
        const eventData = await getAllMonitoringEvents();

        setSessions(sessionData);
        setEvents(eventData);

      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

    console.log(sessions);
    console.log(events);
  
  const monitoring = sessions.map((session) => {
  const sessionEvents = events.filter(
    e => e.session_id === session.id
  );

  const latestEvent =
    sessionEvents.length > 0
      ? sessionEvents[0]
      : null;

  return {
    ...session,
    latestEvent
  };
});



  return (
    <>
    <div className="ExamMonitoring-page">
        <div className="ExamMonitoring-header">
            <h1>ExamMonitoringpage</h1> 
        
<table>
  <thead>
    <tr>
      <th>Student</th>
      <th>Status</th>
      <th>Latest Event</th>
      <th>Started</th>
    </tr>
  </thead>

  <tbody>
    {monitoring.map((session) => (
      <tr key={session.id}>
        <td>{session.student_id}</td>
        <td>{session.status}</td>
        <td>
          {session.latestEvent
            ? session.latestEvent.type
            : "No events"}
        </td>
        <td>{new Date(session.started_at).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>
        
        </div>
       
       <div className="ExamMonitoring-container">
  
</div>
        
        
        
        </div>
 
 </>

)
}
