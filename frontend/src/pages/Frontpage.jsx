import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { getUserRole } from '../services/authService'

export default function Frontpage() {
  const navigate = useNavigate()

  useEffect(() => {
    async function redirect() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }
      const role = await getUserRole().catch(() => 'teacher')
      navigate(role === 'student' ? '/student' : '/teacher', { replace: true })
    }
    redirect()
  }, [navigate])

  return null
}
