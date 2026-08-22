'use client'
import { DrawnPathReveal } from '@/components/gsap/DrawnPathReveal'
import { Reveal } from '@/components/gsap/Reveal'
import React from 'react'

export function Persona() {
  return (
    <section data-vitals className="section-pad border-t border-hairline" aria-label="Who I help">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mono-sm text-vital">Who I help</p>
          <Reveal as="h2" className="display-lg mt-4 font-display font-bold tracking-tight text-text">
            Three kinds of practices. One credibility problem.
          </Reveal>
        </div>
        <DrawnPathReveal />
      </div>
    </section>
  )
}