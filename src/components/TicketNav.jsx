import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Linkedin, Github, X } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'
import { useReducedMotion } from '../utils/useReducedMotion'

gsap.registerPlugin(ScrollToPlugin)

const NAV_ITEMS = [
  { num: '01', label: 'WORK',    id: 'work' },
  { num: '02', label: 'ABOUT',   id: 'about' },
  { num: '03', label: 'CONTACT', id: 'contact' },
]

/* ── Collapsed ticket stub ──────────────────────────────────
   Wide horizontal cinema ticket with:
   - Left: avatar + "billu.works"
   - Center: vertical dashed perforation with edge notches
   - Right: hamburger icon
   - Bottom metadata row
   - Corner notches (clip-path)
   ─────────────────────────────────────────────────────────── */

/* clip-path with semicircle notches at all 4 corners */
const TICKET_CLIP = `
  path('
    M 12 0
    L calc(100% - 12px) 0
    A 12 12 0 0 0 calc(100% - 12px) 0
    Q 100% 0 100% 12
    L 100% calc(100% - 12px)
    Q 100% 100% calc(100% - 12px) 100%
    L 12 100%
    Q 0 100% 0 calc(100% - 12px)
    L 0 12
    Q 0 0 12 0
    Z
  ')
`

/* Simpler approach: use pseudo-elements for corner notches */

export default function TicketNav() {
  const [open, setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const stubRef      = useRef(null)
  const overlayRef   = useRef(null)
  const tlRef        = useRef(null)
  const isAnimating  = useRef(false)
  const magneticRef  = useMagneticButton(0.25)
  const prefersReduced = useReducedMotion()
  const savedScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    savedScrollY.current = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    gsap.set(overlayRef.current, { display: 'flex', scale: 0.6, opacity: 0, transformOrigin: 'top right' })
    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false } })
    tl.to(overlayRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
    tlRef.current = tl
  }

  const closeNav = () => {
    if (isAnimating.current || !open) return
    isAnimating.current = true
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
    window.scrollTo(0, savedScrollY.current)

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
      if (el) {
        gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: 'power3.inOut' })
      }
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
          {/* Corner notches — 4 semicircles eating into the ticket corners */}
          <div style={{ position: 'absolute', top: '-6px', left: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />

          {/* Top row: avatar + text | perforation | hamburger */}
          <div className="flex items-center" style={{ minWidth: '220px' }}>
            {/* Left: avatar + label */}
            <div className="flex items-center gap-2.5 px-4 py-2.5">
              {/* Small avatar/thumbnail */}
              <div
                className="rounded overflow-hidden flex-shrink-0"
                style={{ width: '32px', height: '32px', background: '#333' }}
              >
                <img
                  src="/images/hero-portrait.jpg"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
                />
              </div>
              <span className="font-mono-jet font-medium" style={{ fontSize: '11px', letterSpacing: '0.06em', color: '#1A1A1A', whiteSpace: 'nowrap' }}>
                billu.works
              </span>
            </div>

            {/* Vertical perforation with edge notches */}
            <div className="relative self-stretch" style={{ width: '1px' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '0', borderLeft: '2px dashed rgba(26,26,26,0.25)' }} />
              {/* Top notch biting into ticket edge */}
              <div style={{ position: 'absolute', top: '-6px', left: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 3 }} />
              {/* Bottom notch biting into ticket edge */}
              <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', width: '12px', height: '12px', borderRadius: '50%', background: '#080808', zIndex: 3 }} />
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

          {/* Bottom metadata row — separated by thin border */}
          <div
            className="flex items-center font-mono-jet"
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
          NOT a side panel — a floating ticket card that scales
          from the stub position (transform-origin: top right).
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
        {/* Corner notches — 4 semicircles on the ticket corners */}
        <div style={{ position: 'absolute', top: '-7px', left: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: '-7px', right: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '-7px', left: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '-7px', right: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />

        {/* Header — billu.works left, close button right */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <span className="font-mono-jet" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#888' }}>
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

        {/* Perforation — dashed line with hanging circle dot at center */}
        <div className="relative mx-0" style={{ borderTop: '2px dashed rgba(26,26,26,0.3)' }}>
          {/* Edge notches */}
          <div style={{ position: 'absolute', top: '-7px', left: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
          <div style={{ position: 'absolute', top: '-7px', right: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
          {/* Hanging center dot */}
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
        </div>

        {/* Nav Links — large Bebas Neue */}
        <nav className="flex flex-col gap-1 px-7 pt-8 pb-6">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex items-baseline gap-4 group text-left py-1 hover:opacity-50 transition-opacity"
            >
              <span className="font-mono-jet" style={{ fontSize: '12px', color: '#999', letterSpacing: '0.05em' }}>
                {item.num}
              </span>
              <span
                className="font-display"
                style={{ fontSize: 'clamp(38px, 8vw, 56px)', color: '#1A1A1A', letterSpacing: '0.02em', lineHeight: 1.1 }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Perforation */}
        <div className="relative mx-0" style={{ borderTop: '2px dashed rgba(26,26,26,0.3)' }}>
          <div style={{ position: 'absolute', top: '-7px', left: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
          <div style={{ position: 'absolute', top: '-7px', right: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
        </div>

        {/* Social icons row */}
        <div className="flex gap-5 px-7 py-5">
          {[
            { Icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
            { Icon: Linkedin,  href: 'https://linkedin.com/',  label: 'LinkedIn' },
            { Icon: Github,    href: 'https://github.com/',    label: 'GitHub' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:opacity-50 transition-opacity"
            >
              <Icon size={20} color="#1A1A1A" strokeWidth={1.5} />
            </a>
          ))}
        </div>

        {/* Perforation */}
        <div className="relative mx-0" style={{ borderTop: '2px dashed rgba(26,26,26,0.3)' }}>
          <div style={{ position: 'absolute', top: '-7px', left: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
          <div style={{ position: 'absolute', top: '-7px', right: '-7px', width: '14px', height: '14px', borderRadius: '50%', background: '#080808' }} />
        </div>

        {/* Footer / Copyright */}
        <div className="px-7 py-4">
          <span className="font-mono-jet" style={{ fontSize: '9px', letterSpacing: '0.14em', color: '#888' }}>
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
