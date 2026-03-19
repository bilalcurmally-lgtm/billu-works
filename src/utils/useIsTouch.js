import { useState, useEffect } from 'react'

/**
 * Returns true if the primary input is a coarse pointer (touch device).
 * Reactive — updates if the pointer type changes mid-session.
 */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(
    () => window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const handler = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isTouch
}
