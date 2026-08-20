'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
import React, { useRef, useState } from 'react'

interface CountUpProps {
  value: string
  className?: string
}

const STRIP_NUM = /^-?\d+(\.\d+)?$/

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const numeric = parseFloat(value)
      if (!STRIP_NUM.test(value.trim()) || Number.isNaN(numeric)) return

      const suffix = value.replace(/^-?\d+(\.\d+)?/, '')
      const prefix = value.slice(0, value.search(/\d/) < 0 ? 0 : value.search(/\d/))

      if (reduce) {
        setDisplay(value)
        return
      }

      const proxy = { val: 0 }

      gsap.to(proxy, {
        val: numeric,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          const isFloat = value.includes('.')
          const v = isFloat ? proxy.val.toFixed(1) : Math.round(proxy.val).toString()
          setDisplay(`${prefix}${v}${suffix}`)
        },
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}