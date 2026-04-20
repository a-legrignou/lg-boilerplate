import { NextRequest, NextResponse } from 'next/server';
import { loginDirectus } from '@lib/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim();
  const password = String(body.password || '');

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }

  try {
    const auth = await loginDirectus(email, password);
    const response = NextResponse.json({ user: auth.user });

    response.cookies.set('ds_access', auth.access_token, {
      ...COOKIE_OPTIONS,
      maxAge: auth.expires_in,
    });

    response.cookies.set('ds_refresh', auth.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: auth.refresh_expires_in,
    });

    // Store role in a non-httpOnly cookie so the middleware can read it
    // without a Directus roundtrip on every request.
    // The middleware uses this for a fast gate; server components re-validate.
    if (auth.user.role) {
      response.cookies.set('ds_role', String(auth.user.role), {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: auth.refresh_expires_in,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed.' },
      { status: 401 }
    );
  }
}
