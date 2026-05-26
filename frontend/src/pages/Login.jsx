import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import axios from 'axios'

export default function Login() {
  const { login, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirect to Django allauth Google OAuth flow
    window.location.href = 'http://localhost:8000/accounts/google/login/'
  }

  const handleAdminSession = async (accessToken) => {
    try {
      await axios.post(
        'http://localhost:8000/api/auth/admin-session/',
        { access: accessToken },
        { withCredentials: true }
      )
      window.location.href = 'http://localhost:8000/admin/'
    } catch {
      // not an admin, proceed normally
    }
  }

  const inp = {
    padding: '0.75rem 1rem',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '2px',
    color: '#f0f0f0',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '2rem' }}>
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

        <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          <span style={{ color: '#E8580C' }}>⬡ </span>IRON<span style={{ color: '#E8580C' }}>GRID</span>
        </div>

        <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.4rem' }}>Welcome Back</h1>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>Sign in to access the equipment catalogue.</p>

        {error && (
          <div style={{ background: 'rgba(229,85,85,0.1)', border: '1px solid rgba(229,85,85,0.3)', color: '#e55', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Username</label>
            <input style={inp} type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="your_username" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Password</label>
            <input style={inp} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} style={{ padding: '0.85rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
          <span style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
        </div>

        {/* Google OAuth button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: 'transparent',
            color: '#f0f0f0',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            border: '1px solid #2a2a2a',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            opacity: googleLoading ? 0.6 : 1,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#E8580C'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
        >
          {/* Google SVG icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Don't have an account? <Link to="/register" style={{ color: '#E8580C', fontWeight: 500 }}>Register free</Link>
        </p>
      </div>
    </div>
  )
}
