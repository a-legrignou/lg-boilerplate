import { env } from './env';
import { fetchCollection } from './directus';

export type DirectusUser = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: unknown;
};

export type UserPreferences = {
  id: string;
  user: string;
  user_email?: string;
  locale: 'fr' | 'en';
  newsletter_opt_in: boolean;
};

export type DirectusAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires: string;
  expires_in: number;
  refresh_expires: number;
  refresh_expires_in: number;
  user: DirectusUser;
};

export function parseCookie(cookieHeader?: string) {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((pair) => pair.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [
        decodeURIComponent(key),
        decodeURIComponent(value),
      ])
  );
}

export function getCookie(cookieHeader: string | undefined, name: string) {
  return parseCookie(cookieHeader)[name] ?? null;
}

export async function getSessionFromAccessToken(accessToken: string) {
  if (!accessToken) return null;

  const response = await fetch(`${env.DIRECTUS_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.data ?? null;
}

export async function getUserPreferences(userId: string) {
  if (!userId) return null;

  const response = await fetchCollection<UserPreferences[]>(
    'user_preferences',
    {
      filter: {
        user: {
          _eq: userId,
        },
      },
      limit: 1,
    }
  );

  return response?.[0] ?? null;
}

export async function refreshDirectusSession(refreshToken: string) {
  if (!refreshToken) return null;

  const response = await fetch(`${env.DIRECTUS_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json?.data as DirectusAuthResponse;
}

export async function loginDirectus(email: string, password: string) {
  const response = await fetch(`${env.DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const message =
      errorPayload?.errors?.[0]?.message ?? 'Unable to authenticate.';
    throw new Error(message);
  }

  const json = await response.json();
  return json?.data as DirectusAuthResponse;
}
