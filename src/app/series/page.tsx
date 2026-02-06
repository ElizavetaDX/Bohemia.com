'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileMenu } from '@/components/MobileMenu'
import { trackViewContent, trackLead, trackPurchase } from '@/components/AnalyticsPixels'
import { EPISODES } from '@/data/seriesData'

const TEST_CODE = '1234'

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

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

const SERIES_STORAGE_KEY = 'series_phone'
const GAS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL ?? 'https://script.google.com/macros/s/AKfycbyzseseX6QceafpvnpLvPcLv-xqLGmTH1CK1CLONvS9iOnbhTloKoAvmUh1WYiuQ8bKvQ/exec'

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 15)
  if (!digits) return ''
  if (digits.startsWith('7') && digits.length <= 11) {
    if (digits.length <= 1) return `+${digits}`
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
  }
  let d = digits
  if (d.startsWith('0') && d.length === 10) d = '380' + d
  if (d.startsWith('380')) {
    if (d.length <= 3) return `+${d}`
    if (d.length <= 6) return `+${d.slice(0, 3)} (${d.slice(3)}`
    if (d.length <= 8) return `+${d.slice(0, 3)} (${d.slice(3, 6)}) ${d.slice(6)}`
    return `+${d.slice(0, 3)} (${d.slice(3, 6)}) ${d.slice(6, 8)}-${d.slice(8, 10)}-${d.slice(10, 12)}`
  }
  if (d.length <= 4) return `+${d}`
  if (d.length <= 7) return `+${d.slice(0, 3)} ${d.slice(3)}`
  return `+${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
}

const isPhoneBlocked = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('7') && digits.length >= 10
}

export default function SeriesPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [playerEpisode, setPlayerEpisode] = useState<number | null>(null)
  const [paymentFormOpen, setPaymentFormOpen] = useState(false)
  const [selectedPaid, setSelectedPaid] = useState<Set<number>>(new Set())
  const [accessPhones, setAccessPhones] = useState<Set<string>>(new Set())
  const [loggedPhoneDisplay, setLoggedPhoneDisplay] = useState<string | null>(null)
  const [loginPhone, setLoginPhone] = useState('')
  const [authStep, setAuthStep] = useState<'phone' | 'code'>('phone')
  const [authCode, setAuthCode] = useState('')
  const [loginChecking, setLoginChecking] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const [toast, setToast] = useState<{ msg: string } | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [paymentSending, setPaymentSending] = useState(false)
  const watermarkRef = useRef<HTMLDivElement>(null)

  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formTelegram, setFormTelegram] = useState('')
  const [formEmail, setFormEmail] = useState('')

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
    try {
      const saved = localStorage.getItem(SERIES_STORAGE_KEY)
      if (saved && saved.replace(/\D/g, '').length >= 10) {
        setAccessPhones((p) => new Set(p).add(saved.replace(/\D/g, '')))
        setLoggedPhoneDisplay(saved)
      }
    } catch {
      /* ignore */
    }
  }, [])

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
      return !!data?.allowed
    } catch {
      return false
    }
  }, [])

  const isAuthorized = accessPhones.size > 0
  const [hasAccessCache, setHasAccessCache] = useState<boolean>(false)
  useEffect(() => {
    if (!isAuthorized || !loggedPhoneDisplay) {
      setHasAccessCache(false)
      return
    }
    checkAccess(loggedPhoneDisplay).then(setHasAccessCache)
  }, [isAuthorized, loggedPhoneDisplay, checkAccess])

  const handleRequestCode = useCallback(async () => {
    const normalized = loginPhone.replace(/\D/g, '')
    if (normalized.length < 10) return
    setLoginChecking(true)
    try {
      const res = await fetch('/api/series/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone }),
      })
      if (res.ok) setAuthStep('code')
    } finally {
      setLoginChecking(false)
    }
  }, [loginPhone])

  const handleVerifyCode = useCallback(() => {
    if (authCode.trim() !== TEST_CODE) return
    const normalized = loginPhone.replace(/\D/g, '')
    setAccessPhones((p) => new Set(p).add(normalized))
    setLoggedPhoneDisplay(loginPhone)
    try {
      localStorage.setItem(SERIES_STORAGE_KEY, loginPhone)
    } catch {
      /* ignore */
    }
    setAuthStep('phone')
    setAuthCode('')
    setLoginPhone('')
    checkAccess(loginPhone).then(setHasAccessCache)
  }, [authCode, loginPhone, checkAccess])

  const handleLogout = () => {
    setAccessPhones(new Set())
    setLoggedPhoneDisplay(null)
    try {
      localStorage.removeItem(SERIES_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const handleOpenPlayer = (episodeId: number) => {
    const ep = EPISODES.find((e) => e.id === episodeId)
    if (!ep || ep.status !== 'FREE') return
    setUserEmail('guest')
    setPlayerEpisode(episodeId)
    setPlayerOpen(true)
  }

  const handleAddToCart = (ep: { id: number; title: string }) => {
    if (selectedPaid.has(ep.id)) return
    setSelectedPaid((p) => new Set(p).add(ep.id))
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 300)
    setToast({ msg: `Серія ${ep.id} додана до кошика` })
    setTimeout(() => setToast(null), 2500)
  }

  const handlePaidClick = (ep: { id: number }) => {
    if (!isAuthorized) {
      handleAddToCart(ep)
      return
    }
    if (!hasAccessCache) {
      handleAddToCart(ep)
      return
    }
    const email = userEmail && userEmail !== 'guest' ? userEmail : undefined
    setUserEmail(email ?? (prompt('Email або нік для водяного знаку:') || (loggedPhoneDisplay ?? 'user')))
    setPlayerEpisode(ep.id)
    setPlayerOpen(true)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPaid.size === 0) return
    if (isPhoneBlocked(formPhone)) return
    setPaymentSending(true)
    try {
      const totalPrice = Array.from(selectedPaid).reduce((s, id) => s + (EPISODES.find((e) => e.id === id)?.price ?? 0), 0)
      await fetch(GAS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'create_lead',
          name: formName,
          phone: formPhone.replace(/\D/g, ''),
          telegram: formTelegram,
          email: formEmail,
          seriesId: Array.from(selectedPaid),
          amount: totalPrice,
        }),
      })
      setToast({ msg: 'Заявка прийнята' })
      setTimeout(() => setToast(null), 4000)
      setPaymentFormOpen(false)
      setSelectedPaid(new Set())
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (typeof window !== 'undefined') alert(`Помилка:\n\n${msg}`)
    } finally {
      setPaymentSending(false)
    }
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
          <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-6">ХХ — Мультсеріал</h1>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            {isAuthorized ? (
              <>
                <span className="text-sm text-black/70">Увійшов: {loggedPhoneDisplay ?? '+380…'}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors"
                >
                  Вийти
                </button>
              </>
            ) : authStep === 'code' ? (
              <>
                <p className="text-sm text-black/70 w-full">Код відправлено в Telegram</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Код"
                  className="min-h-[36px] w-24 px-3 rounded border border-black/20 bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={authCode.length < 4}
                  className="min-h-[36px] px-4 rounded bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Підтвердити
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthStep('phone'); setAuthCode('') }}
                  className="text-xs text-black/50 hover:text-black"
                >
                  Змінити номер
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-black/70 w-full">Вже купили серію? Введіть номер телефону для доступу</p>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(formatPhone(e.target.value))}
                  placeholder="+380 (__) ___-__-__"
                  className="min-h-[36px] w-full max-w-xs sm:w-72 px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={loginChecking || loginPhone.replace(/\D/g, '').length < 10}
                  className="min-h-[36px] px-4 rounded bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loginChecking ? 'Відправка…' : 'Отримати код'}
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {EPISODES.map((ep) => (
              <div
                key={ep.id}
                className={`relative rounded-xl overflow-hidden border transition-all bg-white ${
                  ep.status === 'SOON'
                    ? 'border-black/10 grayscale opacity-70'
                    : 'border-black/20 hover:border-red-500/50'
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
                      onClick={() =>
                        isAuthorized && hasAccessCache
                          ? handlePaidClick(ep)
                          : handleAddToCart(ep)
                      }
                      className={`mt-2 w-full py-2 px-3 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors ${
                        isAuthorized && hasAccessCache
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'border border-black/20 text-black/80 hover:border-red-500 hover:text-red-600'
                      }`}
                    >
                      {isAuthorized && hasAccessCache ? 'ДИВИТИСЬ' : 'ДОДАТИ ДО КОШИКА'}
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
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-black/10 shadow-sm">
              <span className="text-black/90">
                Обрано серій: {selectedPaid.size} · Разом: <strong>{totalPrice} грн</strong>
              </span>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium uppercase tracking-widest rounded-lg transition-colors"
              >
                ОФОРМИТИ ЗАМОВЛЕННЯ
              </button>
            </div>
          )}
          </div>
      </section>

      </main>

      {/* Floating Cart - outside main to avoid position override from bg-dots-pattern */}
      <motion.button
        type="button"
        onClick={() => setCartDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-black/80 backdrop-blur-md text-white shadow-lg flex items-center justify-center hover:bg-black/90 transition-colors border border-white/10"
        aria-label="Кошик"
        animate={{ scale: cartBounce ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <CartIcon />
        {selectedPaid.size > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
            {selectedPaid.size}
          </span>
        )}
      </motion.button>

      {/* Cart Side Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[95] w-full max-w-md bg-white shadow-xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
                <h2 className="font-press-start text-sm uppercase">Кошик</h2>
                <button type="button" onClick={() => setCartDrawerOpen(false)} className="p-2 text-black/60 hover:text-black" aria-label="Закрити">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {selectedPaid.size === 0 ? (
                  <p className="text-black/50 text-sm">Ваш кошик порожній</p>
                ) : (
                  <ul className="space-y-3">
                    {Array.from(selectedPaid).map((id) => {
                      const ep = EPISODES.find((e) => e.id === id)
                      return (
                        <li key={id} className="flex items-center justify-between py-2 border-b border-black/5">
                          <span className="text-sm">{ep?.title ?? `Серія ${id}`}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{ep?.price ?? 0} грн</span>
                            <button
                              type="button"
                              onClick={() => setSelectedPaid((p) => { const n = new Set(p); n.delete(id); return n })}
                              className="text-black/40 hover:text-red-600 text-xs"
                            >
                              Видалити
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              {selectedPaid.size > 0 && (
                <div className="p-5 border-t border-black/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-black/70">Разом:</span>
                    <span className="text-lg font-bold">{totalPrice} грн</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCartDrawerOpen(false); setPaymentFormOpen(true) }}
                    className="w-full min-h-[52px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium uppercase tracking-widest rounded-lg transition-colors"
                  >
                    ОФОРМИТИ ЗАМОВЛЕННЯ
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-24 right-6 z-[60] px-4 py-3 rounded-lg bg-black text-white text-sm shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

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
              {(() => {
                const w = loggedPhoneDisplay || userEmail || 'guest'
                return (
                  <>
                    <div className="absolute top-[15%] left-[10%] text-white/15 text-xl font-mono whitespace-nowrap animate-watermark-chaos-1">{w}</div>
                    <div className="absolute top-[60%] right-[15%] text-white/12 text-lg font-mono whitespace-nowrap animate-watermark-chaos-2">{w}</div>
                    <div className="absolute top-[35%] left-[40%] text-white/10 text-2xl font-mono whitespace-nowrap animate-watermark-chaos-3">{w}</div>
                    <div className="absolute bottom-[25%] left-[20%] text-white/12 text-base font-mono whitespace-nowrap animate-watermark-chaos-1" style={{ animationDelay: '-2s' }}>{w}</div>
                  </>
                )
              })()}
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
                <input id="pay-phone" type="tel" value={formPhone} onChange={(e) => setFormPhone(formatPhone(e.target.value))} required placeholder="+380 або інший код країни" className={`w-full min-h-[44px] px-3 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-red-500 ${isPhoneBlocked(formPhone) ? 'border-red-500 bg-red-50/50' : 'border-black/20 bg-white text-black placeholder:text-black/40'}`} />
                {isPhoneBlocked(formPhone) && (
                  <p className="mt-1 text-xs text-red-600">Реєстрація з цього регіону неможлива</p>
                )}
              </div>
              <div>
                <label htmlFor="pay-telegram" className="block text-xs font-medium text-black/80 mb-1">Telegram *</label>
                <input id="pay-telegram" type="text" value={formTelegram} onChange={(e) => setFormTelegram(e.target.value.replace(/[^@a-zA-Z0-9_]/g, ''))} required placeholder="@username" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <div>
                <label htmlFor="pay-email" className="block text-xs font-medium text-black/80 mb-1">Email *</label>
                <input id="pay-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="email@example.com" className="w-full min-h-[44px] px-3 rounded border border-black/20 bg-white text-black placeholder:text-black/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
              </div>
              <p className="text-xs text-black/50">Разом: {totalPrice} грн · Серії: {Array.from(selectedPaid).join(', ')}</p>
              <button
                type="submit"
                disabled={paymentSending || isPhoneBlocked(formPhone)}
                className="w-full min-h-[52px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentSending ? 'Обробка…' : 'Перейти до оплати (Monobank)'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </>
  )
}
