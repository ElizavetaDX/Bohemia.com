import type { Metadata } from 'next'
import * as React from 'react'
import { Manrope, Press_Start_2P } from 'next/font/google'
import '../brutalism.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-brutalism',
  display: 'swap',
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ХХ — Студія анімації Богеміка',
  description: 'Мультсеріал від студії Богеміка. Дивись онлайн.',
}

export default function SeriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${manrope.variable} ${pressStart2P.variable} ${manrope.className} min-h-screen bg-white text-black antialiased`}>
      {children}
    </div>
  )
}
