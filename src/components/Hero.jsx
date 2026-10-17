import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../utils/useReducedMotion'

const STATS = [
  { value: '20+',              label: 'Years',        numeric: 20, suffix: '+' },
  { value: 'Edit · Color · Write', mobileValue: 'Edit\nColor\nWrite', label: 'The crafts', numeric: null },
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const textValue = stat.numeric ? display : (isMobile && stat.mobileValue ? stat.mobileValue : stat.value)

  return <span ref={ref} style={stat.mobileValue ? { whiteSpace: 'pre-line' } : undefined}>{textValue}</span>
}

export default function Hero() {
  const sectionRef    = useRef(null)
  const imageWrapRef  = useRef(null)
  const imageRef      = useRef(null)
  const linesRef      = useRef([])
  const scrollRef     = useRef(null)
  const prefersReduced = useReducedMotion()
  const [portraitLoaded, setPortraitLoaded] = useState(true)

  // Pre-check hero portrait so we can hide the container if it 404s
  useEffect(() => {
    const img = new Image()
    img.src = '/images/hero-portrait.png'
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

        // Parallax on hero image (move img inside container, not the container itself,
        // so the bottom-fade overlay stays anchored and seams don't appear)
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.set(imageRef.current, { y: self.progress * 60 })
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
    { text: "I cut commercials and grade them." },
    { text: "Now I'm learning to build the tools." },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-panel relative flex flex-col"
      style={{ minHeight: '100dvh' }}
    >
      {/* Top bar */}
      <div className="px-6 md:px-12 pt-7">
        <span className="font-heading text-sm tracking-tight" style={{ color: '#999' }}>
          billu.works
        </span>
        <div className="hidden md:flex items-center gap-2 mt-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }}
          />
          <span className="font-mono text-xs" style={{ color: '#aaa', fontSize: '11px' }}>
            Taking on new projects
          </span>
        </div>
      </div>

      {/* Main content + image */}
      <div className="flex-1 flex items-end pb-16 md:pb-20 relative">
        {/* Text block — bottom left */}
        <div className="px-6 md:px-12 pr-20 md:pr-12 z-10 relative max-w-2xl">
          <p
            ref={el => linesRef.current[0] = el}
            className="font-heading mb-3"
            style={{ color: '#999', fontSize: '14px', letterSpacing: '0.05em' }}
          >
            Bilal Curmally · Editor &amp; Colorist
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
            className="font-mono"
            style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.7, letterSpacing: '0.05em' }}
          >
            <div>Karachi-based. Clients in Pakistan and abroad.</div>
            <div>Lately: building things that probably shouldn't exist.</div>
          </div>
        </div>

        {/* Hero image — right side, Resolve-masked PNG with lighten blend */}
        {portraitLoaded && <div
          ref={imageWrapRef}
          className="absolute pointer-events-none overflow-hidden hero-portrait-wrap"
          style={{
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <img
            ref={imageRef}
            src="/images/hero-portrait.png"
            alt=""
            className="hero-portrait-img"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'lighten',
            }}
          />
          {/* Bottom fade overlay to blend legs seamlessly */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: '30%',
              background: 'linear-gradient(to bottom, transparent, #080808)',
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
                className="font-mono font-medium text-left"
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
              <div className="font-mono mt-0.5" style={{ color: '#999', fontSize: '11px', letterSpacing: '0.1em' }}>
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
