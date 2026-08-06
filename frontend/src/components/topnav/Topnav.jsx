//Topnav.jsx
import React, { useEffect, useState } from 'react'
import "./Topnav.css"
import { Link, useNavigate } from "react-router-dom"
import { logout } from '../../services/authService'
import { supabase } from '../../utils/supabase'

export default function Topnav({ links }) {

  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const defaultLinks = [
    { text: "Home", path: "/" },
    ...(!session ? [{ text: "Login", path: "/login" }] : [])
  ];

  const navLinks = links || defaultLinks;

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className='topnav'>
        {navLinks.map(link => (
          <Link
          key={link.path}
          to={link.path}
          className='nav-link'
          >
          {link.text}
          </Link>
        ))}
        {session && <button onClick={handleLogout} className='nav-logout'>Logout</button>}
    </nav>
  )
}
