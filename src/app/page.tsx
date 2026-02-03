'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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

type SectionId = 'hero' | 'content'

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const sectionIds: SectionId[] = ['hero', 'content']

    const handleScroll = () => {
      const scrollY = window.scrollY
      const offset = 140

      let current: SectionId = 'hero'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const top = el.offsetTop - offset
        if (scrollY >= top) {
          current = id
        }
      }

      setActiveSection(current)
      setScrolled(scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top when opening the main page (e.g. from header "головна" on other pages)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Block scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navLinkClass = (id: SectionId) =>
    `relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
      activeSection === id
        ? scrolled
          ? 'text-white'
          : 'text-black'
        : scrolled
          ? 'text-white/60'
          : 'text-black/50'
    }`

  const underlineClass = (id: SectionId) =>
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ${
      scrolled ? 'bg-white' : 'bg-black'
    } ${
      activeSection === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
    }`

  type HeroButton = {
    label: string
    href: string
    external?: boolean
  }

  const heroButtons: HeroButton[] = [
    { label: 'перейти до прайсу', href: '/price' },
    { label: 'креатив', href: '/services', external: false },
    { label: 'написати Даші', href: 'https://t.me/dasha_dorsh', external: true },
    { label: 'навчатися', href: '/learn', external: false },
  ]

  const galleryItems = [
    { id: 1, src: '/gallery-01.png', alt: 'Gallery item 01' },
    { id: 2, src: '/gallery-02.png', alt: 'Gallery item 02' },
    { id: 3, src: '/gallery-03.png', alt: 'Gallery item 03' },
    { id: 4, src: '/gallery-04.png', alt: 'Gallery item 04' },
    { id: 5, src: '/gallery-05.png', alt: 'Gallery item 05' },
    { id: 6, src: '/gallery-06.png', alt: 'Gallery item 06' },
    { id: 7, src: '/gallery-07.png', alt: 'Gallery item 07' },
    { id: 8, src: '/gallery-08.png', alt: 'Gallery item 08' },
  ]

  return (
    <main className="min-h-screen bg-white text-black bg-dots-pattern">
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 backdrop-blur-sm transition-colors duration-500 ${
          scrolled
            ? 'bg-black text-white'
            : 'bg-transparent text-black'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="w-full flex flex-nowrap items-center justify-between gap-6 px-6 md:px-12 py-4 md:py-5">
          <div className="flex items-center gap-3 md:gap-4">
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
          </div>
          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-5 md:gap-8">
            <li>
              <a
                href="#"
                className={navLinkClass('hero')}
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo(0, 0)
                }}
              >
                <span>головна</span>
                <span className={underlineClass('hero')} aria-hidden />
              </a>
            </li>
            <li>
              <Link
                href="/services"
                className={`relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
                  scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
                }`}
              >
                <span>креатив</span>
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    scrolled ? 'bg-white' : 'bg-black'
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
            <li>
              <Link
                href="/important"
                className={`relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
                  scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
                }`}
              >
                <span>нам важливо</span>
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    scrolled ? 'bg-white' : 'bg-black'
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
            <li>
              <Link
                href="/price"
                className={`relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
                  scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
                }`}
              >
                <span>прайс</span>
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    scrolled ? 'bg-white' : 'bg-black'
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
            <li>
              <Link
                href="/learn"
                className={`relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ${
                  scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
                }`}
              >
                <span>навчатися</span>
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    scrolled ? 'bg-white' : 'bg-black'
                  }`}
                  aria-hidden
                />
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
          {/* Mobile burger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-white' : 'text-black'
            }`}
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
          >
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-white md:hidden flex flex-col items-center justify-center"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-2 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo(0, 0)
                setMobileMenuOpen(false)
              }}
              className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              головна
            </a>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              послуги
            </Link>
            <Link
              href="/important"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              нам важливо
            </Link>
            <Link
              href="/price"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              прайс
            </Link>
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl uppercase leading-tight tracking-[0.2em] text-black py-2 px-3 -mx-3 transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
            >
              навчатися
            </Link>
            <button
              type="button"
              className="mt-6 p-3 border-4 border-transparent text-black hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-[0.2em]"
              aria-label="Пошук"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section id="hero" className="px-6 md:px-12 pt-2.5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left tracking-tight text-base md:text-lg font-bold text-black/60">2025</div>
            <div className="text-center text-base md:text-lg font-bold text-black/60 font-press-start">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-base md:text-lg font-bold text-black/60">011</div>
          </div>

          <h1 className="font-press-start pixel-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-center tracking-tight leading-tight mt-2 mb-4 md:mb-6">
            ПРИВІТ
          </h1>
        </div>
      </section>

      {/* Content / About */}
      <section
        id="content"
        className="px-6 md:px-12 py-6 md:py-4 pb-[10px] min-h-0 lg:min-h-[360px]"
        style={{ marginTop: '10px', marginBottom: '10px' }}
      >
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-stretch">
            {/* Left column */}
            <div className="w-full lg:w-auto lg:max-w-[320px]">
              <div className="relative aspect-square w-full max-w-[320px] mx-auto lg:mx-0 overflow-hidden rounded-md bg-neutral-100">
                <Image
                  src="/dasha-portrait.png"
                  alt="Даша — студія анімації Богеміка"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-[5px] left-[5px] text-[10px] md:text-xs tracking-tight uppercase text-black/60 font-bold">
                  001
                </span>
              </div>
            </div>

            {/* Right column */}
            <div className="font-content-mono -ml-[20px] lg:-ml-[40px] min-h-0 flex flex-col justify-end gap-4 md:gap-5 pt-4 lg:pt-0 lg:h-[320px] bg-white px-4 py-4 md:px-5 md:py-5">
              <div className="flex flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm md:text-base leading-relaxed tracking-[0.12em] sm:tracking-[0.18em] uppercase mb-0 text-black">
                    мене звати Даша, рада, що ви тут
                  </p>
                  <p className="text-[24px] md:text-[32px] leading-relaxed tracking-[0.12em] sm:tracking-[0.18em] mt-0 mb-0 text-black" style={{ verticalAlign: 'top' }}>
                    ^_^
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-x-5 gap-y-8 flex-shrink-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black/60 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 text-sm leading-relaxed tracking-[0.1em] sm:tracking-[0.16em] max-w-3xl">
                <p className="break-words text-black text-justify">
                  {'Моя місія про любов, любов до своєї справи, любов до краси, любов до всього, що створюють талановиті українці. В Богеміці я зібрала класне ком\'юніті художників та технарів, вони неймовірні!'}
                </p>
                <p className="break-words text-black text-justify">
                  Для мене немає нічого неможливого і я одержима своєю справою. Давайте створювати щось приголомшливе разом! Якщо у вас є ідея, ми її радо втілимо, а якщо немає, споко, бо маємо їх цілу купу :)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Central menu buttons */}
      <div className="mt-12 md:mt-12 space-y-4 px-6 md:px-12 pt-[10px] md:pt-[10px] pb-[10px]">
        <div className="max-w-6xl mx-auto">
          {heroButtons.map((button) =>
            button.external ? (
              <a
                key={button.label}
                href={button.href}
                target="_blank"
                rel="noreferrer"
                className="block max-w-3xl mx-auto rounded-md bg-black text-white px-6 py-4 md:py-5 text-center text-[10px] md:text-xs tracking-[0.25em] uppercase hover:bg-black/90 transition-colors"
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                {button.label}
              </a>
            ) : (
              <Link key={button.label} href={button.href}>
                <span
                  className="block max-w-3xl mx-auto rounded-md bg-black text-white px-6 py-4 md:py-5 text-center text-[10px] md:text-xs tracking-[0.25em] uppercase hover:bg-black/90 transition-colors"
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  {button.label}
                </span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Section 006: Clients */}
      <section id="clients" className="px-6 md:px-12 py-16 md:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-10 md:mb-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-3 md:gap-4 relative">
                <div className="border-l-8 border-black pl-4 bg-white py-2 pr-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight">
                      clients
                    </h2>
                  </div>
                  <div className="grid grid-cols-8 gap-x-[10px] gap-y-1.5 md:gap-x-[10px] md:gap-y-2 w-fit pt-[5px] pb-[5px]">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black/60 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 text-sm md:text-base tracking-tight uppercase text-black/60 font-bold bg-white px-2 py-1">
              (006)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center min-h-[80px] border-2 border-black/20 rounded-md text-[10px] md:text-xs tracking-[0.2em] uppercase text-black/50 bg-white"
              >
                Client {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-black/50">
            студія анімації Богеміка
          </span>
        </div>
      </footer>
    </main>
  )
}
