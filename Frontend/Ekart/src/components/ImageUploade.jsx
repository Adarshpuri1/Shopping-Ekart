import { Label } from '@radix-ui/react-dropdown-menu'
import React, { useRef, useEffect } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X, UploadCloud, ImagePlus } from 'lucide-react'
import { gsap } from 'gsap'

const ImageUploade = ({ productData, setProductData }) => {

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }))
    }
  }

  const removeImage = (idx) => {
    setProductData((prev) => {
      const updatedImage = prev.productImg.filter((_, i) => i !== idx)
      return { ...prev, productImg: updatedImage }
    })
  }

  /* ── refs ── */
  const rootRef   = useRef(null)
  const labelRef  = useRef(null)
  const uploadRef = useRef(null)
  const gridRef   = useRef(null)
  const cardRefs  = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(labelRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.45 }
      )
      .fromTo(uploadRef.current,
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
        '-=0.2'
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* ── animate new cards in ── */
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.82, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.42, stagger: 0.07, ease: 'back.out(1.8)' }
    )
  }, [productData.productImg.length])

  /* ── upload btn hover ── */
  const upIn  = e => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.18, ease: 'power2.out' })
  const upOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.18, ease: 'power2.in'  })

  /* ── card hover ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -4, scale: 1.025, duration: 0.2, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.2, ease: 'power2.in'  })

  /* ── remove btn hover ── */
  const xIn  = e => { e.stopPropagation(); gsap.to(e.currentTarget, { scale: 1.2, rotate: 90, duration: 0.2 }) }
  const xOut = e => { e.stopPropagation(); gsap.to(e.currentTarget, { scale: 1,   rotate: 0,  duration: 0.2 }) }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --iu-bg:      #08081c;
          --iu-surface: rgba(255,255,255,0.04);
          --iu-border:  rgba(255,255,255,0.08);
          --iu-accent:  #6366f1;
          --iu-cyan:    #22d3ee;
          --iu-muted:   rgba(255,255,255,0.38);
          --iu-text:    rgba(255,255,255,0.82);
        }

        .iu-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ── label ── */
        .iu-label {
          font-family: 'Syne', sans-serif;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--iu-muted);
          display: flex;
          align-items: center;
          gap: .5rem;
        }
        .iu-label::after {
          content: '';
          flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--iu-accent), transparent);
          opacity: .3;
        }

        /* ── drop zone / upload button ── */
        .iu-upload-zone {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: .6rem;
          padding: 2rem 1.5rem;
          border-radius: 16px;
          border: 1.5px dashed rgba(99,102,241,.35);
          background: var(--iu-surface);
          cursor: pointer;
          transition: border-color .25s, background .25s, box-shadow .25s;
          overflow: hidden;
        }
        .iu-upload-zone::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 110%, rgba(99,102,241,.1), transparent 70%);
          pointer-events: none;
        }
        .iu-upload-zone:hover {
          border-color: rgba(99,102,241,.7);
          background: rgba(99,102,241,.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,.12), 0 8px 28px rgba(0,0,0,.35);
        }

        /* shimmer top line on zone */
        .iu-upload-zone::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1 40%, #22d3ee 60%, transparent);
          background-size: 220% 100%;
          animation: iu-line 3.5s linear infinite;
          opacity: .6;
        }
        @keyframes iu-line {
          0%   { background-position:  220% 0 }
          100% { background-position: -220% 0 }
        }

        .iu-upload-icon {
          color: var(--iu-accent);
          animation: iu-float 2.8s ease-in-out infinite;
        }
        @keyframes iu-float {
          0%,100% { transform: translateY(0);  }
          50%      { transform: translateY(-5px); }
        }

        .iu-upload-text {
          font-size: .88rem;
          font-weight: 500;
          color: var(--iu-text);
        }
        .iu-upload-sub {
          font-size: .75rem;
          color: var(--iu-muted);
        }
        .iu-upload-label {
          position: absolute; inset: 0;
          cursor: pointer;
        }

        /* ── grid ── */
        .iu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media(min-width:480px) { .iu-grid { grid-template-columns: repeat(3, 1fr); } }

        /* ── card ── */
        .iu-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--iu-border);
          background: var(--iu-surface);
          box-shadow: 0 4px 20px rgba(0,0,0,.4);
          cursor: default;
        }

        /* gradient overlay on card */
        .iu-card::before {
          content: '';
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 55%);
          pointer-events: none;
        }

        .iu-card img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          display: block;
          filter: brightness(.92) saturate(1.05);
          transition: filter .25s, transform .3s;
        }
        .iu-card:hover img {
          filter: brightness(1) saturate(1.1);
          transform: scale(1.04);
        }

        /* ── remove btn ── */
        .iu-remove {
          position: absolute;
          top: .45rem; right: .45rem;
          z-index: 5;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(0,0,0,.65);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.15);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          cursor: pointer;
          transition: opacity .2s, background .2s;
        }
        .iu-card:hover .iu-remove {
          opacity: 1;
        }
        .iu-remove:hover {
          background: rgba(239,68,68,.75);
          border-color: rgba(239,68,68,.5);
        }

        /* ── image count badge ── */
        .iu-count {
          font-size: .75rem;
          color: var(--iu-muted);
          text-align: right;
          padding-right: .1rem;
        }
        .iu-count span {
          color: var(--iu-accent);
          font-weight: 600;
        }
      `}</style>

      <div className="iu-root" ref={rootRef}>

        {/* Label */}
        <p className="iu-label" ref={labelRef}>
          <ImagePlus size={13} />
          Product Images
        </p>

        {/* Hidden file input */}
        <Input
          type="file"
          id="file-Uploade"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFiles}
        />

        {/* Upload zone */}
        <div
          className="iu-upload-zone"
          ref={uploadRef}
          onMouseEnter={upIn}
          onMouseLeave={upOut}
        >
          <UploadCloud size={32} className="iu-upload-icon" />
          <p className="iu-upload-text">Click to upload images</p>
          <p className="iu-upload-sub">PNG, JPG, WEBP — multiple allowed</p>
          <label htmlFor="file-Uploade" className="iu-upload-label" />
        </div>

        {/* Image count */}
        {productData.productImg.length > 0 && (
          <p className="iu-count">
            <span>{productData.productImg.length}</span> image{productData.productImg.length !== 1 ? 's' : ''} selected
          </p>
        )}

        {/* Preview grid */}
        {productData.productImg.length > 0 && (
          <div className="iu-grid" ref={gridRef}>
            {productData.productImg.map((file, idx) => {
              let preview
              if (file instanceof File)        preview = URL.createObjectURL(file)
              else if (typeof file === 'string') preview = file
              else if (file?.url)               preview = file.url
              else                               return null

              return (
                <div
                  key={idx}
                  className="iu-card"
                  ref={el => cardRefs.current[idx] = el}
                  onMouseEnter={cardIn}
                  onMouseLeave={cardOut}
                >
                  <img src={preview} alt="" />
                  <button
                    className="iu-remove"
                    onClick={() => removeImage(idx)}
                    onMouseEnter={xIn}
                    onMouseLeave={xOut}
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}

export default ImageUploade