import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect /chisiamo to /about
  if (pathname === '/chisiamo' || pathname.startsWith('/chisiamo/')) {
    return NextResponse.redirect(new URL('/about', request.url))
  }

  // Redirect /shop# to /shop (remove hash)
  if (pathname === '/shop#' || pathname.startsWith('/shop#')) {
    return NextResponse.redirect(new URL('/shop', request.url))
  }

  // Redirect /customizer to /personalizza
  if (pathname === '/customizer' || pathname.startsWith('/customizer/')) {
    return NextResponse.redirect(new URL('/personalizza', request.url))
  }

  // Redirect old locale routes to non-locale routes
  const locales = ['it', 'en', 'es', 'rs', 'cn']
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
      return NextResponse.redirect(new URL(pathWithoutLocale, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*|.*\\.).*)',
  ],
}
