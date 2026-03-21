import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../utils/useReducedMotion'

const STATS = [
  { value: '20+',              label: 'Years',        numeric: 20, suffix: '+' },
  { value: 'Edit · Color · Write', label: 'The crafts', numeric: null },
  { value: '300+',             label: 'Commercials',  numeric: 300, suffix: '+' },
]

function AnimatedStat({ stat, prefersReduced }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(prefersReduced ? stat.value : '0' + (stat.suffix || ''))
  const animated = useRef(false)

  useEffect(() => {
    if (prefersReduced || !stat.numeric || animated.current || !ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.numeric,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => setDisplay(Math.round(obj.val) + (stat.suffix || '')),
        })
        observer.disconnect()
      }
    }, { threshold: 0.5 })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [prefersReduced, stat])

  return <span ref={ref}>{stat.numeric ? display : stat.value}</span>
}

export default function Hero() {
  const sectionRef = useRef(null)
  const imageRef   = useRef(null)
  const linesRef   = useRef([])
  const scrollRef  = useRef(null)
  const prefersReduced = useReducedMotion()
  const [portraitLoaded, setPortraitLoaded] = useState(true)

  // Pre-check hero portrait so we can hide the container if it 404s
  useEffect(() => {
    const img = new Image()
    img.src = '/images/hero-portrait.jpg'
    img.onerror = () => setPortraitLoaded(false)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance: stagger text lines
      if (!prefersReduced) {
        gsap.from(linesRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        })

        // Parallax on hero image
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.set(imageRef.current, { y: self.progress * 80 })
            }
          },
        })

        // Fade scroll indicator
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '20% top',
          scrub: true,
          onUpdate: (self) => {
            if (scrollRef.current) {
              gsap.set(scrollRef.current, { opacity: 1 - self.progress * 2 })
            }
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  const lines = [
    { text: "Not your basic storyteller." },
    { text: "Edit \u2022 Color \u2022 Write" },
    { text: "Weird is the point." },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-panel relative flex flex-col"
      style={{ minHeight: '100dvh' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-12 pt-7">
        <span className="font-heading text-sm tracking-tight" style={{ color: '#999' }}>
          billu.works
        </span>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }}
          />
          <span className="font-mono-jet text-xs" style={{ color: '#aaa', fontSize: '11px' }}>
            Let's connect and exchange ideas.
          </span>
        </div>
      </div>

      {/* Main content + image */}
      <div className="flex-1 flex items-end pb-16 md:pb-20 relative">
        {/* Text block — bottom left */}
        <div className="px-6 md:px-12 z-10 relative max-w-2xl">
          <p
            ref={el => linesRef.current[0] = el}
            className="font-heading mb-3"
            style={{ color: '#999', fontSize: '14px', letterSpacing: '0.05em' }}
          >
            Hi, I'm Bilal Curmally
          </p>

          <div className="mb-6">
            {lines.map((line, i) => (
              <h1
                key={i}
                ref={el => linesRef.current[i + 1] = el}
                className="font-heading font-bold leading-tight tracking-tight"
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 56px)',
                  color: '#F5F5F0',
                  margin: 0,
                }}
              >
                {line.text}
              </h1>
            ))}
          </div>

          <div
            ref={el => linesRef.current[lines.length + 1] = el}
            className="font-mono-jet"
            style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.7, letterSpacing: '0.05em' }}
          >
            <div>Let's connect and exchange ideas.</div>
            <div>Building things that shouldn't exist.</div>
          </div>
        </div>

        {/* Hero image — right side, atmospheric ghost, not a portrait placement */}
        {portraitLoaded && <div
          className="absolute top-0 bottom-0"
          style={{ left: '0%', right: '-10%', overflow: 'hidden' }}
        >
          <div
            ref={imageRef}
            className="w-full h-full"
            style={{
              backgroundImage: 'url(/images/hero-portrait.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center 20%',
              filter: 'brightness(0.55) contrast(1.1) saturate(0.6)',
            }}
          />
          {/* Film grain overlay on portrait */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E\")",
              opacity: 0.06,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Desktop vignette — fade edges, keep center portrait visible */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 55% 40%, transparent 0%, rgba(8,8,8,0.25) 45%, #080808 80%)',
            }}
          />
          {/* Mobile vignette — left fade for text readability, keep portrait visible */}
          <div
            className="absolute inset-0 pointer-events-none md:hidden"
            style={{
              background: 'linear-gradient(to right, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.3) 40%, transparent 60%, rgba(8,8,8,0.6) 100%), linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 30%, transparent 70%, rgba(8,8,8,0.5) 100%)',
            }}
          />
        </div>}
      </div>

      {/* Stats row */}
      <div
        className="flex items-center gap-0 px-6 md:px-12 pb-8"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            <div className="py-4 pr-6 md:pr-10">
              <div
                className="font-mono-jet font-medium"
                style={{
                  color: '#F5F5F0',
                  fontSize: stat.value.length > 4
                    ? 'clamp(11px, 1.2vw, 14px)'
                    : 'clamp(20px, 3vw, 28px)',
                  letterSpacing: stat.value.length > 4 ? '0.06em' : undefined,
                }}
              >
                <AnimatedStat stat={stat} prefersReduced={prefersReduced} />
              </div>
              <div className="font-mono-jet mt-0.5" style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
                {stat.label}
              </div>
            </div>
            {i < STATS.length - 1 && (
              <div style={{ width: '1px', height: '40px', background: '#222', marginRight: '24px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: '#333' }}
      >
        <div
          className="w-px"
          style={{
            height: '40px',
            background: 'linear-gradient(to bottom, transparent, #444)',
            animation: prefersReduced ? 'none' : 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>

    </section>
  )
}
