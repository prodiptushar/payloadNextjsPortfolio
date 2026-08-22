'use client'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import Link from 'next/link'
import React, { useRef } from 'react'

const personas = [
  { label: 'For Doctors', sub: 'Intake, scheduling & credibility', y: 80 },
  { label: 'For Dentists', sub: 'Websites, reviews & local SEO', y: 250 },
  { label: 'For Clinic Owners', sub: 'Automation across the practice', y: 420 },
]

const PATH_H = 500

function buildPath(): string {
  const pts: string[] = [`M50,0`]
  let y = 0
  for (const p of personas) {
    const mid = p.y - 20
    pts.push(`L50,${mid}`)
    pts.push(`L44,${mid + 3}`)
    pts.push(`L56,${mid + 7}`)
    pts.push(`L48,${mid + 11}`)
    pts.push(`L50,${p.y}`)
    y = p.y
  }
  pts.push(`L50,${PATH_H}`)
  return pts.join(' ')
}

const ECG_PATH = buildPath()

export function DrawnPathReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const glowRefs = useRef<(SVGCircleElement | null)[]>([])
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const container = containerRef.current
      const path = pathRef.current
      if (!container || !path) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduce) {
        cardsRef.current.forEach((card) => {
          if (card) gsap.set(card, { opacity: 1, y: 0 })
        })
        glowRefs.current.forEach((g) => {
          if (g) gsap.set(g, { opacity: 1, r: 8 })
        })
        gsap.set(path, { strokeDashoffset: 0 })
        return
      }

      const pathLength = path.getTotalLength() || 1000
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 0, y: 24 })
      })
      glowRefs.current.forEach((g) => {
        if (g) gsap.set(g, { opacity: 0.2, r: 4 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.6,
        },
      })

      const perCard = 1 / personas.length

      personas.forEach((p, i) => {
        const drawTo = (p.y / PATH_H) * pathLength
        const card = cardsRef.current[i]
        const glow = glowRefs.current[i]
        const start = i * perCard
        const mid = start + perCard * 0.5
        const end = start + perCard

        tl.to(path, { strokeDashoffset: pathLength - drawTo, ease: 'none' }, start)

        if (glow) {
          tl.to(glow, { opacity: 1, r: 8, duration: perCard * 0.4, ease: 'power2.out' }, mid - perCard * 0.1)
          tl.to(glow, { r: 6, duration: perCard * 0.3, ease: 'sine.inOut' }, mid + perCard * 0.3)
        }

        if (card) {
          tl.to(card, { opacity: 1, y: 0, duration: perCard * 0.6, ease: 'power3.out' }, mid - perCard * 0.05)
        }
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 1 - perCard * 0.4)
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="drawn-path">
      <div className="drawn-path__stage">
        <div className="drawn-path__path-col">
          <svg
            viewBox={`0 0 100 ${PATH_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="drawn-path__svg"
            aria-hidden
          >
            <path d={ECG_PATH} className="drawn-path__ghost" />
            <path ref={pathRef} d={ECG_PATH} className="drawn-path__line" />
            {personas.map((p, i) => (
              <circle
                key={p.label}
                cx={50}
                cy={p.y}
                r={4}
                className="drawn-path__node"
                ref={(el) => {
                  glowRefs.current[i] = el
                }}
              />
            ))}
          </svg>
        </div>

        <div className="drawn-path__cards">
          {personas.map((p, i) => (
            <div
              key={p.label}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="drawn-path__card"
            >
              <span className="drawn-path-card__mono">0{i + 1} / Who I help</span>
              <h3 className="drawn-path-card__label">{p.label}</h3>
              <p className="drawn-path-card__sub">{p.sub}</p>
              <Link href="/services" className="drawn-path-card__cta">
                View services →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}