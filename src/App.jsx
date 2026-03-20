import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import Preloader        from './components/Preloader'
import OpeningAnimation from './components/OpeningAnimation'
import TicketNav        from './components/TicketNav'
import Hero             from './components/Hero'
import Work             from './components/Work'
import About            from './components/About'
import Contact          from './components/Contact'
import Footer           from './components/Footer'
import TimecodeDisplay  from './components/TimecodeDisplay'
import ErrorBoundary    from './components/ErrorBoundary'
import CustomCursor     from './components/CustomCursor'
import FilmStripProgress from './components/FilmStripProgress'
import KonamiEasterEgg  from './components/KonamiEasterEgg'
import ScrollToTop      from './components/ScrollToTop'
import NotFound         from './components/NotFound'
import { useReducedMotion } from './utils/useReducedMotion'
import { useIsTouch }       from './utils/useIsTouch'

function isKnownPath() {
  const path = window.location.pathname
  return path === '/' || path === '/index.html'
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function shouldSkipIntro() {
  try {
    return sessionStorage.getItem('billu_intro_seen') === 'true'
  } catch {
    return false
  }
}

export default function App() {
  const [preloadComplete, setPreloadComplete] = useState(() => shouldSkipIntro())
  const [introComplete, setIntroComplete] = useState(() => shouldSkipIntro())
  const sectionsRef = useRef([])
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()

  // Cinematic scroll stacking — desktop only, no reduced motion
  // Reads data-scroll attribute: "stack" = pin + scale/blur, "self" = skipped (manages own), "none" = skipped
  useEffect(() => {
    if (!introComplete) return
    if (prefersReduced || isTouch) return

    const panels = sectionsRef.current.filter(Boolean)
    if (panels.length === 0) return

    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        const behavior = panel.dataset.scroll
        if (behavior !== 'stack') return
        if (i === panels.length - 1) return

        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          end: () => `+=${panel.offsetHeight}`,
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(panel, {
              scale: 1 - progress * 0.04,
              filter: `blur(${progress * 6}px)`,
              opacity: 1 - progress * 0.35,
            })
          },
          onLeaveBack: () => {
            gsap.set(panel, { scale: 1, filter: 'blur(0px)', opacity: 1 })
          },
        })
      })

      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })

    // Refresh ScrollTrigger on resize (debounced)
    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [introComplete, prefersReduced, isTouch])

  // 404 — unknown paths get the "FILM NOT FOUND" page
  if (!isKnownPath()) {
    return <NotFound />
  }

  if (!preloadComplete) {
    return <Preloader onComplete={() => setPreloadComplete(true)} />
  }

  if (!introComplete) {
    return <OpeningAnimation onComplete={() => setIntroComplete(true)} />
  }

  return (
    <ErrorBoundary>
      {/* Skip to content — visible on Tab */}
      <a href="#main-content" className="skip-to-content">
        SKIP TO CONTENT
      </a>

      <TicketNav />
      <TimecodeDisplay />
      <CustomCursor />
      <FilmStripProgress />
      <KonamiEasterEgg />
      <ScrollToTop />

      <main id="main-content">
        <div ref={el => sectionsRef.current[0] = el} data-scroll="stack" style={{ position: 'relative', zIndex: 1, background: '#080808', willChange: 'transform, filter, opacity' }}>
          <Hero />
        </div>
        <div ref={el => sectionsRef.current[1] = el} data-scroll="self" style={{ position: 'relative', zIndex: 2, background: '#080808' }}>
          <Work />
        </div>
        <div ref={el => sectionsRef.current[2] = el} data-scroll="stack" style={{ position: 'relative', zIndex: 3, background: '#080808', willChange: 'transform, filter, opacity' }}>
          <About />
        </div>
        <div ref={el => sectionsRef.current[3] = el} data-scroll="stack" style={{ position: 'relative', zIndex: 4, background: '#080808', willChange: 'transform, filter, opacity' }}>
          <Contact />
        </div>
        <Footer />
      </main>
    </ErrorBoundary>
  )
}
