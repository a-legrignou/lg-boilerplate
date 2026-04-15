/**
 * Types — structures de données Directus
 * ===================================================
 * Source de vérité pour tous les objets manipulés côté front.
 * Chaque type correspond à une collection Directus.
 */

// ─── Auth ──────────────────────────────────────────────────────────────────────

/** Niveau d'accès au contenu d'un utilisateur */
export type UserTier = "public" | "community" | "premium";

/** Valeur du champ `tier` sur un post */
export type PostTier = "community" | "premium" | null;

// ─── Primitives Directus ───────────────────────────────────────────────────────

export interface DirectusFile {
  id: string;
  width?: number;
  height?: number;
  filename_download?: string;
}

export interface DirectusRole {
  id: string;
  name: string;
}

export interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: DirectusRole;
}

// ─── Blog ──────────────────────────────────────────────────────────────────────

export interface PostCategory {
  id: string;
  title: string;
}

export interface PostAuthor {
  post_authors_id?: {
    name: string;
    role?: string;
  };
}

export interface PostSource {
  organisation?: string;
  reference?: string;
  path?: string;
  date?: string;
}

export type PostBlockType = "text" | "heading" | "quote" | "image" | "cta" | "exemple";

export interface PostBlockText {
  type: "text";
  content: string;
}

export interface PostBlockHeading {
  type: "heading";
  title?: string;
  content?: string;
}

export interface PostBlockQuote {
  type: "quote";
  caption: string;
}

export interface PostBlockImage {
  type: "image";
  image: string;
  caption?: string;
}

export interface PostBlockCta {
  type: "cta";
  title?: string;
  content?: string;
  label?: string;
  path?: string;
}

export type PostBlock = PostBlockText | PostBlockHeading | PostBlockQuote | PostBlockImage | PostBlockCta;

/** Post (article de blog) */
export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  image?: string;
  slug?: string;
  tier?: PostTier;
  status: string;
  date_created: string;
  readtime?: number;
  views?: number;
  category?: PostCategory;
  authors?: PostAuthor[];
  sources?: PostSource[];
  blocks?: PostBlock[];
}

// ─── Navigation ────────────────────────────────────────────────────────────────

export interface MenuChild {
  id: number | string;
  label: string;
  path: string;
  sort: number;
  active: boolean;
}

export interface MenuItem extends MenuChild {
  parent: number | string | null;
  children?: MenuChild[];
}

// ─── Site Settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  site_name?: string;
  logo?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  [key: string]: unknown;
}

// ─── Études de cas ─────────────────────────────────────────────────────────────

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  client_sector?: string;
  client_size?: string;
  tags?: string[];
  keywords?: string[];
  eyebrow?: string;
  label?: string;
  cta_label?: string;
  image?: DirectusFile;
  status: string;
  date_created: string;
}

// ─── Équipe ────────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  role?: string;
  short_description?: string;
  image?: DirectusFile;
  sort?: number;
  /** Champ normalisé : `first_name + last_name` */
  title: string;
  /** Champ normalisé : alias de `role` */
  subtitle?: string | null;
}

// ─── Produits ──────────────────────────────────────────────────────────────────

export interface ProductModule {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  image?: DirectusFile;
  [key: string]: unknown;
}

export interface ProductLine {
  id: string;
  title: string;
  slug: string;
  sort?: number;
  status: string;
  modules: ProductModule[];
}

// ─── Maintenance ───────────────────────────────────────────────────────────────

export interface Maintenance {
  status?: boolean;
  title?: string;
  message?: string;
  return_date?: string | null;
  image?: string;
  contact_mail?: string;
}

// ─── Pages & Sections ──────────────────────────────────────────────────────────

/** Valeurs du champ `status` sur les sections (contrôle d'environnement) */
export type SectionStatus = "prod" | "dev" | "draft" | "published" | "archived";

export interface Section {
  id: string;
  status: SectionStatus;
  slug?: string;
  title?: string;
  description?: string;
  image?: DirectusFile | string;
  blocks?: SectionBlock[];
  [key: string]: unknown;
}

export interface SectionBlock {
  collection: string;
  item: Record<string, unknown>;
}

export interface Page {
  id: string;
  slug: string;
  title?: string;
  sections?: Section[];
  date_updated?: string;
  priority?: number;
}
