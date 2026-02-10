import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { Resend } from 'resend'
import { getGuideBySlug } from '@/data/guidesData'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.POLYTSIA_FROM_EMAIL ?? 'onboarding@resend.dev'

function isRuEmail(email: string): boolean {
  const lower = email.trim().toLowerCase()
  return lower.endsWith('.ru') || /@[^.]+\.ru(\s|$)/i.test(lower)
}

const SUBJECT = 'Твій гайд від BOHEMIQA STUDIO'

export async function POST(request: Request) {
  if (!process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL || process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL.trim() === '') {
    console.error('[send-guide] POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL пуста або не задана. Задайте змінну в Vercel → Settings → Environment Variables.')
    return NextResponse.json(
      { error: 'POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL не налаштовано. Налаштуйте змінну у Vercel.' },
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

  const guide = getGuideBySlug(guideId)
  if (!guide) {
    return NextResponse.json(
      { error: 'Невідомий гайд. Дозволені тільки гайди з Полки.' },
      { status: 400 }
    )
  }

  const pdfFileName = `${guide.slug}.pdf`
  let rowIndex: number | null = null

  try {
    console.log('Таблица Полки:', process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL)
    const appendRes = await fetch(process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    if (!appendRes.ok) {
      const text = await appendRes.text()
      console.error('[send-guide] Таблиця відповіла помилкою. URL:', process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL, 'Статус:', appendRes.status, 'Тіло:', text.slice(0, 300))
    } else {
      try {
        const appendData = await appendRes.json()
        if (typeof appendData?.rowIndex === 'number' && appendData.rowIndex >= 2) {
          rowIndex = appendData.rowIndex
        }
      } catch {
        // Скрипт міг повернути не JSON — рядок у таблицю вже додано
      }
    }
  } catch (e) {
    console.error('[send-guide] Помилка запису в таблицю. URL:', process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL, e)
  }

  const pdfPath = path.join(process.cwd(), 'public', 'guides', pdfFileName)
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await readFile(pdfPath)
  } catch {
    return NextResponse.json(
      { error: `PDF для гайду «${guide.title}» відсутній (очікується public/guides/${pdfFileName})` },
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
        filename: pdfFileName,
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
      await fetch(process.env.POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL!, {
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
  }

  return NextResponse.json({ ok: true })
}
