import * as React from "react";

/**
 * Logo affiché sur l'écran de connexion Payload.
 * Matche le monogramme du FolioIcon. Couleurs en currentColor (suivent le thème admin).
 */
const FolioLogo: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      paddingBlock: 16,
      color: "var(--theme-text)",
    }}
  >
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      aria-hidden
    >
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="14"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M22 18h22M22 32h16M22 18v30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "-0.02em",
      }}
    >
      Folio
    </div>
    <div
      style={{
        fontSize: 12,
        color: "var(--theme-elevation-500)",
        letterSpacing: "0.01em",
      }}
    >
      Le boilerplate Next + Payload
    </div>
  </div>
);

export default FolioLogo;
