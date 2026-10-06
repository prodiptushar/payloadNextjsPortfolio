import type { Metadata } from 'next'

import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import RichText from '@/components/RichText'
import { getPostBySlug, getPosts } from '@/utilities/getData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

const queryPostBySlug = cache(async (slug: string) => {
  return getPostBySlug(slug)
})

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default async function BlogPost({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug(decodedSlug)

  if (!post) return <PayloadRedirects url={`/blog/${decodedSlug}`} />

  const cover = typeof post.heroImage === 'object' ? post.heroImage : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta?.description || undefined,
    datePublished: post.publishedAt || undefined,
    image: cover?.url || undefined,
    author: {
      '@type': 'Person',
      name: 'Prodip Kumar',
    },
  }

  return (
    <main className="pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress />

      <article className="container max-w-3xl">
        <Link href="/blog" className="mono-sm text-text-muted transition-colors hover:text-accent">
          ← All posts
        </Link>

        <header className="mt-10">
          {post.categories && post.categories.length > 0 && (
            <p className="mono-sm text-vital">
              {(post.categories || [])
                .map((c) => (typeof c === 'object' ? c.title : c))
                .join(' · ')}
            </p>
          )}
          <h1 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            {post.title}
          </h1>
          <p className="mono-sm mt-5 text-text-muted">
            {post.publishedAt ? DATE_FMT.format(new Date(post.publishedAt)) : ''}
          </p>
        </header>

        {cover && (
          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-sm border border-hairline">
            <Media resource={cover} size="(max-width: 768px) 100vw, 48rem" className="h-full" />
          </div>
        )}

        <div className="mt-12">
          <RichText data={post.content} enableGutter={false} />
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.meta?.title || `${post.title} — Prodip Kumar`,
    description: post.meta?.description || undefined,
    openGraph: mergeOpenGraph({
      title: post.meta?.title || post.title,
      description: post.meta?.description || undefined,
      url: `${getServerSideURL()}/blog/${post.slug}`,
    }),
  }
}