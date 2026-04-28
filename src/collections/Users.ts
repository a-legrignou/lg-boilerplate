import type { CollectionConfig } from "payload";
import { isAdmin } from "../lib/access";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Utilisateur", plural: "Utilisateurs" },
  admin: {
    group: "Comptes",
    useAsTitle: "email",
    description:
      "Comptes Payload (admin/staff). Distinct des app users (Better Auth).",
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== "admin",
  },
  auth: {
    useAPIKey: true,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if ((user as { role?: string }).role === "service") {
          throw new Error(
            "Les comptes de service ne peuvent pas se connecter via le web. Utilise l'API key.",
          );
        }
        return user;
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Auto-slug from name or email if not set
        if (!data.slug && (data.name || data.email)) {
          data.slug = slugify(
            data.name || (data.email as string).split("@")[0],
          );
        }
        return data;
      },
    ],
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Compte",
          fields: [
            { name: "name", type: "text", label: "Nom" },
            {
              name: "role",
              type: "select",
              required: true,
              defaultValue: "admin",
              label: "Rôle",
              admin: {
                description:
                  "admin = tout · editor = contenu sans Users/Brand · service = API only",
              },
              options: [
                { label: "Admin (tout)", value: "admin" },
                { label: "Éditeur (contenu)", value: "editor" },
                { label: "Service (API only)", value: "service" },
              ],
              access: {
                update: ({ req }) =>
                  (req.user as { role?: string } | null)?.role === "admin",
              },
            },
          ],
        },
        {
          label: "Profil auteur",
          description:
            "Affiché sur les articles signés et la page /auteur/[slug].",
          fields: [
            {
              name: "slug",
              type: "text",
              unique: true,
              label: "Slug profil",
              admin: { description: "Auto-généré depuis le nom. Modifiable." },
            },
            {
              name: "bio",
              type: "textarea",
              label: "Bio courte (1-2 phrases)",
            },
            {
              name: "avatar",
              type: "upload",
              relationTo: "media",
              label: "Avatar",
            },
            {
              name: "socials",
              type: "group",
              label: "Réseaux",
              fields: [
                {
                  name: "website",
                  type: "text",
                  label: "Site web (URL complète)",
                },
                {
                  name: "twitter",
                  type: "text",
                  label: "Twitter / X (handle sans @)",
                },
                { name: "linkedin", type: "text", label: "LinkedIn (handle)" },
                { name: "github", type: "text", label: "GitHub (handle)" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
