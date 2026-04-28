import type { CollectionConfig } from "payload";
import {
  Hero,
  Features,
  CTA,
  RichTextBlock,
  Group,
  LogoCloud,
  Pricing,
  Testimonials,
  FAQ,
  Stats,
  SnippetReference,
  FormReference,
  Newsletter,
} from "../blocks";
import { revalidateOnDelete, revalidatePage } from "../lib/revalidate";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateOnDelete],
  },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    components: {
      edit: {
        beforeDocumentControls: [
          "/admin/components/PreviewLinkButton",
          "/admin/components/TranslateDocButton",
          "/admin/components/BlockPresetGallery",
        ],
      },
      beforeListTable: ["/admin/components/PageTemplatesPicker"],
    },
    // Note: pas de `livePreview` (iframe) — bloqué par Firefox sur les cookies same-origin.
    // À la place, le bouton PreviewLinkButton ouvre un nouvel onglet draft-mode avec
    // le LiveEditOverlay activé directement dans le contexte top-level.
  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: {
    drafts: { autosave: { interval: 2500 } },
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      localized: true,
      admin: {
        position: "sidebar",
        description:
          'URL ("home" pour la landing, "a-propos" pour /a-propos, etc.)',
      },
    },
    {
      name: "noindex",
      type: "checkbox",
      label: "Ne pas indexer",
      admin: {
        position: "sidebar",
        description:
          'Ajoute <meta name="robots" content="noindex"> et exclut du sitemap.',
      },
    },
    {
      name: "canonical",
      type: "text",
      label: "URL canonique (override)",
      admin: {
        position: "sidebar",
        description: "Optionnel. Override la canonical auto-générée.",
      },
    },
    {
      name: "customCss",
      type: "code",
      label: "CSS de la page",
      admin: {
        language: "css",
        description:
          "Optionnel. Injecté uniquement sur cette page, après le CSS global de Brand.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenu",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: "Titre",
            },
            {
              name: "layout",
              type: "blocks",
              label: "Sections",
              blocks: [
                Hero,
                Features,
                CTA,
                RichTextBlock,
                Group,
                LogoCloud,
                Pricing,
                Testimonials,
                FAQ,
                Stats,
                SnippetReference,
                FormReference,
                Newsletter,
              ],
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};
