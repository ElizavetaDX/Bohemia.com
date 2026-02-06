import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_SERIES_CODE_BOT_TOKEN ?? process.env.TELEGRAM_CALC_BOT_TOKEN
const CHAT_ID = process.env.SERIES_TELEGRAM_CHAT_ID ?? '8420828581'

const TEST_CODE = '1234'

export async function POST(request: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: 'TELEGRAM_SERIES_CODE_BOT_TOKEN not configured' },
      { status: 500 }
    )
  }
  try {
    const body = await request.json()
    const { phone } = body as { phone?: string }
    const normalized = typeof phone === 'string' ? phone.replace(/\D/g, '') : ''
    if (normalized.length < 10) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
    }

    const displayPhone = phone?.trim() || `+${normalized}`
    const text = `Код для входу [${displayPhone}]: ${TEST_CODE}`

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    })
    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
