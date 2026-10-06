'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import React, { useEffect, useRef, useState } from 'react'

import type { Testimonial } from '@/payload-types'

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const count = testimonials.length

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count)

  useGSAP(
    () => {
      const slide = slideRef.current
      if (!slide) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(slide, { autoAlpha: 1, y: 0 })
        return
      }
      gsap.fromTo(slide, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    },
    { scope: trackRef, dependencies: [index] },
  )

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || count <= 1) return
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count)
    }, 6000)
    return () => window.clearInterval(id)
  }, [count])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  if (count === 0) return null

  const active = testimonials[index]
  const photo = typeof active.authorPhoto === 'object' ? active.authorPhoto : null

  return (
    <section
      data-vitals
      className="section-pad border-t border-hairline"
      aria-label="Testimonials"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="mono-sm text-vital">Social proof</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            What the practices say.
          </h2>
        </div>

        <div
          ref={trackRef}
          className="mx-auto max-w-3xl"
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onKeyDown={onKeyDown}
        >
          <div ref={slideRef} className="min-h-[220px] rounded-sm border border-hairline bg-bg-raised p-8 md:p-12">
            <blockquote className="text-lg leading-relaxed text-text">
              “{active.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              {photo && (
                <Media
                  resource={photo}
                  size="48px"
                  className="h-11 w-11 shrink-0 overflow-hidden rounded-full"
                />
              )}
              <div>
                <div className="font-display text-sm font-semibold text-text">{active.authorName}</div>
                <div className="mono-sm text-text-muted">{active.authorRole}</div>
              </div>
            </figcaption>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-vital' : 'w-1.5 bg-hairline hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="mono-sm rounded-sm border border-hairline px-3 py-1.5 text-text-muted transition-colors hover:border-accent/50 hover:text-text"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="mono-sm rounded-sm border border-hairline px-3 py-1.5 text-text-muted transition-colors hover:border-accent/50 hover:text-text"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-sm border border-hairline bg-bg-raised p-6">
              <p className="mono-sm text-accent">Open source</p>
              <h3 className="display-md mt-3 font-display font-bold tracking-tight text-text">
                GitHub activity
              </h3>
              <div className="mt-4 aspect-[2/1] overflow-hidden rounded-sm border border-hairline bg-bg">
                <img
                  src="https://github-contributions-api.jogruber.de/v5/prodipkumar?y=last&theme=dark&label=0&format=svg"
                  alt="GitHub contribution graph"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-sm border border-hairline bg-bg-raised p-6">
              <p className="mono-sm text-accent">Writing</p>
              <h3 className="display-md mt-3 font-display font-bold tracking-tight text-text">
                Technical articles
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="#" className="contact-link mono-sm text-text">
                    Building HIPAA-aware intake forms with Next.js →
                  </a>
                </li>
                <li>
                  <a href="#" className="contact-link mono-sm text-text">
                    Local SEO for clinics: a developer's checklist →
                  </a>
                </li>
                <li>
                  <a href="#" className="contact-link mono-sm text-text">
                    Why your clinic's website fails patients →
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}