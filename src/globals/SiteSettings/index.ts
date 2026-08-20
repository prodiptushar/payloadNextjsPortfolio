import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidateCollection'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'logoText',
      type: 'text',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['github', 'linkedin', 'twitter', 'instagram', 'email'],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal('site-settings')],
  },
}