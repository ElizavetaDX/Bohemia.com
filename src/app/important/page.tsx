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

export default function ImportantPage() {
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

  const underlineClass = () =>
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-300 ${
      scrolled ? 'bg-white' : 'bg-black'
    }`

  const listItems = [
    'уважно слухаємо вас і відчуваємо суть запиту;',
    'пропонуємо ідеї, які підсилюють концепцію, а не прикрашають без сенсу;',
    'не пропадаємо;',
    'не економимо на якості;',
    'завжди на зв\'язку;',
    'беремо максимум відповідальності за процес і результат.',
    'і взагалі ми котики',
  ]

  return (
    <main className="min-h-screen bg-white text-black bg-dots-pattern">
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
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-4"
          >
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
                <span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/services" className={linkClass()}>
                <span>креатив</span>
                <span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/important" className={linkClass(true)}>
                <span>нам важливо</span>
                <span className={underlineClass()} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/price" className={linkClass()}>
                <span>прайс</span>
                <span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/learn" className={linkClass()}>
                <span>навчатися</span>
                <span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden />
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
        <div
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
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white">
              креатив
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
        </div>
      )}

      {/* Hero: мелкие надписи + заголовок НАМ ВАЖЛИВО */}
      <section id="hero" className="px-6 md:px-12 pt-2.5 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left tracking-tight text-base md:text-lg font-bold text-black/60">2025</div>
            <div className="text-center text-base md:text-lg font-bold text-black/60 font-press-start">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-base md:text-lg font-bold text-black/60">011</div>
          </div>
          <h1 className="font-press-start pixel-hero text-4xl sm:text-5xl md:text-6xl uppercase text-center tracking-tight leading-tight bg-white mt-2 mb-4 md:mb-6">
            НАМ ВАЖЛИВО
          </h1>
        </div>
      </section>

      {/* Основной контент: две колонки */}
      <section className="px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <p className="text-sm md:text-base leading-snug tracking-[0.02em] text-black/90 text-justify bg-white">
              кожен наш проєкт — це не просто файна картинка. Це історія, яка народжується з глибини і втілюється через СЕНС, естетику та відповідальність. ми прагнемо, щоб кожен кадр промовляв мовою ваших цінностей і створював простір, в якому хочеться залишитись.
            </p>
            <p className="text-sm md:text-base leading-snug tracking-[0.02em] text-black/90 text-justify bg-white">
              ми відповідальні — не тільки за дедлайни, а й за відчуття після співпраці. у Богеміки немає конвеєра. Є досвід, естетика і щире бажання зробити продукт, яким хочеться пишатись.
            </p>
          </div>
        </div>
      </section>

      {/* Блок со списком: заголовок + сетка grid-cols-2 */}
      <section className="px-6 md:px-12 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm md:text-base font-semibold leading-tight tracking-[0.02em] text-black/90 mb-4 bg-white">
            саме тому ми:
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm md:text-base leading-tight tracking-[0.02em] text-black/90 list-none bg-white">
            {listItems.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-black" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Точки: горизонтально 21 колонка по 4 ряда, по ширине контента */}
      <div className="w-full px-6 md:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-4 gap-x-5 gap-y-8 w-full">
            {Array.from({ length: 21 * 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 md:w-[9px] md:h-[9px] bg-black/60 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-white border-t border-black/10">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-black/50">
            студія анімації Богеміка
          </span>
        </div>
      </footer>
    </main>
  )
}
