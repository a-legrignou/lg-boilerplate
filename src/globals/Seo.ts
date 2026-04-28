import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/revalidate";
import { isAdminOrEditor } from "../lib/access";

export const Seo: GlobalConfig = {
  slug: "seo",
  label: "Référencement (SEO)",
  admin: {
    group: "Configuration",
    description:
      'Métadonnées SEO par défaut du site (titre, description, OG, social, robots, sitemap, analytics). À ne pas confondre avec l\'onglet "SEO" de chaque page/article qui sert à surcharger pour un doc précis.',
  },
  hooks: { afterChange: [revalidateGlobal] },
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Métadonnées",
          fields: [
            {
              name: "titleTemplate",
              type: "text",
              localized: true,
              defaultValue: "%s — %siteName%",
              label: "Template de titre",
              admin: {
                description:
                  "Use %s pour le titre de la page et %siteName% pour le nom du site.",
              },
            },
            {
              name: "defaultOgImage",
              type: "upload",
              relationTo: "media",
              label: "Image OG par défaut",
              admin: {
                description:
                  "Image affichée en aperçu sur les réseaux sociaux quand un doc n'a pas la sienne. Format conseillé : 1200×630.",
              },
            },
            {
              name: "favicon",
              type: "upload",
              relationTo: "media",
              label: "Favicon",
            },
          ],
        },
        {
          label: "Réseaux sociaux",
          fields: [
            {
              name: "social",
              type: "group",
              label: "Comptes sociaux (handles, sans @)",
              fields: [
                { name: "twitter", type: "text", label: "Twitter / X" },
                { name: "github", type: "text", label: "GitHub" },
                {
                  name: "linkedin",
                  type: "text",
                  label: "LinkedIn (handle ou /company/...)",
                },
                { name: "instagram", type: "text", label: "Instagram" },
                { name: "facebook", type: "text", label: "Facebook (page id)" },
                {
                  name: "youtube",
                  type: "text",
                  label: "YouTube (handle ou /channel/...)",
                },
                {
                  name: "mastodon",
                  type: "text",
                  label: "Mastodon (URL complète)",
                },
              ],
            },
          ],
        },
        {
          label: "Organisation (JSON-LD)",
          fields: [
            {
              name: "organization",
              type: "group",
              label: "Données Organisation",
              admin: {
                description:
                  "Utilisé pour le JSON-LD Organization (Knowledge Graph Google).",
              },
              fields: [
                { name: "legalName", type: "text", label: "Nom légal" },
                {
                  name: "foundingDate",
                  type: "date",
                  label: "Date de création",
                  admin: { date: { pickerAppearance: "dayOnly" } },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "contactEmail",
                      type: "email",
                      label: "Email contact",
                    },
                    {
                      name: "contactPhone",
                      type: "text",
                      label: "Téléphone contact",
                    },
                  ],
                },
                {
                  name: "contactType",
                  type: "select",
                  defaultValue: "customer support",
                  label: "Type de contact",
                  options: [
                    { label: "Support client", value: "customer support" },
                    { label: "Ventes", value: "sales" },
                    { label: "Presse", value: "press" },
                    { label: "Recrutement", value: "recruitment" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Vérifications",
          fields: [
            {
              name: "verifications",
              type: "group",
              label: "Codes de vérification",
              admin: {
                description:
                  "Balises meta pour vérifier la propriété du site auprès des moteurs.",
              },
              fields: [
                {
                  name: "google",
                  type: "text",
                  label: "Google Search Console",
                },
                { name: "bing", type: "text", label: "Bing Webmaster" },
                { name: "yandex", type: "text", label: "Yandex Webmaster" },
                { name: "pinterest", type: "text", label: "Pinterest" },
              ],
            },
          ],
        },
        {
          label: "Robots & sitemap",
          fields: [
            {
              name: "robotsExtra",
              type: "textarea",
              label: "Règles robots.txt supplémentaires",
              admin: {
                description:
                  "Lignes ajoutées à la fin du robots.txt généré (ex : Disallow: /private/).",
                rows: 6,
              },
            },
            {
              name: "sitemapExclude",
              type: "array",
              label: "Slugs à exclure du sitemap",
              labels: { singular: "Pattern", plural: "Patterns" },
              admin: {
                description:
                  'Glob simple sur le slug : "draft-*", "promo-2024", etc.',
              },
              fields: [{ name: "pattern", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Analytics",
          fields: [
            {
              name: "analytics",
              type: "group",
              label: "Outils analytics",
              admin: {
                description:
                  "Le bandeau de consentement contrôle l'activation côté front.",
              },
              fields: [
                {
                  name: "plausibleDomain",
                  type: "text",
                  label: "Plausible — domaine",
                },
                {
                  name: "plausibleScript",
                  type: "text",
                  label: "Plausible — URL du script",
                  admin: {
                    description:
                      "Optionnel. Par défaut https://plausible.io/js/script.js",
                  },
                },
                {
                  name: "gtmId",
                  type: "text",
                  label: "Google Tag Manager (GTM-XXXX)",
                },
                { name: "ga4Id", type: "text", label: "GA4 (G-XXXX)" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
