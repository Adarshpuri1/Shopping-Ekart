import React, { useRef, useEffect } from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const heroRef   = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero fades in immediately */
      gsap.fromTo(heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      )

      /* Footer reveals on scroll */
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 92%' }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .home-root {
          font-family: 'DM Sans', sans-serif;
          background: #05050f;
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>

      <div className="home-root">
        <div ref={heroRef}>
          <Hero />
        </div>
        <div ref={footerRef}>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Home