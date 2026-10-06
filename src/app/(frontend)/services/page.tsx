import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import { ServicesAccordion } from '@/components/services/ServicesAccordion'
import { getServices } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main className="section-pad">
      <div className="container">
        <p className="mono-sm text-vital">Services</p>
        <h1 className="display-xl mt-4 font-display font-bold tracking-tight text-text">
          Built for the clinic, trusted by the patient.
        </h1>
        <p className="body-lg mt-6 max-w-2xl text-text-muted">
          Everything below serves one goal: making a practice look, feel, and run like the
          trustworthy institution it already is.
        </p>
      </div>

      <div className="container mt-16 flex flex-col gap-10">
        {services.map((service, i) => {
          const icon = typeof service.icon === 'object' ? service.icon : null
          return (
            <Reveal key={service.id}>
              <div className="grid items-center gap-8 rounded-sm border border-hairline bg-bg-raised p-8 md:grid-cols-[auto_1fr]">
                {icon && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-hairline">
                    <Media resource={icon} size="64px" className="h-full" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="display-md font-display font-bold tracking-tight text-text">
                      {service.title}
                    </h2>
                    {service.startingAt && (
                      <span className="mono-sm text-accent">from {service.startingAt}</span>
                    )}
                  </div>
                  <p className="mt-2 max-w-2xl text-text-muted">{service.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {(service.outcomes || []).map((o, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-text">
                        <span className="h-1 w-2 bg-vital" aria-hidden />
                        {o.bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      <div className="container mt-24">
        <h2 className="display-lg font-display font-bold tracking-tight text-text">
          Questions, answered.
        </h2>
        <div className="mt-8 max-w-3xl">
          <ServicesAccordion />
        </div>
      </div>

      <div className="container mt-24 border-t border-hairline pt-14 text-center">
        <h2 className="display-lg font-display font-bold tracking-tight text-text">
          Ready to be the practice patients find first?
        </h2>
        <p className="body-lg mx-auto mt-4 max-w-xl text-text-muted">
          Tell me where your practice is struggling — I&apos;ll map the fastest fix.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-sm bg-accent px-8 py-3.5 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          Start a Project
        </Link>
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services — Prodip Kumar',
    description:
      'Web development, AI automation, local SEO, and reputation management for doctors, dentists, and clinics.',
    openGraph: mergeOpenGraph({
      title: 'Services — Prodip Kumar',
      url: `${getServerSideURL()}/services`,
    }),
  }
}