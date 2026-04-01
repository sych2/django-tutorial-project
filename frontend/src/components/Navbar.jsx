import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,10,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(232,88,12,0.3)',height:'64px'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 2rem',height:'100%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:'0.5rem',textDecoration:'none'}}>
          <span style={{color:'#E8580C',fontSize:'1.5rem'}}>⬡</span>
          <span style={{fontFamily:'monospace',fontSize:'1.4rem',color:'#fff',letterSpacing:'0.1em',fontWeight:'bold'}}>IRON<span style={{color:'#E8580C'}}>GRID</span></span>
        </Link>

        <div style={{display:'flex',alignItems:'center',gap:'2rem'}}>
          <Link to="/" style={{color:'#aaa',textDecoration:'none',fontSize:'0.85rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Home</Link>
          <Link to="/products" style={{color:'#aaa',textDecoration:'none',fontSize:'0.85rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Equipment</Link>
          <Link to="/cart" style={{color:'#aaa',textDecoration:'none',fontSize:'0.85rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Cart</Link>
          {user ? (
            <>
              <span style={{fontSize:'0.8rem',color:'#aaa'}}>{user.first_name} <span style={{color:'#E8580C'}}>[{user.role}]</span></span>
              <button onClick={handleLogout} style={{background:'none',border:'1px solid rgba(255,255,255,0.15)',color:'#aaa',padding:'0.4rem 1rem',fontSize:'0.8rem',cursor:'pointer',borderRadius:'2px'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color:'#fff',textDecoration:'none',padding:'0.4rem 1rem',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'2px',fontSize:'0.8rem'}}>Login</Link>
              <Link to="/register" style={{color:'#fff',textDecoration:'none',padding:'0.4rem 1rem',background:'#E8580C',borderRadius:'2px',fontSize:'0.8rem'}}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
