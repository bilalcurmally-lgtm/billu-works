import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import { useReducedMotion } from '../utils/useReducedMotion'

function ProjectCard({ project, index, prefersReduced }) {
  const cardRef    = useRef(null)
  const metaRef    = useRef(null)
  const overlayRef = useRef(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (prefersReduced) return
    const card = cardRef.current
    const meta = metaRef.current
    if (!card || !meta) return

    const onEnter = () => {
      gsap.to(overlayRef.current, { opacity: 0.45, duration: 0.4, ease: 'power2.out' })
      gsap.to(meta, { y: -6, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(overlayRef.current, { opacity: 0.7, duration: 0.4, ease: 'power2.out' })
      gsap.to(meta, { y: 0, duration: 0.4, ease: 'power2.out' })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [prefersReduced])

  const showGradient = imgError || !project.image

  const isPlaceholder = project.url === '#'

  return (
    <a
      ref={cardRef}
      href={project.url}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      onClick={e => { if (isPlaceholder) e.preventDefault() }}
      className="relative w-full overflow-hidden rounded-2xl block group project-card"
      data-cursor="project"
      style={{
        height: 'clamp(340px, 55vh, 560px)',
        background: showGradient ? project.gradient : '#111111',
        textDecoration: 'none',
      }}
    >
      {/* Project image — lazy loaded, with gradient fallback on error */}
      {!showGradient && (
        <img
          src={project.image}
          alt={`${project.title} project`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.45) contrast(1.05)',
          }}
        />
      )}

      {/* Dark gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)',
          opacity: 0.7,
        }}
      />

      {/* Project title */}
      <div className="absolute top-6 left-7">
        <h3
          className="font-display"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: '#F5F5F0', letterSpacing: '0.03em', lineHeight: 1 }}
        >
          {project.title}
        </h3>
      </div>

      {/* Arrow icon */}
      <div
        className="absolute top-6 right-6 p-2 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(245,240,232,0.15)', border: '1px solid rgba(245,240,232,0.2)' }}
      >
        <ArrowUpRight size={18} color="#F5F0E8" strokeWidth={1.5} />
      </div>

      {/* Metadata — bottom left */}
      <div
        ref={metaRef}
        className="absolute bottom-7 left-7 font-mono-jet"
        style={{ fontSize: '11px', color: '#888', lineHeight: 2, letterSpacing: '0.08em' }}
      >
        <div><span style={{ color: '#444' }}>CLIENT ————</span>{' '}<span style={{ color: '#ccc' }}>{project.client}</span></div>
        {project.year && <div><span style={{ color: '#444' }}>YEAR ——————</span>{' '}<span style={{ color: '#ccc' }}>{project.year}</span></div>}
        <div><span style={{ color: '#444' }}>TYPE ———————</span>{' '}<span style={{ color: '#ccc' }}>{project.type}</span></div>
      </div>

      {/* Mini ticket stub on hover/focus */}
      <div className="absolute bottom-7 right-6 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
        <div className="rounded-lg px-3 py-1.5" style={{ background: '#F5F0E8', color: '#1A1A1A' }}>
          <span className="font-mono-jet" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </a>
  )
}

export default function Work() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const wrapperRefs = useRef([])   // refs to the wrapper divs (for GSAP stacking)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Section header entrance
      gsap.from(headerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      const wrappers = wrapperRefs.current.filter(Boolean)

      wrappers.forEach((wrapper, i) => {
        // Entrance: card rises in from below
        gsap.from(wrapper, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 88%',
          },
        })

        // Stacking: as the NEXT card enters the viewport, this card recedes
        const nextWrapper = wrappers[i + 1]
        if (nextWrapper) {
          gsap.to(wrapper, {
            scale: 0.95,
            filter: 'blur(5px)',
            opacity: 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: nextWrapper,
              start: 'top 72%',
              end: 'top 15%',
              scrub: true,
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-panel py-24 px-6 md:px-12"
    >
      {/* Film strip header — proper 35mm film strip with sprocket holes */}
      <div ref={headerRef} className="mb-12">
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
              WORK
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

      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <div key={project.id} ref={el => wrapperRefs.current[i] = el}>
            <ProjectCard
              project={project}
              index={i}
              prefersReduced={prefersReduced}
            />
          </div>
        ))}
      </div>

      <div className="film-strip w-full mt-12" />
    </section>
  )
}
