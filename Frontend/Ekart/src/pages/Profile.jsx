import { setUser } from '@/redux/userSlice'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import logo from '../assets/userlogo.png'
import MyOrder from './MyOrder'
import { gsap } from 'gsap'
import { User, ShoppingBag, Camera, Loader2 } from 'lucide-react'
import store from '@/redux/store'

const Profile = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [file,    setFile]    = useState(null)
  const [formdata, setFormData] = useState({
    firstName: '', lastName: '', phoneNo: '',
    address: '', city: '', zipCode: '', profilepic: '',
  })

  const user        = useSelector(store => store.user.user)
  const accessToken = localStorage.getItem('accessToken')
  const dispatch    = useDispatch()

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName:  user.lastName  || '',
        phoneNo:   user.phoneNo   || '',
        address:   user.address   || '',
        city:      user.city      || '',
        zipCode:   user.zipCode   || '',
        profilepic:user.profilepic|| '',
      })
    }
  }, [user])

  const changeValue = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const selectFile = e.target.files[0]
    if (!selectFile) return
    setFile(selectFile)
    setFormData({ ...formdata, profilepic: URL.createObjectURL(selectFile) })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('firstName', formdata.firstName)
    form.append('lastName',  formdata.lastName)
    form.append('phoneNo',   formdata.phoneNo)
    form.append('address',   formdata.address)
    form.append('city',      formdata.city)
    form.append('zipCode',   formdata.zipCode)
    if (file) form.append('file', file)
    try {
      setLoading(true)
      const res = await axios.put(`https://shopping-ekart-backend.onrender.comapi/v1/user/update/${id}`, form, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── refs ── */
  const pageRef   = useRef(null)
  const tabsRef   = useRef(null)
  const avatarRef = useRef(null)
  const formRef   = useRef(null)
  const fieldRefs = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(tabsRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1,  y: 0, duration: 0.5 }
      )
      .fromTo(avatarRef.current,
        { opacity: 0, scale: 0.82, x: -24 },
        { opacity: 1, scale: 1,    x: 0, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.3'
      )
      .fromTo(formRef.current,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.6 }, '-=0.45'
      )
      .fromTo(fieldRefs.current.filter(Boolean),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.4 }, '-=0.35'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --pf-bg:      #05050f;
          --pf-card:    rgba(9,9,28,0.94);
          --pf-surface: rgba(255,255,255,0.04);
          --pf-border:  rgba(255,255,255,0.08);
          --pf-accent:  #6366f1;
          --pf-cyan:    #22d3ee;
          --pf-muted:   rgba(255,255,255,0.35);
          --pf-text:    rgba(255,255,255,0.82);
        }

        /* ── page ── */
        .pf-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--pf-bg);
          background-image:
            radial-gradient(ellipse 65% 50% at 80% 0%,   rgba(99,102,241,.1),  transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 100%, rgba(34,211,238,.07), transparent 55%);
          padding: 6rem 1.5rem 4rem;
        }

        .pf-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── tabs list ── */
        .pf-tabs-list {
          display: flex; align-items: center; gap: .5rem;
          margin-bottom: 2rem;
          background: var(--pf-surface);
          border: 1px solid var(--pf-border);
          border-radius: 14px; padding: .35rem;
          width: fit-content;
        }
        .pf-tab-trigger {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .5rem 1.2rem; border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: .82rem; font-weight: 700; letter-spacing: .05em;
          text-transform: uppercase;
          color: var(--pf-muted);
          background: transparent; border: none; cursor: pointer;
          transition: background .2s, color .2s, box-shadow .2s;
        }
        .pf-tab-trigger[data-state='active'] {
          background: linear-gradient(135deg, rgba(99,102,241,.25), rgba(34,211,238,.12));
          border: 1px solid rgba(99,102,241,.3);
          color: #fff;
          box-shadow: 0 2px 14px rgba(99,102,241,.25);
        }

        /* ── profile tab content ── */
        .pf-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pf-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 800; color: #fff;
          margin-bottom: 2rem; letter-spacing: -.01em;
          display: flex; align-items: center; gap: .6rem;
        }
        .pf-title svg { color: var(--pf-accent); }

        .pf-body {
          display: flex; gap: 2rem;
          width: 100%; align-items: flex-start;
        }
        @media(max-width:640px){
          .pf-body { flex-direction: column; align-items: center; }
        }

        /* ── avatar col ── */
        .pf-avatar-col {
          display: flex; flex-direction: column;
          align-items: center; gap: .9rem; flex-shrink: 0;
        }
        .pf-avatar-ring {
          width: 120px; height: 120px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          padding: 3px; position: relative;
        }
        .pf-avatar-ring::before {
          content: '';
          position: absolute; inset: -4px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.25));
          z-index: -1; animation: pf-pulse 2.5s ease-in-out infinite;
        }
        @keyframes pf-pulse {
          0%,100% { opacity:.5; transform:scale(1); }
          50%      { opacity:1;  transform:scale(1.06); }
        }
        .pf-avatar-img {
          width:100%; height:100%; border-radius:50%;
          object-fit:cover; display:block; background:var(--pf-card);
        }
        .pf-change-pic {
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.42rem 1rem; border-radius:10px;
          background:rgba(99,102,241,.14);
          border:1px solid rgba(99,102,241,.28);
          color:#a5b4fc;
          font-family:'DM Sans',sans-serif;
          font-size:.8rem; font-weight:500; cursor:pointer;
          transition:background .2s, border-color .2s;
        }
        .pf-change-pic:hover {
          background:rgba(99,102,241,.26);
          border-color:rgba(99,102,241,.45);
        }

        /* ── form card ── */
        .pf-form-card {
          flex: 1;
          background: var(--pf-card);
          border: 1px solid var(--pf-border);
          border-radius: 20px; padding: 1.75rem;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.05);
        }
        .pf-form-card::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg,
            transparent, #6366f1 28%, #22d3ee 52%, #a78bfa 75%, transparent);
          background-size:240% 100%;
          animation:pf-line 4.5s linear infinite;
        }
        @keyframes pf-line {
          0%  { background-position: 240% 0 }
          100%{ background-position:-240% 0 }
        }
        .pf-form-card::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background:radial-gradient(ellipse 55% 40% at 0% 0%, rgba(99,102,241,.07), transparent 55%);
        }
        .pf-form-card > * { position:relative; z-index:1; }

        /* ── form fields ── */
        .pf-form { display:flex; flex-direction:column; gap:1rem; }

        .pf-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
        @media(max-width:480px){ .pf-grid2 { grid-template-columns:1fr; } }

        .pf-label {
          font-family:'Syne',sans-serif;
          font-size:.68rem; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:var(--pf-muted);
          display:block; margin-bottom:.3rem;
        }

        .pf-input {
          width:100%; padding:.58rem .85rem;
          background:var(--pf-surface);
          border:1px solid var(--pf-border);
          border-radius:10px;
          color:var(--pf-text);
          font-family:'DM Sans',sans-serif;
          font-size:.88rem; outline:none;
          transition:border-color .2s;
          box-sizing:border-box;
        }
        .pf-input::placeholder { color:var(--pf-muted); }
        .pf-input:focus { border-color:rgba(99,102,241,.5); }
        .pf-input:disabled {
          opacity:.45; cursor:not-allowed;
          background:rgba(255,255,255,.02);
        }

        .pf-divider {
          height:1px;
          background:linear-gradient(90deg,var(--pf-accent),rgba(34,211,238,.3),transparent);
          opacity:.15;
        }

        /* ── submit btn ── */
        .pf-submit {
          width:100%; padding:.7rem 1.5rem; border-radius:12px;
          background:linear-gradient(135deg, #6366f1, #4f46e5);
          color:#fff; font-family:'Syne',sans-serif;
          font-size:.9rem; font-weight:700; letter-spacing:.03em;
          border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:.5rem;
          box-shadow:0 4px 22px rgba(99,102,241,.42);
          position:relative; overflow:hidden;
          transition:box-shadow .2s, opacity .2s;
        }
        .pf-submit::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.13),transparent);
          opacity:0; transition:opacity .2s;
        }
        .pf-submit:hover:not(:disabled) { box-shadow:0 6px 30px rgba(99,102,241,.6); }
        .pf-submit:hover:not(:disabled)::after { opacity:1; }
        .pf-submit:disabled { opacity:.6; cursor:not-allowed; }
      `}</style>

      <div className="pf-page" ref={pageRef}>
        <div className="pf-inner">

          <Tabs defaultValue="Profile">

            {/* Tab triggers */}
            <TabsList className="pf-tabs-list" ref={tabsRef}>
              <TabsTrigger value="Profile" className="pf-tab-trigger">
                <User size={13} /> Profile
              </TabsTrigger>
              <TabsTrigger value="Orders" className="pf-tab-trigger">
                <ShoppingBag size={13} /> Orders
              </TabsTrigger>
            </TabsList>

            {/* ── PROFILE TAB ── */}
            <TabsContent value="Profile">
              <div className="pf-content">
                <h1 className="pf-title"><User size={20} /> Update Profile</h1>

                <div className="pf-body">

                  {/* Avatar */}
                  <div className="pf-avatar-col" ref={avatarRef}>
                    <div className="pf-avatar-ring">
                      <img src={formdata.profilepic || logo} alt="profile" className="pf-avatar-img" />
                    </div>
                    <label className="pf-change-pic" onMouseEnter={btnIn} onMouseLeave={btnOut}>
                      <Camera size={13} /> Change Picture
                      <input type="file" accept="image/*" hidden onChange={handleFile} />
                    </label>
                  </div>

                  {/* Form */}
                  <div className="pf-form-card" ref={formRef}>
                    <form className="pf-form" onSubmit={handleUpdate}>

                      <div className="pf-grid2" ref={el => fieldRefs.current[0] = el}>
                        <div>
                          <span className="pf-label">First Name</span>
                          <input name="firstName" placeholder="First Name"
                            value={formdata.firstName} onChange={changeValue}
                            className="pf-input" onFocus={focIn} onBlur={focOut} />
                        </div>
                        <div>
                          <span className="pf-label">Last Name</span>
                          <input name="lastName" placeholder="Last Name"
                            value={formdata.lastName} onChange={changeValue}
                            className="pf-input" onFocus={focIn} onBlur={focOut} />
                        </div>
                      </div>

                      <div ref={el => fieldRefs.current[1] = el}>
                        <span className="pf-label">Email</span>
                        <input value={user?.email || ''} disabled className="pf-input" style={{ width: '100%' }} />
                      </div>

                      <div ref={el => fieldRefs.current[2] = el}>
                        <span className="pf-label">Phone Number</span>
                        <input name="phoneNo" placeholder="Phone Number"
                          value={formdata.phoneNo} onChange={changeValue}
                          className="pf-input" onFocus={focIn} onBlur={focOut} />
                      </div>

                      <div ref={el => fieldRefs.current[3] = el}>
                        <span className="pf-label">Address</span>
                        <input name="address" placeholder="Address"
                          value={formdata.address} onChange={changeValue}
                          className="pf-input" onFocus={focIn} onBlur={focOut} />
                      </div>

                      <div className="pf-grid2" ref={el => fieldRefs.current[4] = el}>
                        <div>
                          <span className="pf-label">City</span>
                          <input name="city" placeholder="City"
                            value={formdata.city} onChange={changeValue}
                            className="pf-input" onFocus={focIn} onBlur={focOut} />
                        </div>
                        <div>
                          <span className="pf-label">Zip Code</span>
                          <input name="zipCode" placeholder="Zip Code"
                            value={formdata.zipCode} onChange={changeValue}
                            className="pf-input" onFocus={focIn} onBlur={focOut} />
                        </div>
                      </div>

                      <div className="pf-divider" ref={el => fieldRefs.current[5] = el} />

                      <button type="submit" disabled={loading} className="pf-submit"
                        onMouseEnter={btnIn} onMouseLeave={btnOut}>
                        {loading
                          ? <><Loader2 size={15} className="animate-spin" /> Updating…</>
                          : 'Update Profile'
                        }
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </TabsContent>

            {/* ── ORDERS TAB ── */}
            <TabsContent value="Orders">
              <MyOrder />
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Profile