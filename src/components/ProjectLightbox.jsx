import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ArrowUpRight, X } from 'lucide-react'
import { useReducedMotion } from '../utils/useReducedMotion'
import { useScrollLock } from '../utils/useScrollLock'
import { getVideoEmbed, getProviderName } from '../utils/videoEmbed'
import ProjectMeta from './ProjectMeta'

export default function ProjectLightbox({ project, onClose }) {
  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const scrollLock = useScrollLock()
  const embed = getVideoEmbed(project?.url)
  const provider = getProviderName(project?.url)

  useEffect(() => {
    scrollLock.lock()
    closeRef.current?.focus()

    // Entrance animation
    if (!prefersReduced) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(cardRef.current, { scale: 0.94, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.1 })
    }

    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      scrollLock.unlock()
    }
  }, [onClose, prefersReduced, scrollLock])

  if (!project) return null

  // Portal to <body> so the player escapes the Work section's stacking context and pinned cards
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 10010, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}, now screening`}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#F5F0E8',
          color: '#1A1A1A',
          // Keep the 16:9 player under ~58vh tall so the whole ticket fits on a laptop screen
          width: 'min(960px, calc(58vh * 16 / 9 + 48px), 100%)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest flex items-center gap-2" style={{ color: '#888' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#1A1A1A', animation: prefersReduced ? 'none' : 'pulse 2s infinite' }} />
            NOW SCREENING
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(26,26,26,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="Close lightbox"
          >
            <X size={16} color="#1A1A1A" />
          </button>
        </div>

        <div className="ticket-perforation mx-4 mb-4" />

        {/* Player — falls back to the still if the link can't be embedded */}
        <div className="mx-6 mb-5 rounded-xl overflow-hidden" style={{ aspectRatio: '16 / 9', background: '#080808' }}>
          {embed ? (
            <iframe
              src={embed.src}
              title={`${project.title} video`}
              className="w-full h-full block"
              style={{ border: 0 }}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : project.image && (
            <img
              src={project.image}
              alt={`${project.title} still`}
              className="w-full h-full"
              style={{ objectFit: 'cover', filter: 'brightness(0.8) contrast(1.05)' }}
            />
          )}
        </div>

        {/* Title + metadata */}
        <div className="px-6 mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.03em', lineHeight: 1, margin: 0 }}>
            {project.title}
          </h3>
          <ProjectMeta project={project} color="#999" valueColor="#555" />
        </div>

        <div className="ticket-perforation mx-4 mb-4" />

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between gap-4">
          <span className="font-mono" style={{ fontSize: '10px', color: '#999', letterSpacing: '0.12em' }}>
            ESC TO LEAVE THE THEATRE
          </span>
          {project.url && project.url !== '#' && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs tracking-widest hover:opacity-80 transition-opacity"
              style={{ background: '#1A1A1A', color: '#F5F0E8', letterSpacing: '0.1em', textDecoration: 'none', fontSize: '10px' }}
            >
              WATCH ON {provider ? provider.toUpperCase() : 'SITE'}
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
