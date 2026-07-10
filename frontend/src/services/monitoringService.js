import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not logged in')
  }

  return session.access_token
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

export async function getMonitoringEvents(sessionId) {
  const token = await getAuthToken()

  const res = await fetch(
    `${BACKEND}/api/exam-sessions/${sessionId}/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return res.json()
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