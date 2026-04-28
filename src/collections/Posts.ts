import type { CollectionConfig } from "payload";
import { revalidateOnDelete, revalidatePost } from "../lib/revalidate";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import { validateHeadings } from "../lib/heading-validator";
import {
  slugField,
  coverField,
  authorField,
  tagsField,
  excerptField,
  seoOverrideFields,
} from "../lib/fields";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Article", plural: "Articles" },
  hooks: {
    afterChange: [revalidatePost],
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
        ],
      },
    },
  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: {
    drafts: {
      autosave: { interval: 2500 },
    },
  },
  fields: [
    slugField({ source: "title" }),
    coverField(),
    authorField(),
    tagsField({
      sidebar: true,
      description:
        "Tags pour related posts + catégorisation + filtrage. Format kebab-case recommandé. Sert aussi de taxonomie (pas de collection séparée).",
    }),
    ...seoOverrideFields(),
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
            excerptField(),
            {
              name: "content",
              type: "richText",
              localized: true,
              label: "Contenu",
              validate: ((value: unknown) => {
                const err = validateHeadings(
                  value as SerializedEditorState | null,
                );
                return err ?? true;
              }) as never,
            },
          ],
        },
      ],
    },
  ],
};
