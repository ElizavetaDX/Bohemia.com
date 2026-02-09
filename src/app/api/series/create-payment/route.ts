import { NextResponse } from 'next/server'

const MONOBANK_TOKEN = process.env.MONOBANK_TOKEN
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
const GOOGLE_SHEET_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL

async function createLeadInSheet(data: { name: string; phone: string; telegram: string; email: string; seriesId: number[]; amount: number }): Promise<{ ok: boolean; error?: string }> {
  if (!GOOGLE_SHEET_WEBHOOK_URL) {
    return { ok: false, error: 'NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL не налаштовано. Додайте URL скрипта у Vercel.' }
  }
  try {
    const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_lead',
        name: data.name,
        phone: data.phone,
        telegram: data.telegram,
        email: data.email,
        seriesId: data.seriesId,
        amount: data.amount,
      }),
    })
    const text = await res.text()
    const json = (() => { try { return JSON.parse(text) } catch { return {} } })()
    if (!res.ok) {
      return { ok: false, error: `Google Sheet: ${res.status} ${res.statusText}. ${text.slice(0, 200)}` }
    }
    if (!json?.ok) {
      return { ok: false, error: json?.error ? `GAS: ${json.error}` : `GAS відповів без ok: ${text.slice(0, 100)}` }
    }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: `CORS або мережа: ${msg}` }
  }
}

async function storePendingPayment(invoiceId: string, data: { name: string; phone: string; telegram: string; email: string; birth: string; city: string; seriesId: number[] }) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return
  await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'store',
      invoiceId,
      ...data,
    }),
  }).catch(() => {})
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, telegram, email, birth, city, episodeIds } = body as {
      name?: string
      phone?: string
      telegram?: string
      email?: string
      birth?: string
      city?: string
      episodeIds?: number[]
    }
    if (!name?.trim() || !phone || !email?.trim() || !episodeIds?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    const amount = episodeIds.length * 99
    const leadData = {
      name: name.trim(),
      phone: String(phone),
      telegram: (telegram ?? '').trim(),
      email: email.trim(),
      seriesId: episodeIds,
      amount,
    }
    const leadResult = await createLeadInSheet(leadData)
    if (!leadResult.ok) {
      return NextResponse.json(
        { error: leadResult.error ?? 'Не вдалося зберегти заявку в Google Таблицю' },
        { status: 502 }
      )
    }
    if (!MONOBANK_TOKEN) {
      return NextResponse.json({ ok: true, skipPayment: true })
    }
    const ccy = 980
    const reference = `series-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    const webHookUrl = `${FRONTEND_URL}/api/series/webhook`
    const redirectUrl = `${FRONTEND_URL}/series?success=1`
    const res = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': MONOBANK_TOKEN,
      },
      body: JSON.stringify({
        amount: amount * 100,
        ccy,
        merchantPaymInfo: {
          reference,
          destination: `Серії ${episodeIds.join(', ')}`,
          basketOrder: episodeIds.map((id: number, i: number) => ({
            name: `Серія ${id}`,
            qty: 1,
            sum: 99 * 100,
            unit: 'шт',
            code: `ep${id}`,
          })),
        },
        webHookUrl,
        redirectUrl,
        validity: 3600,
        paymentType: 'debit',
        savePaymentData: { save: false },
        clientInfo: { name, phone, email },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 502 })
    }
    const monobankData = (await res.json()) as { pageUrl?: string }
    await storePendingPayment(reference, {
      name: leadData.name,
      phone: leadData.phone,
      telegram: leadData.telegram,
      email: leadData.email,
      birth: '',
      city: '',
      seriesId: episodeIds,
    })
    if (!monobankData.pageUrl) return NextResponse.json({ error: 'No pageUrl from Monobank' }, { status: 502 })
    return NextResponse.json({ pageUrl: monobankData.pageUrl })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
