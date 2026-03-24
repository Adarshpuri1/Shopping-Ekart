import { setToken, setUser } from '@/redux/userSlice'
import axios from 'axios'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react'

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
   LOGIN
───────────────────────────────────── */
const Login = () => {
  const [formdata, setFormData] = useState({ email: '', password: '' })
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`https://shopping-ekart.vercel.app/v1/user/login`, formdata, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.data.success) {
        toast.success('User log in Successfully')
        dispatch(setUser(res.data.user))
        dispatch(setToken(res.data.accessToken))
        localStorage.setItem('accessToken', res.data.accessToken)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message)
      if (error.response?.data?.message === 'verify first ') {
        navigate('/reverify')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ── refs ── */
  const cardRef  = useRef(null)
  const formRef  = useRef(null)
  const f1Ref    = useRef(null)
  const f2Ref    = useRef(null)
  const footRef  = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: 'back.out(1.5)' }
      )
      .fromTo([f1Ref.current, f2Ref.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.45 }, '-=0.4'
      )
      .fromTo(footRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.25'
      )
    })
    return () => ctx.revert()
  }, [])

  /* ── hover / focus helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --lg-bg:      #05050f;
          --lg-card:    rgba(9,9,28,0.92);
          --lg-surface: rgba(255,255,255,0.045);
          --lg-border:  rgba(255,255,255,0.08);
          --lg-accent:  #6366f1;
          --lg-cyan:    #22d3ee;
          --lg-muted:   rgba(255,255,255,0.35);
          --lg-text:    rgba(255,255,255,0.82);
          --lg-sub:     rgba(255,255,255,0.5);
        }

        /* ── full page ── */
        .lg-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--lg-bg);
          position: relative; overflow: hidden;
          padding: 2rem 1rem;
        }

        /* three.js canvas */
        .lg-canvas {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: .85;
        }

        /* mesh overlay */
        .lg-mesh {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 15% 25%,  rgba(99,102,241,.14), transparent 60%),
            radial-gradient(ellipse 55% 45% at 85% 75%,  rgba(34,211,238,.09), transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(124,58,237,.1),  transparent 55%);
        }

        /* ── card ── */
        .lg-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: var(--lg-card);
          border: 1px solid var(--lg-border);
          border-radius: 22px;
          padding: 2.2rem 2rem 2rem;
          box-shadow:
            0 0 0 1px rgba(99,102,241,.07),
            0 24px 72px rgba(0,0,0,.65);
          overflow: hidden;
        }

        /* shimmer top line */
        .lg-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 28%, #22d3ee 52%, #a78bfa 75%, transparent);
          background-size: 240% 100%;
          animation: lg-line 4.5s linear infinite;
        }
        @keyframes lg-line {
          0%  { background-position:  240% 0 }
          100%{ background-position: -240% 0 }
        }

        /* corner glow */
        .lg-card::after {
          content: ''; position: absolute; inset: 0;
          pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 60% 45% at 0% 0%, rgba(99,102,241,.09), transparent 55%);
        }
        .lg-card > * { position: relative; z-index: 1; }

        /* ── header ── */
        .lg-header { text-align: center; margin-bottom: 1.75rem; }

        .lg-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #a5b4fc; margin: 0 auto .9rem;
          box-shadow: 0 0 20px rgba(99,102,241,.25);
          animation: lg-float 3s ease-in-out infinite;
        }
        @keyframes lg-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }

        .lg-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.45rem; font-weight: 800; color: #fff;
          letter-spacing: -.01em; margin-bottom: .25rem;
        }
        .lg-sub {
          font-size: .82rem; color: var(--lg-muted);
        }

        /* ── divider ── */
        .lg-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--lg-accent), rgba(34,211,238,.3), transparent);
          opacity: .15; margin: 1.25rem 0;
        }

        /* ── form ── */
        .lg-form { display: flex; flex-direction: column; gap: 1rem; }

        .lg-field { display: flex; flex-direction: column; gap: .3rem; }

        .lg-label {
          font-family: 'Syne', sans-serif;
          font-size: .68rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--lg-muted);
        }

        .lg-input-wrap { position: relative; }
        .lg-input-icon {
          position: absolute; left: .75rem; top: 50%;
          transform: translateY(-50%); color: var(--lg-muted);
          pointer-events: none; width: 15px;
        }
        .lg-input {
          width: 100%; padding: .6rem .85rem .6rem 2.2rem;
          background: var(--lg-surface);
          border: 1px solid var(--lg-border);
          border-radius: 11px;
          color: var(--lg-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .lg-input::placeholder { color: var(--lg-muted); }
        .lg-input:focus { border-color: rgba(99,102,241,.55); }

        /* ── submit btn ── */
        .lg-btn {
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
          margin-top: .25rem;
        }
        .lg-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.13), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .lg-btn:hover:not(:disabled) { box-shadow: 0 6px 30px rgba(99,102,241,.62); }
        .lg-btn:hover:not(:disabled)::after { opacity: 1; }
        .lg-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── footer section ── */
        .lg-footer { display: flex; flex-direction: column; gap: .85rem; margin-top: 1.1rem; }

        .lg-forgot {
          text-align: right;
          font-size: .8rem; color: rgba(99,102,241,.8);
          text-decoration: none;
          transition: color .18s;
        }
        .lg-forgot:hover { color: #a5b4fc; }

        /* or divider */
        .lg-or-row {
          display: flex; align-items: center; gap: .65rem;
          font-size: .72rem; color: var(--lg-muted); letter-spacing: .06em;
          text-transform: uppercase;
        }
        .lg-or-line { flex: 1; height: 1px; background: var(--lg-border); }

        /* signup row */
        .lg-signup-row {
          text-align: center;
          font-size: .82rem; color: var(--lg-muted);
        }
        .lg-signup-link {
          color: #a5b4fc; font-weight: 600;
          text-decoration: none;
          transition: color .18s;
        }
        .lg-signup-link:hover { color: #c7d2fe; }
      `}</style>

      <div className="lg-page">

        {/* Three.js bg */}
        <div className="lg-canvas">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}
            style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.3} />
            <Particles />
          </Canvas>
        </div>

        {/* mesh overlay */}
        <div className="lg-mesh" />

        {/* Card */}
        <div className="lg-card" ref={cardRef}>

          {/* Header */}
          <div className="lg-header">
            <div className="lg-icon-wrap"><LogIn size={22} /></div>
            <h2 className="lg-title">Welcome Back</h2>
            <p className="lg-sub">Sign in to your account to continue</p>
          </div>

          <div className="lg-divider" />

          {/* Form */}
          <form className="lg-form" onSubmit={submitHandler} ref={formRef}>

            {/* Email */}
            <div className="lg-field" ref={f1Ref}>
              <span className="lg-label">Email</span>
              <div className="lg-input-wrap">
                <Mail className="lg-input-icon" />
                <input
                  id="email" name="email" type="email"
                  placeholder="m@example.com" required
                  value={formdata.email} onChange={handleChange}
                  className="lg-input"
                  onFocus={focIn} onBlur={focOut}
                />
              </div>
            </div>

            {/* Password */}
            <div className="lg-field" ref={f2Ref}>
              <span className="lg-label">Password</span>
              <div className="lg-input-wrap">
                <Lock className="lg-input-icon" />
                <input
                  id="password" name="password" type="password"
                  placeholder="Enter your password" required
                  value={formdata.password} onChange={handleChange}
                  className="lg-input"
                  onFocus={focIn} onBlur={focOut}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="lg-btn"
              onMouseEnter={btnIn} onMouseLeave={btnOut}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                : <><LogIn size={15} /> Login</>
              }
            </button>
          </form>

          {/* Footer links */}
          <div className="lg-footer" ref={footRef}>
            <Link to="/forgot-password" className="lg-forgot">Forgot password?</Link>

            <div className="lg-or-row">
              <span className="lg-or-line" />
              OR
              <span className="lg-or-line" />
            </div>

            <p className="lg-signup-row">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="lg-signup-link">Sign up</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login