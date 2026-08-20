'use client'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Observer)

export { gsap, ScrollTrigger, SplitText, Flip, Observer }

export const EASE_OUT = 'power3.out'
export const EASE_SPRING = 'elastic.out(1, 0.5)'
export const EASE_EXPO = 'expo.out'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches