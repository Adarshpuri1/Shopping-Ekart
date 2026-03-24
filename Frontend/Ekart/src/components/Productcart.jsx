import React, { useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { setCart } from '@/redux/productSlice'
import { gsap } from 'gsap'

const Productcart = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product
  const accessToken = localStorage.getItem('accessToken')
  const dispatch    = useDispatch()
  const navigate    = useNavigate()

  const addToCart = async (productId) => {
    try {
      const res = await axios.post('https://shopping-ekart-backend.onrender.comapi/v1/cart/add', { productId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success('Product added to cart successfully')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      toast.error(Response.data.error)
    }
  }

  /* ── refs ── */
  const cardRef = useRef(null)
  const imgRef  = useRef(null)
  const infoRef = useRef(null)
  const btnRef  = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 22, scale: 0.96 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.55 }
      )
      .fromTo(infoRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.25'
      )
      .fromTo(btnRef.current,
        { opacity: 0, y: 8, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'back.out(1.8)' }, '-=0.2'
      )
    }, cardRef)
    return () => ctx.revert()
  }, [loading])

  /* ── card hover ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.22, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,    duration: 0.22, ease: 'power2.in'  })

  /* ── img hover ── */
  const imgIn  = () => gsap.to(imgRef.current, { scale: 1.08, duration: 0.35, ease: 'power2.out' })
  const imgOut = () => gsap.to(imgRef.current, { scale: 1,    duration: 0.35, ease: 'power2.in'  })

  /* ── btn hover ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })

  /* ── btn click ripple ── */
  const btnClick = (e) => {
    gsap.fromTo(e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.5)' }
    )
    addToCart(product._id)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --pc-bg:      #08081c;
          --pc-surface: rgba(255,255,255,0.04);
          --pc-border:  rgba(255,255,255,0.08);
          --pc-accent:  #6366f1;
          --pc-cyan:    #22d3ee;
          --pc-muted:   rgba(255,255,255,0.38);
          --pc-text:    rgba(255,255,255,0.88);
        }

        /* ── card shell ── */
        .pc-card {
          font-family: 'DM Sans', sans-serif;
          background: var(--pc-bg);
          border: 1px solid var(--pc-border);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 6px 32px rgba(0,0,0,0.45);
          transition: border-color .25s, box-shadow .25s;
          cursor: default;
          height: max-content;
        }
        .pc-card:hover {
          border-color: rgba(99,102,241,0.32);
          box-shadow: 0 12px 44px rgba(0,0,0,0.55),
                      0 0 0 1px rgba(99,102,241,0.1);
        }

        /* shimmer top line */
        .pc-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 35%, #22d3ee 60%, transparent);
          background-size: 220% 100%;
          animation: pc-line 4s linear infinite;
          opacity: 0;
          transition: opacity .25s;
        }
        .pc-card:hover::before { opacity: 1; }
        @keyframes pc-line {
          0%   { background-position:  220% 0 }
          100% { background-position: -220% 0 }
        }

        /* ── image wrapper ── */
        .pc-img-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          position: relative;
          background: rgba(255,255,255,0.03);
          cursor: pointer;
        }

        /* gradient overlay bottom of image */
        .pc-img-wrap::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
          background: linear-gradient(to top, var(--pc-bg), transparent);
          z-index: 1; pointer-events: none;
        }

        .pc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transform-origin: center;
        }

        /* ── skeleton overrides ── */
        .pc-skel-img {
          width: 100%; height: 100%;
          border-radius: 0;
          background: rgba(255,255,255,0.06);
        }
        .pc-skel-wrap { padding: .85rem .9rem; display: flex; flex-direction: column; gap: .5rem; }
        .pc-skel-line { background: rgba(255,255,255,0.06); border-radius: 6px; }

        /* ── info section ── */
        .pc-info {
          padding: .85rem .9rem .9rem;
          display: flex;
          flex-direction: column;
          gap: .5rem;
          position: relative; z-index: 2;
        }

        .pc-name {
          font-size: .88rem;
          font-weight: 500;
          color: var(--pc-text);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5rem;
        }

        .pc-price {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── add to cart btn ── */
        .pc-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          padding: .55rem .75rem;
          border-radius: 11px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: .82rem; font-weight: 700;
          letter-spacing: .03em;
          border: none; cursor: pointer;
          box-shadow: 0 3px 16px rgba(99,102,241,.4);
          position: relative; overflow: hidden;
          transition: box-shadow .2s, opacity .2s;
          margin-top: .1rem;
        }
        .pc-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .pc-btn:hover { box-shadow: 0 5px 24px rgba(99,102,241,.6); }
        .pc-btn:hover::after { opacity: 1; }
      `}</style>

      <div
        className="pc-card"
        ref={cardRef}
        onMouseEnter={cardIn}
        onMouseLeave={cardOut}
      >
        {/* Image */}
        <div
          className="pc-img-wrap"
          onMouseEnter={imgIn}
          onMouseLeave={imgOut}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {loading
            ? <Skeleton className="pc-skel-img" />
            : <img ref={imgRef} src={productImg[0]?.url} alt="" className="pc-img" />
          }
        </div>

        {/* Info */}
        {loading ? (
          <div className="pc-skel-wrap">
            <Skeleton className="pc-skel-line" style={{ width: '80%', height: 14 }} />
            <Skeleton className="pc-skel-line" style={{ width: '45%', height: 14 }} />
            <Skeleton className="pc-skel-line" style={{ width: '100%', height: 34, borderRadius: 10 }} />
          </div>
        ) : (
          <div className="pc-info" ref={infoRef}>
            <h1 className="pc-name">{productName}</h1>
            <h2 className="pc-price">₹{productPrice}</h2>
            <button
              ref={btnRef}
              className="pc-btn"
              onClick={btnClick}
              onMouseEnter={btnIn}
              onMouseLeave={btnOut}
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Productcart