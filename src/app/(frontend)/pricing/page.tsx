import { headers } from "next/headers";
import Link from "next/link";
import { Check } from "lucide-react";

import { auth } from "@/lib/auth";
import { PLANS } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startCheckout } from "./actions";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as
    | (NonNullable<typeof session>["user"] & {
        subscriptionStatus?: string | null;
      })
    | undefined;
  const isSubscribed =
    user?.subscriptionStatus === "active" ||
    user?.subscriptionStatus === "trialing";

  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Choisis ton plan
        </h1>
        <p className="mt-3 text-muted-foreground">Annulable à tout moment.</p>
      </div>

      {params.canceled && (
        <p className="mt-6 rounded-md border border-border bg-muted px-4 py-2 text-center text-sm text-muted-foreground">
          Paiement annulé. Tu peux réessayer.
        </p>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-1">
        {Object.values(PLANS).map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2 text-3xl font-semibold">
                {plan.amount}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {plan.interval}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {isSubscribed ? (
                <Button variant="outline" disabled>
                  Déjà abonné
                </Button>
              ) : !session ? (
                <Button asChild>
                  <Link href={`/sign-up?next=/pricing`}>Créer un compte</Link>
                </Button>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await startCheckout(plan.id as keyof typeof PLANS);
                  }}
                >
                  <Button type="submit" className="w-full">
                    Souscrire
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Paiement sécurisé via Stripe. Tu peux gérer ou annuler ton abonnement
        depuis ton dashboard.
      </p>
    </main>
  );
}
