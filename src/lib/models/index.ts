import { cache } from "react";
import { getSiteSettings } from "./settings";
import { getTopMenu, getFooterMenu, getFooterContactMenu } from "./menus";
import { getPageContent } from "./content";
import { getBlogContent, getPostContent } from "./blog";
import { getProposalContent } from "./proposal";
import { getCases, getCaseBySlug } from "./cases";
import { getMembers } from "./team";
import { getAllModules, getModuleBySlug } from "./products";
import {
  getMockSiteSettings,
  getMockTopMenu,
  getMockFooterMenu,
  getMockFooterContactMenu,
  getMockPageContent,
  getMockBlogContent,
  getMockPostContent,
  getMockProposalContent,
  getMockCases,
  getMockCaseBySlug,
  getMockMembers,
  getMockAllModules,
  getMockModuleBySlug,
  getMockMaintenance,
} from "@/lib/mock";

export * from "./content";
export * from "./menus";
export * from "./settings";
export * from "./blog";
export * from "./maintenance";
export * from "./proposal";
export * from "./cases";
export * from "./team";
export * from "./products";
export * from "./satisfaction";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const getCachedSiteSettings      = cache(() => USE_MOCK ? getMockSiteSettings()      : getSiteSettings());
export const getCachedTopMenu           = cache(() => USE_MOCK ? getMockTopMenu()            : getTopMenu());
export const getCachedFooterMenu        = cache(() => USE_MOCK ? getMockFooterMenu()         : getFooterMenu());
export const getCachedFooterContactMenu = cache(() => USE_MOCK ? getMockFooterContactMenu()  : getFooterContactMenu());
export const getCachedPageContent       = cache((slug: string) => USE_MOCK ? getMockPageContent(slug)  : getPageContent(slug));
export const getCachedBlogContent       = cache(() => USE_MOCK ? getMockBlogContent()        : getBlogContent());
export const getCachedPostContent       = cache((slug: string) => USE_MOCK ? getMockPostContent(slug)  : getPostContent(slug));
export const getCachedProposalContent   = cache(() => USE_MOCK ? getMockProposalContent()    : getProposalContent());
export const getCachedCases             = cache(() => USE_MOCK ? getMockCases()              : getCases());
export const getCachedCaseBySlug        = cache((slug: string) => USE_MOCK ? getMockCaseBySlug(slug)   : getCaseBySlug(slug));
export const getCachedMembers           = cache(() => USE_MOCK ? getMockMembers()            : getMembers());
export const getCachedAllModules        = cache(() => USE_MOCK ? getMockAllModules()         : getAllModules());
export const getCachedModuleBySlug      = cache((slug: string) => USE_MOCK ? getMockModuleBySlug(slug) : getModuleBySlug(slug));
export const getCachedMaintenance       = cache(() => USE_MOCK ? getMockMaintenance()        : (async () => null)());
