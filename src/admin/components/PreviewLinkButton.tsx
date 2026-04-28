"use client";

import * as React from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  cursor: "pointer",
  textDecoration: "none",
};

/**
 * Ouvre la page courante (draft) dans un nouvel onglet.
 * Marche sur tous les navigateurs (Firefox inclus) car c'est un onglet top-level,
 * pas une iframe. Le LiveEditOverlay s'active automatiquement en draft mode.
 */
const PreviewLinkButton: React.FC = () => {
  const info = useDocumentInfo();
  const collectionSlug = info?.collectionSlug;
  const id = info?.id;

  // On lit le slug courant via le formulaire (pas via info, qui peut être stale)
  const slug = useFormFields(
    ([fields]) => (fields?.slug?.value as string | undefined) ?? "",
  );

  if (!id || (collectionSlug !== "pages" && collectionSlug !== "posts"))
    return null;
  if (!slug) {
    return (
      <span
        style={{ ...buttonStyle, opacity: 0.5, cursor: "not-allowed" }}
        title="Renseigne un slug pour activer la preview"
      >
        Aperçu (slug manquant)
      </span>
    );
  }

  const path =
    collectionSlug === "pages"
      ? slug === "home"
        ? "/"
        : `/${slug}`
      : `/blog/${slug}`;

  const href = `/api/preview?path=${encodeURIComponent(path)}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" style={buttonStyle}>
      Aperçu (nouvel onglet)
    </a>
  );
};

export default PreviewLinkButton;
