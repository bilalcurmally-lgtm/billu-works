import { useState, useEffect } from 'react'

const SECTIONS = [
  { id: 'hero',    code: '00' },
  { id: 'work',    code: '01' },
  { id: 'about',   code: '02' },
  { id: 'contact', code: '03' },
]

const LABELS = {
  hero:    'HERO',
  work:    'WORK',
  about:   'ABOUT',
  contact: 'CONTACT',
}

export default function TimecodeDisplay() {
  const [current, setCurrent] = useState('hero')
  const [frame, setFrame]     = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Show after a short delay
    const timer = setTimeout(() => setVisible(true), 400)

    // Frame counter
    const frameInterval = setInterval(() => {
      setFrame(f => (f + 1) % 1000)
    }, 100)

    // IntersectionObserver to detect current section
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrent(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    }).filter(Boolean)

    return () => {
      clearTimeout(timer)
      clearInterval(frameInterval)
      observers.forEach(obs => obs.disconnect())
    }
  }, [])

  if (!visible) return null

  const sec = SECTIONS.find(s => s.id === current)

  return (
    <div
      className="fixed bottom-7 left-6 z-[9990] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s' }}
    >
      <div
        className="font-mono-jet"
        style={{
          fontSize: '10px',
          color: '#333',
          letterSpacing: '0.12em',
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: '#222' }}>billu.works</div>
        <div>
          {sec?.code ?? '00'} — {LABELS[current] ?? 'HERO'} / FRAME{' '}
          <span style={{ color: '#444' }}>{String(frame).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}
