import { NextResponse } from 'next/server'
import { API_BASE } from '@/lib/env'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const r = await fetch(API_BASE + 'auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data?.success) {
    return NextResponse.json({ success: false, errorMessage: data?.errorMessage || 'Register failed' }, { status: r.status || 400 })
  }
  return NextResponse.json({ success: true })
}

