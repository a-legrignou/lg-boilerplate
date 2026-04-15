/**
 * filters.js
 * ==========
 * Constantes de filtres partagées entre les composants de grille.
 *
 * Centraliser ici évite de dupliquer ces tableaux dans GridBlog,
 * GridExpertises et tout futur composant filtré.
 */

import { Globe, Users, Crown } from "lucide-react";

// ─── Blog ─────────────────────────────────────────────────────────────────────

/** Filtres par tier pour la grille d'articles. */
export const BLOG_TIER_FILTERS = [
  { value: "all",       label: "Tous",      Icon: Globe  },
  { value: "community", label: "Community", Icon: Users  },
  { value: "premium",   label: "Premium",   Icon: Crown  },
];

// ─── Expertises ───────────────────────────────────────────────────────────────

/** Filtres par axe stratégique pour la grille d'expertises. */
export const EXPERTISE_AXE_FILTERS = [
  { value: "all",        label: "Toutes expertises"  },
  { value: "growth",     label: "Développement"      },
  { value: "resilience", label: "Sécurité économique" },
];

/** Filtres par persona cible pour la grille d'expertises. */
export const EXPERTISE_PERSONA_FILTERS = [
  { value: "all",           label: "Tous profils"  },
  { value: "dirigeants",    label: "Dirigeants"    },
  { value: "investisseurs", label: "Investisseurs" },
];
