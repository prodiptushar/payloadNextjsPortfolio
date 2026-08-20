'use client'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import React, { useRef, useState } from 'react'

const BEAT = 20
const BEATS = 30
const HEIGHT = BEAT * BEATS

function buildECGPath(): string {
  let d = ''
  for (let i = 0; i < BEATS; i++) {
    const y = i * BEAT
    d += [
      `M50,${y}`,
      `L50,${y + 2}`,
      `L53,${y + 2}`,
      `L47,${y + 4}`,
      `L53,${y + 4}`,
      `L50,${y + 6}`,
      `L44,${y + 9}`,
      `L55,${y + 9}`,
      `L49,${y + 12}`,
      `L50,${y + 14}`,
      `L46,${y + 16}`,
      `L54,${y + 16}`,
      `L50,${y + 20}`,
    ].join(' ')
  }
  return d
}

const ECG_PATH = buildECGPath()

export function VitalsSpine() {
  const trackRef = useRef<SVGSVGElement>(null)
  const fillRef = useRef<SVGPathElement>(null)
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useGSAP(
    () => {
      const track = trackRef.current
      const fill = fillRef.current
      if (!track || !fill) return

      if (reduce) {
        gsap.set(fill, { strokeDashoffset: 0 })
        return
      }

      const pathLength = fill.getTotalLength() || 1000
      gsap.set(fill, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

      gsap.to(fill, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })

      // "Beats" — pulse the glow whenever a [data-vitals] section enters view (§3.5)
      const beatSections = gsap.utils.toArray<HTMLElement>('[data-vitals]')

      beatSections.forEach((section) => {
        const isContact = section.dataset.vitals === 'flatline'
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          onEnter: () => {
            if (isContact) {
              // Contact flatline: defer until first field focus
              const handler = () => {
                document.removeEventListener('pk-contact-focus', handler)
                gsap.timeline()
                  .to(fill, { opacity: 0.12, duration: 0.4, ease: 'power2.inOut' })
                  .to(fill, { opacity: 1, duration: 0.3, ease: 'power2.in' })
                  .to(fill, { opacity: 0.5, duration: 0.2, ease: 'sine.inOut' })
                  .to(fill, { opacity: 1, duration: 0.3, ease: 'power2.out' })
              }
              document.addEventListener('pk-contact-focus', handler, { once: true })
              return
            }
            gsap.fromTo(
              fill,
              { opacity: 0.35 },
              {
                opacity: 1,
                duration: 0.45,
                ease: 'sine.inOut',
              },
            )
          },
        })
      })

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    },
    { scope: trackRef },
  )

  if (reduce) {
    return <div className="vitals-spine-static" aria-hidden />
  }

  return (
    <div className="vitals-spine" aria-hidden>
      <svg ref={trackRef} viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio="none" className="vitals-spine__track">
        <path d={ECG_PATH} className="vitals-spine__ghost" />
        <path ref={fillRef} d={ECG_PATH} className="vitals-spine__fill" />
      </svg>
    </div>
  )
}