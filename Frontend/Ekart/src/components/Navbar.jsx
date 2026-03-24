import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import logo from '../assets/logo.jpg'
import { ShoppingCart, Zap } from 'lucide-react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { toast } from 'sonner'
import { setToken, setUser } from '@/redux/userSlice'
import { setCart, setProducts } from '@/redux/productSlice'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────
   THREE.JS — Animated sine-wave particle strip
   Sits as a subtle decorative element at the
   bottom of the navbar
───────────────────────────────────────────── */
const ParticleWave = () => {
  const pointsRef = useRef()
  const COUNT = 130

  const positions = React.useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = (i / COUNT) * 22 - 11
      arr[i * 3 + 1] = 0
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      pos.setY(i,
        Math.sin(i * 0.28 + t * 2.0) * 0.2 +
        Math.sin(i * 0.12 + t * 0.9) * 0.12
      )
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#6366f1"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  )
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const dispatch     = useDispatch()
  const users        = useSelector(store => store.user.user)
  const accessToken  = useSelector(store => store.user.token)
  const admin        = users?.role === 'admin'
  const { cart }     = useSelector(store => store.product)
  const navigate     = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* refs */
  const headerRef = useRef(null)
  const logoRef   = useRef(null)
  const linksRef  = useRef([])
  const cartRef   = useRef(null)
  const btnRef    = useRef(null)
  const mobileRef = useRef(null)
  const hamRef    = useRef(null)

  /* ── Entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(headerRef.current,
          { y: -72, opacity: 0 },
          { y: 0,   opacity: 1, duration: 0.72 })
        .fromTo(logoRef.current,
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0,  duration: 0.55 }, '-=0.42')
        .fromTo(linksRef.current.filter(Boolean),
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, stagger: 0.09, duration: 0.44 }, '-=0.32')
        .fromTo(cartRef.current,
          { opacity: 0, scale: 0.45 },
          { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(2.5)' }, '-=0.24')
        .fromTo(btnRef.current,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.44 }, '-=0.3')
    })
    return () => ctx.revert()
  }, [])

  /* ── Scroll glass effect ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* ── Mobile menu GSAP ── */
  useEffect(() => {
    if (!mobileRef.current) return
    if (menuOpen) {
      gsap.fromTo(mobileRef.current,
        { autoAlpha: 0, y: -10, scaleY: 0.93, transformOrigin: 'top center' },
        { autoAlpha: 1, y: 0,   scaleY: 1,    duration: 0.36, ease: 'power3.out' })
    } else {
      gsap.to(mobileRef.current,
        { autoAlpha: 0, y: -7, scaleY: 0.95, duration: 0.22, ease: 'power2.in' })
    }
    /* hamburger morph */
    if (hamRef.current) {
      const [b1, b2, b3] = hamRef.current.querySelectorAll('span')
      if (menuOpen) {
        gsap.to(b1, { rotation: 45,  y:  7, duration: 0.26 })
        gsap.to(b2, { autoAlpha: 0,       duration: 0.16 })
        gsap.to(b3, { rotation: -45, y: -7, duration: 0.26 })
      } else {
        gsap.to(b1, { rotation: 0, y: 0, duration: 0.26 })
        gsap.to(b2, { autoAlpha: 1,      duration: 0.22 })
        gsap.to(b3, { rotation: 0, y: 0, duration: 0.26 })
      }
    }
  }, [menuOpen])

  /* ── Hover helpers ── */
  const lift  = e => gsap.to(e.currentTarget, { y: -2,    duration: 0.17, ease: 'power2.out' })
  const drop  = e => gsap.to(e.currentTarget, { y:  0,    duration: 0.17, ease: 'power2.in'  })
  const grow  = e => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.17, ease: 'power2.out' })
  const shrink= e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })

  /* ── Logout ── */
  const logoutHandler = async () => {
    try {
      const res = await axios.post('https://shopping-ekart-backend.onrender.comapi/v1/user/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        dispatch(setUser(null))
        dispatch(setToken(null))
        dispatch(setCart())
        toast.success('User logout Successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message)
    }
  }

  /* link list (same logic, just computed) */
  const navLinks = [
    { to: '/',                    label: 'Home'                       },
    { to: '/products',            label: 'Products'                   },
    ...(users ? [{ to: `/profile/${users._id}`, label: `Hi, ${users.firstName}` }] : []),
    ...(admin ? [{ to: '/dashboard/sales',      label: 'Dashboard', chip: true   }] : []),
  ]

  return (
    <>
      {/* ══════════════════════════════════
          STYLES  (scoped with nb- prefix)
      ══════════════════════════════════ */}
      <style>{`
        .nb-root { font-family:'DM Sans',sans-serif; }

        /* ── header shell ── */
        .nb-header {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:rgba(3,3,16,0.65);
          backdrop-filter:blur(24px) saturate(170%);
          -webkit-backdrop-filter:blur(24px) saturate(170%);
          border-bottom:1px solid rgba(255,255,255,0.07);
          transition:background .35s,box-shadow .35s;
          overflow:visible;
        }
        .nb-header.nb-scrolled {
          background:rgba(3,3,16,0.97);
          box-shadow:0 6px 52px rgba(0,0,0,0.6);
        }

        /* animated gradient top line */
        .nb-header::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,
            transparent 0%,#6366f1 28%,#22d3ee 52%,#a78bfa 74%,transparent 100%);
          background-size:260% 100%;
          animation:nb-line 5s linear infinite;
        }
        @keyframes nb-line{
          0%  {background-position:260% 0}
          100%{background-position:-260% 0}
        }

        /* Three.js particle wave strip */
        .nb-wave{
          position:absolute; bottom:0; left:0; right:0;
          height:26px; pointer-events:none; overflow:hidden; opacity:.45;
        }

        /* ── inner layout ── */
        .nb-inner{
          position:relative; z-index:2;
          max-width:1280px; margin:0 auto;
          padding:0 1.5rem; height:64px;
          display:flex; align-items:center; justify-content:space-between; gap:1.5rem;
        }

        /* ── logo ── */
        .nb-logo{
          display:flex; align-items:center; gap:.55rem;
          text-decoration:none; flex-shrink:0;
        }
        .nb-logo img{
          height:38px; width:auto; border-radius:9px; object-fit:contain;
          box-shadow:0 0 16px rgba(99,102,241,.38);
        }
        .nb-logo-pill{
          display:inline-flex; align-items:center; gap:3px;
          padding:2px 8px; border-radius:20px;
          background:rgba(99,102,241,.14);
          border:1px solid rgba(99,102,241,.28);
          font-family:'Syne',sans-serif;
          font-size:.62rem; font-weight:700; letter-spacing:.08em;
          color:#a5b4fc; text-transform:uppercase;
        }

        /* ── desktop nav links ── */
        .nb-links{
          display:flex; align-items:center; gap:2px;
          list-style:none; margin:0; padding:0;
          flex:1; justify-content:center;
        }
        .nb-lw{ display:inline-flex; }
        .nb-link{
          display:inline-flex; align-items:center;
          padding:.38rem .9rem; border-radius:9px;
          font-size:.88rem; font-weight:500;
          color:rgba(255,255,255,.48);
          text-decoration:none; position:relative;
          transition:color .2s,background .2s;
        }
        .nb-link:hover{ color:#fff; background:rgba(255,255,255,.07); }
        .nb-link::after{
          content:''; position:absolute;
          bottom:3px; left:50%; transform:translateX(-50%) scaleX(0);
          width:14px; height:2px; border-radius:2px; background:#6366f1;
          transition:transform .2s ease;
        }
        .nb-link:hover::after{ transform:translateX(-50%) scaleX(1); }
        .nb-chip{
          background:rgba(99,102,241,.14)!important;
          border:1px solid rgba(99,102,241,.28)!important;
          color:#c7d2fe!important;
        }
        .nb-chip:hover{ background:rgba(99,102,241,.24)!important; }

        /* ── right cluster ── */
        .nb-right{ display:flex; align-items:center; gap:.65rem; flex-shrink:0; }

        /* cart */
        .nb-cart{
          position:relative; display:flex; align-items:center; justify-content:center;
          width:40px; height:40px; border-radius:11px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.09);
          color:rgba(255,255,255,.7); text-decoration:none;
          transition:background .2s,color .2s,transform .2s;
        }
        .nb-cart:hover{ background:rgba(255,255,255,.13); color:#fff; transform:scale(1.07); }
        .nb-badge{
          position:absolute; top:-7px; right:-8px;
          min-width:19px; height:19px; padding:0 4px; border-radius:20px;
          background:linear-gradient(135deg,#6366f1,#22d3ee);
          color:#fff; font-size:.62rem; font-weight:700;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 2px 10px rgba(99,102,241,.65);
          border:2px solid #030310;
        }

        /* buttons */
        .nb-btn-in{
          padding:.45rem 1.25rem; border-radius:10px;
          background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);
          color:#fff; font-family:'DM Sans',sans-serif;
          font-size:.87rem; font-weight:600; border:none; cursor:pointer;
          box-shadow:0 2px 18px rgba(99,102,241,.44);
          transition:box-shadow .2s,opacity .2s;
        }
        .nb-btn-in:hover{ box-shadow:0 4px 28px rgba(99,102,241,.65); opacity:.9; }

        .nb-btn-out{
          padding:.45rem 1.25rem; border-radius:10px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.62);
          font-family:'DM Sans',sans-serif;
          font-size:.87rem; font-weight:500; cursor:pointer;
          transition:background .2s,color .2s,border-color .2s;
        }
        .nb-btn-out:hover{
          background:rgba(239,68,68,.14);
          border-color:rgba(239,68,68,.32);
          color:#fca5a5;
        }

        /* hamburger */
        .nb-ham{
          display:none; flex-direction:column; gap:5px;
          cursor:pointer; padding:7px; border-radius:9px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.09);
          transition:background .2s;
        }
        .nb-ham:hover{ background:rgba(255,255,255,.12); }
        .nb-ham span{
          display:block; width:20px; height:2px;
          border-radius:2px; background:rgba(255,255,255,.76);
        }

        /* mobile menu */
        .nb-mobile{
          position:absolute; top:100%; left:0; right:0;
          background:rgba(3,3,16,.97);
          border-bottom:1px solid rgba(255,255,255,.07);
          backdrop-filter:blur(24px);
          padding:1rem 1.5rem 1.4rem;
          display:flex; flex-direction:column; gap:2px;
          transform-origin:top; visibility:hidden;
        }
        .nb-ml{
          padding:.65rem .9rem; border-radius:10px;
          color:rgba(255,255,255,.52); font-size:.93rem; font-weight:500;
          text-decoration:none; transition:background .2s,color .2s;
        }
        .nb-ml:hover{ background:rgba(255,255,255,.07); color:#fff; }
        .nb-mdiv{ height:1px; background:rgba(255,255,255,.07); margin:.5rem 0; }
        .nb-mact{ display:flex; gap:.75rem; flex-wrap:wrap; margin-top:.15rem; }

        /* responsive */
        @media(max-width:768px){
          .nb-links,.nb-right{ display:none; }
          .nb-ham{ display:flex; }
        }

        .nb-spacer{ height:64px; }
      `}</style>

      <div className="nb-root">
        <header ref={headerRef} className={`nb-header${scrolled ? ' nb-scrolled' : ''}`}>

          {/* ── Three.js wave ── */}
          <div className="nb-wave">
            <Canvas camera={{ position: [0, 0, 2], fov: 52 }}
              style={{ width: '100%', height: '100%' }}>
              <ParticleWave />
            </Canvas>
          </div>

          <div className="nb-inner">

            {/* LOGO */}
            <Link to="/" className="nb-logo" ref={logoRef}>
              
              <span className="nb-logo-pill"><Zap size={10} />Store</span>
            </Link>

            {/* DESKTOP LINKS */}
            <ul className="nb-links">
              {navLinks.map((link, i) => (
                <li key={link.to} className="nb-lw"
                    ref={el => linksRef.current[i] = el}
                    onMouseEnter={lift} onMouseLeave={drop}>
                  <Link to={link.to} className={`nb-link${link.chip ? ' nb-chip' : ''}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* RIGHT */}
            <div className="nb-right">
              <Link to="/cart" className="nb-cart" ref={cartRef}>
                <ShoppingCart size={18} />
                <span className="nb-badge">
                  {users ? cart?.items?.length || 0 : 0}
                </span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild><span /></DropdownMenuTrigger>
              </DropdownMenu>

              <div ref={btnRef}>
                {users
                  ? <button className="nb-btn-out" onClick={logoutHandler}
                      onMouseEnter={grow} onMouseLeave={shrink}>Logout</button>
                  : <button className="nb-btn-in"  onClick={() => navigate('/login')}
                      onMouseEnter={grow} onMouseLeave={shrink}>Login</button>
                }
              </div>
            </div>

            {/* HAMBURGER */}
            <div className="nb-ham" ref={hamRef} onClick={() => setMenuOpen(v => !v)}>
              <span /><span /><span />
            </div>
          </div>

          {/* MOBILE MENU */}
          <div ref={mobileRef} className="nb-mobile">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="nb-ml"
                onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
            <div className="nb-mdiv" />
            <div className="nb-mact">
              <Link to="/cart"
                className="nb-cart"
                style={{ width:'auto', padding:'0 1rem', gap:'.5rem', height:38, borderRadius:10 }}
                onClick={() => setMenuOpen(false)}>
                <ShoppingCart size={15} />
                <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,.65)' }}>
                  Cart ({users ? cart?.items?.length || 0 : 0})
                </span>
              </Link>
              {users
                ? <button className="nb-btn-out"
                    onClick={() => { logoutHandler(); setMenuOpen(false) }}>Logout</button>
                : <button className="nb-btn-in"
                    onClick={() => { navigate('/login'); setMenuOpen(false) }}>Login</button>
              }
            </div>
          </div>
        </header>

        <div className="nb-spacer" />
      </div>
    </>
  )
}

export default Navbar