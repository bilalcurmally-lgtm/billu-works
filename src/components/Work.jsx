import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'
import { projects } from '../data/projects'
import { useReducedMotion } from '../utils/useReducedMotion'
import { useIsTouch } from '../utils/useIsTouch'
import ProjectLightbox from './ProjectLightbox'
import ProjectMeta from './ProjectMeta'

// Where stacked cards stick: below the reel index bar, each one a few px lower
// so the edges of the cards underneath stay visible like a deck of frames.
const STACK_TOP = 104
const STACK_STEP = 10
const pad2 = (n) => String(n).padStart(2, '0')

function ProjectCard({ project, index, onOpenLightbox }) {
  const [imgRetries, setImgRetries] = useState(0)
  const [imgFailed, setImgFailed] = useState(false)
  const showGradient = imgFailed || !project.image

  return (
    <div
      onClick={(e) => { e.preventDefault(); onOpenLightbox(project) }}
      className="relative w-full overflow-hidden rounded-2xl block group project-card cursor-pointer"
      data-cursor="project"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenLightbox(project) } }}
      aria-label={`Play ${project.title}`}
      style={{
        height: 'clamp(420px, calc(100vh - 160px), 640px)',
        background: showGradient ? project.gradient : '#111111',
        border: '1px solid #1a1a1a',
      }}
    >
      {/* Project still — lazy loaded, with gradient fallback after 2 retries */}
      {!showGradient && (
        <img
          key={imgRetries}
          src={imgRetries > 0 ? `${project.image}?retry=${imgRetries}` : project.image}
          alt={`${project.title} still`}
          loading="lazy"
          width={1200}
          height={675}
          onError={() => {
            if (imgRetries < 2) setImgRetries(r => r + 1)
            else setImgFailed(true)
          }}
          className="absolute inset-0 w-full h-full project-still"
          style={{ objectFit: 'cover', objectPosition: project.imagePosition || 'center' }}
        />
      )}

      {/* Scrims: top keeps the reel number readable over burned-in logos, bottom carries the title */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, transparent 22%, transparent 45%, rgba(8,8,8,0.92) 100%)',
        }}
      />

      {/* Reel number — top left */}
      <div className="absolute top-6 left-7 font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#bbb' }}>
        REEL {pad2(index + 1)}<span style={{ color: '#666' }}> / {pad2(projects.length)}</span>
      </div>

      {/* Play stub — top right, always visible so touch users know the card plays */}
      <div className="absolute top-5 right-5 play-stub">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 font-mono"
          style={{ background: '#F5F0E8', color: '#1A1A1A', fontSize: '10px', letterSpacing: '0.18em' }}
        >
          <Play size={11} fill="#1A1A1A" strokeWidth={0} />
          PLAY
        </div>
      </div>

      {/* Title + metadata — bottom left */}
      <div className="absolute bottom-7 left-7 right-7 project-caption">
        <h3
          className="font-display mb-3"
          style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: '#F5F5F0', letterSpacing: '0.02em', lineHeight: 0.95, margin: 0 }}
        >
          {project.title}
        </h3>
        <div className="mt-3">
          <ProjectMeta project={project} />
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const sectionRef  = useRef(null)
  const headerRef   = useRef(null)
  const indexRef    = useRef(null)
  const progressRef = useRef(null)
  const wrapperRefs = useRef([])
  const pinTriggers = useRef([])
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()
  const stacking = !prefersReduced && !isTouch
  const [active, setActive] = useState(0)
  const [lightboxProject, setLightboxProject] = useState(null)
  const closeLightbox = useCallback(() => setLightboxProject(null), [])

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      const wrappers = wrapperRefs.current.filter(Boolean)
      const last = wrappers[wrappers.length - 1]

      // Which reel is on screen — drives the index bar
      wrappers.forEach((wrapper, i) => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 55%',
          onEnter: () => setActive(i),
          onLeaveBack: () => setActive(Math.max(0, i - 1)),
        })
      })

      // Reel progress line across the index bar (desktop stacking only)
      if (progressRef.current) gsap.fromTo(progressRef.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrappers[0],
          start: `top ${STACK_TOP}px`,
          endTrigger: last,
          end: `top ${STACK_TOP + STACK_STEP * (wrappers.length - 1)}px`,
          scrub: true,
        },
      })

      if (!stacking) {
        wrappers.forEach((wrapper) => {
          gsap.from(wrapper, {
            y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: wrapper, start: 'top 88%' },
          })
        })
        return
      }

      // Stacking: each card pins under the index bar; the next card slides over it
      // while the one underneath settles back (scale 0.95, blur 8px, opacity 0.6).
      pinTriggers.current = wrappers.map((wrapper, i) => {
        const top = STACK_TOP + STACK_STEP * i
        const st = ScrollTrigger.create({
          trigger: wrapper,
          start: `top ${top}px`,
          endTrigger: last,
          end: `top ${STACK_TOP + STACK_STEP * (wrappers.length - 1)}px`,
          pin: true,
          pinSpacing: false,
        })

        const next = wrappers[i + 1]
        if (next) {
          gsap.to(wrapper.firstElementChild, {
            scale: 0.95,
            filter: 'blur(8px)',
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: `top ${top + STACK_STEP}px`,
              scrub: true,
            },
          })
        }
        return st
      })
    }, sectionRef)

    return () => {
      pinTriggers.current = []
      ctx.revert()
    }
  }, [prefersReduced, stacking])

  const jumpTo = (i) => {
    const st = pinTriggers.current[i]
    if (st) {
      gsap.to(window, { scrollTo: st.start + 1, duration: 1, ease: 'power2.inOut' })
    } else {
      const el = wrapperRefs.current[i]
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - STACK_TOP, behavior: prefersReduced ? 'auto' : 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-panel py-8 md:py-16 px-6 md:px-12"
    >
      {/* Film strip header — proper 35mm film strip with sprocket holes */}
      <div ref={headerRef} className="mb-6">
        <div className="relative w-full" style={{ background: '#111', borderRadius: '4px', overflow: 'hidden' }}>
          <div className="flex items-center justify-between px-1" style={{ height: '18px', background: '#0a0a0a', borderBottom: '1px solid #222' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={`t${i}`} style={{ width: '10px', height: '7px', borderRadius: '1.5px', background: '#080808', border: '0.5px solid #2a2a2a', flexShrink: 0 }} />
            ))}
          </div>

          <div className="relative flex items-end justify-between gap-4" style={{ padding: '20px 24px' }}>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#F5F5F0', letterSpacing: '0.05em', lineHeight: 1, margin: 0 }}
            >
              WORK
            </h2>
            <span className="font-mono hidden sm:block" style={{ color: '#777', fontSize: '11px', letterSpacing: '0.15em', paddingBottom: '6px' }}>
              {pad2(projects.length)} REELS · CLICK TO SCREEN
            </span>
          </div>

          <div className="flex items-center justify-between px-1" style={{ height: '18px', background: '#0a0a0a', borderTop: '1px solid #222' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={`b${i}`} style={{ width: '10px', height: '7px', borderRadius: '1.5px', background: '#080808', border: '0.5px solid #2a2a2a', flexShrink: 0 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Reel index — sticks to the top while the cards stack (desktop only) */}
      {stacking && <nav
        ref={indexRef}
        aria-label="Projects"
        className="sticky mb-6"
        style={{ top: 0, zIndex: 20, background: '#080808', paddingTop: '28px', paddingBottom: '14px' }}
      >
        <ol className="flex flex-wrap gap-x-5 gap-y-2 font-mono md:pr-[280px]" style={{ fontSize: '11px', letterSpacing: '0.14em', listStyle: 'none', margin: 0, padding: 0 }}>
          {projects.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={active === i ? 'true' : undefined}
                className="reel-index-btn"
                style={{
                  color: active === i ? '#F5F5F0' : '#666',
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
              >
                <span style={{ color: active === i ? '#F5F0E8' : '#444' }}>{pad2(i + 1)}</span>{' '}
                <span className="hidden lg:inline">{p.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3" style={{ height: '1px', background: '#1a1a1a' }}>
          <div ref={progressRef} style={{ height: '1px', background: '#F5F0E8', transformOrigin: 'left center', transform: 'scaleX(0)' }} />
        </div>
      </nav>}

      <div className="flex flex-col gap-6 md:gap-10">
        {projects.map((project, i) => (
          <div key={project.id} ref={el => wrapperRefs.current[i] = el}>
            <ProjectCard project={project} index={i} onOpenLightbox={setLightboxProject} />
          </div>
        ))}
      </div>

      <div className="film-strip w-full mt-12" />

      {lightboxProject && (
        <ProjectLightbox project={lightboxProject} onClose={closeLightbox} />
      )}
    </section>
  )
}
