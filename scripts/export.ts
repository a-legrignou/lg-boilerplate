/**
 * pnpm folio:export <collection> <out.json> [--locale fr] [--where key=value] [--limit 1000] [--depth 0]
 *
 * Dump une collection Payload vers un fichier JSON.
 *
 * Format produit : { exportedAt, collection, locale, count, docs: [...] }
 *   → re-importable directement via `pnpm folio:import` (la clé "docs" est reconnue).
 *
 * Filtres :
 *   --where key=value      (répétable, ex : --where _status=published --where author=42)
 *   --locale fr            la locale à dumper (par défaut, default locale)
 *   --limit 1000           plafond doc count (par défaut 10000)
 *   --depth 0              profondeur de population des relations (par défaut 0 = ids only)
 */
import "dotenv/config";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../src/payload.config";

type Args = {
  collection: string;
  outFile: string;
  locale?: string;
  where: Record<string, string>;
  limit: number;
  depth: number;
};

const parseArgs = (argv: string[]): Args => {
  const positional: string[] = [];
  const where: Record<string, string> = {};
  let locale: string | undefined;
  let limit = 10000;
  let depth = 0;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--locale") locale = argv[++i];
    else if (a === "--limit") limit = Number(argv[++i]);
    else if (a === "--depth") depth = Number(argv[++i]);
    else if (a === "--where") {
      const [k, v] = (argv[++i] || "").split("=");
      if (k && v) where[k] = v;
    } else if (!a.startsWith("--")) {
      positional.push(a);
    }
  }
  if (positional.length < 2) {
    console.error(
      "Usage : pnpm folio:export <collection> <out.json> [--locale fr] [--where key=value] [--limit 1000] [--depth 0]",
    );
    process.exit(1);
  }
  return {
    collection: positional[0],
    outFile: positional[1],
    locale,
    where,
    limit,
    depth,
  };
};

const buildWhereClause = (where: Record<string, string>) => {
  const keys = Object.keys(where);
  if (keys.length === 0) return undefined;
  return { and: keys.map((k) => ({ [k]: { equals: where[k] } })) };
};

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log(`\n┃ Export : ${args.collection} → ${args.outFile}`);
  if (args.locale) console.log(`┃ Locale : ${args.locale}`);
  if (Object.keys(args.where).length)
    console.log(`┃ Where  : ${JSON.stringify(args.where)}`);
  console.log(`┃ Limit  : ${args.limit} · depth ${args.depth}\n`);

  const client = await getPayload({ config });
  const result = await client.find({
    collection: args.collection as never,
    where: buildWhereClause(args.where) as never,
    limit: args.limit,
    depth: args.depth,
    ...(args.locale ? { locale: args.locale as never } : {}),
  });

  const outAbs = path.resolve(process.cwd(), args.outFile);
  mkdirSync(path.dirname(outAbs), { recursive: true });

  const payload = {
    exportedAt: new Date().toISOString(),
    collection: args.collection,
    locale: args.locale ?? null,
    count: result.docs.length,
    docs: result.docs,
  };
  writeFileSync(outAbs, JSON.stringify(payload, null, 2));

  console.log(`✓ ${result.docs.length} document(s) écrits dans ${outAbs}\n`);
  process.exit(0);
}

main().catch((e) => {
  console.error("\n✗ Export échoué :", e);
  process.exit(1);
});
