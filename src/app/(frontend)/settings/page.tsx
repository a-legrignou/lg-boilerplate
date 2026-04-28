import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <main className="container mx-auto max-w-2xl px-6 py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3">
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Retour au dashboard
        </Link>
      </Button>

      <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Modifie ton nom ou ton email.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialName={session.user.name ?? ""}
            initialEmail={session.user.email}
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Choisis-en un solide.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
