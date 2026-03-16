import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  'DaVinci Resolve', 'Premiere Pro', 'Python',
  'After Effects', 'DCTL', 'AI Workflows',
  'Final Cut', 'Audition',
]

const BIO_LINES = [
  '20 years in post-production.',
  'Karachi-based. Internationally minded.',
  'I grade on DaVinci Resolve.',
  'I edit on Premiere and Resolve.',
  'I write in plain English.',
  'I code in Python (badly, but improving).',
  'I build AI tools that make my own workflow',
  'faster — and sometimes sell them to people',
  'who have the same problems.',
]

export default function About() {
  const sectionRef  = useRef(null)
  const pullRef     = useRef(null)
  const bioRef      = useRef(null)
  const tagsRef     = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-panel py-24 px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto">

        {/* Section label */}
        <div className="mb-16 flex items-center gap-4">
          <span className="font-display text-sm tracking-widest" style={{ color: '#444', fontSize: '14px' }}>
            ABOUT
          </span>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
        </div>

        {/* Contrasting statement */}
        <p
          className="font-heading mb-4"
          style={{ color: '#555', fontSize: 'clamp(14px, 1.5vw, 18px)', lineHeight: 1.6 }}
        >
          Most editors deliver footage.
        </p>

        <div
          ref={pullRef}
          className="font-drama italic mb-16"
          style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            color: '#F5F5F0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          I deliver the feeling you wanted it to have.
        </div>

        {/* Bio */}
        <div
          ref={bioRef}
          className="font-body mb-16"
          style={{
            color: '#999',
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.8,
            maxWidth: '640px',
          }}
        >
          {BIO_LINES.map((line, i) => (
            <span key={i} className="bio-line" style={{ display: 'block' }}>{line}</span>
          ))}
        </div>

        {/* Skills tags */}
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill, i) => (
            <span
              key={skill}
              ref={el => tagsRef.current[i] = el}
              className="font-mono-jet rounded-full px-4 py-2"
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                border: '1px solid #2a2a2a',
                color: '#777',
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
