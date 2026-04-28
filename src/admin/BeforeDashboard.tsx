import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import OnboardingWizardClient from "./components/OnboardingWizard";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Tints subtiles par type de card — fond coloré + accent left border
type Tint = { bg: string; accent: string; tag: string };
const TINTS: Record<"indigo" | "cyan" | "amber" | "emerald", Tint> = {
  indigo: {
    bg: "rgba(99, 102, 241, 0.07)",
    accent: "rgb(99, 102, 241)",
    tag: "rgba(99, 102, 241, 0.15)",
  },
  cyan: {
    bg: "rgba(34, 211, 238, 0.07)",
    accent: "rgb(8, 145, 178)",
    tag: "rgba(34, 211, 238, 0.18)",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.08)",
    accent: "rgb(217, 119, 6)",
    tag: "rgba(245, 158, 11, 0.18)",
  },
  emerald: {
    bg: "rgba(16, 185, 129, 0.08)",
    accent: "rgb(5, 150, 105)",
    tag: "rgba(16, 185, 129, 0.18)",
  },
};

const card = (tint: Tint) =>
  ({
    padding: 18,
    background: tint.bg,
    borderRadius: 10,
    borderLeft: `3px solid ${tint.accent}`,
  }) as const;

const styles = {
  wrap: { padding: "20px 0 28px", marginBottom: 20 } as const,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
  } as const,
  cardTitle: (color: string) => ({
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color,
    margin: "0 0 14px",
  }),
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  listItem: { display: "flex", flexDirection: "column" as const, gap: 2 },
  link: {
    color: "var(--theme-text)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  } as const,
  meta: { fontSize: 12, color: "var(--theme-elevation-500)" } as const,
  emptyMeta: {
    fontSize: 13,
    color: "var(--theme-elevation-500)",
    fontStyle: "italic",
  } as const,
  shortcuts: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 22,
  },
  chip: (tint: Tint) =>
    ({
      padding: "7px 14px",
      background: tint.tag,
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      color: tint.accent,
      textDecoration: "none",
      transition: "opacity 0.15s",
    }) as const,
  health: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 0",
    fontSize: 13,
  } as const,
  healthOk: {
    color: "rgb(5, 150, 105)",
    fontSize: 14,
    fontWeight: 500,
  } as const,
  healthWarn: { color: "rgb(217, 119, 6)", fontWeight: 600 } as const,
  badge: (tint: Tint) =>
    ({
      fontSize: 11,
      padding: "2px 8px",
      borderRadius: 999,
      background: tint.tag,
      color: tint.accent,
      fontFamily: "monospace",
      fontWeight: 600,
    }) as const,
  draft: {
    fontSize: 11,
    padding: "1px 6px",
    borderRadius: 3,
    background: "rgba(245, 158, 11, 0.15)",
    color: "rgb(217, 119, 6)",
    fontWeight: 500,
    marginLeft: 6,
  } as const,
};

const BeforeDashboard = async () => {
  const client = await getPayload({ config });

  const settings = await client
    .findGlobal({ slug: "settings", locale: "fr", depth: 0 })
    .catch(() => null);
  const totalPages = await client
    .find({ collection: "pages", limit: 0, depth: 0 })
    .then((r) => r.totalDocs)
    .catch(() => 0);
  const isFirstRun =
    !settings ||
    !(settings as { siteName?: string }).siteName ||
    totalPages === 0;
  if (isFirstRun) {
    return (
      <section style={styles.wrap}>
        <OnboardingWizardClient />
      </section>
    );
  }

  const [pages, posts, submissions, pagesNoMeta, postsNoExcerpt, mediaNoAlt] =
    await Promise.all([
      client
        .find({ collection: "pages", limit: 5, sort: "-updatedAt", depth: 0 })
        .catch(() => null),
      client
        .find({ collection: "posts", limit: 5, sort: "-updatedAt", depth: 0 })
        .catch(() => null),
      client
        .find({
          collection: "form-submissions",
          limit: 5,
          sort: "-createdAt",
          depth: 0,
        })
        .catch(() => null),

      // Health: published pages without meta description
      client
        .find({
          collection: "pages",
          where: {
            and: [
              { _status: { equals: "published" } },
              {
                or: [
                  { "meta.description": { exists: false } },
                  { "meta.description": { equals: "" } },
                ],
              },
            ],
          },
          limit: 0,
          depth: 0,
        })
        .catch(() => null),

      // Health: published posts without excerpt
      client
        .find({
          collection: "posts",
          where: {
            and: [
              { _status: { equals: "published" } },
              {
                or: [
                  { excerpt: { exists: false } },
                  { excerpt: { equals: "" } },
                ],
              },
            ],
          },
          limit: 0,
          depth: 0,
        })
        .catch(() => null),

      // Health: media without alt
      client
        .find({
          collection: "media",
          where: { or: [{ alt: { exists: false } }, { alt: { equals: "" } }] },
          limit: 0,
          depth: 0,
        })
        .catch(() => null),
    ]);

  const healthIssues: { label: string; count: number; href: string }[] = [
    pagesNoMeta && pagesNoMeta.totalDocs > 0
      ? {
          label: "Pages publiées sans meta description",
          count: pagesNoMeta.totalDocs,
          href: "/admin/collections/pages",
        }
      : null,
    postsNoExcerpt && postsNoExcerpt.totalDocs > 0
      ? {
          label: "Articles publiés sans extrait",
          count: postsNoExcerpt.totalDocs,
          href: "/admin/collections/posts",
        }
      : null,
    mediaNoAlt && mediaNoAlt.totalDocs > 0
      ? {
          label: "Médias sans texte alternatif",
          count: mediaNoAlt.totalDocs,
          href: "/admin/collections/media",
        }
      : null,
  ].filter((x): x is { label: string; count: number; href: string } =>
    Boolean(x),
  );

  return (
    <section style={styles.wrap}>
      <div style={styles.shortcuts}>
        <Link
          href="/admin/collections/pages/create"
          style={styles.chip(TINTS.indigo)}
        >
          + Nouvelle page
        </Link>
        <Link
          href="/admin/collections/posts/create"
          style={styles.chip(TINTS.cyan)}
        >
          + Nouvel article
        </Link>
        <Link
          href="/admin/collections/snippets/create"
          style={styles.chip(TINTS.indigo)}
        >
          + Bloc réutilisable
        </Link>
        <Link href="/admin/globals/brand" style={styles.chip(TINTS.amber)}>
          Identité de marque
        </Link>
        <Link href="/admin/globals/settings" style={styles.chip(TINTS.amber)}>
          Paramètres
        </Link>
        <Link href="/admin/globals/seo" style={styles.chip(TINTS.amber)}>
          Référencement (SEO)
        </Link>
      </div>

      <div style={styles.grid}>
        <div style={card(TINTS.indigo)}>
          <h3 style={styles.cardTitle(TINTS.indigo.accent)}>Pages récentes</h3>
          {pages?.docs.length ? (
            <ul style={styles.list}>
              {pages.docs.map((p) => (
                <li key={p.id} style={styles.listItem}>
                  <Link
                    href={`/admin/collections/pages/${p.id}`}
                    style={styles.link}
                  >
                    {(p as { title?: string }).title ||
                      (p as { slug?: string }).slug}
                    {(p as { _status?: string })._status === "draft" && (
                      <span style={styles.draft}>brouillon</span>
                    )}
                  </Link>
                  <div style={styles.meta}>
                    {fmtDate((p as { updatedAt: string }).updatedAt)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyMeta}>Aucune page pour le moment.</p>
          )}
        </div>

        <div style={card(TINTS.cyan)}>
          <h3 style={styles.cardTitle(TINTS.cyan.accent)}>Articles récents</h3>
          {posts?.docs.length ? (
            <ul style={styles.list}>
              {posts.docs.map((p) => (
                <li key={p.id} style={styles.listItem}>
                  <Link
                    href={`/admin/collections/posts/${p.id}`}
                    style={styles.link}
                  >
                    {(p as { title?: string }).title ||
                      (p as { slug?: string }).slug}
                  </Link>
                  <div style={styles.meta}>
                    {fmtDate((p as { updatedAt: string }).updatedAt)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyMeta}>Aucun article pour le moment.</p>
          )}
        </div>

        <div style={card(TINTS.amber)}>
          <h3 style={styles.cardTitle(TINTS.amber.accent)}>
            Soumissions de formulaires
          </h3>
          {submissions?.docs.length ? (
            <ul style={styles.list}>
              {submissions.docs.map((s) => (
                <li key={s.id} style={styles.listItem}>
                  <Link
                    href={`/admin/collections/form-submissions/${s.id}`}
                    style={styles.link}
                  >
                    Soumission #{s.id}
                  </Link>
                  <div style={styles.meta}>
                    {fmtDate((s as { createdAt: string }).createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyMeta}>Aucune soumission pour le moment.</p>
          )}
        </div>

        <div
          style={card(healthIssues.length === 0 ? TINTS.emerald : TINTS.amber)}
        >
          <h3
            style={styles.cardTitle(
              (healthIssues.length === 0 ? TINTS.emerald : TINTS.amber).accent,
            )}
          >
            Santé du contenu (SEO)
          </h3>
          {healthIssues.length === 0 ? (
            <p style={styles.healthOk}>✓ Tout est en ordre.</p>
          ) : (
            <ul style={styles.list}>
              {healthIssues.map((issue) => (
                <li key={issue.label} style={styles.health}>
                  <span style={styles.healthWarn}>⚠</span>
                  <Link href={issue.href} style={styles.link}>
                    {issue.label}
                  </Link>
                  <span style={styles.badge(TINTS.amber)}>{issue.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default BeforeDashboard;
