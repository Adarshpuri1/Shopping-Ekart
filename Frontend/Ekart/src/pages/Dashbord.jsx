import SideBar from '@/components/SideBar'
import React, { useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { gsap } from 'gsap'

const Dashbord = () => {
  const contentRef = useRef(null)

  /* ── Outlet content fades in on mount / route change ── */
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    )
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --db-bg:     #05050f;
          --db-border: rgba(255,255,255,0.07);
        }

        .db-root {
          display: flex;
          padding-top: 64px;        /* navbar height */
          min-height: 100vh;
          background: var(--db-bg);
          background-image:
            radial-gradient(ellipse 60% 45% at 80% 5%,   rgba(99,102,241,.08), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 95%,  rgba(34,211,238,.05), transparent 55%);
          font-family: 'DM Sans', sans-serif;
        }

        /* content area sits beside the fixed sidebar */
        .db-content {
          flex: 1;
          margin-left: 260px;   /* matches SideBar --sb-width */
          min-height: calc(100vh - 64px);
          overflow-x: hidden;
        }

        @media(max-width: 768px) {
          .db-content { margin-left: 0; }
        }
      `}</style>

      <div className="db-root">
        <SideBar />
        <div className="db-content" ref={contentRef}>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Dashbord