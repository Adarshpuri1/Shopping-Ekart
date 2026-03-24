import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, setSelectedAddress } from '@/redux/productSlice'
import store from '@/redux/store'
import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { gsap } from 'gsap'
import { MapPin, ShoppingBag, Shield, RotateCcw, Truck, Plus, CreditCard } from 'lucide-react'

const Address = () => {
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: '', state: '',
    zip: '', country: '',
  })

  const { cart, address, selectedAddress } = useSelector(store => store.product)
  const [showForm, setShowForm] = useState(address?.length > 0 ? false : true)
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const accessToken = useSelector(store => store.user.token)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handlesave = () => { dispatch(addAddress(formData)); setShowForm(false) }

  const subtotal = cart.totalPrice
  const shipping = subtotal > 50 ? 0 : 10
  const tax      = parseFloat((subtotal * 0.05).toFixed(2))
  const total    = subtotal + shipping + tax

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`https://shopping-ekart-backend.onrender.comapi/v1/orders/create-order`, {
        products: cart?.items?.map(item => ({ productId: item.productId._id, quantity: item.quantity })),
        tax, shipping, amount: total, Currency: 'INR'
      }, { headers: { Authorization: `Bearer ${accessToken}` } })

      if (!data.success) return toast.error('Something went wrong')

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: 'Ekart',
        Description: 'Order Payment',
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`https://shopping-ekart-backend.onrender.comapi/v1/orders/verify`, response,
              { headers: { Authorization: `Bearer ${accessToken}` } })
            if (verifyRes.data.success) {
              toast.success('✅ Payment Successfull!')
              dispatch(setCart({ items: [], totalPrice: 0 }))
              navigate('/order-success')
            } else { toast.error('❌ Payment Verification failed') }
          } catch (error) { console.error(error) }
        },
        modal: {
          ondismiss: async function () {
            await axios.post(`https://shopping-ekart-backend.onrender.comapi/v1/orders/verify`,
              { razorpay_order_id: data.order.id, paymentFailed: true },
              { headers: { Authorization: `Bearer ${accessToken}` } })
            toast.error('Payment Cancelled')
          }
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
        theme: { color: '#6366f1' }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('Payment.failed', async function () {
        await axios.post(`https://shopping-ekart-backend.onrender.comapi/v1/orders/verify`,
          { razorpay_order_id: data.order.id, paymentFailed: true },
          { headers: { Authorization: `Bearer ${accessToken}` } })
        toast.error('Payment failed. Please try again')
      })
      rzp.open()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while processing payment')
    }
  }

  /* ── refs ── */
  const pageRef    = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const fieldRefs  = useRef([])
  const saveBtnRef = useRef(null)
  const addrRefs   = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(leftRef.current,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 0.65 }
      )
      .fromTo(rightRef.current,
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.65 }, '-=0.5'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── form fields stagger ── */
  useEffect(() => {
    if (!showForm) return
    gsap.fromTo(fieldRefs.current.filter(Boolean),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power3.out', delay: 0.15 }
    )
    if (saveBtnRef.current) {
      gsap.fromTo(saveBtnRef.current,
        { opacity: 0, y: 10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.7 }
      )
    }
  }, [showForm])

  /* ── saved addresses stagger ── */
  useEffect(() => {
    if (showForm) return
    gsap.fromTo(addrRefs.current.filter(Boolean),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.45, ease: 'power3.out', delay: 0.2 }
    )
  }, [showForm, address?.length])

  /* ── hover helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })
  const addrIn  = e => gsap.to(e.currentTarget, { y: -3, duration: 0.18, ease: 'power2.out' })
  const addrOut = e => gsap.to(e.currentTarget, { y:  0, duration: 0.18, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ad-bg:      #05050f;
          --ad-card:    rgba(9,9,28,0.94);
          --ad-surface: rgba(255,255,255,0.04);
          --ad-border:  rgba(255,255,255,0.08);
          --ad-accent:  #6366f1;
          --ad-cyan:    #22d3ee;
          --ad-muted:   rgba(255,255,255,0.35);
          --ad-text:    rgba(255,255,255,0.82);
          --ad-sub:     rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .ad-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--ad-bg);
          background-image:
            radial-gradient(ellipse 65% 50% at 80% 0%,   rgba(99,102,241,.1),  transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 100%, rgba(34,211,238,.07), transparent 55%);
          padding: 3rem 1.5rem 5rem;
        }

        .ad-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }
        @media(max-width:900px){
          .ad-inner { grid-template-columns: 1fr; }
        }

        /* ── glass card shared ── */
        .ad-glass {
          background: var(--ad-card);
          border: 1px solid var(--ad-border);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.05);
        }
        .ad-glass::before {
          content: '';
          position: absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background: linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 55%, #a78bfa 75%, transparent);
          background-size: 240% 100%;
          animation: ad-line 4.5s linear infinite;
        }
        @keyframes ad-line {
          0%  { background-position:  240% 0 }
          100%{ background-position: -240% 0 }
        }
        .ad-glass::after {
          content: '';
          position: absolute; inset:0; pointer-events:none; z-index:0;
          background: radial-gradient(ellipse 55% 40% at 0% 0%, rgba(99,102,241,.07), transparent 55%);
        }
        .ad-glass > * { position: relative; z-index: 1; }

        /* ── section title ── */
        .ad-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 800; color: #fff;
          display: flex; align-items: center; gap: .55rem;
          margin-bottom: 1.4rem;
        }
        .ad-section-title svg { color: var(--ad-accent); }

        /* ── label ── */
        .ad-label {
          font-family: 'Syne', sans-serif;
          font-size: .68rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ad-muted);
          display: block; margin-bottom: .3rem;
        }

        /* ── input ── */
        .ad-input {
          width: 100%;
          padding: .58rem .85rem;
          background: var(--ad-surface);
          border: 1px solid var(--ad-border);
          border-radius: 10px;
          color: var(--ad-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .ad-input::placeholder { color: var(--ad-muted); }
        .ad-input:focus { border-color: rgba(99,102,241,.5); }

        /* field wrapper */
        .ad-field { display: flex; flex-direction: column; gap: .3rem; }

        /* 2-col grid */
        .ad-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
        @media(max-width:480px){ .ad-grid2 { grid-template-columns: 1fr; } }

        /* ── form wrapper ── */
        .ad-form { display: flex; flex-direction: column; gap: 1rem; }

        /* ── divider ── */
        .ad-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--ad-accent), rgba(34,211,238,.3), transparent);
          opacity: .15; margin: .25rem 0;
        }

        /* ── save btn ── */
        .ad-btn-primary {
          width: 100%; padding: .68rem 1.5rem; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: .9rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.4);
          position: relative; overflow: hidden;
          transition: box-shadow .2s, opacity .2s;
        }
        .ad-btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.13), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .ad-btn-primary:hover { box-shadow: 0 6px 30px rgba(99,102,241,.6); }
        .ad-btn-primary:hover::after { opacity: 1; }
        .ad-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

        /* outline btn */
        .ad-btn-outline {
          width: 100%; padding: .62rem 1.2rem; border-radius: 12px;
          background: var(--ad-surface);
          border: 1px solid var(--ad-border);
          color: var(--ad-sub);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .45rem;
          transition: background .2s, border-color .2s, color .2s;
        }
        .ad-btn-outline:hover {
          background: rgba(99,102,241,.1);
          border-color: rgba(99,102,241,.3);
          color: #c7d2fe;
        }

        /* ── saved address cards ── */
        .ad-addr-list { display: flex; flex-direction: column; gap: .75rem; margin-bottom: 1rem; }

        .ad-addr-card {
          border: 1.5px solid var(--ad-border);
          border-radius: 13px;
          padding: .9rem 1rem;
          cursor: pointer; position: relative;
          background: var(--ad-surface);
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .ad-addr-card:hover {
          background: rgba(99,102,241,.07);
          border-color: rgba(99,102,241,.3);
        }
        .ad-addr-card.selected {
          border-color: var(--ad-accent);
          background: rgba(99,102,241,.1);
          box-shadow: 0 0 0 3px rgba(99,102,241,.18);
        }
        .ad-addr-name {
          font-weight: 700; color: var(--ad-text); font-size: .9rem; margin-bottom: .15rem;
        }
        .ad-addr-detail {
          font-size: .78rem; color: var(--ad-muted); line-height: 1.6;
        }
        .ad-addr-delete {
          position: absolute; top: .65rem; right: .75rem;
          background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25);
          color: #fca5a5; font-size: .7rem; font-weight: 600;
          padding: .18rem .55rem; border-radius: 8px; cursor: pointer;
          transition: background .18s;
        }
        .ad-addr-delete:hover { background: rgba(239,68,68,.22); }

        .ad-selected-badge {
          display: inline-flex; align-items: center; gap: .25rem;
          font-size: .65rem; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: var(--ad-accent);
          margin-top: .35rem;
        }
        .ad-selected-badge::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--ad-accent); box-shadow: 0 0 6px var(--ad-accent);
        }

        /* ── order summary card ── */
        .ad-summary-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 800; color: #fff;
          display: flex; align-items: center; gap: .5rem;
          margin-bottom: 1.25rem;
        }

        .ad-summary-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: .88rem; color: var(--ad-sub);
          padding: .35rem 0;
        }
        .ad-summary-row.total {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 800; color: #fff;
          margin-top: .25rem;
        }
        .ad-summary-amount {
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; font-weight: 700;
        }

        .ad-perks { margin-top: 1.1rem; display: flex; flex-direction: column; gap: .45rem; }
        .ad-perk {
          display: flex; align-items: center; gap: .5rem;
          font-size: .76rem; color: var(--ad-muted);
        }
        .ad-perk svg { color: #34d399; flex-shrink: 0; }
      `}</style>

      <div className="ad-page" ref={pageRef}>
        <div className="ad-inner">

          {/* ── LEFT: Address form / saved addresses ── */}
          <div className="ad-glass" ref={leftRef}>
            <p className="ad-section-title"><MapPin size={18} /> Delivery Address</p>

            {showForm ? (
              <div className="ad-form">
                {/* Full name */}
                <div className="ad-field" ref={el => fieldRefs.current[0] = el}>
                  <span className="ad-label">Full Name</span>
                  <input id="fullName" name="fullName" required placeholder="John Doe"
                    value={formData.fullName} onChange={handleChange}
                    className="ad-input" onFocus={focIn} onBlur={focOut} />
                </div>
                {/* Phone */}
                <div className="ad-field" ref={el => fieldRefs.current[1] = el}>
                  <span className="ad-label">Phone Number</span>
                  <input id="phone" name="phone" required placeholder="+91..."
                    value={formData.phone} onChange={handleChange}
                    className="ad-input" onFocus={focIn} onBlur={focOut} />
                </div>
                {/* Email */}
                <div className="ad-field" ref={el => fieldRefs.current[2] = el}>
                  <span className="ad-label">Email</span>
                  <input id="email" name="email" required placeholder="example@gmail.com"
                    value={formData.email} onChange={handleChange}
                    className="ad-input" onFocus={focIn} onBlur={focOut} />
                </div>
                {/* Address */}
                <div className="ad-field" ref={el => fieldRefs.current[3] = el}>
                  <span className="ad-label">Address</span>
                  <input id="address" name="address" required placeholder="243 Street Area"
                    value={formData.address} onChange={handleChange}
                    className="ad-input" onFocus={focIn} onBlur={focOut} />
                </div>
                {/* City + State */}
                <div className="ad-grid2" ref={el => fieldRefs.current[4] = el}>
                  <div className="ad-field">
                    <span className="ad-label">City</span>
                    <input name="city" required placeholder="Dwarika"
                      value={formData.city} onChange={handleChange}
                      className="ad-input" onFocus={focIn} onBlur={focOut} />
                  </div>
                  <div className="ad-field">
                    <span className="ad-label">State</span>
                    <input name="state" required placeholder="Delhi"
                      value={formData.state} onChange={handleChange}
                      className="ad-input" onFocus={focIn} onBlur={focOut} />
                  </div>
                </div>
                {/* Zip + Country */}
                <div className="ad-grid2" ref={el => fieldRefs.current[5] = el}>
                  <div className="ad-field">
                    <span className="ad-label">Zip Code</span>
                    <input name="zip" required placeholder="110041"
                      value={formData.zip} onChange={handleChange}
                      className="ad-input" onFocus={focIn} onBlur={focOut} />
                  </div>
                  <div className="ad-field">
                    <span className="ad-label">Country</span>
                    <input name="country" required placeholder="India"
                      value={formData.country} onChange={handleChange}
                      className="ad-input" onFocus={focIn} onBlur={focOut} />
                  </div>
                </div>
                <div className="ad-divider" />
                <button
                  ref={saveBtnRef}
                  className="ad-btn-primary"
                  onClick={handlesave}
                  onMouseEnter={btnIn} onMouseLeave={btnOut}
                >
                  Save &amp; Continue →
                </button>
              </div>
            ) : (
              <div>
                <div className="ad-addr-list">
                  {address?.map((addr, index) => (
                    <div
                      key={index}
                      ref={el => addrRefs.current[index] = el}
                      className={`ad-addr-card${selectedAddress === index ? ' selected' : ''}`}
                      onClick={() => dispatch(setSelectedAddress(index))}
                      onMouseEnter={addrIn} onMouseLeave={addrOut}
                    >
                      <p className="ad-addr-name">{addr.fullName}</p>
                      <p className="ad-addr-detail">
                        {addr.phone} · {addr.email}<br />
                        {addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                      </p>
                      {selectedAddress === index && (
                        <p className="ad-selected-badge">Selected</p>
                      )}
                      <button
                        className="ad-addr-delete"
                        onClick={e => { e.stopPropagation(); dispatch(deleteAddress(index)) }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <button
                    className="ad-btn-outline"
                    onClick={() => setShowForm(true)}
                    onMouseEnter={btnIn} onMouseLeave={btnOut}
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                  <button
                    className="ad-btn-primary"
                    disabled={selectedAddress === null}
                    onClick={handlePayment}
                    onMouseEnter={btnIn} onMouseLeave={btnOut}
                  >
                    <CreditCard size={15} /> Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="ad-glass" ref={rightRef}>
            <p className="ad-summary-title"><ShoppingBag size={17} /> Order Summary</p>

            <div className="ad-summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span className="ad-summary-amount">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="ad-summary-row">
              <span>Shipping</span>
              <span className="ad-summary-amount">₹{shipping.toLocaleString('en-IN')}</span>
            </div>
            <div className="ad-summary-row">
              <span>Tax (5%)</span>
              <span className="ad-summary-amount">₹{tax}</span>
            </div>

            <div className="ad-divider" style={{ margin: '.85rem 0' }} />

            <div className="ad-summary-row total">
              <span>Total</span>
              <span className="ad-summary-amount">₹{total}</span>
            </div>

            <div className="ad-perks">
              <p className="ad-perk"><Truck size={13} /> Free shipping on orders over ₹299</p>
              <p className="ad-perk"><RotateCcw size={13} /> 30-day return policy</p>
              <p className="ad-perk"><Shield size={13} /> Secure checkout with SSL encryption</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Address