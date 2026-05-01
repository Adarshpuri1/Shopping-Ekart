import axios from 'axios'
import { Edit, Eye, Search, Users } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import userlogo from '../../assets/userlogo.png'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AdminUser = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [users, setUsers]           = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigation = useNavigate()

  /* ── fetch ── */
  const getAllUser = async () => {
    try {
      const res = await axios(`https://shopping-ekart.vercel.app/api/v1/user/all-user`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      // BUG FIX: always fall back to [] so .filter() never runs on undefined
      const list = res.data?.Users || res.data?.users || res.data?.data || []
      setUsers(Array.isArray(list) ? list : [])
    } catch (error) {
      console.warn(error)
    }
  }

  // BUG FIX: guard with (users || []) so filter never explodes
  const filteredUsers = (users || []).filter(user =>
    `${user?.firstName || ''} ${user?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => { getAllUser() }, [])

  /* ── refs ── */
  const pageRef   = useRef(null)
  const headerRef = useRef(null)
  const searchRef = useRef(null)
  const cardRefs  = useRef([])

  /* ── entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(headerRef.current,
          { opacity: 0, y: -24 },
          { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(searchRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.45 }, '-=0.3')
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── card entrance whenever list changes ── */
  useEffect(() => {
    cardRefs.current.filter(Boolean).forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 32, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: 'back.out(1.6)',
          delay: i * 0.07,
          scrollTrigger: { trigger: card, start: 'top 95%' },
        }
      )
    })
  }, [filteredUsers.length])

  /* ── hover helpers ── */
  const onCardEnter = e => gsap.to(e.currentTarget, { y: -7, scale: 1.025, duration: 0.22, ease: 'power2.out' })
  const onCardLeave = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.22, ease: 'power2.in'  })
  const onAvEnter   = e => gsap.to(e.currentTarget, { scale: 1.12, rotation: 4,  duration: 0.2, ease: 'back.out(2)' })
  const onAvLeave   = e => gsap.to(e.currentTarget, { scale: 1,    rotation: 0,  duration: 0.2, ease: 'power2.in'  })
  const onBtnEnter  = e => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.15, ease: 'power2.out' })
  const onBtnLeave  = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.15, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --bg:       #060612;
          --card:     rgba(10,10,30,0.93);
          --border:   rgba(255,255,255,0.07);
          --accent:   #6366f1;
          --cyan:     #22d3ee;
          --muted:    rgba(255,255,255,0.38);
          --text:     rgba(255,255,255,0.85);
        }

        /* ── page ── */
        .au-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          padding: 5rem 2rem 4rem 310px;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 70% 50% at 80% 0%,   rgba(99,102,241,.10), transparent 60%),
            radial-gradient(ellipse 55% 40% at 5%  100%, rgba(34,211,238,.07), transparent 55%);
          /* subtle 3-D depth layer */
          perspective: 900px;
        }
        @media(max-width:768px){ .au-page{ padding: 4rem 1rem 3rem; } }

        /* ── header ── */
        .au-head-icon {
          width:44px; height:44px; border-radius:12px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(99,102,241,.14); border:1px solid rgba(99,102,241,.28);
          color:#a5b4fc;
        }
        .au-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(1.5rem,3vw,2.1rem); font-weight:800;
          color:#fff; letter-spacing:-.02em;
        }
        .au-sub { font-size:.83rem; color:var(--muted); margin-left:52px; }

        /* ── search ── */
        .au-search {
          position:relative; width:300px; margin-top:1.4rem;
        }
        @media(max-width:480px){ .au-search{ width:100%; } }
        .au-search-icon {
          position:absolute; left:.75rem; top:50%;
          transform:translateY(-50%);
          color:var(--muted); width:15px; pointer-events:none;
        }
        .au-search-input {
          width:100%; box-sizing:border-box;
          padding:.62rem 1rem .62rem 2.3rem;
          background:rgba(255,255,255,.05);
          border:1px solid var(--border); border-radius:12px;
          color:var(--text); font-size:.88rem; font-family:'DM Sans',sans-serif;
          outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .au-search-input::placeholder{ color:var(--muted); }
        .au-search-input:focus{
          border-color:rgba(99,102,241,.5);
          box-shadow:0 0 0 3px rgba(99,102,241,.14);
        }

        /* ── count chip ── */
        .au-chip {
          display:inline-flex; align-items:center; gap:.3rem;
          padding:.2rem .7rem; border-radius:99px; margin-top:1.2rem;
          background:rgba(99,102,241,.12); border:1px solid rgba(99,102,241,.24);
          font-family:'Syne',sans-serif; font-size:.68rem; font-weight:700;
          color:#a5b4fc; letter-spacing:.06em;
        }

        /* ── grid ── */
        .au-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1.3rem; margin-top:1.8rem;
        }
        @media(max-width:1100px){ .au-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:580px) { .au-grid{ grid-template-columns:1fr; } }

        /* ── card ── */
        .au-card {
          background:var(--card);
          border:1px solid var(--border); border-radius:20px;
          padding:1.35rem; position:relative; overflow:hidden;
          box-shadow:0 8px 36px rgba(0,0,0,.5);
          transition:border-color .25s, box-shadow .25s;
          transform-style:preserve-3d;    /* 3-D child layers */
        }
        .au-card:hover{
          border-color:rgba(99,102,241,.32);
          box-shadow:0 16px 52px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.12);
        }

        /* shimmer bar */
        .au-card::before{
          content:''; position:absolute; top:0; left:0; right:0; height:2px; z-index:6;
          background:linear-gradient(90deg, transparent, #6366f1 28%, #22d3ee 55%, transparent);
          background-size:220% 100%;
          animation:shimmer 4s linear infinite;
          opacity:0; transition:opacity .28s;
        }
        .au-card:hover::before{ opacity:1; }
        @keyframes shimmer{
          0%  { background-position: 220% 0 }
          100%{ background-position:-220% 0 }
        }

        /* inner glow */
        .au-card::after{
          content:''; position:absolute; bottom:0; left:0; right:0; height:60%; z-index:0;
          background:radial-gradient(ellipse 80% 50% at 50% 110%,
            rgba(99,102,241,.09), transparent 70%);
          pointer-events:none;
        }
        .au-card > * { position:relative; z-index:1; }

        /* floating 3-D orb (Three.js-style via CSS) */
        .au-orb {
          position:absolute; top:-28px; right:-28px;
          width:100px; height:100px; border-radius:50%;
          background:radial-gradient(circle at 35% 35%,
            rgba(99,102,241,.22), rgba(34,211,238,.08) 55%, transparent 75%);
          filter:blur(14px);
          pointer-events:none; z-index:0;
          animation:orb-float 6s ease-in-out infinite;
        }
        @keyframes orb-float{
          0%,100%{ transform:translateY(0) scale(1);   }
          50%    { transform:translateY(8px) scale(1.08); }
        }

        /* ── avatar ── */
        .au-avatar-wrap { position:relative; flex-shrink:0; }
        .au-avatar {
          width:56px; height:56px; border-radius:50%; object-fit:cover;
          border:2px solid rgba(99,102,241,.4);
          box-shadow:0 0 18px rgba(99,102,241,.28);
          display:block;
        }
        .au-dot {
          position:absolute; bottom:1px; right:1px;
          width:12px; height:12px; border-radius:50%;
          background:#22c55e; box-shadow:0 0 8px #22c55e;
          border:2px solid #0a0a1e;
        }

        /* ── user text ── */
        .au-name {
          font-family:'Syne',sans-serif; font-size:.95rem;
          font-weight:700; color:#fff; margin-bottom:.14rem;
        }
        .au-email {
          font-size:.74rem; color:var(--muted);
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
          max-width:175px;
        }

        /* ── divider ── */
        .au-divider {
          height:1px; margin:.9rem 0;
          background:linear-gradient(90deg, var(--accent), transparent);
          opacity:.14;
        }

        /* ── action buttons ── */
        .au-btn-edit {
          flex:1; display:inline-flex; align-items:center;
          justify-content:center; gap:.4rem;
          padding:.5rem .7rem; border-radius:11px; cursor:pointer;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.72);
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500;
          transition:background .2s, border-color .2s, color .2s;
        }
        .au-btn-edit:hover{
          background:rgba(99,102,241,.16);
          border-color:rgba(99,102,241,.38); color:#c7d2fe;
        }
        .au-btn-orders {
          flex:1; display:inline-flex; align-items:center;
          justify-content:center; gap:.4rem;
          padding:.5rem .7rem; border-radius:11px; cursor:pointer;
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          border:none; color:#fff;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600;
          box-shadow:0 2px 16px rgba(99,102,241,.4);
          transition:box-shadow .2s, opacity .2s;
        }
        .au-btn-orders:hover{ box-shadow:0 4px 26px rgba(99,102,241,.62); opacity:.9; }

        /* ── empty state ── */
        .au-empty {
          grid-column:1/-1; text-align:center;
          padding:3rem; color:var(--muted); font-size:.9rem;
        }
      `}</style>

      <div className="au-page" ref={pageRef}>

        {/* Header */}
        <div ref={headerRef}>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem', marginBottom:'.3rem' }}>
            <div className="au-head-icon"><Users size={19}/></div>
            <h1 className="au-title">User Management</h1>
          </div>
          <p className="au-sub">View and manage all registered users</p>
        </div>

        {/* Search */}
        <div className="au-search" ref={searchRef}>
          <Search className="au-search-icon"/>
          <input
            className="au-search-input"
            placeholder="Search users…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Count chip */}
        {filteredUsers.length > 0 && (
          <div>
            <span className="au-chip">
              ✦ {filteredUsers.length} USER{filteredUsers.length !== 1 ? 'S' : ''}
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="au-grid">
          {filteredUsers.length === 0 ? (
            <div className="au-empty">No users found.</div>
          ) : (
            filteredUsers.map((user, i) => (
              <div
                key={user._id || i}
                className="au-card"
                ref={el => cardRefs.current[i] = el}
                onMouseEnter={onCardEnter}
                onMouseLeave={onCardLeave}
              >
                {/* CSS 3-D ambient orb */}
                <div className="au-orb" style={{ animationDelay: `${i * 0.4}s` }}/>

                {/* User info */}
                <div style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
                  <div
                    className="au-avatar-wrap"
                    onMouseEnter={onAvEnter}
                    onMouseLeave={onAvLeave}
                  >
                    <img
                      src={user?.profilepic || userlogo}
                      alt=""
                      className="au-avatar"
                    />
                    <span className="au-dot"/>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p className="au-name">{user?.firstName} {user?.lastName}</p>
                    <p className="au-email">{user?.email}</p>
                  </div>
                </div>

                <div className="au-divider"/>

                {/* Actions */}
                <div style={{ display:'flex', gap:'.6rem' }}>
                  <button
                    className="au-btn-edit"
                    onClick={() => navigation(`/dashboard/users/${user?._id}`)}
                    onMouseEnter={onBtnEnter}
                    onMouseLeave={onBtnLeave}
                  >
                    <Edit size={13}/> Edit
                  </button>
                  <button
                    className="au-btn-orders"
                    onClick={() => navigation(`/dashboard/users/orders/${user?._id}`)}
                    onMouseEnter={onBtnEnter}
                    onMouseLeave={onBtnLeave}
                  >
                    <Eye size={13}/> Show Orders
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}

export default AdminUser
