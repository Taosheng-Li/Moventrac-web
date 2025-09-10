import { NextResponse } from 'next/server'
import { API_BASE } from '@/lib/env'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const r = await fetch(API_BASE + 'auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data?.success || !data?.jwtUserToken) {
    return NextResponse.json({ success: false, errorMessage: data?.errorMessage || 'Login failed' }, { status: r.status || 400 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('moventrac_token', data.jwtUserToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60, // 1h
  })
  return res
}

