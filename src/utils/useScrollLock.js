import { useRef, useCallback, useMemo } from 'react'

const lockCount = { current: 0 }
const savedScrollY = { current: 0 }
const usedFixedBody = { current: false }

// iOS Safari ignores overflow:hidden on <html>, so touch devices pin the body instead.
// Desktop keeps the page where it is: pinning the body resets scrollY to 0,
// which makes every ScrollTrigger (hero pin, stacked work cards) fire again.
const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches

export function useScrollLock() {
  const isLocked = useRef(false)

  const lock = useCallback(() => {
    if (isLocked.current) return
    isLocked.current = true

    if (lockCount.current === 0) {
      usedFixedBody.current = isCoarsePointer()
      if (!usedFixedBody.current) {
        const gutter = window.innerWidth - document.documentElement.clientWidth
        document.documentElement.style.overflow = 'hidden'
        if (gutter > 0) document.documentElement.style.paddingRight = `${gutter}px`
        lockCount.current++
        return
      }
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
      if (!usedFixedBody.current) {
        document.documentElement.style.overflow = ''
        document.documentElement.style.paddingRight = ''
        return
      }
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
