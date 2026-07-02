import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')
  return session.access_token
}

export async function getAssignments(courseId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getAssignment(courseId, assignmentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function createAssignment(courseId, { title, description, week_number, available_from, due_date, max_points }) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, week_number, available_from, due_date, max_points })
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function updateAssignment(courseId, assignmentId, updates) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function deleteAssignment(courseId, assignmentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
}

export async function submitAssignment(courseId, assignmentId, answers) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getMySubmission(courseId, assignmentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/my-submission`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getSubmissions(courseId, assignmentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/submissions`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function getStudentSubmission(courseId, assignmentId, studentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/submissions/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}
