import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

function ProjectCard({ project, index }) {
  const cardRef    = useRef(null)
  const metaRef    = useRef(null)
  const overlayRef = useRef(null)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return
    const card = cardRef.current
    const meta = metaRef.current

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

  return (
    <div
      ref={cardRef}
      className="relative w-full overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        height: 'clamp(340px, 55vh, 560px)',
        background: '#111111',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.45) contrast(1.05)',
        }}
      />

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

      {/* Arrow link */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 p-2 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'rgba(245,240,232,0.15)', border: '1px solid rgba(245,240,232,0.2)' }}
        aria-label={`View ${project.title}`}
        onClick={e => { if (project.url === '#') e.preventDefault() }}
      >
        <ArrowUpRight size={18} color="#F5F0E8" strokeWidth={1.5} />
      </a>

      {/* Metadata overlay — bottom left */}
      <div
        ref={metaRef}
        className="absolute bottom-7 left-7 font-mono-jet"
        style={{ fontSize: '11px', color: '#888', lineHeight: 2, letterSpacing: '0.08em' }}
      >
        <div>
          <span style={{ color: '#444' }}>CLIENT ————</span>{' '}
          <span style={{ color: '#ccc' }}>{project.client}</span>
        </div>
        <div>
          <span style={{ color: '#444' }}>YEAR ——————</span>{' '}
          <span style={{ color: '#ccc' }}>{project.year}</span>
        </div>
        <div>
          <span style={{ color: '#444' }}>TYPE ———————</span>{' '}
          <span style={{ color: '#ccc' }}>{project.type}</span>
        </div>
      </div>

      {/* Mini ticket stub on hover */}
      <div
        className="absolute bottom-7 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div
          className="rounded-lg px-3 py-1.5"
          style={{ background: '#F5F0E8', color: '#1A1A1A' }}
        >
          <span className="font-mono-jet" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const cardsRef   = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-panel py-24 px-6 md:px-12"
    >
      {/* Film strip decoration */}
      <div className="film-strip w-full mb-12" />

      {/* Section header */}
      <div ref={headerRef} className="flex items-end justify-between mb-12">
        <div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', color: '#F5F5F0', letterSpacing: '0.03em', lineHeight: 1, margin: 0 }}
          >
            WORK
          </h2>
        </div>
        <span className="font-mono-jet text-xs pb-2" style={{ color: '#444', letterSpacing: '0.12em' }}>
          SELECTED PROJECTS
        </span>
      </div>

      <div
        style={{ borderTop: '1px solid #1a1a1a' }}
        className="mb-10"
      />

      {/* Project cards */}
      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <div key={project.id} ref={el => cardsRef.current[i] = el}>
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>

      {/* Film strip decoration bottom */}
      <div className="film-strip w-full mt-12" />
    </section>
  )
}
