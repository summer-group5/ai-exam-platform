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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }

  return res.json()
}