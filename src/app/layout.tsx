import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Manrope, Press_Start_2P, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './brutalism.css'

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
  title: 'Developer Portfolio — I Make Sites That Look Different',
  description: 'Portfolio: BOHEMIQA STUDIO, Next.js, Tailwind CSS, Cursor AI, Git.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" className={`${playfair.variable} ${dmSans.variable} ${manrope.variable} ${pressStart2P.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}