import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, Package } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const statusConfig = {
  Paid:    { color: '#22c55e', bg: 'rgba(34,197,94,0.14)',  border: 'rgba(34,197,94,0.3)',  glow: 'rgba(34,197,94,0.25)'  },
  Pending: { color: '#f97316', bg: 'rgba(249,115,22,0.14)', border: 'rgba(249,115,22,0.3)', glow: 'rgba(249,115,22,0.25)' },
  Failed:  { color: '#ef4444', bg: 'rgba(239,68,68,0.14)',  border: 'rgba(239,68,68,0.3)',  glow: 'rgba(239,68,68,0.25)'  },
}

const AdminOrder = () => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://shopping-ekart-backend.onrender.comapi/v1/orders/all', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (res.data.success) setOrders(res.data.orders)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [accessToken])

  /* ── refs ── */
  const pageRef   = useRef(null)
  const titleRef  = useRef(null)
  const tableRef  = useRef(null)
  const rowRefs   = useRef([])

  /* ── entrance ── */
  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(titleRef.current,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.55 }
      )
      .fromTo(tableRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6 }, '-=0.3'
      )

      rowRefs.current.filter(Boolean).forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: -16 },
          {
            opacity: 1, x: 0, duration: 0.4, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 92%' },
            delay: i * 0.04,
          }
        )
      })
    }, pageRef)
    return () => ctx.revert()
  }, [loading, orders])

  /* ── row hover ── */
  const rowIn  = e => gsap.to(e.currentTarget, { x: 3,  duration: 0.18, ease: 'power2.out' })
  const rowOut = e => gsap.to(e.currentTarget, { x: 0,  duration: 0.18, ease: 'power2.in'  })

  /* ── loading state ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
          .ao-loader {
            font-family:'DM Sans',sans-serif;
            display:flex; flex-direction:column; align-items:center;
            justify-content:center; min-height:60vh; gap:1rem;
            padding-left:300px;
          }
          .ao-spinner {
            width:40px; height:40px; border-radius:50%;
            border:3px solid rgba(99,102,241,.2);
            border-top-color:#6366f1;
            animation:ao-spin .8s linear infinite;
          }
          @keyframes ao-spin { to { transform:rotate(360deg); } }
          .ao-load-text { color:rgba(255,255,255,.4); font-size:.88rem; }
          @media(max-width:768px){ .ao-loader { padding-left:0; } }
        `}</style>
        <div className="ao-loader">
          <div className="ao-spinner" />
          <p className="ao-load-text">Loading all orders…</p>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ao-bg:       #05050f;
          --ao-surface:  rgba(255,255,255,0.04);
          --ao-border:   rgba(255,255,255,0.07);
          --ao-accent:   #6366f1;
          --ao-cyan:     #22d3ee;
          --ao-muted:    rgba(255,255,255,0.35);
          --ao-text:     rgba(255,255,255,0.82);
          --ao-sub:      rgba(255,255,255,0.48);
        }

        /* ── page ── */
        .ao-page {
          font-family: 'DM Sans', sans-serif;
          padding-left: 300px;
          padding-top: 5rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          min-height: 100vh;
          background: var(--ao-bg);
          background-image:
            radial-gradient(ellipse 65% 45% at 80% 0%,   rgba(99,102,241,.09), transparent 60%),
            radial-gradient(ellipse 50% 40% at 15% 100%, rgba(34,211,238,.06), transparent 55%);
        }
        @media(max-width:768px){
          .ao-page { padding-left:1rem; padding-top:4rem; padding-right:1rem; }
        }

        /* ── title row ── */
        .ao-title-row {
          display:flex; align-items:center; gap:.75rem; margin-bottom:1.75rem;
        }
        .ao-title-icon {
          width:40px; height:40px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(99,102,241,.14);
          border:1px solid rgba(99,102,241,.26);
          color:#a5b4fc;
        }
        .ao-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(1.4rem,3vw,2rem); font-weight:800;
          color:#fff; letter-spacing:-.01em;
        }

        /* ── empty state ── */
        .ao-empty {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:1rem; padding:5rem 2rem;
          border:1.5px dashed var(--ao-border); border-radius:20px;
          background:var(--ao-surface);
        }
        .ao-empty-icon { color:var(--ao-muted); }
        .ao-empty-text { font-size:1rem; color:var(--ao-muted); }

        /* ── table wrap ── */
        .ao-table-wrap {
          width:100%; overflow-x:auto;
          border-radius:18px;
          border:1px solid var(--ao-border);
          background:rgba(9,9,31,0.9);
          box-shadow:0 8px 48px rgba(0,0,0,.55), 0 0 0 1px rgba(99,102,241,.06);
          position:relative;
        }
        /* shimmer top */
        .ao-table-wrap::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:2px; z-index:5;
          background:linear-gradient(90deg,
            transparent, #6366f1 30%, #22d3ee 55%, #a78bfa 75%, transparent);
          background-size:240% 100%;
          animation:ao-line 4.5s linear infinite;
        }
        @keyframes ao-line {
          0%  { background-position: 240% 0 }
          100%{ background-position:-240% 0 }
        }

        /* ── table ── */
        .ao-table {
          width:100%; border-collapse:collapse;
          font-size:.84rem; text-align:left;
        }

        /* thead */
        .ao-table thead tr {
          background:rgba(99,102,241,.08);
          border-bottom:1px solid var(--ao-border);
        }
        .ao-table thead th {
          padding:.8rem 1.1rem;
          font-family:'Syne',sans-serif;
          font-size:.66rem; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:var(--ao-muted);
          white-space:nowrap;
        }

        /* tbody rows */
        .ao-table tbody tr {
          border-bottom:1px solid var(--ao-border);
          transition:background .18s;
        }
        .ao-table tbody tr:last-child { border-bottom:none; }
        .ao-table tbody tr:hover { background:rgba(99,102,241,.06); }

        .ao-table td {
          padding:.8rem 1.1rem;
          color:var(--ao-text);
          vertical-align:middle;
        }

        /* ── cell types ── */
        .ao-cell-id {
          font-family:monospace; font-size:.75rem;
          color:var(--ao-sub); max-width:130px;
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }

        .ao-cell-user-name {
          font-weight:600; color:var(--ao-text); font-size:.86rem;
        }
        .ao-cell-user-email {
          font-size:.74rem; color:var(--ao-muted); margin-top:.1rem;
        }

        .ao-cell-product {
          font-size:.8rem; color:var(--ao-sub); padding:.15rem 0;
          border-bottom:1px solid rgba(255,255,255,.04);
        }
        .ao-cell-product:last-child { border-bottom:none; }

        .ao-cell-amount {
          font-family:'Syne',sans-serif; font-weight:800;
          font-size:.92rem;
          background:linear-gradient(135deg,#6366f1,#22d3ee);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; white-space:nowrap;
        }

        .ao-status-badge {
          display:inline-flex; align-items:center; gap:.3rem;
          padding:.25rem .75rem; border-radius:20px;
          font-family:'Syne',sans-serif;
          font-size:.68rem; font-weight:700; letter-spacing:.06em;
          border:1px solid; white-space:nowrap;
        }
        .ao-status-dot {
          width:6px; height:6px; border-radius:50%;
        }

        .ao-cell-date {
          font-size:.8rem; color:var(--ao-muted); white-space:nowrap;
        }

        /* scrollbar */
        .ao-table-wrap::-webkit-scrollbar { height:4px; }
        .ao-table-wrap::-webkit-scrollbar-thumb {
          background:rgba(255,255,255,.08); border-radius:4px;
        }
      `}</style>

      <div className="ao-page" ref={pageRef}>

        {/* Title */}
        <div className="ao-title-row" ref={titleRef}>
          <div className="ao-title-icon"><ShoppingBag size={18} /></div>
          <h1 className="ao-title">Admin — All Orders</h1>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="ao-empty">
            <Package size={44} className="ao-empty-icon" />
            <p className="ao-empty-text">No orders found.</p>
          </div>
        ) : (
          <div className="ao-table-wrap" ref={tableRef}>
            <table className="ao-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const st = statusConfig[order.status] || statusConfig.Pending
                  return (
                    <tr
                      key={order._id}
                      ref={el => rowRefs.current[i] = el}
                      onMouseEnter={rowIn}
                      onMouseLeave={rowOut}
                    >
                      {/* Order ID */}
                      <td><span className="ao-cell-id">{order._id}</span></td>

                      {/* User */}
                      <td>
                        <p className="ao-cell-user-name">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="ao-cell-user-email">{order.user?.email}</p>
                      </td>

                      {/* Products */}
                      <td>
                        {order.products.map((p, idx) => (
                          <div key={idx} className="ao-cell-product">
                            {p.productId?.productName} × {p.quantity}
                          </div>
                        ))}
                      </td>

                      {/* Amount */}
                      <td>
                        <span className="ao-cell-amount">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className="ao-status-badge"
                          style={{
                            color: st.color,
                            background: st.bg,
                            borderColor: st.border,
                            boxShadow: `0 0 10px ${st.glow}`,
                          }}
                        >
                          <span className="ao-status-dot" style={{ background: st.color, boxShadow: `0 0 6px ${st.color}` }} />
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="ao-cell-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminOrder