//monitoringService.js
import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) {
    throw new Error(`Supabase auth error: ${error.message}`)
  }

  if (!session) {
    throw new Error('Not logged in')
  }

  return session.access_token
}


// =====================================================
// CREATE EXAM SESSION
// =====================================================

export async function createExamSession(examId) {
  const token = await getAuthToken()

  const res = await fetch(`${BACKEND}/api/exam-sessions`, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      exam_id: examId
    })
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return body
}


// =====================================================
// SAVE MONITORING EVENT
// =====================================================

export async function logMonitoringEvent(sessionId, event) {
  const token = await getAuthToken()

  const res = await fetch(`${BACKEND}/api/exam-sessions/${sessionId}/events`, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(event)
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return body
}


// =====================================================
// GET STUDENT SESSION EVENTS
// =====================================================

export async function getSessionMonitoringEvents(sessionId) {
  const token = await getAuthToken()

  const res = await fetch(`${BACKEND}/api/exam-sessions/${sessionId}/events`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const body = await res.json().catch(() => ([]))

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  return body
}


// =====================================================
// GET ALL SESSIONS FOR TEACHER
// =====================================================

export async function getExamSessions(courseId) {
  const token = await getAuthToken();

  const res = await fetch(
    `${BACKEND}/api/monitoring/courses/${courseId}/sessions`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return body;
}


// =====================================================
// GET ALL EVENTS FOR TEACHER
// =====================================================

export async function getAllMonitoringEvents(courseId) {
  const token = await getAuthToken()

  const res = await fetch(`${BACKEND}/api/monitoring/courses/${courseId}/events`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const body = await res.json().catch(() => ([]))

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  return body
}


// =====================================================
// SUBMIT EXAM SESSION
// =====================================================

export async function submitExamSession(sessionId, answers) {
  const token = await getAuthToken()

  const res = await fetch(`${BACKEND}/api/exam-sessions/${sessionId}/submit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return body
}