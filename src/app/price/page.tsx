'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Wrapper } from '@/components/Wrapper'
import { MobileMenu } from '@/components/MobileMenu'
import { PriceCalculator } from '@/components/PriceCalculator'

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
      priceLine(''),
      priceLine('обертання 360 градусів', '2 500'),
      priceLine(''),
      priceLine('етап 2', undefined, true),
      priceLine(''),
      priceLine('ai-відео:'),
      priceLine(''),
      priceLine('оживлення кадру за сценарієм (до 3х кадрів)', '4000'),
      priceLine(''),
    ],
    price: 'від 200$',
    src: '/gallery-02.png',
    alt: 'Product 360',
  },
  {
    id: 4,
    name: 'Візуалізація',
    description: 'рівень складності / ціна, грн',
    price: 'від 400$',
    src: '/gallery-04.png',
    alt: 'Візуалізація',
    tiers: [
      { text: '3D лого, пакет, коробка, простий топ, футболка, легінси, трусики, лонгслів', price: '2 500' },
      { text: 'сукня, спідниця, кобінезон, боді, сорочка, брюки, купальник, білизна без кісточок, джогери, світшот, худі, жилет, обручки, панчохи, перчатки', price: '4 000' },
      { text: 'флакон, косметика, капелюх, пальто, жакет, косуха, тренч, вечірня сукня, білизна з корсетними кісточками, пуховик, корсет, ремінь, простий посуд, домашній текстиль', price: '6 000' },
      { text: 'окуляри, проста сумочка, складні принти та текстури, не складні ювелірні вироби, простий анімований персонаж, меблі, їжа, складний посуд', price: '12 000' },
      { text: "складна сумочка, рюкзак, взуття, хутро, одяг з пір'ям, складні ювелірні вироби, годинник, одяг з оздобленням із каміння/перлин, вишивка, анімований персонаж", price: '20 000+' },
    ],
    notes: {
      title: 'Умови та примітки',
      items: [
        'базовий пакет візуалізації включає 10 фото-рендерів в різних ракурсах/кольорах(до 3х)/позах/з різним фоном',
        'кожен додатковий рендер 50 грн (мінімальне замовлення 5 шт/1 колір)',
        "3D об'єкт залишається з вами назавжди і може бути використаний в подальшому для креативів та анімацій",
        'в прайсі вказана орієнтовна середня ціна, кінцева озвучується після знайомства з вашим продуктом по фото/ескізу/референсу',
      ],
    },
  },
  {
    id: 5,
    name: 'Сцена',
    description: 'Рiвень складностi',
    price: 'від 150$',
    src: '/gallery-05.png',
    alt: 'Сцена',
    tiers: [
      { text: 'однотонний фон, фон-картинка, тінь на підлозі, без фону, земля-небо, пуста кімната, простий подіум', price: '0 000' },
      { text: 'статичні рослини, стандартний аватар в позі, торт, новорічна ялинка, кульки, візок, двері, побутові предмети, телефон, телевізор', price: '2 000' },
      { text: 'мебльована кімната, місто, галявина, ліс, сад, дощ, вулиця, вогонь, анімовані рослини, рідини, туман, водойми, транспорт (авто, літак і тп), анімований парашут', price: '4 000' },
      { text: "сцена з великою кількістю об'єктів", price: '10 000+' },
    ],
  },
  {
    id: 6,
    name: 'Фізична симуляція',
    description: 'різновиди анімації / ціна, грн',
    price: 'від 250$',
    src: '/gallery-06.png',
    alt: 'Фізична симуляція',
    lines: [
      priceLine('різновиди анімації / ціна, грн', undefined, true),
      priceLine(''),
      priceLine('CG анімація з фізичною симуляцією:'),
      priceLine('5-7 сек', '9 600'),
      priceLine('8-12 сек', '14 400'),
      priceLine('13-20 сек', '19 200'),
      priceLine(''),
      priceLine('VFX з фізичною симуляцією:'),
      priceLine('5-7 сек', '12 000'),
      priceLine('8-12 сек', '17 280'),
      priceLine('13-20 сек', '23 000'),
    ],
  },
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
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.removeProperty('overflow')
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.removeProperty('overflow')
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const linkClass = (active?: boolean) =>
    'relative group text-[9px] md:text-[10px] tracking-[0.15em] uppercase transition-colors whitespace-nowrap ' + (active ? (scrolled ? 'text-white' : 'text-black') : (scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'))

  const underlineClass = (visible: boolean) =>
    'pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ' + (scrolled ? 'bg-white' : 'bg-black') + ' ' + (visible ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100');
  return (
    <Wrapper className="min-h-screen bg-white text-black bg-dots-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-[50] w-full transition-all duration-300 ease-out ${
          scrolled ? 'bg-black/80 text-white backdrop-blur-md shadow-sm' : 'bg-white/80 text-black backdrop-blur-md'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="w-full flex flex-nowrap items-center justify-between gap-2 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial">
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
              className={`text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors duration-500 whitespace-nowrap flex-shrink-0 ${
                scrolled ? 'text-white/80' : 'text-black/80'
              }`}
            >
              студія анімації Богеміка
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-3 md:gap-5 ml-4 md:ml-6 flex-shrink-0">
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
            className={`md:hidden p-2 min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center flex-shrink-0 transition-colors ${scrolled ? 'text-white' : 'text-black'}`}
            aria-label="Меню"
            aria-expanded={mobileMenuOpen}
          >
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Top row + Title: 2025 | BOHEMIQA STUDIO | 009 */}
      <section id="hero" className="content-above-dots px-4 sm:px-6 md:px-12 pt-2.5 pb-[5px] h-[95px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left w-[40px] tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">2025</div>
            <div className="text-center w-[110px] sm:w-[130px] md:w-[280px] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60 font-press-start">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">009</div>
          </div>
          <h1 className="font-press-start pixel-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[0.8] text-black text-center mt-2 mb-4 md:mb-6 pt-[20px] pb-[20px]">
            ПРАЙС
          </h1>
        </div>
      </section>

      <PriceCalculator />

      {/* Price list */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-12 md:py-10">
        <div className="max-w-6xl mx-auto">
          <ul className="space-y-12 md:space-y-16">
            {priceItems.map((item) => (
              <li key={item.id} className="border-b border-black/10 pb-12 md:pb-16 last:border-0">
                <div className="min-w-0">
                  {item.id === 1 ? (
                    <div className="flex items-stretch gap-6 mb-2">
                      <div className="border-l-8 border-black flex-shrink-0 self-stretch min-h-[1em]" aria-hidden />
                      <h3 className="font-press-start uppercase tracking-tight text-black leading-none text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px]">
                        <>01 <span className="normal-case">Ш</span><span className="normal-case inline-block text-[1.35em] leading-none align-baseline">і</span></>
                      </h3>
                    </div>
                  ) : (
                    <div className="flex items-stretch gap-6 mb-2">
                      <div className="border-l-8 border-black flex-shrink-0 self-stretch min-h-[1em]" aria-hidden />
                      <h3 className="font-press-start leading-none uppercase tracking-tight text-black text-2xl sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[52px]">
                        {String(item.id).padStart(2, '0')} {item.name}
                      </h3>
                    </div>
                  )}
                  {'lines' in item ? (
                    <div className="font-content-mono text-sm md:text-base text-black leading-relaxed mb-4 space-y-1">
                      {(item.lines ?? []).map((line, i) =>
                        !line.text && !line.price ? null : (
                          <div key={i} className="grid grid-cols-[1fr_85px] gap-4 items-baseline ml-5 min-w-0 mt-px pt-px pb-px">
                            {line.text && <span className={(line.price == null && line.text.length > 50 ? 'block w-full max-w-full break-words bg-white pt-5 pb-5' : 'min-w-0 bg-white pt-px pb-px') + (line.gray ? ' text-black/60' : '')}>{line.text}</span>}
                            {line.price != null && (
                              <span className="inline-block w-fit min-w-0 px-2 py-0.5 font-bold text-black text-sm md:text-base bg-white flex-shrink-0">
                                {line.price}
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm md:text-base text-black/60 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {'tiers' in item && (item as { tiers?: { text: string; price: string }[] }).tiers && (
                        <div className="font-content-mono text-sm md:text-base text-black leading-relaxed mb-4 space-y-1">
                          {(item as { tiers: { text: string; price: string }[] }).tiers.map((tier, i) => (
                            <div key={i} className="grid grid-cols-[1fr_85px] gap-4 items-baseline ml-5 min-w-0 mt-px pt-px pb-px">
                              <span className="block w-full max-w-full break-words bg-white pt-5 pb-5">{tier.text}</span>
                              <span className="inline-block w-fit min-w-0 px-2 py-0.5 font-bold text-black text-sm md:text-base bg-white flex-shrink-0">{tier.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {!('lines' in item) && !('tiers' in item) && 'price' in item && (
                    <span className="inline-block px-2 py-1 font-bold text-sm md:text-base text-black">
                      {(item as { price?: string }).price}
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
