import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    Promise.all([api.get('/home/api/products/'), api.get('/home/api/categories/')])
      .then(([p, c]) => { setProducts(p.data); setCategories([{ id: 0, name: 'All' }, ...c.data]) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category?.name === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', color: '#f0f0f0'}}>
      <div style={{background: '#111', borderBottom: '1px solid #1e1e1e', padding: '3rem 2rem 2rem'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <span style={{fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8580C', display: 'block', marginBottom: '0.5rem'}}>Catalogue</span>
          <h1 style={{fontFamily: 'monospace', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 'bold'}}>Available Equipment</h1>
        </div>
      </div>

      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'start'}}>
        {/* Sidebar */}
        <aside style={{position: 'sticky', top: '84px'}}>
          <div style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem'}}>Search</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search equipment..." style={{padding: '0.65rem 0.9rem', background: '#111', border: '1px solid #2a2a2a', borderRadius: '2px', color: '#f0f0f0', fontSize: '0.88rem', outline: 'none', width: '100%'}} />
          </div>
          <div>
            <h3 style={{fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '0.75rem'}}>Category</h3>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSearchParams(cat.name === 'All' ? {} : { category: cat.name })}
                style={{display: 'block', width: '100%', background: activeCategory === cat.name ? 'rgba(232,88,12,0.15)' : 'none', border: 'none', color: activeCategory === cat.name ? '#E8580C' : '#888', fontSize: '0.85rem', padding: '0.5rem 0.75rem', textAlign: 'left', cursor: 'pointer', borderRadius: '2px', marginBottom: '0.3rem', fontWeight: activeCategory === cat.name ? 600 : 400}}>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <main>
          <p style={{fontSize: '0.8rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.5rem'}}>{filtered.length} machine{filtered.length !== 1 ? 's' : ''} available</p>
          {loading ? (
            <div style={{textAlign: 'center', padding: '4rem', color: '#555'}}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '4rem', color: '#555'}}>No equipment found.</div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
              {filtered.map(p => (
                <Link to={`/products/${p.id}`} key={p.id} style={{textDecoration: 'none', background: '#1a1a1a', border: '1px solid #1e1e1e', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  <div style={{aspectRatio: '4/3', overflow: 'hidden', background: '#222', position: 'relative'}}>
                    {p.image ? <img src={p.image} alt={p.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>⚙️</div>}
                    {p.is_sale && <span style={{position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#E8580C', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem'}}>SALE</span>}
                  </div>
                  <div style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
                    <span style={{display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(232,88,12,0.15)', color: '#E8580C', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', alignSelf: 'flex-start'}}>{p.category?.name}</span>
                    <h3 style={{fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600, color: '#fff'}}>{p.name}</h3>
                    {p.description && <p style={{fontSize: '0.82rem', color: '#555', lineHeight: 1.5}}>{p.description.slice(0, 80)}...</p>}
                    <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto'}}>
                      {p.is_sale ? <><span style={{fontSize: '1.05rem', fontWeight: 600, color: '#E8580C'}}>KES {Number(p.sale_price).toLocaleString()}</span><span style={{fontSize: '0.85rem', color: '#444', textDecoration: 'line-through'}}>KES {Number(p.price).toLocaleString()}</span></> : <span style={{fontSize: '1.05rem', fontWeight: 600, color: '#E8580C'}}>KES {Number(p.price).toLocaleString()}</span>}
                      <span style={{fontSize: '0.75rem', color: '#555'}}>/day</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
