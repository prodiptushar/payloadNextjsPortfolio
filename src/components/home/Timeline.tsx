import { Reveal } from '@/components/gsap/Reveal'
import React from 'react'

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

  const Track: React.FC<{ label: string; items: TimelineEntry[]; accent: 'vital' | 'accent' }> = ({
    label,
    items,
    accent,
  }) => (
    <div className="timeline-track">
      <p className={`mono-sm mb-6 ${accent === 'vital' ? 'text-vital' : 'text-accent'}`}>{label}</p>
      <ol className="space-y-10">
        {items.map((entry) => (
          <li key={entry.id}>
            <Reveal>
              <p className="mono-sm text-text-muted">{range(entry)}</p>
              <h3 className="display-md mt-2 font-display font-bold tracking-tight text-text">
                {entry.title}
              </h3>
              {entry.org && <p className="mt-1 text-sm text-text-muted">{entry.org}</p>}
              {entry.achievements && entry.achievements.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {entry.achievements.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                      <span
                        className={`mt-1.5 h-1 w-2 shrink-0 ${accent === 'vital' ? 'bg-vital' : 'bg-accent'}`}
                        aria-hidden
                      />
                      {a.bullet}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <section data-vitals className="section-pad border-t border-hairline" aria-label="Timeline">
      <div className="container">
        <div className="mb-14 max-w-2xl">
          <p className="mono-sm text-vital">Two tracks, one story</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Medicine and code, running in parallel.
          </h2>
        </div>
        <div className="relative grid gap-16 md:grid-cols-2">
          <div className="timeline-spine absolute left-1/2 top-0 bottom-0 hidden w-px bg-hairline md:block" aria-hidden />
          <Track label="Medicine" items={medical} accent="vital" />
          <Track label="Development" items={dev} accent="accent" />
        </div>
      </div>
    </section>
  )
}