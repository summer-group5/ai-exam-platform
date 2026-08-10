import React, { useEffect, useState } from 'react';
import './ExamMonitoringpage.css';
import { useParams } from 'react-router-dom';

import {
  getExamSessions,
  getAllMonitoringEvents
} from '../services/monitoringService';

export default function ExamMonitoringpage() {

  const { id: courseId } = useParams();

  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {

    if (!courseId) return;

    async function loadData() {
      try {
        const sessionData = await getExamSessions(courseId);
        const eventData = await getAllMonitoringEvents(courseId);

        setSessions(sessionData);
        setEvents(eventData);

      } catch (err) {
        console.error("Failed to load monitoring data:", err);
      }
    }

    loadData();

  }, [courseId]);

  console.log("Sessions:", sessions);
  console.log("Events:", events);

  const monitoring = sessions.map((session) => {

    const sessionEvents = events.filter(
      event => event.session_id === session.id
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
              Student: {session.student?.name ?? 'Unknown student'}
            </h2>

            <p>
              Status: {session.status}
            </p>

            <p>
              Started:{' '}
              {session.started_at
                ? new Date(session.started_at).toLocaleString()
                : 'Unknown'}
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