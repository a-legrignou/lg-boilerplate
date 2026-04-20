import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Card({
  title,
  status,
  children,
}: {
  title: string;
  status: 'enabled' | 'disabled';
  children: ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span
          className={clsx(
            'rounded-full px-3 py-1 text-xs font-semibold',
            status === 'enabled'
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-slate-700 text-slate-400'
          )}
        >
          {status}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-300">{children}</p>
    </article>
  );
}
