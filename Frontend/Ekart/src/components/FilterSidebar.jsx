import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { gsap } from 'gsap'

const FilterSidebar = ({
  search, setSearch,
  category, setCategory,
  brand, setBrand,
  setPricerange, allProduct, priceRange
}) => {
  const Categories    = allProduct.map(p => p.category)
  const UniqueCategory = ['All', ...new Set(Categories)]
  const Brands        = allProduct.map(p => p.brand)
  const UniqueBrand   = ['All', ...new Set(Brands)]

  const handleCategoryClick = (val) => setCategory(val)
  const handleBrandChange   = (e)   => setBrand(e.target.value)

  const handleMinChange = (e) => {
    const value = Number(e.target.value)
    if (value <= priceRange[1]) setPricerange([value, priceRange[1]])
  }
  const handleMaxChange = (e) => {
    const value = Number(e.target.value)
    if (value >= priceRange[0]) setPricerange([priceRange[0], value])
  }

  const resetFilter = () => {
    setSearch('')
    setBrand('All')
    setCategory('All')
    setPricerange([0, 999999])
  }

  /* ── refs ── */
  const rootRef    = useRef(null)
  const sectRefs   = useRef([])
  const btnRef     = useRef(null)

  /* ── entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(rootRef.current,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
      )
      gsap.fromTo(sectRefs.current.filter(Boolean),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.25 }
      )
      gsap.fromTo(btnRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)', delay: 0.7 }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* ── hover helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })

  const radioIn  = e => gsap.to(e.currentTarget, { x: 3, duration: 0.15, ease: 'power2.out' })
  const radioOut = e => gsap.to(e.currentTarget, { x: 0, duration: 0.15, ease: 'power2.in'  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --fs-bg:      #09091e;
          --fs-surface: rgba(255,255,255,0.045);
          --fs-border:  rgba(255,255,255,0.08);
          --fs-accent:  #6366f1;
          --fs-cyan:    #22d3ee;
          --fs-muted:   rgba(255,255,255,0.4);
          --fs-text:    rgba(255,255,255,0.82);
        }

        .fs-root {
          font-family: 'DM Sans', sans-serif;
          margin-top: 2.5rem;
          width: 256px;
          flex-shrink: 0;
          display: none;
          flex-direction: column;
          gap: 0;
          background: var(--fs-bg);
          border: 1px solid var(--fs-border);
          border-radius: 18px;
          padding: 1.5rem 1.25rem 1.25rem;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 24px 64px rgba(0,0,0,0.55),
            0 0 40px rgba(99,102,241,0.06) inset;
          position: relative;
          overflow: hidden;
        }
        @media(min-width:768px){ .fs-root { display: flex; } }

        /* top glow line */
        .fs-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg,
            transparent, #6366f1 35%, #22d3ee 60%, transparent);
          background-size: 220% 100%;
          animation: fs-line 4s linear infinite;
        }
        @keyframes fs-line {
          0%   { background-position:  220% 0 }
          100% { background-position: -220% 0 }
        }

        /* ── section ── */
        .fs-section { display: flex; flex-direction: column; gap: 0; }

        /* ── heading ── */
        .fs-heading {
          font-family: 'Syne', sans-serif;
          font-size: .78rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--fs-muted);
          margin: 1.4rem 0 .65rem;
          display: flex; align-items: center; gap: .5rem;
        }
        .fs-heading::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--fs-accent), transparent);
          opacity: .3;
        }

        /* ── search ── */
        .fs-search-wrap {
          position: relative;
        }
        .fs-search-icon {
          position: absolute; left: .65rem; top: 50%; transform: translateY(-50%);
          color: var(--fs-muted); font-size: .85rem; pointer-events: none;
        }
        .fs-input {
          width: 100%; padding: .55rem .75rem .55rem 2rem;
          background: var(--fs-surface);
          border: 1px solid var(--fs-border);
          border-radius: 10px;
          color: var(--fs-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .84rem; outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .fs-input::placeholder { color: var(--fs-muted); }
        .fs-input:focus {
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }

        /* ── radio rows ── */
        .fs-radio-row {
          display: flex; align-items: center; gap: .6rem;
          padding: .32rem .4rem; border-radius: 8px;
          cursor: pointer;
          transition: background .18s;
        }
        .fs-radio-row:hover { background: rgba(255,255,255,.05); }

        .fs-radio {
          -webkit-appearance: none; appearance: none;
          width: 15px; height: 15px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.2);
          background: transparent; cursor: pointer;
          flex-shrink: 0;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .fs-radio:checked {
          border-color: var(--fs-accent);
          background: var(--fs-accent);
          box-shadow: 0 0 0 3px rgba(99,102,241,.25);
        }

        .fs-radio-label {
          font-size: .86rem; color: var(--fs-muted);
          cursor: pointer; transition: color .18s;
          user-select: none;
        }
        .fs-radio-row:hover .fs-radio-label { color: var(--fs-text); }

        /* ── select ── */
        .fs-select {
          width: 100%; padding: .55rem .75rem;
          background: var(--fs-surface);
          border: 1px solid var(--fs-border);
          border-radius: 10px;
          color: var(--fs-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .84rem; outline: none; cursor: pointer;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right .75rem center;
        }
        .fs-select:focus {
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }
        .fs-select option { background: #12122a; color: #fff; }

        /* ── price label ── */
        .fs-price-label {
          font-size: .82rem; color: var(--fs-muted);
          display: flex; justify-content: space-between;
          margin-bottom: .4rem;
        }
        .fs-price-label span { color: var(--fs-accent); font-weight: 600; }

        /* ── number inputs row ── */
        .fs-num-row { display: flex; gap: .5rem; margin-bottom: .55rem; }
        .fs-num {
          width: 100%; padding: .4rem .5rem;
          background: var(--fs-surface);
          border: 1px solid var(--fs-border);
          border-radius: 8px;
          color: var(--fs-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .8rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .fs-num:focus { border-color: rgba(99,102,241,.55); }
        .fs-num::-webkit-inner-spin-button { opacity: 0.4; }

        /* ── range sliders ── */
        .fs-range {
          width: 100%; height: 3px;
          -webkit-appearance: none; appearance: none;
          background: rgba(255,255,255,.1);
          border-radius: 4px; outline: none; margin: .2rem 0;
          cursor: pointer;
        }
        .fs-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(99,102,241,.6);
          transition: transform .15s;
        }
        .fs-range::-webkit-slider-thumb:hover { transform: scale(1.2); }

        /* ── reset button ── */
        .fs-reset {
          margin-top: 1.4rem; width: 100%;
          padding: .6rem 1rem; border-radius: 11px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: .88rem; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 3px 18px rgba(99,102,241,.4);
          transition: box-shadow .2s, opacity .2s;
        }
        .fs-reset:hover { box-shadow: 0 5px 26px rgba(99,102,241,.62); opacity: .9; }
      `}</style>

      <div className="fs-root" ref={rootRef}>

        {/* ── SEARCH ── */}
        <div className="fs-section" ref={el => sectRefs.current[0] = el}>
          <p className="fs-heading">Search</p>
          <div className="fs-search-wrap">
            <span className="fs-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="fs-input"
            />
          </div>
        </div>

        {/* ── CATEGORY ── */}
        <div className="fs-section" ref={el => sectRefs.current[1] = el}>
          <p className="fs-heading">Category</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
            {UniqueCategory.map((item, index) => (
              <label key={index} className="fs-radio-row"
                onMouseEnter={radioIn} onMouseLeave={radioOut}>
                <input
                  type="radio"
                  name="category"
                  className="fs-radio"
                  checked={category === item}
                  onChange={() => handleCategoryClick(item)}
                />
                <span className="fs-radio-label">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── BRAND ── */}
        <div className="fs-section" ref={el => sectRefs.current[2] = el}>
          <p className="fs-heading">Brand</p>
          <select className="fs-select" value={brand} onChange={handleBrandChange}>
            {UniqueBrand.map((item, index) => (
              <option key={index} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* ── PRICE RANGE ── */}
        <div className="fs-section" ref={el => sectRefs.current[3] = el}>
          <p className="fs-heading">Price Range</p>
          <div className="fs-price-label">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
          <div className="fs-num-row">
            <input
              type="number" min="0" max="5000"
              value={priceRange[0]} onChange={handleMinChange}
              className="fs-num" placeholder="Min"
            />
            <input
              type="number" min="0" max="99999"
              value={priceRange[1]} onChange={handleMaxChange}
              className="fs-num" placeholder="Max"
            />
          </div>
          <input
            type="range" min="0" max="5000" step="100"
            className="fs-range" value={priceRange[0]} onChange={handleMinChange}
          />
          <input
            type="range" min="0" max="99999" step="100"
            className="fs-range" value={priceRange[1]} onChange={handleMaxChange}
          />
        </div>

        {/* ── RESET ── */}
        <button
          ref={btnRef}
          className="fs-reset"
          onClick={resetFilter}
          onMouseEnter={btnIn}
          onMouseLeave={btnOut}
        >
          Reset Filters
        </button>

      </div>
    </>
  )
}

export default FilterSidebar