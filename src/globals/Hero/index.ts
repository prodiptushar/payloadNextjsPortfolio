import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidateCollection'

export const Hero: GlobalConfig = {
  slug: 'hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'valueStatement',
      type: 'textarea',
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
    },
    {
      name: 'primaryCtaHref',
      type: 'text',
    },
    {
      name: 'cvFile',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'availability',
      type: 'group',
      fields: [
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Limited', value: 'limited' },
            { label: 'Booked', value: 'booked' },
          ],
        },
        {
          name: 'note',
          type: 'text',
        },
      ],
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('hero')],
  },
}