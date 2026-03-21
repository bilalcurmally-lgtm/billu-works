import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const barRef = useRef(null)
  const containerRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      setProgress(100)
      // Animate bar to 100% then fade out
      gsap.to(barRef.current, {
        width: '100%',
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out',
            onComplete,
          })
        },
      })
    }

    // Track critical assets: hero portrait + fonts
    let loaded = 0
    const total = 2
    const check = () => {
      loaded++
      setProgress(Math.round((loaded / total) * 90))
      if (loaded >= total) finish()
    }

    // 1) Hero portrait
    const img = new Image()
    img.src = '/images/hero-portrait.jpg'
    img.onload = check
    img.onerror = check // continue even if image fails

    // 2) Fonts
    document.fonts.ready.then(check)

    // 5s timeout — don't hang forever
    const timeout = setTimeout(finish, 5000)

    return () => clearTimeout(timeout)
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center"
      style={{ background: '#080808' }}
    >
      {/* Film leader frame count */}
      <div
        className="font-mono mb-6"
        style={{ color: '#333', fontSize: '10px', letterSpacing: '0.2em' }}
      >
        LOADING REEL
      </div>

      {/* Progress bar track */}
      <div
        style={{
          width: 'clamp(200px, 40vw, 320px)',
          height: '2px',
          background: '#1a1a1a',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#F5F0E8',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>

      {/* Percentage */}
      <div
        className="font-mono mt-3"
        style={{ color: '#444', fontSize: '9px', letterSpacing: '0.15em' }}
      >
        {progress}%
      </div>
    </div>
  )
}
