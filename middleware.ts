import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('moventrac_token')?.value
  const isAuthed = Boolean(token)
  const { pathname } = req.nextUrl

  // Protect authenticated group
  if (pathname.startsWith('/app')) {
    if (!isAuthed) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/records']
}
