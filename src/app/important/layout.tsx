import type { Metadata } from 'next'
import * as React from 'react'
import { JetBrains_Mono, Press_Start_2P } from 'next/font/google'
import '../brutalism.css'

// Моноширинный шрифт для плотного текста (для Geist Mono: npm i @fontsource-variable/geist-mono и импорт в layout)
const geistMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Нам важливо — Студія анімації Богеміка',
  description: 'Цінності та підхід студії анімації Богеміка.',
}

export default function ImportantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${geistMono.variable} ${pressStart2P.variable} ${geistMono.className} min-h-screen bg-white text-black antialiased`}>
      {children}
    </div>
  )
}
