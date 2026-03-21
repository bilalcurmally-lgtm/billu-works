import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, X } from 'lucide-react'
import { useReducedMotion } from '../utils/useReducedMotion'
import { useScrollLock } from '../utils/useScrollLock'
import ProjectMeta from './ProjectMeta'

export default function ProjectLightbox({ project, onClose }) {
  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const scrollLock = useScrollLock()

  useEffect(() => {
    scrollLock.lock()

    // Entrance animation
    if (!prefersReduced) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(cardRef.current, { scale: 0.92, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.1 })
    }

    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      scrollLock.unlock()
    }
  }, [onClose, prefersReduced, scrollLock])

  if (!project) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 9995, background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#F5F0E8',
          color: '#1A1A1A',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest" style={{ color: '#888' }}>
            PROJECT DETAILS
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(26,26,26,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="Close lightbox"
          >
            <X size={16} color="#1A1A1A" />
          </button>
        </div>

        <div className="ticket-perforation mx-4 mb-4" />

        {/* Project image */}
        {project.image && (
          <div className="mx-6 mb-4 rounded-xl overflow-hidden" style={{ height: '200px', background: '#111' }}>
            <img
              src={project.image}
              alt={`${project.title} project`}
              className="w-full h-full"
              style={{ objectFit: 'cover', filter: 'brightness(0.8) contrast(1.05)' }}
            />
          </div>
        )}

        {/* Title */}
        <div className="px-6 mb-3">
          <h3 className="font-display" style={{ fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: '0.03em', lineHeight: 1, margin: 0 }}>
            {project.title}
          </h3>
        </div>

        {/* Metadata */}
        <div className="px-6 mb-4">
          <ProjectMeta project={project} color="#999" valueColor="#666" />
        </div>

        <div className="ticket-perforation mx-4 mb-4" />

        {/* CTA */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <span className="font-mono" style={{ fontSize: '10px', color: '#aaa', letterSpacing: '0.12em' }}>
            billu.works
          </span>
          {project.url && project.url !== '#' && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-xs tracking-widest hover:opacity-80 transition-opacity"
              style={{ background: '#1A1A1A', color: '#F5F0E8', letterSpacing: '0.1em', textDecoration: 'none' }}
            >
              WATCH
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
