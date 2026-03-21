import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../utils/useReducedMotion'

export default function OpeningAnimation({ onComplete }) {
  const overlayRef  = useRef(null)
  const portraitRef = useRef(null)
  const nameRef     = useRef(null)
  const ticketRef   = useRef(null)
  const tlRef       = useRef(null)
  const doneRef     = useRef(false)

  const prefersReduced = useReducedMotion()

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    try { sessionStorage.setItem('billu_intro_seen', 'true') } catch {}

    if (prefersReduced) {
      onComplete()
      return
    }

    tlRef.current?.kill()
    const exit = gsap.timeline({ onComplete })
    exit.to([nameRef.current, portraitRef.current], { scale: 1.04, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
    exit.to(ticketRef.current,  { scaleY: 0, opacity: 0, duration: 0.3, ease: 'power3.in', transformOrigin: 'bottom center' }, '<0.1')
    exit.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '>-0.1')
  }

  useEffect(() => {
    if (prefersReduced) {
      finish()
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    gsap.set(portraitRef.current, { opacity: 0 })
    gsap.set(nameRef.current,     { opacity: 0 })
    gsap.set(ticketRef.current,   { opacity: 0, y: 60, pointerEvents: 'none' })

    tl
      // BILLU slams in first
      .to(nameRef.current, {
        opacity: 1,
        duration: 0.7,
        delay: 0.3,
        ease: 'power3.out',
      })
      // Portrait seeps in behind it
      .to(portraitRef.current, {
        opacity: window.innerWidth < 768 ? 0.25 : 0.14,
        duration: 1.4,
        ease: 'power2.inOut',
      }, '-=0.2')
      // Ticket slides up
      .to(ticketRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(ticketRef.current, { pointerEvents: 'auto' })
          gsap.to(ticketRef.current, {
            scale: 1.015,
            duration: 1.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        },
      }, '+=0.25')

    return () => { tl.kill() }
  }, []) // eslint-disable-line -- one-time animation, intentionally no deps

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Portrait — atmospheric ghost behind everything */}
      <div
        ref={portraitRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/side-profile.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(2px)',
        }}
      />

      {/* Dark vignette to push portrait further back */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.6) 65%, rgba(8,8,8,0.9) 100%)',
        }}
      />

      {/* BILLU — clean gradient text over the ghost portrait */}
      <div
        ref={nameRef}
        className="font-display select-none text-center leading-none mb-10 relative"
        style={{
          fontSize: 'clamp(10rem, 30vw, 40rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          backgroundImage: 'linear-gradient(to bottom, #F5F5F0 0%, #F5F5F0 35%, #888888 70%, #3a3a3a 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        BILLU
      </div>

      {/* Ticket Stub */}
      <div
        ref={ticketRef}
        onClick={finish}
        className="relative cursor-pointer select-none"
        style={{ transformOrigin: 'bottom center' }}
        role="button"
        aria-label="Enter site"
      >
        <div
          className="ticket-shape rounded-2xl"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            width: 'clamp(260px, 40vw, 380px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* Top */}
          <div className="px-6 pt-7 pb-3 text-center">
            <div className="font-mono-jet text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#666' }}>
              Admit One
            </div>
            <div
              className="font-display tracking-wide"
              style={{ color: '#1A1A1A', fontSize: 'clamp(28px, 5vw, 42px)' }}
            >
              BILAL CURMALLY
            </div>
          </div>

          {/* Perforation with edge notches */}
          <div className="ticket-perforation mx-0 px-4" style={{ marginLeft: 0, marginRight: 0 }} />

          {/* Bottom */}
          <div className="px-6 py-4 text-center">
            <div
              className="font-mono-jet tracking-[0.15em] uppercase"
              style={{ color: '#444', fontSize: '10px' }}
            >
              EDITOR &nbsp;·&nbsp; WRITER &nbsp;·&nbsp; COLORIST &nbsp;·&nbsp; VIBE CODE NOOB
            </div>
          </div>
        </div>

        {/* Click hint */}
        <div
          className="text-center mt-3 font-mono-jet"
          style={{ fontSize: '10px', color: '#999', letterSpacing: '0.15em' }}
        >
          CLICK TO ENTER
        </div>
      </div>
    </div>
  )
}
