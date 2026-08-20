import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Submissions: CollectionConfig<'submissions'> = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'createdAt'],
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Website', value: 'Website' },
        { label: 'AI & Automation', value: 'AI & Automation' },
        { label: 'Local SEO', value: 'Local SEO' },
        { label: 'Reviews & Reputation', value: 'Reviews & Reputation' },
        { label: 'Something else', value: 'Something else' },
      ],
      defaultValue: 'Something else',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
