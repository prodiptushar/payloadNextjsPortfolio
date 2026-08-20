'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import React, { useRef } from 'react'

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const bar = barRef.current
      const wrap = wrapRef.current
      if (!bar || !wrap) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduce) {
        gsap.set(bar, { scaleX: 1 })
        return
      }

      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 64px',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        },
      )
    },
    { scope: wrapRef },
  )

  return (
    <div ref={wrapRef} className="sticky top-[64px] z-20 h-0.5 w-full overflow-visible" aria-hidden>
      <div ref={barRef} className="h-full w-full bg-vital" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}