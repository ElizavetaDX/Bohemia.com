'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'

const courses = [
  {
    id: 'ai',
    title: 'AI & Digital Art',
    description: 'Генерація смислів, робота з нейромережами, створення бази. Від ідеї до готового візуалу.',
    forWho: 'Дизайнери, арт-директори, контент-мейкери',
    result: 'Впевнена робота з AI-інструментами, унікальний стиль',
  },
  {
    id: '3d',
    title: '3D Visualization',
    description: 'Технічна частина: світло, матеріали, композиція. Те саме «дороге» якість, яке замовляють бренди.',
    forWho: '3D-художники, візуалізатори, продуктові фотографи',
    result: 'Рівень комерційної 3D-візуалізації під замовлення',
  },
  {
    id: 'vfx',
    title: 'Commercial VFX',
    description: 'Як робити відео, які продають, а не просто висять в портфоліо. Від превізу до фіналу.',
    forWho: 'Монтажери, моушн-дизайнери, режисери реклами',
    result: 'Готові роботи для реальних брифів та клієнтів',
  },
]

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
      {isOpen ? (
        <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
      ) : (
        <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
      )}
    </svg>
  )
}

export default function LearnPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [applicationSent, setApplicationSent] = useState(false)
  const [applicationSending, setApplicationSending] = useState(false)
  const [course, setCourse] = useState('')
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formTelegram, setFormTelegram] = useState('')
  const applicationModalRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (applicationOpen) {
      const ctaSection = document.getElementById('cta-application')
      ctaSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => applicationModalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }, [applicationOpen])

  const linkClass = (active?: boolean) =>
    `relative group text-[9px] md:text-[10px] tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${
      active ? (scrolled ? 'text-white' : 'text-black') : scrolled ? 'text-white/60 hover:text-white' : 'text-black/50 hover:text-black'
    }`

  const underlineClass = () =>
    `pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${scrolled ? 'bg-white' : 'bg-black'}`

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('0') && digits.length === 10) digits = '38' + digits
    digits = digits.slice(0, 12)
    if (digits.length <= 2) return digits ? `+${digits}` : ''
    if (digits.length <= 5) return `+${digits.slice(0, 2)} (${digits.slice(2)}`
    if (digits.length <= 8) return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${digits.slice(5)}`
    return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPhone(formatPhone(e.target.value))
  }

  const isValidPhone = (s: string) => s.replace(/\D/g, '').length >= 10
  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course.trim() || !formName.trim() || !formPhone.trim() || !formEmail.trim() || !formTelegram.trim()) return
    if (!isValidPhone(formPhone) || !isValidEmail(formEmail)) return
    setApplicationSending(true)
    setApplicationSent(false)
    try {
      const res = await fetch('/api/send-learn-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course,
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          telegram: formTelegram.trim().replace(/^@/, ''),
        }),
      })
      if (res.ok) {
        setApplicationSent(true)
        setTimeout(() => {
          setApplicationOpen(false)
          setCourse('')
          setFormName('')
          setFormPhone('')
          setFormEmail('')
          setFormTelegram('')
          setApplicationSent(false)
        }, 2000)
      }
    } finally {
      setApplicationSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black bg-dots-pattern">
      <motion.header
        className={`sticky top-0 z-[50] w-full transition-all duration-300 ease-out ${scrolled ? 'bg-black/80 text-white backdrop-blur-md shadow-sm' : 'bg-white/80 text-black backdrop-blur-md'}`}
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
          <ul className="hidden md:flex items-center gap-3 md:gap-5 ml-4 md:ml-6 flex-shrink-0">
            <li><Link href="/" className={linkClass()}><span>головна</span><span className={underlineClass()} aria-hidden /></Link></li>
            <li><Link href="/services" className={linkClass()}><span>креатив</span><span className={underlineClass()} aria-hidden /></Link></li>
            <li><Link href="/important" className={linkClass()}><span>нам важливо</span><span className={underlineClass()} aria-hidden /></Link></li>
            <li><Link href="/price" className={linkClass()}><span>прайс</span><span className={underlineClass()} aria-hidden /></Link></li>
            <li><Link href="/learn" className={linkClass(true)}><span>навчатися</span><span className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full scale-x-100 origin-left ${scrolled ? 'bg-white' : 'bg-black'}`} aria-hidden /></Link></li>
            <li><Link href="/series" className={linkClass()}><span>хх</span><span className={underlineClass()} aria-hidden /></Link></li>
            <li><button type="button" className={`p-1 transition-colors ${scrolled ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`} aria-label="Пошук"><SearchIcon /></button></li>
          </ul>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] flex items-center justify-center flex-shrink-0 transition-colors ${scrolled ? 'text-white' : 'text-black'}`} aria-label="Меню" aria-expanded={mobileMenuOpen}>
            <BurgerIcon isOpen={mobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero */}
      <section id="hero" className="content-above-dots px-4 sm:px-6 md:px-12 pt-2.5 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 text-xs md:text-sm tracking-[0.25em] uppercase mb-1 md:mb-2">
            <div className="text-left w-[40px] tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">2025</div>
            <div className="text-center w-[110px] sm:w-[130px] md:w-[280px] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60 font-press-start whitespace-nowrap">BOHEMIQA STUDIO</div>
            <div className="text-right tracking-tight text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60">011</div>
          </div>
          <motion.h1
            className="font-press-start pixel-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-center tracking-tight leading-[0.95] text-black mt-2 mb-6 md:mb-8 pt-5 pb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            НАВЧАННЯ
            <br />
            СТАРТ СКОРО
          </motion.h1>
        </div>
      </section>

      {/* Типографический блок */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 md:gap-16 bg-white p-6 md:p-8 lg:p-10 rounded-lg">
            <div className="space-y-6 text-base md:text-lg leading-[1.7] tracking-[0.02em] text-black/90 text-justify min-w-0">
              <p>Скоро ми запускаємо серію навчань для творчої богеми — тих, хто хоче робити смачно, глибоко й нарешті вийти в комерцію.</p>
              <p>Буде про візуал та сенси, які чіпляють, і про процес, який живе. Без прогрівів, для своїх. Без космосу в ціні.</p>
              <p>Тебе буде вести <strong className="font-semibold text-black">практикуючий арт-директор</strong> успішної української студії, яка щодня створює візуал та сенси для брендів в умовах реального ринку. Тут буде все, чим ми користуємось самі.</p>
            </div>
            <div className="space-y-6 text-base md:text-lg leading-[1.7] tracking-[0.02em] text-black/90 text-justify min-w-0">
              <p>Це навчання для тих, хто втомився від попси, для тих, хто не хоче бути голодним художником, а відчуває в собі потенціал.</p>
              <p className="text-black/80">Скоро буде момент. Твій.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Напрямки — карточки */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="border-l-8 border-black pl-4 mb-8 md:mb-10">
            <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight text-black">напрямки</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course) => (
              <article
                key={course.id}
                className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-md shadow-lg overflow-hidden flex flex-col"
              >
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <div className="inline-flex items-center px-2 py-1 rounded border border-black/20 bg-black/5 text-[10px] font-semibold uppercase tracking-wider text-black/70 mb-4 w-fit">
                    Coming Soon
                  </div>
                  <h3 className="font-press-start text-sm md:text-base uppercase tracking-tight text-black mb-3">{course.title}</h3>
                  <p className="text-sm text-black/80 leading-relaxed mb-5 flex-1">{course.description}</p>
                  <dl className="space-y-2 text-xs">
                    <div>
                      <dt className="font-semibold uppercase tracking-wider text-black/60">Для кого</dt>
                      <dd className="text-black/80 mt-0.5">{course.forWho}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold uppercase tracking-wider text-black/60">Результат</dt>
                      <dd className="text-black/80 mt-0.5">{course.result}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Про автора */}
      <section className="content-above-dots px-4 sm:px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="border-l-8 border-black pl-4">
            <h2 className="font-press-start font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[0.8] tracking-tight text-black mb-4">про автора</h2>
            <p className="text-base md:text-lg leading-[1.7] text-black/90 max-w-2xl bg-white">
              <strong className="font-semibold text-black">Практикуючий арт-директор</strong> студії BOHEMIQA — не теоретик, а той, хто щодня веде проєкти для брендів, приймає дедлайни та відповідає за результат. Тут ти отримаєш не абстрактні лекції, а перевірені інструменти та підхід, якими ми користуємось у комерційних замовленнях. Навчаємо тому, що реально продається і потрібно ринку.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-application" className="content-above-dots px-4 sm:px-6 md:px-12 py-5 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => setApplicationOpen((prev) => !prev)}
              className="min-h-[104px] px-16 py-8 text-lg md:text-xl font-medium uppercase tracking-widest rounded-lg border-2 border-red-600 bg-red-600 text-white transition-colors hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            >
              ЗАСТОЛБИТИ МІСЦЕ
            </button>
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-black/60 font-press-start text-center max-w-lg">
              Приєднайся до листа очікування —
              <br />
              повідомимо про старт першими.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 md:px-12 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-black/50">студія анімації Богеміка</span>
        </div>
      </footer>

      {/* Модалка заявки на навчання */}
      {applicationOpen && (
        <div
          ref={applicationModalRef}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-title"
          onClick={(e) => { if (e.target === e.currentTarget && !applicationSent) setApplicationOpen(false) }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden flex-shrink-0"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between bg-white/60 backdrop-blur-sm">
              <h2 id="application-title" className="font-press-start text-sm uppercase tracking-tight text-black">Заявка на навчання</h2>
              <button type="button" onClick={() => !applicationSent && setApplicationOpen(false)} className="p-2 -m-2 text-black/60 hover:text-black rounded focus:outline-none focus:ring-2 focus:ring-black/20" aria-label="Закрити">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            {applicationSent ? (
              <div className="px-5 py-12 text-center text-black/90 text-base">Дякуємо! Твоє місце заброньовано.</div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="p-5 space-y-4">
                <div>
                  <label htmlFor="app-course" className="block text-xs font-medium text-black mb-1">Напрямок курсу <span className="text-black/50">*</span></label>
                  <select
                    id="app-course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                    className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white/90 text-black text-sm focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30"
                  >
                    <option value="">Оберіть напрямок</option>
                    <option value="AI GENERATION">AI GENERATION</option>
                    <option value="3D VISUALIZATION">3D VISUALIZATION</option>
                    <option value="VFX & PHYSICS">VFX & PHYSICS</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="app-name" className="block text-xs font-medium text-black mb-1">Ім&apos;я <span className="text-black/50">*</span></label>
                  <input id="app-name" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ваше ім'я" required className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white/90 text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30" />
                </div>
                <div>
                  <label htmlFor="app-phone" className="block text-xs font-medium text-black mb-1">Телефон <span className="text-black/50">*</span></label>
                  <input id="app-phone" type="tel" value={formPhone} onChange={handlePhoneChange} placeholder="+38 (0__) ___-__-__" required className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white/90 text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30" />
                </div>
                <div>
                  <label htmlFor="app-email" className="block text-xs font-medium text-black mb-1">Email <span className="text-black/50">*</span></label>
                  <input id="app-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" required className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white/90 text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30" />
                </div>
                <div>
                  <label htmlFor="app-telegram" className="block text-xs font-medium text-black mb-1">Telegram @username <span className="text-black/50">*</span></label>
                  <input id="app-telegram" type="text" value={formTelegram} onChange={(e) => setFormTelegram(e.target.value.replace(/[^@a-zA-Z0-9_]/g, ''))} placeholder="@username" required className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white/90 text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/30 focus:border-black/30" />
                </div>
                <button
                  type="submit"
                  disabled={applicationSending}
                  className="w-full min-h-[52px] px-6 py-3 bg-red-600 text-white text-sm font-medium uppercase tracking-widest rounded-lg border-2 border-red-600 transition-colors hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applicationSending ? 'Надсилаю...' : 'ВІДПРАВИТИ'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </main>
  )
}
