# billu.works — TODOS

## Completed (Sessions 1–3)

- [x] Vite + React 19 + Tailwind v3.4 scaffold
- [x] Google Fonts in index.html (Bebas Neue, Inter, JetBrains Mono, Cormorant Garamond)
- [x] Design system tokens (palette, typography) in Tailwind config + index.css
- [x] Noise overlay (CSS pseudo-element, 0.04 opacity)
- [x] OpeningAnimation.jsx — full 6-step sequence, sessionStorage skip logic
- [x] TicketNav.jsx — collapsed stub + expanded overlay, GSAP scale-from-origin
- [x] Hero.jsx — full layout with parallax, stats row, scroll indicator
- [x] Work.jsx — film capsule cards, ScrollTrigger stacking, film strip decoration
- [x] About.jsx — manifesto text, custom word-split reveal, skills tags
- [x] Contact.jsx — simplified contact form (Name/Email/Message), honeypot, double-submit guard
- [x] Footer.jsx — live timecode display (SESSION HH:MM:SS:FF)
- [x] GSAP scroll stacking (pin per section, scale/blur/fade previous)
- [x] Magnetic buttons (useMagneticButton hook)
- [x] prefers-reduced-motion support (skip intro, disable animations)
- [x] Font fallback stacks in CSS
- [x] GSAP cleanup on unmount (gsap.context + revert)
- [x] TimecodeDisplay component (fixed, bottom-left)
- [x] OG meta tags + share card in index.html
- [x] Plausible/Fathom analytics script placeholder in index.html
- [x] src/data/projects.js — project data array
- [x] Progressive enhancement for mobile (no pinning on touch devices)
- [x] Vercel deployment config
- [x] Import useReducedMotion from utils in App.jsx
- [x] Create useIsTouch.js hook
- [x] Remove redundant gsap.registerPlugin from Hero, Work, About, Contact
- [x] Move @keyframes pulse + scrollPulse to index.css
- [x] data-scroll attributes on section wrappers
- [x] Replace double-RAF with gsap.context() + ScrollTrigger.sort()
- [x] Debounced resize → ScrollTrigger.refresh()
- [x] will-change on stack section wrappers
- [x] Double-submit guard on Contact form
- [x] Fix form name bug (submittedName state)
- [x] Simplified Contact form (Name/Email/Message only)
- [x] Honeypot field (_gotcha)
- [x] maxLength={2000} on textarea
- [x] iOS Safari scroll lock in TicketNav
- [x] Project card `<img loading="lazy">`
- [x] `<link rel="preload">` for hero portrait
- [x] ErrorBoundary component wrapping main site
- [x] Project cards wrapped in `<a>` tags with focus-visible ring
- [x] CustomCursor.jsx — GSAP quickTo follower, 3 states, touch-disabled
- [x] FilmStripProgress.jsx — right-edge sprocket strip, scroll-driven
- [x] KonamiEasterEgg.jsx — Konami code triggers "Director's Cut" overlay
- [x] Playwright E2E test suite (8 test files)
- [x] GitHub Actions CI (Playwright + Lighthouse)

## P2 — Pre-Launch Blockers

### og-card.jpg for social sharing
**What:** Create a 1200×630 OG card image at `/public/og-card.jpg`.
**Why:** Social shares show no preview without it.
**Effort:** S | **Depends on:** None

### Replace Formspree placeholder
**What:** Replace `YOUR_FORM_ID` in Contact.jsx with real Formspree ID.
**Why:** Contact form won't actually send without it.
**Effort:** S | **Depends on:** Bilal creating Formspree account

### Real social URLs
**What:** Replace placeholder Instagram/LinkedIn/GitHub URLs in TicketNav + Contact.
**Why:** Links currently go to root domains, not Bilal's profiles.
**Effort:** S | **Depends on:** Bilal providing handles

### Hero body copy
**What:** Finalize the hero headline and bio text.
**Why:** Current copy is placeholder — needs Bilal's voice.
**Effort:** S | **Depends on:** Bilal writing/approving copy

## P2 — Post-Launch (content-dependent)

### Writing Section
**What:** A section styled like film credits roll, showing 3–5 essay/article titles + external links.
**Why:** The tagline says "Writer" but the site has nowhere to prove it.
**Effort:** M | **Blocked by:** Real writing being published

### Video Showreel Section
**What:** Auto-playing full-bleed video section with color-graded footage.
**Why:** The most direct way to show the work — actually show the work moving.
**Effort:** M | **Blocked by:** Showreel video being produced

## P3 — Nice to Have

### Social links constants file
**What:** Extract social URLs into `src/data/socials.js` and import from both TicketNav and Contact.
**Why:** DRY — both components hardcode the same URLs.
**Effort:** S | **Depends on:** Real social URLs set first
