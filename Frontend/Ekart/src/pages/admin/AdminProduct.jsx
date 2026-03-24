import { Input } from '@/components/ui/input'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setProducts } from '@/redux/productSlice'
import { toast } from 'sonner'
import { Edit, Search, Trash2, PackageSearch, SlidersHorizontal } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUploade from '@/components/ImageUploade'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AdminProduct = () => {
  const [editProduct, setEditProduct] = useState({
    productName: '', productPrice: '', brand: '',
    category: '', productDesc: '', productImg: []
  })

  const { products }  = useSelector(store => store.product)
  const accessToken   = localStorage.getItem('accessToken')
  const dispatch      = useDispatch()
  const [open, setOpen]           = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder,  setSortOrder]  = useState('')

  /* ── filter + sort (unchanged logic) ── */
  let filterProducts = products.filter(p =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  if (sortOrder === 'lowtoHigh') filterProducts = [...filterProducts].sort((a,b) => a.productPrice - b.productPrice)
  if (sortOrder === 'highToLow') filterProducts = [...filterProducts].sort((a,b) => b.productPrice - a.productPrice)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({ ...prev, [name]: value }))
  }

  const handlesave = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('productName',  editProduct.productName)
    formData.append('productDesc',  editProduct.productDesc)
    formData.append('productPrice', editProduct.productPrice)
    formData.append('category',     editProduct.category)
    formData.append('brand',        editProduct.brand)

    const exisitingImages = editProduct.productImg
      .filter(img => !(img instanceof File) && img.public_id)
      .map(img => img.public_id)
    formData.append('existingImages', JSON.stringify(exisitingImages))
    editProduct.productImg.filter(img => img instanceof File).forEach(file => formData.append('file', file))

    try {
      const res = await axios.put(`https://shopping-ekart.vercel.app/v1/product/update/${editProduct._id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success('Product updated successfully')
        dispatch(setProducts(products.map(p => p._id === editProduct._id ? res.data.product : p)))
        setOpen(false)
      }
    } catch (error) { console.error(error) }
  }

  const deleteProductHandler = async (productId) => {
    try {
      const reminingProducts = products.filter(p => p._id !== productId)
      const res = await axios.delete(`https://shopping-ekart.vercel.app/v1/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(reminingProducts))
      }
    } catch (error) { console.error(error) }
  }

  /* ── refs ── */
  const pageRef    = useRef(null)
  const toolbarRef = useRef(null)
  const cardRefs   = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(toolbarRef.current,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
      )
      cardRefs.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 28, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%' },
            delay: i * 0.05,
          }
        )
      })
    }, pageRef)
    return () => ctx.revert()
  }, [filterProducts.length])

  /* ── card hover ── */
  const cardIn  = e => gsap.to(e.currentTarget, { y: -3, scale: 1.008, duration: 0.2, ease: 'power2.out' })
  const cardOut = e => gsap.to(e.currentTarget, { y:  0, scale: 1,     duration: 0.2, ease: 'power2.in'  })

  /* ── icon btn hover ── */
  const iconIn  = e => gsap.to(e.currentTarget, { scale: 1.22, duration: 0.17, ease: 'back.out(2)' })
  const iconOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'   })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --adp-bg:       #05050f;
          --adp-card:     rgba(9,9,28,0.95);
          --adp-surface:  rgba(255,255,255,0.04);
          --adp-border:   rgba(255,255,255,0.07);
          --adp-accent:   #6366f1;
          --adp-cyan:     #22d3ee;
          --adp-muted:    rgba(255,255,255,0.35);
          --adp-text:     rgba(255,255,255,0.82);
          --adp-sub:      rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .adp-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--adp-bg);
          background-image:
            radial-gradient(ellipse 65% 45% at 85% 0%,   rgba(99,102,241,.09), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 100%, rgba(34,211,238,.06), transparent 55%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media(max-width:768px){
          .adp-page { padding-left:1rem; padding-top:4rem; padding-right:1rem; }
        }

        /* ── toolbar ── */
        .adp-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* search */
        .adp-search-wrap {
          position: relative;
          flex: 1; max-width: 420px;
        }
        .adp-search-icon {
          position: absolute; right: .75rem; top: 50%;
          transform: translateY(-50%);
          color: var(--adp-muted); pointer-events: none;
          width: 16px; height: 16px;
        }
        .adp-search-input {
          width: 100%;
          padding: .6rem 2.4rem .6rem .9rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--adp-border);
          border-radius: 11px;
          color: var(--adp-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .adp-search-input::placeholder { color: var(--adp-muted); }
        .adp-search-input:focus {
          border-color: rgba(99,102,241,.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,.13);
        }

        /* select override */
        .adp-select-trigger {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid var(--adp-border) !important;
          border-radius: 11px !important;
          color: var(--adp-text) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: .88rem !important;
          min-width: 180px;
        }

        /* ── product card ── */
        .adp-card {
          background: var(--adp-card);
          border: 1px solid var(--adp-border);
          border-radius: 16px;
          padding: .9rem 1.2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 28px rgba(0,0,0,.45);
          transition: border-color .22s, box-shadow .22s;
        }
        .adp-card:hover {
          border-color: rgba(99,102,241,.28);
          box-shadow: 0 8px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.08);
        }
        /* shimmer on hover */
        .adp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 55%, transparent);
          background-size: 220% 100%;
          animation: adp-line 4s linear infinite;
          opacity: 0; transition: opacity .25s;
        }
        .adp-card:hover::before { opacity: 1; }
        @keyframes adp-line {
          0%  { background-position:  220% 0 }
          100%{ background-position: -220% 0 }
        }

        /* card inner row */
        .adp-card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: relative; z-index: 1;
        }

        /* left: image + name */
        .adp-card-left {
          display: flex; align-items: center; gap: .9rem; flex: 1; min-width: 0;
        }
        .adp-img-wrap {
          width: 62px; height: 62px; flex-shrink: 0;
          border-radius: 12px; overflow: hidden;
          border: 1px solid var(--adp-border);
          background: var(--adp-surface);
        }
        .adp-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: brightness(.92) saturate(1.05);
          transition: filter .2s, transform .25s;
        }
        .adp-card:hover .adp-img-wrap img {
          filter: brightness(1) saturate(1.1);
          transform: scale(1.07);
        }
        .adp-product-name {
          font-weight: 600; color: var(--adp-text);
          font-size: .9rem; line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 320px;
        }

        /* price */
        .adp-price {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1rem;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap; flex-shrink: 0;
        }

        /* action icons */
        .adp-actions {
          display: flex; align-items: center; gap: .75rem; flex-shrink: 0;
        }
        .adp-icon-edit {
          color: #34d399; cursor: pointer;
          transition: color .2s;
        }
        .adp-icon-edit:hover { color: #6ee7b7; }
        .adp-icon-delete {
          color: #f87171; cursor: pointer;
          transition: color .2s;
        }
        .adp-icon-delete:hover { color: #fca5a5; }

        /* ── dialog overrides ── */
        [data-radix-popper-content-wrapper] {
          z-index: 200 !important;
        }
        .adp-dialog-input, .adp-dialog-textarea {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: rgba(255,255,255,0.85) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: .86rem !important;
        }
        .adp-dialog-input::placeholder,
        .adp-dialog-textarea::placeholder { color: rgba(255,255,255,.3) !important; }
        .adp-dialog-input:focus,
        .adp-dialog-textarea:focus {
          border-color: rgba(99,102,241,.5) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,.13) !important;
          outline: none !important;
        }
        .adp-dialog-label {
          font-family: 'Syne', sans-serif !important;
          font-size: .68rem !important; font-weight: 700 !important;
          letter-spacing: .1em !important; text-transform: uppercase !important;
          color: rgba(255,255,255,.38) !important;
        }
        .adp-save-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
          color: #fff !important;
          font-family: 'Syne', sans-serif !important;
          font-weight: 700 !important; border: none !important;
          border-radius: 10px !important;
          box-shadow: 0 3px 16px rgba(99,102,241,.4) !important;
          transition: box-shadow .2s !important;
        }
        .adp-save-btn:hover { box-shadow: 0 5px 24px rgba(99,102,241,.6) !important; }

        /* alert dialog continue btn */
        .adp-delete-btn {
          background: rgba(239,68,68,.15) !important;
          border: 1px solid rgba(239,68,68,.3) !important;
          color: #fca5a5 !important;
          border-radius: 10px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .adp-delete-btn:hover {
          background: rgba(239,68,68,.25) !important;
        }

        /* responsive */
        @media(max-width:600px){
          .adp-product-name { max-width: 160px; }
          .adp-price { font-size: .88rem; }
        }
      `}</style>

      <div className="adp-page" ref={pageRef}>

        {/* ── TOOLBAR ── */}
        <div className="adp-toolbar" ref={toolbarRef}>
          {/* Search */}
          <div className="adp-search-wrap">
            <input
              type="text"
              placeholder="Search products…"
              className="adp-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="adp-search-icon" />
          </div>

          {/* Sort */}
          <Select onValueChange={value => setSortOrder(value)}>
            <SelectTrigger className="adp-select-trigger">
              <SlidersHorizontal size={14} style={{ marginRight: '.4rem', opacity: .6 }} />
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowtoHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── PRODUCT LIST ── */}
        {filterProducts.map((product, index) => (
          <div
            key={index}
            className="adp-card"
            ref={el => cardRefs.current[index] = el}
            onMouseEnter={cardIn}
            onMouseLeave={cardOut}
          >
            <div className="adp-card-row">

              {/* Left: image + name */}
              <div className="adp-card-left">
                <div className="adp-img-wrap">
                  <img src={product?.productImg?.[0]?.url} alt="" />
                </div>
                <h1 className="adp-product-name">{product.productName}</h1>
              </div>

              {/* Price */}
              <span className="adp-price">₹{product.productPrice}</span>

              {/* Actions */}
              <div className="adp-actions">

                {/* Edit dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Edit
                      size={18}
                      className="adp-icon-edit"
                      onClick={() => { setOpen(true); setEditProduct(product) }}
                      onMouseEnter={iconIn} onMouseLeave={iconOut}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                      <div className="grid gap-2">
                        <Label className="adp-dialog-label">Product Name</Label>
                        <Input className="adp-dialog-input" type="text" name="productName" placeholder="e.g. iPhone" value={editProduct.productName} onChange={handleChange} required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="adp-dialog-label">Price</Label>
                        <Input className="adp-dialog-input" type="number" name="productPrice" value={editProduct.productPrice} onChange={handleChange} required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="adp-dialog-label">Brand</Label>
                        <Input className="adp-dialog-input" type="text" name="brand" placeholder="e.g. Apple" value={editProduct.brand} onChange={handleChange} required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="adp-dialog-label">Category</Label>
                        <Input className="adp-dialog-input" type="text" name="category" placeholder="e.g. Mobile" value={editProduct.category} onChange={handleChange} required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="adp-dialog-label">Description</Label>
                        <Textarea className="adp-dialog-textarea" name="productDesc" placeholder="Enter brief description" value={editProduct.productDesc} onChange={handleChange} />
                      </div>
                      <ImageUploade productData={editProduct} setProductData={setEditProduct} />
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button className="adp-save-btn" onClick={handlesave} type="button">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete alert */}
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2
                      size={18}
                      className="adp-icon-delete"
                      onMouseEnter={iconIn} onMouseLeave={iconOut}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this product
                        and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="adp-delete-btn"
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </div>
          </div>
        ))}

      </div>
    </>
  )
}

export default AdminProduct