'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function BurgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
    >
      {isOpen ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

const priceItems = [
  { name: 'АНІМАЦІЯ ОБЕРТАННЯ 360', price: 'від 1500 грн / за 1 артикул' },
  { name: 'CGI АНІМАЦІЯ', price: 'від 300$ / за 1 відео' },
  { name: 'VFX (доповнена реальність)', price: 'від 200$ / за 1 відео' },
  { name: 'AI ГЕНЕРАЦІЯ', price: 'від 100$ / за 1 проект' },
  { name: 'ПОВНИЙ ЦИКЛ (Production)', price: 'індивідуальний прорахунок' },
]

export default function PricePage() {
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

  const linkClass = (active?: boolean) =>
    `relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
      active
        ? scrolled
          ? 'text-white'
          : 'text-black'
        : scrolled
          ? 'text-white/60 hover:text-white'
          : 'text-black/50 hover:text-black'
    }`

  const underlineClass = (visible: boolean) =>
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ${
      scrolled ? 'bg-white' : 'bg-black'
    } ${visible ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`

  return (
    <main className="min-h-screen bg-white text-black" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 backdrop-blur-sm transition-colors duration-500 ${
          scrolled ? 'bg-black text-white' : 'bg-transparent text-black'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="w-full flex flex-nowrap items-center justify-between gap-6 px-6 md:px-12 py-4 md:py-5">
          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 overflow-hidden transition-colors duration-500"
              style={{ mixBlendMode: 'lighten' }}
              aria-hidden
            >
              <Image
                src="/header-icon.png"
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-[10px] md:text-xs tracking-[0.25em] uppercase transition-colors duration-500 ${
                scrolled ? 'text-white/80' : 'text-black/80'
              }`}
            >
              студія анімації Богеміка
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-5 md:gap-8">
            <li>
              <Link href="/" className={linkClass()}>
                <span>головна</span>
                <span className={underlineClass(false)} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/important" className={linkClass()}>
                <span>нам важливо</span>
                <span className={underlineClass(false)} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/price" className={linkClass(true)}>
                <span>прайс</span>
                <span className={underlineClass(true)} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/learn" className={linkClass()}>
                <span>навчатися</span>
                <span className={underlineClass(false)} aria-hidden />
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={`p-1 transition-colors ${
                  scrolled ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                }`}
                aria-label="Пошук"
              >
                <SearchIcon />
              </button>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${scrolled ? 'text-white' : 'text-black'}`}
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
          >
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-white md:hidden flex flex-col items-center justify-center"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-2 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white">
              головна
            </Link>
            <Link href="/important" onClick={() => setMobileMenuOpen(false)} className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white">
              нам важливо
            </Link>
            <Link href="/price" onClick={() => setMobileMenuOpen(false)} className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white">
              прайс
            </Link>
            <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white">
              навчатися
            </Link>
            <button type="button" className="mt-6 p-3 border-4 border-transparent text-black hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-[0.2em]" aria-label="Пошук">
              <SearchIcon />
            </button>
          </div>
        </motion.div>
      )}

      {/* Top row: 2025 | BOHEMIQA STUDIO | 009 */}
      <section className="px-6 md:px-12 pt-8 md:pt-12 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-sm tracking-[0.25em] uppercase">
            <div className="text-left text-black/60">2025</div>
            <div className="text-center text-black/60">BOHEMIQA STUDIO</div>
            <div className="text-right text-black/60">009</div>
          </div>
        </div>
      </section>

      {/* Title: vertical line + ПРАЙС (009) + dot matrix */}
      <section className="px-6 md:px-12 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="border-l-8 border-black h-32 flex-shrink-0" aria-hidden />
            <div>
              <h1 className="font-press-start pixel-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.8] text-black">
                ПРАЙС
              </h1>
              <span className="block text-[10px] md:text-xs tracking-[0.25em] uppercase text-black/60 mt-1">009</span>
              <div className="grid grid-cols-8 gap-x-[10px] gap-y-1.5 md:gap-x-[10px] md:gap-y-2 w-fit pt-4 pb-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black/60 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price table */}
      <section className="px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <ul className="space-y-6 md:space-y-8">
            {priceItems.map((item, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 border-b border-black/10 pb-4 md:pb-6">
                <span className="font-press-start text-base md:text-lg text-black flex-shrink-0">
                  {item.name}
                </span>
                <span className="text-sm md:text-base font-bold text-black flex-shrink-0 sm:text-right">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Точки: горизонтально 21 колонка по 4 ряда */}
      <div className="w-full px-6 md:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-4 gap-x-5 gap-y-8 w-full">
            {Array.from({ length: 21 * 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 md:w-[9px] md:h-[9px] bg-black/60 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
