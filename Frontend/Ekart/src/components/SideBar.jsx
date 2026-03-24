import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React, { useRef, useEffect } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'

const navItems = [
  { to: '/dashboard/sales',       icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/dashboard/add-product', icon: PackagePlus,     label: 'Add Product' },
  { to: '/dashboard/products',    icon: PackageSearch,   label: 'Products'    },
  { to: '/dashboard/users',       icon: Users,           label: 'Users'       },
  { to: '/dashboard/orders',      icon: FaRegEdit,       label: 'Orders'      },
]

const SideBar = () => {
  const sideRef   = useRef(null)
  const logoRef   = useRef(null)
  const linkRefs  = useRef([])
  const divRef    = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(sideRef.current,
        { x: -80, opacity: 0 },
        { x: 0,   opacity: 1, duration: 0.65 }
      )
      .fromTo(logoRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.35'
      )
      .fromTo(divRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.55, ease: 'power2.out' }, '-=0.2'
      )
      .fromTo(linkRefs.current.filter(Boolean),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.42, stagger: 0.08 }, '-=0.25'
      )
    }, sideRef)
    return () => ctx.revert()
  }, [])

  /* ── hover helpers ── */
  const linkIn  = e => gsap.to(e.currentTarget, { x: 4,  duration: 0.18, ease: 'power2.out' })
  const linkOut = e => gsap.to(e.currentTarget, { x: 0,  duration: 0.18, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sb-bg:        #06061a;
          --sb-surface:   rgba(255,255,255,0.045);
          --sb-border:    rgba(255,255,255,0.08);
          --sb-accent:    #6366f1;
          --sb-cyan:      #22d3ee;
          --sb-muted:     rgba(255,255,255,0.35);
          --sb-text:      rgba(255,255,255,0.75);
          --sb-text-act:  #fff;
          --sb-width:     260px;
        }

        /* ── sidebar shell ── */
        .sb-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: var(--sb-width);
          background: var(--sb-bg);
          border-right: 1px solid var(--sb-border);
          display: none;
          flex-direction: column;
          z-index: 50;
          box-shadow: 4px 0 40px rgba(0,0,0,0.55);
          overflow: hidden;
        }
        @media(min-width:768px){ .sb-root { display: flex; } }

        /* shimmer right-edge line */
        .sb-root::after {
          content: '';
          position: absolute; top: 0; right: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg,
            transparent, #6366f1 30%, #22d3ee 60%, transparent);
          background-size: 100% 220%;
          animation: sb-line 5s linear infinite;
          opacity: .45;
        }
        @keyframes sb-line {
          0%   { background-position: 0  220% }
          100% { background-position: 0 -220% }
        }

        /* mesh bg */
        .sb-root::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%,   rgba(99,102,241,.12), transparent 60%),
            radial-gradient(ellipse 60% 35% at 50% 100%, rgba(34,211,238,.07), transparent 55%);
        }

        /* ── logo area ── */
        .sb-logo {
          padding: 1.75rem 1.5rem 1rem;
          position: relative; z-index: 2;
        }
        .sb-logo-pill {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .35rem .9rem; border-radius: 20px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.25);
          font-family: 'Syne', sans-serif;
          font-size: .72rem; font-weight: 800; letter-spacing: .1em;
          text-transform: uppercase; color: #a5b4fc;
        }
        .sb-logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px #22d3ee;
          animation: sb-pulse 1.8s ease-in-out infinite;
        }
        @keyframes sb-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: .6; }
        }
        .sb-logo-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem; font-weight: 800; color: #fff;
          margin-top: .65rem; letter-spacing: -.01em;
        }
        .sb-logo-sub {
          font-size: .74rem; color: var(--sb-muted); margin-top: .15rem;
        }

        /* ── divider ── */
        .sb-divider {
          height: 1px; margin: .25rem 1.25rem .75rem;
          background: linear-gradient(90deg, var(--sb-accent), rgba(34,211,238,.4), transparent);
          opacity: .22;
          position: relative; z-index: 2;
        }

        /* ── section label ── */
        .sb-section-label {
          font-family: 'Syne', sans-serif;
          font-size: .62rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--sb-muted);
          padding: 0 1.25rem .5rem;
          position: relative; z-index: 2;
        }

        /* ── nav list ── */
        .sb-nav {
          display: flex; flex-direction: column;
          gap: .25rem; padding: 0 .85rem;
          flex: 1; position: relative; z-index: 2;
          overflow-y: auto;
        }
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.08); border-radius: 3px;
        }

        /* ── nav link ── */
        .sb-link {
          display: flex; align-items: center; gap: .75rem;
          padding: .65rem .9rem; border-radius: 12px;
          font-size: .9rem; font-weight: 500;
          color: var(--sb-text);
          text-decoration: none; position: relative;
          transition: color .2s, background .2s;
          border: 1px solid transparent;
        }
        .sb-link:hover {
          color: var(--sb-text-act);
          background: rgba(255,255,255,.05);
          border-color: var(--sb-border);
        }

        /* active state */
        .sb-link.active {
          color: #fff;
          background: rgba(99,102,241,.18);
          border-color: rgba(99,102,241,.3);
          box-shadow: 0 2px 16px rgba(99,102,241,.2),
                      0 0 0 1px rgba(99,102,241,.1) inset;
        }
        .sb-link.active .sb-icon-wrap {
          background: var(--sb-accent);
          box-shadow: 0 0 14px rgba(99,102,241,.6);
          color: #fff;
        }
        .sb-link.active .sb-link-dot { opacity: 1; }

        /* left active bar */
        .sb-link::before {
          content: '';
          position: absolute; left: -13px; top: 50%; transform: translateY(-50%);
          width: 3px; height: 0; border-radius: 3px;
          background: var(--sb-accent);
          transition: height .25s ease;
        }
        .sb-link.active::before { height: 60%; }

        /* icon pill */
        .sb-icon-wrap {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--sb-border);
          color: var(--sb-muted);
          transition: background .2s, color .2s, box-shadow .2s;
          font-size: .9rem;
        }
        .sb-link:hover .sb-icon-wrap {
          background: rgba(99,102,241,.14);
          border-color: rgba(99,102,241,.25);
          color: #a5b4fc;
        }

        .sb-link-label { flex: 1; }

        /* active dot (right side) */
        .sb-link-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--sb-accent);
          box-shadow: 0 0 8px var(--sb-accent);
          opacity: 0; transition: opacity .2s;
          flex-shrink: 0;
        }

        /* ── bottom area ── */
        .sb-bottom {
          padding: 1rem 1.25rem 1.5rem;
          position: relative; z-index: 2;
          border-top: 1px solid var(--sb-border);
          font-size: .72rem; color: var(--sb-muted);
          text-align: center;
          letter-spacing: .04em;
        }
        .sb-bottom span { color: #a5b4fc; font-weight: 600; }
      `}</style>

      <div className="sb-root" ref={sideRef}>

        {/* Logo */}
        <div className="sb-logo" ref={logoRef}>
          <div className="sb-logo-pill">
            <span className="sb-logo-dot" />
            Admin Panel
          </div>
          <p className="sb-logo-title">Control Center</p>
          <p className="sb-logo-sub">Manage your store</p>
        </div>

        {/* Divider */}
        <div className="sb-divider" ref={divRef} />

        {/* Section label */}
        <p className="sb-section-label">Navigation</p>

        {/* Nav links */}
        <nav className="sb-nav">
          {navItems.map(({ to, icon: Icon, label }, i) => (
            <NavLink
              key={to}
              to={to}
              ref={el => linkRefs.current[i] = el}
              className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
              onMouseEnter={linkIn}
              onMouseLeave={linkOut}
            >
              <span className="sb-icon-wrap">
                <Icon size={15} />
              </span>
              <span className="sb-link-label">{label}</span>
              <span className="sb-link-dot" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sb-bottom">
          <span>Ekart</span> Dashboard v1.0
        </div>

      </div>
    </>
  )
}

export default SideBar