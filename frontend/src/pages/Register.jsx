import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

// ── Password strength logic ──────────────────────────────────────
const SEQUENCES = [
  '0123456789',
  'abcdefghijklmnopqrstuvwxyz',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
]

function hasObviousSequence(password) {
  const lower = password.toLowerCase()
  return SEQUENCES.some(seq => {
    for (let i = 0; i <= seq.length - 3; i++) {
      if (lower.includes(seq.slice(i, i + 3))) return true
    }
    return false
  })
}

function getRequirements(password) {
  return {
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    lower:   /[a-z]/.test(password),
    number:  /[0-9]/.test(password),
    symbol:  /[^A-Za-z0-9]/.test(password),
    noSeq:   password.length < 3 || !hasObviousSequence(password),
  }
}

function getStrength(password, reqs) {
  if (!password) return null
  const score = Object.values(reqs).filter(Boolean).length
  if (score <= 1) return { label: 'Too weak', color: '#E24B4A', pct: 16 }
  if (score <= 2) return { label: 'Weak',     color: '#EF9F27', pct: 35 }
  if (score <= 3) return { label: 'Fair',     color: '#EF9F27', pct: 55 }
  if (score <= 4) return { label: 'Good',     color: '#4caf7d', pct: 75 }
  return             { label: 'Strong',    color: '#1D9E75', pct: 100 }
}

// ── Sub-components ───────────────────────────────────────────────
function RequirementRow({ met, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: met ? '#1D9E75' : '#2a2a2a',
        transition: 'background 0.25s',
      }} />
      <span style={{
        fontSize: '0.78rem',
        color: met ? '#4caf7d' : '#555',
        transition: 'color 0.25s',
      }}>
        {label}
      </span>
    </div>
  )
}

function PasswordField({ value, onChange }) {
  const [visible, setVisible] = useState(false)
  const reqs = getRequirements(value)
  const strength = getStrength(value, reqs)

  const requirements = [
    { key: 'length',  label: 'At least 8 characters' },
    { key: 'upper',   label: 'Uppercase letter (A–Z)' },
    { key: 'lower',   label: 'Lowercase letter (a–z)' },
    { key: 'number',  label: 'Number (0–9)' },
    { key: 'symbol',  label: 'Special character (!@#$...)' },
    { key: 'noSeq',   label: 'No obvious sequences (123, abc, qwerty)' },
  ]

  const isStrong = strength?.label === 'Strong'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={lbl}>Password</label>

      {/* Input row */}
      <div style={{ position: 'relative' }}>
        <input
          style={{ ...inp, paddingRight: '3.5rem' }}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%',
            transform: 'translateY(-50%)', background: 'none', border: 'none',
            color: '#666', fontSize: '0.75rem', cursor: 'pointer',
            fontFamily: 'monospace', letterSpacing: '0.05em', padding: 0,
          }}
        >
          {visible ? 'hide' : 'show'}
        </button>
      </div>

      {/* Strength bar — only shows once user starts typing */}
      {value && (
        <>
          <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${strength.pct}%`,
              background: strength.color,
              transition: 'width 0.3s, background 0.3s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: strength.color, transition: 'color 0.3s',
            }}>
              {strength.label}
            </span>
            {isStrong && (
              <span style={{ fontSize: '0.72rem', color: '#1D9E75' }}>
                All requirements met
              </span>
            )}
          </div>

          {/* Requirements checklist */}
          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '0.6rem' }}>
            {requirements.map(r => (
              <RequirementRow key={r.key} met={reqs[r.key]} label={r.label} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Shared styles (kept from your original) ──────────────────────
const inp = {
  padding: '0.75rem 1rem', background: '#1a1a1a',
  border: '1px solid #2a2a2a', borderRadius: '2px',
  color: '#f0f0f0', fontSize: '0.95rem', outline: 'none', width: '100%',
  boxSizing: 'border-box',
}
const lbl = {
  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#888',
}
const grp = { display: 'flex', flexDirection: 'column', gap: '0.4rem' }

// ── Main component ───────────────────────────────────────────────
export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    phone_number: '', password: '', password2: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const reqs = getRequirements(form.password)
  const strength = getStrength(form.password, reqs)
  const passwordStrong = strength?.label === 'Strong'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!passwordStrong) {
      setError('Please choose a stronger password before continuing.')
      return
    }
    if (form.password !== form.password2) {
      setError('Passwords do not match.')
      return
    }

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '5rem 2rem 2rem' }}>
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '2.5rem', width: '100%', maxWidth: '560px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          <span style={{ color: '#E8580C' }}>⬡ </span>IRON<span style={{ color: '#E8580C' }}>GRID</span>
        </div>
        <h1 style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.4rem' }}>Create Account</h1>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>Join IronGrid and access Africa's largest machinery catalogue.</p>

        {error && (
          <div style={{ background: 'rgba(229,85,85,0.1)', border: '1px solid rgba(229,85,85,0.3)', color: '#e55', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={grp}><label style={lbl}>First Name</label><input style={inp} type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="John" required /></div>
            <div style={grp}><label style={lbl}>Last Name</label><input style={inp} type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Doe" required /></div>
          </div>
          <div style={grp}><label style={lbl}>Username</label><input style={inp} type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="john_doe" required /></div>
          <div style={grp}><label style={lbl}>Email</label><input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" required /></div>
          <div style={grp}><label style={lbl}>Phone Number</label><input style={inp} type="tel" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} placeholder="+254 700 000 000" required /></div>

          {/* Password with strength checker */}
          <PasswordField
            value={form.password}
            onChange={password => setForm({ ...form, password })}
          />

          {/* Confirm password */}
          <div style={grp}>
            <label style={lbl}>Confirm password</label>
            <input
              style={{
                ...inp,
                borderColor: form.password2 && form.password !== form.password2
                  ? 'rgba(229,85,85,0.5)'
                  : '#2a2a2a',
              }}
              type="password"
              value={form.password2}
              onChange={e => setForm({ ...form, password2: e.target.value })}
              placeholder="••••••••"
              required
            />
            {form.password2 && form.password !== form.password2 && (
              <span style={{ fontSize: '0.78rem', color: '#e55' }}>Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordStrong}
            style={{
              padding: '0.85rem', background: '#E8580C', color: '#fff',
              fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', borderRadius: '2px', cursor: loading || !passwordStrong ? 'not-allowed' : 'pointer',
              opacity: loading || !passwordStrong ? 0.45 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
          Already have an account? <Link to="/login" style={{ color: '#E8580C', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
