import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const CATEGORIES = [
  { name: 'Excavators', icon: '🏗️', desc: 'Heavy digging & earthmoving' },
  { name: 'Cranes', icon: '🏛️', desc: 'Lifting & material handling' },
  { name: 'Bulldozers', icon: '⚙️', desc: 'Land clearing & grading' },
  { name: 'Dump Trucks', icon: '🚛', desc: 'Haulage & transport' },
  { name: 'Concrete Mixers', icon: '🔩', desc: 'Batching & mixing' },
  { name: 'Drilling Rigs', icon: '⛏️', desc: 'Mining & exploration' },
]

const STATS = [
  { value: '500+', label: 'Machines Available' },
  { value: '12', label: 'African Countries' },
  { value: '2,400+', label: 'Completed Rentals' },
  { value: '98%', label: 'Uptime Guarantee' },
]

const OWNER_PERKS = [
  { icon: '📋', title: 'Easy Listings', desc: 'Post your machine in under 5 minutes with our guided form.' },
  { icon: '💰', title: 'Earn More', desc: 'Set your own daily, hourly or weekly rate in KES.' },
  { icon: '📍', title: 'Local Reach', desc: 'Get discovered by contractors in your county and beyond.' },
  { icon: '🔒', title: 'Secure Bookings', desc: 'We verify renters so your equipment is always in good hands.' },
]

const s = {
  page: { background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', color: '#f0f0f0' },
  hero: { minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' },
  heroGrid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(232,88,12,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,88,12,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' },
  heroGlow: { position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(232,88,12,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' },
  label: { fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8580C', marginBottom: '0.75rem', display: 'block' },
  heroTitle: { fontFamily: 'monospace', fontSize: 'clamp(3.5rem, 9vw, 7rem)', lineHeight: 0.95, letterSpacing: '0.03em', color: '#fff', margin: '1rem 0', fontWeight: 'bold' },
  heroSub: { color: '#888', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '500px', marginBottom: '2rem' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#E8580C', color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '2px', cursor: 'pointer', textDecoration: 'none' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'transparent', color: '#f0f0f0', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', textDecoration: 'none' },
  btnOutlineOrange: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: 'transparent', color: '#E8580C', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid #E8580C', borderRadius: '2px', cursor: 'pointer', textDecoration: 'none' },
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ── Adjust to match how your app tracks auth ──────────────────────
  // If using AuthContext: const { user } = useContext(AuthContext)
  //                       const isAuthenticated = !!user
  const isAuthenticated = !!localStorage.getItem('access_token')

  useEffect(() => {
    api.get('/home/api/products/')
      .then(({ data }) => setProducts(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Authenticated → /post-machine, unauthenticated → /login (with redirect back)
  const handlePostMachine = () => {
    if (isAuthenticated) {
      navigate('/post-machine')
    } else {
      navigate('/login', { state: { next: '/post-machine' } })
    }
  }

  // Authenticated → /post-machine (change to /dashboard when ready)
  // Unauthenticated → /register
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/post-machine')
    } else {
      navigate('/register')
    }
  }

  return (
    <div style={s.page}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroGrid} />
        <div style={s.heroGlow} />
        <div style={{...s.container, position: 'relative', zIndex: 1, paddingTop: '4rem', paddingBottom: '4rem'}}>
          <span style={s.label}>Africa's #1 Heavy Machinery Platform</span>
          <h1 style={s.heroTitle}>
            RENT THE<br />
            <span style={{color: '#E8580C'}}>IRON</span> YOU<br />
            NEED
          </h1>
          <p style={s.heroSub}>
            Excavators, cranes, bulldozers and more — sourced, vetted, and delivered to your site across Africa.
          </p>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <Link to="/products" style={s.btnPrimary}>Browse Equipment</Link>

            {/* Shows "Post a Machine" when logged in, "Get Started Free" when not */}
            <button onClick={handleGetStarted} style={s.btnSecondary}>
              {isAuthenticated ? 'Post a Machine' : 'Get Started Free'}
            </button>

            <button onClick={handlePostMachine} style={s.btnOutlineOrange}>
              + List Your Machine
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section style={{background: '#111', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e'}}>
        <div style={{...s.container, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{padding: '2rem', textAlign: 'center', borderRight: i < 3 ? '1px solid #1e1e1e' : 'none'}}>
              <div style={{fontFamily: 'monospace', fontSize: '2.5rem', color: '#E8580C', fontWeight: 'bold'}}>{stat.value}</div>
              <div style={{fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginTop: '0.3rem'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── List Your Machine CTA ──────────────────────────────────── */}
      <section style={{padding: '6rem 0', background: '#0d0d0d', borderBottom: '1px solid #1e1e1e', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', bottom: '-20%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(232,88,12,0.07) 0%, transparent 70%)', pointerEvents: 'none'}} />
        <div style={{...s.container, position: 'relative', zIndex: 1}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'}}>

            {/* Left: copy */}
            <div>
              <span style={s.label}>For Machine Owners</span>
              <h2 style={{fontFamily: 'monospace', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1.25rem'}}>
                GOT HEAVY<br />
                <span style={{color: '#E8580C'}}>EQUIPMENT</span><br />
                SITTING IDLE?
              </h2>
              <p style={{color: '#888', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '440px'}}>
                Put your machines to work. List your forklift, excavator, crane or any heavy equipment on IronGrid and start earning from contractors across Kenya and beyond.
              </p>
              <button onClick={handlePostMachine} style={{...s.btnPrimary, fontSize: '1rem', padding: '0.9rem 2rem'}}>
                {isAuthenticated ? '+ Post Your Machine' : "+ Get Started — It's Free"}
              </button>
              {!isAuthenticated && (
                <p style={{marginTop: '0.75rem', fontSize: '0.8rem', color: '#555', fontFamily: 'monospace'}}>
                  Already have an account?{' '}
                  <button
                    onClick={handlePostMachine}
                    style={{background: 'none', border: 'none', color: '#E8580C', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.8rem', padding: 0, textDecoration: 'underline'}}
                  >
                    Log in to list
                  </button>
                </p>
              )}
            </div>

            {/* Right: perks grid */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', border: '1px solid #1e1e1e'}}>
              {OWNER_PERKS.map((perk) => (
                <div key={perk.title} style={{padding: '1.75rem', background: '#111'}}>
                  <div style={{fontSize: '1.5rem', marginBottom: '0.75rem'}}>{perk.icon}</div>
                  <h3 style={{fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '0.4rem'}}>{perk.title}</h3>
                  <p style={{fontSize: '0.8rem', color: '#555', lineHeight: 1.6}}>{perk.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section style={{padding: '6rem 0'}}>
        <div style={s.container}>
          <span style={s.label}>What We Offer</span>
          <h2 style={{fontFamily: 'monospace', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 'bold', marginBottom: '3rem'}}>Equipment Categories</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', border: '1px solid #1e1e1e'}}>
            {CATEGORIES.map((cat) => (
              <Link to={`/products?category=${cat.name}`} key={cat.name} style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#111', textDecoration: 'none', transition: 'background 0.2s'}}>
                <span style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>{cat.icon}</span>
                <h3 style={{fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, color: '#fff'}}>{cat.name}</h3>
                <p style={{fontSize: '0.82rem', color: '#555'}}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────── */}
      <section style={{padding: '6rem 0', background: '#111'}}>
        <div style={s.container}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem'}}>
            <div>
              <span style={s.label}>Top Listings</span>
              <h2 style={{fontFamily: 'monospace', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 'bold'}}>Featured Equipment</h2>
            </div>
            <Link to="/products" style={s.btnSecondary}>View All →</Link>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '4rem', color: '#555'}}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', padding: '4rem', color: '#555'}}>
              <p>No equipment listed yet.</p>
              <Link to="/products" style={{...s.btnPrimary, marginTop: '1rem', display: 'inline-flex'}}>Browse Catalogue</Link>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem'}}>
              {products.map((p) => (
                <Link to={`/products/${p.id}`} key={p.id} style={{textDecoration: 'none', background: '#1a1a1a', border: '1px solid #1e1e1e', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  <div style={{aspectRatio: '4/3', overflow: 'hidden', background: '#222', position: 'relative'}}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>⚙️</div>
                    }
                    {p.is_sale && <span style={{position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#E8580C', color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', padding: '0.2rem 0.5rem'}}>SALE</span>}
                  </div>
                  <div style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    <span style={{display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(232,88,12,0.15)', color: '#E8580C', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px'}}>{p.category?.name}</span>
                    <h3 style={{fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, color: '#fff'}}>{p.name}</h3>
                    <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto'}}>
                      {p.is_sale
                        ? <><span style={{fontSize: '1.05rem', fontWeight: 600, color: '#E8580C'}}>KES {Number(p.sale_price).toLocaleString()}</span><span style={{fontSize: '0.85rem', color: '#444', textDecoration: 'line-through'}}>KES {Number(p.price).toLocaleString()}</span></>
                        : <span style={{fontSize: '1.05rem', fontWeight: 600, color: '#E8580C'}}>KES {Number(p.price).toLocaleString()}</span>
                      }
                      <span style={{fontSize: '0.75rem', color: '#555'}}>/day</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section style={{padding: '6rem 0', borderTop: '1px solid #1e1e1e'}}>
        <div style={{...s.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem', flexWrap: 'wrap'}}>
          <div>
            <span style={s.label}>Ready to Start?</span>
            <h2 style={{fontFamily: 'monospace', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 'bold', marginBottom: '1rem'}}>Get Your Equipment<br />on the Ground</h2>
            <p style={{color: '#888', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '480px'}}>Join thousands of contractors and mining operations who trust IronGrid.</p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>

            {/* Shows "Post a Machine" when logged in, "Create Free Account" when not */}
            <button onClick={handleGetStarted} style={s.btnPrimary}>
              {isAuthenticated ? 'Post a Machine' : 'Create Free Account'}
            </button>

            <Link to="/products" style={s.btnSecondary}>Browse Catalogue</Link>
            <button onClick={handlePostMachine} style={s.btnOutlineOrange}>+ List Your Machine</button>
          </div>
        </div>
      </section>

    </div>
  )
}
