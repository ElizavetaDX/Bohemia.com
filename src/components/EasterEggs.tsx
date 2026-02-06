'use client'

import React, { useState, useEffect } from 'react'

const symbols = [
  { id: 'star-1', x: '4%', y: '10%', icon: 'star' },
  { id: 'moon-1', x: '96%', y: '8%', icon: 'moon' },
  { id: 'star-2', x: '6%', y: '88%', icon: 'star' },
  { id: 'moon-2', x: '94%', y: '82%', icon: 'moon' },
  { id: 'line-1', x: '12%', y: '48%', icon: 'line' },
  { id: 'star-3', x: '90%', y: '52%', icon: 'star' },
]

function SymbolIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === 'star') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }
  if (icon === 'moon') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    )
  }
  if (icon === 'line') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
        <path d="M4 12h16" strokeLinecap="round" />
      </svg>
    )
  }
  return null
}

export function EasterEggs() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShow(!isTouch && !reducedMotion)
  }, [])

  if (!show) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      {symbols.map((s) => (
        <div
          key={s.id}
          className="pointer-events-auto absolute w-10 h-10 opacity-[0.2] hover:opacity-[0.7] hover:scale-110 transition-all duration-500 ease-out cursor-default"
          style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}
        >
          <SymbolIcon icon={s.icon} className="w-full h-full text-black" />
        </div>
      ))}
    </div>
  )
}
