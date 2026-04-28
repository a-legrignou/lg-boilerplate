"use client";

import * as React from "react";
import { Loader2, Mail } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Provider = "github" | "google";

const PROVIDER_LABEL: Record<Provider, string> = {
  github: "GitHub",
  google: "Google",
};

export function SocialProviders({
  providers,
  callbackURL = "/dashboard",
}: {
  providers: Provider[];
  callbackURL?: string;
}) {
  const [pending, setPending] = React.useState<Provider | "magic" | null>(null);
  const [magicEmail, setMagicEmail] = React.useState("");
  const [magicSent, setMagicSent] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          disabled={pending !== null}
          onClick={async () => {
            setPending(provider);
            await signIn.social({ provider, callbackURL });
          }}
        >
          {pending === provider ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Continuer avec {PROVIDER_LABEL[provider]}
        </Button>
      ))}

      {magicSent ? (
        <p className="rounded-md border border-border bg-card p-3 text-center text-sm">
          Lien de connexion envoyé. Vérifie ta boîte mail.
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!magicEmail) return;
            setPending("magic");
            await signIn.magicLink({ email: magicEmail, callbackURL });
            setMagicSent(true);
            setPending(null);
          }}
          className="flex gap-2"
        >
          <Input
            type="email"
            value={magicEmail}
            onChange={(e) => setMagicEmail(e.target.value)}
            placeholder="ton@email.com"
            disabled={pending !== null}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={pending !== null || !magicEmail}
          >
            {pending === "magic" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Lien magique
          </Button>
        </form>
      )}

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">ou</span>
        </div>
      </div>
    </div>
  );
}
