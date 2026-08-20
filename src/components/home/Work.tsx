'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import { Media } from '@/components/Media'
import { CountUp } from '@/components/gsap/CountUp'
import Link from 'next/link'
import React, { useRef } from 'react'

import type { Project } from '@/payload-types'

export function Work({ projects }: { projects: Project[] }) {
  const stackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const items = gsap.utils.toArray<HTMLElement>('.project-stack__card')
      items.forEach((card, i) => {
        const total = items.length
        const targetScale = 1 - (total - i) * 0.04
        gsap.fromTo(
          card,
          { scale: 0.94, opacity: 0 },
          {
            scale: targetScale,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    },
    { scope: stackRef },
  )

  return (
    <section ref={stackRef} data-vitals className="section-pad border-t border-hairline project-stack" aria-label="Work" id="work">
      <div className="container">
        <div className="mb-14 max-w-2xl">
          <p className="mono-sm text-vital">Featured work</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Case studies that prove it.
          </h2>
        </div>
      </div>
      <div className="container">
        {projects.map((project, i) => {
          const cover =
            typeof project.cover === 'object' && project.cover ? project.cover : null
          const total = projects.length
          const scale = 1 - (total - i) * 0.04
          return (
            <div
              key={project.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="project-stack__item"
              style={{ top: `${14 + i * 5}vh` }}
            >
              <article className="project-stack__card" style={{ '--card-scale': scale } as React.CSSProperties}>
              <Link href={`/work/${project.slug}`} className="project-stack__cover" aria-label={project.title}>
                {cover ? (
                  <Media resource={cover} size="(max-width: 768px) 100vw, 60vw" className="h-full" />
                ) : (
                  <div className="project-stack__cover-fallback" aria-hidden />
                )}
              </Link>
              <div className="project-stack__body">
                <span className="mono-sm text-accent">
                  {project.category === 'medical-client'
                    ? 'Medical client'
                    : project.category === 'dev-tool'
                      ? 'Dev tool'
                      : 'Personal'}
                </span>
                <h3 className="display-md mt-2 font-display font-bold tracking-tight text-text">
                  <Link href={`/work/${project.slug}`} className="hover:text-accent transition-colors">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-prose text-text-muted">{project.summary}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {project.metrics?.map((m, idx) => (
                    <div key={idx} className="rounded-sm border border-hairline bg-bg-raised px-3 py-3">
                      <CountUp value={m.value ?? ''} className="mono-sm block text-vital" />
                      <span className="mt-1 block text-xs text-text-muted">{m.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.techStack?.map((t, idx) => (
                    <li
                      key={idx}
                      className="mono-sm rounded-full border border-hairline px-3 py-1 text-text-muted"
                    >
                      {t.tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/work/${project.slug}`}
                    className="mono-sm text-accent underline-offset-4 hover:underline"
                  >
                    View case study →
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-sm text-text-muted hover:text-text transition-colors"
                    >
                      Live site ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-sm text-text-muted hover:text-text transition-colors"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          </div>
        )
      })}
      </div>
    </section>
  )
}