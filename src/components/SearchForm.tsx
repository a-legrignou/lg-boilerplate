"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";

type Hit = {
  type: "page" | "post";
  title: string;
  slug: string;
  excerpt: string;
};

export function SearchForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = React.useState(initial);
  const [hits, setHits] = React.useState<Hit[] | null>(null);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!initial) return;
    setPending(true);
    fetch(`/api/search?q=${encodeURIComponent(initial)}&locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setHits(d.results ?? []))
      .finally(() => setPending(false));
  }, [initial, locale]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(
            `${localizedPath("/search", locale)}?q=${encodeURIComponent(q)}`,
          );
        }}
        className="flex gap-2"
      >
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={locale === "fr" ? "Rechercher…" : "Search…"}
        />
        <Button type="submit" disabled={pending}>
          {locale === "fr" ? "Rechercher" : "Search"}
        </Button>
      </form>

      {hits && (
        <ul className="mt-8 space-y-3">
          {hits.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              {locale === "fr" ? "Aucun résultat." : "No results."}
            </li>
          ) : (
            hits.map((h) => {
              const href = h.type === "post" ? `/blog/${h.slug}` : `/${h.slug}`;
              return (
                <li key={`${h.type}-${h.slug}`}>
                  <Link
                    href={localizedPath(href, locale)}
                    className="block rounded-md border border-border p-4 hover:bg-card"
                  >
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {h.type}
                    </div>
                    <div className="mt-1 font-medium">{h.title}</div>
                    {h.excerpt ? (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {h.excerpt}
                      </div>
                    ) : null}
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
