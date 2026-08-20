'use client'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap-config'
import React, { useRef, useState } from 'react'

const SESSION_KEY = 'pk-intro-shown'

export function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const overlay = overlayRef.current
      const line = lineRef.current
      const glow = glowRef.current
      const name = nameRef.current
      const sub = subRef.current
      if (!overlay || !line || !glow || !name || !sub) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const alreadyShown =
        typeof window !== 'undefined' && window.sessionStorage.getItem(SESSION_KEY) === '1'

      if (reduce || alreadyShown) {
        if (reduce) {
          gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out', onComplete: () => setDone(true) })
        } else {
          gsap.set(overlay, { display: 'none' })
          setDone(true)
        }
        return
      }

      const pathLength = line.getTotalLength() || 1000
      gsap.set(line, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

      const split = new SplitText(name, { type: 'chars' })
      gsap.set(split.chars, { opacity: 0, y: 8 })
      gsap.set(sub, { opacity: 0, y: 12 })
      gsap.set(glow, { opacity: 0 })
      gsap.set(skipRef.current, { opacity: 0 })

      const finish = () => {
        split.revert()
        window.sessionStorage.setItem(SESSION_KEY, '1')
        setDone(true)
      }

      const tl = gsap.timeline({ onComplete: finish })

      tl.to(line, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' })
        .to(line, { strokeDashoffset: -pathLength * 0.2, duration: 0.2, ease: 'power1.in' })
        .to(line, { strokeDashoffset: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
        .fromTo(
          glow,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1.4, duration: 0.35, ease: 'power2.out' },
          '<',
        )
        .to(glow, { opacity: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' })
        .to(
          split.chars,
          {
            opacity: 1,
            y: 0,
            duration: 0.04,
            stagger: 0.05,
            ease: 'none',
          },
          '-=0.2',
        )
        .to(sub, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .to(skipRef.current, { opacity: 1, duration: 0.3 }, '-=0.2')
        .to(
          overlay,
          {
            scale: 1.04,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
              overlay.style.display = 'none'
            },
          },
          '+=0.1',
        )
    },
    { scope: overlayRef },
  )

  if (done) return null

  const skip = () => {
    window.sessionStorage.setItem(SESSION_KEY, '1')
    const overlay = overlayRef.current
    if (overlay) {
      gsap.killTweensOf(overlay)
      gsap.to(overlay, {
        scale: 1.04,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => setDone(true),
      })
    } else {
      setDone(true)
    }
  }

  return (
    <div ref={overlayRef} className="loading-overlay">
      <div ref={glowRef} className="loading-glow" aria-hidden />
      <svg className="loading-ecg" viewBox="0 0 100 50" aria-hidden>
        <path ref={lineRef} d="M0,25 L20,25 L28,6 L36,44 L44,25 L62,25 L70,15 L78,35 L86,25 L100,25" />
      </svg>
      <h1 ref={nameRef} className="loading-name">
        Prodip Kumar
      </h1>
      <p ref={subRef} className="loading-sub">
        Web Developer · Medical Student
      </p>
      <button ref={skipRef} type="button" className="loading-skip" onClick={skip}>
        Skip intro
      </button>
    </div>
  )
}