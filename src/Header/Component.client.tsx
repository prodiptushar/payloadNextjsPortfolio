'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
  siteSettings: SiteSetting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const navItems = data?.navItems || []

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const logoText = siteSettings?.logoText || 'Prodip Kumar'

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-bg/80 backdrop-blur-md">
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2" aria-label={logoText}>
          <span className="availability-dot h-1.5 w-1.5 rounded-full bg-vital" aria-hidden />
          <span className="font-display text-base font-bold tracking-tight text-text">
            {logoText}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              className="mono-sm text-text-muted transition-colors duration-200 hover:text-text"
              appearance="link"
            />
          ))}
          <Link
            href="/contact"
            className="mono-sm rounded-sm border border-accent/40 px-4 py-2 text-accent transition-colors duration-200 hover:bg-accent hover:text-bg"
          >
            Start a Project
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-text"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            {open ? (
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden grid border-t border-hairline bg-bg transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <ul className="container flex flex-col gap-1 py-4">
            {navItems.map(({ link }, i) => (
              <li key={i}>
                <CMSLink
                  {...link}
                  className="mono-sm block px-2 py-3 text-text-muted transition-colors hover:text-text"
                  appearance="link"
                />
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="mono-sm mt-2 block rounded-sm border border-accent/40 px-4 py-3 text-center text-accent transition-colors hover:bg-accent hover:text-bg"
              >
                Start a Project
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}