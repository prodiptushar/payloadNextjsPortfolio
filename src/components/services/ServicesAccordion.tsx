'use client'
import React, { useState } from 'react'

const FAQS = [
  {
    q: 'Do you work with clinics that have no technical staff?',
    a: 'Yes — that is exactly who I build for. You get a CMS you can use without touching code, and I handle deployment, updates, and anything technical.',
  },
  {
    q: 'How fast can you ship?',
    a: 'A credibility website typically ships in 2–4 weeks. Automation systems depend on scope — most go live within a month, with a clear roadmap agreed up front.',
  },
  {
    q: 'Is my patient data safe with your automation?',
    a: 'Anything touching patient data follows a privacy-first design: no unnecessary collection, encrypted storage, and strict access control. Real compliance claims are confirmed case by case before anything is published.',
  },
  {
    q: 'What happens after launch?',
    a: 'You own everything. I include a walkthrough, written documentation, and a support window. On-going care plans are available if you want me to keep improving it.',
  },
  {
    q: 'I already have a website. Can you fix it instead of rebuilding?',
    a: 'Usually yes. If the foundation is sound, I improve speed, SEO, and structure in place. If rebuilding is cheaper than repairing, I will say so honestly.',
  },
]

export function ServicesAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-hairline">
      {FAQS.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-hairline">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="font-display text-lg font-semibold tracking-tight text-text">
                {faq.q}
              </span>
              <span
                className={`mono-sm shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-text-muted">{faq.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}