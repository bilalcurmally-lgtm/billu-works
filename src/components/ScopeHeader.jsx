import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../utils/useReducedMotion'

// Scope resolution: columns across, luma bins down. The canvas is stretched to fit,
// which softens the trace the way a real waveform monitor glows.
const COLS = 480
const BINS = 140
const PAD = 0.08 // keep 0 and 100 IRE off the very edges
const GRATICULE = [100, 75, 50, 25, 0]

/**
 * Draw the luma waveform of an image: for every column of the frame, plot each
 * pixel's brightness as a dot, so dense tones glow and sparse ones fade.
 */
function drawWaveform(canvas, img) {
  const src = document.createElement('canvas')
  const rows = Math.round(COLS * (img.naturalHeight / img.naturalWidth)) || 270
  src.width = COLS
  src.height = rows
  const sctx = src.getContext('2d', { willReadFrequently: true })
  sctx.drawImage(img, 0, 0, COLS, rows)
  const { data } = sctx.getImageData(0, 0, COLS, rows)

  const counts = new Float32Array(COLS * BINS)
  let max = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 4
      // Rec. 709 luma
      const luma = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
      const bin = Math.round((1 - (PAD + luma * (1 - PAD * 2))) * (BINS - 1))
      const c = ++counts[bin * COLS + x]
      if (c > max) max = c
    }
  }

  canvas.width = COLS
  canvas.height = BINS
  const ctx = canvas.getContext('2d')
  const out = ctx.createImageData(COLS, BINS)
  const scale = Math.max(1, max * 0.35)
  for (let i = 0; i < counts.length; i++) {
    if (!counts[i]) continue
    const a = Math.min(1, Math.pow(counts[i] / scale, 0.55))
    out.data[i * 4]     = 245
    out.data[i * 4 + 1] = 240
    out.data[i * 4 + 2] = 232
    out.data[i * 4 + 3] = Math.round(40 + a * 215)
  }
  ctx.putImageData(out, 0, 0)
}

/**
 * Section header styled as a colorist's waveform monitor. The trace is the real
 * luma waveform of `src`, and it sweeps in left to right when scrolled into view.
 */
export default function ScopeHeader({ title, src, sourceLabel, meta, headerRef }) {
  const rootRef   = useRef(null)
  const canvasRef = useRef(null)
  const traceRef  = useRef(null)
  const scanRef   = useRef(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!src) return
    let cancelled = false
    const img = new Image()
    img.onload = () => { if (!cancelled && canvasRef.current) drawWaveform(canvasRef.current, img) }
    img.src = src
    return () => { cancelled = true }
  }, [src])

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top 85%' },
      })
      tl.fromTo(traceRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' })
        .fromTo(scanRef.current,
          { left: '0%', opacity: 1 },
          { left: '100%', duration: 1.4, ease: 'power2.inOut' }, 0)
        .to(scanRef.current, { opacity: 0, duration: 0.3 })
    }, rootRef)
    return () => ctx.revert()
  }, [prefersReduced])

  const setRefs = (el) => {
    rootRef.current = el
    if (headerRef) headerRef.current = el
  }

  return (
    <div
      ref={setRefs}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ background: '#0b0b0b', border: '1px solid #1c1c1c' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-5 md:px-6 font-mono"
        style={{ height: '30px', borderBottom: '1px solid #1a1a1a', fontSize: '10px', letterSpacing: '0.18em', color: '#666' }}
      >
        {/* Left-aligned so the fixed nav stub (top-right) never covers it */}
        <span>WAVEFORM · LUMA</span>
        {sourceLabel && <span className="hidden sm:inline" style={{ color: '#444' }}>/ {sourceLabel}</span>}
      </div>

      {/* Scope area */}
      <div className="relative" style={{ height: 'clamp(130px, 15vw, 200px)' }}>
        {/* Graticule */}
        {GRATICULE.map(ire => {
          const top = `${(PAD + (1 - ire / 100) * (1 - PAD * 2)) * 100}%`
          return (
            <div key={ire} className="absolute left-0 right-0 pointer-events-none" style={{ top }}>
              <div style={{ borderTop: `1px ${ire % 50 === 0 ? 'solid' : 'dashed'} #1e1e1e` }} />
              <span
                className="absolute right-3 font-mono"
                style={{ top: '-7px', fontSize: '9px', color: '#3a3a3a', background: '#0b0b0b', paddingLeft: '6px' }}
              >
                {ire}
              </span>
            </div>
          )
        })}

        {/* Trace */}
        <div ref={traceRef} className="absolute inset-0 pointer-events-none" style={{ right: '40px' }}>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="w-full h-full block"
            style={{ opacity: 0.55, mixBlendMode: 'screen' }}
          />
        </div>

        {/* Scan line that leads the trace in */}
        <div
          ref={scanRef}
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ width: '2px', left: '100%', opacity: 0, background: 'linear-gradient(to bottom, transparent, #F5F0E8, transparent)', boxShadow: '0 0 12px rgba(245,240,232,0.5)' }}
        />

        {/* Title */}
        <div className="absolute left-5 md:left-6 bottom-4 md:bottom-5 flex items-end gap-4">
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: '#F5F5F0', letterSpacing: '0.04em', lineHeight: 0.85, margin: 0, textShadow: '0 2px 24px rgba(8,8,8,0.9)' }}
          >
            {title}
          </h2>
        </div>

        {meta && (
          <span
            className="absolute right-12 bottom-4 md:bottom-5 font-mono hidden sm:block"
            style={{ color: '#888', fontSize: '10px', letterSpacing: '0.15em', background: 'rgba(11,11,11,0.8)', padding: '2px 6px' }}
          >
            {meta}
          </span>
        )}
      </div>
    </div>
  )
}
