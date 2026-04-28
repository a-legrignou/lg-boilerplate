"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [email, setEmail] = React.useState(initialEmail);
  const [pending, setPending] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setPending(true);

    if (name !== initialName) {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        setMessage({
          type: "err",
          text: error.message ?? "Erreur mise à jour profil.",
        });
        setPending(false);
        return;
      }
    }

    if (email !== initialEmail) {
      const { error } = await authClient.changeEmail({
        newEmail: email,
        callbackURL: "/settings",
      });
      if (error) {
        setMessage({
          type: "err",
          text: error.message ?? "Erreur changement email.",
        });
        setPending(false);
        return;
      }
    }

    setMessage({ type: "ok", text: "Profil mis à jour." });
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button
          type="submit"
          disabled={pending || (name === initialName && email === initialEmail)}
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
