'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import { Reveal } from '@/components/gsap/Reveal'
import React, { useRef } from 'react'

import type { Skill } from '@/payload-types'

const CATEGORY_ORDER = ['language', 'framework', 'cms-backend', 'design', 'devops'] as const
const CATEGORY_LABELS: Record<string, string> = {
  language: 'Language',
  framework: 'Frameworks & Libraries',
  'cms-backend': 'CMS / Backend',
  design: 'Design',
  devops: 'DevOps / Tools',
}

export function Skills({ skills }: { skills: Skill[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  const groups = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.utils.toArray<HTMLElement>('[data-skill-pills]').forEach((block) => {
        gsap.from(block.children, {
          y: 14,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} data-vitals className="section-pad border-t border-hairline" aria-label="Skills">
      <div className="container">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mono-sm text-vital">Skills / Lab report</p>
            <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
              The stack that ships patient-facing systems.
            </h2>
          </div>
          <p className="mono-sm text-text-muted">proficiency · 1–5</p>
        </div>

        <div className="grid gap-10 border-t border-hairline pt-10 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.cat}>
              <p className="mono-sm mb-4 text-accent">{group.label}</p>
              <ul data-skill-pills className="flex flex-wrap gap-2.5">
                {group.items.map((skill) => (
                  <li
                    key={skill.id}
                    className="skill-pill group flex items-center gap-3 rounded-full border border-hairline bg-bg-raised px-4 py-2 transition-colors hover:border-accent/50"
                  >
                    <span className="text-sm text-text">{skill.name}</span>
                    <span className="flex items-center gap-[3px]" aria-label={`Proficiency ${skill.proficiency} of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className={`h-1 w-3 rounded-sm ${
                            skill.proficiency && i < skill.proficiency ? 'bg-vital' : 'bg-hairline'
                          }`}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}