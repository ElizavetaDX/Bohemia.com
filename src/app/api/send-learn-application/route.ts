import { NextResponse } from 'next/server'

const LEARN_GOOGLE_URL = process.env.LEARN_GOOGLE_SHEET_WEBHOOK_URL
const BOT_TOKEN = process.env.TELEGRAM_LEARN_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: Request) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json(
      { error: 'TELEGRAM_LEARN_BOT_TOKEN or TELEGRAM_CHAT_ID not configured' },
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

    const formData = {
      course: course.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      telegram: telegram.trim().replace(/^@/, ''),
    }

    if (LEARN_GOOGLE_URL) {
      const sheetRes = await fetch(LEARN_GOOGLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!sheetRes.ok) {
        const errText = await sheetRes.text()
        return NextResponse.json(
          { error: `Таблиця: ${sheetRes.status}. ${errText.slice(0, 200)}` },
          { status: 502 }
        )
      }
    }

    const text = [
      '🎓 НОВА ЗАЯВКА НА НАВЧАННЯ 📍',
      '',
      `Напрямок: ${formData.course}`,
      `👤 Ім'я: ${formData.name}`,
      `📞 Телефон: ${formData.phone}`,
      `📧 Email: ${formData.email}`,
      `✈️ Telegram: @${formData.telegram}`,
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
