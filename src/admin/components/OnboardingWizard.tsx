"use client";

import * as React from "react";

const PRESETS: {
  id: string;
  label: string;
  primary: string;
  accent: string;
  bg: string;
  fg: string;
  font: string;
}[] = [
  {
    id: "modern",
    label: "Modern",
    primary: "#6366f1",
    accent: "#22d3ee",
    bg: "#ffffff",
    fg: "#0f172a",
    font: "Inter",
  },
  {
    id: "editorial",
    label: "Editorial",
    primary: "#0f172a",
    accent: "#f59e0b",
    bg: "#fefefe",
    fg: "#1e293b",
    font: "Lora",
  },
  {
    id: "bold",
    label: "Bold",
    primary: "#000000",
    accent: "#a3e635",
    bg: "#ffffff",
    fg: "#000000",
    font: "Space Grotesk",
  },
  {
    id: "minimal",
    label: "Minimal",
    primary: "#171717",
    accent: "#737373",
    bg: "#ffffff",
    fg: "#0a0a0a",
    font: "Geist",
  },
  {
    id: "warm",
    label: "Warm",
    primary: "#c2410c",
    accent: "#f59e0b",
    bg: "#fefcf9",
    fg: "#1c1917",
    font: "Manrope",
  },
];

const wrap: React.CSSProperties = {
  padding: "32px",
  border: "1px solid var(--theme-elevation-100)",
  borderRadius: 8,
  background: "var(--theme-elevation-50)",
  marginBottom: 24,
};
const h1: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  margin: "0 0 8px",
};
const subtle: React.CSSProperties = {
  color: "var(--theme-elevation-500)",
  margin: "0 0 24px",
  fontSize: 14,
};
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};
const presetCard = (selected: boolean): React.CSSProperties => ({
  padding: 16,
  borderRadius: 8,
  border: `2px solid ${selected ? "var(--theme-success-500, #10b981)" : "var(--theme-elevation-100)"}`,
  cursor: "pointer",
  background: "var(--theme-bg)",
  transition: "border-color 0.15s",
});
const swatchRow: React.CSSProperties = {
  display: "flex",
  gap: 4,
  marginBottom: 12,
};
const swatch = (color: string): React.CSSProperties => ({
  width: 24,
  height: 24,
  borderRadius: 4,
  background: color,
  border: "1px solid rgba(0,0,0,0.08)",
});
const formField: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 16,
};
const label: React.CSSProperties = { fontSize: 13, fontWeight: 500 };
const input: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  fontSize: 14,
};
const textarea: React.CSSProperties = {
  ...input,
  minHeight: 80,
  fontFamily: "inherit",
  resize: "vertical",
};
const buttonRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24,
  gap: 12,
};
const btn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 4,
  border: "1px solid var(--theme-elevation-200)",
  background: "var(--theme-elevation-100)",
  color: "var(--theme-text)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
};
const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "var(--theme-success-500, #10b981)",
  color: "#fff",
  borderColor: "transparent",
};
const stepDots: React.CSSProperties = {
  display: "flex",
  gap: 6,
  marginBottom: 16,
};
const dot = (active: boolean): React.CSSProperties => ({
  width: 24,
  height: 4,
  borderRadius: 2,
  background: active
    ? "var(--theme-success-500, #10b981)"
    : "var(--theme-elevation-200)",
});

export const OnboardingWizard: React.FC<{ onDone: () => void }> = ({
  onDone,
}) => {
  const [step, setStep] = React.useState<0 | 1 | 2>(0);
  const [preset, setPreset] = React.useState("modern");
  const [siteName, setSiteName] = React.useState("");
  const [siteDescription, setSiteDescription] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canNext0 = preset !== "";
  const canNext1 = siteName.trim().length > 0;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preset,
          siteName: siteName.trim(),
          siteDescription: siteDescription.trim(),
          contactEmail: contactEmail.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "failed");
      }
      onDone();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={wrap}>
      <div style={stepDots}>
        <div style={dot(step >= 0)} />
        <div style={dot(step >= 1)} />
        <div style={dot(step >= 2)} />
      </div>

      {step === 0 && (
        <div>
          <h1 style={h1}>Bienvenue dans Folio.</h1>
          <p style={subtle}>
            Choisis une identité visuelle de départ. Tu pourras tout
            personnaliser ensuite dans Identité de marque.
          </p>
          <div style={grid}>
            {PRESETS.map((p) => (
              <div
                key={p.id}
                onClick={() => setPreset(p.id)}
                style={presetCard(preset === p.id)}
              >
                <div style={swatchRow}>
                  <div style={swatch(p.primary)} />
                  <div style={swatch(p.accent)} />
                  <div style={swatch(p.bg)} />
                  <div style={swatch(p.fg)} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.label}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--theme-elevation-500)",
                    marginTop: 4,
                  }}
                >
                  {p.font}
                </div>
              </div>
            ))}
          </div>
          <div style={buttonRow}>
            <span />
            <button
              style={btnPrimary}
              disabled={!canNext0}
              onClick={() => setStep(1)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 style={h1}>Identité du site</h1>
          <p style={subtle}>
            Le minimum vital pour que les pages soient correctement intitulées
            et indexées.
          </p>

          <div style={formField}>
            <label style={label} htmlFor="ob-name">
              Nom du site *
            </label>
            <input
              id="ob-name"
              style={input}
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Ex: Acme Studio"
              autoFocus
            />
          </div>

          <div style={formField}>
            <label style={label} htmlFor="ob-desc">
              Description courte
            </label>
            <textarea
              id="ob-desc"
              style={textarea}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Phrase d'accroche utilisée comme description SEO par défaut."
            />
          </div>

          <div style={formField}>
            <label style={label} htmlFor="ob-email">
              Email de contact (optionnel)
            </label>
            <input
              id="ob-email"
              type="email"
              style={input}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@acme.com"
            />
          </div>

          <div style={buttonRow}>
            <button style={btn} onClick={() => setStep(0)}>
              ← Retour
            </button>
            <button
              style={btnPrimary}
              disabled={!canNext1}
              onClick={() => setStep(2)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 style={h1}>Récapitulatif</h1>
          <p style={subtle}>
            Tu peux modifier tout ça plus tard dans Identité de marque,
            Paramètres et SEO.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "8px 16px",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ color: "var(--theme-elevation-500)" }}>Preset</div>
            <div style={{ fontWeight: 500 }}>
              {PRESETS.find((p) => p.id === preset)?.label}
            </div>
            <div style={{ color: "var(--theme-elevation-500)" }}>
              Nom du site
            </div>
            <div style={{ fontWeight: 500 }}>{siteName}</div>
            {siteDescription ? (
              <>
                <div style={{ color: "var(--theme-elevation-500)" }}>
                  Description
                </div>
                <div>{siteDescription}</div>
              </>
            ) : null}
            {contactEmail ? (
              <>
                <div style={{ color: "var(--theme-elevation-500)" }}>
                  Email contact
                </div>
                <div>{contactEmail}</div>
              </>
            ) : null}
          </div>

          {error ? (
            <div
              style={{
                padding: 12,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 4,
                color: "#dc2626",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              Erreur : {error}
            </div>
          ) : null}

          <div style={buttonRow}>
            <button
              style={btn}
              onClick={() => setStep(1)}
              disabled={submitting}
            >
              ← Retour
            </button>
            <button style={btnPrimary} onClick={submit} disabled={submitting}>
              {submitting ? "Application…" : "Appliquer et démarrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const OnboardingWizardClient: React.FC = () => {
  const [done, setDone] = React.useState(false);
  if (done) {
    return (
      <div style={{ ...wrap, textAlign: "center", padding: 48 }}>
        <h1 style={h1}>C'est prêt.</h1>
        <p style={subtle}>
          Recharge la page pour voir le tableau de bord avec tes nouveaux
          paramètres.
        </p>
        <button style={btnPrimary} onClick={() => window.location.reload()}>
          Recharger
        </button>
      </div>
    );
  }
  return <OnboardingWizard onDone={() => setDone(true)} />;
};

export default OnboardingWizardClient;
