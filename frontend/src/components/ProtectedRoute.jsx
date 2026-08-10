import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { getUserRole } from '../services/authService'

export default function ProtectedRoute({ children, requiredRole }) {
  const [session, setSession] = useState(undefined)
  const [role, setRole] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session && requiredRole) {
        getUserRole().then(setRole).catch(() => setRole(null))
      }
    })
  }, [requiredRole])

  if (session === undefined) return null
  if (!session) return <Navigate to="/login" replace />

  if (requiredRole) {
    if (role === undefined) return null
    if (role !== requiredRole) return <Navigate to={role === 'student' ? '/student' : '/teacher'} replace />
  }

  return children
}
