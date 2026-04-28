import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocLayout, Section, Code } from "@/components/DocLayout";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Permissions RBAC, rate limiting, authentification, validation d'environnement et monitoring.",
};

const ACCESS_MATRIX: {
  [collection: string]: {
    admin: string;
    editor: string;
    service: string;
    public: string;
  };
} = {
  "Pages, Posts, Snippets, Médias": {
    admin: "CRUD",
    editor: "CRU (pas de delete)",
    service: "CRUD via API",
    public: "Lecture (published)",
  },
  "Forms, Submissions, Redirects": {
    admin: "CRUD",
    editor: "CRU",
    service: "CRUD via API",
    public: "—",
  },
  "En-tête, Pied de page, Paramètres": {
    admin: "Lecture + édition",
    editor: "Lecture + édition",
    service: "Idem via API",
    public: "Lecture",
  },
  "Identité de marque": {
    admin: "Lecture + édition",
    editor: "Caché",
    service: "Idem via API",
    public: "Lecture",
  },
  Utilisateurs: { admin: "CRUD", editor: "Caché", service: "—", public: "—" },
};

const RATE_LIMITS: { route: string; limit: string; window: string }[] = [
  { route: "/api/vitals", limit: "60", window: "1 min" },
  { route: "/api/search", limit: "30", window: "1 min" },
  { route: "/api/translate", limit: "10", window: "1 min" },
  { route: "/api/newsletter", limit: "5", window: "1 min" },
];

export default function SecurityPage() {
  return (
    <DocLayout
      current="/security"
      title="Sécurité & permissions"
      intro="Trois rôles fixes (admin, editor, service), API keys natives, rate limiting in-memory, validation d'environnement par Zod, monitoring Sentry — tout ce qui sort un site de l'amateurisme."
    >
      <Section title="RBAC — 3 rôles fixes" anchor="rbac">
        <p>
          Champ <code className="font-mono text-foreground">role</code> sur la
          collection
          <code className="font-mono text-foreground"> users</code> (Payload),
          valeur :
          <code className="font-mono text-foreground">
            {" "}
            admin · editor · service
          </code>
          . Pas de RBAC fin (pas de permissions par champ, pas d'héritage de
          groupes) — c'est volontaire pour rester simple.
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Matrice d'accès</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4 text-left">Resource</th>
                    <th className="py-2 pr-4 text-left">admin</th>
                    <th className="py-2 pr-4 text-left">editor</th>
                    <th className="py-2 pr-4 text-left">service</th>
                    <th className="py-2 pr-4 text-left">public</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ACCESS_MATRIX).map(([resource, perms]) => (
                    <tr
                      key={resource}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-2 pr-4 font-medium text-foreground">
                        {resource}
                      </td>
                      <td className="py-2 pr-4">{perms.admin}</td>
                      <td className="py-2 pr-4">{perms.editor}</td>
                      <td className="py-2 pr-4">{perms.service}</td>
                      <td className="py-2 pr-4">{perms.public}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <p>
          Les helpers <code className="font-mono text-foreground">isAdmin</code>
          ,<code className="font-mono text-foreground"> isAdminOrEditor</code>,
          <code className="font-mono text-foreground">
            {" "}
            readPublishedOrStaff
          </code>{" "}
          sont dans
          <code className="font-mono text-foreground"> src/lib/access.ts</code>.
          À utiliser systématiquement, jamais inliner{" "}
          <code className="font-mono text-foreground">
            {"({req}) => req.user?.role === 'admin'"}
          </code>
          .
        </p>
      </Section>

      <Section title="Service accounts & API keys" anchor="api-keys">
        <p>
          Un user avec{" "}
          <code className="font-mono text-foreground">role = service</code> ne
          peut pas se connecter via le formulaire web (hook{" "}
          <code className="font-mono text-foreground">beforeLogin</code>{" "}
          rejette). Il dispose d'une API key auto-générée par Payload (
          <code className="font-mono text-foreground">useAPIKey: true</code>).
        </p>
        <Code>{`# Crée le user en admin, copie sa clé, puis :
curl https://exemple.com/api/pages \\
  -H "Authorization: users API-Key abc123def456..."`}</Code>
        <p>
          Idéal pour : sync ERP/CRM, imports CSV, scripts CI, intégrations
          partenaires.
        </p>
      </Section>

      <Section title="Authentification" anchor="auth">
        <p>
          <strong>Better Auth</strong> côté app users (table{" "}
          <code className="font-mono text-foreground">user</code>, distincte de{" "}
          <code className="font-mono text-foreground">users</code> Payload).
          Stack auth :
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Email + mot de passe</strong> avec verification mail
            (template React Email branded)
          </li>
          <li>
            <strong>Magic link</strong> (passwordless, lien par email valide 5
            min)
          </li>
          <li>
            <strong>OAuth GitHub + Google</strong> — boutons affichés
            automatiquement si env vars présentes
          </li>
          <li>
            <strong>Reset password</strong> (template React Email)
          </li>
          <li>
            <strong>Sessions</strong> 7 jours, cookie cache 5 min, refresh
            quotidien
          </li>
        </ul>
        <p>
          Le proxy Next 16 (
          <code className="font-mono text-foreground">src/proxy.ts</code>)
          protège
          <code className="font-mono text-foreground"> /dashboard</code> et
          <code className="font-mono text-foreground"> /settings</code> via
          cookie check (rapide, pas de query DB). La page server fait la vérif
          complète.
        </p>
      </Section>

      <Section title="Rate limiting" anchor="rate-limit">
        <p>
          In-memory sliding window dans{" "}
          <code className="font-mono text-foreground">
            src/lib/rate-limit.ts
          </code>
          . Reset au redémarrage, ne survit pas au scaling horizontal — à
          remplacer par
          <code className="font-mono text-foreground">
            {" "}
            @upstash/ratelimit
          </code>{" "}
          dès que tu déploies sur plusieurs instances.
        </p>
        <Card>
          <CardContent className="pt-6">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4 text-left">Route</th>
                  <th className="py-2 pr-4 text-left">Limite</th>
                  <th className="py-2 pr-4 text-left">Fenêtre</th>
                </tr>
              </thead>
              <tbody>
                {RATE_LIMITS.map((r) => (
                  <tr
                    key={r.route}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{r.route}</td>
                    <td className="py-2 pr-4">{r.limit}</td>
                    <td className="py-2 pr-4">{r.window}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p>
          Clé :{" "}
          <code className="font-mono text-foreground">{"<route>:<IP>"}</code>{" "}
          via header
          <code className="font-mono text-foreground"> x-forwarded-for</code>.
          Au-delà du quota : HTTP 429 + header{" "}
          <code className="font-mono text-foreground">Retry-After</code>.
        </p>
      </Section>

      <Section title="Validation d'environnement (Zod)" anchor="env">
        <p>
          <code className="font-mono text-foreground">src/lib/env.ts</code>{" "}
          définit un schéma Zod et le valide au boot. Si une variable
          obligatoire manque, <strong>l'app refuse de démarrer</strong> avec un
          message clair — plutôt qu'un bug obscur 3 jours après en prod.
        </p>
        <Code>{`// src/lib/env.ts
DATABASE_URI: z.string().url('postgres:// requis'),
PAYLOAD_SECRET: z.string().min(16),
BETTER_AUTH_SECRET: z.string().min(16),
// ... optionnels
RESEND_API_KEY: z.string().optional(),
STRIPE_SECRET_KEY: z.string().optional(),
ANTHROPIC_API_KEY: z.string().optional(),`}</Code>
      </Section>

      <Section title="Consent & cookies (GDPR)" anchor="consent">
        <p>
          Banner GDPR-compliant (
          <code className="font-mono text-foreground">
            src/components/analytics/Consent.tsx
          </code>
          ), choix stocké dans un cookie{" "}
          <code className="font-mono text-foreground">lg_consent</code>. Le
          script Plausible n'est <strong>jamais</strong> injecté tant que
          l'utilisateur n'a pas accepté. Web Vitals collectés uniquement après
          consentement. Pas de tracking par défaut.
        </p>
      </Section>

      <Section title="Monitoring" anchor="monitoring">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Sentry</strong> (
            <code className="font-mono text-foreground">SENTRY_DSN</code>) —
            error tracking client + server + edge, gated par DSN (silencieux si
            non configuré)
          </li>
          <li>
            <strong>Pino</strong> structured logs — JSON en prod, pretty en dev.
            Niveau via{" "}
            <code className="font-mono text-foreground">LOG_LEVEL</code>
          </li>
          <li>
            <strong>Web Vitals</strong> — LCP/INP/CLS envoyés à{" "}
            <code className="font-mono text-foreground">/api/vitals</code>{" "}
            (consent-gated)
          </li>
          <li>
            <strong>Health check</strong>{" "}
            <code className="font-mono text-foreground">/api/health</code> — DB
            ping + uptime, retourne 503 si DB down
          </li>
        </ul>
      </Section>

      <Section title="Sessions & cookies" anchor="sessions">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Cookie session Better Auth —{" "}
            <code className="font-mono text-foreground">
              httpOnly · secure · sameSite=lax
            </code>
          </li>
          <li>Durée : 7 jours, refresh quotidien si actif</li>
          <li>
            Cache cookie 5 min côté client (évite les round-trips DB sur chaque
            requête)
          </li>
          <li>Logout invalide la session côté server immédiatement</li>
        </ul>
      </Section>

      <Section title="Recommandations production" anchor="prod">
        <p>Avant de déployer en prod, vérifie :</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <code className="font-mono text-foreground">PAYLOAD_SECRET</code> et{" "}
            <code className="font-mono text-foreground">
              BETTER_AUTH_SECRET
            </code>{" "}
            = aléatoires (au moins 32 chars, pas les valeurs CI par défaut)
          </li>
          <li>HTTPS forcé (Vercel / Fly / Caddy le font automatiquement)</li>
          <li>
            Headers de sécurité (CSP, HSTS, X-Frame-Options) — à configurer dans{" "}
            <code className="font-mono text-foreground">next.config.ts</code>
          </li>
          <li>Rate limit basculé sur Upstash si multi-instance</li>
          <li>Sentry DSN configuré + alertes</li>
          <li>
            <code className="font-mono text-foreground">
              requireEmailVerification: true
            </code>{" "}
            dans{" "}
            <code className="font-mono text-foreground">src/lib/auth.ts</code>{" "}
            (Better Auth)
          </li>
          <li>Backups DB automatisés</li>
        </ul>
      </Section>
    </DocLayout>
  );
}
