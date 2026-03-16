# billu.works — Portfolio Site

## Identity
**Name:** Bilal Curmally
**Nickname:** Billu
**Domain:** billu.works
**Tagline:** Video Editor. Colorist. Writer. Coding Hopeful.
**Bio:** 20 years behind the edit suite and color suite. I cut stories, grade footage, write when needed, and am learning to break things in Python. Based in Karachi, Pakistan.

## Role
Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You are building a high-fidelity, cinematic personal portfolio for Bilal Curmally — a veteran colorist and editor who bridges craft and emerging technology. Every interaction should feel intentional and weighted. The site must feel like a **cinematic instrument** — not a developer portfolio, not a generic creative agency site. It sits at the intersection of film craft and technical curiosity. Eradicate all generic AI portfolio patterns.

---

## Tech Stack (NEVER CHANGE)
- React 19
- Tailwind CSS v3.4
- GSAP 3 + ScrollTrigger + ScrollToPlugin
- Vite
- Lucide React for icons
- Google Fonts via `<link>` in index.html

## File Structure
- `src/components/` — one file per section
- `src/App.jsx` — orchestrates all sections
- `src/index.css` — Tailwind directives + global utilities + noise overlay
- No placeholder content. Everything fully implemented.

---

## Design System — "Cinematic Monochrome" (NEVER CHANGE)

### Palette
- **Background:** `#080808` (near black — not pure #000)
- **Surface:** `#111111` (card backgrounds)
- **Border:** `#222222` (subtle dividers)
- **Text Primary:** `#F5F5F0` (warm off-white)
- **Text Secondary:** `#888888` (muted grey)
- **Accent:** `#F5F0E8` (cream — used ONLY for ticket stub elements)
- **Accent Dark:** `#1A1A1A` (ticket stub text)

### Typography
- **Display:** "Bebas Neue" — for BILLU hero name, massive scale
- **Heading:** "Inter" tight tracking (`tracking-tight`) — section titles
- **Body:** "Inter" regular — descriptions
- **Mono:** "JetBrains Mono" — metadata, labels, stats, ticket details
- **Drama:** "Cormorant Garamond" Italic — pull quotes, cinematic moments

### Fixed Visual Rules
- Global CSS noise overlay: inline SVG `<feTurbulence>` at **0.04 opacity**
- Rounded corners: `rounded-2xl` to `rounded-3xl` — no sharp corners on cards
- All buttons: magnetic feel — `scale(1.02)` on hover with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Hover lifts: `translateY(-1px)` on interactive elements
- GSAP default easing: `power3.out` entrances, `power2.inOut` morphs
- Stagger: `0.08` text, `0.15` cards

---

## Site Sections — Full Specification

---

### 0. OPENING ANIMATION — "The Title Card"

Full viewport black screen. Plays once on first load. Cannot be skipped — but is fast (under 3 seconds total).

**Sequence:**
1. `0.0s` — Pure black. Silence.
2. `0.3s` — **BILLU** renders in Bebas Neue, massive (15–20vw), centered. Color: `#1A1A1A` (very dark, almost invisible against black — like a film title card). Letter spacing tight.
3. `0.6s` — BILLU brightens slowly to `#F5F5F0`. GSAP fade, `power2.inOut`, duration `0.8s`.
4. `1.0s` — Floating skill tags drift in around the name from random positions. Monochrome pill tags, cream border, dark text:
   - `Video Editor`
   - `Colorist`
   - `Writer`
   - `Coding Hopeful`
   - `Vibe Code Noob`
   Each tag has slight random rotation (`-3deg` to `3deg`) and floats with subtle `sin()` animation loop.
5. `1.8s` — Ticket stub slides up from bottom center. Cream background `#F5F0E8`, dark text `#1A1A1A`. Ticket reads:
   - Top: `BILAL CURMALLY` in JetBrains Mono small caps
   - Center: `ADMIT ONE` in Bebas Neue large
   - Bottom row in mono: `COLORIST | EDITOR | WRITER | KARACHI`
   - Perforated dashed line through middle
   - Ticket corner notches (CSS clip-path)
6. `2.5s` — Ticket pulses gently. Cursor changes to pointer on hover.
7. **Click ticket** → GSAP timeline: tags scatter off screen, BILLU scales up briefly then fades, ticket flips/scales away, black fades to site hero. Total transition: `0.6s`.

**State management:** `useState(false)` for `introComplete`. Render main site only when `true`.

---

### A. NAVBAR — "The Ticket Stub"

**Collapsed state (always visible):**
A small cream ticket stub — horizontal pill shape, fixed position `top-6 right-6`.
- Left side: `billu.works` in JetBrains Mono tiny
- Perforated dashed line dividing it vertically
- Right side: hamburger icon (3 lines)
- Subtle drop shadow. `rounded-xl`.
- On scroll past hero: stub gets a slight blur backdrop

**Expanded state (full ticket overlay):**
Click stub → full ticket expands from top-right. Cream background, dark text. Layout matches reference image exactly:
- Top section: `billu.works` logo left, `×` close right
- Perforated dashed line separator
- Navigation links in Bebas Neue large:
  - `01 WORK`
  - `02 ABOUT`
  - `03 CONTACT`
- Dashed separator
- Social icons row: Instagram, LinkedIn, GitHub
- Dashed separator
- Footer row: `©2025. BILAL CURMALLY.` in mono tiny

**Animation:** GSAP scale from ticket stub position, `power3.out`, `0.4s`. Reverse on close.

---

### B. HERO — "The Opening Shot"

Clean, sober, sleek. Inspired by Sandeep.Design — no gimmicks, just strong typography and presence.

**Layout:**
- `100dvh` height
- Top-left: `billu.works` wordmark in Inter small
- Top-right: `● Available for new projects` — pulsing green dot + mono text
- Main content pushed to **bottom-left**, large breathing room

**Typography block (bottom-left):**
```
Hi, I'm Billu                          ← Inter small, muted
────────────────────────────────
I edit your stories.                   ← Inter Bold, large (4xl–5xl)
Grade your footage.
Write when needed.
And break things in Python.
────────────────────────────────
20 years. Karachi.                     ← Mono small, muted
Currently: accepting work +
building things that shouldn't exist.
```

**Right side visual:**
- Atmospheric dark image (generated via Adobe Firefly / nano-banana)
- Prompt: `cinematic dark portrait, dramatic side lighting, carbon black background, film noir, sharp shadows, monochrome, photorealistic, professional creative, no color`
- Image sits right-side, slightly cropped, very dark, blends into background
- Subtle parallax on scroll — moves at `0.3x` scroll speed

**Bottom stats row:**
```
20+        |    3        |    ∞
Years      |  Disciplines |  Projects
```
In JetBrains Mono with thin dividers.

**Scroll indicator:**
Subtle `↓` or thin line animation at very bottom center. Fades out on scroll.

---

### C. WORK — "The Film Reel"

This section uses a **film/cinema aesthetic** for displaying projects. Inspired by Siena Film Foundation reference.

**Section header:**
`WORK` in Bebas Neue, large, left-aligned. Thin horizontal rule.

**Project cards — "Film Capsule" style:**
Each project is a full-width card with:
- Large background image (the actual project work — mockup, screenshot, color grade still)
- **Metadata overlay bottom-left** in JetBrains Mono:
  ```
  CLIENT ————— [Client Name]
  YEAR ———————— [Year]  
  TYPE ————————— [Color Grade / Edit / Brand]
  ```
- Project title in Bebas Neue large, over image
- Top-right: `↗` arrow link
- On hover: image brightens slightly, metadata slides up, ticket stub mini element appears

**Scroll behaviour:**
Cards stack on scroll — as next card scrolls in, previous card **scales to 0.95, blurs to 8px, fades to 0.6**. Uses GSAP ScrollTrigger `pin: true`.

**Film strip detail:**
Thin horizontal film sprocket strip element (CSS) runs along the top edge of this section — purely decorative, monochrome.

---

### D. ABOUT — "The Manifesto"

Full-width dark section. Pure text. No images.

**Layout:**
Two contrasting statements in large type:

```
Most editors deliver footage.          ← Inter, smaller, muted #888
                                       
I deliver the feeling                  ← Cormorant Garamond Italic
you wanted it to have.                    massive, cream #F5F5F0
```

Below that — a short honest bio block:
```
20 years in post-production.
Karachi-based. Internationally minded.
I grade on DaVinci Resolve.
I edit on Premiere and Resolve.
I write in plain English.
I code in Python (badly, but improving).
I build AI tools that make my own 
workflow faster — and sometimes sell 
them to people who have the same problems.
```
In Inter regular, comfortable reading size, max-width constrained for readability.

**Skills/tools floating tags:**
Same pill tag aesthetic from opening animation but static here:
`DaVinci Resolve` `Premiere Pro` `Python` `After Effects` `DCTL` `AI Workflows` `Final Cut` `Audition`

**Animation:** GSAP SplitText-style word-by-word reveal on ScrollTrigger.

---

### E. CONTACT — "The Last Frame"

Simple, dark, focused.

**Layout:**
Large centered text:
```
Let's make                    ← Inter light, large
something worth               
watching.                     ← Cormorant Garamond Italic, accent cream
```

Below: single email CTA button — ticket stub styled (cream background, dark text, perforated border detail). Text: `GET IN TOUCH →`

Social links in mono small below that.

---

### F. FOOTER

Dark `#080808`. `rounded-t-3xl`.

```
billu.works                    ©2025 Bilal Curmally
Video Editor · Colorist        Built with React + GSAP
Writer · Coding Hopeful        Karachi, Pakistan
```

**`● SYSTEM OPERATIONAL`** — pulsing green dot, JetBrains Mono tiny, bottom right.

---

## Scroll Behaviour (CRITICAL — NEVER CHANGE)

The site uses **cinematic page stacking** on scroll:

- Each section is a full viewport panel
- As you scroll DOWN: current section **stays pinned**, scales to `0.95`, blurs to `12px`, fades to `0.5` as next section slides UP over it
- Creates a feeling of pages/frames stacking — like a film reel advancing
- Implemented with GSAP ScrollTrigger `pin: true` on each section
- Smooth scroll: `gsap.registerPlugin(ScrollToPlugin)`, native smooth scroll CSS

---

## Visual References (for CLI context)

**ref-hero-robot.png** — GrowthOS site. Like: pure black bg, right-side 3D visual, left-side typography, bottom stats row, minimal nav. Dislike: the robot — replace with cinematic dark portrait.

**ref-hero-sandeep.png** — Sandeep.Design. Like: the sober clean layout, top-right availability status, left-aligned bold headline, project cards with laptop mockups, overall restraint. This is the hero/work section energy.

**ref-opening-rishkesh.png** — RISHKESH portfolio. Like: massive name dark-on-black, floating skill tags around name, pure black, the confidence of it. This IS our opening animation.

**ref-nav-ticket.png** — Siena Film Foundation nav. Like: the ticket stub aesthetic, cream/off-white contrast, perforated dashed lines, numbered nav items, monospace footer. This IS our navigation system.

**ref-nav-expanded.png** — Siena Film Foundation expanded nav. Like: the full expanded ticket with numbered items, social icons, copyright line. Exact structure to follow.

**ref-film-project.png** — Siena Film Foundation project view. Like: cinematic full-bleed image, metadata overlay bottom-left in mono, ticket stub element top-right, the film language applied to portfolio work. This IS our work section card style.

---

## What This Site Is NOT
- Not a developer portfolio (no GitHub contribution graphs, no code snippets on display)
- Not a creative agency site (no "we craft digital experiences" language)
- Not a Dribbble-style design portfolio (no UI mockup grids)
- Not a generic Framer template
- Not colourful — strictly monochrome except cream ticket accents

## What This Site IS
- A working professional's calling card
- Cinematic, weighted, intentional
- Honest about who Billu is — craft first, curiosity second
- The ticket/film aesthetic runs as a consistent thread throughout
- Fast, accessible, mobile-responsive

---

## Build Sequence

1. Set up Vite + React + Tailwind + GSAP
2. Install Google Fonts in index.html (Bebas Neue, Inter, JetBrains Mono, Cormorant Garamond)
3. Build OpeningAnimation component first — get it feeling right before anything else
4. Build TicketNav component
5. Build Hero section
6. Build Work section with dummy project data
7. Build About section
8. Build Contact section
9. Build Footer
10. Wire all GSAP scroll interactions
11. Test on mobile — ensure ticket nav works on touch
12. Final pass: noise overlay, micro-interactions, magnetic buttons

**Execution Directive:** "Do not build a portfolio website. Build a cinematic instrument that happens to show work. Every scroll intentional. Every animation weighted. The ticket stub is the soul of the site — it should feel like you're being admitted somewhere worth going."
