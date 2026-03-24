import React, { useState, useRef, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { gsap } from 'gsap'

const ProductImg = ({ image }) => {
  if (!image || image.length === 0) {
    return <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>No image available</p>
  }

  const [mainImg, setMainImg] = useState(image[0].url)

  /* ── refs ── */
  const rootRef    = useRef(null)
  const mainRef    = useRef(null)
  const thumbsRef  = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(mainRef.current,
        { opacity: 0, scale: 0.93, x: 24 },
        { opacity: 1, scale: 1,    x: 0, duration: 0.7 }
      )
      .fromTo(thumbsRef.current.filter(Boolean),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.08 },
        '-=0.45'
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* ── swap main image with animation ── */
  const handleThumbClick = (url, idx) => {
    if (url === mainImg) return
    gsap.fromTo(mainRef.current,
      { opacity: 0, scale: 0.96, y: 8 },
      { opacity: 1, scale: 1,    y: 0, duration: 0.38, ease: 'power3.out' }
    )
    setMainImg(url)
    // pulse the selected thumb
    if (thumbsRef.current[idx]) {
      gsap.fromTo(thumbsRef.current[idx],
        { scale: 0.88 },
        { scale: 1, duration: 0.35, ease: 'elastic.out(1.3, 0.5)' }
      )
    }
  }

  /* ── thumb hover ── */
  const thumbIn  = e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.18, ease: 'power2.out' })
  const thumbOut = e => gsap.to(e.currentTarget, { scale: 1,   duration: 0.18, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --pi-bg:      #07071a;
          --pi-surface: rgba(255,255,255,0.04);
          --pi-border:  rgba(255,255,255,0.08);
          --pi-accent:  #6366f1;
          --pi-cyan:    #22d3ee;
          --pi-muted:   rgba(255,255,255,0.35);
        }

        .pi-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          width: max-content;
          max-width: 100%;
        }

        @media (max-width: 640px) {
          .pi-root {
            flex-direction: column-reverse;
            width: 100%;
            align-items: center;
          }
          .pi-thumbs {
            flex-direction: row !important;
            overflow-x: auto;
            width: 100%;
            padding-bottom: .25rem;
          }
          .pi-main-wrap {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1;
          }
        }

        /* ── thumbnail strip ── */
        .pi-thumbs {
          display: flex;
          flex-direction: column;
          gap: .65rem;
          flex-shrink: 0;
        }

        .pi-thumb {
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid var(--pi-border);
          background: var(--pi-surface);
          cursor: pointer;
          position: relative;
          transition: border-color .2s, box-shadow .2s;
          flex-shrink: 0;
        }
        .pi-thumb.active {
          border-color: var(--pi-accent);
          box-shadow: 0 0 0 3px rgba(99,102,241,.25),
                      0 4px 16px rgba(99,102,241,.3);
        }
        .pi-thumb:hover {
          border-color: rgba(99,102,241,.5);
        }
        .pi-thumb img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: brightness(.9) saturate(1.05);
          transition: filter .2s;
        }
        .pi-thumb:hover img,
        .pi-thumb.active img { filter: brightness(1) saturate(1.1); }

        /* active dot indicator */
        .pi-thumb-dot {
          position: absolute; bottom: 4px; right: 4px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--pi-accent);
          box-shadow: 0 0 6px var(--pi-accent);
          opacity: 0; transition: opacity .2s;
        }
        .pi-thumb.active .pi-thumb-dot { opacity: 1; }

        /* ── main image wrap ── */
        .pi-main-wrap {
          width: 480px;
          height: 480px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--pi-border);
          background: var(--pi-surface);
          position: relative;
          box-shadow: 0 8px 48px rgba(0,0,0,.5),
                      0 0 0 1px rgba(99,102,241,.07);
          flex-shrink: 0;
        }

        /* shimmer top line */
        .pi-main-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 35%, #22d3ee 60%, transparent);
          background-size: 220% 100%;
          animation: pi-line 4s linear infinite;
          opacity: .5;
        }
        @keyframes pi-line {
          0%   { background-position:  220% 0 }
          100% { background-position: -220% 0 }
        }

        /* corner glow */
        .pi-main-wrap::after {
          content: '';
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 0% 0%, rgba(99,102,241,.1), transparent 60%),
            radial-gradient(ellipse 40% 35% at 100% 100%, rgba(34,211,238,.07), transparent 55%);
        }

        .pi-main-img-inner {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
        }

        .pi-main-img-inner img {
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
          padding: 1rem;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,.4));
        }

        /* react-medium-image-zoom overrides */
        [data-rmiz-modal-overlay="visible"] {
          background: rgba(4, 4, 18, 0.92) !important;
          backdrop-filter: blur(12px);
        }
        [data-rmiz-btn-zoom] {
          background: rgba(99,102,241,.18) !important;
          border: 1px solid rgba(99,102,241,.3) !important;
          border-radius: 8px !important;
          color: #a5b4fc !important;
        }
      `}</style>

      <div className="pi-root" ref={rootRef}>

        {/* Thumbnail strip */}
        <div className="pi-thumbs">
          {image.map((img, index) => (
            <div
              key={index}
              ref={el => thumbsRef.current[index] = el}
              className={`pi-thumb ${mainImg === img.url ? 'active' : ''}`}
              onClick={() => handleThumbClick(img.url, index)}
              onMouseEnter={thumbIn}
              onMouseLeave={thumbOut}
            >
              <img src={img.url} alt={`product-thumb-${index}`} />
              <span className="pi-thumb-dot" />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="pi-main-wrap" ref={mainRef}>
          <div className="pi-main-img-inner">
            <Zoom>
              <img src={mainImg} alt="main product" />
            </Zoom>
          </div>
        </div>

      </div>
    </>
  )
}

export default ProductImg