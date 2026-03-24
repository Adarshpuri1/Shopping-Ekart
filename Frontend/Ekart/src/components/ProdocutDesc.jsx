import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { ShoppingCart, Tag, Layers, Star } from 'lucide-react'

const ProdocutDesc = ({ product }) => {
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()

  const addtocart = async (productId) => {
    try {
      const res = await axios.post(
        `https://shopping-ekart.vercel.app/v1/cart/add`,
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.data.success) {
        toast.success('Product added successfully')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error(error)
    }
  }

  /* ── refs ── */
  const rootRef    = useRef(null)
  const nameRef    = useRef(null)
  const metaRef    = useRef(null)
  const priceRef   = useRef(null)
  const descRef    = useRef(null)
  const qtyRef     = useRef(null)
  const btnRef     = useRef(null)
  const divRef     = useRef(null)

  /* ── entrance stagger ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(nameRef.current,
        { opacity: 0, y: 28, skewX: -2 },
        { opacity: 1, y: 0,  skewX: 0, duration: 0.65 }
      )
      .fromTo(metaRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.45 }, '-=0.35'
      )
      .fromTo(divRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3'
      )
      .fromTo(priceRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, '-=0.25'
      )
      .fromTo(descRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.25'
      )
      .fromTo(qtyRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.42 }, '-=0.25'
      )
      .fromTo(btnRef.current,
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.2'
      )
    }, rootRef)
    return () => ctx.revert()
  }, [product])

  /* ── button hover ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.18, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.18, ease: 'power2.in'  })

  /* ── price pulse on mount ── */
  useEffect(() => {
    if (!priceRef.current) return
    gsap.fromTo(priceRef.current,
      { textShadow: '0 0 0px rgba(99,102,241,0)' },
      { textShadow: '0 0 24px rgba(99,102,241,0.5)', duration: 1.2,
        repeat: -1, yoyo: true, ease: 'sine.inOut' }
    )
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --pd-bg:      #07071a;
          --pd-surface: rgba(255,255,255,0.045);
          --pd-border:  rgba(255,255,255,0.08);
          --pd-accent:  #6366f1;
          --pd-cyan:    #22d3ee;
          --pd-muted:   rgba(255,255,255,0.38);
          --pd-text:    rgba(255,255,255,0.82);
          --pd-sub:     rgba(255,255,255,0.5);
        }

        .pd-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        /* ── product name ── */
        .pd-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          letter-spacing: -0.02em;
        }

        /* ── meta row ── */
        .pd-meta {
          display: flex;
          align-items: center;
          gap: .5rem;
          flex-wrap: wrap;
        }
        .pd-chip {
          display: inline-flex;
          align-items: center;
          gap: .35rem;
          padding: .28rem .75rem;
          border-radius: 20px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.22);
          font-size: .75rem;
          font-weight: 600;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: #a5b4fc;
        }
        .pd-chip svg { width: 11px; height: 11px; }
        .pd-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--pd-muted);
        }

        /* ── divider ── */
        .pd-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--pd-accent), rgba(34,211,238,0.4), transparent);
          opacity: .25;
        }

        /* ── price ── */
        .pd-price-wrap {
          display: flex;
          align-items: baseline;
          gap: .5rem;
        }
        .pd-price {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .pd-price-label {
          font-size: .72rem;
          color: var(--pd-muted);
          letter-spacing: .08em;
          text-transform: uppercase;
          font-family: 'Syne', sans-serif;
        }

        /* ── rating row ── */
        .pd-stars {
          display: flex;
          align-items: center;
          gap: .25rem;
        }
        .pd-star { color: #fbbf24; width: 14px; height: 14px; }
        .pd-rating-text {
          font-size: .75rem;
          color: var(--pd-muted);
          margin-left: .35rem;
        }

        /* ── description ── */
        .pd-desc {
          font-size: .9rem;
          color: var(--pd-sub);
          line-height: 1.75;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: .9rem 1rem;
          background: var(--pd-surface);
          border: 1px solid var(--pd-border);
          border-radius: 12px;
        }

        /* ── quantity row ── */
        .pd-qty-row {
          display: flex;
          align-items: center;
          gap: .75rem;
        }
        .pd-qty-label {
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--pd-muted);
          font-family: 'Syne', sans-serif;
          white-space: nowrap;
        }
        .pd-qty-input {
          width: 72px;
          padding: .45rem .6rem;
          background: var(--pd-surface);
          border: 1px solid var(--pd-border);
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem;
          font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .pd-qty-input:focus {
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }
        .pd-qty-input::-webkit-inner-spin-button { opacity: 0.4; }

        /* ── add to cart button ── */
        .pd-atc-btn {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          padding: .72rem 1.8rem;
          border-radius: 13px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: .92rem;
          font-weight: 700;
          letter-spacing: .03em;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 22px rgba(99,102,241,.45);
          transition: box-shadow .2s, opacity .2s;
        }
        .pd-atc-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.16), transparent);
          opacity: 0;
          transition: opacity .2s;
        }
        .pd-atc-btn:hover { box-shadow: 0 6px 32px rgba(99,102,241,.65); }
        .pd-atc-btn:hover::after { opacity: 1; }

        /* badge strip */
        .pd-badges {
          display: flex;
          gap: .5rem;
          flex-wrap: wrap;
        }
        .pd-badge {
          display: inline-flex; align-items: center; gap: .3rem;
          padding: .22rem .65rem; border-radius: 20px;
          font-size: .68rem; font-weight: 600; letter-spacing: .06em;
          text-transform: uppercase;
        }
        .pd-badge-green {
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.25);
          color: #86efac;
        }
        .pd-badge-blue {
          background: rgba(34,211,238,.1);
          border: 1px solid rgba(34,211,238,.22);
          color: #67e8f9;
        }
      `}</style>

      <div className="pd-root" ref={rootRef}>

        {/* Product name */}
        <h1 className="pd-name" ref={nameRef}>{product.productName}</h1>

        {/* Category + Brand chips */}
        <div className="pd-meta" ref={metaRef}>
          <span className="pd-chip"><Layers /> {product.category}</span>
          <span className="pd-dot" />
          <span className="pd-chip"><Tag /> {product.brand}</span>
        </div>

        {/* Stars row */}
        <div className="pd-stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="pd-star" fill={i < 4 ? '#fbbf24' : 'none'} />
          ))}
          <span className="pd-rating-text">4.0 · 128 reviews</span>
        </div>

        {/* Divider */}
        <div className="pd-divider" ref={divRef} />

        {/* Price */}
        <div className="pd-price-wrap" ref={priceRef}>
          <span className="pd-price">₹{product.productPrice}</span>
          <span className="pd-price-label">Incl. taxes</span>
        </div>

        {/* Trust badges */}
        <div className="pd-badges">
          <span className="pd-badge pd-badge-green">✓ In Stock</span>
          <span className="pd-badge pd-badge-blue">⚡ Fast Delivery</span>
        </div>

        {/* Description */}
        <p className="pd-desc" ref={descRef}>{product.productDesc}</p>

        {/* Quantity */}
        <div className="pd-qty-row" ref={qtyRef}>
          <span className="pd-qty-label">Qty</span>
          <Input
            type="number"
            className="pd-qty-input"
            defaultValue={1}
          />
        </div>

        {/* Add to cart */}
        <button
          ref={btnRef}
          className="pd-atc-btn"
          onClick={() => addtocart(product._id)}
          onMouseEnter={btnIn}
          onMouseLeave={btnOut}
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

      </div>
    </>
  )
}

export default ProdocutDesc