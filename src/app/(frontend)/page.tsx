import type { Metadata } from 'next'

import { Hero } from '@/components/home/Hero'
import { Persona } from '@/components/home/Persona'
import { Services } from '@/components/home/Services'
import { Work } from '@/components/home/Work'
import { Skills } from '@/components/home/Skills'
import { Timeline } from '@/components/home/Timeline'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogTeaser } from '@/components/home/BlogTeaser'
import { Contact } from '@/components/home/Contact'
import {
  getAllProjects,
  getCachedGlobal,
  getPosts,
  getServices,
  getSkills,
  getTestimonials,
  getTimeline,
} from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import React from 'react'

import type { Hero as HeroGlobal, SiteSetting } from '@/payload-types'

export default async function HomePage() {
  const hero = (await getCachedGlobal('hero', 2)()) as HeroGlobal
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting
  const projects = await getAllProjects()
  const services = await getServices()
  const skills = await getSkills()
  const timeline = await getTimeline()
  const testimonials = await getTestimonials()
  const posts = await getPosts(3)

  return (
    <main>
      <Hero hero={hero} />
      <Persona />
      <Services services={services} />
      <Work projects={projects} />
      <Skills skills={skills} />
      <Timeline entries={timeline} />
      <Testimonials testimonials={testimonials} />
      <BlogTeaser posts={posts} />
      <Contact siteSettings={siteSettings} />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting

  const seo = siteSettings?.seo

  return {
    title: seo?.defaultTitle || 'Prodip Kumar — Web Developer & Medical Student',
    description: seo?.defaultDescription || undefined,
    openGraph: mergeOpenGraph({
      ...(seo?.ogImage && typeof seo.ogImage === 'object'
        ? { images: [{ url: seo.ogImage.url || '' }] }
        : {}),
    }),
    alternates: {
      canonical: getServerSideURL(),
    },
  }
}