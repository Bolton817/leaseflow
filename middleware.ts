import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from './lib/auth/session';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  
  // Public routes that don't require authentication
  const isPublicRoute = 
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/register' ||
    request.nextUrl.pathname.startsWith('/api/webhooks');

  let hasValidSession = false;
  
  // Decrypt and verify the session in the middleware
  if (sessionCookie) {
    const payload = await decrypt(sessionCookie);
    if (payload && payload.userId) {
      hasValidSession = true;
    }
  }

  // Redirect to dashboard if logged in and trying to access login/register
  if (isPublicRoute && hasValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and trying to access protected routes
  if (!isPublicRoute && !hasValidSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Update the session expiration if valid
  let response = NextResponse.next();
  if (hasValidSession) {
    const updatedResponse = await updateSession(request);
    if (updatedResponse) {
      response = updatedResponse;
    }
  }

  // If updateSession returned a new response with updated cookies, use it
  if (response) {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, some might be public, some protected - we'll handle this in the routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
