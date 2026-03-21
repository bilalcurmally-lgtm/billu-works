import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'
import { useReducedMotion } from '../utils/useReducedMotion'
import { useScrollLock } from '../utils/useScrollLock'

const NAV_ITEMS = [
  { num: '01', label: 'WORK',    id: 'work' },
  { num: '02', label: 'ABOUT',   id: 'about' },
  { num: '03', label: 'CONTACT', id: 'contact' },
]

/* ── Notch helper ─────────────────────────────────────────
   Semicircle that bites into ticket edges. Reduces 16 inline-styled
   divs to clean declarative usage: <Notch top left size={12} />
   ─────────────────────────────────────────────────────────── */
function Notch({ top, left, size = 12, z = 2 }) {
  const half = size / 2
  return (
    <div style={{
      position: 'absolute',
      [top !== undefined ? 'top' : 'bottom']: `-${half}px`,
      [left !== undefined ? 'left' : 'right']: `-${half}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: '#080808',
      zIndex: z,
    }} />
  )
}

/* ── Perforation with edge notches ────────────────────────── */
function Perforation({ size = 14, children }) {
  return (
    <div className="relative mx-0" style={{ borderTop: '2px dashed rgba(26,26,26,0.3)' }}>
      <Notch top left size={size} />
      <Notch top size={size} /> {/* right */}
      {children}
    </div>
  )
}

export default function TicketNav() {
  const [open, setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const stubRef      = useRef(null)
  const overlayRef   = useRef(null)
  const tlRef        = useRef(null)
  const isAnimating  = useRef(false)
  const magneticRef  = useMagneticButton(0.25)
  const prefersReduced = useReducedMotion()
  const scrollLock = useScrollLock()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3 }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) closeNav() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const openNav = () => {
    if (isAnimating.current || open) return
    isAnimating.current = true
    setOpen(true)
    scrollLock.lock()

    gsap.set(overlayRef.current, { display: 'flex', scale: 0.6, opacity: 0, transformOrigin: 'top right' })
    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false } })
    tl.to(overlayRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
    tlRef.current = tl
  }

  const closeNav = () => {
    if (isAnimating.current || !open) return
    isAnimating.current = true
    scrollLock.unlock()

    const tl = gsap.timeline({
      onComplete: () => {
        setOpen(false)
        gsap.set(overlayRef.current, { display: 'none' })
        isAnimating.current = false
      }
    })
    tl.to(overlayRef.current, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power3.in', transformOrigin: 'top right' })
    tlRef.current = tl
  }

  const scrollTo = (id) => {
    closeNav()
    setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return

      // Kill any in-progress scroll tweens
      gsap.killTweensOf(window)

      // Flag body so App.jsx skips expensive onUpdate transforms during scroll
      document.body.classList.add('nav-scrolling')

      // Reset all stacked panels to neutral — prevents blur/scale jank mid-scroll
      document.querySelectorAll('[data-scroll="stack"]').forEach(panel => {
        gsap.set(panel, { scale: 1, filter: 'none', opacity: 1 })
      })

      gsap.to(window, {
        scrollTo: { y: el, offsetY: 0, autoKill: false },
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          document.body.classList.remove('nav-scrolling')
          ScrollTrigger.refresh()
        }
      })
    }, 350)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          COLLAPSED TICKET STUB
          Wide horizontal cinema ticket — fixed top-right
          ═══════════════════════════════════════════════════════════ */}
      <div
        ref={el => { stubRef.current = el; magneticRef.current = el }}
        onClick={openNav}
        className="fixed top-5 right-5 z-[9997] cursor-pointer select-none"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', transition: 'opacity 0.2s' }}
      >
        <div
          className="relative"
          style={{
            background: '#E8E2D4',
            color: '#1A1A1A',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,226,212,0.1)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'box-shadow 0.3s ease',
            borderRadius: '4px',
          }}
        >
          {/* Corner notches */}
          <Notch top left />
          <Notch top />
          <Notch left />
          <Notch />

          {/* Top row: avatar + text | perforation | hamburger */}
          <div className="flex items-center" style={{ minWidth: '220px' }}>
            {/* Left: avatar + label */}
            <div className="flex items-center gap-2.5 px-4 py-2.5">
              <div
                className="rounded overflow-hidden flex-shrink-0"
                style={{ width: '32px', height: '32px', background: '#333' }}
              >
                <img
                  src="/images/hero-portrait.jpg"
                  alt=""
                  width={32}
                  height={32}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
                />
              </div>
              <span className="font-mono font-medium" style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                billu.works
              </span>
            </div>

            {/* Vertical perforation with edge notches */}
            <div className="relative self-stretch" style={{ width: '1px' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '0', borderLeft: '2px dashed rgba(26,26,26,0.25)' }} />
              <Notch top left z={3} />
              <Notch left z={3} /> {/* bottom-left */}
            </div>

            {/* Right: hamburger */}
            <div className="flex items-center justify-center px-5 py-2.5">
              <div className="flex flex-col gap-[4px]">
                <div style={{ width: '22px', height: '2.5px', background: '#1A1A1A', borderRadius: '1px' }} />
                <div style={{ width: '22px', height: '2.5px', background: '#1A1A1A', borderRadius: '1px' }} />
                <div style={{ width: '22px', height: '2.5px', background: '#1A1A1A', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Bottom metadata row — hidden on mobile */}
          <div
            className="hidden md:flex items-center font-mono"
            style={{ borderTop: '1px solid rgba(26,26,26,0.12)', fontSize: '9px', letterSpacing: '0.12em', color: '#888' }}
          >
            <div className="flex-1 text-center py-1.5" style={{ borderRight: '1px solid rgba(26,26,26,0.12)' }}>
              COLORIST
            </div>
            <div className="flex-1 text-center py-1.5" style={{ borderRight: '1px solid rgba(26,26,26,0.12)' }}>
              EDITOR
            </div>
            <div className="flex-1 text-center py-1.5">
              WRITER
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          EXPANDED TICKET CARD
          ═══════════════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed z-[9996] hidden"
        style={{
          top: '16px',
          right: '16px',
          width: 'clamp(300px, 85vw, 400px)',
          background: '#E8E2D4',
          color: '#1A1A1A',
          flexDirection: 'column',
          borderRadius: '6px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,226,212,0.08)',
          overflow: 'visible',
        }}
      >
        {/* Corner notches */}
        <Notch top left size={14} />
        <Notch top size={14} />
        <Notch left size={14} />
        <Notch size={14} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#888' }}>
            billu.works
          </span>
          <button
            onClick={closeNav}
            className="p-1 hover:opacity-60 transition-opacity"
            aria-label="Close menu"
          >
            <X size={22} color="#1A1A1A" strokeWidth={1.5} />
          </button>
        </div>

        {/* Perforation with hanging center dot */}
        <Perforation>
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#1A1A1A',
          }} />
        </Perforation>

        {/* Nav Links — with active state */}
        <nav className="flex flex-col gap-1 px-7 pt-8 pb-6">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex items-baseline gap-4 group text-left py-1 hover:opacity-50 transition-all"
              >
                <span className="font-mono" style={{
                  fontSize: '12px',
                  color: isActive ? '#E8E2D4' : '#999',
                  letterSpacing: '0.05em',
                  background: isActive ? '#1A1A1A' : 'transparent',
                  padding: isActive ? '2px 6px' : '2px 0',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                }}>
                  {item.num}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 'clamp(38px, 8vw, 56px)',
                    color: '#1A1A1A',
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        <Perforation />

        {/* Footer */}
        <div className="px-7 py-4">
          <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.14em', color: '#888' }}>
            ©2025. BILAL CURMALLY. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9995]"
          onClick={closeNav}
          style={{ background: 'rgba(8,8,8,0.7)' }}
        />
      )}
    </>
  )
}
