'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Wrapper } from '@/components/Wrapper'

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

const priceLine = (text: string, price?: string, gray?: boolean) => ({ text, price, gray })

const priceItems = [
  {
    id: 1,
    name: 'Ші',
    lines: [
      priceLine('послуга — ціна, грн', undefined, true),
      priceLine(''),
      priceLine('етап 1', undefined, true),
      priceLine(''),
      priceLine('реалістичне або концептуальне зображення з вашим продуктом, логотипом або впізнаваними елементами бренду', '2000'),
      priceLine(''),
      priceLine('етап 2', undefined, true),
      priceLine(''),
      priceLine('ai-відео:'),
      priceLine(''),
      priceLine('оживлення кадру за сценарієм (до 3х кадрів)', '4000'),
      priceLine(''),
      priceLine('креативи створюються за допомогою нейромереж, проте кожен кадр проходить детальну ручну обробку в Photoshop для досягнення високої якості'),
    ],
    price: 'від 300$',
    src: '/gallery-01.png',
    alt: 'CGI Fashion',
  },
  {
    id: 2,
    name: '3D анімація',
    lines: [
      priceLine('різновиди анімації — ціна, грн', undefined, true),
      priceLine(''),
      priceLine('ai-фото (кадр):'),
      priceLine(''),
      priceLine('обертання 360 градусів', '2 500'),
      priceLine('додатковий кадр в єдиній концепції', '1000'),
      priceLine('додатковий кадр ракурс', '500'),
      priceLine('снепи ai-аватару за ТЗ [макіяж+зачіска+одяг]', '3500'),
      priceLine(''),
      priceLine('етап 2', undefined, true),
      priceLine(''),
      priceLine('ai-відео:'),
      priceLine(''),
      priceLine('оживлення кадру за сценарієм (до 3х кадрів)', '4000'),
      priceLine(''),
      priceLine('креативи створюються за допомогою нейромереж, проте кожен кадр проходить детальну ручну обробку в Photoshop для досягнення високої якості'),
    ],
    price: 'від 200$',
    src: '/gallery-02.png',
    alt: 'Product 360',
  },
  { id: 3, name: 'Digital Character Creator', description: 'Створення унікальних аватарів та персонажів.', price: 'від 500$', src: '/gallery-03.png', alt: 'Character Creator' },
  { id: 4, name: 'Virtual Try-On', description: 'Технологія віртуальної примірки для e-commerce.', price: 'від 400$', src: '/gallery-04.png', alt: 'Virtual Try-On' },
  { id: 5, name: 'Motion Branding', description: 'Логотипи та айдентика, що рухаються.', price: 'від 150$', src: '/gallery-05.png', alt: 'Motion Branding' },
  { id: 6, name: '3D Loop Content', description: 'Зациклені відео для Reels та TikTok.', price: 'від 250$', src: '/gallery-06.png', alt: '3D Loop' },
  { id: 7, name: 'Textural Macro', description: 'Макрозйомка матеріалів: шкіра, метал, рідина.', price: 'від 150$', src: '/gallery-07.png', alt: 'Textural Macro' },
  { id: 8, name: 'Full Commercial Video', description: 'Повноцінний рекламний ролик під ключ.', price: 'від 1000$', src: '/gallery-08.png', alt: 'Commercial Video' },
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
    'relative group text-xs md:text-sm tracking-[0.2em] uppercase transition-colors ' + (active ? (scrolled ? 'text-white' : 'text-black') : (scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'))

  const underlineClass = (visible: boolean) =>
    'pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ' + (scrolled ? 'bg-white' : 'bg-black') + ' ' + (visible ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100');
  return (
    <Wrapper className="min-h-screen bg-white text-black bg-dots-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <motion.header
        className={`relative z-50 backdrop-blur-sm transition-colors duration-500 ${
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
              <Link href="/services" className={linkClass()}>
                <span>креатив</span>
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

      {/* Top row + Title: 2025 | BOHEMIQA STUDIO | 009 */}
      <section id="hero" className="px-6 md:px-12 pt-2.5 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left tracking-tight text-base md:text-lg font-bold text-black/60">2025</div>
            <div className="text-center text-base md:text-lg font-bold text-black/60 font-press-start">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-base md:text-lg font-bold text-black/60">009</div>
          </div>
          <h1 className="font-press-start pixel-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.8] text-black text-center mt-2 mb-4 md:mb-6">
            ПРАЙС
          </h1>
        </div>
      </section>

      {/* Price list */}
      <section className="px-6 md:px-12 py-12 md:py-10">
        <div className="max-w-6xl mx-auto">
          <ul className="space-y-12 md:space-y-16">
            {priceItems.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row sm:items-start gap-6 md:gap-8 border-b border-black/10 pb-12 md:pb-16 last:border-0">
                <div className="flex-shrink-0 w-[200px] h-[200px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} className="block max-w-full max-h-[200px] object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  {item.id === 1 ? (
                    <div className="flex items-start gap-6 mb-2">
                      <div className="border-l-8 border-black h-32 flex-shrink-0" aria-hidden />
                      <h3 className="font-press-start uppercase tracking-tight text-black text-[60px] leading-none">
                        <>01 <span className="normal-case">Ш</span><span className="normal-case inline-block text-[1.35em] leading-none align-baseline">і</span></>
                      </h3>
                    </div>
                  ) : item.id === 2 ? (
                    <div className="flex items-start gap-6 mb-2">
                      <div className="border-l-8 border-black h-32 flex-shrink-0" aria-hidden />
                      <h3 className="font-press-start text-[60px] leading-none uppercase tracking-tight text-black">
                        {String(item.id).padStart(2, '0')} {item.name}
                      </h3>
                    </div>
                  ) : (
                    <h3 className="font-press-start text-[60px] leading-none uppercase tracking-tight text-black mb-2">
                      {String(item.id).padStart(2, '0')} {item.name}
                    </h3>
                  )}
                  {'lines' in item ? (
                    <div className="font-content-mono text-sm md:text-base text-black leading-relaxed mb-4 space-y-1">
                      {item.lines.map((line, i) => (
                        <div key={i} className={!line.text && !line.price ? 'h-3' : line.price == null && line.text && line.text.length > 50 ? 'w-screen max-w-[100vw] relative left-1/2 -ml-[50vw] px-6 md:px-12 overflow-hidden' : 'grid grid-cols-[1fr_80px] gap-4 items-baseline ml-5 min-w-0'}>
                          {line.text && <span className={(line.price == null && line.text.length > 50 ? 'block w-full max-w-full break-words' : 'min-w-0 bg-white') + (line.gray ? ' text-black/60' : '')}>{line.text}</span>}
                          {line.price != null && (
                            <span className="inline-block w-fit min-w-0 px-2 py-0.5 border border-black font-bold text-black text-sm md:text-base bg-white flex-shrink-0">
                              {line.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-black/60 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                  {!('lines' in item) && (
                    <span className="inline-block px-2 py-1 border border-black font-bold text-sm md:text-base text-black">
                      {item.price}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Wrapper>
  )
}
