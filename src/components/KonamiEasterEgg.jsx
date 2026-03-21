import { useEffect, useRef, useState } from 'react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

/**
 * Konami code easter egg: ↑↑↓↓←→←→BA triggers "Director's Cut" —
 * a warm amber/sepia color wash over the site for 10 seconds.
 */
export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false)
  const bufferRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      bufferRef.current.push(e.key)
      // Keep only the last N keys
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current = bufferRef.current.slice(-KONAMI.length)
      }
      // Check for match
      if (bufferRef.current.length === KONAMI.length &&
          bufferRef.current.every((k, i) => k === KONAMI[i])) {
        bufferRef.current = []
        setActive(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setActive(false), 10000)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(timerRef.current)
    }
  }, [])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9990,
        background: 'linear-gradient(135deg, rgba(180,120,40,0.08) 0%, rgba(140,80,20,0.12) 50%, rgba(100,60,10,0.06) 100%)',
        mixBlendMode: 'screen',
        animation: 'konamiFlash 10s ease-out forwards',
      }}
    >
      {/* Label */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-center"
        style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(200,160,80,0.6)',
          animation: 'konamiFadeIn 0.5s ease-out',
        }}
      >
        DIRECTOR'S CUT
      </div>

      <style>{`
        @keyframes konamiFlash {
          0% { opacity: 0; }
          5% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes konamiFadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  )
}
