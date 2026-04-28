/**
 * pnpm folio:new
 *
 * Génère une nouvelle collection Payload avec :
 *   - le squelette `src/collections/<Name>.ts` (RBAC + slug + SEO + tabs)
 *   - patch automatique de `src/payload.config.ts` (import + ajout au `collections:` array)
 *   - rappel explicite : `make types && pnpm payload migrate:create <slug> && make payload-migrate`
 *
 * Prompts interactifs : nom singulier, nom pluriel, slug, group admin, champs métier.
 */
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const rl = createInterface({ input, output });
const ask = async (q: string, def?: string): Promise<string> => {
  const a = await rl.question(`${q}${def ? ` (${def})` : ""} : `);
  return a.trim() || def || "";
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const camel = (s: string) =>
  s
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^./, (c) => c.toUpperCase());

const FIELD_TEMPLATES: Record<string, string> = {
  text: `{ name: '__N__', type: 'text', label: '__L__', localized: true }`,
  textarea: `{ name: '__N__', type: 'textarea', label: '__L__', localized: true }`,
  richText: `{ name: '__N__', type: 'richText', label: '__L__', localized: true }`,
  number: `{ name: '__N__', type: 'number', label: '__L__' }`,
  date: `{ name: '__N__', type: 'date', label: '__L__' }`,
  upload: `{ name: '__N__', type: 'upload', relationTo: 'media', label: '__L__' }`,
  email: `{ name: '__N__', type: 'email', label: '__L__' }`,
  url: `{ name: '__N__', type: 'text', label: '__L__', admin: { description: 'URL complète' } }`,
};

const buildField = (name: string, type: string, label?: string): string =>
  (FIELD_TEMPLATES[type] ?? FIELD_TEMPLATES.text)
    .replace(/__N__/g, name)
    .replace(/__L__/g, label || cap(name));

async function main() {
  console.log("\n┃ Nouvelle collection Folio\n");

  const singular = await ask('Nom singulier (ex: "Étude de cas")', "Item");
  const plural = await ask('Nom pluriel (ex: "Études de cas")', `${singular}s`);
  const slug = await ask(
    "Slug (URL/db)",
    singular.toLowerCase().replace(/\s+/g, "-"),
  );
  const fileName = camel(slug);
  const group = await ask(
    'Groupe admin (ex: "Contenu", "Marketing")',
    "Contenu",
  );
  const useTitle = (await ask("Champ titre principal ? (y/n)", "y"))
    .toLowerCase()
    .startsWith("y");
  const useSlug = (await ask("Slug auto (URL-friendly) ? (y/n)", "y"))
    .toLowerCase()
    .startsWith("y");
  const useSeo = (await ask("SEO override (noindex / canonical) ? (y/n)", "y"))
    .toLowerCase()
    .startsWith("y");
  const useDrafts = (await ask("Brouillons + autosave (versions) ? (y/n)", "y"))
    .toLowerCase()
    .startsWith("y");
  const usePublishedAt = (await ask("Champ publishedAt ? (y/n)", "n"))
    .toLowerCase()
    .startsWith("y");
  const useCover = (await ask("Cover image ? (y/n)", "n"))
    .toLowerCase()
    .startsWith("y");
  const useTags = (await ask("Tags ? (y/n)", "n"))
    .toLowerCase()
    .startsWith("y");

  console.log('\nChamps métier additionnels (tape "fin" pour terminer) :');
  const customFields: { name: string; type: string; label: string }[] = [];
  while (true) {
    const name = await ask('  nom du champ (ou "fin")');
    if (!name || name.toLowerCase() === "fin") break;
    const type = await ask(
      "  type (text|textarea|richText|number|date|upload|email|url)",
      "text",
    );
    const label = await ask("  libellé", cap(name));
    customFields.push({ name, type, label });
  }

  rl.close();

  // ── Build collection file ──────────────────────────────────────────────
  const imports: string[] = ["import type { CollectionConfig } from 'payload'"];
  imports.push(
    "import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from '../lib/access'",
  );
  const toolkitParts: string[] = [];
  if (useSlug) toolkitParts.push("slugField");
  if (useSeo) toolkitParts.push("seoOverrideFields");
  if (usePublishedAt) toolkitParts.push("publishedAtField");
  if (useCover) toolkitParts.push("coverField");
  if (useTags) toolkitParts.push("tagsField");
  if (toolkitParts.length)
    imports.push(`import { ${toolkitParts.join(", ")} } from '../lib/fields'`);

  const sidebarFields: string[] = [];
  if (useSlug) sidebarFields.push("slugField()");
  if (useSeo) sidebarFields.push("...seoOverrideFields()");
  if (usePublishedAt) sidebarFields.push("publishedAtField()");
  if (useCover) sidebarFields.push("coverField()");

  const tabFields: string[] = [];
  if (useTitle)
    tabFields.push(
      `{ name: 'title', type: 'text', required: true, localized: true, label: 'Titre' }`,
    );
  for (const f of customFields)
    tabFields.push(buildField(f.name, f.type, f.label));
  if (useTags) tabFields.push("tagsField()");

  const fileBody = `${imports.join("\n")}

export const ${fileName}: CollectionConfig = {
  slug: '${slug}',
  labels: { singular: '${singular}', plural: '${plural}' },
  admin: {
    group: '${group}',
${useTitle ? `    useAsTitle: 'title',\n    defaultColumns: ['title', ${useSlug ? "'slug', " : ""}${useDrafts ? "'_status', " : ""}'updatedAt'],\n` : ""}  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
${useDrafts ? `  versions: { drafts: { autosave: { interval: 2500 } } },\n` : ""}  fields: [
${sidebarFields.map((f) => `    ${f},`).join("\n")}
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
${tabFields.map((f) => `            ${f},`).join("\n")}
          ],
        },
      ],
    },
  ],
}
`;

  const collectionPath = path.resolve(
    process.cwd(),
    `src/collections/${fileName}.ts`,
  );
  if (existsSync(collectionPath)) {
    console.error(`\n✗ Le fichier ${collectionPath} existe déjà. Annulé.`);
    process.exit(1);
  }
  writeFileSync(collectionPath, fileBody);
  console.log(`\n  ✓ Créé : src/collections/${fileName}.ts`);

  // ── Patch payload.config.ts ────────────────────────────────────────────
  const configPath = path.resolve(process.cwd(), "src/payload.config.ts");
  const config = readFileSync(configPath, "utf8");

  if (
    config.includes(`'./collections/${fileName}'`) ||
    config.includes(`./collections/${fileName}'`)
  ) {
    console.log(`  ↻ payload.config.ts contient déjà ${fileName}, skip patch`);
  } else {
    // Patch import
    const importBlockMatch = config.match(
      /(import \{ ?[A-Z][a-zA-Z]* ?\} from '\.\/collections\/[A-Z][a-zA-Z]*'\n)+/g,
    );
    let patched = config;
    const newImport = `import { ${fileName} } from './collections/${fileName}'\n`;
    if (importBlockMatch && importBlockMatch.length > 0) {
      const lastImport = importBlockMatch[importBlockMatch.length - 1];
      patched = patched.replace(lastImport, lastImport + newImport);
    } else {
      // Fallback : append after first batch of imports
      patched = patched.replace(
        /(import .+ from .+\n)(?=\nconst|export default)/,
        `$1${newImport}\n`,
      );
    }

    // Patch collections array
    patched = patched.replace(
      /collections:\s*\[([^\]]+)\]/,
      (match, inner: string) => {
        const trimmed = inner.trim();
        const sep = trimmed.endsWith(",") ? " " : ", ";
        return `collections: [${trimmed}${sep}${fileName}]`;
      },
    );

    writeFileSync(configPath, patched);
    console.log(`  ✓ Patché : src/payload.config.ts (import + collections)`);
  }

  console.log(`
┃ Étapes suivantes :
┃   1. make types                                           # régénère payload-types.ts + importMap
┃   2. pnpm payload migrate:create ${slug.replace(/-/g, "_")}_init   # crée la migration SQL
┃   3. make payload-migrate                                 # applique la migration
┃   4. /admin → la collection "${plural}" apparaît dans le groupe "${group}"
`);
  process.exit(0);
}

main().catch((e) => {
  console.error("\n✗ Création échouée :", e);
  process.exit(1);
});
