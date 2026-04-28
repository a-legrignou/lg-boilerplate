/**
 * pnpm folio:import <collection> <file.json> [--locale fr] [--upsert-by slug] [--dry-run]
 *
 * Importe massivement des documents JSON dans une collection Payload.
 *
 * Format attendu : un fichier .json contenant soit
 *   - un tableau d'objets : [{...}, {...}, ...]
 *   - un objet avec clé "docs" : { docs: [{...}, ...] }
 *
 * Mode upsert :
 *   --upsert-by <field>  vérifie si un doc existe avec ce field, le met à jour ; sinon le crée.
 *   Sans --upsert-by, crée tous les docs (peut produire des doublons si re-run).
 *
 * Mode dry-run :
 *   --dry-run            valide tout, n'écrit rien.
 *
 * Idempotent si on passe --upsert-by sur un champ unique (slug, email, etc.).
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../src/payload.config";

type Args = {
  collection: string;
  file: string;
  locale?: string;
  upsertBy?: string;
  dryRun: boolean;
};

const parseArgs = (argv: string[]): Args => {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  if (positional.length < 2) {
    console.error(
      "Usage : pnpm folio:import <collection> <file.json> [--locale fr] [--upsert-by slug] [--dry-run]",
    );
    process.exit(1);
  }
  return {
    collection: positional[0],
    file: positional[1],
    locale: typeof flags.locale === "string" ? flags.locale : undefined,
    upsertBy:
      typeof flags["upsert-by"] === "string"
        ? (flags["upsert-by"] as string)
        : undefined,
    dryRun: flags["dry-run"] === true,
  };
};

const loadDocs = (filePath: string): Record<string, unknown>[] => {
  const abs = path.resolve(process.cwd(), filePath);
  const raw = readFileSync(abs, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (Array.isArray(parsed)) return parsed as Record<string, unknown>[];
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { docs?: unknown[] }).docs)
  ) {
    return (parsed as { docs: Record<string, unknown>[] }).docs;
  }
  throw new Error(
    "Le fichier doit contenir un tableau JSON ou un objet { docs: [...] }",
  );
};

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log(`\n┃ Import : ${args.collection} ← ${args.file}`);
  if (args.locale) console.log(`┃ Locale : ${args.locale}`);
  if (args.upsertBy) console.log(`┃ Upsert : par "${args.upsertBy}"`);
  if (args.dryRun) console.log("┃ Mode   : DRY RUN (rien ne sera écrit)");
  console.log("");

  const docs = loadDocs(args.file);
  console.log(`→ ${docs.length} document(s) à traiter\n`);

  const client = await getPayload({ config });
  const stats = { created: 0, updated: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const upsertValue = args.upsertBy ? doc[args.upsertBy] : null;
    const label = upsertValue ?? `#${i + 1}`;

    try {
      let existingId: number | string | null = null;
      if (args.upsertBy && upsertValue !== undefined && upsertValue !== null) {
        const existing = await client.find({
          collection: args.collection as never,
          where: { [args.upsertBy]: { equals: upsertValue } } as never,
          limit: 1,
          depth: 0,
          ...(args.locale ? { locale: args.locale as never } : {}),
        });
        if (existing.docs[0])
          existingId = (existing.docs[0] as { id: number | string }).id;
      }

      if (args.dryRun) {
        console.log(
          `  ⊘  ${label} (dry-run, ${existingId ? "update" : "create"})`,
        );
        stats.skipped++;
        continue;
      }

      if (existingId !== null) {
        await client.update({
          collection: args.collection as never,
          id: existingId as never,
          data: doc as never,
          ...(args.locale ? { locale: args.locale as never } : {}),
        });
        console.log(`  ↻  ${label} (updated)`);
        stats.updated++;
      } else {
        await client.create({
          collection: args.collection as never,
          data: doc as never,
          ...(args.locale ? { locale: args.locale as never } : {}),
        });
        console.log(`  ✓  ${label} (created)`);
        stats.created++;
      }
    } catch (err) {
      stats.errors++;
      console.error(`  ✗  ${label} — ${(err as Error).message}`);
    }
  }

  console.log(
    `\n┃ Bilan : ${stats.created} créé · ${stats.updated} mis à jour · ${stats.skipped} skippé · ${stats.errors} erreur(s)\n`,
  );
  process.exit(stats.errors > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("\n✗ Import échoué :", e);
  process.exit(1);
});
