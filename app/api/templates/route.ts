import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { API_BASE } from '@/lib/env'

export async function GET() {
  const token = cookies().get('moventrac_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const r = await fetch(API_BASE + 'templates', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  })
  const data = await r.json().catch(() => ([]))
  return NextResponse.json(data, { status: r.status })
}

