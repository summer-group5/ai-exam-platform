//monitoringService.js
import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

console.log('=== monitoringService loaded ===')
console.log('BACKEND:', BACKEND)

async function getAuthToken() {
  console.log('=== getAuthToken() called ===')

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  console.log('Supabase session:', session)
  console.log('Supabase auth error:', error)

  if (error) {
    throw new Error(`Supabase auth error: ${error.message}`)
  }

  if (!session) {
    throw new Error('Not logged in')
  }

  console.log('Auth token exists:', !!session.access_token)

  return session.access_token
}


// =====================================================
// CREATE EXAM SESSION
// =====================================================

export async function createExamSession(examId) {
  console.log('=== createExamSession() ===')
  console.log('examId:', examId)

  const token = await getAuthToken()

  const url = `${BACKEND}/api/exam-sessions`

  console.log('POST:', url)

  const res = await fetch(url, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      exam_id: examId
    })
  })

  console.log('createExamSession status:', res.status)

  const body = await res.json().catch(() => ({}))

  console.log('createExamSession response:', body)

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  console.log('Exam session created:', body)

  return body
}


// =====================================================
// SAVE MONITORING EVENT
// =====================================================

export async function logMonitoringEvent(sessionId, event) {
  console.log('=== logMonitoringEvent() ===')
  console.log('sessionId:', sessionId)
  console.log('event:', event)

  const token = await getAuthToken()

  const url =
    `${BACKEND}/api/exam-sessions/${sessionId}/events`

  console.log('POST:', url)

  const res = await fetch(url, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(event)
  })

  console.log('logMonitoringEvent status:', res.status)

  const body = await res.json().catch(() => ({}))

  console.log('logMonitoringEvent response:', body)

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  console.log('Monitoring event saved:', body)

  return body
}


// =====================================================
// GET STUDENT SESSION EVENTS
// =====================================================

export async function getSessionMonitoringEvents(sessionId) {
  console.log('=== getSessionMonitoringEvents() ===')
  console.log('sessionId:', sessionId)

  const token = await getAuthToken()

  const url =
    `${BACKEND}/api/exam-sessions/${sessionId}/events`

  console.log('GET:', url)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  console.log('getSessionMonitoringEvents status:', res.status)

  const body = await res.json().catch(() => ([]))

  console.log('Events response:', body)

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
  console.log('=== getExamSessions() ===')
  console.log('courseId:', courseId)

  const token = await getAuthToken()

  const url =
    `${BACKEND}/api/monitoring/courses/${courseId}/sessions`

  console.log('GET:', url)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  console.log('getExamSessions status:', res.status)

  const body = await res.json().catch(() => ([]))

  console.log('Sessions response:', body)

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  return body
}


// =====================================================
// GET ALL EVENTS FOR TEACHER
// =====================================================

export async function getAllMonitoringEvents(courseId) {
  console.log('=== getAllMonitoringEvents() ===')
  console.log('courseId:', courseId)

  const token = await getAuthToken()

  const url =
    `${BACKEND}/api/monitoring/courses/${courseId}/events`

  console.log('GET:', url)

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  console.log('getAllMonitoringEvents status:', res.status)

  const body = await res.json().catch(() => ([]))

  console.log('All monitoring events:', body)

  if (!res.ok) {
    throw new Error(
      body.error ?? `Request failed (${res.status})`
    )
  }

  return body
}