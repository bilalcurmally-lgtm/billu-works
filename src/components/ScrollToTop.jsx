import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronUp } from 'lucide-react'
import { useReducedMotion } from '../utils/useReducedMotion'
import { useIsTouch } from '../utils/useIsTouch'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef(null)
  const tweenRef = useRef(null)
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    // Use IntersectionObserver on an invisible sentinel at top of page
    // When sentinel is out of view (scrolled past hero), show button
    const sentinel = document.getElementById('hero')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => {
    tweenRef.current?.kill()
    if (prefersReduced) {
      window.scrollTo(0, 0)
    } else {
      tweenRef.current = gsap.to(window, {
        scrollTo: { y: 0 },
        duration: 1,
        ease: 'power3.inOut',
      })
    }
  }

  if (isTouch) return null

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed z-[9990] transition-all duration-300"
      style={{
        bottom: '24px',
        right: '24px',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        background: '#F5F0E8',
        color: '#1A1A1A',
        borderRadius: '8px',
        padding: '8px 12px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <ChevronUp size={14} strokeWidth={2} />
      <span
        className="font-mono-jet"
        style={{ fontSize: '9px', letterSpacing: '0.15em' }}
      >
        TOP
      </span>
    </button>
  )
}
