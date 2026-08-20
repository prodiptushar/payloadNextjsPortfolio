import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateCollection'

export const Timeline: CollectionConfig<'timeline'> = {
  slug: 'timeline',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'track', 'startDate', 'endDate', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'track',
      type: 'select',
      options: [
        { label: 'Medical', value: 'medical' },
        { label: 'Dev', value: 'dev' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'org',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
        },
      },
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'bullet',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('timeline')],
    afterDelete: [revalidateCollectionDelete('timeline')],
  },
}