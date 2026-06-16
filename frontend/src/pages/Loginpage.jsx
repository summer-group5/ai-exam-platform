import React, { useState } from 'react'
import './Loginpage.css'

export default function Loginpage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='login-page'>

      <div className='login-card'>

        <div className='login-logo'>[Logo]</div>

        <h1>Exam Platform</h1>
        <p className='login-subtitle'>Sign in to continue</p>

        <form>

          <div className='login-form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className='login-form-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type='submit' className='login-btn'>
            Sign in
          </button>

        </form>

        <a href='#' className='login-forgot'>Forgot password?</a>

      </div>

    </div>
  )
}
