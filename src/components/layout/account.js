"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Users, LogOut, User, Mail, Shield } from "lucide-react";
import TierBadge from "@/components/widgets/tier-badge";

// ─── Logout button ────────────────────────────────────────────────────────────

function LogoutButton({ locale = "fr" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-50 transition">
      <LogOut className="w-4 h-4" />
      {loading ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}

// ─── Main account layout ──────────────────────────────────────────────────────

export default function AccountLayout({ user, tier, locale = "fr" }) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;
  const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "U";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <TierBadge tier={tier !== "public" ? tier : null} />
                {tier === "public" && (
                  <span className="text-xs text-muted-foreground">Compte standard</span>
                )}
              </div>
            </div>
          </div>
          <LogoutButton locale={locale} />
        </div>

        {/* Profile card */}
        <section className="border border-border space-y-0 divide-y divide-border">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Informations du compte
            </h2>
          </div>

          <div className="px-6 py-4 flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>

          {(user.first_name || user.last_name) && (
            <div className="px-6 py-4 flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Nom</p>
                <p className="text-sm font-medium text-foreground">{fullName}</p>
              </div>
            </div>
          )}

          <div className="px-6 py-4 flex items-center gap-3">
            <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Accès</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {user.role?.name ?? "Standard"}
              </p>
            </div>
          </div>
        </section>

        {/* Subscription / access status */}
        <section className="border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Abonnement
            </h2>
          </div>

          <div className="px-6 py-6 space-y-4">
            {tier === "premium" && (
              <div className="flex items-start gap-4">
                <Crown className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Membre Premium</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Accès illimité à tous les articles et à l'export PDF.
                  </p>
                </div>
              </div>
            )}

            {tier === "community" && (
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 text-sage mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Membre Community</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Accès aux articles community. Passez Premium pour débloquer tous les contenus exclusifs.
                  </p>
                </div>
              </div>
            )}

            {tier === "community" && (
              <a
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold text-gold text-sm font-medium hover:bg-gold-14 transition">
                <Crown className="w-4 h-4" />
                Passer Premium
              </a>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
