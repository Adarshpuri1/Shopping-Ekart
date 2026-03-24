import React, { useEffect, useState, useRef } from 'react'
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import Productcart from '@/components/Productcart'
import FilterSidebar from '@/components/FilterSidebar.jsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SlidersHorizontal, Package } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Product = () => {
  /* ── state (unchanged) ── */
  const [allProduct, setAllProduct] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [priceRange, setPricerange] = useState([0, 9999999])
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('All')
  const [brand,      setBrand]      = useState('All')
  const [sortOrder,  setSortOrder]  = useState('')

  const { products } = useSelector(state => state.product)
  const dispatch = useDispatch()

  /* ── fetch ── */
  const getAllData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('https://shopping-ekart.vercel.app/v1/product/getallproducts')
      if (res.data.success) {
        setAllProduct(res.data.Products)
        dispatch(setProducts(res.data.Products))
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ── filter + sort (unchanged) ── */
  useEffect(() => {
    if (allProduct.length === 0) return
    let filtered = [...allProduct]
    if (search.trim() !== '')
      filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'All')
      filtered = filtered.filter(p => p.category === category)
    if (brand !== 'All')
      filtered = filtered.filter(p => p.brand === brand)
    filtered = filtered.filter(p => {
      const price = Number(p.productPrice)
      return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1]
    })
    if (sortOrder === 'lowtoHigh')  filtered.sort((a,b) => a.productPrice - b.productPrice)
    if (sortOrder === 'hightoLow')  filtered.sort((a,b) => b.productPrice - a.productPrice)
    dispatch(setProducts(filtered))
  }, [search, category, brand, priceRange, sortOrder, allProduct, dispatch])

  useEffect(() => { getAllData() }, [])

  /* ── refs ── */
  const pageRef    = useRef(null)
  const toolbarRef = useRef(null)
  const gridRef    = useRef(null)
  const cardRefs   = useRef([])

  /* ── toolbar entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(toolbarRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── product cards stagger on filter change ── */
  useEffect(() => {
    if (loading) return
    cardRefs.current = []                    // reset so new refs get registered
    // small timeout lets React re-render first
    const id = setTimeout(() => {
      cardRefs.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 22, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.42, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: card, start: 'top 96%' },
            delay: i * 0.04,
          }
        )
      })
    }, 60)
    return () => clearTimeout(id)
  }, [products.length, loading])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --pr-bg:      #05050f;
          --pr-surface: rgba(255,255,255,0.04);
          --pr-border:  rgba(255,255,255,0.08);
          --pr-accent:  #6366f1;
          --pr-cyan:    #22d3ee;
          --pr-muted:   rgba(255,255,255,0.35);
          --pr-text:    rgba(255,255,255,0.82);
        }

        /* ── page ── */
        .pr-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--pr-bg);
          background-image:
            radial-gradient(ellipse 60% 40% at 85% 5%,   rgba(99,102,241,.09), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 95%,  rgba(34,211,238,.06), transparent 55%);
          padding-top: 6.5rem;
          padding-bottom: 3rem;
        }

        .pr-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          gap: 1.75rem;
          align-items: flex-start;
        }

        /* ── right content column ── */
        .pr-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        /* ── toolbar row ── */
        .pr-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.4rem;
          flex-wrap: wrap;
          gap: .75rem;
        }

        .pr-count {
          display: inline-flex; align-items: center; gap: .45rem;
          font-family: 'Syne', sans-serif;
          font-size: .72rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--pr-muted);
        }
        .pr-count svg { color: var(--pr-accent); }
        .pr-count-num {
          color: var(--pr-accent); font-size: .88rem;
        }

        /* sort select */
        .pr-sort-trigger {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid var(--pr-border) !important;
          border-radius: 11px !important;
          color: var(--pr-text) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: .86rem !important;
          min-width: 180px;
          display: flex; align-items: center; gap: .4rem;
        }

        /* ── product grid ── */
        .pr-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.1rem;
        }
        @media(max-width:1200px){ .pr-grid { grid-template-columns: repeat(4, 1fr); } }
        @media(max-width:960px) { .pr-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(max-width:640px) { .pr-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width:400px) { .pr-grid { grid-template-columns: 1fr; } }

        /* card wrapper for GSAP ref */
        .pr-card-wrap { display: contents; }

        /* ── empty state ── */
        .pr-empty {
          grid-column: 1 / -1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 5rem 2rem;
          border: 1.5px dashed var(--pr-border);
          border-radius: 20px;
          background: var(--pr-surface);
        }
        .pr-empty-icon { color: var(--pr-muted); }
        .pr-empty-text { font-size: .9rem; color: var(--pr-muted); }
      `}</style>

      <div className="pr-page" ref={pageRef}>
        <div className="pr-inner">

          {/* Filter Sidebar — unchanged */}
          <FilterSidebar
            allProduct={allProduct}
            priceRange={priceRange}
            setPricerange={setPricerange}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            search={search}
            setSearch={setSearch}
          />

          {/* Main content */}
          <div className="pr-main">

            {/* Toolbar */}
            <div className="pr-toolbar" ref={toolbarRef}>
              <p className="pr-count">
                <Package size={14} />
                <span className="pr-count-num">{products.length}</span>
                product{products.length !== 1 ? 's' : ''} found
              </p>

              <Select onValueChange={value => setSortOrder(value)}>
                <SelectTrigger className="pr-sort-trigger">
                  <SlidersHorizontal size={13} style={{ opacity: .6 }} />
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lowtoHigh">Price: Low to High</SelectItem>
                    <SelectItem value="hightoLow">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            <div className="pr-grid" ref={gridRef}>
              {products.length === 0 && !loading ? (
                <div className="pr-empty">
                  <Package size={40} className="pr-empty-icon" />
                  <p className="pr-empty-text">No products match your filters.</p>
                </div>
              ) : (
                products.map((product, i) => (
                  <div
                    key={product._id}
                    ref={el => cardRefs.current[i] = el}
                  >
                    <Productcart product={product} loading={loading} />
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Product