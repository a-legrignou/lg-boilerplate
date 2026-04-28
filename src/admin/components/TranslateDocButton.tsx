"use client";

import * as React from "react";
import { useDocumentInfo } from "@payloadcms/ui";

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 13,
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  cursor: "pointer",
};

const disabledStyle: React.CSSProperties = {
  ...buttonStyle,
  cursor: "not-allowed",
  opacity: 0.5,
};

type Status = { provider: "anthropic" | "openai" | "none"; ok: boolean };

const TranslateDocButton: React.FC = () => {
  const info = useDocumentInfo();
  const collectionSlug = info?.collectionSlug;
  const id = info?.id;

  const [status, setStatus] = React.useState<Status | null>(null);
  const [pending, setPending] = React.useState<"fr-en" | "en-fr" | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/translate")
      .then((r) => r.json())
      .then((data) => setStatus(data as Status))
      .catch(() => setStatus({ provider: "none", ok: false }));
  }, []);

  if (!id || (collectionSlug !== "pages" && collectionSlug !== "posts"))
    return null;

  const run = async (from: "fr" | "en", to: "fr" | "en") => {
    setPending(`${from}-${to}` as "fr-en" | "en-fr");
    setMsg(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: collectionSlug,
          id: typeof id === "string" ? Number(id) : id,
          from,
          to,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        ok?: boolean;
        provider?: string;
      };
      if (!res.ok || !body.ok) {
        setMsg(`Erreur : ${body.message ?? body.error ?? res.statusText}`);
      } else {
        setMsg(
          `Traduit vers ${to.toUpperCase()} (${body.provider}). Recharge pour voir.`,
        );
      }
    } catch {
      setMsg("Erreur réseau");
    } finally {
      setPending(null);
    }
  };

  // Loading ou pas de provider : on n'affiche rien (UX silencieuse)
  if (status === null || status.provider === "none") return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "8px 0",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>
        Traduire :
      </span>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => run("fr", "en")}
        style={pending !== null ? disabledStyle : buttonStyle}
      >
        {pending === "fr-en" ? "En cours…" : "FR → EN"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => run("en", "fr")}
        style={pending !== null ? disabledStyle : buttonStyle}
      >
        {pending === "en-fr" ? "En cours…" : "EN → FR"}
      </button>
      {msg ? (
        <span style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>
          {msg}
        </span>
      ) : null}
    </div>
  );
};

export default TranslateDocButton;
