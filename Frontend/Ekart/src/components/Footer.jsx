import React, { useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitterSquare, FaPinterest } from 'react-icons/fa'
import logo from '../assets/logo.jpg'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   THREE.JS — floating dot grid background
───────────────────────────────────────── */
const FloatingGrid = () => {
  const meshRef = useRef()
  const COUNT = 180

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = []
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      speeds.push(Math.random() * 0.6 + 0.2)
    }
    return { positions, speeds }
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const ox = positions[i * 3 + 0]
      const oy = positions[i * 3 + 1]
      pos.setY(i, oy + Math.sin(t * speeds[i] + ox * 0.3) * 0.12)
      pos.setX(i, ox + Math.cos(t * speeds[i] * 0.5 + oy * 0.2) * 0.06)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
const Footer = () => {
  const footerRef  = useRef(null)
  const col0       = useRef(null)
  const col1       = useRef(null)
  const col2       = useRef(null)
  const col3       = useRef(null)
  const dividerRef = useRef(null)
  const copyrightRef = useRef(null)
  const socialRefs = useRef([])

  /* ── ScrollTrigger entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = [col0, col1, col2, col3].map(r => r.current).filter(Boolean)

      gsap.fromTo(cols,
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
          }
        }
      )

      gsap.fromTo(dividerRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 95%',
          }
        }
      )

      gsap.fromTo(copyrightRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: copyrightRef.current,
            start: 'top 98%',
          }
        }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  /* ── Social icon hover ── */
  const socialIn  = e => gsap.to(e.currentTarget, { y: -5, scale: 1.22, duration: 0.2, ease: 'back.out(2)' })
  const socialOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,    duration: 0.2, ease: 'power2.in'  })

  /* ── Subscribe button hover ── */
  const subIn  = e => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.18, ease: 'power2.out' })
  const subOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.18, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ft-bg:       #05050f;
          --ft-surface:  rgba(255,255,255,0.04);
          --ft-border:   rgba(255,255,255,0.07);
          --ft-accent:   #6366f1;
          --ft-cyan:     #22d3ee;
          --ft-muted:    rgba(255,255,255,0.42);
          --ft-text:     rgba(255,255,255,0.78);
        }

        .ft-root {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: var(--ft-bg);
          overflow: hidden;
        }

        /* Three.js canvas bg */
        .ft-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.9;
        }

        /* gradient mesh overlay */
        .ft-mesh {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 10% 80%,  rgba(99,102,241,.14) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 90% 20%,  rgba(34,211,238,.08) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,.12) 0%, transparent 55%);
        }

        /* top border shimmer */
        .ft-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 10;
          background: linear-gradient(90deg,
            transparent 0%, #6366f1 28%, #22d3ee 52%, #a78bfa 74%, transparent 100%);
          background-size: 260% 100%;
          animation: ft-shimmer 5s linear infinite;
        }
        @keyframes ft-shimmer {
          0%   { background-position:  260% 0 }
          100% { background-position: -260% 0 }
        }

        /* ── inner layout ── */
        .ft-inner {
          position: relative; z-index: 5;
          max-width: 1280px; margin: 0 auto;
          padding: 4.5rem 1.5rem 2rem;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }
        @media (max-width: 1024px) {
          .ft-inner { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        }
        @media (max-width: 600px) {
          .ft-inner { grid-template-columns: 1fr; gap: 2rem; padding: 3rem 1.25rem 1.5rem; }
        }

        /* ── column shared ── */
        .ft-col { display: flex; flex-direction: column; gap: .5rem; }

        /* ── logo col ── */
        .ft-logo-img {
          width: 110px; border-radius: 10px; object-fit: contain;
          box-shadow: 0 0 18px rgba(99,102,241,.3);
          margin-bottom: .5rem;
        }
        .ft-tagline {
          font-size: .88rem; color: var(--ft-muted); line-height: 1.6; max-width: 220px;
        }
        .ft-contact { font-size: .82rem; color: var(--ft-muted); line-height: 2; margin-top: .25rem; }
        .ft-contact span { color: var(--ft-text); }

        /* ── section headings ── */
        .ft-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; letter-spacing: .04em;
          color: #fff; margin-bottom: .5rem;
          display: flex; align-items: center; gap: .5rem;
        }
        .ft-heading::after {
          content: '';
          display: block; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--ft-accent), transparent);
          opacity: .45;
        }

        /* ── service list ── */
        .ft-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .1rem; }
        .ft-list li {
          font-size: .86rem; color: var(--ft-muted);
          padding: .3rem 0; border-bottom: 1px solid var(--ft-border);
          cursor: default;
          transition: color .2s, padding-left .2s;
        }
        .ft-list li:hover { color: var(--ft-text); padding-left: .4rem; }
        .ft-list li:last-child { border-bottom: none; }

        /* ── social icons ── */
        .ft-social { display: flex; gap: .85rem; margin-top: .25rem; }
        .ft-social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--ft-surface);
          border: 1px solid var(--ft-border);
          color: var(--ft-muted); font-size: 1.15rem;
          cursor: pointer;
          transition: color .2s, background .2s, border-color .2s, box-shadow .2s;
        }
        .ft-social-icon:hover {
          color: #fff;
          background: rgba(99,102,241,.18);
          border-color: rgba(99,102,241,.35);
          box-shadow: 0 4px 16px rgba(99,102,241,.3);
        }

        /* ── newsletter ── */
        .ft-nl-desc { font-size: .84rem; color: var(--ft-muted); line-height: 1.6; }
        .ft-nl-form {
          display: flex; margin-top: .75rem;
          border: 1px solid var(--ft-border);
          border-radius: 12px; overflow: hidden;
          background: rgba(255,255,255,.05);
          backdrop-filter: blur(10px);
          transition: border-color .25s, box-shadow .25s;
        }
        .ft-nl-form:focus-within {
          border-color: rgba(99,102,241,.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,.15);
        }
        .ft-nl-input {
          flex: 1; padding: .6rem .9rem;
          background: transparent; border: none; outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: .84rem; color: #fff;
        }
        .ft-nl-input::placeholder { color: var(--ft-muted); }
        .ft-nl-btn {
          padding: .6rem 1.1rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: .84rem; font-weight: 600; border: none; cursor: pointer;
          transition: opacity .2s;
        }
        .ft-nl-btn:hover { opacity: .88; }

        /* ── bottom bar ── */
        .ft-bottom {
          position: relative; z-index: 5;
          max-width: 1280px; margin: 0 auto;
          padding: 0 1.5rem 2rem;
        }
        .ft-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--ft-border) 30%, var(--ft-border) 70%, transparent);
          margin-bottom: 1.25rem;
        }
        .ft-copyright {
          text-align: center;
          font-size: .8rem; color: var(--ft-muted);
          letter-spacing: .03em;
        }
        .ft-copyright .ft-brand {
          font-family: 'Syne', sans-serif; font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <footer className="ft-root" ref={footerRef}>

        {/* Three.js floating dot field */}
        <div className="ft-canvas">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}
            style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.4} />
            <FloatingGrid />
          </Canvas>
        </div>

        {/* gradient mesh */}
        <div className="ft-mesh" />

        {/* ── MAIN GRID ── */}
        <div className="ft-inner">

          {/* COL 1 — Brand */}
          <div className="ft-col" ref={col0}>
            <img src={logo} alt="logo" className="ft-logo-img" />
            <p className="ft-tagline">Powering Your World with the Best in Electronics.</p>
            <p className="ft-contact">
              <span>123 Electronics St</span>, Style City, NY 10001<br />
              <span>Email:</span> support@2kpro.com<br />
              <span>Phone:</span> (123) 456-7890
            </p>
          </div>

          {/* COL 2 — Customer Service */}
          <div className="ft-col" ref={col1}>
            <h3 className="ft-heading">Customer Service</h3>
            <ul className="ft-list">
              <li>Contact Us</li>
              <li>Shipping &amp; Returns</li>
              <li>FAQs</li>
              <li>Order Tracking</li>
              <li>Size Guide</li>
            </ul>
          </div>

          {/* COL 3 — Social */}
          <div className="ft-col" ref={col2}>
            <h3 className="ft-heading">Follow Us</h3>
            <div className="ft-social">
              {[FaFacebook, FaInstagram, FaTwitterSquare, FaPinterest].map((Icon, i) => (
                <div
                  key={i}
                  className="ft-social-icon"
                  ref={el => socialRefs.current[i] = el}
                  onMouseEnter={socialIn}
                  onMouseLeave={socialOut}
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          {/* COL 4 — Newsletter */}
          <div className="ft-col" ref={col3}>
            <h3 className="ft-heading">Stay in the Loop</h3>
            <p className="ft-nl-desc">
              Subscribe to get special offers, free giveaways, and more.
            </p>
            <form className="ft-nl-form" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="ft-nl-input"
              />
              <button
                type="submit"
                className="ft-nl-btn"
                onMouseEnter={subIn}
                onMouseLeave={subOut}
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* ── BOTTOM ── */}
        <div className="ft-bottom">
          <div className="ft-divider" ref={dividerRef} />
          <p className="ft-copyright" ref={copyrightRef}>
            © {new Date().getFullYear()}{' '}
            <span className="ft-brand">Ekart</span>. All rights reserved.
          </p>
        </div>

      </footer>
    </>
  )
}

export default Footer