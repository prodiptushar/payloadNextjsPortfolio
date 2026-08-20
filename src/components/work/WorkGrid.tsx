'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import { Media } from '@/components/Media'
import { CountUp } from '@/components/gsap/CountUp'
import Link from 'next/link'
import React, { useRef, useState } from 'react'

import type { Project } from '@/payload-types'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'medical-client', label: 'Medical clients' },
  { value: 'dev-tool', label: 'Dev tools' },
  { value: 'personal', label: 'Personal' },
] as const

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.work-card', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: gridRef, dependencies: [filter] },
  )

  return (
    <div ref={gridRef}>
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`mono-sm rounded-full border px-4 py-1.5 transition-colors ${
              filter === f.value
                ? 'border-accent bg-accent text-bg'
                : 'border-hairline text-text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project) => {
          const cover = typeof project.cover === 'object' ? project.cover : null
          return (
            <article
              key={project.id}
              className="work-card flex flex-col rounded-sm border border-hairline bg-bg-raised transition-colors hover:border-accent/40"
            >
              <Link href={`/work/${project.slug}`} className="group flex flex-1 flex-col p-6">
                {cover && (
                  <div className="mb-5 aspect-[16/10] overflow-hidden rounded-sm border border-hairline">
                    <Media
                      resource={cover}
                      size="(max-width: 768px) 100vw, 50vw"
                      className="h-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <span className="mono-sm text-accent">
                  {project.category === 'medical-client'
                    ? 'Medical client'
                    : project.category === 'dev-tool'
                      ? 'Dev tool'
                      : 'Personal'}
                </span>
                <h2 className="display-md mt-2 font-display font-bold tracking-tight text-text transition-colors group-hover:text-accent">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted">{project.summary}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {project.metrics?.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="rounded-sm border border-hairline bg-bg px-3 py-2">
                      <CountUp value={m.value ?? ''} className="mono-sm block text-vital" />
                      <span className="mt-1 block text-xs text-text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>

                <span className="mono-sm mt-5 inline-block text-accent">View case study →</span>
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}