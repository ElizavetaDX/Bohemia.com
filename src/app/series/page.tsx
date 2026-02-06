'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'
import { trackViewContent, trackLead, trackPurchase } from '@/components/AnalyticsPixels'
import { EPISODES } from '@/data/seriesData'

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

const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) digits = '380' + digits
  else if (!digits.startsWith('380') && digits.length >= 9) digits = '380' + digits.slice(-9)
  digits = digits.slice(0, 12)
  if (digits.length <= 3) return digits ? `+${digits}` : ''
  if (digits.length <= 6) return `+${digits.slice(0, 3)} (${digits.slice(3)}`
  if (digits.length <= 8) return `+${digits.slice(0, 3)} (${digits.slice(3, 6)}) ${digits.slice(6)}`
  return `+${digits.slice(0, 3)} (${digits.slice(3, 6)}) ${digits.slice(6, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
}

export default function SeriesPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [playerEpisode, setPlayerEpisode] = useState<number | null>(null)
  const [paymentFormOpen, setPaymentFormOpen] = useState(false)
  const [selectedPaid, setSelectedPaid] = useState<Set<number>>(new Set())
  const [accessPhones, setAccessPhones] = useState<Set<string>>(new Set())
  const [userEmail, setUserEmail] = useState('')
  const [paymentSending, setPaymentSending] = useState(false)
  const watermarkRef = useRef<HTMLDivElement>(null)

  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formTelegram, setFormTelegram] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formBirth, setFormBirth] = useState('')
  const [formCity, setFormCity] = useState('')

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

  const checkAccess = useCallback(async (phone: string): Promise<boolean> => {
    const normalized = phone.replace(/\D/g, '')
    if (normalized.length < 10) return false
    try {
      const res = await fetch('/api/series/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalized }),
      })
      const data = await res.json()
      if (data?.allowed) {
        setAccessPhones((p) => new Set(p).add(normalized))
        return true
      }
    } catch {
      /* ignore */
    }
    return false
  }, [])

  const handleOpenPlayer = (episodeId: number) => {
    const ep = EPISODES.find((e) => e.id === episodeId)
    if (!ep || ep.status !== 'FREE') return
    setUserEmail('guest')
    setPlayerEpisode(episodeId)
    setPlayerOpen(true)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPaid.size === 0) return
    setPaymentSending(true)
    try {
      const res = await fetch('/api/series/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          phone: formPhone.replace(/\D/g, ''),
          telegram: formTelegram,
          email: formEmail,
          birth: formBirth,
          city: formCity,
          episodeIds: Array.from(selectedPaid),
        }),
      })
      const data = await res.json()
      if (data?.pageUrl) window.location.href = data.pageUrl
    } finally {
      setPaymentSending(false)
    }
  }

  const togglePaid = (id: number) => {
    setSelectedPaid((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const linkClass = () =>
    'relative group text-[9px] md:text-[10px] tracking-[0.15em] uppercase transition-colors whitespace-nowrap text-black/60 hover:text-black'

  const totalPrice = Array.from(selectedPaid).reduce((sum, id) => {
    const ep = EPISODES.find((e) => e.id === id)
    return sum + (ep?.price ?? 0)
  }, 0)

  useEffect(() => {
    trackViewContent()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    if (params.get('success') === '1') {
      trackPurchase()
    }
  }, [])

  useEffect(() => {
    if (paymentFormOpen) trackLead()
  }, [paymentFormOpen])

  return (
    <main className="min-h-screen bg-white text-black">
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
            <li><Link href="/series" className="text-black"><span>хх</span></Link></li>
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
          <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-8">ХХ — Мультсеріал</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {EPISODES.map((ep) => (
              <div
                key={ep.id}
                className={`relative rounded-xl overflow-hidden border transition-all ${
                  ep.status === 'SOON'
                    ? 'bg-black/5 border-black/10 grayscale opacity-70'
                    : 'bg-black/5 border-black/20 hover:border-red-500/50'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl font-bold text-black/30">{ep.id}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{ep.title}</span>
                    {ep.status === 'PAID' && (
                      <span className="text-xs text-red-400 font-semibold">{ep.price} грн</span>
                    )}
                    {ep.status === 'SOON' && (
                      <span className="text-[10px] uppercase tracking-wider text-black/50">SOON</span>
                    )}
                    {ep.status === 'PAID' && (
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPaid.has(ep.id)}
                          onChange={() => togglePaid(ep.id)}
                          className="rounded border-black/30"
                        />
                        <span className="text-[10px]">Обрати</span>
                      </label>
                    )}
                  </div>
                  {ep.status === 'FREE' && (
                    <button
                      type="button"
                      onClick={() => handleOpenPlayer(ep.id)}
                      className="mt-2 w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Дивитись безкоштовно
                    </button>
                  )}
                  {ep.status === 'PAID' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const phone = prompt('Введіть номер телефону для перевірки доступу:')
                        if (!phone) return
                        const allowed = await checkAccess(phone)
                        if (allowed) {
                          const email = prompt('Email або нік для водяного знаку:') || 'user'
                          setUserEmail(email)
                          setPlayerEpisode(ep.id)
                          setPlayerOpen(true)
                        } else {
                          setSelectedPaid((p) => new Set(p).add(ep.id))
                          setPaymentFormOpen(true)
                        }
                      }}
                      className="mt-2 w-full py-2 px-3 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Дивитись
                    </button>
                  )}
                  {ep.status === 'SOON' && (
                    <button
                      type="button"
                      disabled
                      className="mt-2 w-full py-2 px-3 bg-black/10 text-black/40 text-xs font-medium uppercase tracking-wider rounded-lg cursor-not-allowed"
                    >
                      Скоро
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedPaid.size > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-black/5 border border-black/10">
              <span className="text-black/90">
                Обрано серій: {selectedPaid.size} · Разом: <strong>{totalPrice} грн</strong>
              </span>
              <button
                type="button"
                onClick={() => setPaymentFormOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium uppercase tracking-widest rounded-lg transition-colors"
              >
                Оплатити
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Player Modal */}
      {playerOpen && playerEpisode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={() => { setPlayerOpen(false); setPlayerEpisode(null) }}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
            aria-label="Закрити"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <span className="text-6xl text-white/20">Плеер (DRM)</span>
              <p className="absolute text-sm text-white/40">Підключіть Vdocipher або Wistia</p>
            </div>
            <div ref={watermarkRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
              <div className="absolute top-1/2 -translate-y-1/2 text-white/20 text-2xl font-mono whitespace-nowrap animate-watermark">
                {userEmail}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {paymentFormOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setPaymentFormOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-black/10 bg-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
              <h2 className="font-press-start text-sm uppercase tracking-tight">Оплата серій</h2>
              <button type="button" onClick={() => setPaymentFormOpen(false)} className="p-2 text-black/60 hover:text-black" aria-label="Закрити">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handlePayment} className="p-5 space-y-4">
              <div>
                <label htmlFor="pay-name" className="block text-xs font-medium text-black/80 mb-1">Ім&apos;я *</label>
                <input id="pay-name" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Ваше ім'я" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-phone" className="block text-xs font-medium text-black/80 mb-1">Телефон *</label>
                <input id="pay-phone" type="tel" value={formPhone} onChange={(e) => setFormPhone(formatPhone(e.target.value))} required placeholder="+380 (__) ___-__-__" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-telegram" className="block text-xs font-medium text-black/80 mb-1">Telegram *</label>
                <input id="pay-telegram" type="text" value={formTelegram} onChange={(e) => setFormTelegram(e.target.value.replace(/[^@a-zA-Z0-9_]/g, ''))} required placeholder="@username" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-email" className="block text-xs font-medium text-black/80 mb-1">Email *</label>
                <input id="pay-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="email@example.com" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-birth" className="block text-xs font-medium text-black/80 mb-1">Дата народження *</label>
                <input id="pay-birth" type="date" value={formBirth} onChange={(e) => setFormBirth(e.target.value)} required className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-city" className="block text-xs font-medium text-black/80 mb-1">Місто *</label>
                <input id="pay-city" type="text" value={formCity} onChange={(e) => setFormCity(e.target.value)} required placeholder="Київ" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <p className="text-xs text-black/50">Разом: {totalPrice} грн · Серії: {Array.from(selectedPaid).join(', ')}</p>
              <button
                type="submit"
                disabled={paymentSending}
                className="w-full min-h-[52px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentSending ? 'Обробка…' : 'Перейти до оплати (Monobank)'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </main>
  )
}
