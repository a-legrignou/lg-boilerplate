import { env } from './env';

type DirectusFetchResult<T> = {
  data: T;
  meta?: unknown;
  error?: unknown;
};

function buildQueryParams(
  params: Record<string, unknown>,
  prefix = ''
): [string, string][] {
  const entries: [string, string][] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    const paramKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      for (const item of value) {
        entries.push([`${paramKey}[]`, String(item)]);
      }
      continue;
    }

    if (typeof value === 'object') {
      entries.push(
        ...buildQueryParams(value as Record<string, unknown>, paramKey)
      );
      continue;
    }

    entries.push([paramKey, String(value)]);
  }

  return entries;
}

function buildDirectusUrl(path: string, params: Record<string, unknown> = {}) {
  const url = new URL(`${env.DIRECTUS_URL.replace(/\/+$/, '')}${path}`);
  const entries = buildQueryParams(params);
  entries.forEach(([key, value]) => url.searchParams.append(key, value));
  return url;
}

async function fetchDirectus<T>(
  path: string,
  params: Record<string, unknown> = {}
): Promise<T | undefined> {
  const url = buildDirectusUrl(path, params);
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  if (env.DIRECTUS_STATIC_TOKEN) {
    headers.set('Authorization', `Bearer ${env.DIRECTUS_STATIC_TOKEN}`);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => 'Unable to fetch Directus collection');
      throw new Error(errorText);
    }

    const payload = (await response.json()) as DirectusFetchResult<T>;
    return payload.data;
  } catch (error) {
    // During `next build`, Directus may be unreachable (e.g. image baked in CI
    // before infra is provisioned). Return undefined so generateStaticParams
    // falls back to on-demand rendering, and rethrow at runtime.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn(
        `[build] Skipping Directus fetch ${path}: ${(error as Error).message}`
      );
      return undefined;
    }
    throw error;
  }
}

export async function fetchCollection<T = unknown>(
  collection: string,
  params: Record<string, unknown> = {}
) {
  return fetchDirectus<T>(`/items/${collection}`, params);
}
