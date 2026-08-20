import type { Metadata } from 'next'

import { Contact } from '@/components/home/Contact'
import { getCachedGlobal } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ContactPage() {
  const siteSettings = (await getCachedGlobal('site-settings', 1)()) as SiteSetting

  return (
    <main className="pt-16">
      <Contact siteSettings={siteSettings} />
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