import Breadcrums from '@/components/Breadcrums'
import ProdocutDesc from '@/components/ProdocutDesc'
import ProductImg from '@/components/ProductImg'
import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'

const SingleProduct = () => {
  const params    = useParams()
  const productId = params.id
  const { products } = useSelector(store => store.product)
  const product   = products.find(p => p._id === productId)

  /* ── refs ── */
  const pageRef   = useRef(null)
  const breadRef  = useRef(null)
  const imgRef    = useRef(null)
  const descRef   = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    if (!product) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(breadRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(imgRef.current,
        { opacity: 0, x: -32, scale: 0.96 },
        { opacity: 1, x: 0,   scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.3'
      )
      .fromTo(descRef.current,
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.65 }, '-=0.5'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [product])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sp-bg:     #05050f;
          --sp-border: rgba(255,255,255,0.07);
        }

        .sp-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--sp-bg);
          background-image:
            radial-gradient(ellipse 65% 50% at 85% 5%,   rgba(99,102,241,.09), transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 95%,  rgba(34,211,238,.06), transparent 55%);
          padding: 7.5rem 1.5rem 4rem;
        }

        .sp-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* breadcrumb wrapper */
        .sp-breadcrumb { margin-bottom: 2rem; }

        /* product layout */
        .sp-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media(max-width: 768px) {
          .sp-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      <div className="sp-page" ref={pageRef}>
        <div className="sp-inner">

          {/* Breadcrumbs */}
          <div className="sp-breadcrumb" ref={breadRef}>
            <Breadcrums product={product} />
          </div>

          {/* Product layout */}
          <div className="sp-layout">
            <div ref={imgRef}>
              <ProductImg image={product.productImg} />
            </div>
            <div ref={descRef}>
              <ProdocutDesc product={product} />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default SingleProduct