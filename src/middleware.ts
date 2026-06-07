import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip setup page itself, API routes, static files
  if (
    pathname.startsWith('/setup') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check setup status
  try {
    const setupRes = await fetch(new URL('/api/setup/status', req.url))
    const data = await setupRes.json()

    if (!data.setupCompleted) {
      return NextResponse.redirect(new URL('/setup', req.url))
    }
  } catch {
    // If API fails, allow through (don't block on error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
