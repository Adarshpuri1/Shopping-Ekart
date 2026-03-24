import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react'

/* ─────────────────────────────────────
   THREE.JS — floating particle field
───────────────────────────────────── */
const Particles = () => {
  const ref = useRef()
  const COUNT = 160

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  const speeds = useMemo(() => Array.from({ length: COUNT }, () => Math.random() * 0.5 + 0.2), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const ox = positions[i * 3]
      const oy = positions[i * 3 + 1]
      pos.setY(i, oy + Math.sin(t * speeds[i] + ox * 0.25) * 0.1)
      pos.setX(i, ox + Math.cos(t * speeds[i] * 0.4 + oy * 0.18) * 0.05)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#6366f1" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ─────────────────────────────────────
   STAT CARD CONFIG
───────────────────────────────────── */
const CARDS = [
  { key: 'totalUsers',    label: 'Total Users',    icon: Users,       prefix: '',  accent: '#6366f1', glow: 'rgba(99,102,241,0.3)'  },
  { key: 'totalProducts', label: 'Total Products', icon: Package,     prefix: '',  accent: '#22d3ee', glow: 'rgba(34,211,238,0.3)'  },
  { key: 'totalOrders',   label: 'Total Orders',   icon: ShoppingBag, prefix: '',  accent: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
  { key: 'totalSales',    label: 'Total Sales',    icon: TrendingUp,  prefix: '₹', accent: '#34d399', glow: 'rgba(52,211,153,0.3)'  },
]

/* ─────────────────────────────────────
   ADMIN SALE
───────────────────────────────────── */
const AdminSale = () => {
  const accessToken = useSelector(store => store.user.token)

  const [stats, setStats] = useState({
    totalUsers: 0, totalProducts: 0,
    totalOrders: 0, totalSales: 0, salesByDate: []
  })

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://shopping-ekart-backend.onrender.comapi/v1/orders/sales', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) setStats(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => { fetchStats() }, [])

  /* ── refs ── */
  const pageRef  = useRef(null)
  const gridRef  = useRef(null)
  const cardRefs = useRef([])
  const numRefs  = useRef([])

  /* ── entrance + count-up ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* grid slides up */
      gsap.fromTo(gridRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      )

      /* cards stagger pop */
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { opacity: 0, y: 28, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.6)', delay: 0.25 }
      )

      /* count-up for each number */
      CARDS.forEach(({ key }, i) => {
        const el = numRefs.current[i]
        if (!el) return
        const target = key === 'totalSales' ? stats[key] : stats[key]
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target, duration: 1.6, delay: 0.5 + i * 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            const prefix = CARDS[i].prefix
            el.textContent = prefix + Math.round(obj.val).toLocaleString('en-IN')
          }
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [stats.totalUsers, stats.totalProducts, stats.totalOrders, stats.totalSales])

  /* ── card hover ── */
  const cardIn  = (e, accent) => {
    gsap.to(e.currentTarget, { y: -6, scale: 1.03, duration: 0.22, ease: 'power2.out' })
  }
  const cardOut = e => {
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.22, ease: 'power2.in' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --as-bg:      #05050f;
          --as-surface: rgba(255,255,255,0.04);
          --as-border:  rgba(255,255,255,0.07);
          --as-muted:   rgba(255,255,255,0.35);
          --as-text:    rgba(255,255,255,0.82);
        }

        /* ── page ── */
        .as-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--as-bg);
          position: relative;
          overflow: hidden;
        }
        @media(max-width:768px){
          .as-page { padding-left:1rem; padding-top:4rem; padding-right:1rem; }
        }

        /* three.js bg canvas */
        .as-canvas {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: 0.85;
        }

        /* mesh overlays */
        .as-mesh {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 15% 20%,  rgba(99,102,241,.12), transparent 60%),
            radial-gradient(ellipse 55% 45% at 85% 80%,  rgba(34,211,238,.08), transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%,  rgba(124,58,237,.07), transparent 55%);
        }

        /* ── inner ── */
        .as-inner {
          position: relative; z-index: 5;
          padding: 1.5rem;
        }

        /* ── page title ── */
        .as-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 800; color: #fff;
          letter-spacing: -.01em;
          margin-bottom: 1.75rem;
          display: flex; align-items: center; gap: .65rem;
        }
        .as-title-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 14px #6366f1;
          animation: as-pulse 1.8s ease-in-out infinite;
        }
        @keyframes as-pulse {
          0%,100% { transform: scale(1); opacity:1; }
          50%      { transform: scale(1.6); opacity:.6; }
        }

        /* ── grid ── */
        .as-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 1.25rem;
        }
        @media(max-width:1024px){ .as-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:480px)  { .as-grid { grid-template-columns: 1fr; } }

        /* ── stat card ── */
        .as-card {
          background: rgba(9,9,28,0.85);
          border: 1px solid var(--as-border);
          border-radius: 20px;
          padding: 1.5rem 1.4rem 1.6rem;
          position: relative; overflow: hidden;
          box-shadow: 0 6px 32px rgba(0,0,0,.5);
          transition: border-color .25s, box-shadow .25s;
          cursor: default;
        }
        .as-card:hover {
          box-shadow: 0 12px 48px rgba(0,0,0,.6);
        }

        /* shimmer top line — color per card via inline var */
        .as-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg, transparent, var(--card-accent,#6366f1) 50%, transparent);
          background-size: 200% 100%;
          animation: as-line 3s linear infinite;
        }
        @keyframes as-line {
          0%   { background-position:  200% 0 }
          100% { background-position: -200% 0 }
        }

        /* bottom glow */
        .as-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 60%; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 120%, var(--card-glow, rgba(99,102,241,.15)), transparent 70%);
          pointer-events: none;
        }
        .as-card > * { position: relative; z-index: 1; }

        /* icon wrap */
        .as-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
          border: 1px solid;
          transition: box-shadow .3s;
        }
        .as-card:hover .as-icon-wrap {
          box-shadow: 0 0 18px var(--card-glow, rgba(99,102,241,.4));
        }

        /* label */
        .as-label {
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--as-muted);
          margin-bottom: .4rem;
        }

        /* number */
        .as-number {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          font-weight: 800; color: #fff;
          line-height: 1; letter-spacing: -.02em;
        }

        /* trend badge */
        .as-trend {
          display: inline-flex; align-items: center; gap: .25rem;
          margin-top: .6rem; padding: .18rem .55rem; border-radius: 20px;
          font-size: .68rem; font-weight: 600;
          background: rgba(52,211,153,.12);
          border: 1px solid rgba(52,211,153,.25);
          color: #6ee7b7;
        }
      `}</style>

      <div className="as-page" ref={pageRef}>

        {/* Three.js bg */}
        <div className="as-canvas">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.3} />
            <Particles />
          </Canvas>
        </div>

        {/* mesh */}
        <div className="as-mesh" />

        <div className="as-inner">

          {/* Title */}
          <h1 className="as-title">
            <span className="as-title-dot" />
            Sales Dashboard
          </h1>

          {/* Stat grid */}
          <div className="as-grid" ref={gridRef}>
            {CARDS.map(({ key, label, icon: Icon, prefix, accent, glow }, i) => (
              <div
                key={key}
                className="as-card"
                ref={el => cardRefs.current[i] = el}
                style={{ '--card-accent': accent, '--card-glow': glow }}
                onMouseEnter={e => cardIn(e, accent)}
                onMouseLeave={cardOut}
              >
                {/* Icon */}
                <div
                  className="as-icon-wrap"
                  style={{
                    background: `${glow.replace('0.3', '0.12')}`,
                    borderColor: `${glow.replace('0.3', '0.28')}`,
                    color: accent,
                  }}
                >
                  <Icon size={18} />
                </div>

                {/* Label */}
                <p className="as-label">{label}</p>

                {/* Number (count-up target) */}
                <p className="as-number" ref={el => numRefs.current[i] = el}>
                  {prefix}0
                </p>

                {/* Trend badge */}
                <span className="as-trend">↑ Live data</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminSale