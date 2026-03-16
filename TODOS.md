# billu.works — TODOS

## In Scope (build now)

- [x] Vite + React 19 + Tailwind v3.4 scaffold
- [x] Google Fonts in index.html (Bebas Neue, Inter, JetBrains Mono, Cormorant Garamond)
- [x] Design system tokens (palette, typography) in Tailwind config + index.css
- [x] Noise overlay (CSS pseudo-element, 0.04 opacity)
- [x] OpeningAnimation.jsx — full 6-step sequence, sessionStorage skip logic
- [x] TicketNav.jsx — collapsed stub + expanded overlay, GSAP scale-from-origin
- [x] Hero.jsx — full layout with parallax, stats row, scroll indicator
- [x] Work.jsx — film capsule cards, ScrollTrigger stacking, film strip decoration
- [x] About.jsx — manifesto text, custom word-split reveal, skills tags
- [x] Contact.jsx — ticket-stub contact FORM (Formspree), email fallback
- [x] Footer.jsx
- [x] GSAP scroll stacking (pin per section, scale/blur/fade previous)
- [x] Magnetic buttons (useMagneticButton hook — applied to CTA, ticket stub, card arrows)
- [x] prefers-reduced-motion support (skip intro, reduce parallax/stagger)
- [x] Font fallback stacks in CSS
- [x] GSAP cleanup on unmount (tl.kill() in useEffect)
- [x] "Now Playing" timecode display (fixed, bottom-left, JetBrains Mono — current section)
- [x] OG meta tags + share card in index.html
- [x] Plausible/Fathom analytics script placeholder in index.html
- [x] src/data/projects.js — project data array with typed shape
- [x] Progressive enhancement for mobile (no pinning on touch devices)
- [x] Vercel deployment config (vercel.json, git init, .gitignore)
- [x] Playwright smoke tests (tests/smoke.spec.js)

## P2 — Post-Launch (content-dependent)

### Writing Section
**What:** A section styled like film credits roll, showing 3–5 essay/article titles + external links.
**Why:** The tagline says "Writer" but the site has nowhere to prove it. This closes that gap.
**Pros:** Adds depth, shows range beyond film craft.
**Cons:** Empty without real content — don't build the shell until writing exists.
**Context:** Bilal identifies as a writer. When he has published pieces (Medium, Substack, or otherwise), add a `Section G` between Contact and Footer. Film credits typography (Cormorant Garamond italic, scrolling stagger). Each entry: title, publication, year, external link arrow.
**Effort:** M (2–4hrs once content exists)
**Blocked by:** Real writing being published

### Video Showreel Section
**What:** Auto-playing (muted, loop), full-bleed video section. Color-graded footage. No visible controls. Cinematic. Dark overlay with "SHOWREEL" in Bebas Neue.
**Why:** The most direct way to show the work — actually show the work moving.
**Pros:** Highest-impact portfolio element for a colorist/editor.
**Cons:** Requires a polished showreel export. Video files add bundle weight (use CDN/Vimeo embed).
**Context:** Place between Hero and Work sections. Autoplay muted loop on scroll into view (IntersectionObserver), pause when out of view. Use Vimeo unlisted link or direct `.mp4` from CDN.
**Effort:** M (2–4hrs once video asset exists)
**Blocked by:** Showreel video being produced/exported

## P3 — Delight (low priority, high polish)

### Custom Cursor
**What:** Replace default cursor with a small film-frame shape on desktop. On hover over project cards: changes to a `↗` reticle. On hover over ticket nav: changes to a ticket icon.
**Why:** Memorable. Reinforces the film aesthetic. The kind of detail that makes people screenshot a portfolio site.
**Pros:** High delight-to-effort ratio. CSS + ~30 lines JS.
**Cons:** Can feel gimmicky if not executed precisely. Skip on touch devices entirely.
**Context:** Use CSS `cursor: none` globally on desktop. Render a `<div>` that follows `mousemove` via GSAP `quickTo`. Icon set: film-frame SVG (default), `↗` reticle (project hover), ticket corner (nav hover).
**Effort:** S (1–2hrs)
**Depends on:** Main site shipped and stable

## Completed

_(Nothing completed yet — site hasn't been built)_
