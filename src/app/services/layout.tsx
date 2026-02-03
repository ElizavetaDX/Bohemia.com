import type { Metadata } from 'next'
import * as React from 'react'
import { JetBrains_Mono, Press_Start_2P } from 'next/font/google'
import '../brutalism.css'

const fontMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-content-mono',
  display: 'swap',
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Креатив — Студія анімації Богеміка',
  description: 'Креатив студії анімації Богеміка.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${fontMono.variable} ${pressStart2P.variable} ${fontMono.className} min-h-screen bg-white text-black antialiased`}>
      {children}
    </div>
  )
}
