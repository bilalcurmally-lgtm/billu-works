import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../utils/useIsTouch'

/**
 * Vertical film-strip sprocket along the right edge that fills as you scroll.
 * Desktop only — hidden on touch devices to save screen real estate.
 */
export default function FilmStripProgress() {
  const [progress, setProgress] = useState(0)
  const isTouch = useIsTouch()
  const rafRef = useRef(null)

  useEffect(() => {
    if (isTouch) return

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isTouch])

  if (isTouch) return null

  // Generate sprocket holes
  const holeCount = 30
  const holes = Array.from({ length: holeCount }, (_, i) => i)

  return (
    <div
      className="fixed top-0 right-0 h-full pointer-events-none"
      style={{ zIndex: 50, width: '12px' }}
    >
      {/* Track background */}
      <div
        className="absolute inset-0"
        style={{ background: '#0a0a0a', borderLeft: '1px solid #1a1a1a' }}
      />

      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: `${progress * 100}%`,
          background: 'rgba(245,240,232,0.06)',
          borderLeft: '1px solid rgba(245,240,232,0.15)',
          transition: 'height 0.05s linear',
        }}
      />

      {/* Sprocket holes */}
      {holes.map((_, i) => {
        const y = ((i + 0.5) / holeCount) * 100
        const isFilled = (i / holeCount) <= progress
        return (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${y}%`,
              width: '4px',
              height: '4px',
              borderRadius: '1px',
              background: isFilled ? 'rgba(245,240,232,0.25)' : '#0e0e0e',
              border: '0.5px solid #222',
              transition: 'background 0.1s',
            }}
          />
        )
      })}
    </div>
  )
}
