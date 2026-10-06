import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import { getPosts } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="section-pad">
      <div className="container">
        <p className="mono-sm text-vital">Writing</p>
        <h1 className="display-xl mt-4 font-display font-bold tracking-tight text-text">
          Notes from the dual track.
        </h1>
        <p className="body-lg mt-6 max-w-2xl text-text-muted">
          Development deep-dives and honest takes on what it takes to make a clinic trusted online.
        </p>
      </div>

      <div className="container mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => {
          const cover = typeof post.heroImage === 'object' ? post.heroImage : null
          return (
            <Reveal key={post.id} delay={i * 0.06}>
              <article className="group flex h-full flex-col rounded-sm border border-hairline bg-bg-raised transition-colors hover:border-accent/40">
                <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col p-6">
                  {cover && (
                    <div className="mb-5 aspect-[16/9] overflow-hidden rounded-sm border border-hairline">
                      <Media
                        resource={cover}
                        size="(max-width: 768px) 100vw, 33vw"
                        className="h-full transition-transform duration-500 group-hover:scale-[1.03]"
                        imgClassName="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="mono-sm text-text-muted">
                    {post.publishedAt ? DATE_FMT.format(new Date(post.publishedAt)) : ''}
                  </p>
                  <h2 className="display-md mt-3 font-display font-bold tracking-tight text-text transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  {post.meta?.description && (
                    <p className="mt-3 text-sm text-text-muted">{post.meta.description}</p>
                  )}
                  <span className="mono-sm mt-5 inline-block text-accent">Read →</span>
                </Link>
              </article>
            </Reveal>
          )
        })}
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog — Prodip Kumar',
    description: 'Web development and digital presence for doctors, from a medical student who codes.',
    openGraph: mergeOpenGraph({
      title: 'Blog — Prodip Kumar',
      url: `${getServerSideURL()}/blog`,
    }),
  }
}