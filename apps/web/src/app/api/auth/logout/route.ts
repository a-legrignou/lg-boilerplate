import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@lib/auth';
import { env } from '@lib/env';

const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

function clearCookies(response: NextResponse) {
  response.cookies.set('ds_access', '', { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set('ds_refresh', '', { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set('ds_role', '', { ...COOKIE_OPTIONS, maxAge: 0 });
}

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const refreshToken = getCookie(cookieHeader, 'ds_refresh');

  const response = NextResponse.redirect('/auth');
  clearCookies(response);

  if (refreshToken) {
    await fetch(`${env.DIRECTUS_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => null);
  }

  return response;
}
