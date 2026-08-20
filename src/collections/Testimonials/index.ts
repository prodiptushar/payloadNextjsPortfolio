import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateCollection'

export const Testimonials: CollectionConfig<'testimonials'> = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['authorName', 'authorRole', 'updatedAt'],
    useAsTitle: 'authorName',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
    },
    {
      name: 'authorPhoto',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('testimonials')],
    afterDelete: [revalidateCollectionDelete('testimonials')],
  },
}