import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidateCollection'

export const Skills: CollectionConfig<'skills'> = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'category', 'proficiency', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Language', value: 'language' },
        { label: 'Framework', value: 'framework' },
        { label: 'CMS / Backend', value: 'cms-backend' },
        { label: 'Design', value: 'design' },
        { label: 'DevOps / Tools', value: 'devops' },
      ],
    },
    {
      name: 'proficiency',
      type: 'number',
      min: 1,
      max: 5,
    },
  ],
  hooks: {
    afterChange: [revalidateCollection('skills')],
    afterDelete: [revalidateCollectionDelete('skills')],
  },
}