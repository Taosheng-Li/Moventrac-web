import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Clear auth cookie and redirect to home page
  const url = new URL('/', req.url)
  const res = NextResponse.redirect(url, { status: 303 })
  res.cookies.set('moventrac_token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
