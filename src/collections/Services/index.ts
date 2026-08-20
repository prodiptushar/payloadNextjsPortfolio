import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateCollection'

export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'startingAt', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'outcomes',
      type: 'array',
      fields: [
        {
          name: 'bullet',
          type: 'text',
        },
      ],
    },
    {
      name: 'startingAt',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('services')],
    afterDelete: [revalidateCollectionDelete('services')],
  },
}