import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Trash2, Plus, Minus, Package, Truck, Shield, RotateCcw, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const accessToken = localStorage.getItem('accessToken')

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 2000 ? 0 : 10
  const tax      = Math.floor(subtotal * 0.05)
  const total    = subtotal + tax + shipping

  const getAllData = async () => {
    try {
      const res = await axios.get('https://shopping-ekart-backend.onrender.comapi/v1/cart/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) dispatch(setCart(res.data.cart))
    } catch (error) { console.log(error) }
  }

  useEffect(() => { getAllData() }, [])

  const handleUpdateQuantity = async (productId, type) => {
    if (!productId) return
    try {
      const res = await axios.put('https://shopping-ekart-backend.onrender.comapi/v1/cart/update',
        { productId, type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.data.success) dispatch(setCart(res.data.cart))
    } catch (error) { console.log(error) }
  }

  const handleRemove = async productId => {
    if (!productId) return
    try {
      const res = await axios.delete('https://shopping-ekart-backend.onrender.comapi/v1/cart/remove', {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setCart(res.data.cart))
      }
    } catch (error) { console.log(error) }
  }

  /* ── refs ── */
  const pageRef     = useRef(null)
  const titleRef    = useRef(null)
  const itemRefs    = useRef([])
  const summaryRef  = useRef(null)
  const emptyRef    = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cart?.items?.length > 0) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.fromTo(titleRef.current,
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
        .fromTo(summaryRef.current,
          { opacity: 0, x: 32 },
          { opacity: 1, x: 0, duration: 0.6 }, '-=0.35'
        )

        itemRefs.current.filter(Boolean).forEach((item, i) => {
          gsap.fromTo(item,
            { opacity: 0, x: -24, scale: 0.97 },
            {
              opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 92%' },
              delay: i * 0.07,
            }
          )
        })
      } else if (emptyRef.current) {
        gsap.fromTo(emptyRef.current,
          { opacity: 0, scale: 0.88, y: 24 },
          { opacity: 1, scale: 1,    y: 0, duration: 0.6, ease: 'back.out(1.6)' }
        )
      }
    }, pageRef)
    return () => ctx.revert()
  }, [cart?.items?.length])

  /* ── hover helpers ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -3, scale: 1.008, duration: 0.2, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.2, ease: 'power2.in'  })
  const btnIn   = e => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.16, ease: 'back.out(2)' })
  const btnOut  = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.16, ease: 'power2.in'   })
  const bigBtnIn  = e => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.17, ease: 'power2.out' })
  const bigBtnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const imgIn   = e => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.25, ease: 'power2.out' })
  const imgOut  = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.25, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ct-bg:      #05050f;
          --ct-card:    rgba(9,9,28,0.94);
          --ct-surface: rgba(255,255,255,0.04);
          --ct-border:  rgba(255,255,255,0.08);
          --ct-accent:  #6366f1;
          --ct-cyan:    #22d3ee;
          --ct-muted:   rgba(255,255,255,0.35);
          --ct-text:    rgba(255,255,255,0.82);
          --ct-sub:     rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .ct-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--ct-bg);
          background-image:
            radial-gradient(ellipse 65% 50% at 85% 0%,   rgba(99,102,241,.1),  transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 100%, rgba(34,211,238,.07), transparent 55%);
          padding: 6rem 1.5rem 5rem;
        }

        .ct-inner {
          max-width: 1200px; margin: 0 auto;
        }

        /* ── page title ── */
        .ct-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.4rem,3vw,2rem); font-weight: 800;
          color: #fff; letter-spacing: -.01em;
          display: flex; align-items: center; gap: .65rem;
          margin-bottom: 1.75rem;
        }
        .ct-title svg { color: var(--ct-accent); }

        /* ── layout ── */
        .ct-layout {
          display: flex; gap: 1.75rem; align-items: flex-start;
        }
        @media(max-width:900px){
          .ct-layout { flex-direction: column; }
          .ct-summary { width: 100% !important; }
        }

        /* ── item list ── */
        .ct-items { display: flex; flex-direction: column; gap: 1rem; flex: 1; }

        /* ── item card ── */
        .ct-item-card {
          background: var(--ct-card);
          border: 1px solid var(--ct-border);
          border-radius: 18px; overflow: hidden;
          position: relative;
          box-shadow: 0 4px 28px rgba(0,0,0,.45);
          transition: border-color .22s, box-shadow .22s;
        }
        .ct-item-card:hover {
          border-color: rgba(99,102,241,.28);
          box-shadow: 0 8px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.08);
        }
        /* shimmer top */
        .ct-item-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg, transparent, #6366f1 30%, #22d3ee 58%, transparent);
          background-size:220% 100%;
          animation:ct-line 4s linear infinite;
          opacity:0; transition:opacity .25s;
        }
        .ct-item-card:hover::before { opacity:1; }
        @keyframes ct-line {
          0%  { background-position:  220% 0 }
          100%{ background-position: -220% 0 }
        }

        .ct-item-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: .85rem 1.2rem; gap: 1rem; flex-wrap: wrap;
        }

        /* image + info */
        .ct-item-left {
          display: flex; align-items: center; gap: .85rem;
          min-width: 0; flex: 1;
        }
        .ct-img-wrap {
          width: 72px; height: 72px; flex-shrink: 0;
          border-radius: 12px; overflow: hidden;
          border: 1px solid var(--ct-border);
          background: var(--ct-surface);
        }
        .ct-img-wrap img {
          width:100%; height:100%; object-fit:cover; display:block;
          transition: transform .25s;
        }
        .ct-item-name {
          font-weight: 600; color: var(--ct-text);
          font-size: .9rem; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
          max-width: 220px;
        }
        .ct-item-price {
          font-size: .78rem; color: var(--ct-muted); margin-top: .15rem;
        }

        /* qty controls */
        .ct-qty-row {
          display: flex; align-items: center; gap: .6rem; flex-shrink: 0;
        }
        .ct-qty-btn {
          width: 30px; height: 30px; border-radius: 9px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--ct-border);
          color: var(--ct-text);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1rem; line-height: 1;
          transition: background .18s, border-color .18s;
        }
        .ct-qty-btn:hover {
          background: rgba(99,102,241,.18);
          border-color: rgba(99,102,241,.35);
        }
        .ct-qty-num {
          font-family: 'Syne', sans-serif;
          font-size: .95rem; font-weight: 700; color: #fff;
          min-width: 22px; text-align: center;
        }

        /* line total */
        .ct-line-total {
          font-family: 'Syne', sans-serif;
          font-size: .95rem; font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; white-space: nowrap; flex-shrink: 0;
        }

        /* remove btn */
        .ct-remove {
          display: flex; align-items: center; gap: .3rem;
          color: rgba(239,68,68,.7); font-size: .78rem; font-weight: 500;
          cursor: pointer; flex-shrink: 0;
          padding: .28rem .65rem; border-radius: 8px;
          border: 1px solid rgba(239,68,68,.15);
          background: rgba(239,68,68,.06);
          transition: background .18s, color .18s, border-color .18s;
        }
        .ct-remove:hover {
          background: rgba(239,68,68,.15);
          border-color: rgba(239,68,68,.35);
          color: #fca5a5;
        }

        /* ── SUMMARY PANEL ── */
        .ct-summary {
          width: 380px; flex-shrink: 0;
          background: var(--ct-card);
          border: 1px solid var(--ct-border);
          border-radius: 20px; overflow: hidden;
          position: relative;
          box-shadow: 0 8px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.05);
        }
        .ct-summary::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg,
            transparent, #6366f1 28%, #22d3ee 52%, #a78bfa 74%, transparent);
          background-size:240% 100%;
          animation:ct-shimmer 4.5s linear infinite;
        }
        @keyframes ct-shimmer {
          0%  { background-position: 240% 0 }
          100%{ background-position:-240% 0 }
        }
        .ct-summary::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background:radial-gradient(ellipse 55% 40% at 50% 0%, rgba(99,102,241,.07), transparent 55%);
        }
        .ct-summary > * { position:relative; z-index:1; }

        .ct-summary-inner { padding: 1.5rem; display: flex; flex-direction: column; gap: 0; }

        .ct-summary-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 800; color: #fff;
          display: flex; align-items: center; gap: .5rem;
          margin-bottom: 1.25rem;
        }

        .ct-sum-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: .88rem; color: var(--ct-sub); padding: .38rem 0;
        }
        .ct-sum-row.total {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 800; color: #fff;
          margin-top: .2rem;
        }
        .ct-sum-amount {
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; font-weight: 700;
        }

        .ct-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--ct-accent), rgba(34,211,238,.3), transparent);
          opacity: .15; margin: .75rem 0;
        }

        /* promo row */
        .ct-promo-row {
          display: flex; gap: .5rem; margin-bottom: .25rem;
        }
        .ct-promo-input {
          flex: 1; padding: .52rem .75rem;
          background: var(--ct-surface);
          border: 1px solid var(--ct-border);
          border-radius: 10px;
          color: var(--ct-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .84rem; outline: none;
          transition: border-color .2s;
        }
        .ct-promo-input::placeholder { color: var(--ct-muted); }
        .ct-promo-input:focus { border-color: rgba(99,102,241,.5); }
        .ct-promo-btn {
          padding: .52rem 1rem; border-radius: 10px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--ct-border);
          color: var(--ct-sub); font-size: .82rem; font-weight: 500;
          cursor: pointer; transition: background .18s, color .18s;
          white-space: nowrap;
        }
        .ct-promo-btn:hover {
          background: rgba(99,102,241,.14);
          border-color: rgba(99,102,241,.3);
          color: #a5b4fc;
        }

        /* action buttons */
        .ct-btn-place {
          width: 100%; padding: .7rem; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: .9rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          position: relative; overflow: hidden;
          transition: box-shadow .2s;
          margin-top: .85rem;
        }
        .ct-btn-place::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,.13), transparent);
          opacity:0; transition:opacity .2s;
        }
        .ct-btn-place:hover { box-shadow: 0 6px 30px rgba(99,102,241,.6); }
        .ct-btn-place:hover::after { opacity:1; }

        .ct-btn-continue {
          width: 100%; padding: .62rem; border-radius: 12px;
          background: var(--ct-surface);
          border: 1px solid var(--ct-border);
          color: var(--ct-sub); font-family: 'DM Sans', sans-serif;
          font-size: .88rem; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .18s, border-color .18s, color .18s;
          margin-top: .65rem; text-decoration: none;
        }
        .ct-btn-continue:hover {
          background: rgba(99,102,241,.1);
          border-color: rgba(99,102,241,.3);
          color: #c7d2fe;
        }

        /* perks */
        .ct-perks { display:flex; flex-direction:column; gap:.4rem; margin-top:1rem; }
        .ct-perk {
          display:flex; align-items:center; gap:.45rem;
          font-size:.74rem; color:var(--ct-muted);
        }
        .ct-perk svg { color:#34d399; flex-shrink:0; }

        /* ── EMPTY STATE ── */
        .ct-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 60vh; gap: 1rem;
        }
        .ct-empty-icon-wrap {
          width: 90px; height: 90px; border-radius: 50%;
          background: rgba(99,102,241,.12);
          border: 1px solid rgba(99,102,241,.25);
          display: flex; align-items: center; justify-content: center;
          animation: ct-float 3s ease-in-out infinite;
        }
        @keyframes ct-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .ct-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem; font-weight: 800; color: #fff;
        }
        .ct-empty-sub {
          font-size: .88rem; color: var(--ct-muted);
        }
        .ct-btn-shop {
          padding: .68rem 2rem; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: .9rem; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          transition: box-shadow .2s;
        }
        .ct-btn-shop:hover { box-shadow: 0 6px 30px rgba(99,102,241,.6); }
      `}</style>

      <div className="ct-page" ref={pageRef}>
        <div className="ct-inner">

          {cart?.items?.length > 0 ? (
            <>
              <h1 className="ct-title" ref={titleRef}>
                <ShoppingCart size={22} /> Shopping Cart
                <span style={{ fontSize: '.75rem', fontFamily: 'DM Sans', fontWeight: 500, color: 'rgba(255,255,255,.35)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                  — {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
                </span>
              </h1>

              <div className="ct-layout">
                {/* LEFT — items */}
                <div className="ct-items">
                  {cart.items
                    .filter(item => item.productId !== null)
                    .map((product, index) => (
                      <div
                        key={index}
                        className="ct-item-card"
                        ref={el => itemRefs.current[index] = el}
                        onMouseEnter={cardIn} onMouseLeave={cardOut}
                      >
                        <div className="ct-item-row">
                          {/* Image + name */}
                          <div className="ct-item-left">
                            <div className="ct-img-wrap"
                              onMouseEnter={imgIn} onMouseLeave={imgOut}>
                              <img src={product.productId.productImg?.[0]?.url} alt="" />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p className="ct-item-name">{product.productId.productName}</p>
                              <p className="ct-item-price">₹{product.productId.productPrice} each</p>
                            </div>
                          </div>

                          {/* Qty controls */}
                          <div className="ct-qty-row">
                            <button className="ct-qty-btn"
                              onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                              onMouseEnter={btnIn} onMouseLeave={btnOut}>
                              <Minus size={13} />
                            </button>
                            <span className="ct-qty-num">{product.quantity}</span>
                            <button className="ct-qty-btn"
                              onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                              onMouseEnter={btnIn} onMouseLeave={btnOut}>
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Line total */}
                          <span className="ct-line-total">
                            ₹{product.productId.productPrice * product.quantity}
                          </span>

                          {/* Remove */}
                          <div className="ct-remove"
                            onClick={() => handleRemove(product.productId._id)}>
                            <Trash2 size={13} /> Remove
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* RIGHT — summary */}
                <div className="ct-summary" ref={summaryRef}>
                  <div className="ct-summary-inner">
                    <p className="ct-summary-title"><Package size={16} /> Order Summary</p>

                    <div className="ct-sum-row">
                      <span>Subtotal ({cart.items.length} items)</span>
                      <span className="ct-sum-amount">₹{subtotal}</span>
                    </div>
                    <div className="ct-sum-row">
                      <span>Shipping</span>
                      <span className="ct-sum-amount">₹{shipping}</span>
                    </div>
                    <div className="ct-sum-row">
                      <span>Tax (5%)</span>
                      <span className="ct-sum-amount">₹{tax}</span>
                    </div>

                    <div className="ct-divider" />

                    <div className="ct-sum-row total">
                      <span>Total</span>
                      <span className="ct-sum-amount">₹{total}</span>
                    </div>

                    <div className="ct-divider" />

                    {/* Promo */}
                    <div className="ct-promo-row">
                      <input placeholder="Promo Code" className="ct-promo-input" />
                      <button className="ct-promo-btn"
                        onMouseEnter={bigBtnIn} onMouseLeave={bigBtnOut}>
                        <Tag size={12} style={{ display: 'inline', marginRight: 3 }} />Apply
                      </button>
                    </div>

                    {/* Place order */}
                    <button className="ct-btn-place"
                      onClick={() => navigate('/address')}
                      onMouseEnter={bigBtnIn} onMouseLeave={bigBtnOut}>
                      Place Order →
                    </button>

                    {/* Continue shopping */}
                    <Link to="/products" className="ct-btn-continue"
                      onMouseEnter={bigBtnIn} onMouseLeave={bigBtnOut}>
                      Continue Shopping
                    </Link>

                    {/* Perks */}
                    <div className="ct-perks">
                      <p className="ct-perk"><Truck    size={12} /> Free shipping on orders over ₹2000</p>
                      <p className="ct-perk"><RotateCcw size={12} /> 30-day return policy</p>
                      <p className="ct-perk"><Shield   size={12} /> Secure checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="ct-empty" ref={emptyRef}>
              <div className="ct-empty-icon-wrap">
                <ShoppingCart size={36} color="#6366f1" />
              </div>
              <h2 className="ct-empty-title">Your Cart is Empty</h2>
              <p className="ct-empty-sub">Looks like you haven't added anything yet.</p>
              <button className="ct-btn-shop"
                onClick={() => navigate('/products')}
                onMouseEnter={bigBtnIn} onMouseLeave={bigBtnOut}>
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart