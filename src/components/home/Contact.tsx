'use client'
import { Reveal } from '@/components/gsap/Reveal'
import Link from 'next/link'
import React, { useCallback, useRef, useState } from 'react'

import type { SiteSetting } from '@/payload-types'

const PROJECT_TYPES = ['Website', 'AI & Automation', 'Local SEO', 'Reviews & Reputation', 'Something else']

export function Contact({ siteSettings }: { siteSettings: SiteSetting }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const focusFired = useRef(false)

  const onFirstFocus = useCallback(() => {
    if (!focusFired.current) {
      focusFired.current = true
      document.dispatchEvent(new CustomEvent('pk-contact-focus'))
    }
  }, [])

  const social = (siteSettings?.socials || []).find((s) => s.platform === 'email')
  const email = social?.url?.replace('mailto:', '') || 'prodip@example.com'

  return (
    <section
      id="contact"
      data-vitals="flatline"
      className="section-pad border-t border-hairline"
      aria-label="Contact"
    >
      <div className="container grid gap-16 lg:grid-cols-2">
        <Reveal>
          {sent ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-sm border border-vital/30 bg-bg-raised p-10 text-center">
              <span className="availability-dot h-2 w-2 rounded-full bg-vital" aria-hidden />
              <h3 className="display-md mt-6 font-display font-bold text-text">Message received.</h3>
              <p className="mt-3 text-text-muted">
                Thanks — I&apos;ll get back to you within one working day.
              </p>
            </div>
          ) : (
            <form
              className="rounded-sm border border-hairline bg-bg-raised p-8"
              onSubmit={async (e) => {
                e.preventDefault()
                setError(null)
                setSubmitting(true)

                const form = e.currentTarget
                const data = new FormData(form)
                const payload = {
                  name: data.get('name') as string,
                  email: data.get('email') as string,
                  type: data.get('type') as string,
                  message: data.get('message') as string,
                }

                try {
                  const res = await fetch('/api/submissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  })

                  if (!res.ok) {
                    const body = await res.json().catch(() => ({}))
                    throw new Error(body.error || 'Something went wrong.')
                  }

                  setSent(true)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to send message.')
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="field-wrap">
                  <label htmlFor="contact-name" className="mono-sm mb-2 block text-text-muted">
                    Name
                  </label>
                  <input id="contact-name" name="name" type="text" required className="field-input" onFocus={onFirstFocus} />
                </div>
                <div className="field-wrap">
                  <label htmlFor="contact-email" className="mono-sm mb-2 block text-text-muted">
                    Email
                  </label>
                  <input id="contact-email" name="email" type="email" required className="field-input" />
                </div>
              </div>
              <div className="field-wrap mt-6">
                <label htmlFor="contact-type" className="mono-sm mb-2 block text-text-muted">
                  Project type
                </label>
                <select id="contact-type" name="type" className="field-input">
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-bg-raised">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-wrap mt-6">
                <label htmlFor="contact-message" className="mono-sm mb-2 block text-text-muted">
                  Message
                </label>
                <textarea id="contact-message" name="message" required rows={5} className="field-input resize-none" />
              </div>
              {error && (
                <p className="mt-4 text-sm text-danger">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-sm bg-accent px-6 py-3 font-display text-sm font-semibold tracking-tight text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </Reveal>

        <div>
          <p className="mono-sm text-vital">Contact</p>
          <h2 className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Let&apos;s build trust for your practice.
          </h2>
          <p className="body-lg mt-4 max-w-prose text-text-muted">
            Tell me about your clinic and what you&apos;re struggling with — no-shows, invisible in
            search, buried under paperwork. I&apos;ll reply within a day.
          </p>

          <div className="mt-10 space-y-4">
            <a href={`mailto:${email}`} className="contact-link mono-sm flex items-center gap-3 text-text">
              <span className="h-1 w-3 bg-vital" aria-hidden />
              {email}
            </a>
            {(siteSettings?.socials || []).map((s) => {
              if (s.platform === 'email') return null
              return (
                <a
                  key={s.platform}
                  href={s.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link mono-sm flex items-center gap-3 text-text"
                >
                  <span className="h-1 w-3 bg-accent" aria-hidden />
                  {s.platform} ↗
                </a>
              )
            })}
            <a href="/resume.pdf" className="contact-link mono-sm flex items-center gap-3 text-text">
              <span className="h-1 w-3 bg-accent-dim" aria-hidden />
              Download CV ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}