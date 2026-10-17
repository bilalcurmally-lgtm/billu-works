import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../utils/useReducedMotion'

// Jagged clip-path for a torn paper edge. side = 'left' | 'right'.
function tornEdge(side, teeth = 14, depth = 5) {
  const pts = []
  for (let i = 0; i <= teeth * 2; i++) {
    const y = (i / (teeth * 2)) * 100
    const x = i % 2 === 0 ? 0 : depth
    pts.push(side === 'left' ? `${x}px ${y}%` : `calc(100% - ${x}px) ${y}%`)
  }
  return side === 'left'
    ? `polygon(100% 0, 100% 100%, ${pts.reverse().join(', ')})`
    : `polygon(0 0, ${pts.join(', ')}, 0 100%)`
}

// Half-circle bites at the top and bottom of the tear line
function Notch({ position }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-8px',
        [position]: '-8px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: '#080808',
        zIndex: 2,
      }}
    />
  )
}

export default function OpeningAnimation({ onComplete }) {
  const overlayRef  = useRef(null)
  const portraitRef = useRef(null)
  const presentsRef = useRef(null)
  const nameRef     = useRef(null)
  const ticketRef   = useRef(null)
  const bodyRef     = useRef(null)
  const stubRef     = useRef(null)
  const hintRef     = useRef(null)
  const tlRef       = useRef(null)
  const pulseRef    = useRef(null)
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
    pulseRef.current?.kill()
    gsap.set(ticketRef.current, { scale: 1 })

    // Fly the torn stub to where the nav stub lives (top-right corner)
    const stubBox = stubRef.current.getBoundingClientRect()
    const targetX = window.innerWidth - 24 - 60
    const targetY = 24 + 22
    const dx = targetX - (stubBox.left + stubBox.width / 2)
    const dy = targetY - (stubBox.top + stubBox.height / 2)

    const exit = gsap.timeline({ onComplete })
    exit
      // Tension: both halves pull apart a hair
      .to(hintRef.current, { opacity: 0, duration: 0.15 })
      .to(bodyRef.current, { x: -3, duration: 0.08, ease: 'power1.out' }, 0)
      .to(stubRef.current, { x: 3, duration: 0.08, ease: 'power1.out' }, 0)
      // Rip
      .set(bodyRef.current, { clipPath: tornEdge('right') })
      .set(stubRef.current, { clipPath: tornEdge('left') })
      .to(stubRef.current, { x: 28, y: -14, rotation: 9, duration: 0.22, ease: 'power2.out' })
      .to(bodyRef.current, { x: -8, rotation: -2, duration: 0.22, ease: 'power2.out' }, '<')
      // Stub keeps going to the corner; the rest of the ticket drops out of frame
      .to(stubRef.current, { x: `+=${dx}`, y: `+=${dy}`, rotation: -4, scale: 0.4, duration: 0.6, ease: 'power3.inOut' })
      .to(bodyRef.current, { y: window.innerHeight * 0.7, rotation: -14, opacity: 0, duration: 0.55, ease: 'power2.in' }, '<')
      .to([nameRef.current, presentsRef.current, portraitRef.current], { scale: 1.04, opacity: 0, duration: 0.45, ease: 'power2.inOut' }, '<0.05')
      // Stub lands where the nav stub will appear, then the house lights come up
      .to(overlayRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '+=0.05')
  }

  useEffect(() => {
    if (prefersReduced) {
      finish()
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl
    const portraitTarget = window.innerWidth < 768 ? 0.4 : 0.3

    gsap.set([portraitRef.current, nameRef.current, presentsRef.current], { opacity: 0 })
    gsap.set(ticketRef.current, { opacity: 0, y: 60, pointerEvents: 'none' })

    tl
      .to(presentsRef.current, { opacity: 1, duration: 0.5, delay: 0.25, ease: 'power2.out' })
      .to(nameRef.current, { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.15')
      // Portrait flickers on like a projector lamp warming up
      .to(portraitRef.current, { opacity: portraitTarget * 0.6, duration: 0.06 }, '-=0.2')
      .to(portraitRef.current, { opacity: 0.05, duration: 0.06 })
      .to(portraitRef.current, { opacity: portraitTarget * 0.8, duration: 0.05 })
      .to(portraitRef.current, { opacity: 0.12, duration: 0.08 })
      .to(portraitRef.current, { opacity: portraitTarget, duration: 0.9, ease: 'power2.inOut' })
      .to(ticketRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(ticketRef.current, { pointerEvents: 'auto' })
          pulseRef.current = gsap.to(ticketRef.current, {
            scale: 1.015,
            duration: 1.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        },
      }, '-=0.5')

    return () => { tl.kill(); pulseRef.current?.kill() }
  }, []) // eslint-disable-line -- one-time animation, intentionally no deps

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish() }
  }

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
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      />

      {/* Dark vignette to push portrait further back */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(8,8,8,0.4) 60%, rgba(8,8,8,0.85) 100%)',
        }}
      />

      {/* Title card line */}
      <div
        ref={presentsRef}
        className="font-mono relative select-none"
        style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#888', marginBottom: '-0.5rem' }}
      >
        BILLU.WORKS PRESENTS
      </div>

      {/* BILLU — clean gradient text over the ghost portrait */}
      <div
        ref={nameRef}
        className="font-display select-none text-center leading-none mb-8 relative"
        style={{
          fontSize: 'clamp(9rem, 28vw, 38rem)',
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

      {/* Cinema ticket: body + tear-off stub */}
      <div
        ref={ticketRef}
        onClick={finish}
        onKeyDown={onKeyDown}
        className="relative cursor-pointer select-none"
        style={{ transformOrigin: 'center center' }}
        role="button"
        tabIndex={0}
        aria-label="Enter site"
      >
        <div className="flex" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}>
          {/* Body */}
          <div
            ref={bodyRef}
            className="rounded-l-2xl"
            style={{ background: '#F5F0E8', color: '#1A1A1A', width: 'clamp(220px, 32vw, 340px)', padding: '18px 20px 16px' }}
          >
            <div className="font-mono uppercase" style={{ color: '#666', fontSize: '10px', letterSpacing: '0.25em' }}>
              Admit One
            </div>
            <div className="font-display" style={{ fontSize: 'clamp(26px, 3.6vw, 38px)', lineHeight: 1, letterSpacing: '0.02em', margin: '6px 0 12px' }}>
              BILAL CURMALLY
            </div>
            <div
              className="font-mono grid grid-cols-2 gap-x-3 gap-y-1"
              style={{ fontSize: '9px', letterSpacing: '0.12em', color: '#555', borderTop: '1px dashed rgba(26,26,26,0.3)', paddingTop: '10px' }}
            >
              <span className="whitespace-nowrap">RUNTIME <b style={{ color: '#1A1A1A', fontWeight: 500 }}>20 YRS</b></span>
              <span className="whitespace-nowrap">SCREEN <b style={{ color: '#1A1A1A', fontWeight: 500 }}>KHI</b></span>
              <span className="col-span-2">RATED <b style={{ color: '#1A1A1A', fontWeight: 500 }}>PG · PROPERLY GRADED</b></span>
            </div>
          </div>

          {/* Stub — this is the bit you keep (it becomes the nav) */}
          <div
            ref={stubRef}
            className="relative rounded-r-2xl flex flex-col items-center justify-center"
            style={{
              background: '#F5F0E8',
              color: '#1A1A1A',
              width: 'clamp(76px, 9vw, 96px)',
              borderLeft: '2px dashed rgba(26,26,26,0.35)',
            }}
          >
            <Notch position="top" />
            <Notch position="bottom" />
            <div
              className="font-display"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '20px', letterSpacing: '0.08em' }}
            >
              KEEP THIS
            </div>
            <div className="font-mono mt-2" style={{ fontSize: '8px', letterSpacing: '0.1em', color: '#777' }}>
              Nº 0001
            </div>
          </div>
        </div>

        {/* Hint */}
        <div
          ref={hintRef}
          className="text-center mt-4 font-mono"
          style={{ fontSize: '10px', color: '#999', letterSpacing: '0.2em' }}
        >
          TEAR TO ENTER ✂
        </div>
      </div>
    </div>
  )
}
