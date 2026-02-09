'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'
import { getGuideBySlug } from '@/data/guidesData'

function BurgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
      {isOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
    </svg>
  )
}

const EMAIL_RU_REGEX = /@[^.]+\.ru(\s|$|[,;])/i

export default function PolytsiaSlugPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const guide = getGuideBySlug(slug)

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName || !trimmedEmail) {
      setSubmitStatus('error')
      setErrorMessage("Заповніть ім'я та email")
      return
    }

    if (EMAIL_RU_REGEX.test(trimmedEmail) || trimmedEmail.endsWith('.ru')) {
      setSubmitStatus('error')
      setErrorMessage('Поштові скрині з доменом .ru не приймаються.')
      return
    }

    setSubmitStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/send-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          guideId: slug,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSubmitStatus('error')
        setErrorMessage(data?.error ?? 'Помилка відправки')
        return
      }
      setSubmitStatus('ok')
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Помилка з’єднання')
    }
  }

  if (!guide) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4">
        <h1 className="font-press-start text-xl uppercase mb-4">Гайд не знайдено</h1>
        <Link href="/polytsia" className="text-sm underline uppercase tracking-wider">← На полицю</Link>
      </main>
    )
  }

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
          <div className="max-w-2xl mx-auto">
            <Link href="/polytsia" className="inline-block text-[10px] uppercase tracking-widest text-black/50 hover:text-black mb-6">
              ← Полиця
            </Link>
            <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-2">
              {guide.title}
            </h1>
            <p className="text-sm text-black/70 mb-8">{guide.description}</p>

            {submitStatus === 'ok' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-black/20 bg-white p-6"
              >
                <p className="font-press-start text-sm uppercase text-black mb-2">Готово! Гайд уже на пошті</p>
                <p className="text-sm text-black/70">Перевір пошту (і папку «Спам»). Якщо листа немає — напиши нам.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-black/20 bg-white p-6 space-y-4">
                <div>
                  <label htmlFor="polytsia-name" className="block text-[10px] uppercase tracking-wider text-black/60 mb-1">
                    Ім&apos;я
                  </label>
                  <input
                    id="polytsia-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше ім'я"
                    className="w-full min-h-[48px] px-4 border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                    disabled={submitStatus === 'sending'}
                  />
                </div>
                <div>
                  <label htmlFor="polytsia-email" className="block text-[10px] uppercase tracking-wider text-black/60 mb-1">
                    Email
                  </label>
                  <input
                    id="polytsia-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full min-h-[48px] px-4 border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                    disabled={submitStatus === 'sending'}
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600" role="alert">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className="w-full min-h-[52px] px-6 py-3 bg-black text-white font-press-start text-xs uppercase tracking-widest hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitStatus === 'sending' ? 'Відправляємо...' : 'Надіслати'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
