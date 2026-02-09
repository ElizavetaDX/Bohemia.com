import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { Resend } from 'resend'

const POLYTSIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4tykOXen-Ft-pCxTVHHPNggn7BgyKyhhAwhlYBYraE61lo7xfC5uQIMJ-5W8D_UYEIQ/exec'
const POLYTSIA_WEBHOOK = process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL || POLYTSIA_SCRIPT_URL
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.POLYTSIA_FROM_EMAIL ?? 'onboarding@resend.dev'

function isRuEmail(email: string): boolean {
  const lower = email.trim().toLowerCase()
  return lower.endsWith('.ru') || /@[^.]+\.ru(\s|$)/i.test(lower)
}

export async function POST(request: Request) {
  if (!process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL) {
    console.error('[request-guide] POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL не задано. Додайте змінну в Vercel Environment Variables.')
  }
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY не налаштовано' },
      { status: 500 }
    )
  }

  let body: { name?: string; email?: string; guideSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const guideSlug = String(body.guideSlug ?? '').trim()

  if (!name || !email || !guideSlug) {
    return NextResponse.json(
      { error: "Заповніть ім'я, email та оберіть гайд" },
      { status: 400 }
    )
  }

  if (isRuEmail(email)) {
    return NextResponse.json(
      { error: 'Поштові скрині з доменом .ru не приймаються.' },
      { status: 400 }
    )
  }

  let rowIndex: number | null = null

  try {
    const appendRes = await fetch(POLYTSIA_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    if (!appendRes.ok) {
      const text = await appendRes.text()
      console.error('[request-guide] Таблиця відповіла:', appendRes.status, text.slice(0, 300))
      return NextResponse.json(
        { error: `Таблиця відповіла ${appendRes.status}. Перевірте URL скрипта та логи.` },
        { status: 502 }
      )
    }
    try {
      const appendData = await appendRes.json()
      if (typeof appendData?.rowIndex === 'number' && appendData.rowIndex >= 2) {
        rowIndex = appendData.rowIndex
      }
    } catch {
      // Скрипт міг повернути не JSON
    }
  } catch (e) {
    console.error('[request-guide] Помилка запису в таблицю:', e)
    return NextResponse.json(
      { error: 'Помилка запису в таблицю. Перевірте POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL та логи.' },
      { status: 502 }
    )
  }

  const pdfPath = path.join(process.cwd(), 'public', 'guides', `${guideSlug}.pdf`)
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await readFile(pdfPath)
  } catch {
    return NextResponse.json(
      { error: 'PDF-файл для цього гайду відсутній' },
      { status: 404 }
    )
  }

  const resend = new Resend(RESEND_API_KEY)
  const subject = `Гайд: ${guideSlug}`
  const sent = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject,
    html: `<p>Привіт, ${name}!</p><p>Ось твій гайд у додатку. Якщо вкладка не відкрилась — перевір папку «Спам».</p><p>Богеміка</p>`,
    attachments: [
      {
        filename: `${guideSlug}.pdf`,
        content: pdfBuffer,
      },
    ],
  })

  if (sent.error) {
    return NextResponse.json(
      { error: sent.error.message ?? 'Помилка відправки листа' },
      { status: 502 }
    )
  }

  if (rowIndex != null) {
    try {
      await fetch(POLYTSIA_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          rowIndex,
          status: 'отправлен',
        }),
      })
    } catch {
      // Запис у таблицю вже є, лист відправлено
    }
  }

  return NextResponse.json({ ok: true })
}
