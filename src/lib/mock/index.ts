/**
 * mock/index.ts
 * =============
 * Fonctions mock avec les mêmes signatures que les modèles Directus.
 * Retournent les données de base de src/lib/mock/data.ts.
 */

import type { Post, CaseStudy, Member, ProductModule } from "@/lib/types";
import {
  MOCK_SETTINGS,
  MOCK_TOP_MENU,
  MOCK_FOOTER_MENU,
  MOCK_FOOTER_CONTACT_MENU,
  MOCK_PRODUCTS,
  MOCK_POSTS,
  MOCK_CASES,
  MOCK_MEMBERS,
} from "./data";

export const getMockSiteSettings  = async () => MOCK_SETTINGS;
export const getMockTopMenu        = async () => MOCK_TOP_MENU;
export const getMockFooterMenu     = async () => MOCK_FOOTER_MENU;
export const getMockFooterContactMenu = async () => MOCK_FOOTER_CONTACT_MENU;

export const getMockAllModules     = async () => MOCK_PRODUCTS as ProductModule[];
export const getMockModuleBySlug   = async (slug: string) =>
  (MOCK_PRODUCTS.find((m) => m.slug === slug) ?? null) as ProductModule | null;

export const getMockBlogContent    = async () => MOCK_POSTS as Post[];
export const getMockPostContent    = async (id: string) =>
  (MOCK_POSTS.find((p) => p.slug === id || p.id === id) ?? null) as Post | null;

export const getMockCases          = async () => MOCK_CASES as CaseStudy[];
export const getMockCaseBySlug     = async (slug: string) =>
  (MOCK_CASES.find((c) => c.slug === slug) ?? null) as CaseStudy | null;

export const getMockMembers        = async () => MOCK_MEMBERS as Member[];

export const getMockPageContent    = async (_slug: string) => null;
export const getMockProposalContent = async () => MOCK_PRODUCTS;
export const getMockMaintenance    = async () => null;
