import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/blog', '/contact', '/about']
const ADMIN_PATHS = ['/admin']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value

  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), req.url))
    }
    const session = await validateSession(token)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
