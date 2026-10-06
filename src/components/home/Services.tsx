'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import Link from 'next/link'
import React, { useRef } from 'react'

import type { Service } from '@/payload-types'

export function Services({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // X-ray film slide-in: the mock panel reveals diagonally, scrubbed with scroll
      gsap.utils.toArray<HTMLElement>('.service-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              end: 'top 30%',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="services"
      data-vitals
      className="section-pad border-t border-hairline"
      aria-label="Services"
    >
      <div className="container">
        <div className="mb-16 max-w-2xl">
          <p className="mono-sm text-vital">Services</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Trust is built before the first visit.
          </h2>
          <p className="body-lg mt-4 text-text-muted">
            Systems that run your clinic after hours, and websites that make patients choose you
            before it opens.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {services.map((service, i) => {
            const icon = typeof service.icon === 'object' ? service.icon : null
            return (
              <div
                key={service.id}
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="service-panel">
                  {icon ? (
                    <div className="aspect-[4/3] overflow-hidden rounded-sm border border-hairline bg-bg-raised">
                      <Media resource={icon} size="(max-width: 768px) 100vw, 50vw" className="h-full" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-sm border border-hairline bg-bg-raised" aria-hidden />
                  )}
                </div>

                <Reveal>
                  <span className="mono-sm text-accent">{service.startingAt ? `from ${service.startingAt}` : 'Services'}</span>
                  <h3 className="display-md mt-3 font-display font-bold tracking-tight text-text">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-text-muted">{service.description}</p>
                  <ul className="mt-5 space-y-2">
                    {service.outcomes?.map((o, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-text">
                        <span className="mt-1.5 h-1 w-3 shrink-0 bg-vital" aria-hidden />
                        {o.bullet}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            )
          })}
        </div>

        <Reveal className="mt-20 text-center">
          <Link
            href="/services"
            className="mono-sm rounded-sm border border-accent/40 px-6 py-3 text-accent transition-colors hover:bg-accent hover:text-bg"
          >
            All services &amp; details →
          </Link>
        </Reveal>
      </div>
    </section>
  )
}