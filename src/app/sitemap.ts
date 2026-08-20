import type { MetadataRoute } from 'next'

import { getAllProjects, getPosts } from '@/utilities/getData'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()

  const staticRoutes: MetadataRoute.Sitemap = ['', '/work', '/services', '/about', '/blog', '/contact'].map(
    (path) => ({
      url: `${base}${path}`,
      changeFrequency: 'weekly',
      priority: path === '' ? 1 : 0.8,
    }),
  )

  const [projects, posts] = await Promise.all([getAllProjects(), getPosts()])

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}