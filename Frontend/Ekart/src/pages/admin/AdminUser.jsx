import { Input } from '@/components/ui/input'
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

  const getAllUser = async () => {
    try {
      const res = await axios(`https://shopping-ekart.vercel.app/v1/user/all-user`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) setUsers(res.data.Users)
    } catch (error) {
      console.warn(error)
    }
  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => { getAllUser() }, [])

  /* ── refs ── */
  const pageRef    = useRef(null)
  const headerRef  = useRef(null)
  const searchRef  = useRef(null)
  const gridRef    = useRef(null)
  const cardRefs   = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.55 }
      )
      .fromTo(searchRef.current,
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.45 }, '-=0.3'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── animate cards when filteredUsers changes ── */
  useEffect(() => {
    if (!cardRefs.current.length) return
    cardRefs.current.filter(Boolean).forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 28, scale: 0.93 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: card, start: 'top 94%' },
          delay: i * 0.07,
        }
      )
    })
  }, [filteredUsers.length])

  /* ── card hover ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -6, scale: 1.025, duration: 0.2, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.2, ease: 'power2.in'  })

  /* ── avatar hover ── */
  const avIn  = e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.22, ease: 'back.out(2)' })
  const avOut = e => gsap.to(e.currentTarget, { scale: 1,   duration: 0.2,  ease: 'power2.in'  })

  /* ── btn hover ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.16, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.16, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --au-bg:      #05050f;
          --au-card:    rgba(9,9,28,0.92);
          --au-surface: rgba(255,255,255,0.04);
          --au-border:  rgba(255,255,255,0.07);
          --au-accent:  #6366f1;
          --au-cyan:    #22d3ee;
          --au-muted:   rgba(255,255,255,0.35);
          --au-text:    rgba(255,255,255,0.82);
          --au-sub:     rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .au-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--au-bg);
          background-image:
            radial-gradient(ellipse 65% 45% at 80% 0%,   rgba(99,102,241,.09), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 100%, rgba(34,211,238,.06), transparent 55%);
        }
        @media(max-width:768px){
          .au-page { padding-left:1rem; padding-top:4rem; padding-right:1rem; }
        }

        /* ── header ── */
        .au-header { margin-bottom: 1.75rem; }

        .au-title-row {
          display: flex; align-items: center; gap: .7rem; margin-bottom: .3rem;
        }
        .au-title-icon {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.26);
          color: #a5b4fc;
        }
        .au-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.4rem,3vw,2rem); font-weight: 800;
          color: #fff; letter-spacing: -.01em;
        }
        .au-subtitle {
          font-size: .82rem; color: var(--au-muted);
          margin-left: calc(40px + .7rem);
        }

        /* ── search ── */
        .au-search-wrap {
          position: relative; width: 320px; margin-top: 1.25rem;
        }
        @media(max-width:480px){ .au-search-wrap { width: 100%; } }
        .au-search-icon {
          position: absolute; left: .75rem; top: 50%;
          transform: translateY(-50%);
          color: var(--au-muted); width: 15px; pointer-events: none;
        }
        .au-search-input {
          width: 100%;
          padding: .6rem .9rem .6rem 2.2rem;
          background: rgba(255,255,255,.05);
          border: 1px solid var(--au-border);
          border-radius: 11px;
          color: var(--au-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .au-search-input::placeholder { color: var(--au-muted); }
        .au-search-input:focus {
          border-color: rgba(99,102,241,.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }

        /* ── grid ── */
        .au-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 1.25rem;
          margin-top: 1.75rem;
        }
        @media(max-width:1024px){ .au-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px)  { .au-grid { grid-template-columns: 1fr; } }

        /* ── user card ── */
        .au-card {
          background: var(--au-card);
          border: 1px solid var(--au-border);
          border-radius: 18px;
          padding: 1.25rem;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 32px rgba(0,0,0,.45);
          transition: border-color .22s, box-shadow .22s;
          cursor: default;
        }
        .au-card:hover {
          border-color: rgba(99,102,241,.3);
          box-shadow: 0 12px 44px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.1);
        }

        /* shimmer top */
        .au-card::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background: linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 58%, transparent);
          background-size: 220% 100%;
          animation: au-line 4s linear infinite;
          opacity: 0; transition: opacity .25s;
        }
        .au-card:hover::before { opacity: 1; }
        @keyframes au-line {
          0%  { background-position:  220% 0 }
          100%{ background-position: -220% 0 }
        }

        /* bottom glow */
        .au-card::after {
          content: '';
          position: absolute; bottom:0; left:0; right:0; height:55%; z-index:0;
          background: radial-gradient(ellipse 80% 55% at 50% 120%,
            rgba(99,102,241,.08), transparent 70%);
          pointer-events: none;
        }
        .au-card > * { position: relative; z-index: 1; }

        /* ── user info row ── */
        .au-info-row {
          display: flex; align-items: center; gap: .85rem; margin-bottom: 1rem;
        }

        /* avatar */
        .au-avatar-wrap {
          position: relative; flex-shrink: 0;
        }
        .au-avatar {
          width: 54px; height: 54px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 2px solid rgba(99,102,241,.35);
          box-shadow: 0 0 16px rgba(99,102,241,.25);
        }
        /* online dot */
        .au-avatar-dot {
          position: absolute; bottom: 1px; right: 1px;
          width: 11px; height: 11px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 7px #22c55e;
          border: 2px solid #09091c;
        }

        .au-user-name {
          font-family: 'Syne', sans-serif;
          font-size: .95rem; font-weight: 700; color: #fff;
          margin-bottom: .15rem;
        }
        .au-user-email {
          font-size: .75rem; color: var(--au-muted);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: 170px;
        }

        /* ── divider ── */
        .au-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--au-accent), transparent);
          opacity: .13; margin-bottom: .85rem;
        }

        /* ── action buttons ── */
        .au-actions { display: flex; gap: .6rem; }

        .au-btn-edit {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
          padding: .48rem .7rem; border-radius: 10px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.7);
          font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 500; cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .au-btn-edit:hover {
          background: rgba(99,102,241,.15);
          border-color: rgba(99,102,241,.35);
          color: #c7d2fe;
        }

        .au-btn-orders {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
          padding: .48rem .7rem; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 600; cursor: pointer;
          border: none;
          box-shadow: 0 2px 14px rgba(99,102,241,.38);
          transition: box-shadow .2s, opacity .2s;
        }
        .au-btn-orders:hover { box-shadow: 0 4px 22px rgba(99,102,241,.58); opacity: .9; }

        /* ── count chip ── */
        .au-count-chip {
          display: inline-flex; align-items: center; gap: .3rem;
          padding: .18rem .6rem; border-radius: 20px;
          background: rgba(99,102,241,.12);
          border: 1px solid rgba(99,102,241,.22);
          font-size: .68rem; font-weight: 600; color: #a5b4fc;
          margin-bottom: 1.25rem;
          font-family: 'Syne', sans-serif;
          letter-spacing: .05em;
        }
      `}</style>

      <div className="au-page" ref={pageRef}>

        {/* Header */}
        <div className="au-header" ref={headerRef}>
          <div className="au-title-row">
            <div className="au-title-icon"><Users size={18} /></div>
            <h1 className="au-title">User Management</h1>
          </div>
          <p className="au-subtitle">View and manage all registered users</p>
        </div>

        {/* Search */}
        <div className="au-search-wrap" ref={searchRef}>
          <Search className="au-search-icon" />
          <input
            type="text"
            className="au-search-input"
            placeholder="Search users…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Count chip */}
        {filteredUsers.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <span className="au-count-chip">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="au-grid" ref={gridRef}>
          {filteredUsers.map((user, i) => (
            <div
              key={user._id || i}
              className="au-card"
              ref={el => cardRefs.current[i] = el}
              onMouseEnter={cardIn}
              onMouseLeave={cardOut}
            >
              {/* User info */}
              <div className="au-info-row">
                <div className="au-avatar-wrap"
                  onMouseEnter={avIn} onMouseLeave={avOut}>
                  <img
                    src={user?.profilepic || userlogo}
                    alt=""
                    className="au-avatar"
                  />
                  <span className="au-avatar-dot" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="au-user-name">{user?.firstName} {user?.lastName}</p>
                  <p className="au-user-email">{user?.email}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="au-divider" />

              {/* Actions */}
              <div className="au-actions">
                <button
                  className="au-btn-edit"
                  onClick={() => navigation(`/dashboard/users/${user?._id}`)}
                  onMouseEnter={btnIn} onMouseLeave={btnOut}
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  className="au-btn-orders"
                  onClick={() => navigation(`/dashboard/users/orders/${user?._id}`)}
                  onMouseEnter={btnIn} onMouseLeave={btnOut}
                >
                  <Eye size={13} /> Show Orders
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default AdminUser