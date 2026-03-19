import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Linkedin, Github, X, Menu } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'
import { useReducedMotion } from '../utils/useReducedMotion'

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
    // iOS Safari scroll lock: position:fixed prevents background scrolling
    savedScrollY.current = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    gsap.set(overlayRef.current, { display: 'flex', scale: 0.85, opacity: 0, transformOrigin: 'top right' })
    const tl = gsap.timeline({ onComplete: () => { isAnimating.current = false } })
    tl.to(overlayRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' })
    tlRef.current = tl
  }

  const closeNav = () => {
    if (isAnimating.current || !open) return
    isAnimating.current = true
    // Restore scroll position (iOS Safari scroll lock)
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
      {/* Collapsed Ticket Stub — proper ticket shape with notches */}
      <div
        ref={el => { stubRef.current = el; magneticRef.current = el }}
        onClick={openNav}
        className="fixed top-6 right-6 z-[9997] cursor-pointer select-none"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', transition: 'opacity 0.2s' }}
      >
        <div
          className="relative flex items-center gap-0 rounded-xl"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,240,232,0.1)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'box-shadow 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <div className="px-3 py-2">
            <span className="font-mono-jet" style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#555' }}>
              billu.works
            </span>
          </div>
          {/* Vertical perforation with notches */}
          <div className="relative" style={{ width: '1px', alignSelf: 'stretch', borderLeft: '1px dashed rgba(26,26,26,0.25)' }}>
            <div style={{ position: 'absolute', top: '-5px', left: '-5px', width: '10px', height: '10px', borderRadius: '50%', background: '#080808' }} />
            <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', width: '10px', height: '10px', borderRadius: '50%', background: '#080808' }} />
          </div>
          <div className="px-3 py-2 flex items-center justify-center">
            <Menu size={14} color="#1A1A1A" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Expanded Ticket Overlay — proper ticket with notches */}
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
          overflow: 'hidden',
        }}
      >
        {/* Top notch — centered semicircle cut into top edge */}
        <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-5">
          <span className="font-mono-jet" style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#555' }}>
            billu.works
          </span>
          <button onClick={closeNav} className="p-1 hover:opacity-60 transition-opacity" aria-label="Close menu">
            <X size={20} color="#1A1A1A" strokeWidth={1.5} />
          </button>
        </div>

        {/* Perforation with edge notches */}
        <div className="ticket-perforation mx-0" />

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 px-6 py-8 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex items-baseline gap-3 group text-left py-2 hover:opacity-60 transition-opacity"
            >
              <span className="font-mono-jet text-xs" style={{ color: '#888' }}>{item.num}</span>
              <span className="font-display" style={{ fontSize: 'clamp(36px, 7vw, 52px)', color: '#1A1A1A', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Perforation with edge notches */}
        <div className="ticket-perforation mx-0" />

        {/* Socials */}
        <div className="flex gap-5 px-6 py-5">
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
              <Icon size={18} color="#1A1A1A" strokeWidth={1.5} />
            </a>
          ))}
        </div>

        {/* Perforation with edge notches */}
        <div className="ticket-perforation mx-0" />

        {/* Footer */}
        <div className="px-6 py-4">
          <span className="font-mono-jet" style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#888' }}>
            ©2026. BILAL CURMALLY. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Bottom notch */}
        <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: '#080808', zIndex: 2 }} />
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
