import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../store/cartStore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [days, setDays] = useState(1)
  const [added, setAdded] = useState(false)

  const alreadyInCart = items.some(i => i.id === Number(id))

  useEffect(() => {
    api.get(`/home/api/products/${id}/`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    addItem(product, quantity, days)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const price = product ? (product.is_sale ? Number(product.sale_price) : Number(product.price)) : 0
  const total = price * quantity * days

  const inp = { padding: '0.65rem 0.9rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '2px', color: '#f0f0f0', fontSize: '1rem', outline: 'none', width: '80px', textAlign: 'center' }
  const btn = { width: '32px', height: '32px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', cursor: 'pointer', borderRadius: '2px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }

  if (loading) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#555'}}>
      Loading...
    </div>
  )

  if (!product) return null

  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', color: '#f0f0f0'}}>
      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem'}}>

        {/* Breadcrumb */}
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: '#555'}}>
          <Link to="/" style={{color: '#555'}}>Home</Link>
          <span>→</span>
          <Link to="/products" style={{color: '#555'}}>Equipment</Link>
          <span>→</span>
          <span style={{color: '#E8580C'}}>{product.name}</span>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start'}}>

          {/* Image */}
          <div style={{position: 'sticky', top: '84px'}}>
            <div style={{aspectRatio: '4/3', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px', overflow: 'hidden', position: 'relative'}}>
              {product.image
                ? <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem'}}>⚙️</div>
              }
              {product.is_sale && (
                <span style={{position: 'absolute', top: '1rem', left: '1rem', background: '#E8580C', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', padding: '0.3rem 0.7rem'}}>ON SALE</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
              <span style={{display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(232,88,12,0.15)', color: '#E8580C', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', marginBottom: '0.75rem'}}>{product.category?.name}</span>
              <h1 style={{fontFamily: 'monospace', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 'bold', lineHeight: 1.1}}>{product.name}</h1>
            </div>

            {/* Price */}
            <div style={{display: 'flex', alignItems: 'baseline', gap: '0.75rem', padding: '1.25rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px'}}>
              <span style={{fontFamily: 'monospace', fontSize: '2rem', fontWeight: 'bold', color: '#E8580C'}}>KES {price.toLocaleString()}</span>
              <span style={{color: '#555', fontSize: '0.9rem'}}>/day per unit</span>
              {product.is_sale && (
                <span style={{fontSize: '1rem', color: '#444', textDecoration: 'line-through', marginLeft: 'auto'}}>KES {Number(product.price).toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{color: '#888', lineHeight: 1.7, fontSize: '0.95rem'}}>{product.description}</p>
            )}

            {/* Quantity & Days */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '4px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888'}}>Units</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <button style={btn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <input style={inp} type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} />
                  <button style={btn} onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888'}}>Rental Days</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <button style={btn} onClick={() => setDays(d => Math.max(1, d - 1))}>−</button>
                  <input style={inp} type="number" min="1" value={days} onChange={e => setDays(Math.max(1, Number(e.target.value)))} />
                  <button style={btn} onClick={() => setDays(d => d + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Total */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'rgba(232,88,12,0.08)', border: '1px solid rgba(232,88,12,0.2)', borderRadius: '4px'}}>
              <span style={{fontSize: '0.82rem', color: '#888'}}>
                {quantity} unit{quantity > 1 ? 's' : ''} × {days} day{days > 1 ? 's' : ''}
              </span>
              <span style={{fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 'bold', color: '#E8580C'}}>
                KES {total.toLocaleString()}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{padding: '1rem', background: added ? '#2a6e2a' : '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', transition: 'background 0.3s'}}
            >
              {added ? '✓ Added to Cart' : alreadyInCart ? 'Update Cart' : 'Add to Cart →'}
            </button>

            {alreadyInCart && !added && (
              <Link to="/cart" style={{display: 'block', textAlign: 'center', color: '#E8580C', fontSize: '0.85rem', fontWeight: 500}}>
                View Cart →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
