'use client'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap-config'
import { Media } from '@/components/Media'
import { Parallax } from '@/components/gsap/Parallax'
import Link from 'next/link'
import React, { useRef } from 'react'

import type { Hero as HeroGlobal } from '@/payload-types'

export function Hero({ hero }: { hero: HeroGlobal }) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const headline = headlineRef.current
      if (!headline) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const split = new SplitText(headline, { type: 'words' })

      // Wrap each word in an overflow-hidden span for a clip wipe reveal
      split.words.forEach((word) => {
        const wrap = document.createElement('span')
        wrap.className = 'hero-wipe'
        word.parentNode?.insertBefore(wrap, word)
        wrap.appendChild(word)
      })

      gsap.set(split.words, { yPercent: 120, opacity: 0 })
      gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power4.out',
        delay: 0.1,
        onComplete: () => {
          split.revert()
        },
      })

      return () => {
        split.revert()
      }
    },
    { scope: wrapRef },
  )

  const availability = hero?.availability
  const status = availability?.status || 'available'
  const statusLabel =
    status === 'available' ? 'Available' : status === 'limited' ? 'Limited availability' : 'Currently booked'

  return (
    <section data-vitals className="section-pad relative overflow-hidden" aria-label="Intro">
      <div ref={wrapRef} className="container grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mono-sm mb-6 text-vital">{hero?.eyebrow}</p>
          <h1
            ref={headlineRef}
            className="display-xl font-display font-bold leading-[1.02] tracking-tight text-text"
          >
            {hero?.headline}
          </h1>
          <p className="body-lg mt-8 max-w-prose text-text-muted">{hero?.valueStatement}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={hero?.primaryCtaHref || '/contact'}
              className="rounded-sm bg-accent px-6 py-3 font-display text-sm font-semibold tracking-tight text-bg transition-opacity hover:opacity-90"
            >
              {hero?.primaryCtaLabel || 'Start a Project'}
            </Link>
            {hero?.cvFile && (
              <a
                href="/resume.pdf"
                className="mono-sm rounded-sm border border-hairline px-6 py-3 text-text transition-colors hover:border-accent/60 hover:text-accent"
              >
                Download CV ↓
              </a>
            )}
          </div>

          {availability && (
            <div className="mt-8 flex items-center gap-2.5">
              <span className="availability-dot h-1.5 w-1.5 rounded-full bg-vital" aria-hidden />
              <span className="mono-sm text-text-muted">
                {statusLabel}
                {availability.note ? ` — ${availability.note}` : ''}
              </span>
            </div>
          )}
        </div>

        <Parallax speed={0.15} className="hero-portrait-wrap animate-float">
          {hero?.portrait && typeof hero.portrait === 'object' ? (
            <Media
              resource={hero.portrait}
              size="(max-width: 768px) 80vw, 40vw"
              className="hero-portrait"
              imgClassName="hero-portrait__img"
              priority
            />
          ) : (
            <div className="hero-portrait hero-portrait--placeholder" aria-hidden />
          )}
        </Parallax>
      </div>
    </section>
  )
}