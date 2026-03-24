import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Camera, Loader2 } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userlogo from '../../assets/userlogo.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { gsap } from 'gsap'

const UserInfo = () => {
  const navigate    = useNavigate()
  const { id: userId } = useParams()
  const dispatch    = useDispatch()
  const [loading, setLoading] = useState(false)
  const [file, setFile]       = useState(null)

  const [updateUser, setUpdateUser] = useState({
    firstName: '', lastName: '', email: '',
    phoneNo: '', address: '', city: '',
    zipCode: '', profilepic: '', role: 'user',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdateUser(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setFile(selectedFile)
    setUpdateUser(prev => ({ ...prev, profilepic: URL.createObjectURL(selectedFile) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const accessToken = localStorage.getItem('accessToken')
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('firstName', updateUser.firstName)
      formData.append('lastName',  updateUser.lastName)
      formData.append('phoneNo',   updateUser.phoneNo)
      formData.append('address',   updateUser.address)
      formData.append('city',      updateUser.city)
      formData.append('zipCode',   updateUser.zipCode)
      formData.append('role',      updateUser.role)
      if (file) formData.append('file', file)
      const res = await axios.put(
        `https://shopping-ekart-backend.onrender.comapi/v1/user/update/${userId}`, formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`https://shopping-ekart-backend.onrender.comapi/v1/user/get-user/${userId}`)
      if (res.data.success) setUpdateUser(res.data.user)
    } catch (error) { console.error(error) }
  }

  useEffect(() => { getUserDetails() }, [userId])

  /* ── refs ── */
  const pageRef   = useRef(null)
  const headerRef = useRef(null)
  const avatarRef = useRef(null)
  const formRef   = useRef(null)
  const fieldRefs = useRef([])
  const btnRef    = useRef(null)

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.5 }
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
      .fromTo(btnRef.current,
        { opacity: 0, y: 10, scale: 0.95 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.15'
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── hover helpers ── */
  const btnIn  = e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.17, ease: 'power2.out' })
  const btnOut = e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.17, ease: 'power2.in'  })
  const focusIn  = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(99,102,241,0.22)', duration: 0.2 })
  const focusOut = e => gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px rgba(99,102,241,0)',    duration: 0.2 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ui-bg:      #05050f;
          --ui-card:    rgba(9,9,28,0.94);
          --ui-surface: rgba(255,255,255,0.04);
          --ui-border:  rgba(255,255,255,0.08);
          --ui-accent:  #6366f1;
          --ui-cyan:    #22d3ee;
          --ui-muted:   rgba(255,255,255,0.35);
          --ui-text:    rgba(255,255,255,0.82);
          --ui-sub:     rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .ui-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--ui-bg);
          background-image:
            radial-gradient(ellipse 65% 50% at 80% 0%,   rgba(99,102,241,.1),  transparent 60%),
            radial-gradient(ellipse 55% 45% at 10% 100%, rgba(34,211,238,.07), transparent 55%);
          padding: 2rem 1.5rem 4rem;
        }

        .ui-inner {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── header row ── */
        .ui-header-row {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 2rem; width: 100%;
        }
        .ui-back {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 11px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--ui-border);
          color: var(--ui-text); cursor: pointer;
          transition: background .2s, border-color .2s;
          flex-shrink: 0;
        }
        .ui-back:hover {
          background: rgba(99,102,241,.16);
          border-color: rgba(99,102,241,.3);
        }
        .ui-page-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 800; color: #fff; letter-spacing: -.01em;
          display: flex; align-items: center; gap: .6rem;
        }
        .ui-page-title svg { color: var(--ui-accent); }

        /* ── body layout ── */
        .ui-body {
          display: flex;
          gap: 2rem;
          width: 100%;
          align-items: flex-start;
        }
        @media(max-width:640px){
          .ui-body { flex-direction: column; align-items: center; }
        }

        /* ── avatar column ── */
        .ui-avatar-col {
          display: flex; flex-direction: column;
          align-items: center; gap: .9rem;
          flex-shrink: 0;
        }
        .ui-avatar-ring {
          position: relative;
          width: 120px; height: 120px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          padding: 3px;
        }
        .ui-avatar-ring::before {
          content: '';
          position: absolute; inset: -4px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(99,102,241,.35), rgba(34,211,238,.25));
          z-index: -1; animation: ui-pulse-ring 2.5s ease-in-out infinite;
        }
        @keyframes ui-pulse-ring {
          0%,100% { opacity: .5; transform: scale(1); }
          50%      { opacity: 1;  transform: scale(1.06); }
        }
        .ui-avatar-img {
          width: 100%; height: 100%; border-radius: 50%;
          object-fit: cover; display: block;
          background: var(--ui-card);
        }
        .ui-change-pic {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .42rem 1rem; border-radius: 10px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #a5b4fc;
          font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 500; cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .ui-change-pic:hover {
          background: rgba(99,102,241,.26);
          border-color: rgba(99,102,241,.45);
        }

        /* ── form card ── */
        .ui-form-card {
          flex: 1;
          background: var(--ui-card);
          border: 1px solid var(--ui-border);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.05);
        }
        /* shimmer top */
        .ui-form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 5;
          background: linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 55%, #a78bfa 75%, transparent);
          background-size: 240% 100%;
          animation: ui-line 4.5s linear infinite;
        }
        @keyframes ui-line {
          0%   { background-position:  240% 0 }
          100% { background-position: -240% 0 }
        }
        /* corner glow */
        .ui-form-card::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 55% 40% at 0% 0%, rgba(99,102,241,.07), transparent 55%);
        }
        .ui-form-card > * { position: relative; z-index: 1; }

        /* ── field groups ── */
        .ui-form { display: flex; flex-direction: column; gap: 1rem; }

        .ui-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
        @media(max-width:480px){ .ui-grid2 { grid-template-columns: 1fr; } }

        .ui-label {
          font-family: 'Syne', sans-serif;
          font-size: .68rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ui-muted);
          display: block; margin-bottom: .3rem;
        }
        .ui-field { display: flex; flex-direction: column; }

        .ui-input {
          width: 100%;
          padding: .58rem .85rem;
          background: var(--ui-surface);
          border: 1px solid var(--ui-border);
          border-radius: 10px;
          color: var(--ui-text);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem; outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
        }
        .ui-input::placeholder { color: var(--ui-muted); }
        .ui-input:focus { border-color: rgba(99,102,241,.5); }
        .ui-input:disabled {
          opacity: .45; cursor: not-allowed;
          background: rgba(255,255,255,.02);
        }

        /* ── role selector ── */
        .ui-role-row {
          display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap;
        }
        .ui-role-label {
          font-family: 'Syne', sans-serif;
          font-size: .7rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ui-muted);
        }
        .ui-radio-opt {
          display: flex; align-items: center; gap: .45rem; cursor: pointer;
        }
        .ui-radio-opt span {
          font-size: .86rem; color: var(--ui-sub);
        }

        /* ── submit btn ── */
        .ui-submit {
          width: 100%;
          padding: .7rem 1.5rem; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: .92rem; font-weight: 700; letter-spacing: .03em;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          position: relative; overflow: hidden;
          transition: box-shadow .2s, opacity .2s;
          margin-top: .5rem;
        }
        .ui-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.13), transparent);
          opacity: 0; transition: opacity .2s;
        }
        .ui-submit:hover:not(:disabled) { box-shadow: 0 6px 30px rgba(99,102,241,.6); }
        .ui-submit:hover:not(:disabled)::after { opacity: 1; }
        .ui-submit:disabled { opacity: .6; cursor: not-allowed; }

        /* ── divider ── */
        .ui-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--ui-accent), rgba(34,211,238,.3), transparent);
          opacity: .15;
        }
      `}</style>

      <div className="ui-page" ref={pageRef}>
        <div className="ui-inner">

          {/* Header */}
          <div className="ui-header-row" ref={headerRef}>
            <button
              className="ui-back"
              onClick={() => navigate(-1)}
              onMouseEnter={btnIn} onMouseLeave={btnOut}
            >
              <ArrowLeft size={17} />
            </button>
            <h1 className="ui-page-title">
              <User size={20} /> Update Profile
            </h1>
          </div>

          {/* Body */}
          <div className="ui-body">

            {/* Avatar column */}
            <div className="ui-avatar-col" ref={avatarRef}>
              <div className="ui-avatar-ring">
                <img
                  src={updateUser.profilepic || userlogo}
                  alt="profile"
                  className="ui-avatar-img"
                />
              </div>
              <label
                className="ui-change-pic"
                onMouseEnter={btnIn} onMouseLeave={btnOut}
              >
                <Camera size={13} /> Change Picture
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            {/* Form card */}
            <div className="ui-form-card" ref={formRef}>
              <form className="ui-form" onSubmit={handleSubmit}>

                {/* Name row */}
                <div className="ui-grid2" ref={el => fieldRefs.current[0] = el}>
                  <div className="ui-field">
                    <span className="ui-label">First Name</span>
                    <Input name="firstName" value={updateUser.firstName} onChange={handleChange}
                      placeholder="First Name" className="ui-input"
                      onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div className="ui-field">
                    <span className="ui-label">Last Name</span>
                    <Input name="lastName" value={updateUser.lastName} onChange={handleChange}
                      placeholder="Last Name" className="ui-input"
                      onFocus={focusIn} onBlur={focusOut} />
                  </div>
                </div>

                {/* Email (disabled) */}
                <div className="ui-field" ref={el => fieldRefs.current[1] = el}>
                  <span className="ui-label">Email</span>
                  <Input value={updateUser.email} disabled className="ui-input" />
                </div>

                {/* Phone */}
                <div className="ui-field" ref={el => fieldRefs.current[2] = el}>
                  <span className="ui-label">Phone Number</span>
                  <Input name="phoneNo" value={updateUser.phoneNo} onChange={handleChange}
                    placeholder="Phone Number" className="ui-input"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>

                {/* Address */}
                <div className="ui-field" ref={el => fieldRefs.current[3] = el}>
                  <span className="ui-label">Address</span>
                  <Input name="address" value={updateUser.address} onChange={handleChange}
                    placeholder="Address" className="ui-input"
                    onFocus={focusIn} onBlur={focusOut} />
                </div>

                {/* City + Zip */}
                <div className="ui-grid2" ref={el => fieldRefs.current[4] = el}>
                  <div className="ui-field">
                    <span className="ui-label">City</span>
                    <Input name="city" value={updateUser.city} onChange={handleChange}
                      placeholder="City" className="ui-input"
                      onFocus={focusIn} onBlur={focusOut} />
                  </div>
                  <div className="ui-field">
                    <span className="ui-label">Zip Code</span>
                    <Input name="zipCode" value={updateUser.zipCode} onChange={handleChange}
                      placeholder="Zip Code" className="ui-input"
                      onFocus={focusIn} onBlur={focusOut} />
                  </div>
                </div>

                {/* Divider */}
                <div className="ui-divider" ref={el => fieldRefs.current[5] = el} />

                {/* Role */}
                <div ref={el => fieldRefs.current[6] = el}>
                  <div className="ui-role-row">
                    <span className="ui-role-label">Role:</span>
                    <RadioGroup
                      value={updateUser.role}
                      onValueChange={value => setUpdateUser(prev => ({ ...prev, role: value }))}
                      className="flex gap-4"
                    >
                      <div className="ui-radio-opt">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user"><span>User</span></Label>
                      </div>
                      <div className="ui-radio-opt">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin"><span>Admin</span></Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  ref={btnRef}
                  disabled={loading}
                  className="ui-submit"
                  onMouseEnter={btnIn} onMouseLeave={btnOut}
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Updating…</>
                    : 'Update Profile'
                  }
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default UserInfo