import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans, Manrope, Press_Start_2P, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './brutalism.css'
import { AnalyticsPixels } from '@/components/AnalyticsPixels'
import { CursorTrail } from '@/components/CursorTrail'
import { EasterEggs } from '@/components/EasterEggs'
import { Footer } from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-content-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Студія анімації Богеміка — Digital Brutalism',
  description: 'Студія анімації Богеміка. Місія про любов до краси та талановитих українців.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className={`${playfair.variable} ${dmSans.variable} ${manrope.variable} ${pressStart2P.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AnalyticsPixels />
        <CursorTrail />
        <EasterEggs />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}