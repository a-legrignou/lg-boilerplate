import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes that require the user to be authenticated.
 * The middleware does a fast cookie-presence check here.
 * Authoritative validation (token expiry, role) happens in each Server Component.
 */
const PROTECTED_ROUTES = ['/account'];

/**
 * Routes reserved for admin role.
 * We store the role in a lightweight `ds_role` cookie set at login
 * (see /api/auth/login). Server Components re-validate against Directus.
 */
const ADMIN_ROUTES = ['/admin'];

/** Public auth pages that logged-in users should be redirected away from. */
const AUTH_PAGES = ['/auth'];

function getRedirectUrl(request: NextRequest, path: string): URL {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return url;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('ds_access')?.value;
  const refreshToken = request.cookies.get('ds_refresh')?.value;
  const role = request.cookies.get('ds_role')?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  // --- Admin routes ---
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = getRedirectUrl(request, '/auth');
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    // ds_role is set at login; absence = non-admin, block access.
    if (role !== 'admin') {
      return NextResponse.redirect(getRedirectUrl(request, '/'));
    }
    return NextResponse.next();
  }

  // --- Protected routes ---
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = getRedirectUrl(request, '/auth');
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- Auth pages: redirect already-logged-in users ---
  if (AUTH_PAGES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const next = request.nextUrl.searchParams.get('next') ?? '/account';
      // Prevent open-redirect: only allow internal paths
      const safePath = next.startsWith('/') ? next : '/account';
      return NextResponse.redirect(getRedirectUrl(request, safePath));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, sitemap.xml, robots.txt (static assets)
     * - /api/* routes (handled by their own auth logic)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/).*)',
  ],
};
