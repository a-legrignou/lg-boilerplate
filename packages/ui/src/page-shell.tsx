import type { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10">
        <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sky-400">
              {process.env.NEXT_PUBLIC_SITE_NAME ?? 'Mon Projet'}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? ''}
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#modules" className="hover:text-white">
              Modules
            </a>
            <a href="/api/health" className="hover:text-white">
              Health
            </a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
