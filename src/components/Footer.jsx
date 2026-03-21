import { useState, useEffect, useRef } from 'react'

function useTimecode() {
  const [tc, setTc] = useState('00:00:00:00')
  const startRef = useRef(null)

  useEffect(() => {
    if (startRef.current === null) startRef.current = performance.now()
    const start = startRef.current

    const interval = setInterval(() => {
      const elapsedMs = performance.now() - start
      const elapsed = Math.floor(elapsedMs / 1000)
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
      const s = String(elapsed % 60).padStart(2, '0')
      const f = String(Math.floor((elapsedMs % 1000) / (1000 / 24))).padStart(2, '0')
      setTc(`${h}:${m}:${s}:${f}`)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return tc
}

export default function Footer() {
  const timecode = useTimecode()

  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid #111',
        borderRadius: '32px 32px 0 0',
      }}
      className="px-6 md:px-12 py-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

        {/* Left */}
        <div>
          <div className="font-display text-2xl mb-1" style={{ color: '#F5F5F0', letterSpacing: '0.05em' }}>
            billu.works
          </div>
          <div className="font-mono" style={{ color: '#888', fontSize: '11px', letterSpacing: '0.1em', lineHeight: 1.8 }}>
            Video Editor · Colorist<br />
            Writer · Coding Hopeful
          </div>
        </div>

        {/* Right */}
        <div className="text-left md:text-right">
          <div className="font-mono mb-1" style={{ color: '#888', fontSize: '11px', letterSpacing: '0.08em', lineHeight: 1.8 }}>
            ©2026 Bilal Curmally<br />
            Built with React + GSAP<br />
            Karachi, Pakistan
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-end mt-8 pt-5 pb-10"
        style={{ borderTop: '1px solid #111' }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-mono" style={{ color: '#555', fontSize: '9px', letterSpacing: '0.08em' }}>
            vibe coded by myself for myself with claude cli
          </span>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse 2s infinite' }}
            />
            <span className="font-mono" style={{ color: '#888', fontSize: '10px', letterSpacing: '0.15em' }}>
              SESSION {timecode}
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
