import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { Resend } from 'resend'

const POLYTSIA_WEBHOOK = process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.POLYTSIA_FROM_EMAIL ?? 'onboarding@resend.dev'

function isRuEmail(email: string): boolean {
  const lower = email.trim().toLowerCase()
  return lower.endsWith('.ru') || /@[^.]+\.ru(\s|$)/i.test(lower)
}

const SUBJECT = 'Твій гайд від BOHEMIQA STUDIO'

export async function POST(request: Request) {
  if (!POLYTSIA_WEBHOOK) {
    return NextResponse.json(
      { error: 'POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL не налаштовано' },
      { status: 500 }
    )
  }
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY не налаштовано' },
      { status: 500 }
    )
  }

  let body: { name?: string; email?: string; guideId?: string; guideSlug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Невалідний JSON' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const guideId = String(body.guideId ?? body.guideSlug ?? '').trim()

  if (!name || !email || !guideId) {
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

  let rowIndex: number

  try {
    const appendRes = await fetch(POLYTSIA_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'append',
        name,
        email,
        guideSlug: guideId,
      }),
    })
    if (!appendRes.ok) {
      const text = await appendRes.text()
      return NextResponse.json(
        { error: `Таблиця: ${appendRes.status}. ${text.slice(0, 200)}` },
        { status: 502 }
      )
    }
    const appendData = await appendRes.json()
    rowIndex = appendData?.rowIndex
    if (typeof rowIndex !== 'number' || rowIndex < 2) {
      return NextResponse.json(
        { error: 'Таблиця не повернула rowIndex' },
        { status: 502 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Помилка запису в таблицю' },
      { status: 502 }
    )
  }

  const pdfPath = path.join(process.cwd(), 'public', 'guides', `${guideId}.pdf`)
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
  const sent = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: SUBJECT,
    html: `<p>Привіт, ${name}!</p><p>Ось твій гайд у додатку. Якщо листа не бачиш — перевір папку «Спам».</p><p>BOHEMIQA STUDIO</p>`,
    attachments: [
      {
        filename: `${guideId}.pdf`,
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

  try {
    await fetch(POLYTSIA_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_status',
        rowIndex,
        status: 'відправлено',
      }),
    })
  } catch {
    // Запис у таблицю вже є, лист відправлено
  }

  return NextResponse.json({ ok: true })
}
