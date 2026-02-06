import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body as { phone?: string }
    const normalized = typeof phone === 'string' ? phone.replace(/\D/g, '') : ''
    if (normalized.length < 10) {
      return NextResponse.json({ allowed: false }, { status: 400 })
    }
    const allowedPhones = (process.env.SERIES_PAID_PHONES ?? '').split(',').map((p) => p.trim().replace(/\D/g, '')).filter(Boolean)
    const allowed = allowedPhones.includes(normalized) || allowedPhones.includes(normalized.slice(-10))
    return NextResponse.json({ allowed })
  } catch {
    return NextResponse.json({ allowed: false }, { status: 500 })
  }
}
