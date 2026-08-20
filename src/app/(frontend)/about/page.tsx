import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import { Timeline } from '@/components/home/Timeline'
import { getCachedGlobal, getTimeline } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import React from 'react'

import type { Hero as HeroGlobal, SiteSetting } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function AboutPage() {
  const hero = (await getCachedGlobal('hero', 2)()) as HeroGlobal
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting
  const timeline = await getTimeline()

  const socials = (siteSettings?.socials || []).map((s) => s.url).filter(Boolean)

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteSettings?.siteName || 'Prodip Kumar',
    jobTitle: 'Web Developer & Medical Student',
    description: siteSettings?.tagline || undefined,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Bikrampur Bhuiyan Medical College',
    },
    ...(socials.length ? { sameAs: socials } : {}),
  }

  const portrait = typeof hero?.portrait === 'object' ? hero.portrait : null

  return (
    <main className="pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="container grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="mono-sm text-vital">About</p>
          <h1 className="display-xl mt-4 font-display font-bold tracking-tight text-text">
            The dual track.
          </h1>
          {portrait && (
            <div className="mt-8 aspect-[4/5] overflow-hidden rounded-sm border border-hairline">
              <Media
                resource={portrait}
                size="(max-width: 768px) 100vw, 40vw"
                className="h-full"
                imgClassName="hero-portrait__img"
              />
            </div>
          )}
        </Reveal>

        <div className="space-y-8 text-text-muted">
          <Reveal as="div">
            <p className="body-lg text-text">
              I&apos;m Prodip Kumar — a fourth-year medical student and a web developer. For most of
              my week I&apos;m in lectures and rotations at Bikrampur Bhuiyan Medical College. In the
              hours between, I design and build the web presence that makes clinics look as
              trustworthy as they actually are.
            </p>
          </Reveal>
          <Reveal as="div">
            <p>
              That combination is the point. I&apos;ve seen from the inside how a practice loses
              patients to a slow website, an unclaimed Google profile, or a front desk buried in the
              same seven questions every day. I build the tools that fix those exact problems — intake
              automation, FAQ assistants, local SEO, review systems — because I&apos;ve stood behind the
              front desk and watched them happen.
            </p>
          </Reveal>
          <Reveal as="div">
            <p>
              Before medical school I spent two years as a freelance frontend developer, then moved
              into building automation for healthcare teams and an open-source component library for
              medical web apps. I work with physicians, dentists, and clinic owners who want a digital
              presence that earns trust before the first appointment.
            </p>
          </Reveal>
          <Reveal as="div">
            <p>
              What I value: honest work, plain language, and systems that save clinicians real hours.
              What I&apos;m not: another agency that hands you a template and disappears after launch.
            </p>
          </Reveal>
          <Reveal as="div">
            <a
              href="/resume.pdf"
              className="mono-sm inline-block rounded-sm border border-accent/40 px-6 py-3 text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              Download CV ↓
            </a>
          </Reveal>
        </div>
      </div>

      <div className="mt-24">
        <Timeline entries={timeline} />
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting
  return {
    title: 'About — Prodip Kumar',
    description:
      siteSettings?.tagline ||
      'The story of a medical student and web developer building trusted digital presence for clinics.',
    openGraph: mergeOpenGraph({
      title: 'About — Prodip Kumar',
      url: `${getServerSideURL()}/about`,
    }),
  }
}