import type { Metadata } from "next";
import Link from "next/link";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { FeaturesBlock } from "@/components/blocks/FeaturesBlock";
import { CTABlock } from "@/components/blocks/CTABlock";
import { LogoCloudBlock } from "@/components/blocks/LogoCloudBlock";
import { PricingBlock } from "@/components/blocks/PricingBlock";
import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
import { FAQBlock } from "@/components/blocks/FAQBlock";
import { StatsBlock } from "@/components/blocks/StatsBlock";
import { NewsletterBlock } from "@/components/blocks/NewsletterBlock";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/payload-types";
import { DocLayout, Section, Code } from "@/components/DocLayout";

export const metadata: Metadata = {
  title: "Design",
  description:
    "Identité de marque, blocks visuels et conventions du système de design.",
};

const samplePost: Post = {
  id: 1,
  title: "Premier article",
  slug: "premier-article",
  excerpt: "Aperçu du card de blog post.",
  cover: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const Showcase = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
    <div className="bg-background">{children}</div>
  </div>
);

export default function DesignPage() {
  return (
    <DocLayout
      current="/design"
      title="Design system"
      intro="Identité de marque pilotée depuis le CMS, blocks visuels avec palette d'apparence restreinte, et conventions pour ajouter ton propre block."
    >
      <Section title="Identité de marque" anchor="brand">
        <p>
          Le global{" "}
          <Link
            href="/admin/globals/brand"
            className="text-foreground underline"
          >
            /admin/globals/brand
          </Link>{" "}
          contrôle une palette complète + typographie + logo, injectée en CSS
          variables sur toutes les pages :
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <code className="font-mono text-foreground">--brand-primary</code>,{" "}
            <code className="font-mono text-foreground">--brand-accent</code>,{" "}
            <code className="font-mono text-foreground">--brand-secondary</code>
            , <code className="font-mono text-foreground">--brand-neutral</code>
          </li>
          <li>
            <code className="font-mono text-foreground">--brand-success</code>,{" "}
            <code className="font-mono text-foreground">--brand-warning</code>,{" "}
            <code className="font-mono text-foreground">--brand-danger</code> —
            états sémantiques
          </li>
          <li>
            <code className="font-mono text-foreground">
              --brand-background
            </code>{" "}
            /{" "}
            <code className="font-mono text-foreground">
              --brand-foreground
            </code>{" "}
            — auto-flippé en mode sombre
          </li>
          <li>
            <code className="font-mono text-foreground">
              --brand-font-heading
            </code>
            , <code className="font-mono text-foreground">--brand-font</code>,{" "}
            <code className="font-mono text-foreground">--brand-font-mono</code>{" "}
            — chargés via Google Fonts
          </li>
          <li>
            <code className="font-mono text-foreground">--brand-radius</code> —
            arrondi des cards, inputs, boutons (none / sm / md / lg)
          </li>
        </ul>
        <p>
          L'injection se fait dans{" "}
          <code className="font-mono text-foreground">{"<head>"}</code> via une
          balise
          <code className="font-mono text-foreground">{"<style>"}</code> rendue
          server-side. Voir
          <code className="font-mono text-foreground">
            {" "}
            src/lib/branding.ts
          </code>
          .
        </p>
      </Section>

      <Section title="Palette d'apparence" anchor="appearance">
        <p>
          Chaque block expose un onglet <strong>Apparence</strong> avec 4
          dimensions (palette restreinte volontaire) :
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Fond</strong> :{" "}
            <code className="font-mono text-foreground">
              default · muted · inverted · branded
            </code>
          </li>
          <li>
            <strong>Espacement vertical</strong> :{" "}
            <code className="font-mono text-foreground">
              none · sm · md · lg
            </code>
          </li>
          <li>
            <strong>Largeur max</strong> :{" "}
            <code className="font-mono text-foreground">
              narrow · normal · wide · full
            </code>
          </li>
          <li>
            <strong>Séparateur</strong> :{" "}
            <code className="font-mono text-foreground">
              none · top · bottom · both
            </code>
          </li>
        </ul>
        <p>
          Le composant{" "}
          <code className="font-mono text-foreground">{"<Section>"}</code> lit
          ces valeurs et applique des classes Tailwind. Le contributeur ne peut
          pas mettre <code className="font-mono text-foreground">#ff00ff</code>{" "}
          n'importe où : impossible de casser le brand visuellement depuis le
          CMS.
        </p>
      </Section>

      <Section title="Visibilité" anchor="visibility">
        <p>
          Onglet <strong>Visibilité</strong> partagé sur tous les blocks. 4
          leviers :
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Cacher sur mobile</strong> — applique{" "}
            <code className="font-mono text-foreground">hidden md:block</code>
          </li>
          <li>
            <strong>Langue</strong> — bloque le rendu si pas la locale courante
          </li>
          <li>
            <strong>Visible à partir de</strong> / <strong>jusqu'au</strong> —
            fenêtres temporelles, A/B tests, offres limitées
          </li>
        </ul>
        <p>
          Filtrage côté server dans{" "}
          <code className="font-mono text-foreground">RenderBlocks.tsx</code>{" "}
          via
          <code className="font-mono text-foreground"> isVisible()</code>.
        </p>
      </Section>

      <Section title="Blocks visuels" anchor="blocks">
        <p>
          Aperçu des principaux blocks rendus avec des données d'exemple. Tous
          se composent dans Pages et Snippets.
        </p>
        <div className="space-y-6">
          <Showcase label="Bannière (Hero) — variant centered">
            <HeroBlock
              variant="centered"
              eyebrow="NOUVEAU"
              title="Le boilerplate qui file"
              subtitle="Un point de départ propre, type-safe, et pensé SEO."
              cta={{ label: "Démarrer", href: "#" }}
            />
          </Showcase>

          <Showcase label="Liste de fonctionnalités (3 colonnes)">
            <FeaturesBlock
              heading="Tout ce qu'il te faut"
              intro="Trois piliers, zéro friction."
              items={[
                {
                  id: "1",
                  icon: "Zap",
                  title: "Rapide",
                  description: "Next 16 + Payload v3.",
                },
                {
                  id: "2",
                  icon: "Lock",
                  title: "Sécurisé",
                  description: "Better Auth, sessions, OAuth.",
                },
                {
                  id: "3",
                  icon: "Sparkles",
                  title: "Élégant",
                  description: "shadcn/ui + dark mode + Tailwind v4.",
                },
              ]}
            />
          </Showcase>

          <Showcase label="Bouton d'action (CTA)">
            <CTABlock
              title="Prêt à démarrer ?"
              description="Un seul make dev. Tout est prêt en 30 secondes."
              buttons={[
                {
                  id: "1",
                  label: "Documentation",
                  href: "#",
                  variant: "default",
                },
                { id: "2", label: "GitHub", href: "#", variant: "outline" },
              ]}
            />
          </Showcase>

          <Showcase label="Bandeau logos">
            <LogoCloudBlock
              heading="Ils font confiance"
              logos={[
                { logo: 1 as never, name: "Acme", id: "1" },
                { logo: 1 as never, name: "Globex", id: "2" },
                { logo: 1 as never, name: "Initech", id: "3" },
              ]}
            />
          </Showcase>

          <Showcase label="Grille tarifaire (3 paliers)">
            <PricingBlock
              heading="Tarifs"
              intro="Simple, transparent, sans surprise."
              tiers={[
                {
                  id: "1",
                  name: "Starter",
                  price: "0 €",
                  period: "/ mois",
                  features: [
                    { label: "5 projets" },
                    { label: "Support communautaire" },
                  ],
                  cta: { label: "Commencer", href: "#" },
                },
                {
                  id: "2",
                  name: "Pro",
                  price: "19 €",
                  period: "/ mois",
                  features: [
                    { label: "Projets illimités" },
                    { label: "Support prioritaire" },
                    { label: "Analytics avancés" },
                  ],
                  cta: { label: "Démarrer", href: "#" },
                  highlighted: true,
                },
                {
                  id: "3",
                  name: "Team",
                  price: "Sur devis",
                  features: [
                    { label: "Tout Pro" },
                    { label: "SSO" },
                    { label: "SLA 99.9%" },
                  ],
                  cta: { label: "Contact", href: "#" },
                },
              ]}
            />
          </Showcase>

          <Showcase label="Témoignages">
            <TestimonialsBlock
              heading="Ce qu'ils en disent"
              columns="2"
              items={[
                {
                  id: "1",
                  quote: "Le boilerplate qu'on aurait dû avoir il y a 5 ans.",
                  authorName: "Alice",
                  authorRole: "CTO, Acme",
                },
                {
                  id: "2",
                  quote: "Ranking Google explosé en 2 mois.",
                  authorName: "Bob",
                  authorRole: "Founder, Globex",
                },
              ]}
            />
          </Showcase>

          <Showcase label="FAQ — émet automatiquement JSON-LD FAQPage">
            <FAQBlock
              heading="Questions fréquentes"
              items={[
                {
                  id: "1",
                  question: "Pourquoi pas Strapi ?",
                  answer:
                    "Payload v3 est mieux intégré à Next, type-safe end-to-end, et MIT.",
                },
                {
                  id: "2",
                  question: "Et le self-host ?",
                  answer: "Oui, Docker fourni. Tu possèdes ta DB.",
                },
              ]}
            />
          </Showcase>

          <Showcase label="Chiffres clés">
            <StatsBlock
              heading="Quelques chiffres"
              items={[
                { id: "1", value: "12k+", label: "Sites déployés" },
                { id: "2", value: "99.9%", label: "Uptime" },
                { id: "3", value: "<200ms", label: "TTFB médian" },
              ]}
            />
          </Showcase>

          <Showcase label="Inscription newsletter">
            <NewsletterBlock
              heading="Reste informé"
              subtitle="Une release par mois, jamais de spam."
              placeholder="ton@email.com"
              submitLabel="S'abonner"
              successMessage="Merci !"
            />
          </Showcase>

          <Showcase label="PostCard (utilisé sur /blog)">
            <div className="container mx-auto max-w-5xl px-6 py-8">
              <div className="grid gap-6 md:grid-cols-3">
                <PostCard post={samplePost} locale="fr" />
                <PostCard
                  post={{
                    ...samplePost,
                    id: 2,
                    title: "Second article",
                    slug: "second",
                  }}
                  locale="fr"
                />
                <PostCard
                  post={{
                    ...samplePost,
                    id: 3,
                    title: "Troisième article",
                    slug: "troisieme",
                  }}
                  locale="fr"
                />
              </div>
            </div>
          </Showcase>
        </div>
      </Section>

      <Section title="Ajouter un nouveau block" anchor="add-block">
        <p>3 fichiers à créer et 1 endroit à enregistrer :</p>
        <Code>{`# 1. Schéma Payload
src/blocks/MonBlock.ts          # type: Block, fields, +appearanceField, +visibilityField

# 2. Renderer React
src/components/blocks/MonBlockBlock.tsx  # utilise <Section appearance={...}>

# 3. Exports
src/blocks/index.ts             # export { MonBlock }

# 4. Enregistrement
src/collections/Pages.ts        # ajouter à layout.blocks
src/components/blocks/RenderBlocks.tsx  # case 'monBlock': return ...

# 5. Types + migration
make types
pnpm payload migrate:create add_my_block
make payload-migrate`}</Code>
      </Section>

      <Section title="Conventions" anchor="conventions">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Toujours utiliser{" "}
            <code className="font-mono text-foreground">
              {"<Section appearance={...}>"}
            </code>{" "}
            dans un renderer — jamais de{" "}
            <code className="font-mono text-foreground">{"<section>"}</code>{" "}
            hardcodé avec padding.
          </li>
          <li>
            Marquer{" "}
            <code className="font-mono text-foreground">localized: true</code>{" "}
            sur tout champ texte affiché publiquement.
          </li>
          <li>
            Couleur : passer par{" "}
            <code className="font-mono text-foreground">
              var(--brand-primary)
            </code>
            , pas par hex en dur dans les composants.
          </li>
          <li>
            Préférer agrandir l'
            <code className="font-mono text-foreground">appearanceField</code>{" "}
            (pour TOUS les blocks) plutôt qu'ajouter un champ ad-hoc à un seul.
          </li>
          <li>
            Si un block a 2 mises en page distinctes, privilégier un champ{" "}
            <code className="font-mono text-foreground">variant</code> select
            avec switch dans le renderer.
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
