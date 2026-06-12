import { supabase } from '../utils/supabase'

export async function createCourse({ title, description }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('courses')
    .insert({ title, description, teacher_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getMyCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
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
