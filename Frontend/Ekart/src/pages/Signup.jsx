import axios from 'axios'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react'

/* ─────────────────────────────────────
   THREE.JS — floating particle bg
───────────────────────────────────── */
const Particles = () => {
  const ref   = useRef()
  const COUNT = 130

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [])

  const speeds = useMemo(() =>
    Array.from({ length: COUNT }, () => Math.random() * 0.5 + 0.2), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position
    const t   = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const ox = positions[i * 3]
      const oy = positions[i * 3 + 1]
      pos.setY(i, oy + Math.sin(t * speeds[i] + ox * 0.3) * 0.1)
      pos.setX(i, ox + Math.cos(t * speeds[i] * 0.4 + oy * 0.2) * 0.06)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#6366f1" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ─────────────────────────────────────
   SIGNUP
───────────────────────────────────── */
const Signup = () => {
  const [user, setUser] = useState({
    firstName: '', lastName: '', email: '', password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const SubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`https://shopping-ekart-backend.onrender.comapi/v1/user/register`, user, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── refs ── */
  const cardRef = useRef(null)
  const f1Ref   = useRef(null)
  const f2Ref   = useRef(null)
  const f3Ref   = useRef(null)
  const f4Ref   = useRef(null)
  const footRef = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: 'back.out(1.5)' }
      )
      .fromTo([f1Ref.current, f2Ref.current, f3Ref.current, f4Ref.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.09, duration: 0.42 }, '-=0.4'
      )
      .fromTo(footRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38 }, '-=0.2'
      )
    })
    return () => ctx.revert()
  }, [])

  /* ── helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sg-bg:      #05050f;
          --sg-card:    rgba(9,9,28,0.92);
          --sg-surface: rgba(255,255,255,0.045);
          --sg-border:  rgba(255,255,255,0.08);
          --sg-accent:  #6366f1;
          --sg-cyan:    #22d3ee;
          --sg-muted:   rgba(255,255,255,0.35);
          --sg-text:    rgba(255,255,255,0.82);
        }

        /* ── page ── */
        .sg-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--sg-bg);
          position: relative; overflow: hidden;
          padding: 2rem 1rem;
        }

        /* canvas */
        .sg-canvas {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: .85;
        }

        /* mesh */
        .sg-mesh {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 15% 25%,  rgba(99,102,241,.14), transparent 60%),
            radial-gradient(ellipse 55% 45% at 85% 75%,  rgba(34,211,238,.09), transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(124,58,237,.1),  transparent 55%);
        }

        /* ── card ── */
        .sg-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          background: var(--sg-card);
          border: 1px solid var(--sg-border);
          border-radius: 22px;
          padding: 2.2rem 2rem 2rem;
          box-shadow:
            0 0 0 1px rgba(99,102,241,.07),
            0 24px 72px rgba(0,0,0,.65);
          overflow: hidden;
        }

        /* shimmer top */
        .sg-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 28%, #22d3ee 52%, #a78bfa 75%, transparent);
          background-size: 240% 100%;
          animation: sg-line 4.5s linear infinite;
        }
        @keyframes sg-line {
          0%  { background-position:  240% 0 }
          100%{ background-position: -240% 0 }
        }

        /* corner glow */
        .sg-card::after {
          content: ''; position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 60% 45% at 0% 0%, rgba(99,102,241,.09), transparent 55%);
        }
        .sg-card > * { position: relative; z-index: 1; }

        /* ── header ── */
        .sg-header { text-align: center; margin-bottom: 1.75rem; }

        .sg-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #a5b4fc; margin: 0 auto .9rem;
          box-shadow: 0 0 20px rgba(99,102,241,.25);
          animation: sg-float 3s ease-in-out infinite;
        }
        @keyframes sg-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }

        .sg-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.45rem; font-weight: 800; color: #fff;
          letter-spacing: -.01em; margin-bottom: .25rem;
        }
        .sg-sub { font-size: .82rem; color: var(--sg-muted); }

        /* ── divider ── */
        .sg-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--sg-accent), rgba(34,211,238,.3), transparent);
          opacity: .15; margin: 1.25rem 0;
        }

        /* ── form ── */
        .sg-form { display: flex; flex-direction: column; gap: 1rem; }

        .sg-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
        @media(max-width:400px){ .sg-grid2 { grid-template-columns: 1fr; } }

        .sg-field { display: flex; flex-direction: column; gap: .3rem; }

        .sg-label {
          font-family: 'Syne', sans-serif;
          font-size: .68rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--sg-muted);
        }

        .sg-input-wrap { position: relative; }
        .sg-input-icon {
          position: absolute; left: .75rem; top: 50%;
          transform: translateY(-50%); color: var(--sg-muted);
          pointer-events: none; width: 14px;
        }
        .sg-input {
          width: 100%; padding: .6rem .85rem .6rem 2.2rem;
          background: var(--sg-surface);
          border: 1px solid var(--sg-border);
          border-radius: 11px;
          color: var(--sg-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .sg-input-no-icon {
          padding-left: .85rem !important;
        }
        .sg-input::placeholder { color: var(--sg-muted); }
        .sg-input:focus { border-color: rgba(99,102,241,.55); }

        /* ── submit btn ── */
        .sg-btn {
          width: 100%; padding: .7rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: .9rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          position: relative; overflow: hidden;
          transition: box-shadow .2s;
        }
        .sg-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.13), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .sg-btn:hover:not(:disabled) { box-shadow: 0 6px 30px rgba(99,102,241,.62); }
        .sg-btn:hover:not(:disabled)::after { opacity: 1; }
        .sg-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── footer ── */
        .sg-footer {
          display: flex; flex-direction: column; gap: .85rem;
          margin-top: 1.1rem;
        }

        .sg-or-row {
          display: flex; align-items: center; gap: .65rem;
          font-size: .72rem; color: var(--sg-muted);
          letter-spacing: .06em; text-transform: uppercase;
        }
        .sg-or-line { flex: 1; height: 1px; background: var(--sg-border); }

        .sg-login-row {
          text-align: center; font-size: .82rem; color: var(--sg-muted);
        }
        .sg-login-link {
          color: #a5b4fc; font-weight: 600;
          text-decoration: none; transition: color .18s;
        }
        .sg-login-link:hover { color: #c7d2fe; }
      `}</style>

      <div className="sg-page">

        {/* Three.js bg */}
        <div className="sg-canvas">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}
            style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.3} />
            <Particles />
          </Canvas>
        </div>

        <div className="sg-mesh" />

        {/* Card */}
        <div className="sg-card" ref={cardRef}>

          {/* Header */}
          <div className="sg-header">
            <div className="sg-icon-wrap"><UserPlus size={22} /></div>
            <h2 className="sg-title">Create Account</h2>
            <p className="sg-sub">Enter your details below to get started</p>
          </div>

          <div className="sg-divider" />

          {/* Form */}
          <form className="sg-form" onSubmit={SubmitHandler}>

            {/* Name row */}
            <div className="sg-grid2" ref={f1Ref}>
              <div className="sg-field">
                <span className="sg-label">First Name</span>
                <div className="sg-input-wrap">
                  <User className="sg-input-icon" />
                  <input id="firstName" name="firstName" type="text"
                    placeholder="John" required
                    value={user.firstName} onChange={handleChange}
                    className="sg-input" onFocus={focIn} onBlur={focOut} />
                </div>
              </div>
              <div className="sg-field">
                <span className="sg-label">Last Name</span>
                <div className="sg-input-wrap">
                  <User className="sg-input-icon" />
                  <input id="lastName" name="lastName" type="text"
                    placeholder="Doe" required
                    value={user.lastName} onChange={handleChange}
                    className="sg-input" onFocus={focIn} onBlur={focOut} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="sg-field" ref={f2Ref}>
              <span className="sg-label">Email</span>
              <div className="sg-input-wrap">
                <Mail className="sg-input-icon" />
                <input id="email" name="email" type="email"
                  placeholder="m@example.com" required
                  value={user.email} onChange={handleChange}
                  className="sg-input" onFocus={focIn} onBlur={focOut} />
              </div>
            </div>

            {/* Password */}
            <div className="sg-field" ref={f3Ref}>
              <span className="sg-label">Password</span>
              <div className="sg-input-wrap">
                <Lock className="sg-input-icon" />
                <input id="password" name="password" type="password"
                  placeholder="Create a password" required
                  value={user.password} onChange={handleChange}
                  className="sg-input" onFocus={focIn} onBlur={focOut} />
              </div>
            </div>

            {/* Submit */}
            <button ref={f4Ref} type="submit" disabled={loading}
              className="sg-btn" onMouseEnter={btnIn} onMouseLeave={btnOut}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                : <><UserPlus size={15} /> Sign Up</>
              }
            </button>
          </form>

          {/* Footer */}
          <div className="sg-footer" ref={footRef}>
            <div className="sg-or-row">
              <span className="sg-or-line" /> OR <span className="sg-or-line" />
            </div>
            <p className="sg-login-row">
              Already have an account?{' '}
              <Link to="/Login" className="sg-login-link">Login</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Signup