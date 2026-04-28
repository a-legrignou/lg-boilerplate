"use client";

import * as React from "react";
import { useDocumentInfo } from "@payloadcms/ui";
import {
  BLOCK_PRESETS,
  groupByCategory,
  type BlockPreset,
} from "@/templates/block-presets";

const CATEGORY_LABELS: Record<string, string> = {
  hero: "Bannières",
  features: "Features",
  cta: "CTA",
  "social-proof": "Preuve sociale",
  pricing: "Tarifs",
  content: "Contenu",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 13,
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  cursor: "pointer",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const sheet: React.CSSProperties = {
  width: "min(720px, 90vw)",
  maxHeight: "85vh",
  overflow: "auto",
  background: "var(--theme-bg)",
  border: "1px solid var(--theme-elevation-100)",
  borderRadius: 8,
  padding: 24,
};

const presetCard: React.CSSProperties = {
  padding: 12,
  borderRadius: 6,
  border: "1px solid var(--theme-elevation-100)",
  cursor: "pointer",
  transition: "border-color 0.15s, transform 0.15s",
  background: "var(--theme-elevation-50)",
};

const sectionHeader: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--theme-elevation-500)",
  margin: "16px 0 8px",
};

const BlockPresetGallery: React.FC = () => {
  const { id } = useDocumentInfo();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  if (!id) return null;

  const groups = groupByCategory();

  const insert = async (preset: BlockPreset) => {
    setPending(preset.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/append-block-preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: Number(id), presetId: preset.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || res.statusText);
      }
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
      setPending(null);
    }
  };

  return (
    <>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        + Insérer un bloc préfait
      </button>

      {open ? (
        <div style={overlay} onClick={() => setOpen(false)}>
          <div style={sheet} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                Bloc préfait
              </h2>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => setOpen(false)}
              >
                Fermer
              </button>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--theme-elevation-500)",
                margin: "0 0 8px",
              }}
            >
              Le bloc sera ajouté à la fin de la page (locale FR). Tu pourras le
              réorganiser et le personnaliser ensuite.
            </p>

            {error ? (
              <div
                style={{
                  padding: 8,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 4,
                  color: "#dc2626",
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                Erreur : {error}
              </div>
            ) : null}

            {Object.entries(groups).map(([cat, presets]) => (
              <div key={cat}>
                <div style={sectionHeader}>{CATEGORY_LABELS[cat] || cat}</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 8,
                  }}
                >
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      style={{
                        ...presetCard,
                        opacity: pending === p.id ? 0.5 : 1,
                      }}
                      onClick={() => insert(p)}
                      disabled={pending !== null}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {p.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--theme-elevation-500)",
                          textAlign: "left",
                        }}
                      >
                        {p.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <p
              style={{
                fontSize: 12,
                color: "var(--theme-elevation-500)",
                marginTop: 16,
              }}
            >
              {BLOCK_PRESETS.length} blocs disponibles. Édite la liste dans{" "}
              <code>src/templates/block-presets.ts</code>.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BlockPresetGallery;
