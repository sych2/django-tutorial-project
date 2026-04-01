import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', phone_number: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat()[0] : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inp = { padding: '0.75rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', color: '#f0f0f0', fontSize: '0.95rem', outline: 'none', width: '100%' }
  const lbl = { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }
  const grp = { display: 'flex', flexDirection: 'column', gap: '0.4rem' }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '5rem 2rem 2rem'}}>
      <div style={{background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '560px'}}>
        <div style={{fontFamily: 'monospace', fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', marginBottom: '1.5rem'}}>
          <span style={{color: '#E8580C'}}>⬡ </span>IRON<span style={{color: '#E8580C'}}>GRID</span>
        </div>
        <h1 style={{fontFamily: 'monospace', fontSize: '2rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.4rem'}}>Create Account</h1>
        <p style={{color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem'}}>Join IronGrid and access Africa's largest machinery catalogue.</p>

        {error && <div style={{background: 'rgba(229,85,85,0.1)', border: '1px solid rgba(229,85,85,0.3)', color: '#e55', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem'}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div style={grp}><label style={lbl}>First Name</label><input style={inp} type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="John" required /></div>
            <div style={grp}><label style={lbl}>Last Name</label><input style={inp} type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Doe" required /></div>
          </div>
          <div style={grp}><label style={lbl}>Username</label><input style={inp} type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="john_doe" required /></div>
          <div style={grp}><label style={lbl}>Email</label><input style={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@company.com" required /></div>
          <div style={grp}><label style={lbl}>Phone Number</label><input style={inp} type="tel" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} placeholder="+254 700 000 000" required /></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div style={grp}><label style={lbl}>Password</label><input style={inp} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required /></div>
            <div style={grp}><label style={lbl}>Confirm</label><input style={inp} type="password" value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} placeholder="••••••••" required /></div>
          </div>
          <button type="submit" disabled={loading} style={{padding: '0.85rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', opacity: loading ? 0.6 : 1}}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888'}}>
          Already have an account? <Link to="/login" style={{color: '#E8580C', fontWeight: 500}}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
