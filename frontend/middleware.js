import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get pathname of request (e.g. /, /dashboard, /login)
  const pathname = request.nextUrl.pathname

  // Define public paths that don't need authentication
  const publicPaths = ['/', '/login', '/register', '/api']

  // Check if path starts with any public path
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )

  // If it's a public path, continue
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if user has authentication token
  const token = request.cookies.get('habitquest_token')?.value

  // If no token found and accessing protected route, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
