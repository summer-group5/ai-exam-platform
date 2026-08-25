//ExamMonitoringpage.jsx
import React, { useEffect, useState } from 'react';
import './ExamMonitoringpage.css';
import { useParams } from 'react-router-dom';

import { getAllMonitoringEvents } from '../services/monitoringService';

export default function ExamMonitoringpage() {

  const { id: courseId } = useParams();

  const [sessions, setSessions] = useState([]);

  useEffect(() => {

    if (!courseId) return;

    async function loadData() {
      try {
        const data = await getAllMonitoringEvents(courseId);
        setSessions(data);
      } catch (err) {
        console.error("Failed to load monitoring data:", err);
      }
    }

    loadData();

  }, [courseId]);

  const monitoring = sessions.map((session) => {
    const sessionEvents = session.monitoring_events ?? [];
    const tabChanges = sessionEvents.filter(e => e.type === 'TAB_CHANGE').length;
    const fullscreenExits = sessionEvents.filter(e => e.type === 'FULLSCREEN_EXIT').length;
    const latestEvent = sessionEvents.length > 0 ? sessionEvents[0] : null;

    return { ...session, tabChanges, fullscreenExits, latestEvent };
  });

  return (
    <div className="ExamMonitoring-container">

      <h1>Exam Monitoring</h1>

      {monitoring.length === 0 ? (
        <p>No exam sessions found.</p>
      ) : (
        monitoring.map((session) => (
          <div
            className="monitoring-card"
            key={session.id}
          >

            <h2>
              Student: {session.users?.name || 'Unknown student'}
            </h2>
  <p>
    Email: {session.users?.email || 'No email'}
  </p>
            <p>
              Status: {session.status}
            </p>

            <p>
              Started:{' '}
              {session.started_at
                ? new Date(session.started_at).toLocaleString()
                : 'Unknown'}
            </p>
            <p>
               Tab changes: {session.tabChanges}
            </p>

            <p>
               Fullscreen exits: {session.fullscreenExits}
            </p>
            {session.latestEvent ? (
              <div>

                <strong>Latest event:</strong>

                <p>
                  Type: {session.latestEvent.type}
                </p>

                <p>
                  Details: {session.latestEvent.details}
                </p>

              </div>
            ) : (
              <p>No monitoring events.</p>
            )}

          </div>
        ))
      )}

    </div>
  );
}