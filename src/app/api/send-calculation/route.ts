import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_CALC_BOT_TOKEN ?? '8420828581:AAFBhs_MUXUBko-hJvXrXnf7pz-c5v3QFJM'
const CHAT_ID = process.env.TELEGRAM_CALC_CHAT_ID ?? '394324901'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body as { text?: string }
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
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
