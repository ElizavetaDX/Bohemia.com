'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  SHI_STAGE1,
  SHI_STAGE2,
  VISUALIZATION,
  SCENE,
  CG,
  VFX,
  formatPriceDisplay,
} from '@/data/priceData'

type ShiStage2Id = (typeof SHI_STAGE2)[number]['id'] | null
type VizId = (typeof VISUALIZATION)[number]['id'] | null
type SceneId = (typeof SCENE)[number]['id'] | null
type CgId = (typeof CG)[number]['id'] | ''
type VfxId = (typeof VFX)[number]['id'] | ''

const cardBase = 'border border-black rounded-lg p-2.5 min-h-[40px] flex flex-col justify-center text-left transition-colors cursor-pointer '
const labelClass = 'font-medium text-xs break-words tracking-tight leading-snug'
const cardActive = 'bg-black text-white'
const cardInactive = 'bg-white text-black hover:bg-black/5'

export function PriceCalculator() {
  const [open, setOpen] = useState(false)
  const [consultation, setConsultation] = useState(false)
  const [shiStage1, setShiStage1] = useState<Set<string>>(new Set())
  const [shiStage2, setShiStage2] = useState<ShiStage2Id>(null)
  const [visualization, setVisualization] = useState<VizId>(null)
  const [scene, setScene] = useState<SceneId>(null)
  const [cg, setCg] = useState<CgId>('')
  const [vfx, setVfx] = useState<VfxId>('')
  const [name, setName] = useState('')
  const [telegram, setTelegram] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const notesItems = [
    'базовий пакет візуалізації включає 10 фото-рендерів в різних ракурсах/кольорах(до 3х)/позах/з різним фоном',
    'кожен додатковий рендер 50 грн (мінімальне замовлення 5 шт/1 колір)',
    "3D об'єкт залишається з вами назавжди і може бути використаний в подальшому для креативів та анімацій",
    'в прайсі вказана орієнтовна середня ціна, кінцева озвучується після знайомства з вашим продуктом по фото/ескізу/референсу',
  ]

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [open])

  const toggleShiStage1 = useCallback((id: string) => {
    setShiStage1((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const shiStage1Total = useMemo(
    () => SHI_STAGE1.filter((o) => shiStage1.has(o.id)).reduce((sum, o) => sum + o.price, 0),
    [shiStage1]
  )
  const shiStage2Price = useMemo(
    () => (shiStage2 ? SHI_STAGE2.find((o) => o.id === shiStage2)?.price ?? 0 : 0),
    [shiStage2]
  )
  const vizPrice = useMemo(
    () => (visualization ? VISUALIZATION.find((o) => o.id === visualization)?.price ?? 0 : 0),
    [visualization]
  )
  const scenePrice = useMemo(
    () => (scene ? SCENE.find((o) => o.id === scene)?.price ?? 0 : 0),
    [scene]
  )
  const cgPrice = useMemo(() => (cg ? CG.find((o) => o.id === cg)?.price ?? 0 : 0), [cg])
  const vfxPrice = useMemo(() => (vfx ? VFX.find((o) => o.id === vfx)?.price ?? 0 : 0), [vfx])
  const total = shiStage1Total + shiStage2Price + vizPrice + scenePrice + cgPrice + vfxPrice

  const hasShiSelection = shiStage1.size > 0 || shiStage2 !== null
  const shiBundleComplete = !hasShiSelection || (shiStage1.size > 0 && shiStage2 !== null)
  const showShiWarning = hasShiSelection && !shiBundleComplete
  const shiNeedStage1 = shiStage2 !== null && shiStage1.size === 0
  const shiNeedStage2 = shiStage1.size > 0 && shiStage2 === null

  const buildMessage = useCallback(() => {
    const lines: string[] = [
      '👤 <b>Дані клієнта:</b>',
      '',
      `Ім'я: ${name.trim()}`,
      `Telegram: @${telegram.trim().replace(/^@/, '')}`,
      `Номер телефону: ${phone.trim() ? phone.trim() : 'не вказано'}`,
      `Коментар: ${comment.trim() ? comment.trim() : 'не вказано'}`,
      '',
      '📊 <b>Деталі розрахунку:</b>',
      '',
    ]
    if (consultation) {
      lines.push('3D Візуалізація — вартість уточнюється з менеджером: Індивідуально')
      lines.push('')
    }
    if (shiStage1.size > 0) {
      lines.push('ШІ, етап 1 (аі-фото):')
      SHI_STAGE1.filter((o) => shiStage1.has(o.id)).forEach((o) => {
        lines.push(`${o.label} — ${o.price} грн`)
      })
      lines.push('')
    }
    if (shiStage2) {
      const o = SHI_STAGE2.find((x) => x.id === shiStage2)!
      lines.push(`ШІ, етап 2: ${o.label} — ${o.price} грн`)
      lines.push('')
    }
    if (visualization) {
      const o = VISUALIZATION.find((x) => x.id === visualization)!
      lines.push(`Візуалізація: ${o.label} — ${o.price} грн`)
      lines.push('')
    }
    if (scene) {
      const o = SCENE.find((x) => x.id === scene)!
      lines.push(`Сцена: ${o.label} — ${o.price} грн`)
      lines.push('')
    }
    if (cg) {
      const o = CG.find((x) => x.id === cg)!
      lines.push(`CG анімація: ${o.label} — ${o.price} грн`)
    }
    if (vfx) {
      const o = VFX.find((x) => x.id === vfx)!
      lines.push(`VFX симуляція: ${o.label} — ${o.price} грн`)
    }
    const totalLine = consultation && total === 0
      ? '<b>РАЗОМ: Індивідуально</b>'
      : consultation && total > 0
        ? `<b>РАЗОМ: ${total.toLocaleString('uk-UA')} грн + консультація (індивідуально)</b>`
        : `<b>РАЗОМ: ${total.toLocaleString('uk-UA')} грн</b>`
    lines.push('', totalLine)
    return lines.join('\n')
  }, [name, telegram, phone, comment, consultation, shiStage1, shiStage2, visualization, scene, cg, vfx, total])

  const canSend =
    (total > 0 || consultation) &&
    name.trim().length > 0 &&
    telegram.trim().replace(/^@/, '').length > 0 &&
    shiBundleComplete

  const handleSend = async () => {
    if (!canSend) return
    setSending(true)
    setSent(false)
    try {
      const res = await fetch('/api/send-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: buildMessage() }),
      })
      if (res.ok) {
        setSent(true)
        setTimeout(() => setOpen(false), 1500)
      }
    } finally {
      setSending(false)
    }
  }

  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <section id="calculator" className="content-above-dots px-4 sm:px-6 md:px-12 py-4 md:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch pt-[20px] pb-[20px]">
          <div aria-hidden />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="min-h-[52px] px-8 py-4 bg-black text-white font-medium uppercase tracking-widest rounded-lg border-2 border-black transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Розрахувати вартість проекту
          </button>
          <div aria-hidden />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowNotes((prev) => !prev)}
            className="inline-flex items-center px-2 py-1 min-h-[48px] font-bold text-sm md:text-base text-black border-2 border-black transition-colors hover:bg-black hover:text-white rounded focus:outline-none focus:ring-2 focus:ring-black/30"
            aria-expanded={showNotes}
          >
            Умови та примітки
          </button>
        </div>
        {showNotes && (
          <div className="mt-3 max-w-2xl mx-auto font-content-mono text-sm md:text-base text-black leading-relaxed space-y-1 border border-black rounded-lg px-4 py-3 bg-white">
            {notesItems.map((line, i) => (
              <p key={i} className="break-words">
                {line}
              </p>
            ))}
          </div>
        )}

        {open && (
          <div
            ref={panelRef}
            className="mt-6 w-full max-w-2xl mx-auto flex flex-col rounded-xl border border-black/10 bg-white/80 shadow-2xl backdrop-blur-md overflow-hidden max-h-[85vh] min-h-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calc-modal-title"
          >
            <div className="flex items-center justify-between flex-shrink-0 border-b border-black/20 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/90">
              <h2 id="calc-modal-title" className="font-press-start text-sm md:text-lg uppercase tracking-tight text-black">
                Калькулятор вартості
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center gap-1.5 p-2 -m-2 text-black hover:bg-black/5 rounded focus:outline-none focus:ring-2 focus:ring-black/20"
                aria-label="Закрити"
              >
                <span className="text-xs font-medium uppercase tracking-wider">Закрити</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
              {/* ШІ */}
              <div>
                <div className="pl-3 border-l-4 border-black mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">ШІ</h3>
                </div>
                <div
                  className={`rounded-lg p-2.5 transition-shadow ${shiNeedStage1 ? 'ring-2 ring-red-400 ring-offset-2 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                >
                  <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${shiNeedStage1 ? 'text-red-600' : 'text-black/60'}`}>
                    Перший етап: аі-фото (кадр)
                  </h3>
                <div className="space-y-1.5">
                  {SHI_STAGE1.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleShiStage1(opt.id)}
                      className={`w-full ${cardBase} ${shiStage1.has(opt.id) ? cardActive : cardInactive}`}
                    >
                      <span className={labelClass}>{opt.label}</span>
                      <span className="text-xs opacity-80 mt-0.5">{formatPriceDisplay(opt.price)} грн</span>
                    </button>
                  ))}
                </div>
                </div>
                <div
                  className={`rounded-lg p-2.5 transition-shadow mt-4 ${shiNeedStage2 ? 'ring-2 ring-red-400 ring-offset-2 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                >
                  <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${shiNeedStage2 ? 'text-red-600' : 'text-black/60'}`}>
                    Другий етап: анімація, монтаж та озвучка аі-кадрів
                  </h3>
                  <div className="space-y-1.5">
                    {SHI_STAGE2.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setShiStage2((prev) => (prev === opt.id ? null : opt.id))}
                        className={`w-full ${cardBase} ${shiStage2 === opt.id ? cardActive : cardInactive}`}
                      >
                        <span className={labelClass}>{opt.label}</span>
                        <span className="text-xs opacity-80 mt-0.5">{formatPriceDisplay(opt.price)} грн</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Візуалізація */}
              <div>
                <div className="pl-3 border-l-4 border-black mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Візуалізація</h3>
                </div>
                <div className="space-y-1.5">
                  {VISUALIZATION.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisualization((prev) => (prev === opt.id ? null : opt.id))}
                      className={`w-full ${cardBase} ${visualization === opt.id ? cardActive : cardInactive}`}
                    >
                      <span className={labelClass}>{opt.label}</span>
                      <span className="text-xs opacity-80 mt-0.5">{formatPriceDisplay(opt.price, 'displayPlus' in opt && opt.displayPlus)} грн</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Сцена */}
              <div>
                <div className="pl-3 border-l-4 border-black mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Сцена</h3>
                </div>
                <div className="space-y-1.5">
                  {SCENE.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScene((prev) => (prev === opt.id ? null : opt.id))}
                      className={`w-full ${cardBase} ${scene === opt.id ? cardActive : cardInactive}`}
                    >
                      <span className={labelClass}>{opt.label}</span>
                      <span className="text-xs opacity-80 mt-0.5">{formatPriceDisplay(opt.price, 'displayPlus' in opt && opt.displayPlus)} грн</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Фізична симуляція: CG та VFX */}
              <div>
                <div className="pl-3 border-l-4 border-black mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Фізична симуляція</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-black/50 mb-1">CG анімація з фізичною симуляцією</p>
                    <div className="flex flex-wrap gap-1">
                      {CG.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCg(cg === opt.id ? '' : opt.id)}
                          className={`min-h-[40px] px-2.5 py-1.5 rounded border border-black text-xs font-medium tracking-tight transition-colors ${cg === opt.id ? cardActive : cardInactive}`}
                        >
                          {opt.label} — <span className="opacity-80">{formatPriceDisplay(opt.price)} грн</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">VFX з фізичною симуляцією</p>
                    <div className="flex flex-wrap gap-1">
                      {VFX.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setVfx(vfx === opt.id ? '' : opt.id)}
                          className={`min-h-[40px] px-2.5 py-1.5 rounded border border-black text-xs font-medium tracking-tight transition-colors ${vfx === opt.id ? cardActive : cardInactive}`}
                        >
                          {opt.label} — <span className="opacity-80">{formatPriceDisplay(opt.price)} грн</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D анімація — консультація (без змін) */}
              <div>
                <button
                  type="button"
                  onClick={() => setConsultation((prev) => !prev)}
                  className={`w-full ${cardBase} ${consultation ? cardActive : cardInactive}`}
                >
                  <span className={labelClass}>3D Візуалізація — вартість уточнюється з менеджером</span>
                  {consultation && <span className="text-xs opacity-80 mt-0.5">Індивідуально</span>}
                </button>
                <p className="mt-2.5 text-xs text-black/60 leading-relaxed max-w-xl">
                  Вартість 3D Візуалізації залежить від складності об&apos;єктів, кількості ракурсів та деталізації. Оберіть цей пункт, щоб отримати персональний прорахунок від менеджера.
                </p>
              </div>

              {/* Контактні дані */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Контактні дані</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="calc-name" className="block text-xs font-medium text-black mb-1">Ім&apos;я <span className="text-black/50">(обов&apos;язково)</span></label>
                    <input
                      id="calc-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введіть ваше ім'я"
                      className="w-full min-h-[44px] px-3 rounded border border-black bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="calc-telegram" className="block text-xs font-medium text-black mb-1">Telegram <span className="text-black/50">(обов&apos;язково)</span></label>
                    <input
                      id="calc-telegram"
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value.replace(/[^@a-zA-Z0-9_]/g, ''))}
                      placeholder="@username"
                      className="w-full min-h-[44px] px-3 rounded border border-black bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="calc-phone" className="block text-xs font-medium text-black mb-1">Номер телефону <span className="text-black/50">(необов&apos;язково)</span></label>
                    <input
                      id="calc-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+38 (0__) ___-__-__"
                      className="w-full min-h-[44px] px-3 rounded border border-black bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="calc-comment" className="block text-xs font-medium text-black mb-1">Коментар <span className="text-black/50">(необов&apos;язково)</span></label>
                    <textarea
                      id="calc-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Додаткова інформація до замовлення"
                      rows={2}
                      className="w-full min-h-[72px] px-3 py-2 rounded border border-black bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Фіксований блок з сумою та кнопкою */}
            <div className="flex-shrink-0 border-t border-black/20 px-3 sm:px-4 py-3 sm:py-4 bg-white/90">
              {showShiWarning && (
                <p className="text-sm text-red-600 font-medium mb-3" role="alert">
                  Для замовлення ШІ-генерації необхідно обрати і створення кадру (Етап 1), і його анімацію (Етап 2).
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-xl font-bold text-black tabular-nums">
                  Разом:{' '}
                  <span className="font-press-start">
                    {consultation && total === 0
                      ? 'Індивідуально'
                      : consultation && total > 0
                        ? `${total.toLocaleString('uk-UA')} грн + консультація`
                        : `${total.toLocaleString('uk-UA')} грн`}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend || sending}
                  className="min-h-[48px] px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-widest rounded-lg border border-black transition-colors hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Відправка…' : sent ? 'Відправлено' : 'Надіслати'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
