"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Appearance } from "@/blocks/appearance";

type Props = {
  heading?: string | null;
  subtitle?: string | null;
  placeholder?: string | null;
  submitLabel?: string | null;
  successMessage?: string | null;
  appearance?: Appearance | null;
};

export function NewsletterBlock({
  heading,
  subtitle,
  placeholder,
  submitLabel,
  successMessage,
  appearance,
}: Props) {
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error || "failed");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section appearance={appearance ?? { maxWidth: "narrow" }}>
      <div className="text-center">
        {heading ? (
          <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
        ) : null}
        {subtitle ? (
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
        ) : null}
        {done ? (
          <p className="mt-8 rounded-lg border border-border bg-card p-6">
            {successMessage || "Merci !"}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex max-w-md gap-2"
          >
            <Input
              type="email"
              required
              placeholder={placeholder ?? "email@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {submitLabel || "OK"}
            </Button>
          </form>
        )}
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
    </Section>
  );
}
