import { createDirectus, rest, staticToken } from "@directus/sdk";

// Client public — lecture seule, sans authentification (collections publiques Directus)
export const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL).with(rest());

// Client admin — écriture serveur uniquement (contact_messages, post_views)
// Ne jamais exposer côté client — utiliser uniquement dans les routes API et Server Components
export const directusAdmin = createDirectus(process.env.DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_API_KEY ?? ""))
  .with(rest());
