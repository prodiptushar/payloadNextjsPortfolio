import { Media } from '@/components/Media'
import { Reveal } from '@/components/gsap/Reveal'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function BlogTeaser({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section data-vitals className="section-pad border-t border-hairline" aria-label="From the blog">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mono-sm text-vital">Writing</p>
            <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
              Notes from the dual track.
            </h2>
          </div>
          <Link href="/blog" className="mono-sm text-accent underline-offset-4 hover:underline">
            All posts →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => {
            const cover = typeof post.heroImage === 'object' ? post.heroImage : null
            return (
              <Reveal key={post.id} delay={i * 0.08}>
                <article className="group flex h-full flex-col rounded-sm border border-hairline bg-bg-raised transition-colors hover:border-accent/40">
                  <Link href={`/blog/${post.slug}`} className="flex-1 p-6" aria-label={post.title}>
                    {cover && (
                      <div className="mb-5 aspect-[16/9] overflow-hidden rounded-sm border border-hairline">
                        <Media
                          resource={cover}
                          size="(max-width: 768px) 100vw, 33vw"
                          className="h-full transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <p className="mono-sm text-text-muted">
                      {post.publishedAt ? DATE_FMT.format(new Date(post.publishedAt)) : ''}
                    </p>
                    <h3 className="display-md mt-3 font-display font-bold tracking-tight text-text transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
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
      </div>
    </section>
  )
}