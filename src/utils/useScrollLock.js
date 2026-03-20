import { useRef, useCallback, useMemo } from 'react'

const lockCount = { current: 0 }
const savedScrollY = { current: 0 }

export function useScrollLock() {
  const isLocked = useRef(false)

  const lock = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true

    if (lockCount.current === 0) {
      savedScrollY.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${savedScrollY.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    }
    lockCount.current++
  }, [])

  const unlock = useCallback(() => {
    if (!isLocked.current) return
    isLocked.current = false
    lockCount.current--

    if (lockCount.current === 0) {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, savedScrollY.current)
    }
  }, [])

  return useMemo(() => ({ lock, unlock }), [lock, unlock])
}
