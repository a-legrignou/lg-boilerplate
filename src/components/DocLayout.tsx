import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/design", label: "Design" },
  { href: "/security", label: "Security" },
];

export function DocLayout({
  current,
  title,
  intro,
  children,
}: {
  current: "/features" | "/design" | "/security";
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-sm font-semibold">
            Folio
          </Link>
          <nav className="flex items-center gap-1 md:gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  current === item.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <span className="hidden h-4 w-px bg-border md:inline-block md:ml-2" />
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin">/admin</Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <article className="container mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
          {intro}
        </p>
        <div className="mt-12 space-y-12">{children}</div>
      </article>

      <footer className="border-t border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            ← Retour à l'accueil
          </Link>
          <div className="flex gap-4">
            {NAV.filter((n) => n.href !== current).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

export function Section({
  title,
  children,
  anchor,
}: {
  title: string;
  children: React.ReactNode;
  anchor?: string;
}) {
  return (
    <section id={anchor} className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-card p-4 text-xs leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}
