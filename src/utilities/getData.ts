import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

export const getPayloadClient = () => getPayload({ config: configPromise })

export const getProjects = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    pagination: false,
    sort: 'order',
    where: { featured: { equals: true } },
  })
  return docs
})

export const getAllProjects = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    pagination: false,
    sort: 'order',
  })
  return docs
})

export const getProjectBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    pagination: false,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return docs[0] || null
})

export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    depth: 2,
    pagination: false,
    sort: 'order',
  })
  return docs
})

export const getSkills = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'skills',
    depth: 0,
    pagination: false,
    sort: 'name',
  })
  return docs
})

export const getTimeline = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'timeline',
    depth: 0,
    pagination: false,
    sort: 'startDate',
  })
  return docs
})

export const getTestimonials = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'testimonials',
    depth: 2,
    pagination: false,
  })
  return docs
})

export const getPosts = cache(async (limit = 9) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })
  return docs
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] || null
})

type GlobalSlug = keyof Config['globals']

async function getGlobal(slug: GlobalSlug, depth = 0) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug, depth })
}

export const getCachedGlobal = <T extends GlobalSlug>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [`global_${slug}`], {
    tags: [`global_${slug}`],
  })