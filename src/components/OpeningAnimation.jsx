import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TAGS = [
  { label: 'Video Editor', rot: -2 },
  { label: 'Colorist',     rot:  3 },
  { label: 'Writer',       rot: -1 },
  { label: 'Coding Hopeful', rot: 2 },
  { label: 'Vibe Code Noob', rot: -3 },
]

export default function OpeningAnimation({ onComplete }) {
  const overlayRef  = useRef(null)
  const nameRef     = useRef(null)
  const tagsRef     = useRef([])
  const ticketRef   = useRef(null)
  const tlRef       = useRef(null)
  const doneRef     = useRef(false)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
    exit.to(tagsRef.current, {
      x: () => (Math.random() - 0.5) * window.innerWidth * 2,
      y: () => (Math.random() - 0.5) * window.innerHeight * 2,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power3.in',
    })
    exit.to(nameRef.current, { scale: 1.08, opacity: 0, duration: 0.35, ease: 'power2.inOut' }, '<0.1')
    exit.to(ticketRef.current, { scaleY: 0, opacity: 0, duration: 0.3, ease: 'power3.in', transformOrigin: 'bottom center' }, '<0.05')
    exit.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '>-0.1')
  }

  useEffect(() => {
    if (prefersReduced) {
      finish()
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    // Set initial states
    gsap.set(nameRef.current,    { color: '#1A1A1A', scale: 1, opacity: 1 })
    gsap.set(tagsRef.current,    { opacity: 0, y: 40 })
    gsap.set(ticketRef.current,  { opacity: 0, y: 60, pointerEvents: 'none' })

    tl
      .to(nameRef.current, {
        color: '#F5F5F0',
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.inOut',
      })
      .to(tagsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      }, '+=0.0')
      .to(ticketRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(ticketRef.current, { pointerEvents: 'auto' })
          // Gentle pulse
          gsap.to(ticketRef.current, {
            scale: 1.015,
            duration: 1.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        },
      }, '+=0.2')

    return () => {
      tl.kill()
    }
  }, []) // eslint-disable-line

  // Float tags with sin loop
  useEffect(() => {
    if (prefersReduced) return
    const tweens = tagsRef.current.map((el, i) => {
      if (!el) return null
      return gsap.to(el, {
        y: `+=${6 + i * 2}`,
        duration: 1.8 + i * 0.3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.2,
      })
    })
    return () => tweens.forEach(t => t?.kill())
  }, []) // eslint-disable-line

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* BILLU name */}
      <div
        ref={nameRef}
        className="font-display select-none text-center leading-none mb-12"
        style={{ fontSize: 'clamp(80px, 15vw, 220px)', letterSpacing: '-0.02em' }}
      >
        BILLU
      </div>

      {/* Floating skill tags */}
      <div className="flex flex-wrap justify-center gap-3 max-w-lg mb-16 pointer-events-none">
        {TAGS.map((tag, i) => (
          <span
            key={tag.label}
            ref={el => tagsRef.current[i] = el}
            className="font-mono-jet text-xs tracking-widest px-3 py-1.5 rounded-full border"
            style={{
              borderColor: '#F5F0E8',
              color: '#F5F0E8',
              background: 'transparent',
              transform: `rotate(${tag.rot}deg)`,
            }}
          >
            {tag.label}
          </span>
        ))}
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
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            width: 'clamp(260px, 40vw, 380px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            clipPath: 'polygon(0 0, calc(100% - 0px) 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* Top section */}
          <div className="px-6 pt-5 pb-3 text-center">
            <div className="font-mono-jet text-xs tracking-[0.2em] uppercase mb-1" style={{ color: '#666' }}>
              Admit One
            </div>
            <div className="font-display text-4xl tracking-wide" style={{ color: '#1A1A1A', fontSize: 'clamp(28px, 5vw, 42px)' }}>
              BILAL CURMALLY
            </div>
          </div>

          {/* Perforation */}
          <div className="ticket-perforation mx-4" />

          {/* Bottom section */}
          <div className="px-6 py-3 text-center">
            <div
              className="font-mono-jet tracking-[0.15em] uppercase"
              style={{ color: '#444', fontSize: '10px' }}
            >
              COLORIST &nbsp;·&nbsp; EDITOR &nbsp;·&nbsp; WRITER &nbsp;·&nbsp; KARACHI
            </div>
          </div>
        </div>

        {/* Click hint */}
        <div className="text-center mt-3 font-mono-jet" style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em' }}>
          CLICK TO ENTER
        </div>
      </div>
    </div>
  )
}
