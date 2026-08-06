import { supabase } from '../utils/supabase'

const BACKEND = import.meta.env.VITE_BACKEND_URL

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')
  return session.access_token
}

export async function getMyEnrolledCourses() {
  const token = await getAuthToken()
  const res = await fetch(`${BACKEND}/api/courses/my-enrollments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export async function createCourse({ title, description }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('courses')
    .insert({ title, description, teacher_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getMyCourses() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCourse(id) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateCourse(id, { title, description }) {
  const { data, error } = await supabase
    .from('courses')
    .update({ title, description })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCourse(id) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)
  if (error) throw error
}
