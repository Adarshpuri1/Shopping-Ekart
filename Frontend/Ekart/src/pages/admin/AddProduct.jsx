import ImageUploade from '@/components/ImageUploade'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { Loader2, PackagePlus, Sparkles } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { gsap } from 'gsap'

const AddProduct = () => {
  const [productData, setProductData] = useState({
    productName: '',
    productPrice: 0,
    productDesc: '',
    productImg: [],
    brand: '',
    category: ''
  })

  const accessToken = localStorage.getItem('accessToken')
  const dispatch    = useDispatch()
  const { products } = useSelector(store => store.product)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('productName',  productData.productName)
    form.append('productPrice', productData.productPrice)
    form.append('productDesc',  productData.productDesc)
    form.append('category',     productData.category)
    form.append('brand',        productData.brand)

    if (productData.productImg.length === 0) {
      toast.error('Uploade img please')
      return
    }

    productData.productImg.forEach(img => form.append('files', img))

    try {
      setLoading(true)
      const res = await axios.post('https://shopping-ekart.vercel.app/v1/product/add', form, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  /* ── refs ── */
  const pageRef   = useRef(null)
  const cardRef   = useRef(null)
  const headerRef = useRef(null)
  const fieldRefs = useRef([])
  const btnRef    = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.7 }
      )
      .fromTo(headerRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.4'
      )
      .fromTo(fieldRefs.current.filter(Boolean),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.42 }, '-=0.3'
      )
      .fromTo(btnRef.current,
        { opacity: 0, y: 12, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.15'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── btn hover ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })

  /* ── input focus glow ── */
  const inputFocus = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const inputBlur  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ap-bg:       #05050f;
          --ap-card:     #09091f;
          --ap-surface:  rgba(255,255,255,0.04);
          --ap-border:   rgba(255,255,255,0.08);
          --ap-accent:   #6366f1;
          --ap-cyan:     #22d3ee;
          --ap-muted:    rgba(255,255,255,0.35);
          --ap-text:     rgba(255,255,255,0.82);
          --ap-sub:      rgba(255,255,255,0.5);
        }

        /* ── page wrapper ── */
        .ap-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--ap-bg);
          background-image:
            radial-gradient(ellipse 70% 50% at 70% 0%,   rgba(99,102,241,.1), transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 100%, rgba(34,211,238,.07), transparent 55%);
        }
        @media(max-width:768px){
          .ap-page { padding-left: 1rem; padding-top: 4rem; padding-right: 1rem; }
        }

        /* ── card ── */
        .ap-card {
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          background: var(--ap-card);
          border: 1px solid var(--ap-border);
          border-radius: 22px;
          box-shadow:
            0 0 0 1px rgba(99,102,241,.06),
            0 24px 72px rgba(0,0,0,.6);
          position: relative;
          overflow: hidden;
        }

        /* shimmer top */
        .ap-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 55%, #a78bfa 75%, transparent);
          background-size: 240% 100%;
          animation: ap-shimmer 4.5s linear infinite;
        }
        @keyframes ap-shimmer {
          0%   { background-position:  240% 0 }
          100% { background-position: -240% 0 }
        }

        /* corner mesh glow */
        .ap-card::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 60% 40% at 0% 0%, rgba(99,102,241,.09), transparent 55%),
            radial-gradient(ellipse 45% 35% at 100% 100%, rgba(34,211,238,.06), transparent 50%);
        }
        .ap-card > * { position: relative; z-index: 1; }

        /* ── header ── */
        .ap-header {
          padding: 1.75rem 2rem 1.25rem;
          border-bottom: 1px solid var(--ap-border);
        }
        .ap-header-row {
          display: flex; align-items: center; gap: .75rem; margin-bottom: .3rem;
        }
        .ap-header-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,.15);
          border: 1px solid rgba(99,102,241,.28);
          color: #a5b4fc;
        }
        .ap-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem; font-weight: 800; color: #fff;
          letter-spacing: -.01em;
        }
        .ap-subtitle {
          font-size: .82rem; color: var(--ap-muted);
          margin-left: calc(38px + .75rem);
        }

        /* ── content ── */
        .ap-content {
          padding: 1.75rem 2rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        @media(max-width:480px){ .ap-content { padding: 1.25rem; } }

        /* ── field group ── */
        .ap-field {
          display: flex; flex-direction: column; gap: .45rem;
        }
        .ap-label {
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ap-muted);
        }

        /* ── inputs ── */
        .ap-input, .ap-textarea {
          width: 100%;
          padding: .6rem .85rem;
          background: var(--ap-surface);
          border: 1px solid var(--ap-border);
          border-radius: 11px;
          color: var(--ap-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .ap-input::placeholder, .ap-textarea::placeholder { color: var(--ap-muted); }
        .ap-input:focus, .ap-textarea:focus {
          border-color: rgba(99,102,241,.55);
        }
        .ap-textarea {
          min-height: 100px; resize: vertical; line-height: 1.6;
        }

        /* ── 2-col grid ── */
        .ap-grid2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        @media(max-width:480px){ .ap-grid2 { grid-template-columns: 1fr; } }

        /* ── divider ── */
        .ap-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--ap-accent), rgba(34,211,238,.3), transparent);
          opacity: .18;
        }

        /* ── submit button ── */
        .ap-submit {
          width: 100%;
          padding: .72rem 1.5rem;
          border-radius: 13px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: .92rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .55rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          position: relative; overflow: hidden;
          transition: box-shadow .2s, opacity .2s;
        }
        .ap-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.14), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .ap-submit:hover:not(:disabled) { box-shadow: 0 6px 30px rgba(99,102,241,.62); }
        .ap-submit:hover:not(:disabled)::after { opacity: 1; }
        .ap-submit:disabled { opacity: .65; cursor: not-allowed; }

        .ap-footer {
          padding: 0 2rem 1.75rem;
        }
        @media(max-width:480px){ .ap-footer { padding: 0 1.25rem 1.25rem; } }
      `}</style>

      <div className="ap-page" ref={pageRef}>
        <div className="ap-card" ref={cardRef}>

          {/* Header */}
          <div className="ap-header" ref={headerRef}>
            <div className="ap-header-row">
              <div className="ap-header-icon"><PackagePlus size={18} /></div>
              <h2 className="ap-title">Add Product</h2>
            </div>
            <p className="ap-subtitle">Enter product details below to list a new item</p>
          </div>

          {/* Fields */}
          <div className="ap-content">

            {/* Product Name */}
            <div className="ap-field" ref={el => fieldRefs.current[0] = el}>
              <Label className="ap-label">Product Name</Label>
              <Input
                type="text" name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="e.g. iPhone 15 Pro"
                required
                className="ap-input"
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Price */}
            <div className="ap-field" ref={el => fieldRefs.current[1] = el}>
              <Label className="ap-label">Price (₹)</Label>
              <Input
                type="number" name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                required
                className="ap-input"
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Brand + Category */}
            <div className="ap-grid2" ref={el => fieldRefs.current[2] = el}>
              <div className="ap-field">
                <Label className="ap-label">Brand</Label>
                <Input
                  type="text" name="brand"
                  placeholder="e.g. Apple"
                  value={productData.brand}
                  onChange={handleChange}
                  required
                  className="ap-input"
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
              <div className="ap-field">
                <Label className="ap-label">Category</Label>
                <Input
                  type="text" name="category"
                  placeholder="e.g. Mobile"
                  value={productData.category}
                  onChange={handleChange}
                  required
                  className="ap-input"
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div className="ap-field" ref={el => fieldRefs.current[3] = el}>
              <Label className="ap-label">Description</Label>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter a brief description of the product..."
                className="ap-textarea"
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Divider */}
            <div className="ap-divider" ref={el => fieldRefs.current[4] = el} />

            {/* Image upload */}
            <div ref={el => fieldRefs.current[5] = el}>
              <ImageUploade productData={productData} setProductData={setProductData} />
            </div>

          </div>

          {/* Footer / Submit */}
          <div className="ap-footer">
            <button
              ref={btnRef}
              disabled={loading}
              onClick={submitHandler}
              className="ap-submit"
              onMouseEnter={btnIn}
              onMouseLeave={btnOut}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Please wait…</>
                : <><Sparkles size={15} /> Add Product</>
              }
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default AddProduct