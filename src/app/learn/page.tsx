'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'

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

type LearnSection = {
  id: string
  title: string
  description: string
  price: string
}

const learnSections: LearnSection[] = []

export default function LearnPage() {
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
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
      scrolled ? 'bg-white' : 'bg-black'
    }`

  return (
    <main className="min-h-screen bg-white text-black bg-dots-pattern">
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'bg-black/90 text-white backdrop-blur-md shadow-sm' : 'bg-white/80 text-black backdrop-blur-md md:bg-white/80'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="w-full flex flex-nowrap items-center justify-between gap-2 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 overflow-hidden transition-colors duration-500"
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
              className={`text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors duration-500 whitespace-nowrap truncate ${
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
                <span className={underlineClass()} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/services" className={linkClass()}>
                <span>креатив</span>
                <span className={underlineClass()} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/important" className={linkClass()}>
                <span>нам важливо</span>
                <span className={underlineClass()} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/price" className={linkClass()}>
                <span>прайс</span>
                <span className={underlineClass()} aria-hidden />
              </Link>
            </li>
            <li>
              <Link href="/learn" className={linkClass(true)}>
                <span>навчатися</span>
                <span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full scale-x-100 origin-left ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden />
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
            className={`md:hidden p-2 min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center flex-shrink-0 transition-colors ${scrolled ? 'text-white' : 'text-black'}`}
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
          >
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero */}
      <section id="hero" className="content-above-dots px-4 sm:px-6 md:px-12 pt-2.5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left tracking-tight text-base md:text-lg font-bold text-black/60">2025</div>
            <div className="text-center text-base md:text-lg font-bold text-black/60 font-press-start whitespace-nowrap">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-base md:text-lg font-bold text-black/60">011</div>
          </div>

          <h1
            className="font-press-start pixel-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-center tracking-tight mt-2 mb-4 md:mb-6 w-fit mx-auto"
            style={{ paddingTop: '20px', paddingBottom: '20px' }}
          >
            СТАРТ
            <br />
            СКОРО
          </h1>
        </div>
      </section>

      {/* Текстовый блок под Hero: два столбика */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="text-base md:text-lg leading-relaxed tracking-[0.04em] text-black/90 space-y-0.5 text-justify">
              <p>
                скоро ми запускаємо серію навчань для творчої богеми — тих, хто хоче робити смачно, глибоко й нарешті вийти в комерцію
              </p>
              <p>
                буде про візуал та сенси, які чіпляють, і про процес, який живе. без прогрівів, для своїх. Без космосу в ціні
              </p>
            </div>
            <div className="text-base md:text-lg leading-relaxed tracking-[0.04em] text-black/90 space-y-0.5 text-justify">
              <p>
                тебе буде вести практикуючий арт-директор успішної української студії, яка щодня створює візуал та сенси для брендів в умовах реального ринку тут буде все, чим ми користуємось самі
              </p>
              <p>
                це навчання для тих, хто втомився від попси, для тих хто не хоче бути голодним художником, а відчуває в собі потенціал
              </p>
              <p>скоро буде момент. Твій.</p>
              <p className="pt-0 pb-0">Не проґав, будь ласочка :)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Точки: горизонтально 21 колонка по 4 ряда, по ширине контента (как текст и футер) */}
      <div className="w-full px-4 sm:px-6 md:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-4 gap-x-5 gap-y-8 w-full">
            {Array.from({ length: 21 * 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 md:w-[9px] md:h-[9px] bg-black/60 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-12 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-black/50">
            студія анімації Богеміка
          </span>
        </div>
      </footer>
    </main>
  )
}
