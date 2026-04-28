import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreditCard, Settings } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { openCustomerPortal } from "../pricing/actions";
import { SignOutButton } from "./sign-out-button";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user as typeof session.user & {
    stripeCustomerId?: string | null;
    subscriptionStatus?: string | null;
  };
  const isSubscribed = ACTIVE_STATUSES.has(user.subscriptionStatus || "");

  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <Settings className="size-4" />
              Paramètres
            </Link>
          </Button>
          <SignOutButton />
        </div>
      </div>

      {params.subscription === "success" && (
        <p className="mt-6 rounded-md border border-border bg-muted px-4 py-2 text-sm">
          🎉 Bienvenue parmi les abonnés Premium.
        </p>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Bonjour {user.name || user.email}</CardTitle>
          <CardDescription>
            Connecté avec <span className="font-mono">{user.email}</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-muted-foreground" />
            Abonnement
          </CardTitle>
          <CardDescription>
            {isSubscribed
              ? `Statut : ${user.subscriptionStatus}`
              : "Aucun abonnement actif."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <form action={openCustomerPortal}>
              <Button type="submit" variant="outline">
                Gérer mon abonnement
              </Button>
            </form>
          ) : (
            <Button asChild>
              <Link href="/pricing">Voir les plans</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Page server-rendered, session vérifiée côté serveur via Better Auth.
      </p>
    </main>
  );
}
