import * as React from "react";

/**
 * Petit Logo monogramme "F" pour la nav Payload.
 * - viewBox 24×24 (taille standard Lucide).
 * - Pas de width/height fixes : laisse Payload contrôler la taille via CSS.
 * - currentColor : suit la couleur du texte de la nav (light + dark mode).
 */
const FolioIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", maxWidth: 28, maxHeight: 28 }}
    aria-hidden
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      fill="currentColor"
      opacity="0.1"
    />
    <path
      d="M8.5 6.5h7M8.5 12h5M8.5 6.5v11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FolioIcon;
