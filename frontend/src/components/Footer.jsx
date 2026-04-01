import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{background:'#050505',borderTop:'1px solid rgba(232,88,12,0.2)',marginTop:'auto'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'3rem 2rem',display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'3rem'}}>
        <div>
          <div style={{fontFamily:'monospace',fontSize:'1.3rem',color:'#fff',fontWeight:'bold'}}>
            <span style={{color:'#E8580C'}}>⬡ </span>IRON<span style={{color:'#E8580C'}}>GRID</span>
          </div>
          <p style={{marginTop:'1rem',color:'#555',fontSize:'0.85rem',lineHeight:'1.6',maxWidth:'280px'}}>
            Africa's heavy machinery rental platform. Built for construction and mining operations.
          </p>
        </div>
        <div>
          <h4 style={{color:'#fff',fontSize:'0.75rem',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>Platform</h4>
          {['/', '/products', '/cart', '/register'].map((path, i) => (
            <Link key={path} to={path} style={{display:'block',color:'#555',textDecoration:'none',fontSize:'0.85rem',marginBottom:'0.6rem'}}>
              {['Home','Equipment','Cart','Get Started'][i]}
            </Link>
          ))}
        </div>
        <div>
          <h4 style={{color:'#fff',fontSize:'0.75rem',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>Company</h4>
          {['About','Contact','Terms'].map(l => (
            <a key={l} href="#" style={{display:'block',color:'#555',textDecoration:'none',fontSize:'0.85rem',marginBottom:'0.6rem'}}>{l}</a>
          ))}
        </div>
      </div>
      <div style={{borderTop:'1px solid #111',padding:'1.5rem 2rem',maxWidth:'1280px',margin:'0 auto',display:'flex',justifyContent:'space-between'}}>
        <p style={{color:'#333',fontSize:'0.75rem'}}>© {new Date().getFullYear()} IronGrid Africa. All rights reserved.</p>
        <p style={{color:'#333',fontSize:'0.75rem'}}>Dubu Huru Ltd · Nairobi, Kenya</p>
      </div>
    </footer>
  )
}
