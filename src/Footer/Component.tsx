import { Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  email: Mail,
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  const navItems = footerData?.navItems || []
  const socials = siteSettings?.socials || []
  const siteName = siteSettings?.siteName || 'Prodip Kumar'

  return (
    <footer className="mt-auto border-t border-hairline bg-bg">
      <div className="container flex flex-col gap-8 py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-text">{siteName}</p>
            <p className="mono-sm mt-2 text-text-muted">
              Medical student · Web Developer
            </p>
          </div>

          <nav className="flex flex-col gap-3 md:items-end" aria-label="Footer">
            {navItems.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                className="mono-sm text-text-muted transition-colors duration-200 hover:text-text"
                appearance="link"
              />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 border-t border-hairline pt-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex items-center gap-5">
            {socials.map((social, i) => {
              const Icon = platformIcons[social.platform || '']
              if (!Icon || !social.url) return null
              return (
                <li key={i}>
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted transition-colors duration-200 hover:text-accent"
                    aria-label={social.platform || 'social'}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </li>
              )
            })}
          </ul>

          <p className="mono-sm text-text-muted">
            © {new Date().getFullYear()} {siteName} · Built with Next.js, GSAP &amp; Payload CMS
          </p>
        </div>
      </div>
    </footer>
  )
}