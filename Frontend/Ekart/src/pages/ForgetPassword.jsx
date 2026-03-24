import { Input } from '@/components/ui/input'
import axios from 'axios'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'
import { Mail, KeyRound, Lock, Loader2, ShieldCheck } from 'lucide-react'

/* ─────────────────────────────────────
   THREE.JS — floating particle bg
───────────────────────────────────── */
const Particles = () => {
  const ref  = useRef()
  const COUNT = 120

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
   STEP CONFIG
───────────────────────────────────── */
const STEPS = [
  { num: 1, icon: Mail,        title: 'Forgot Password',  sub: 'Enter your email to receive an OTP'  },
  { num: 2, icon: KeyRound,    title: 'Verify OTP',       sub: 'Enter the OTP sent to your email'    },
  { num: 3, icon: Lock,        title: 'Change Password',  sub: 'Set your new password'               },
]

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
const ForgetPassword = () => {
  const [step,            setStep]            = useState(1)
  const [loading,         setLoading]         = useState(false)
  const [email,           setEmail]           = useState('')
  const [otp,             setOtp]             = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  /* ── logic unchanged ── */
  const handleEmail = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post(`https://shopping-ekart.vercel.app/api/v1/user/forget-password`,
        { email }, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.success) { toast.success(res.data.message); setStep(2) }
    } catch (error) { console.error(error); toast.error(error.response?.data?.message) }
    finally { setLoading(false) }
  }

  const handleOTP = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post(`https://shopping-ekart.vercel.app/api/v1/user/verify-otp/${email}`,
        { otp }, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.success) { toast.success(res.data.message); setStep(3) }
    } catch (error) { console.error(error); toast.error(error.response?.data?.message) }
    finally { setLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await axios.post(`https://shopping-ekart.vercel.app/api/v1/user/change-password/${email}`,
        { newPassword, confirmPassword }, { headers: { 'Content-Type': 'application/json' } })
      if (res.data.success) { toast.success(res.data.message); navigate('/login') }
    } catch (error) { console.error(error); toast.error(error.response?.data?.message) }
    finally { setLoading(false) }
  }

  /* ── refs ── */
  const cardRef  = useRef(null)
  const formRef  = useRef(null)

  /* ── card entrance on mount ── */
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 36, scale: 0.95 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: 'back.out(1.6)' }
    )
  }, [])

  /* ── step transition ── */
  useEffect(() => {
    if (!formRef.current) return
    gsap.fromTo(formRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' }
    )
  }, [step])

  /* ── btn hover ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  const current = STEPS.find(s => s.num === step)
  const Icon    = current.icon

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --fp-bg:      #05050f;
          --fp-card:    rgba(9,9,28,0.92);
          --fp-surface: rgba(255,255,255,0.045);
          --fp-border:  rgba(255,255,255,0.08);
          --fp-accent:  #6366f1;
          --fp-cyan:    #22d3ee;
          --fp-muted:   rgba(255,255,255,0.35);
          --fp-text:    rgba(255,255,255,0.82);
        }

        /* ── full-screen wrapper ── */
        .fp-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--fp-bg);
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        /* three.js canvas */
        .fp-canvas {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 0; opacity: .9;
        }

        /* mesh overlays */
        .fp-mesh {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 20% 30%,  rgba(99,102,241,.14), transparent 60%),
            radial-gradient(ellipse 55% 45% at 80% 70%,  rgba(34,211,238,.09), transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 100%, rgba(124,58,237,.1),  transparent 55%);
        }

        /* ── card ── */
        .fp-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          background: var(--fp-card);
          border: 1px solid var(--fp-border);
          border-radius: 22px;
          padding: 2rem 2rem 2.2rem;
          box-shadow:
            0 0 0 1px rgba(99,102,241,.07),
            0 24px 72px rgba(0,0,0,.65);
          overflow: hidden;
        }

        /* shimmer top */
        .fp-card::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg,
            transparent, #6366f1 28%, #22d3ee 52%, #a78bfa 75%, transparent);
          background-size:240% 100%;
          animation:fp-line 4.5s linear infinite;
        }
        @keyframes fp-line {
          0%  { background-position: 240% 0 }
          100%{ background-position:-240% 0 }
        }

        /* corner glow */
        .fp-card::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background:radial-gradient(ellipse 60% 45% at 0% 0%, rgba(99,102,241,.09), transparent 55%);
        }
        .fp-card > * { position:relative; z-index:1; }

        /* ── step dots ── */
        .fp-steps {
          display: flex; align-items: center; justify-content: center;
          gap: .5rem; margin-bottom: 1.75rem;
        }
        .fp-dot {
          height: 6px; border-radius: 20px;
          background: rgba(255,255,255,.12);
          transition: width .35s ease, background .35s ease;
        }
        .fp-dot.active {
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          width: 28px !important;
        }

        /* ── header ── */
        .fp-header { text-align: center; margin-bottom: 1.75rem; }

        .fp-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #a5b4fc;
          margin: 0 auto .9rem;
          box-shadow: 0 0 20px rgba(99,102,241,.25);
        }

        .fp-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem; font-weight: 800; color: #fff;
          letter-spacing: -.01em; margin-bottom: .3rem;
        }
        .fp-sub {
          font-size: .82rem; color: var(--fp-muted);
        }

        /* ── form ── */
        .fp-form { display: flex; flex-direction: column; gap: 1rem; }

        .fp-label {
          font-family: 'Syne', sans-serif;
          font-size: .68rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--fp-muted);
          display: block; margin-bottom: .3rem;
        }

        .fp-input {
          width: 100%;
          padding: .6rem .85rem;
          background: var(--fp-surface);
          border: 1px solid var(--fp-border);
          border-radius: 11px;
          color: var(--fp-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .fp-input::placeholder { color: var(--fp-muted); }
        .fp-input:focus { border-color: rgba(99,102,241,.55); }

        /* ── submit btn ── */
        .fp-btn {
          width: 100%; padding: .7rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: .9rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          position: relative; overflow: hidden;
          transition: box-shadow .2s, opacity .2s;
          margin-top: .25rem;
        }
        .fp-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.13),transparent);
          opacity:0; transition:opacity .2s;
        }
        .fp-btn:hover:not(:disabled) { box-shadow:0 6px 30px rgba(99,102,241,.62); }
        .fp-btn:hover:not(:disabled)::after { opacity:1; }
        .fp-btn:disabled { opacity:.6; cursor:not-allowed; }

        /* ── divider ── */
        .fp-divider {
          height:1px;
          background:linear-gradient(90deg, var(--fp-accent), rgba(34,211,238,.3), transparent);
          opacity:.15;
        }
      `}</style>

      <div className="fp-page">

        {/* Three.js bg */}
        <div className="fp-canvas">
          <Canvas camera={{ position: [0,0,6], fov:60 }} style={{ width:'100%', height:'100%' }}>
            <ambientLight intensity={0.3} />
            <Particles />
          </Canvas>
        </div>

        {/* mesh */}
        <div className="fp-mesh" />

        {/* Card */}
        <div className="fp-card" ref={cardRef}>

          {/* Step dots */}
          <div className="fp-steps">
            {STEPS.map(s => (
              <div key={s.num} className={`fp-dot${step === s.num ? ' active' : ''}`}
                style={{ width: step === s.num ? 28 : 8 }} />
            ))}
          </div>

          {/* Header */}
          <div className="fp-header">
            <div className="fp-icon-wrap"><Icon size={22} /></div>
            <h2 className="fp-title">{current.title}</h2>
            <p className="fp-sub">{current.sub}</p>
          </div>

          <div className="fp-divider" style={{ marginBottom: '1.5rem' }} />

          {/* Form area (animated on step change) */}
          <div ref={formRef}>

            {/* STEP 1 — email */}
            {step === 1 && (
              <form className="fp-form" onSubmit={handleEmail}>
                <div>
                  <span className="fp-label">Email address</span>
                  <input type="email" placeholder="example@gmail.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required className="fp-input"
                    onFocus={focIn} onBlur={focOut} />
                </div>
                <button type="submit" disabled={loading} className="fp-btn"
                  onMouseEnter={btnIn} onMouseLeave={btnOut}>
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send OTP'}
                </button>
              </form>
            )}

            {/* STEP 2 — OTP */}
            {step === 2 && (
              <form className="fp-form" onSubmit={handleOTP}>
                <div>
                  <span className="fp-label">OTP Code</span>
                  <input type="text" placeholder="Enter your OTP"
                    value={otp} onChange={e => setOtp(e.target.value)}
                    required className="fp-input"
                    onFocus={focIn} onBlur={focOut} />
                </div>
                <button type="submit" disabled={loading} className="fp-btn"
                  onMouseEnter={btnIn} onMouseLeave={btnOut}>
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : 'Verify OTP'}
                </button>
              </form>
            )}

            {/* STEP 3 — new password */}
            {step === 3 && (
              <form className="fp-form" onSubmit={handlePassword}>
                <div>
                  <span className="fp-label">New Password</span>
                  <input type="password" placeholder="New password"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    required className="fp-input"
                    onFocus={focIn} onBlur={focOut} />
                </div>
                <div>
                  <span className="fp-label">Confirm Password</span>
                  <input type="password" placeholder="Confirm password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    required className="fp-input"
                    onFocus={focIn} onBlur={focOut} />
                </div>
                <button type="submit" disabled={loading} className="fp-btn"
                  onMouseEnter={btnIn} onMouseLeave={btnOut}>
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                    : <><ShieldCheck size={15} /> Change Password</>}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default ForgetPassword