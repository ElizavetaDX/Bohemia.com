import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_CALC_BOT_TOKEN
const SERIES_TELEGRAM_CHAT_ID = process.env.SERIES_TELEGRAM_CHAT_ID ?? '8420828581'
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL

async function sendToGoogleSheet(reference: string) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return
  await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'confirm',
      reference,
    }),
  }).catch(() => {})
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const status = (body as { status?: string })?.status
    if (status !== 'success') {
      return NextResponse.json({ ok: true })
    }
    const amount = (body as { amount?: number })?.amount
    const merchantPaymInfo = (body as { merchantPaymInfo?: { reference?: string; destination?: string } })?.merchantPaymInfo
    const clientInfo = (body as { clientInfo?: { name?: string; phone?: string; email?: string } })?.clientInfo
    const reference = merchantPaymInfo?.reference ?? ''

    const text = [
      '💰 ОПЛАТА СЕРІЙ МУЛЬТСЕРІАЛУ',
      '',
      `Сума: ${amount ? amount / 100 : '?'} грн`,
      `Референс: ${reference || '-'}`,
      `Призначення: ${merchantPaymInfo?.destination ?? '-'}`,
      '',
      '👤 Клієнт:',
      `Ім'я: ${clientInfo?.name ?? '-'}`,
      `Телефон: ${clientInfo?.phone ?? '-'}`,
      `Email: ${clientInfo?.email ?? '-'}`,
    ].join('\n')

    if (BOT_TOKEN && SERIES_TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: SERIES_TELEGRAM_CHAT_ID, text }),
      })
    }

    await sendToGoogleSheet(reference)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
