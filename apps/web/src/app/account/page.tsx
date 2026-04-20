import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromAccessToken, getUserPreferences } from '@lib/auth';

export default async function AccountPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'true') notFound();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('ds_access')?.value ?? null;

  if (!accessToken) {
    redirect('/auth');
  }

  const user = await getSessionFromAccessToken(accessToken);
  if (!user) {
    redirect('/auth');
  }

  const preferences = await getUserPreferences(user.id);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/10">
          <h1 className="text-3xl font-bold text-white">Mon compte</h1>
          <p className="mt-2 text-slate-400">
            Bienvenue, {user.first_name ?? user.email}.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">Profil</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <dt className="font-medium text-slate-100">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                {user.first_name && (
                  <div>
                    <dt className="font-medium text-slate-100">Prénom</dt>
                    <dd>{user.first_name}</dd>
                  </div>
                )}
                {user.last_name && (
                  <div>
                    <dt className="font-medium text-slate-100">Nom</dt>
                    <dd>{user.last_name}</dd>
                  </div>
                )}
                {user.role && (
                  <div>
                    <dt className="font-medium text-slate-100">Rôle</dt>
                    <dd>{String(user.role)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">Préférences</h2>
              {preferences ? (
                <dl className="mt-4 space-y-3 text-sm text-slate-300">
                  <div>
                    <dt className="font-medium text-slate-100">Langue</dt>
                    <dd>{preferences.locale}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-100">Newsletter</dt>
                    <dd>
                      {preferences.newsletter_opt_in ? 'Activée' : 'Désactivée'}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  Aucune préférence enregistrée.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-400"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
