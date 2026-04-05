import { Link } from 'react-router-dom'
import { useCart } from '../store/cartStore'

export default function Cart() {
  const { items, removeItem, clearCart, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
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

  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', color: '#f0f0f0'}}>
      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <span style={{fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8580C', display: 'block', marginBottom: '0.4rem'}}>Your Cart</span>
            <h1 style={{fontFamily: 'monospace', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 'bold'}}>{totalItems} Item{totalItems !== 1 ? 's' : ''}</h1>
          </div>
          <button onClick={clearCart} style={{background: 'none', border: '1px solid #2a2a2a', color: '#555', padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '2px'}}>Clear All</button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {items.map(item => (
              <div key={item.id} style={{display: 'flex', gap: '1.25rem', padding: '1.25rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', alignItems: 'center'}}>
                <div style={{width: '100px', height: '80px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'}}>
                  {item.image ? <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : '⚙️'}
                </div>
                <div style={{flex: 1}}>
                  <span style={{display: 'inline-block', padding: '0.15rem 0.5rem', background: 'rgba(232,88,12,0.15)', color: '#E8580C', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', marginBottom: '0.4rem'}}>{item.category}</span>
                  <h3 style={{fontFamily: 'monospace', fontSize: '1rem', color: '#fff', fontWeight: 600, marginBottom: '0.4rem'}}>{item.name}</h3>
                  <p style={{fontSize: '0.82rem', color: '#555'}}>{item.quantity} unit{item.quantity > 1 ? 's' : ''} × {item.days} day{item.days > 1 ? 's' : ''}</p>
                </div>
                <div style={{textAlign: 'right', flexShrink: 0}}>
                  <p style={{fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600, color: '#E8580C', marginBottom: '0.5rem'}}>
                    KES {(Number(item.price) * item.quantity * item.days).toLocaleString()}
                  </p>
                  <button onClick={() => removeItem(item.id)} style={{background: 'none', border: 'none', color: '#555', fontSize: '0.8rem', cursor: 'pointer', padding: 0}}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '1.5rem', position: 'sticky', top: '84px'}}>
            <h3 style={{fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', paddingBottom: '0.75rem', borderBottom: '1px solid #1e1e1e', marginBottom: '1rem'}}>Order Summary</h3>
            {items.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: '0.5rem'}}>
                <span>{item.name} ({item.quantity}u × {item.days}d)</span>
                <span>KES {(Number(item.price) * item.quantity * item.days).toLocaleString()}</span>
              </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #1e1e1e', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff'}}>
              <span>Total</span>
              <span style={{color: '#E8580C'}}>KES {totalPrice.toLocaleString()}</span>
            </div>
            <button style={{width: '100%', padding: '0.9rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', marginTop: '1rem'}}>
              Confirm Rental →
            </button>
            <Link to="/products" style={{display: 'block', textAlign: 'center', color: '#555', fontSize: '0.82rem', marginTop: '1rem', textDecoration: 'none'}}>
              ← Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
