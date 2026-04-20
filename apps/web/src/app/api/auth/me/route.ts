import { NextRequest, NextResponse } from 'next/server';
import {
  getCookie,
  getSessionFromAccessToken,
  getUserPreferences,
} from '@lib/auth';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const accessToken = getCookie(cookieHeader, 'ds_access');

  if (!accessToken) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  const user = await getSessionFromAccessToken(accessToken);
  if (!user) {
    return NextResponse.json({ user: null, authenticated: false });
  }

  const preferences = await getUserPreferences(user.id);
  return NextResponse.json({ user, authenticated: true, preferences });
}
