import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useIsTouch } from '../utils/useIsTouch'

/**
 * Custom cursor: film-frame default, reticle on project cards, ticket on nav.
 * Desktop only — completely hidden on touch devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const isTouch = useIsTouch()
  const [cursorType, setCursorType] = useState('default') // default | project | nav

  useEffect(() => {
    if (isTouch) return

    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // GSAP quickTo for smooth follow
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' })
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' })
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' })

    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      dotXTo(e.clientX)
      dotYTo(e.clientY)
    }

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setCursorType(target.dataset.cursor)
      } else if (e.target.closest('a, button, [role="button"]')) {
        setCursorType('nav')
      } else {
        setCursorType('default')
      }
    }

    const onLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.2 })
    }
    const onEnter = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.2 })
    }

    // Hide default cursor globally
    document.documentElement.style.cursor = 'none'

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [isTouch])

  if (isTouch) return null

  const size = cursorType === 'default' ? 28 : cursorType === 'project' ? 56 : 36

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99999,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: cursorType === 'project' ? '4px' : '50%',
          border: cursorType === 'project'
            ? '1.5px solid rgba(245,240,232,0.5)'
            : '1.5px solid rgba(245,240,232,0.35)',
          transition: 'width 0.2s, height 0.2s, margin 0.2s, border-radius 0.2s, border-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Reticle crosshair for project cards */}
        {cursorType === 'project' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
            <line x1="8" y1="0" x2="8" y2="6" stroke="#F5F0E8" strokeWidth="1" />
            <line x1="8" y1="10" x2="8" y2="16" stroke="#F5F0E8" strokeWidth="1" />
            <line x1="0" y1="8" x2="6" y2="8" stroke="#F5F0E8" strokeWidth="1" />
            <line x1="10" y1="8" x2="16" y2="8" stroke="#F5F0E8" strokeWidth="1" />
          </svg>
        )}
        {/* Ticket corner for nav elements */}
        {cursorType === 'nav' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.7 }}>
            <path d="M2 0 L10 0 Q12 0 12 2 L12 10 Q12 12 10 12 L2 12 Q0 12 0 10 L0 2 Q0 0 2 0Z" stroke="#F5F0E8" strokeWidth="1" fill="none" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="#F5F0E8" strokeWidth="0.5" strokeDasharray="2 1.5" />
          </svg>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 99999,
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          borderRadius: '50%',
          background: '#F5F0E8',
          opacity: cursorType === 'project' ? 0 : 0.8,
          transition: 'opacity 0.2s',
        }}
      />
    </>
  )
}
