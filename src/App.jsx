import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import OpeningAnimation from './components/OpeningAnimation'
import TicketNav        from './components/TicketNav'
import Hero             from './components/Hero'
import Work             from './components/Work'
import About            from './components/About'
import Contact          from './components/Contact'
import Footer           from './components/Footer'
import TimecodeDisplay  from './components/TimecodeDisplay'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function shouldSkipIntro() {
  try {
    return sessionStorage.getItem('billu_intro_seen') === 'true'
  } catch {
    return false
  }
}

function useReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useIsTouch() {
  return window.matchMedia('(pointer: coarse)').matches
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(() => shouldSkipIntro())
  const sectionsRef = useRef([])
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()

  // Cinematic scroll stacking — desktop only, no reduced motion
  useEffect(() => {
    if (!introComplete) return
    if (prefersReduced || isTouch) return

    const panels = sectionsRef.current.filter(Boolean)
    if (panels.length === 0) return

    // Give DOM time to settle after intro unmounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return // last panel doesn't get stacked

        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: () => `+=${panel.offsetHeight}`,
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(panel, {
              scale: 1 - progress * 0.05,
              filter: `blur(${progress * 12}px)`,
              opacity: 1 - progress * 0.5,
            })
          },
          onLeaveBack: (self) => {
            gsap.set(panel, { scale: 1, filter: 'blur(0px)', opacity: 1 })
          },
        })
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [introComplete, prefersReduced, isTouch])

  if (!introComplete) {
    return <OpeningAnimation onComplete={() => setIntroComplete(true)} />
  }

  return (
    <>
      <TicketNav />
      <TimecodeDisplay />

      <main>
        <div ref={el => sectionsRef.current[0] = el} style={{ position: 'relative', zIndex: 1, background: '#080808' }}>
          <Hero />
        </div>
        <div ref={el => sectionsRef.current[1] = el} style={{ position: 'relative', zIndex: 2, background: '#080808' }}>
          <Work />
        </div>
        <div ref={el => sectionsRef.current[2] = el} style={{ position: 'relative', zIndex: 3, background: '#080808' }}>
          <About />
        </div>
        <div ref={el => sectionsRef.current[3] = el} style={{ position: 'relative', zIndex: 4, background: '#080808' }}>
          <Contact />
        </div>
        <Footer />
      </main>
    </>
  )
}
