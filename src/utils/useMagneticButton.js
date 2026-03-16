import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * useMagneticButton — makes an element drift toward the cursor on hover.
 * Returns a ref to attach to the element.
 */
export function useMagneticButton(strength = 0.35) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      xTo((e.clientX - cx) * strength)
      yTo((e.clientY - cy) * strength)
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])

  return ref
}
