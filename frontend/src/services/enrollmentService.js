import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')
  return session.access_token
}

export async function getEnrollments(courseId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/enrollments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function importEnrollments(courseId, csvFile) {
  const token = await getAuthToken()
  const formData = new FormData()
  formData.append('file', csvFile)
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/enrollments/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function removeEnrollment(courseId, studentId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/enrollments/${studentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
}
