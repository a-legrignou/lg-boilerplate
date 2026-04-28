"use client";

import * as React from "react";

const wrap: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  display: "flex",
  gap: 6,
  padding: 6,
  background: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  zIndex: 50,
  opacity: 0,
  transition: "opacity 0.15s",
  pointerEvents: "none",
  backdropFilter: "blur(6px)",
};

const wrapVisible: React.CSSProperties = {
  ...wrap,
  opacity: 1,
  pointerEvents: "auto",
};

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 10px",
  fontSize: 12,
  fontWeight: 500,
  border: "none",
  borderRadius: 4,
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "system-ui, sans-serif",
};

const btnDanger: React.CSSProperties = {
  ...btn,
  background: "rgba(239,68,68,0.3)",
};

type Props = {
  pageId: number;
  index: number;
  total: number;
  locale: "fr" | "en";
};

export const LiveEditOverlay: React.FC<Props> = ({
  pageId,
  index,
  total,
  locale,
}) => {
  const [hover, setHover] = React.useState(false);
  const [pending, setPending] = React.useState<string | null>(null);

  React.useEffect(() => {
    const parent = document.querySelector(
      `[data-block-index="${index}"]`,
    ) as HTMLElement | null;
    if (!parent) return;
    const onEnter = () => setHover(true);
    const onLeave = () => setHover(false);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  const call = async (path: string, body: object) => {
    setPending(path);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, locale, ...body }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || res.statusText);
      }
      window.location.reload();
    } catch (e) {
      alert(`Erreur : ${(e as Error).message}`);
      setPending(null);
    }
  };

  return (
    <div style={hover ? wrapVisible : wrap}>
      <a
        href={`/admin/collections/pages/${pageId}`}
        target="_top"
        style={btn}
        title="Éditer dans l'admin"
      >
        ✏ Éditer
      </a>
      <button
        type="button"
        style={{ ...btn, opacity: index === 0 ? 0.4 : 1 }}
        disabled={index === 0 || pending !== null}
        onClick={() =>
          call("/api/admin/block/move", { index, direction: "up" })
        }
        title="Monter"
      >
        ↑
      </button>
      <button
        type="button"
        style={{ ...btn, opacity: index === total - 1 ? 0.4 : 1 }}
        disabled={index === total - 1 || pending !== null}
        onClick={() =>
          call("/api/admin/block/move", { index, direction: "down" })
        }
        title="Descendre"
      >
        ↓
      </button>
      <button
        type="button"
        style={btnDanger}
        disabled={pending !== null}
        onClick={() => {
          if (confirm("Supprimer ce bloc ?"))
            call("/api/admin/block/remove", { index });
        }}
        title="Supprimer"
      >
        🗑
      </button>
    </div>
  );
};

export const LiveEditBanner: React.FC<{ pageId: number }> = ({ pageId }) => {
  const exit = async () => {
    await fetch("/api/preview", { method: "DELETE" });
    window.location.reload();
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(15, 23, 42, 0.95)",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
      }}
    >
      <span
        style={{ width: 8, height: 8, borderRadius: 4, background: "#f59e0b" }}
      />
      <span>Mode édition · survole une section</span>
      <a
        href={`/admin/collections/pages/${pageId}`}
        target="_top"
        style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 500 }}
      >
        Ouvrir l'admin →
      </a>
      <button
        type="button"
        style={{
          background: "transparent",
          color: "#737373",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
        }}
        onClick={exit}
        title="Quitter"
      >
        ×
      </button>
    </div>
  );
};
