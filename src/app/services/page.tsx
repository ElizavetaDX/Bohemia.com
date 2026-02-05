'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function BurgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
      {isOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
    </svg>
  )
}

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

const reelsItems = [
  'https://www.instagram.com/p/DKZf_FYicfL/embed',
  'https://www.instagram.com/p/DMSReLatyEZ/embed',
  'https://www.instagram.com/p/DK2RPI8tbBr/embed',
]

const rotation360Reels = [
  'https://www.instagram.com/p/C5jT1PqiA9p/embed',
  'https://www.instagram.com/p/Cr72mqXtnt1/embed',
  'https://www.instagram.com/p/CfgUMNADQ00/embed',
]

export default function ServicesPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rotation360Loaded, setRotation360Loaded] = useState<boolean[]>([false, false, false])

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
    `relative group text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors ${
      active ? (scrolled ? 'text-white' : 'text-black') : (scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black')
    }`

  const underlineClass = (visible: boolean) =>
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'} ${visible ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`

  const navLink = (href: string, label: string, active: boolean) => (
    <Link href={href} className={linkClass(active)}>
      <span>{label}</span>
      <span className={underlineClass(active)} aria-hidden />
    </Link>
  )

  return (
    <main className="min-h-screen bg-white text-black bg-dots-pattern">
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-black/90 text-white backdrop-blur-md shadow-sm' : 'bg-white/80 text-black backdrop-blur-md md:bg-white/80'}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="w-full flex flex-nowrap items-center justify-between gap-2 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 overflow-hidden transition-colors duration-500" aria-hidden>
              <Image src="/header-icon.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className={`text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors duration-500 whitespace-nowrap flex-shrink-0 ${scrolled ? 'text-white/80' : 'text-black/80'}`}>
              студія анімації Богеміка
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-5 md:gap-8 ml-4 md:ml-8">
            <li>{navLink('/', 'головна', false)}</li>
            <li>{navLink('/services', 'креатив', true)}</li>
            <li>{navLink('/important', 'нам важливо', false)}</li>
            <li>{navLink('/price', 'прайс', false)}</li>
            <li>
              <Link href="/learn" className={linkClass()}>
                <span>навчатися</span>
                <span className={underlineClass(false)} aria-hidden />
              </Link>
            </li>
            <li>
              <button type="button" className={`p-1 transition-colors ${scrolled ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`} aria-label="Пошук">
                <SearchIcon />
              </button>
            </li>
          </ul>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center flex-shrink-0 transition-colors ${scrolled ? 'text-white' : 'text-black'}`} aria-label="Меню" aria-expanded={mobileMenuOpen}>
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero: КРЕАТИВ */}
      <section id="hero" className="content-above-dots px-4 sm:px-6 md:px-12 pt-2.5 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left w-[40px] tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">2025</div>
            <div className="text-center w-[110px] sm:w-[130px] md:w-[280px] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60 font-press-start">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">011</div>
          </div>
          <h1 className="font-press-start pixel-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase text-center tracking-tight leading-tight mt-5 mb-[5px]">
            КРЕАТИВ
          </h1>
        </div>
      </section>

      {/* Gallery / Price — infinite carousel */}
      <section id="price" className="content-above-dots px-0 pt-[50px] pb-16 md:pb-[50px] overflow-hidden">
        <div className="flex w-full animate-carousel">
          {[...galleryItems, ...galleryItems].map((item, index) => {
            const label = String(item.id).padStart(2, '0')
            return (
              <div key={`${item.id}-${index}`} className="relative flex-shrink-0 w-[180px] md:w-[220px] px-3 md:px-4">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-black/70 z-10">{label}</div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                  <Image src={item.src} alt={item.alt} fill className="object-contain" sizes="180px" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 002: 360 Rotation */}
      <section id="rotation-360" className="content-above-dots px-4 sm:px-6 md:px-12 py-[30px]">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-10 md:mb-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-3 md:gap-4 relative">
                <div className="border-l-8 border-black pl-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-2 sm:gap-3 md:gap-4">
                    <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight">обертання<br />градусів</h2>
                    <span className="font-mono font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-[-0.05em] flex items-center">360</span>
                  </div>
                  <div className="grid grid-cols-8 gap-x-[10px] gap-y-1.5 md:gap-x-[10px] md:gap-y-2 w-fit pt-[5px] pb-[5px]">
                    {Array.from({ length: 24 }).map((_, i) => (<div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black rounded-full" />))}
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 text-sm md:text-base tracking-tight uppercase text-black/60 font-bold">(002)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto pt-4 pb-6">
            {rotation360Reels.map((embedUrl, i) => (
              <div key={i} className="relative w-full h-[320px] md:h-[340px] rounded-lg overflow-hidden bg-neutral-100">
                {!rotation360Loaded[i] && (
                  <div className="absolute inset-0 bg-neutral-200 animate-pulse rounded-lg" aria-hidden />
                )}
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={embedUrl}
                  title={`Обертання 360 — Reels ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setRotation360Loaded((prev) => { const n = [...prev]; n[i] = true; return n })}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 003: Animation */}
      <section id="animation" className="px-6 md:px-12 py-0">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-10 md:mb-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 py-10">
              <div className="flex items-start gap-3 md:gap-4 relative">
                <div className="border-l-8 border-black pl-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight">анімація</h2>
                  </div>
                  <div className="grid grid-cols-8 gap-x-[10px] gap-y-1.5 md:gap-x-[10px] md:gap-y-2 w-fit pt-[5px] pb-[5px]">
                    {Array.from({ length: 24 }).map((_, i) => (<div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black/60 rounded-full" />))}
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 text-sm md:text-base tracking-tight uppercase text-black/60 font-bold">(003)</span>
          </div>
        </div>
      </section>

      {/* Reels — додай посилання в масив reelsItems */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-[30px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto pt-4 pb-6">
            {reelsItems.map((src, i) => (
              <div key={i} className="w-full overflow-hidden bg-black rounded-lg">
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                  <iframe className="absolute top-0 left-0 w-full h-full rounded-lg" src={src} title={`Reels ${i + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 005: AI Generation */}
      <section id="ai-generation" className="content-above-dots px-4 sm:px-6 md:px-12 py-16 md:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-10 md:mb-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-3 md:gap-4 relative">
                <div className="border-l-8 border-black pl-4">
                  <div className="flex items-center gap-4">
                    <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight">ai<br />генерація</h2>
                  </div>
                  <div className="grid grid-cols-8 gap-x-[10px] gap-y-1.5 md:gap-x-[10px] md:gap-y-2 w-fit pt-[10px] pb-[10px]">
                    {Array.from({ length: 24 }).map((_, i) => (<div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black/60 rounded-full" />))}
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 text-sm md:text-base tracking-tight uppercase text-black/60 font-bold">(005)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {[{ src: '/gallery-09.png', alt: 'AI generation 1' }, { src: '/gallery-10.png', alt: 'AI generation 2' }, { src: '/gallery-11.png', alt: 'AI generation 3' }].map((item, index) => (
              <div key={index} className="relative w-full aspect-[3/4] overflow-hidden rounded-md">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-12 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-black/50">студія анімації Богеміка</span>
        </div>
      </footer>
    </main>
  )
}
