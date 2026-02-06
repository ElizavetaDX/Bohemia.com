import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_LEARN_CHAT_ID ?? process.env.TELEGRAM_CALC_CHAT_ID ?? '394324901'

export async function POST(request: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN not configured' },
      { status: 500 }
    )
  }
  try {
    const body = await request.json()
    const { course, name, phone, email, telegram } = body as {
      course?: string
      name?: string
      phone?: string
      email?: string
      telegram?: string
    }
    if (!course?.trim() || !name?.trim() || !phone?.trim() || !email?.trim() || !telegram?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: course, name, phone, email, telegram' },
        { status: 400 }
      )
    }

    const text = [
      '🎓 НОВА ЗАЯВКА НА НАВЧАННЯ 📍',
      '',
      `Напрямок: ${course.trim()}`,
      `👤 Ім'я: ${name.trim()}`,
      `📞 Телефон: ${phone.trim()}`,
      `📧 Email: ${email.trim()}`,
      `✈️ Telegram: @${telegram.trim().replace(/^@/, '')}`,
    ].join('\n')

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
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
