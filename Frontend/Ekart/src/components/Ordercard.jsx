import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── status config ── */
const statusConfig = {
  Paid:    { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)',   glow: 'rgba(34,197,94,0.3)'   },
  Failed:  { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)',   glow: 'rgba(239,68,68,0.3)'   },
  Pending: { color: '#f97316', bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.3)',  glow: 'rgba(249,115,22,0.3)'  },
}

const Ordercard = ({ userOrder }) => {
  const navigate = useNavigate()

  /* ── refs ── */
  const rootRef    = useRef(null)
  const headerRef  = useRef(null)
  const backRef    = useRef(null)
  const emptyRef   = useRef(null)
  const cardRefs   = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(backRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.5 }
      )
      .fromTo(headerRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )

      if (emptyRef.current) {
        gsap.fromTo(emptyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
        )
      }

      /* stagger cards on scroll */
      cardRefs.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
            },
            delay: i * 0.06,
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [userOrder])

  /* ── hover helpers ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -3, scale: 1.008, duration: 0.22, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.22, ease: 'power2.in'  })
  const imgIn   = e => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.25, ease: 'power2.out' })
  const imgOut  = e => gsap.to(e.currentTarget, { scale: 1,   duration: 0.25, ease: 'power2.in'  })
  const backIn  = e => gsap.to(e.currentTarget, { scale: 1.08, x: -3, duration: 0.18, ease: 'power2.out' })
  const backOut = e => gsap.to(e.currentTarget, { scale: 1,    x:  0, duration: 0.18, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --oc-bg:      #06061a;
          --oc-card:    rgba(255,255,255,0.04);
          --oc-border:  rgba(255,255,255,0.08);
          --oc-accent:  #6366f1;
          --oc-cyan:    #22d3ee;
          --oc-muted:   rgba(255,255,255,0.38);
          --oc-text:    rgba(255,255,255,0.82);
          --oc-sub:     rgba(255,255,255,0.5);
        }

        .oc-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--oc-bg);
          padding: 2rem 1.25rem 3rem;
        }
        @media(min-width:768px){ .oc-root { padding: 2.5rem 3rem 3rem; } }

        /* ── header row ── */
        .oc-header-row {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
        }

        .oc-back {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 11px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--oc-border);
          color: var(--oc-text); cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .oc-back:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.35);
        }

        .oc-page-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800; color: #fff;
          display: flex; align-items: center; gap: .6rem;
        }
        .oc-page-title svg { color: var(--oc-accent); }

        /* ── empty state ── */
        .oc-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 1rem;
          padding: 5rem 2rem;
          border: 1.5px dashed var(--oc-border);
          border-radius: 20px;
          background: var(--oc-card);
        }
        .oc-empty-icon { color: var(--oc-muted); }
        .oc-empty-text {
          font-size: 1.1rem; color: var(--oc-muted);
          font-weight: 500; text-align: center;
        }

        /* ── order card ── */
        .oc-card {
          background: var(--oc-card);
          border: 1px solid var(--oc-border);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
          transition: border-color .25s, box-shadow .25s;
          margin-bottom: 1.25rem;
        }
        .oc-card:hover {
          border-color: rgba(99,102,241,0.28);
          box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
        }

        /* shimmer top accent */
        .oc-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,
            transparent, #6366f1 35%, #22d3ee 60%, transparent);
          background-size: 220% 100%;
          animation: oc-line 4.5s linear infinite;
          opacity: .5;
        }
        @keyframes oc-line {
          0%  { background-position:  220% 0 }
          100%{ background-position: -220% 0 }
        }

        /* subtle radial bg glow */
        .oc-card::after {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 50% at 10% 0%, rgba(99,102,241,.06), transparent 65%);
        }

        .oc-card > * { position: relative; z-index: 1; }

        /* ── card top row ── */
        .oc-card-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem;
        }

        .oc-order-id-label {
          font-size: .7rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--oc-muted);
          font-family: 'Syne', sans-serif;
        }
        .oc-order-id-val {
          font-size: .82rem; color: var(--oc-sub);
          font-family: monospace; margin-top: .15rem;
          word-break: break-all;
        }

        .oc-amount {
          text-align: right;
        }
        .oc-amount-label {
          font-size: .7rem; letter-spacing: .08em; text-transform: uppercase;
          color: var(--oc-muted); font-family: 'Syne', sans-serif;
        }
        .oc-amount-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem; font-weight: 800; color: #fff;
          margin-top: .15rem;
        }

        /* ── divider ── */
        .oc-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--oc-accent), transparent);
          opacity: .15; margin: .85rem 0;
        }

        /* ── user row ── */
        .oc-user-row {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: .75rem; margin-bottom: 1rem;
        }
        .oc-user-name {
          font-size: .9rem; font-weight: 600; color: var(--oc-text);
        }
        .oc-user-email {
          font-size: .78rem; color: var(--oc-muted); margin-top: .1rem;
        }

        /* ── status badge ── */
        .oc-status {
          padding: .3rem .9rem; border-radius: 20px;
          font-size: .78rem; font-weight: 700;
          letter-spacing: .05em; font-family: 'Syne', sans-serif;
          border: 1px solid;
        }

        /* ── products section ── */
        .oc-products-label {
          font-family: 'Syne', sans-serif;
          font-size: .72rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--oc-muted);
          margin-bottom: .65rem;
        }

        .oc-product-list { display: flex; flex-direction: column; gap: .5rem; }

        .oc-product-row {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--oc-border);
          border-radius: 12px; padding: .6rem .9rem;
          transition: background .2s;
        }
        .oc-product-row:hover { background: rgba(99,102,241,0.07); }

        .oc-product-img-wrap {
          width: 52px; height: 52px; border-radius: 10px;
          overflow: hidden; flex-shrink: 0;
          background: rgba(255,255,255,.05);
          border: 1px solid var(--oc-border);
          cursor: pointer;
        }
        .oc-product-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
        }

        .oc-product-name {
          flex: 1; font-size: .84rem; color: var(--oc-text);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .oc-product-price {
          font-family: 'Syne', sans-serif;
          font-size: .84rem; font-weight: 700;
          color: var(--oc-accent); white-space: nowrap; flex-shrink: 0;
        }

        /* ── responsive ── */
        @media(max-width:480px){
          .oc-card { padding: 1.1rem; }
          .oc-product-name { font-size: .78rem; }
        }
      `}</style>

      <div className="oc-root" ref={rootRef}>
        <div>

          {/* Header */}
          <div className="oc-header-row">
            <button
              ref={backRef}
              className="oc-back"
              onClick={() => navigate(-1)}
              onMouseEnter={backIn}
              onMouseLeave={backOut}
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="oc-page-title" ref={headerRef}>
              <ShoppingBag size={22} />
              Orders
            </h1>
          </div>

          {/* Empty state */}
          {userOrder?.length === 0 ? (
            <div className="oc-empty" ref={emptyRef}>
              <Package size={48} className="oc-empty-icon" />
              <p className="oc-empty-text">No Orders found for this User</p>
            </div>
          ) : (
            <div>
              {userOrder?.map((order, i) => {
                const st = statusConfig[order.status] || statusConfig.Pending
                return (
                  <div
                    key={order._id}
                    className="oc-card"
                    ref={el => cardRefs.current[i] = el}
                    onMouseEnter={cardIn}
                    onMouseLeave={cardOut}
                  >
                    {/* Top: Order ID + Amount */}
                    <div className="oc-card-top">
                      <div>
                        <p className="oc-order-id-label">Order ID</p>
                        <p className="oc-order-id-val">{order._id}</p>
                      </div>
                      <div className="oc-amount">
                        <p className="oc-amount-label">Amount</p>
                        <p className="oc-amount-val">
                          {order.currency} {order.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="oc-divider" />

                    {/* User + Status */}
                    <div className="oc-user-row">
                      <div>
                        <p className="oc-user-name">
                          {order.user?.firstName || 'Unknown'} {order.user?.lastName}
                        </p>
                        <p className="oc-user-email">
                          {order.user?.email || 'N/A'}
                        </p>
                      </div>
                      <span
                        className="oc-status"
                        style={{
                          color: st.color,
                          background: st.bg,
                          borderColor: st.border,
                          boxShadow: `0 0 10px ${st.glow}`,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="oc-divider" />

                    {/* Products */}
                    <p className="oc-products-label">Products</p>
                    <ul className="oc-product-list">
                      {order.products.map((product, index) => (
                        <li key={index} className="oc-product-row">
                          <div
                            className="oc-product-img-wrap"
                            onMouseEnter={imgIn}
                            onMouseLeave={imgOut}
                            onClick={() => navigate(`/products/${product.productId?._id}`)}
                          >
                            <img
                              src={product.productId?.productImg?.[0].url}
                              alt=""
                            />
                          </div>
                          <span className="oc-product-name">
                            {product.productId?.productName}
                          </span>
                          <span className="oc-product-price">
                            {product.productId?.productPrice} × {product.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Ordercard