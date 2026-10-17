import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '../utils/splitText'
import { useReducedMotion } from '../utils/useReducedMotion'

const BIO_PARAGRAPHS = [
  'I\u2019ve spent twenty years cutting and grading TV commercials in Pakistan. More than 300 of them, most on deadlines that made no sense.',
  'These days I also work with clients outside Pakistan, and I\u2019ve started writing small tools that speed up my own edit and color work. Building things was on my bucket list for years. I\u2019m finally doing it, slowly.',
]

// Spec-sheet rows, styled like the project metadata on the Work cards
const SPEC_SHEET = [
  { label: 'BASED', value: 'Karachi, Pakistan' },
  { label: 'EDIT',  value: 'Premiere Pro, DaVinci Resolve, Final Cut' },
  { label: 'COLOR', value: 'DaVinci Resolve' },
  { label: 'WRITE', value: 'Plain English, when the job needs it' },
  { label: 'CODE',  value: 'Python and AI workflow tools. Still nervous in the terminal.' },
]

const BIO_FOOTER = 'I built this site myself with Claude Code. It\u2019s my first real coding project, so if something breaks, now you know why.'

export default function About() {
  const sectionRef  = useRef(null)
  const pullRef     = useRef(null)
  const bioRef      = useRef(null)
  const sheetRef    = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Word-by-word reveal on the pull quote
      if (pullRef.current) {
        const words = splitWords(pullRef.current)
        gsap.from(words, {
          y: 25,
          opacity: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pullRef.current,
            start: 'top 80%',
          },
        })
      }

      // Bio lines stagger
      if (bioRef.current) {
        const lines = bioRef.current.querySelectorAll('.bio-line')
        gsap.from(lines, {
          x: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 80%',
          },
        })
      }

      // Spec-sheet rows slide in
      if (sheetRef.current) {
        gsap.from(sheetRef.current.querySelectorAll('.spec-row'), {
          x: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sheetRef.current,
            start: 'top 85%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-panel py-8 md:py-16 px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto">

        {/* Section label */}
        <div className="mb-12">
          <div className="relative w-full" style={{ background: '#111', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Top sprocket row */}
            <div className="flex items-center justify-between px-1" style={{ height: '18px', background: '#0a0a0a', borderBottom: '1px solid #222' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={`t${i}`}
                  style={{
                    width: '10px',
                    height: '7px',
                    borderRadius: '1.5px',
                    background: '#080808',
                    border: '0.5px solid #2a2a2a',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Center frame — title area */}
            <div className="relative flex items-center" style={{ padding: '20px 24px' }}>
              <h2
                className="font-display"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#F5F5F0', letterSpacing: '0.05em', lineHeight: 1, margin: 0 }}
              >
                ABOUT
              </h2>
            </div>

            {/* Bottom sprocket row */}
            <div className="flex items-center justify-between px-1" style={{ height: '18px', background: '#0a0a0a', borderTop: '1px solid #222' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={`b${i}`}
                  style={{
                    width: '10px',
                    height: '7px',
                    borderRadius: '1.5px',
                    background: '#080808',
                    border: '0.5px solid #2a2a2a',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div
          ref={pullRef}
          className="font-drama italic mb-12"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            color: '#F5F5F0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          Hey, Bilal here.
        </div>

        {/* Bio paragraphs */}
        <div
          ref={bioRef}
          className="font-body mb-10"
          style={{
            color: '#bbb',
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.8,
            maxWidth: '640px',
          }}
        >
          {BIO_PARAGRAPHS.map((para, i) => (
            <p key={i} className="bio-line" style={{ marginBottom: '1.2em' }}>{para}</p>
          ))}
        </div>

        {/* Spec sheet */}
        <dl
          ref={sheetRef}
          className="font-mono mb-10"
          style={{ maxWidth: '640px', borderTop: '1px solid #1a1a1a' }}
        >
          {SPEC_SHEET.map(row => (
            <div
              key={row.label}
              className="spec-row flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3"
              style={{ borderBottom: '1px solid #1a1a1a' }}
            >
              <dt style={{ color: '#777', fontSize: '11px', letterSpacing: '0.15em', minWidth: '64px' }}>
                {row.label}
              </dt>
              <dd style={{ color: '#ddd', fontSize: '13px', letterSpacing: '0.02em', lineHeight: 1.6, margin: 0 }}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Footer note */}
        <p
          className="font-body"
          style={{
            color: '#999',
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            lineHeight: 1.8,
            maxWidth: '640px',
            fontStyle: 'italic',
            margin: 0,
          }}
        >
          {BIO_FOOTER}
        </p>

      </div>
    </section>
  )
}
