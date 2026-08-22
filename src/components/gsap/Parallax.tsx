'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import React, { useRef } from 'react'

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      const wrap = wrapRef.current
      if (!el || !wrap) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const distance = speed * 100

      gsap.fromTo(
        el,
        { y: distance },
        {
          y: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope: wrapRef },
  )

  return (
    <div ref={wrapRef} className={className}>
      <div ref={ref} style={{ overflow: 'hidden' }}>{children}</div>
    </div>
  )
}
