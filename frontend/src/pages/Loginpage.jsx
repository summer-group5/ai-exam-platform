import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getUserRole } from '../services/authService'
import './Loginpage.css'

export default function Loginpage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      const role = await getUserRole()
      navigate(role === 'student' ? '/student' : '/teacher')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>

      <div className='login-card'>

        <div className='login-logo'>[Logo]</div>

        <h1>Exam Platform</h1>
        <p className='login-subtitle'>Sign in to continue</p>

        <form onSubmit={handleSubmit}>

          <div className='login-form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='login-form-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className='login-error'>{error}</p>}

          <button type='submit' className='login-btn' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        <a href='#' className='login-forgot'>Forgot password?</a>

      </div>

    </div>
  )
}
