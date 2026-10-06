import type { Metadata } from 'next'

import { CountUp } from '@/components/gsap/CountUp'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { getAllProjects, getProjectBySlug } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

const queryProjectBySlug = cache(async (slug: string) => {
  return getProjectBySlug(slug)
})

export default async function WorkDetail({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug(decodedSlug)

  if (!project) return <PayloadRedirects url={`/work/${decodedSlug}`} />

  const cover = typeof project.cover === 'object' ? project.cover : null
  const all = await getAllProjects()
  const index = all.findIndex((p) => p.id === project.id)
  const prev = all[index - 1] || all[all.length - 1]
  const next = all[index + 1] || all[0]

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary || undefined,
    author: {
      '@type': 'Person',
      name: 'Prodip Kumar',
    },
    ...(cover?.url ? { image: cover.url } : {}),
    ...(project.liveUrl ? { url: project.liveUrl } : {}),
  }

  return (
    <main className="pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="container">
        <Link href="/work" className="mono-sm text-text-muted transition-colors hover:text-accent">
          ← All case studies
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="mono-sm text-accent">
            {project.category === 'medical-client'
              ? 'Medical client'
              : project.category === 'dev-tool'
                ? 'Dev tool'
                : 'Personal'}
          </p>
          <h1 className="display-xl mt-4 font-display font-bold tracking-tight text-text">
            {project.title}
          </h1>
          <p className="body-lg mt-6 text-text-muted">{project.summary}</p>
        </header>

        {cover && (
          <Reveal className="mt-12">
            <div className="aspect-[16/9] overflow-hidden rounded-sm border border-hairline">
              <Media resource={cover} size="(max-width: 768px) 100vw, 70vw" className="h-full" imgClassName="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((item, idx) => {
              const img = typeof item.image === 'object' ? item.image : null
              if (!img) return null
              return (
                <Reveal key={idx} delay={idx * 0.06}>
                  <div className="aspect-[4/3] overflow-hidden rounded-sm border border-hairline">
                    <Media resource={img} size="(max-width: 768px) 100vw, 33vw" className="h-full" imgClassName="h-full w-full object-cover" />
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          {(project.metrics || []).map((m, idx) => (
            <div key={idx} className="rounded-sm border border-hairline bg-bg-raised px-5 py-3">
              <CountUp value={m.value ?? ''} className="mono-sm block text-vital" />
              <span className="mt-1 block text-xs text-text-muted">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="display-md font-display font-bold tracking-tight text-text">The problem</h2>
            <div className="mt-4 max-w-prose text-text-muted">
              {project.problem ? (
                <RichText data={project.problem} enableGutter={false} enableProse={false} />
              ) : null}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-md font-display font-bold tracking-tight text-text">The solution</h2>
            <div className="mt-4 max-w-prose text-text-muted">
              {project.solution ? (
                <RichText data={project.solution} enableGutter={false} enableProse={false} />
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <p className="mono-sm text-accent">Tech stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {(project.techStack || []).map((t, idx) => (
              <li key={idx} className="mono-sm rounded-full border border-hairline px-3 py-1 text-text-muted">
                {t.tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-accent px-6 py-3 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              Visit live site ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-sm rounded-sm border border-hairline px-6 py-3 text-text transition-colors hover:border-accent/60 hover:text-accent"
            >
              View source ↗
            </a>
          )}
        </div>

        <nav className="mt-20 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:justify-between">
          {prev && (
            <Link
              href={`/work/${prev.slug}`}
              className="group max-w-xs"
            >
              <span className="mono-sm text-text-muted">← Previous</span>
              <span className="display-md mt-1 block font-display font-semibold tracking-tight text-text transition-colors group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="group max-w-xs sm:text-right">
              <span className="mono-sm text-text-muted">Next →</span>
              <span className="display-md mt-1 block font-display font-semibold tracking-tight text-text transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const project = await queryProjectBySlug(slug)
  if (!project) return {}

  return {
    title: `${project.title} — Prodip Kumar`,
    description: project.summary || undefined,
    openGraph: mergeOpenGraph({
      title: `${project.title} — Prodip Kumar`,
      description: project.summary || undefined,
      url: `${getServerSideURL()}/work/${project.slug}`,
    }),
  }
}