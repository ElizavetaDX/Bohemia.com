'use client'

import React, { useState, useMemo } from 'react'

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

export function PriceCalculator() {
  const [animation, setAnimation] = useState<AnimationId | null>(null)
  const [visualization, setVisualization] = useState<VizId | null>(null)
  const [scene, setScene] = useState<SceneId | null>(null)
  const [cg, setCg] = useState<CgId>('')
  const [vfx, setVfx] = useState<VfxId>('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const mainTotal = useMemo(() => {
    const a = animation ? ANIMATION_OPTIONS.find((o) => o.id === animation)?.price ?? 0 : 0
    const v = visualization ? VISUALIZATION_TIERS.find((t) => t.id === visualization)?.price ?? 0 : 0
    const s = scene ? SCENE_OPTIONS.find((o) => o.id === scene)?.price ?? 0 : 0
    return a + v + s
  }, [animation, visualization, scene])

  const cgPrice = useMemo(() => (cg ? CG_OPTIONS.find((o) => o.id === cg)?.price ?? 0 : 0), [cg])
  const vfxPrice = useMemo(() => (vfx ? VFX_OPTIONS.find((o) => o.id === vfx)?.price ?? 0 : 0), [vfx])
  const total = mainTotal + cgPrice + vfxPrice

  const buildMessage = () => {
    const lines: string[] = ['<b>Розрахунок вартості</b>', '']
    if (animation) {
      const o = ANIMATION_OPTIONS.find((x) => x.id === animation)!
      lines.push(`Анімація: ${o.label} — ${o.price} грн`)
    }
    if (visualization) {
      const t = VISUALIZATION_TIERS.find((x) => x.id === visualization)!
      lines.push(`Візуалізація: ${t.label} (${t.price} грн) — ${t.items}`)
    }
    if (scene) {
      const o = SCENE_OPTIONS.find((x) => x.id === scene)!
      lines.push(`Сцена: ${o.label} (${o.price} грн) — ${o.items}`)
    }
    if (cg) {
      const o = CG_OPTIONS.find((x) => x.id === cg)!
      lines.push(`CG анімація: ${o.label} — ${o.price} грн`)
    }
    if (vfx) {
      const o = VFX_OPTIONS.find((x) => x.id === vfx)!
      lines.push(`VFX симуляція: ${o.label} — ${o.price} грн`)
    }
    lines.push('', `<b>Разом: ${total} грн</b>`)
    return lines.join('\n')
  }

  const handleSend = async () => {
    if (total === 0) return
    setSending(true)
    setSent(false)
    try {
      const res = await fetch('/api/send-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: buildMessage() }),
      })
      if (res.ok) setSent(true)
    } finally {
      setSending(false)
    }
  }

  const cardBase = 'border-2 border-black rounded-lg p-4 min-h-[48px] flex flex-col justify-center text-left transition-colors cursor-pointer '
  const cardActive = 'bg-black text-white'
  const cardInactive = 'bg-white text-black hover:bg-black/5'

  return (
    <section id="calculator" className="content-above-dots px-4 sm:px-6 md:px-12 py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-press-start text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase mb-8 md:mb-10 text-black">
          Калькулятор вартості
        </h2>

        {/* Анімація */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-black/70 mb-4">Анімація</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ANIMATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAnimation(opt.id)}
                className={`${cardBase} ${animation === opt.id ? cardActive : cardInactive}`}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-sm opacity-80 mt-1">{opt.price} грн</span>
              </button>
            ))}
          </div>
        </div>

        {/* Візуалізація */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-black/70 mb-4">Візуалізація</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VISUALIZATION_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setVisualization(tier.id)}
                className={`${cardBase} ${visualization === tier.id ? cardActive : cardInactive}`}
              >
                <span className="font-medium">{tier.label} — {tier.price} грн</span>
                <span className="text-sm opacity-80 mt-1 line-clamp-2">{tier.items}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Сцена */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-black/70 mb-4">Сцена</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCENE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setScene(opt.id)}
                className={`${cardBase} ${scene === opt.id ? cardActive : cardInactive}`}
              >
                <span className="font-medium">{opt.label} {opt.price > 0 ? `— ${opt.price} грн` : '(0 грн)'}</span>
                <span className="text-sm opacity-80 mt-1 line-clamp-2">{opt.items}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CG анімація та VFX */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-black/70 mb-4">CG анімація та VFX</h3>
          <p className="text-sm text-black/60 mb-4">Окремо від основної формули</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-black/60 mb-2">CG анімація</p>
              <div className="flex flex-wrap gap-2">
                {CG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCg(cg === opt.id ? '' : opt.id)}
                    className={`min-h-[48px] px-4 rounded-lg border-2 border-black text-sm font-medium transition-colors ${cg === opt.id ? cardActive : cardInactive}`}
                  >
                    {opt.label} — {opt.price} грн
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-black/60 mb-2">VFX симуляція</p>
              <div className="flex flex-wrap gap-2">
                {VFX_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVfx(vfx === opt.id ? '' : opt.id)}
                    className={`min-h-[48px] px-4 rounded-lg border-2 border-black text-sm font-medium transition-colors ${vfx === opt.id ? cardActive : cardInactive}`}
                  >
                    {opt.label} — {opt.price} грн
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Итог + кнопка — живой счётчик и липкий блок на мобайле */}
        <div className="sticky bottom-0 left-0 right-0 z-40 md:static bg-white border-t border-black/10 md:border-0 pt-4 pb-6 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:shadow-none">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-2xl md:text-3xl font-bold text-black tabular-nums">
              Разом: <span className="font-press-start">{total.toLocaleString('uk-UA')} грн</span>
            </p>
            <button
              type="button"
              onClick={handleSend}
              disabled={total === 0 || sending}
              className="min-h-[52px] px-8 py-3 bg-black text-white font-medium uppercase tracking-widest rounded-lg transition-colors hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Відправка…' : sent ? 'Відправлено' : 'Надіслати розрахунок'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
