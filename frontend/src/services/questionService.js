import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not logged in')
  }

  return session.access_token
}

export async function getExamQuestions(examId) {
  const token = await getAuthToken()

  const res = await fetch(
    `${BACKEND}/api/exams/${examId}/questions`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!session) throw new Error('Not logged in')
  return session.access_token
}

export async function addQuestion(courseId, assignmentId, { question_text, max_points, order_number }) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question_text, max_points, order_number })
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function deleteQuestion(courseId, assignmentId, questionId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return res.json()
}
}

export async function addOption(courseId, assignmentId, questionId, { option_text, is_correct }) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}/options`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ option_text, is_correct })
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function deleteOption(courseId, assignmentId, questionId, optionId) {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}/options/${optionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
}
