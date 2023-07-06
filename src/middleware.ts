import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { language } from './helper/data/common'

// This function can be marked `async` if using `await` inside
function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url))
  }

  const check = language.some((item) =>
    request.nextUrl.pathname.startsWith(
      request.nextUrl.pathname.length === 3 ? `/${item.key}` : `/${item.key}/`
    )
  )
  if (!check) {
    return NextResponse.redirect(
      new URL('/en/' + request.nextUrl.pathname, request.url)
    )
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'
}
export default middleware
