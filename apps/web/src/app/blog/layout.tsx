import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        {children}
      </div>
    </section>
  );
}
