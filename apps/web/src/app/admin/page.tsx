import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionFromAccessToken } from '@lib/auth';
import { env } from '@lib/env';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN !== 'true') notFound();

  // Authoritative role check (middleware did the fast check; we re-validate here)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('ds_access')?.value ?? null;
  const user = accessToken
    ? await getSessionFromAccessToken(accessToken).catch(() => null)
    : null;

  if (!user) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">
          Administration
        </p>
        <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
        <p className="text-slate-400">Connecté en tant que {user.email}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href={env.DIRECTUS_PUBLIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-sky-400/30"
        >
          <h2 className="text-lg font-semibold text-white">Directus CMS</h2>
          <p className="mt-1 text-sm text-slate-400">
            Gérer le contenu, les utilisateurs et les collections.
          </p>
          <p className="mt-3 text-xs text-sky-400">Ouvrir →</p>
        </a>

        <a
          href="/api/health"
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-sky-400/30"
        >
          <h2 className="text-lg font-semibold text-white">Healthcheck</h2>
          <p className="mt-1 text-sm text-slate-400">
            Statut de l'application.
          </p>
          <p className="mt-3 text-xs text-sky-400">Voir →</p>
        </a>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Revalidation ISR</h2>
          <p className="mt-1 text-sm text-slate-400">
            Invalider le cache via{' '}
            <code className="text-sky-400">POST /api/revalidate</code>
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Body : {`{ secret, tag?, path? }`}
          </p>
        </div>
      </div>
    </div>
  );
}
