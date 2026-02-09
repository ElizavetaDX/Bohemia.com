'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'
import { GUIDES } from '@/data/guidesData'

function BurgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
      {isOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
    </svg>
  )
}

function BooksIcon() {
  return (
    <div className="flex items-end gap-0.5 sm:gap-1 h-6 sm:h-7 flex-shrink-0" aria-hidden>
      <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-current skew-x-[-8deg] rounded-sm" />
      <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-current skew-x-[-8deg] rounded-sm" />
      <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-current skew-x-[-8deg] rounded-sm" />
    </div>
  )
}

export default function PolytsiaPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const linkClass = () =>
    `relative group text-[9px] md:text-[10px] tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'}`

  return (
    <>
      <main className="min-h-screen bg-white text-black bg-dots-pattern">
        <motion.header
          className={`sticky top-0 z-[50] w-full transition-all duration-300 ease-out ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-black/10' : 'bg-transparent'}`}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <nav className="w-full flex flex-nowrap items-center justify-between gap-2 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 overflow-hidden border border-black/20">
                <Image src="/header-icon.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-black/80 whitespace-nowrap flex-shrink-0">
                студія анімації Богеміка
              </span>
            </Link>
            <ul className="hidden md:flex items-center gap-3 md:gap-5 ml-4 md:ml-6 flex-shrink-0">
              <li><Link href="/" className={linkClass()}><span>головна</span></Link></li>
              <li><Link href="/services" className={linkClass()}><span>креатив</span></Link></li>
              <li><Link href="/important" className={linkClass()}><span>нам важливо</span></Link></li>
              <li><Link href="/price" className={linkClass()}><span>прайс</span></Link></li>
              <li><Link href="/learn" className={linkClass()}><span>навчатися</span></Link></li>
              <li><Link href="/polytsia" className="text-black"><span>полиця</span></Link></li>
              <li><Link href="/series" className={linkClass()}><span>хх</span></Link></li>
            </ul>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-black"
              aria-label="Меню"
              aria-expanded={mobileMenuOpen}
            >
              <BurgerIcon isOpen={mobileMenuOpen} />
            </button>
          </nav>
        </motion.header>

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <section className="px-4 sm:px-6 md:px-12 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-8">
              <span className="absolute top-0 right-0 text-[10px] sm:text-xs text-black/50 font-mono tracking-wider" aria-hidden>(01)</span>
              <div className="flex items-center gap-3 sm:gap-4 w-full bg-black text-white py-3 sm:py-4 px-4 sm:px-5 md:px-6">
                <BooksIcon />
                <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight flex-1">
                  Полиця
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {GUIDES.map((guide, i) => (
                <motion.div
                  key={guide.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                >
                  <Link
                    href={`/polytsia/${guide.slug}`}
                    className="block relative overflow-hidden border border-black/20 bg-white hover:border-black/40 transition-all group p-4"
                  >
                    <div>
                      <h2 className="font-press-start text-sm uppercase tracking-tight text-black mb-1">
                        {guide.title}
                      </h2>
                      <p className="text-xs text-black/60 line-clamp-2">{guide.description}</p>
                      <span className="inline-block mt-3 text-sm font-bold uppercase tracking-widest text-black underline underline-offset-2 decoration-2 group-hover:decoration-black/80 transition-colors">
                        Отримати гайд →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
