import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import img1 from "../assets/pic1.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

/* ─────────────────────────────────────────
   THREE.JS SCENE ELEMENTS
───────────────────────────────────────── */

// Floating orb that distorts and pulses
const GlowOrb = ({ position, color, speed, distort, scale }) => {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * speed * 0.4;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * speed * 0.3) * 0.2;
    }
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
};

// Rotating torus ring
const Ring = ({ position, color }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.5;
      ref.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1.2, 0.05, 16, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.7} />
    </mesh>
  );
};

/* ─────────────────────────────────────────
   MAIN HERO COMPONENT
───────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messes, setMesses] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // GSAP animation refs
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const btnGroupRef = useRef(null);
  const imgRef = useRef(null);
  const chatIconRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 60, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 1 }
      )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          btnGroupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          imgRef.current,
          { opacity: 0, scale: 0.85, rotateY: 15 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 1.1, ease: "back.out(1.5)" },
          "-=0.8"
        )
        .fromTo(
          chatIconRef.current,
          { opacity: 0, scale: 0, rotate: -180 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)" },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Animate chat window open/close
  useEffect(() => {
    if (!chatWindowRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        chatWindowRef.current,
        { opacity: 0, scale: 0.85, y: 30, transformOrigin: "bottom right" },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  // Hover animations for buttons
  const handleBtnEnter = (e) => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.2, ease: "power2.out" });
  const handleBtnLeave = (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.in" });

  const rew = async () => {
    if (!messes.trim()) return;
    const userMessage = { sender: "user", text: messes };
    setMessages((prev) => [...prev, userMessage]);
    setMesses("");
    setLoading(true);

    try {
      const resp = await axios.post("https://shopping-ekart.vercel.app/v1/user/ai", {
        messes: userMessage.text,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: resp.data.reply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --brand-blue: #2563eb;
          --brand-indigo: #4f46e5;
          --brand-violet: #7c3aed;
          --neon-cyan: #22d3ee;
          --neon-purple: #a78bfa;
          --glass-bg: rgba(255,255,255,0.06);
          --glass-border: rgba(255,255,255,0.15);
        }

        .hero-section {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #050816;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-gradient-mesh {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(79,70,229,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 30%, rgba(34,211,238,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 70% at 60% 80%, rgba(124,58,237,0.18) 0%, transparent 55%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            padding: 5rem 1.5rem 3rem;
            text-align: center;
          }
          .hero-right { order: -1; }
          .btn-group { justify-content: center !important; }
          .badge { margin: 0 auto; }
        }

        .hero-left { display: flex; flex-direction: column; gap: 1.5rem; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 100px;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          color: var(--neon-cyan);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          width: fit-content;
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--neon-cyan);
          box-shadow: 0 0 8px var(--neon-cyan);
          animation: pulse-dot 1.6s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { transform: scale(1); opacity:1; }
          50% { transform: scale(1.5); opacity:0.6; }
        }

        .hero-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 5.5vw, 5rem);
          font-weight: 800;
          line-height: 1.08;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .hero-heading .accent {
          background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          color: rgba(255,255,255,0.55);
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          max-width: 420px;
        }

        .btn-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-primary {
          padding: 0.75rem 2rem;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-violet));
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(99,102,241,0.4);
          transition: box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { box-shadow: 0 6px 32px rgba(99,102,241,0.6); }

        .btn-outline {
          padding: 0.75rem 2rem;
          border-radius: 12px;
          background: var(--glass-bg);
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          border: 1px solid var(--glass-border);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
        }

        /* ── IMAGE CARD ── */
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .img-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.15),
            0 30px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(124,58,237,0.2) inset;
          background: rgba(10,10,30,0.5);
          backdrop-filter: blur(10px);
          max-width: 440px;
          width: 100%;
        }
        .img-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(79,70,229,0.15) 0%, transparent 60%);
          z-index: 1;
          pointer-events: none;
        }
        .img-card img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          display: block;
          filter: saturate(1.1) brightness(0.95);
        }

        .img-badge {
          position: absolute;
          bottom: 1.2rem;
          left: 1.2rem;
          z-index: 3;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(14px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.6rem 1rem;
          color: #fff;
        }
        .img-badge-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
        .img-badge-value { font-size: 1.1rem; font-weight: 700; color: var(--neon-cyan); }

        /* ── STATS ROW ── */
        .stats-row {
          display: flex;
          gap: 2rem;
          margin-top: 0.5rem;
        }
        .stat-item { display: flex; flex-direction: column; }
        .stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
        }
        .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
        .stat-divider { width: 1px; background: var(--glass-border); }

        /* ── CHATBOT ── */
        .chat-fab {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-violet));
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(99,102,241,0.55);
          border: none;
          font-size: 1.4rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .chat-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(99,102,241,0.7);
        }

        .chat-window {
          width: 340px;
          height: 460px;
          background: #0d0d1f;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 0.9rem 1.1rem;
          background: linear-gradient(135deg, rgba(37,99,235,0.4), rgba(124,58,237,0.35));
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: blur(10px);
        }
        .chat-header-title {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #fff;
          font-size: 0.95rem;
        }
        .chat-header-dot {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse-dot 1.6s ease-in-out infinite;
        }
        .chat-close {
          background: none; border: none; color: rgba(255,255,255,0.6);
          font-size: 1rem; cursor: pointer; padding: 0.2rem;
          transition: color 0.15s;
        }
        .chat-close:hover { color: #fff; }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: #08081a;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .msg-bubble {
          padding: 0.55rem 0.9rem;
          border-radius: 14px;
          font-size: 0.85rem;
          max-width: 78%;
          line-height: 1.5;
          word-break: break-word;
        }
        .msg-user {
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-violet));
          color: #fff;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .msg-bot {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .msg-thinking {
          color: rgba(255,255,255,0.4);
          font-size: 0.78rem;
          align-self: flex-start;
          padding-left: 0.2rem;
        }

        .chat-input-area {
          padding: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          gap: 0.5rem;
          background: #0d0d1f;
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.5rem 0.8rem;
          color: #fff;
          font-size: 0.83rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.3); }
        .chat-input:focus { border-color: rgba(99,102,241,0.6); }
        .chat-send {
          background: linear-gradient(135deg, var(--brand-blue), var(--brand-violet));
          border: none;
          border-radius: 10px;
          padding: 0.5rem 0.9rem;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .chat-send:hover { opacity: 0.88; transform: scale(1.05); }
      `}</style>

      <section className="hero-section" ref={heroRef}>
        {/* Three.js Background Canvas */}
        <div className="hero-canvas">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[4, 4, 4]} intensity={1.2} color="#4f46e5" />
            <pointLight position={[-4, -2, 2]} intensity={0.8} color="#22d3ee" />
            <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.8} />
            <GlowOrb position={[3, 0.5, -2]} color="#4f46e5" speed={0.8} distort={0.45} scale={1.8} />
            <GlowOrb position={[-3.5, -1, -3]} color="#7c3aed" speed={0.5} distort={0.35} scale={1.3} />
            <GlowOrb position={[0, 2.5, -4]} color="#22d3ee" speed={1.1} distort={0.55} scale={0.9} />
            <Ring position={[3.5, 1, -1.5]} color="#a78bfa" />
            <Ring position={[-2, -1.5, -2]} color="#22d3ee" />
          </Canvas>
        </div>

        {/* Gradient mesh + noise */}
        <div className="hero-gradient-mesh" />
        <div className="noise-overlay" />

        {/* Main content */}
        <div className="hero-content">
          {/* LEFT */}
          <div className="hero-left">
            <div className="badge">
              <span className="badge-dot" />
              New arrivals every week
            </div>

            <h1 className="hero-heading" ref={headingRef}>
              Latest Electronics<br />
              at <span className="accent">Best Prices</span>
            </h1>

            <p className="hero-sub" ref={subRef}>
              Discover cutting-edge technology with unbeatable deals — from premium audio to next-gen computing.
            </p>

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">Free</span>
                <span className="stat-label">Shipping</span>
              </div>
            </div>

            <div className="btn-group" ref={btnGroupRef}>
              <button
                className="btn-primary"
                onClick={() => navigate("/products")}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                Shop Now →
              </button>
              <button
                className="btn-outline"
                onClick={() => navigate("/products")}
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                View Deals
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-right">
            <div className="img-card" ref={imgRef}>
              <div className="img-badge">
                <div className="img-badge-label">Today's Deal</div>
                <div className="img-badge-value">Up to 40% OFF</div>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING CHATBOT */}
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}>
          {!isOpen && (
            <button
              ref={chatIconRef}
              className="chat-fab"
              onClick={() => setIsOpen(true)}
              aria-label="Open chat"
            >
              🤖
            </button>
          )}

          {isOpen && (
            <div className="chat-window" ref={chatWindowRef}>
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-title">
                  <span className="chat-header-dot" />
                  AI Assistant
                </div>
                <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`msg-bubble ${msg.sender === "user" ? "msg-user" : "msg-bot"}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="msg-thinking">● ● ●</div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <input
                  type="text"
                  value={messes}
                  onChange={(e) => setMesses(e.target.value)}
                  placeholder="Ask about any product..."
                  className="chat-input"
                  onKeyDown={(e) => e.key === "Enter" && rew()}
                />
                <button className="chat-send" onClick={rew}>Send</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;