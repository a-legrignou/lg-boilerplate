import { NextRequest, NextResponse } from 'next/server';
import { getCookie, refreshDirectusSession } from '@lib/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const refreshToken = getCookie(cookieHeader, 'ds_refresh');

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token missing.' },
      { status: 401 }
    );
  }

  const refreshed = await refreshDirectusSession(refreshToken);
  if (!refreshed) {
    const response = NextResponse.json(
      { error: 'Unable to refresh session.' },
      { status: 401 }
    );
    response.cookies.set('ds_access', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set('ds_refresh', '', { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
  }

  const response = NextResponse.json({ user: refreshed.user });
  response.cookies.set('ds_access', refreshed.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: refreshed.expires_in,
  });
  response.cookies.set('ds_refresh', refreshed.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: refreshed.refresh_expires_in,
  });

  return response;
}
