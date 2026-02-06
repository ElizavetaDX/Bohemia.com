'use client'

import React, { useEffect, useRef } from 'react'

const LERP = 0.14
const FADE_DURATION = 1200
const MIN_SPAWN_DIST = 8
const MAX_SPAWN_DIST = 35
const BASE_SIZE = 20
const MIN_SIZE = 5
const BLUR = 4

type Particle = {
  el: HTMLDivElement
  x: number
  y: number
  size: number
  birth: number
}

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const headRef = useRef({ x: -1000, y: -1000 })
  const lastSpawnRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reducedMotion) return

    const container = containerRef.current
    if (!container) return

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const now = performance.now()
      const mouse = mouseRef.current
      let head = headRef.current
      const lastSpawn = lastSpawnRef.current

      const isFirst = head.x < -900
      head = {
        x: isFirst ? mouse.x : head.x + (mouse.x - head.x) * LERP,
        y: isFirst ? mouse.y : head.y + (mouse.y - head.y) * LERP,
      }
      headRef.current = head

      const dist = Math.hypot(head.x - lastSpawn.x, head.y - lastSpawn.y)
      const shouldSpawn = dist >= MIN_SPAWN_DIST

      if (shouldSpawn) {
        const sizeRange = Math.min(1, dist / MAX_SPAWN_DIST)
        const size = MIN_SIZE + (BASE_SIZE - MIN_SIZE) * (0.6 + 0.4 * sizeRange)

        const el = document.createElement('div')
        el.setAttribute('aria-hidden', 'true')
        el.style.cssText = `
          position: fixed;
          left: ${head.x}px;
          top: ${head.y}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(245,241,235,0.3), rgba(44,44,44,0.15));
          box-shadow: 0 0 ${size}px rgba(44,44,44,0.2);
          filter: blur(${BLUR}px);
          pointer-events: none;
          transform: translate(-50%, -50%) scale(1);
          will-change: transform, opacity;
        `
        container.appendChild(el)

        particlesRef.current.push({
          el,
          x: head.x,
          y: head.y,
          size,
          birth: now,
        })
        lastSpawnRef.current = { x: head.x, y: head.y }
      }

      const toRemove: number[] = []
      particlesRef.current.forEach((p, i) => {
        const age = now - p.birth
        if (age >= FADE_DURATION) {
          p.el.remove()
          toRemove.push(i)
          return
        }
        const t = age / FADE_DURATION
        const easeOut = 1 - Math.pow(1 - t, 2)
        const opacity = Math.max(0, 0.25 * (1 - easeOut))
        const scale = 1 - 0.5 * easeOut
        p.el.style.opacity = String(opacity)
        p.el.style.transform = `translate(-50%, -50%) scale(${scale})`
      })

      for (let i = toRemove.length - 1; i >= 0; i--) {
        particlesRef.current.splice(toRemove[i], 1)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafRef.current)
      particlesRef.current.forEach((p) => p.el.remove())
      particlesRef.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden
    />
  )
}
