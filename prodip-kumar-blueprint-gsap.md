# Prodip Kumar — Personal Brand & Portfolio Site
## Complete AI-Agent Build Blueprint

**Stack:** Next.js (App Router) · GSAP (GreenSock Animation Platform) · @gsap/react · ScrollTrigger · Payload CMS · TypeScript · Tailwind CSS
**Owner:** Prodip Kumar — 4th year medical student, Bikrampur Bhuiyan Medical College — also a web designer/developer (WordPress, React, Next.js, Astro.js, Figma, Photoshop)
**Premise:** A medical-student-turned-developer who builds AI-automated, high-credibility websites for physicians, doctors, consultants, dentists, and clinics. The site itself must *demonstrate* that craft — it is the portfolio piece that sells the service.
**Positioning line:** "I understand the clinic from the inside — and I build the web presence that makes it trusted from the outside."

This document is the single source of truth for any build agent (human or AI) working on this project. Follow section order. Every section includes: purpose, content model, layout, animation spec, and code where relevant. Nothing here is decorative filler — the "doctor's world" (ECG lines, lightboxes, charts, prescription grids, vitals) is the visual vocabulary throughout, not a generic AI/dev aesthetic.

---

## 1. Design System

### 1.1 Rationale
Client requested pure black background / white text. We honor that exactly, but ground the *accent* and *signature motif* in medicine rather than generic "AI startup" cyan-on-black. The signature element is a **live ECG/pulse line** used as a scroll-progress spine and section divider — it literally "reads the vitals" of the page as the user scrolls, tying medicine + technology into one motif without being a cliché caduceus or stethoscope icon.

### 1.2 Color tokens
```
--color-bg:            #050505   /* near-true black, not pure #000 — reduces harsh OLED smear on large text */
--color-bg-raised:      #0D0D0D  /* cards, panels */
--color-text:           #F6F5F1  /* soft white, not #FFFFFF — reduces glare on long reads */
--color-text-muted:     #8C8C86  /* secondary copy, captions */
--color-accent:         #E8A33D  /* "Lightbox Amber" — the warm glow of an X-ray lightbox / film viewer */
--color-accent-dim:     #6B5527  /* amber at low opacity for backgrounds/borders */
--color-vital:          #33D6A6  /* "Pulse Teal" — ECG line / monitor green-teal, used ONLY for the pulse motif & live status dot */
--color-danger:         #E85D4E  /* rare use: availability = "booked", form errors */
--color-hairline:       rgba(246,245,241,0.08)  /* dividers */
```
Two-accent system: **amber** = human warmth/credibility (CTAs, highlights, hover states), **teal** = the "live system" motif (pulse line, status indicators, code/tech tags). Never mix them in the same element — amber sells, teal signals "alive."

### 1.3 Typography
- **Display (headlines):** "Bricolage Grotesque" — a grotesk with humanist quirks in the italics/alternates, reads as precise but not cold. Weight 600–800. Big sizes get tight tracking (-0.02em).
- **Body:** "Inter" — neutral, highly legible at small sizes, excellent for long-form (blog, case studies).
- **Data/mono (tags, metrics, lab-style labels, code):** "JetBrains Mono" — used for tech-stack pills, stat callouts, timestamps, and the eyebrow labels above section headings, evoking a lab report / chart readout.

Type scale (fluid, `clamp()`-based):
```
--fs-display-xl: clamp(2.75rem, 6vw, 6.5rem);   /* hero */
--fs-display-lg: clamp(2rem, 4vw, 3.75rem);     /* section headers */
--fs-display-md: clamp(1.5rem, 2.4vw, 2.25rem); /* card titles */
--fs-body-lg:     1.25rem;
--fs-body:        1rem;
--fs-mono-sm:     0.8125rem;  /* letter-spacing: 0.06em; uppercase */
```

### 1.4 Layout & spacing
- 12-col grid, max-width 1280px, gutters 24px (mobile) / 32px (desktop).
- Vertical rhythm on an 8px base unit; section padding `clamp(96px, 12vw, 180px)` top/bottom — generous whitespace is what makes a black background feel premium instead of cheap.
- Hairline rules (`--color-hairline`) as the *only* border style — no drop shadows, no border-radius above 4px except on pill tags (999px) and avatar/photo crops.

### 1.5 Signature element: The Vitals Spine
A 2px vertical line pinned to the left edge (desktop) / top edge (mobile), rendered as an animated ECG waveform (SVG `path` with a repeating heartbeat blip pattern), that:
- Fills with `--color-vital` proportionally to scroll progress (like a progress bar shaped like a heartbeat trace instead of a plain bar).
- "Beats" (a brief amplitude spike + soft glow pulse) every time a new section enters view — a literal pulse triggered by scroll-triggered viewport intersection.
- On the contact section, the line flatlines-then-restarts as a subtle joke/detail (flatline → gentle revival blip) — the one moment of playful storytelling. Respect `prefers-reduced-motion`: replace with a static filled bar, no animation.

---

## 2. Sitemap & Information Architecture

```
/                       Home (single-page scroll narrative, see §4)
/work                   Case study index (grid of all projects)
/work/[slug]            Individual case study (deep dive)
/services               Services for doctors/clinics (the sales page)
/about                  Longer bio: medicine + dev journey, timeline
/blog                   Blog index (dev + "digital presence for doctors" content)
/blog/[slug]            Blog post
/contact                Contact page (form also embedded on Home)
/resume.pdf             Static CV download (also linked from Hero)
sitemap.xml, robots.txt Auto-generated (see §7)
```
Home is the primary narrative/sales surface (mirrors the section list in §4). `/work`, `/services`, `/about`, `/blog` are the "prove it" depth pages for visitors who want more before contacting.

---

## 3. Global Animation System

### 3.1 Principles (from the referenced scroll-storytelling patterns)
1. **Motion narrates, it doesn't decorate.** Every animation should answer "what is this section telling the visitor?" — reveals mirror reading order, parallax mirrors depth/hierarchy, pulses mirror "this is alive/real."
2. **One orchestrated moment per section**, not five competing effects. Loading screen gets the boldest choreography; every section after gets ONE signature motion treatment.
3. **Depth via parallax layers** (background slower than midground slower than foreground) rather than flat fades — used in Hero, Services, and the featured Project cards.
4. **Scroll-linked, not just scroll-triggered**, where it matters: the Vitals Spine and the Hero portrait scrub directly with scroll position (via GSAP ScrollTrigger `scrub`), not just fade in once.
5. **3D/spiral reveal reserved for ONE moment**: the transition from Hero into Services (see §4.2) — a rotating/spiraling card stack, used exactly once so it stays a "wow," not wallpaper.
6. **Always provide a reduced-motion fallback**: swap to opacity/translate-only, shorter durations, no parallax, no autoplay loops.
7. **Perf budget:** animate only `transform` and `opacity` (GPU-composited). No animating `width/height/top/left/box-shadow` on scroll. Use `will-change` sparingly, only on actively-animating elements, removed after.

### 3.2 GSAP Setup & MCP Server Integration

**GSAP MCP Server:** This project uses the GSAP MCP server for animation orchestration. The MCP server provides:
- Automated ScrollTrigger configuration and scrubbing
- Timeline sequencing with precise timing control
- Reduced-motion detection and fallback generation
- Performance profiling for animation budgets
- Access to GSAP plugins (ScrollTrigger, SplitText, Flip, Observer)

**Installation:**
```bash
npm install gsap @gsap/react
```

**Register plugins once (app/layout.tsx or a dedicated init file):**
```tsx
"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Observer);
}
```

**Core easing tokens:**
```ts
// lib/gsap-config.ts
export const EASE_OUT = "power3.out";        // signature "confident deceleration" ease
export const EASE_SPRING = "elastic.out(1, 0.5)";  // bouncy but controlled
export const EASE_EXPO = "expo.out";         // dramatic entrances
```

### 3.3 Reusable primitive: Scroll Reveal
```tsx
// components/gsap/Reveal.tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

### 3.4 Reusable primitive: Parallax layer
```tsx
// components/gsap/Parallax.tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
}

export function Parallax({ children, speed = 0.3 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const distance = speed * 100;

    gsap.fromTo(
      el,
      { y: distance },
      {
        y: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el.parentElement) st.kill();
      });
    };
  }, [speed]);

  return (
    <div style={{ overflow: "hidden" }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}
```

### 3.5 The Vitals Spine (scroll-linked ECG progress line)
```tsx
// components/gsap/VitalsSpine.tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ECG_PATH =
  "M0,50 L20,50 L28,20 L36,80 L44,50 L60,50 L68,35 L76,65 L84,50 L100,50";

export function VitalsSpine() {
  const trackRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(fill, { strokeDashoffset: 0 });
      return;
    }

    const pathLength = fill.getTotalLength?.() || 1000;
    gsap.set(fill, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(fill, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="vitals-spine" aria-hidden>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="vitals-spine__track"
      >
        <path d={ECG_PATH} className="vitals-spine__ghost" />
        <path
          ref={fillRef}
          d={ECG_PATH}
          className="vitals-spine__fill"
        />
      </svg>
    </div>
  );
}
```
CSS: track is a fixed-position 2px-wide, 100vh-tall strip on the left edge (`position: fixed; left: 24px; top: 0; height: 100vh;`), rotated so the SVG path reads vertically (`writing-mode` trick or simply author the path vertically instead of horizontally — build agent should author it as a tall vertical ECG blip, the horizontal path above is illustrative). `.vitals-spine__ghost` = `stroke: var(--color-hairline)`; `.vitals-spine__fill` = `stroke: var(--color-vital); filter: drop-shadow(0 0 6px var(--color-vital))`.

### 3.6 Signature moment: Spiral/3D card transition (Hero → Services)
Used exactly once, inspired by 3D-spiral scroll techniques: a stack of 3 cards (the three visitor personas — *Doctor*, *Dentist*, *Clinic Owner*) rotate in 3D space and spiral into view as the user scrolls from Hero into the Services teaser.
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const personas = [
  { label: "For Doctors", angle: -12 },
  { label: "For Dentists", angle: 0 },
  { label: "For Clinic Owners", angle: 12 },
];

export function SpiralPersonaStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, rotateY: 0, rotateZ: 0, scale: 1 });
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const p = personas[i];
      const isEven = i % 2 === 0;

      gsap.set(card, {
        rotateY: p.angle * 4,
        rotateZ: isEven ? -25 : 25,
        scale: 0.7,
        opacity: 0,
        transformStyle: "preserve-3d",
        zIndex: 10 - i,
      });

      tl.to(
        card,
        {
          rotateY: p.angle,
          rotateZ: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
        },
        0
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ perspective: 1200, height: "160vh" }}
    >
      <div style={{ position: "sticky", top: "20vh", height: "60vh" }}>
        {personas.map((p, i) => (
          <div
            key={p.label}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="persona-card"
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3.7 Loading screen / intro sequence
Runs once per session (store a `sessionStorage` flag), ~1.6–2.2s total:
1. `0–300ms`: black frame, a thin teal ECG line draws itself left→right across the vertical center (`strokeDashoffset` 0→full length).
2. `300–900ms`: line "flatlines then spikes" once (a quick double-blip), amber glow flashes briefly behind it — the "vitals detected / system online" beat.
3. `900–1500ms`: name types on in mono font — `Prodip Kumar` — via a GSAP SplitText character stagger (no cursor blink after complete), sub-label "Web Developer · Medical Student" fades up beneath.
4. `1500–2200ms`: whole overlay scales down + fades (`scale: 1 → 1.04, opacity: 1 → 0`) revealing the Hero already in its resting state (Hero content should NOT re-animate in after this — it should already be "settled" so there's no double-entrance jank).
Skip button appears after 600ms for repeat visitors; respects reduced motion by cutting straight to a 400ms fade.

```tsx
"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const line = lineRef.current;
    const name = nameRef.current;
    const sub = subRef.current;
    if (!overlay || !line || !name || !sub) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.to(overlay, { opacity: 0, duration: 0.4, onComplete });
      return;
    }

    const pathLength = line.getTotalLength?.() || 1000;
    gsap.set(line, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const split = new SplitText(name, { type: "chars" });
    gsap.set(split.chars, { opacity: 0 });
    gsap.set(sub, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      onComplete: () => {
        split.revert();
        onComplete();
      },
    });

    tl.to(line, { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" })
      .to(line, { strokeDashoffset: -pathLength * 0.2, duration: 0.2, ease: "power1.in" })
      .to(line, { strokeDashoffset: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" })
      .to(split.chars, {
        opacity: 1,
        duration: 0.04,
        stagger: 0.05,
        ease: "none",
      }, "-=0.2")
      .to(sub, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
      .to(overlay, {
        scale: 1.04,
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      });

    return () => {
      tl.kill();
      split.revert();
    };
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="loading-overlay">
      <svg className="loading-ecg">
        <path ref={lineRef} d="M0,50 L100,50" />
      </svg>
      <h1 ref={nameRef} className="loading-name">Prodip Kumar</h1>
      <p ref={subRef} className="loading-sub">Web Developer · Medical Student</p>
      <button onClick={() => setSkipped(true)} className="loading-skip">
        Skip
      </button>
    </div>
  );
}
```

---

## 4. Home Page — Section-by-Section Blueprint

Each section below lists: **Purpose · Content fields (→ maps to Payload CMS in §6) · Layout · Animation spec.**

### 4.1 Hero
**Purpose:** State who he is, what he does for whom, and give an immediate way to act.
**Content:** Job title / specialization line, one-sentence value statement, primary CTA ("Start a Project" → /contact), secondary CTA (CV download), live availability status (dot + label, e.g. "Available for 2 new projects — Sept 2026"), name, portrait/illustration.
**Layout:** Split hero — left: eyebrow (mono, teal) → display headline → value statement → CTA row → availability chip. Right: portrait photo cut into a soft duotone (black/amber) with a subtle vitals-spine pattern bleeding from the edge.
**Animation:** Headline lines reveal via GSAP SplitText word/line stagger + clip-path wipe for an editorial feel. Portrait has parallax via the `Parallax` component (`speed=0.15`) so it drifts slower than the text column on scroll. Availability dot has an idle CSS `pulse` keyframe (opacity 1→0.4→1, 2s loop, teal glow) — the one continuously-looping ambient animation on the page (paused entirely under reduced motion).
```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(51,214,166,0.6); }
  50% { opacity: 0.55; box-shadow: 0 0 0 6px rgba(51,214,166,0); }
}
.availability-dot { animation: pulse-dot 2s ease-in-out infinite; }
```

### 4.2 Persona / Who-I-Help teaser
The Spiral Persona Stack from §3.6 (Doctors / Dentists / Clinic Owners), each card linking to a services section anchor. One-line sub-copy above: "Three kinds of practices. One credibility problem."

### 4.3 Services (for doctors & clinics)
**Purpose:** The actual sales pitch — AI workflow automation + credibility-building websites.
**Content (repeatable, Payload collection `services`):** icon/illustration, title, short description, 3–4 bullet outcomes, optional "starting at" price band.
Example entries to seed: *AI Intake & Scheduling Automation*, *Patient FAQ / Triage Chat Assistant*, *Clinic Website & Local SEO*, *Review & Reputation Automation*, *HIPAA-aware content workflows* (mark as illustrative — confirm real compliance claims before publishing).
**Layout:** Alternating left/right rows (image/mockup ↔ text), each row = its own scroll section.
**Animation:** Each row's image parallaxes in on a diagonal clip-path reveal (mimics an X-ray film sliding into a lightbox — clip-path inset animates from one edge). Text column uses the standard `Reveal` component. Use GSAP ScrollTrigger to scrub the clip-path animation in sync with scroll.

### 4.4 Featured Work / Case Studies (3–5 projects)
**Content per project (Payload collection `projects`):** title, one-line summary, cover media, live demo URL, GitHub URL, problem statement, solution summary, 2–4 key metrics (label + value, mono styling — "Load time: 0.8s", "Lighthouse: 99"), tech-stack tags (pill list), category (medical client / personal / dev tool), featured flag + order.
**Layout:** Horizontal-scroll gallery on desktop (vertical stack on mobile) — cards pinned via `position: sticky` inside a tall scroll container so each project "parks" center-screen briefly before the next slides over it (classic scroll-jacked card-stack pattern).
```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProjectStackItem({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(card, { opacity: 1, scale: 1 });
      return;
    }

    const scale = 1 - (total - index) * 0.04;

    gsap.fromTo(
      card,
      { scale: 0.94, opacity: 0 },
      {
        scale,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrap) st.kill();
      });
    };
  }, [index, total]);

  return (
    <div
      ref={wrapRef}
      className="project-sticky-wrap"
      style={{ top: `${8 + index * 2}vh` }}
    >
      <div ref={cardRef} className="project-card">
        {children}
      </div>
    </div>
  );
}
```
Metrics count up on view using GSAP's `gsap.to` on a proxy object with an `onUpdate` callback, formatted per field type.

### 4.5 Skills & Tech Stack
**Content (Payload collection `skills`, grouped by category):** Programming languages, Frameworks & libraries, CMS/backend (WordPress, Payload, headless), Design tools (Figma, Photoshop), DevOps/tools. Each skill: name, category, optional proficiency 1–5 (rendered as a subtle bar, not a percentage — percentages on skills read as unverifiable/gimmicky).
**Layout:** A "lab report" style grid — mono eyebrow labels per category, skill pills in rows.
**Animation:** Pills stagger-fade in per category as it enters view using GSAP `stagger` inside a ScrollTrigger batch; hovering a pill on desktop nudges it up 2px with a soft amber underline (micro-interaction, not a full transform).

### 4.6 Work / Education Timeline
**Purpose:** Reverse-chronological credibility — dev work AND medical education side by side (a dual-track timeline is the honest, distinctive choice here, since the two tracks running in parallel *is* the story).
**Content (Payload collection `timeline`):** date range, track (`medical` | `dev`), title/role, org, 1–3 achievement bullets.
**Layout:** Two-column timeline against the vertical Vitals Spine (repurposed here as the timeline's own spine) — medical entries left, dev entries right, connected to shared date markers on the spine.
**Animation:** Entries reveal via `Reveal` as each date marker crosses into view; the spine's teal fill (already scroll-linked globally) is what visually "connects" the two tracks — no extra animation needed here, it inherits the global spine.

### 4.7 Social Proof
**Content (Payload collection `testimonials`):** quote, author name, role/clinic, optional photo/logo. Plus: GitHub contribution graph embed, links to any published technical articles.
**Layout:** Auto-advancing but user-controllable quote carousel (pause on hover/focus, full keyboard nav, respects reduced motion by disabling autoplay).
**Animation:** Crossfade + slight vertical drift between quotes using GSAP timeline with `autoAlpha` and `y` transitions. For reduced motion, swap to instant opacity toggle.

### 4.8 Blog Teaser
Pulls latest 3 posts from the `posts` Payload collection (see §4.9). Card reveal via GSAP ScrollTrigger batch stagger. Full blog lives at `/blog`.

### 4.9 Contact
**Content:** direct email, contact form (name, email, project type dropdown, message), links to GitHub/LinkedIn, CV download repeated here.
**Layout:** Full-bleed dark section, form left, direct-contact links + socials right.
**Animation:** This is where the Vitals Spine performs its one storytelling beat — flatlines briefly then a fresh strong pulse blips as the form's first field is focused (a "you've reached a real, responsive person" moment). Form field focus states use a teal underline draw-in (`scaleX` 0→1 via GSAP on focus), submit button has a loading pulse state matching the availability-dot keyframe for visual consistency.

### 4.10 Footer
Minimal: name, nav repeat, socials, "Built with Next.js, GSAP & Payload CMS" (mono, muted), copyright.

---

## 5. Secondary Pages (brief specs)

- **/work** — full project grid (reuses `ProjectStackItem` cards in a static grid instead of scroll-stack), filterable by category/tag.
- **/work/[slug]** — long-form case study: problem → process (with process images/mockups in a parallax gallery) → solution → metrics → outcome quote. Prev/next project nav at bottom.
- **/services** — expands §4.3 into full detail per service, FAQ accordion (motion: height auto-animate via GSAP Flip plugin or manual `height: auto` tween), pricing/packages if applicable, closing CTA.
- **/about** — longer narrative bio merging the medical + dev timeline from §4.6, portrait gallery, personal philosophy statement, downloadable CV.
- **/blog, /blog/[slug]** — standard blog index/detail. Posts support rich text (Payload `richText` field), cover image, reading time, tags. Detail page: reading-progress bar reuses the Vitals Spine component scoped to the article's scroll container instead of the whole page.
- **/contact** — the Hero-adjacent contact section as its own dedicated page for direct-link sharing (e.g., from a business card / social bio).

---

## 6. Payload CMS Schema

Everything editable through Payload — no hardcoded personal content in components. Structure as **Globals** (singletons) for site-wide/one-off content, and **Collections** for repeatable content.

### 6.1 Globals
```ts
// SiteSettings (global)
{
  slug: "site-settings",
  fields: [
    { name: "siteName", type: "text" },
    { name: "tagline", type: "text" },
    { name: "logoText", type: "text" },
    { name: "seo", type: "group", fields: [
      { name: "defaultTitle", type: "text" },
      { name: "defaultDescription", type: "textarea" },
      { name: "ogImage", type: "upload", relationTo: "media" },
    ]},
    { name: "socials", type: "array", fields: [
      { name: "platform", type: "select", options: ["github","linkedin","twitter","instagram","email"] },
      { name: "url", type: "text" },
    ]},
  ],
}

// HeroContent (global)
{
  slug: "hero",
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "headline", type: "text" },
    { name: "valueStatement", type: "textarea" },
    { name: "primaryCtaLabel", type: "text" },
    { name: "primaryCtaHref", type: "text" },
    { name: "cvFile", type: "upload", relationTo: "media" },
    { name: "availability", type: "group", fields: [
      { name: "status", type: "select", options: ["available","limited","booked"] },
      { name: "note", type: "text" },
    ]},
    { name: "portrait", type: "upload", relationTo: "media" },
  ],
}
```

### 6.2 Collections
```ts
// Projects
{
  slug: "projects",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "text" },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "gallery", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
    { name: "liveUrl", type: "text" },
    { name: "githubUrl", type: "text" },
    { name: "problem", type: "richText" },
    { name: "solution", type: "richText" },
    { name: "metrics", type: "array", fields: [
      { name: "label", type: "text" }, { name: "value", type: "text" },
    ]},
    { name: "techStack", type: "array", fields: [{ name: "tag", type: "text" }] },
    { name: "category", type: "select", options: ["medical-client","personal","dev-tool"] },
    { name: "featured", type: "checkbox" },
    { name: "order", type: "number" },
  ],
}

// Services
{
  slug: "services",
  fields: [
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
    { name: "icon", type: "upload", relationTo: "media" },
    { name: "outcomes", type: "array", fields: [{ name: "bullet", type: "text" }] },
    { name: "startingAt", type: "text" },
    { name: "order", type: "number" },
  ],
}

// Skills
{
  slug: "skills",
  fields: [
    { name: "name", type: "text" },
    { name: "category", type: "select", options: ["language","framework","cms-backend","design","devops"] },
    { name: "proficiency", type: "number", min: 1, max: 5 },
  ],
}

// Timeline
{
  slug: "timeline",
  fields: [
    { name: "track", type: "select", options: ["medical","dev"] },
    { name: "title", type: "text" },
    { name: "org", type: "text" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    { name: "achievements", type: "array", fields: [{ name: "bullet", type: "text" }] },
  ],
}

// Testimonials
{
  slug: "testimonials",
  fields: [
    { name: "quote", type: "textarea" },
    { name: "authorName", type: "text" },
    { name: "authorRole", type: "text" },
    { name: "authorPhoto", type: "upload", relationTo: "media" },
  ],
}

// Posts (blog)
{
  slug: "posts",
  fields: [
    { name: "title", type: "text" },
    { name: "slug", type: "text", unique: true },
    { name: "excerpt", type: "textarea" },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "content", type: "richText" },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text" }] },
    { name: "publishedDate", type: "date" },
    { name: "seo", type: "group", fields: [
      { name: "title", type: "text" }, { name: "description", type: "textarea" },
    ]},
  ],
}
```
All fetches should be server-side (`fetch` in Server Components / Payload Local API) so content updates in Payload reflect on next request without a redeploy; use Next.js `revalidateTag` triggered from a Payload `afterChange` hook for on-publish ISR revalidation.

---

## 7. SEO Blueprint

- Per-page `generateMetadata()` in Next.js pulling from each document's own `seo` group, falling back to `SiteSettings.seo`.
- Open Graph + Twitter Card image per page (project covers, post covers, default site OG image as fallback).
- `sitemap.ts` and `robots.ts` using Next.js's native metadata file conventions, generated from Payload's `projects` and `posts` collections at build/revalidate time.
- JSON-LD structured data: `Person` schema on `/about` and site root (name, jobTitle, alumniOf, sameAs → socials), `Article` schema on blog posts, `CreativeWork`/`Project` style schema on case studies where applicable.
- Semantic HTML throughout: one `h1` per page, landmark regions (`header`, `nav`, `main`, `footer`), descriptive link text (never bare "click here").
- Image `alt` text required field enforced in Payload media uploads (block publish without it).
- Core Web Vitals budget: LCP < 2.0s, CLS < 0.05 (reserve aspect-ratio boxes for all media so nothing shifts on load), INP < 200ms (keep scroll-linked animation handlers cheap — transform/opacity only, per §3.1).

---

## 8. Accessibility & Performance Guidelines

- Respect `prefers-reduced-motion` globally via `window.matchMedia("(prefers-reduced-motion: reduce)")` checks — every custom animation component must branch on it (patterns shown in §3.3–3.5).
- Visible focus states on all interactive elements (`:focus-visible` outline in `--color-vital`, never `outline: none` without a replacement).
- Color contrast: body text `#F6F5F1` on `#050505` exceeds WCAG AAA; verify `--color-text-muted` and `--color-accent` on dark backgrounds stay ≥ 4.5:1 for body-sized text (adjust amber lightness up slightly if used for text, not just accents).
- All scroll-jacked/sticky sections (§4.4, §3.6) must remain fully operable via normal scroll and keyboard — no scroll-hijacking that traps the user or breaks native scroll physics.
- Lazy-load below-the-fold media (`next/image` with proper `sizes`), code-split heavy animation sequences (loading screen, spiral stack) so they don't block first paint of text content.
- Test the loading-screen intro sequence with `sessionStorage` gating so repeat visitors within a session aren't forced through it again.

---

## 9. Build Order for Agents

Work in this order; each phase should be a working, deployable increment:

1. **Foundation** — Next.js app scaffold, Tailwind + design tokens from §1 as CSS variables, base typography, Payload CMS install + schema from §6, media upload pipeline.
2. **Layout shell** — global nav, footer, `VitalsSpine` component (static version first, scroll-linking added in phase 4).
3. **Static content pages** — build Hero through Contact (§4.1–4.10) with real Payload-driven content but minimal/no animation — confirm content model and responsive layout are correct before adding motion.
4. **Motion pass 1 (core)** — `Reveal`, `Parallax`, stagger patterns applied across all sections using GSAP ScrollTrigger; Vitals Spine scroll-linking; availability pulse.
5. **Motion pass 2 (signature moments)** — loading screen sequence, Spiral Persona Stack, project scroll-stack, contact-section pulse beat. Use GSAP MCP server for timeline orchestration and performance profiling.
6. **Secondary pages** — /work, /work/[slug], /services, /about, /blog, /blog/[slug].
7. **SEO + a11y + performance pass** — metadata, structured data, sitemap/robots, reduced-motion audit, Lighthouse pass (target 95+ across the board), contrast audit.
8. **Content population** — Prodip fills in real projects, testimonials, timeline, and initial blog posts through the Payload admin UI; no further code changes required for routine content updates going forward.

---

*End of blueprint. Any build agent picking this up should re-read §3.1 (animation principles) before implementing any new motion, and re-check §1.5/§3.5 (Vitals Spine) before introducing any new accent color or progress indicator, to keep the visual language singular across the whole site.*
