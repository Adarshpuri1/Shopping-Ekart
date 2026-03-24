import Ordercard from '@/components/Ordercard'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { Package } from 'lucide-react'

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([])
  const accessToken = localStorage.getItem('accessToken')

  const getUserOrders = async () => {
    try {
      const res = await axios.get(`https://shopping-ekart-backend.onrender.comapi/v1/orders/my-order`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) setUserOrder(res.data.orders)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { getUserOrders() }, [])

  /* ── refs ── */
  const pageRef    = useRef(null)
  const loaderRef  = useRef(null)
  const contentRef = useRef(null)

  /* ── loader entrance ── */
  useEffect(() => {
    if (!loaderRef.current) return
    gsap.fromTo(loaderRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
    )
  }, [])

  /* ── content entrance once orders arrive ── */
  useEffect(() => {
    if (!userOrder.length || !contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [userOrder.length])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --mo-bg:    #05050f;
          --mo-muted: rgba(255,255,255,0.35);
        }

        .mo-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--mo-bg);
          background-image:
            radial-gradient(ellipse 65% 45% at 80% 0%,   rgba(99,102,241,.08), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 100%, rgba(34,211,238,.05), transparent 55%);
        }

        /* ── loading state ── */
        .mo-loader {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 70vh; gap: 1rem;
        }
        .mo-spinner {
          width: 42px; height: 42px; border-radius: 50%;
          border: 3px solid rgba(99,102,241,.2);
          border-top-color: #6366f1;
          animation: mo-spin .8s linear infinite;
        }
        @keyframes mo-spin { to { transform: rotate(360deg); } }
        .mo-load-text {
          font-size: .88rem; color: var(--mo-muted);
          font-family: 'DM Sans', sans-serif;
        }

        /* content wrapper */
        .mo-content { width: 100%; }
      `}</style>

      <div className="mo-page" ref={pageRef}>

        {/* Loading state — shown while orders haven't arrived yet */}
        {userOrder.length === 0 && (
          <div className="mo-loader" ref={loaderRef}>
            <div className="mo-spinner" />
            <p className="mo-load-text">Loading your orders…</p>
          </div>
        )}

        {/* Ordercard — unchanged logic */}
        {userOrder.length > 0 && (
          <div className="mo-content" ref={contentRef}>
            <Ordercard userOrder={userOrder} />
          </div>
        )}

      </div>
    </>
  )
}

export default MyOrder