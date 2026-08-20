import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateCollection =
  (collection: string): CollectionAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating collection: ${collection}`)
      revalidateTag(collection, 'max')
    }

    return doc
  }

export const revalidateCollectionDelete =
  (collection: string): CollectionAfterDeleteHook =>
  ({ req: { context } }) => {
    if (!context.disableRevalidate) {
      revalidateTag(collection, 'max')
    }

    return null
  }

export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`)
      revalidateTag(`global_${slug}`, 'max')
    }

    return doc
  }