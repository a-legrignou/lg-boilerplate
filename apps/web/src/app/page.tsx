import { Card } from '@ui/card';
import { Button } from '@ui/button';
import { siteConfig } from '@lib/config';
import { enabledModules } from '@lib/modules';

export default function HomePage() {
  const modules = enabledModules();

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-10 shadow-2xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Boilerplate modular
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#modules">Voir les modules</Button>
            <Button variant="secondary" href="/api/health">
              Healthcheck
            </Button>
          </div>
        </div>

        <section id="modules" className="grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Card
              key={module.name}
              title={module.label}
              status={module.enabled ? 'enabled' : 'disabled'}
            >
              {module.description}
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}
