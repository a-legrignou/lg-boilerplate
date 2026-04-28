import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type {
  GenerateTitle,
  GenerateDescription,
  GenerateURL,
} from "@payloadcms/plugin-seo/types";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Pages } from "./collections/Pages";
import { Snippets } from "./collections/Snippets";
import { Team } from "./collections/Team";
import { Products } from "./collections/Products";
import { CaseStudies } from "./collections/CaseStudies";
import { Header, Footer, Settings, Seo, Brand } from "./globals";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const generateTitle: GenerateTitle = ({ doc }) =>
  doc?.title ? `${doc.title} — Folio` : "Folio";
const generateDescription: GenerateDescription = ({ doc }) =>
  doc?.excerpt || doc?.subtitle || "";
const generateURL: GenerateURL = ({ doc, collectionSlug }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (collectionSlug === "pages") {
    return doc?.slug === "home" ? base : `${base}/${doc?.slug ?? ""}`;
  }
  if (collectionSlug === "posts") return `${base}/blog/${doc?.slug ?? ""}`;
  if (collectionSlug === "case-studies")
    return `${base}/cas/${doc?.slug ?? ""}`;
  if (collectionSlug === "products") return `${base}/offres/${doc?.slug ?? ""}`;
  if (collectionSlug === "team") return `${base}/equipe/${doc?.slug ?? ""}`;
  return base;
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ["/admin/BeforeDashboard"],
      graphics: {
        Logo: "/admin/components/FolioLogo",
        Icon: "/admin/components/FolioIcon",
      },
    },
    meta: {
      titleSuffix: "— Folio",
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Snippets,
    CaseStudies,
    Products,
    Team,
  ],
  globals: [Header, Footer, Settings, Seo, Brand],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  localization: {
    locales: [
      { code: "fr", label: "Français" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    push: false,
  }),
  plugins: [
    seoPlugin({
      collections: ["pages", "posts", "case-studies", "products", "team"],
      uploadsCollection: "media",
      generateTitle,
      generateDescription,
      generateURL,
      tabbedUI: true,
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          "name" in field &&
          (field.name === "title" || field.name === "description")
            ? { ...field, localized: true }
            : field,
        ),
    }),
    redirectsPlugin({
      collections: ["pages", "posts", "case-studies", "products", "team"],
      overrides: {
        admin: {
          group: "Marketing",
          description:
            "301/302 pour les anciennes URLs après changement de slug.",
        },
      },
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        state: false,
        country: false,
        checkbox: true,
        number: true,
        message: true,
      },
      formOverrides: {
        admin: {
          group: "Marketing",
          description:
            'Constructeur de formulaires. Les soumissions apparaissent dans "Soumissions".',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: "Marketing",
        },
      } as never,
    }),
  ],
  sharp,
});
