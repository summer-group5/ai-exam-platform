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
  
  



  return (
    <>
    <div className="ExamMonitoring-page">
        <div className="ExamMonitoring-header">
            <h1>ExamMonitoringpage</h1> 
        
        </div>
       
       <div className="ExamMonitoring-container">
  
</div>
        
        
        
        </div>
 
 </>

)
}
