import Ordercard from '@/components/Ordercard'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'

const ShowUserOrders = () => {
  const params      = useParams()
  const [userOrder, setUserOrder] = useState(null)
  const accessToken = localStorage.getItem('accessToken')

  const getUserOrders = async () => {
    const res = await axios.get(
      `https://shopping-ekart-backend.onrender.comapi/v1/orders/user-order/${params.userId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (res.data.success) setUserOrder(res.data.orders)
  }

  useEffect(() => { getUserOrders() }, [])

  /* ── refs ── */
  const pageRef    = useRef(null)
  const loaderRef  = useRef(null)
  const contentRef = useRef(null)

  /* ── loading spinner entrance ── */
  useEffect(() => {
    if (userOrder !== null || !loaderRef.current) return
    gsap.fromTo(loaderRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
    )
  }, [userOrder])

  /* ── content entrance once data arrives ── */
  useEffect(() => {
    if (userOrder === null || !contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [userOrder])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --suo-bg:     #05050f;
          --suo-muted:  rgba(255,255,255,0.35);
          --suo-accent: #6366f1;
        }

        .suo-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 0;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--suo-bg);
          background-image:
            radial-gradient(ellipse 65% 45% at 80% 0%,   rgba(99,102,241,.08), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 100%, rgba(34,211,238,.05), transparent 55%);
        }
        @media(max-width:768px){
          .suo-page { padding-left: 1rem; padding-top: 4rem; padding-right: 1rem; }
        }

        /* ── loading state ── */
        .suo-loader {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 60vh; gap: 1rem;
        }
        .suo-spinner {
          width: 42px; height: 42px; border-radius: 50%;
          border: 3px solid rgba(99,102,241,.2);
          border-top-color: #6366f1;
          animation: suo-spin .8s linear infinite;
        }
        @keyframes suo-spin { to { transform: rotate(360deg); } }
        .suo-load-text {
          font-size: .88rem; color: var(--suo-muted);
          font-family: 'DM Sans', sans-serif;
        }

        /* content wrapper — Ordercard sits inside */
        .suo-content { width: 100%; }
      `}</style>

      <div className="suo-page" ref={pageRef}>

        {/* Loading */}
        {userOrder === null && (
          <div className="suo-loader" ref={loaderRef}>
            <div className="suo-spinner" />
            <p className="suo-load-text">Fetching orders…</p>
          </div>
        )}

        {/* Content — Ordercard (logic untouched) */}
        {userOrder !== null && (
          <div className="suo-content" ref={contentRef}>
            <Ordercard userOrder={userOrder} />
          </div>
        )}

      </div>
    </>
  )
}

export default ShowUserOrders