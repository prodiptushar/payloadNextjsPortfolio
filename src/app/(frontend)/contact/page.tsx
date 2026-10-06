import type { Metadata } from 'next'

import { Contact } from '@/components/home/Contact'
import { getCachedGlobal } from '@/utilities/getData'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import React from 'react'

import type { Hero as HeroGlobal, SiteSetting } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ContactPage() {
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting
  const hero = (await getCachedGlobal('hero', 2)()) as HeroGlobal
  const cvFile = hero?.cvFile && typeof hero.cvFile === 'object' ? hero.cvFile : null
  const cvUrl = cvFile?.url ? getMediaUrl(cvFile.url, cvFile.updatedAt) : null

  return (
    <main className="pt-16">
      <Contact siteSettings={siteSettings} cvUrl={cvUrl} />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact — Prodip Kumar',
    description: 'Start a project with Prodip Kumar — web development and AI automation for clinics.',
    openGraph: mergeOpenGraph({
      title: 'Contact — Prodip Kumar',
      url: `${getServerSideURL()}/contact`,
    }),
  }
}