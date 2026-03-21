import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '../utils/splitText'
import { useReducedMotion } from '../utils/useReducedMotion'

const SKILLS = [
  'DaVinci Resolve', 'Premiere Pro', 'Final Cut', 'AI Workflows',
]

const BIO_PARAGRAPHS = [
  'For two decades I\u2019ve been in the trenches of the Pakistani TVC industry \u2014 handling all kinds of projects, all kinds of clients, all kinds of impossible deadlines.',
  'Now I\u2019m setting my sights beyond the borders and the editing timeline. I\u2019m trying to mix my creative rambling and a life long bucket list to build things into a new avenue.',
]

const BIO_LINES = [
  'Based in Karachi. Thinking global.',
  'DaVinci Resolve is home for color.',
  'Premiere & Resolve for the edit.',
  'Plain words for the rest.',
  'And slowly \u2014 very slowly \u2014 overcoming the anxiety of working in the CLI.',
]

const BIO_FOOTER = [
  'Vibe-coded this entire portfolio myself \u2014 my first real vibe-coding project.',
  'Still figuring out Python, but as always, I\u2019ll find a way.',
]

export default function About() {
  const sectionRef  = useRef(null)
  const pullRef     = useRef(null)
  const bioRef      = useRef(null)
  const tagsRef     = useRef([])
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

      // Tags pop in
      gsap.from(tagsRef.current.filter(Boolean), {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: tagsRef.current[0],
          start: 'top 90%',
        },
      })
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

        {/* Structured lines */}
        <div
          className="font-body mb-10"
          style={{
            color: '#bbb',
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.8,
            maxWidth: '640px',
          }}
        >
          {BIO_LINES.map((line, i) => (
            <span key={i} className="bio-line" style={{ display: 'block' }}>{line}</span>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="font-body mb-16"
          style={{
            color: '#999',
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            lineHeight: 1.8,
            maxWidth: '640px',
            fontStyle: 'italic',
          }}
        >
          {BIO_FOOTER.map((line, i) => (
            <span key={i} style={{ display: 'block' }}>{line}</span>
          ))}
        </div>

        {/* Skills tags */}
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill, i) => (
            <span
              key={skill}
              ref={el => tagsRef.current[i] = el}
              className="font-mono rounded-full px-4 py-2"
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                border: '1px solid #2a2a2a',
                color: '#999',
                background: '#0e0e0e',
              }}
            >
              {skill}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
