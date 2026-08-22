'use client'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap-config'
import React, { useRef } from 'react'

import type { Timeline as TimelineEntry } from '@/payload-types'

const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return MONTH_FMT.format(d)
}

function range(entry: TimelineEntry): string {
  const start = formatDate(entry.startDate)
  const end = entry.endDate ? formatDate(entry.endDate) : 'Present'
  return `${start ?? 'Unknown'} — ${end}`
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const medical = entries.filter((e) => e.track === 'medical').reverse()
  const dev = entries.filter((e) => e.track === 'dev').reverse()

  const maxRows = Math.max(medical.length, dev.length)
  const rows: { med?: TimelineEntry; dev?: TimelineEntry }[] = []
  for (let i = 0; i < maxRows; i++) {
    rows.push({ med: medical[i], dev: dev[i] })
  }

  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const medRefs = useRef<(HTMLDivElement | null)[]>([])
  const devRefs = useRef<(HTMLDivElement | null)[]>([])

  const ROW_PX = 220
  const SPINE_PAD = 100
  const pathH = rows.length * ROW_PX + SPINE_PAD
  const spineY = 50
  const NODE_SPACING = ROW_PX

  useGSAP(
    () => {
      const section = sectionRef.current
      const path = pathRef.current
      if (!section || !path) return

      if (prefersReducedMotion()) {
        medRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        devRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        gsap.set(path, { strokeDashoffset: 0 })
        return
      }

      const pathLength = path.getTotalLength() || 1000
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

      medRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 20 })
      })
      devRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 20 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.5,
        },
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0)

      const perRow = 1 / rows.length
      rows.forEach((row, i) => {
        const frac = (i + 0.5) / rows.length
        const medEl = medRefs.current[i]
        const devEl = devRefs.current[i]

        if (medEl && row.med) {
          tl.to(
            medEl,
            { opacity: 1, y: 0, duration: perRow * 0.6, ease: 'power3.out' },
            frac - perRow * 0.15,
          )
        }
        if (devEl && row.dev) {
          tl.to(
            devEl,
            { opacity: 1, y: 0, duration: perRow * 0.6, ease: 'power3.out' },
            frac - perRow * 0.15,
          )
        }
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      data-vitals
      className="section-pad border-t border-hairline"
      aria-label="Timeline"
    >
      <div className="container">
        <div className="mb-14 max-w-2xl">
          <p className="mono-sm text-vital">Two tracks, one story</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Medicine and code, running in parallel.
          </h2>
        </div>

        <div className="timeline-grid">
          {/* Spine */}
          <div className="timeline-spine" aria-hidden>
            <svg
              viewBox={`0 0 6 ${pathH}`}
              preserveAspectRatio="none"
              className="timeline-spine__svg"
            >
              <path d={`M3,0 L3,${pathH}`} className="timeline-spine__ghost" />
              <path
                ref={pathRef}
                d={`M3,${spineY} L3,${pathH}`}
                className="timeline-spine__line"
              />
              {rows.map((row, i) => {
                const cy = spineY + i * NODE_SPACING + NODE_SPACING * 0.5
                return (
                  <React.Fragment key={i}>
                    {row.med && (
                      <circle cx="3" cy={cy} r="4" className="timeline-spine__node timeline-spine__node--vital" />
                    )}
                    {row.dev && (
                      <circle cx="3" cy={cy} r="4" className="timeline-spine__node timeline-spine__node--accent" />
                    )}
                  </React.Fragment>
                )
              })}
            </svg>
          </div>

          {/* Entries */}
          <div className="timeline-entries" style={{ minHeight: pathH }}>
            {rows.map((row, i) => (
              <div key={i} className="timeline-row">
                <div className="timeline-entry timeline-entry--left">
                  {row.med ? (
                    <div
                      ref={(el) => { medRefs.current[i] = el }}
                      className="timeline-card"
                    >
                      <p className="mono-sm text-vital">{range(row.med)}</p>
                      <h3 className="display-md mt-2 font-display font-bold tracking-tight text-text">
                        {row.med.title}
                      </h3>
                      {row.med.org && (
                        <p className="mt-1 text-sm text-text-muted">{row.med.org}</p>
                      )}
                      {row.med.achievements && row.med.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {row.med.achievements.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                              <span className="timeline-bullet timeline-bullet--vital" aria-hidden />
                              {a.bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="timeline-empty" />
                  )}
                </div>

                <div className="timeline-entry timeline-entry--right">
                  {row.dev ? (
                    <div
                      ref={(el) => { devRefs.current[i] = el }}
                      className="timeline-card"
                    >
                      <p className="mono-sm text-accent">{range(row.dev)}</p>
                      <h3 className="display-md mt-2 font-display font-bold tracking-tight text-text">
                        {row.dev.title}
                      </h3>
                      {row.dev.org && (
                        <p className="mt-1 text-sm text-text-muted">{row.dev.org}</p>
                      )}
                      {row.dev.achievements && row.dev.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {row.dev.achievements.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                              <span className="timeline-bullet timeline-bullet--accent" aria-hidden />
                              {a.bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="timeline-empty" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
