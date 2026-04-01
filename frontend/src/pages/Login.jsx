import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const inp = { padding: '0.75rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', color: '#f0f0f0', fontSize: '0.95rem', outline: 'none', width: '100%' }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', paddingTop: '64px', padding: '2rem'}}>
      <div style={{background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '420px'}}>
        <div style={{fontFamily: 'monospace', fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', marginBottom: '1.5rem'}}>
          <span style={{color: '#E8580C'}}>⬡ </span>IRON<span style={{color: '#E8580C'}}>GRID</span>
        </div>
        <h1 style={{fontFamily: 'monospace', fontSize: '2rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.4rem'}}>Welcome Back</h1>
        <p style={{color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem'}}>Sign in to access the equipment catalogue.</p>

        {error && <div style={{background: 'rgba(229,85,85,0.1)', border: '1px solid rgba(229,85,85,0.3)', color: '#e55', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem'}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
            <label style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888'}}>Username</label>
            <input style={inp} type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="your_username" required />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.4rem'}}>
            <label style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888'}}>Password</label>
            <input style={inp} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} style={{padding: '0.85rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', opacity: loading ? 0.6 : 1}}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888'}}>
          Don't have an account? <Link to="/register" style={{color: '#E8580C', fontWeight: 500}}>Register free</Link>
        </p>
      </div>
    </div>
  )
}
