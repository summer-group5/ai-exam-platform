//monitoringService.js
import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not logged in')
  }

  return session.access_token
}


export async function getExamSessions() {
  const { data, error } = await supabase
    .from("exam_sessions")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) throw error;

  return data;
}
// get monitoring events 
export async function getAllMonitoringEvents() {
  const { data, error } = await supabase
    .from("monitoring_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}


// save monitorning event
export async function logMonitoringEvent(sessionId, event) {
  const token = await getAuthToken()

  const res = await fetch(
    `${BACKEND}/api/exam-sessions/${sessionId}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return res.json()
}

// get all monitoring events 

export async function getSessionMonitoringEvents(sessionId) {
  const token = await getAuthToken();

  const res = await fetch(
    `${BACKEND}/api/exam-sessions/${sessionId}/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json();
}

// sessions
export async function createExamSession(examId) {
  
    // test log
  console.log("Creating exam session with exam_id:", examId);
    
   const token = await getAuthToken();

  const res = await fetch(
    `${BACKEND}/api/exam-sessions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        exam_id: examId
      })
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json();
}