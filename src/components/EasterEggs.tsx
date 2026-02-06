'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type SymbolConfig = { id: string; x: string; y: string; icon: 'star' | 'moon' | 'line' }

const PAGE_SYMBOLS: Record<string, SymbolConfig[]> = {
  '/': [
    { id: 'star-1', x: '4%', y: '10%', icon: 'star' },
    { id: 'moon-1', x: '96%', y: '8%', icon: 'moon' },
    { id: 'star-2', x: '6%', y: '88%', icon: 'star' },
    { id: 'line-1', x: '12%', y: '48%', icon: 'line' },
    { id: 'star-3', x: '90%', y: '52%', icon: 'star' },
  ],
  '/important': [
    { id: 'star-1', x: '8%', y: '15%', icon: 'star' },
    { id: 'moon-1', x: '92%', y: '20%', icon: 'moon' },
    { id: 'line-1', x: '15%', y: '60%', icon: 'line' },
    { id: 'star-2', x: '85%', y: '75%', icon: 'star' },
    { id: 'moon-2', x: '50%', y: '5%', icon: 'moon' },
    { id: 'star-3', x: '5%', y: '45%', icon: 'star' },
  ],
  '/learn': [
    { id: 'moon-1', x: '95%', y: '12%', icon: 'moon' },
    { id: 'star-1', x: '5%', y: '25%', icon: 'star' },
    { id: 'line-1', x: '88%', y: '50%', icon: 'line' },
    { id: 'star-2', x: '10%', y: '80%', icon: 'star' },
    { id: 'moon-2', x: '92%', y: '88%', icon: 'moon' },
    { id: 'star-3', x: '45%', y: '92%', icon: 'star' },
  ],
  '/price': [
    { id: 'star-1', x: '3%', y: '30%', icon: 'star' },
    { id: 'line-1', x: '97%', y: '35%', icon: 'line' },
    { id: 'moon-1', x: '7%', y: '70%', icon: 'moon' },
    { id: 'star-2', x: '93%', y: '65%', icon: 'star' },
    { id: 'moon-2', x: '50%', y: '15%', icon: 'moon' },
    { id: 'star-3', x: '50%', y: '85%', icon: 'star' },
  ],
  '/series': [
    { id: 'moon-1', x: '6%', y: '12%', icon: 'moon' },
    { id: 'star-1', x: '94%', y: '18%', icon: 'star' },
    { id: 'line-1', x: '20%', y: '55%', icon: 'line' },
    { id: 'star-2', x: '80%', y: '60%', icon: 'star' },
    { id: 'moon-2', x: '95%', y: '90%', icon: 'moon' },
    { id: 'star-3', x: '8%', y: '78%', icon: 'star' },
  ],
  '/services': [
    { id: 'star-1', x: '90%', y: '8%', icon: 'star' },
    { id: 'moon-1', x: '10%', y: '85%', icon: 'moon' },
    { id: 'line-1', x: '85%', y: '45%', icon: 'line' },
    { id: 'star-2', x: '15%', y: '40%', icon: 'star' },
    { id: 'moon-2', x: '92%', y: '78%', icon: 'moon' },
    { id: 'star-3', x: '5%', y: '22%', icon: 'star' },
  ],
}

const DEFAULT_SYMBOLS: SymbolConfig[] = [
  { id: 'star-1', x: '8%', y: '15%', icon: 'star' },
  { id: 'moon-1', x: '92%', y: '15%', icon: 'moon' },
  { id: 'star-2', x: '8%', y: '85%', icon: 'star' },
  { id: 'moon-2', x: '92%', y: '85%', icon: 'moon' },
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
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShow(!isTouch && !reducedMotion)
  }, [])

  const symbols = PAGE_SYMBOLS[pathname] ?? DEFAULT_SYMBOLS

  if (!show || symbols.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      {symbols.map((s) => (
        <div
          key={`${pathname}-${s.id}`}
          className="pointer-events-auto absolute w-10 h-10 opacity-[0.2] hover:opacity-[0.7] hover:scale-110 transition-all duration-500 ease-out cursor-default"
          style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}
        >
          <SymbolIcon icon={s.icon} className="w-full h-full text-black" />
        </div>
      ))}
    </div>
  )
}
