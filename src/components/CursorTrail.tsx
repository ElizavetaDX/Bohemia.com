'use client'

import React, { useState, useEffect, useRef } from 'react'

const TRAIL_LENGTH = 20

export function CursorTrail() {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([])
  const [isVisible, setIsVisible] = useState(false)
  const trailRef = useRef<Array<{ x: number; y: number }>>([])
  const lastMoveRef = useRef(0)

  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reducedMotion) return

    const handleMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMoveRef.current < 16) return
      lastMoveRef.current = now

      setIsVisible(true)
      trailRef.current = [{ x: e.clientX, y: e.clientY }, ...trailRef.current].slice(0, TRAIL_LENGTH)
      setPositions([...trailRef.current])
    }

    const fadeTick = () => {
      if (trailRef.current.length > 0) {
        trailRef.current = trailRef.current.slice(0, -1)
        setPositions([...trailRef.current])
      }
    }

    const interval = setInterval(fadeTick, 100)
    window.addEventListener('mousemove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      clearInterval(interval)
    }
  }, [])

  if (!isVisible || positions.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden>
      {positions.map((p, i) => (
        <div
          key={`${p.x}-${p.y}-${i}`}
          className="absolute w-5 h-5 rounded-full bg-black/20"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) scale(${1 - i * 0.04})`,
            opacity: Math.max(0.05, 0.35 - i * 0.01),
            filter: 'blur(8px)',
            transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
