"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setPending(true);

    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });

    if (error) {
      setMessage({
        type: "err",
        text: error.message ?? "Erreur changement mot de passe.",
      });
      setPending(false);
      return;
    }

    setMessage({
      type: "ok",
      text: "Mot de passe mis à jour. Les autres sessions ont été déconnectées.",
    });
    setCurrent("");
    setNext("");
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="current">Mot de passe actuel</Label>
        <Input
          id="current"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="next">Nouveau mot de passe</Label>
        <Input
          id="next"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
        />
      </div>
      {message && (
        <p
          className={
            message.type === "err"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {message.text}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending || !current || !next}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Changer le mot de passe
        </Button>
      </div>
    </form>
  );
}
