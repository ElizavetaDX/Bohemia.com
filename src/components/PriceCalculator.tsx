'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'

const ANIMATION_OPTIONS = [
  { id: 'frame_revival', label: 'Оживлення кадру (до 3х кадрів)', price: 4000 },
  { id: 'rotation_360', label: 'Обертання 360 градусів', price: 2500 },
] as const

const VISUALIZATION_TIERS = [
  { id: 'base', label: 'Базова', price: 2500, items: '3D лого, пакет, коробка, футболка, легінси та ін.' },
  { id: 'medium', label: 'Середня', price: 4000, items: 'сукня, спідниця, брюки, худі, обручки та ін.' },
  { id: 'complex', label: 'Складна', price: 6000, items: 'флакон, пальто, косуха, вечерня сукня, корсет та ін.' },
  { id: 'premium', label: 'Преміум', price: 12000, items: 'окуляри, сумочка, ювелірні вироби, меблі, їжа' },
  { id: 'exclusive', label: 'Ексклюзив', price: 20000, items: "взуття, хутро, пір'я, складні годинники" },
] as const

const SCENE_OPTIONS = [
  { id: 'base', label: 'Базова', price: 0, items: 'однотонний фон, пуста кімната, без фону' },
  { id: 'standard', label: 'Стандарт', price: 2000, items: 'рослини, аватар, телефон, телевізор' },
  { id: 'complex', label: 'Складна', price: 4000, items: 'місто, ліс, дощ, вогонь, транспорт, рідини' },
  { id: 'large', label: 'Масштабна', price: 10000, items: 'сцена з великою кількістю об\'єктів' },
] as const

const STATIC_AI_OPTIONS = [
  { id: 'realistic_image', label: 'Концептуальне зображення', price: 2000 },
  { id: 'extra_frame_concept', label: 'Додатковий кадр концепт', price: 1000 },
  { id: 'extra_frame_angle', label: 'Додатковий кадр ракурс', price: 500 },
  { id: 'ai_avatar_snaps', label: 'Снепи ai-аватару', price: 3500 },
] as const

const CG_OPTIONS = [
  { id: '5-7', label: '5–7 сек', price: 9600 },
  { id: '8-12', label: '8–12 сек', price: 14400 },
  { id: '13-20', label: '13–20 сек', price: 19200 },
] as const

const VFX_OPTIONS = [
  { id: '5-7', label: '5–7 сек', price: 12000 },
  { id: '8-12', label: '8–12 сек', price: 17280 },
  { id: '13-20', label: '13–20 сек', price: 23000 },
] as const

type AnimationId = (typeof ANIMATION_OPTIONS)[number]['id']
type VizId = (typeof VISUALIZATION_TIERS)[number]['id']
type SceneId = (typeof SCENE_OPTIONS)[number]['id']
type CgId = (typeof CG_OPTIONS)[number]['id'] | ''
type VfxId = (typeof VFX_OPTIONS)[number]['id'] | ''

const cardBase = 'border border-black rounded-lg p-3 min-h-[44px] flex flex-col justify-center text-left transition-colors cursor-pointer '
const cardActive = 'bg-black text-white'
const cardInactive = 'bg-white text-black hover:bg-black/5'

export function PriceCalculator() {
  const [open, setOpen] = useState(false)
  const [animation, setAnimation] = useState<AnimationId | null>(null)
  const [visualization, setVisualization] = useState<VizId | null>(null)
  const [scene, setScene] = useState<SceneId | null>(null)
  const [staticAi, setStaticAi] = useState<Set<string>>(new Set())
  const [cg, setCg] = useState<CgId>('')
  const [vfx, setVfx] = useState<VfxId>('')
  const [name, setName] = useState('')
  const [telegram, setTelegram] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [showImportant, setShowImportant] = useState(false)
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

  const toggleStaticAi = useCallback((id: string) => {
    setStaticAi((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const mainTotal = useMemo(() => {
    const a = animation ? ANIMATION_OPTIONS.find((o) => o.id === animation)?.price ?? 0 : 0
    const v = visualization ? VISUALIZATION_TIERS.find((t) => t.id === visualization)?.price ?? 0 : 0
    const s = scene ? SCENE_OPTIONS.find((o) => o.id === scene)?.price ?? 0 : 0
    return a + v + s
  }, [animation, visualization, scene])

  const staticAiTotal = useMemo(
    () => STATIC_AI_OPTIONS.filter((o) => staticAi.has(o.id)).reduce((sum, o) => sum + o.price, 0),
    [staticAi]
  )
  const cgPrice = useMemo(() => (cg ? CG_OPTIONS.find((o) => o.id === cg)?.price ?? 0 : 0), [cg])
  const vfxPrice = useMemo(() => (vfx ? VFX_OPTIONS.find((o) => o.id === vfx)?.price ?? 0 : 0), [vfx])
  const total = mainTotal + staticAiTotal + cgPrice + vfxPrice

  const buildMessage = useCallback(() => {
    const lines: string[] = [
      '👤 <b>Дані клієнта:</b>',
      '',
      `Ім'я: ${name.trim()}`,
      `Telegram: @${telegram.trim().replace(/^@/, '')}`,
      `Номер телефону: ${phone.trim() ? phone.trim() : 'не вказано'}`,
      `Коментар: ${comment.trim() ? comment.trim() : 'не вказано'}`,
      '',
      '📊 <b>Основні послуги (Анімація / Візуалізація):</b>',
      '',
    ]
    if (animation) {
      const o = ANIMATION_OPTIONS.find((x) => x.id === animation)!
      lines.push(`Анімація: ${o.label} — ${o.price} грн`)
    }
    if (visualization) {
      const t = VISUALIZATION_TIERS.find((x) => x.id === visualization)!
      lines.push(`Візуалізація: ${t.label} — ${t.price} грн`)
    }
    if (scene) {
      const o = SCENE_OPTIONS.find((x) => x.id === scene)!
      lines.push(`Сцена: ${o.label} — ${o.price} грн`)
    }
    if (cg) {
      const o = CG_OPTIONS.find((x) => x.id === cg)!
      lines.push(`CG анімація: ${o.label} — ${o.price} грн`)
    }
    if (vfx) {
      const o = VFX_OPTIONS.find((x) => x.id === vfx)!
      lines.push(`VFX симуляція: ${o.label} — ${o.price} грн`)
    }
    if (staticAi.size > 0) {
      lines.push('', '📸 <b>Static & AI:</b>', '')
      STATIC_AI_OPTIONS.filter((o) => staticAi.has(o.id)).forEach((o) => {
        lines.push(`${o.label} — ${o.price} грн`)
      })
    }
    lines.push('', `<b>РАЗОМ: ${total} грн</b>`)
    return lines.join('\n')
  }, [name, telegram, phone, comment, animation, visualization, scene, cg, vfx, staticAi, total])

  const hasTrinitySelection = Boolean(animation || visualization || scene)
  const bundleComplete = !hasTrinitySelection || (Boolean(animation) && visualization !== null && scene !== null)
  const showBundleMessage = hasTrinitySelection && !bundleComplete
  const canSend =
    total > 0 &&
    name.trim().length > 0 &&
    telegram.trim().replace(/^@/, '').length > 0 &&
    bundleComplete

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
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch pt-[5px] pb-[5px]">
          <div aria-hidden />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="min-h-[52px] px-8 py-4 bg-black text-white font-medium uppercase tracking-widest rounded-lg border-2 border-black transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Розрахувати вартість проекту
          </button>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowImportant((prev) => !prev)}
              className="min-h-[52px] px-6 py-4 bg-red-600 text-white font-bold uppercase tracking-widest rounded-lg border border-black transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-expanded={showImportant}
            >
              Важливо
            </button>
          </div>
        </div>

        {showImportant && (
          <div className="mt-4 max-w-2xl mx-auto text-center border border-black rounded-lg px-4 py-3 bg-white">
            <p className="text-sm md:text-base text-black leading-relaxed">
              Щоб порахувати вартість проекту з 3D анімацією скористайтеся, будь ласка, формулою:{' '}
              <span className="font-bold underline">Анімація + Візуалізація + Сцена</span>.
            </p>
          </div>
        )}

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
            <div className="flex items-center justify-between flex-shrink-0 border-b border-black/20 px-4 py-3 bg-white/90">
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

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-8">
              {/* Анімація — клік знімає вибір */}
              <div
                className={`rounded-lg p-3 transition-shadow ${
                  hasTrinitySelection && !animation ? 'ring-2 ring-red-400 ring-offset-2 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''
                }`}
              >
                <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${hasTrinitySelection && !animation ? 'text-red-600' : 'text-black/60'}`}>Анімація</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ANIMATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnimation((prev) => (prev === opt.id ? null : opt.id))}
                      className={`${cardBase} ${animation === opt.id ? cardActive : cardInactive}`}
                    >
                      <span className="font-medium text-sm">{opt.label}</span>
                      <span className="text-xs opacity-80 mt-0.5">{opt.price} грн</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Візуалізація — обов'язкова при виборі з трійці */}
              <div
                className={`rounded-lg p-3 transition-shadow ${
                  hasTrinitySelection && !visualization ? 'ring-2 ring-red-400 ring-offset-2 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''
                }`}
              >
                <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${hasTrinitySelection && !visualization ? 'text-red-600' : 'text-black/60'}`}>Візуалізація</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VISUALIZATION_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setVisualization((prev) => (prev === tier.id ? null : tier.id))}
                      className={`${cardBase} ${visualization === tier.id ? cardActive : cardInactive}`}
                    >
                      <span className="font-medium text-sm">{tier.label} — {tier.price} грн</span>
                      <span className="text-xs opacity-80 mt-0.5 line-clamp-2">{tier.items}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Сцена — обов'язкова при виборі з трійці */}
              <div
                className={`rounded-lg p-3 transition-shadow ${
                  hasTrinitySelection && !scene ? 'ring-2 ring-red-400 ring-offset-2 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''
                }`}
              >
                <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${hasTrinitySelection && !scene ? 'text-red-600' : 'text-black/60'}`}>Сцена</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SCENE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setScene((prev) => (prev === opt.id ? null : opt.id))}
                      className={`${cardBase} ${scene === opt.id ? cardActive : cardInactive}`}
                    >
                      <span className="font-medium text-sm">{opt.label} {opt.price > 0 ? `— ${opt.price} грн` : '(0 грн)'}</span>
                      <span className="text-xs opacity-80 mt-0.5 line-clamp-2">{opt.items}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Static & AI */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60 mb-3">Static & AI</h3>
                <div className="space-y-2">
                  {STATIC_AI_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleStaticAi(opt.id)}
                      className={`w-full ${cardBase} ${staticAi.has(opt.id) ? cardActive : cardInactive}`}
                    >
                      <span className="font-medium text-sm">{opt.label}</span>
                      <span className="text-xs opacity-80 mt-0.5">{opt.price} грн</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CG та VFX */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60 mb-3">CG анімація та VFX</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-black/50 mb-1">CG анімація</p>
                    <div className="flex flex-wrap gap-1">
                      {CG_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCg(cg === opt.id ? '' : opt.id)}
                          className={`min-h-[40px] px-3 rounded border border-black text-xs font-medium transition-colors ${cg === opt.id ? cardActive : cardInactive}`}
                        >
                          {opt.label} — {opt.price}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">VFX симуляція</p>
                    <div className="flex flex-wrap gap-1">
                      {VFX_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setVfx(vfx === opt.id ? '' : opt.id)}
                          className={`min-h-[40px] px-3 rounded border border-black text-xs font-medium transition-colors ${vfx === opt.id ? cardActive : cardInactive}`}
                        >
                          {opt.label} — {opt.price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Контактні дані */}
              <div className="space-y-4">
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
            <div className="flex-shrink-0 border-t border-black/20 px-4 py-4 bg-white/90">
              {showBundleMessage && (
                <p className="text-sm text-red-600 font-medium mb-3" role="alert">
                  Для цього типу замовлення необхідно обрати Анімацію, Візуалізацію та Сцену.
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className="text-xl font-bold text-black tabular-nums">
                  Разом: <span className="font-press-start">{total.toLocaleString('uk-UA')} грн</span>
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
