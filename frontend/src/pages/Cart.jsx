import { Link } from 'react-router-dom'

export default function Cart() {
  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', color: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', padding: '4rem'}}>
        <div style={{fontSize: '4rem', opacity: 0.3, marginBottom: '1.5rem'}}>⚙️</div>
        <h2 style={{fontFamily: 'monospace', fontSize: '1.8rem', color: '#fff', fontWeight: 'bold', marginBottom: '0.75rem'}}>Your cart is empty</h2>
        <p style={{color: '#888', fontSize: '0.95rem', marginBottom: '2rem'}}>Browse our catalogue and add equipment to your rental cart.</p>
        <Link to="/products" style={{display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.75rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px'}}>Browse Equipment</Link>
      </div>
    </div>
  )
}
