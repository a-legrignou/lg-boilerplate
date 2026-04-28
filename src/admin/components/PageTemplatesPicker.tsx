"use client";

import * as React from "react";

const TEMPLATES = [
  {
    id: "landing",
    name: "Landing SaaS",
    desc: "Hero + features + témoignages + pricing + CTA + FAQ",
  },
  { id: "about", name: "À propos", desc: "Hero + histoire + chiffres clés" },
  { id: "pricing-page", name: "Tarifs", desc: "Hero + grille tarifaire + FAQ" },
  { id: "article", name: "Article long", desc: "Hero compact + texte + CTA" },
];

const wrap: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  padding: "12px 0",
  borderBottom: "1px solid var(--theme-elevation-100)",
  marginBottom: 16,
  alignItems: "center",
};

const button: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 13,
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  cursor: "pointer",
};

const PageTemplatesPicker: React.FC = () => {
  const [pending, setPending] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);

  const create = async (id: string) => {
    setPending(id);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/page-from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        id?: number;
        error?: string;
      };
      if (!res.ok || !body.id) {
        setMsg(`Erreur : ${body.error ?? res.statusText}`);
      } else {
        window.location.href = `/admin/collections/pages/${body.id}`;
      }
    } catch {
      setMsg("Erreur réseau");
    } finally {
      setPending(null);
    }
  };

  return (
    <div style={wrap}>
      <span
        style={{
          fontSize: 12,
          color: "var(--theme-elevation-500)",
          marginRight: 4,
        }}
      >
        Démarrer depuis un template :
      </span>
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          disabled={pending !== null}
          onClick={() => create(t.id)}
          title={t.desc}
          style={button}
        >
          {pending === t.id ? "…" : `+ ${t.name}`}
        </button>
      ))}
      {msg ? (
        <span style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>
          {msg}
        </span>
      ) : null}
    </div>
  );
};

export default PageTemplatesPicker;
