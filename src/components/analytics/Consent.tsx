"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const COOKIE = "lg_consent";
type Choice = "accepted" | "declined";

export function useConsent() {
  const [choice, setChoice] = React.useState<Choice | null>(null);

  React.useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE}=`))
      ?.split("=")[1] as Choice | undefined;
    if (stored === "accepted" || stored === "declined") setChoice(stored);
  }, []);

  const persist = (value: Choice) => {
    document.cookie = `${COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setChoice(value);
  };

  return {
    choice,
    accept: () => persist("accepted"),
    decline: () => persist("declined"),
  };
}

export function ConsentBanner() {
  const { choice, accept, decline } = useConsent();
  if (choice !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-6 py-4 backdrop-blur">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Ce site utilise des cookies pour mesurer l'audience de manière
          anonyme. Aucun tracking publicitaire.
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={decline}>
            Refuser
          </Button>
          <Button size="sm" onClick={accept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsScripts({
  plausibleDomain,
  plausibleScript,
}: {
  plausibleDomain?: string;
  plausibleScript?: string;
}) {
  const { choice } = useConsent();
  React.useEffect(() => {
    if (choice !== "accepted" || !plausibleDomain) return;
    const id = "plausible-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.defer = true;
    s.dataset.domain = plausibleDomain;
    s.src = plausibleScript || "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }, [choice, plausibleDomain, plausibleScript]);
  return null;
}
