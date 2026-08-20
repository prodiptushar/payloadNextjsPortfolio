import type { Metadata } from 'next'

import { WorkGrid } from '@/components/work/WorkGrid'
import { getAllProjects } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function WorkPage() {
  const projects = await getAllProjects()

  return (
    <main className="section-pad">
      <div className="container">
        <p className="mono-sm text-vital">Selected work</p>
        <h1 className="display-xl mt-4 font-display font-bold tracking-tight text-text">
          Case studies.
        </h1>
        <p className="body-lg mt-6 max-w-2xl text-text-muted">
          Credibility systems and websites built for physicians, dentists, and clinics — plus the
          open-source tools that make medical web apps faster to ship.
        </p>
      </div>

      <div className="container mt-14">
        <WorkGrid projects={projects} />
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Work — Prodip Kumar',
    description:
      'Case studies in medical web development and AI automation for doctors, dentists, and clinics.',
    openGraph: mergeOpenGraph({
      title: 'Work — Prodip Kumar',
      url: `${getServerSideURL()}/work`,
    }),
  }
}