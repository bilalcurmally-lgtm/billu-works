import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Linkedin, Github, X, Menu } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'

gsap.registerPlugin(ScrollToPlugin)

const NAV_ITEMS = [
  { num: '01', label: 'WORK',    id: 'work' },
  { num: '02', label: 'ABOUT',   id: 'about' },
  { num: '03', label: 'CONTACT', id: 'contact' },
]

export default function TicketNav() {
  const [open, setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const stubRef      = useRef(null)
  const overlayRef   = useRef(null)
  const tlRef        = useRef(null)
  const isAnimating  = useRef(false)
  const magneticRef  = useMagneticButton(0.25)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openNav = () => {
    if (isAnimating.current || open) return
    isAnimating.current = true
    setOpen(true)
    document.body.style.overflow = 'hidden'

    gsap.set(overlayRef.current, { display: 'flex', scale: 0.85, opacity: 0, transformOrigin: 'top right' })
    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false } })
    tl.to(overlayRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
    tlRef.current = tl
  }

  const closeNav = () => {
    if (isAnimating.current || !open) return
    isAnimating.current = true
    document.body.style.overflow = ''

    const tl = gsap.timeline({
      onComplete: () => {
        setOpen(false)
        gsap.set(overlayRef.current, { display: 'none' })
        isAnimating.current = false
      }
    })
    tl.to(overlayRef.current, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'power3.in', transformOrigin: 'top right' })
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
      {/* Collapsed Ticket Stub */}
      <div
        ref={el => { stubRef.current = el; magneticRef.current = el }}
        onClick={openNav}
        className="fixed top-6 right-6 z-[9997] cursor-pointer select-none"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', transition: 'opacity 0.2s' }}
      >
        <div
          className="flex items-center gap-0 rounded-xl overflow-hidden"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,240,232,0.1)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <div className="px-3 py-2">
            <span className="font-mono-jet" style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#555' }}>
              billu.works
            </span>
          </div>
          <div style={{ width: '1px', background: 'rgba(26,26,26,0.2)', alignSelf: 'stretch', margin: '4px 0' }} />
          <div className="px-3 py-2 flex items-center justify-center">
            <Menu size={14} color="#1A1A1A" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Expanded Ticket Overlay */}
      <div
        ref={overlayRef}
        className="fixed top-0 right-0 z-[9996] hidden"
        style={{
          width: 'clamp(280px, 90vw, 380px)',
          height: '100dvh',
          maxHeight: '100dvh',
          background: '#F5F0E8',
          color: '#1A1A1A',
          flexDirection: 'column',
          boxShadow: '-20px 0 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-mono-jet" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#555' }}>
            billu.works
          </span>
          <button onClick={closeNav} className="p-1 hover:opacity-60 transition-opacity" aria-label="Close menu">
            <X size={18} color="#1A1A1A" strokeWidth={1.5} />
          </button>
        </div>

        <div className="ticket-perforation mx-6" />

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-6 py-6 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex items-baseline gap-3 group text-left py-2 hover:opacity-60 transition-opacity"
            >
              <span className="font-mono-jet text-xs" style={{ color: '#888' }}>{item.num}</span>
              <span className="font-display" style={{ fontSize: 'clamp(32px, 6vw, 48px)', color: '#1A1A1A', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="ticket-perforation mx-6" />

        {/* Socials */}
        <div className="flex gap-4 px-6 py-5">
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
              className="p-2 rounded-lg hover:opacity-50 transition-opacity"
              style={{ background: 'rgba(26,26,26,0.07)' }}
            >
              <Icon size={16} color="#1A1A1A" strokeWidth={1.5} />
            </a>
          ))}
        </div>

        <div className="ticket-perforation mx-6" />

        {/* Footer */}
        <div className="px-6 py-4">
          <span className="font-mono-jet" style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#888' }}>
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
