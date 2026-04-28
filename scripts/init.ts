/**
 * pnpm tsx scripts/init.ts (alias : make init)
 *
 * Initialisation interactive d'un nouveau site Folio :
 *   - prompts : nom du site, email + mot de passe admin
 *   - crée le premier user admin Payload
 *   - applique le preset Brand par défaut
 *   - écrit Settings.siteName
 *
 * Idempotent : si un admin existe déjà, ne touche pas à l'utilisateur ; met juste à jour les globals.
 */
import "dotenv/config";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { randomBytes } from "node:crypto";
import { getPayload } from "payload";
import config from "../src/payload.config";

const rl = createInterface({ input, output });

const ask = async (q: string, def?: string): Promise<string> => {
  const suffix = def ? ` (${def})` : "";
  const a = await rl.question(`${q}${suffix} : `);
  return a.trim() || def || "";
};

const askPassword = async (q: string): Promise<string> => {
  const a = await rl.question(`${q} (laisser vide pour générer) : `);
  return a.trim();
};

const generatePassword = () =>
  randomBytes(12).toString("base64url").slice(0, 16);

async function main() {
  console.log("\n┃ Initialisation Folio");
  console.log("┃ Tu peux modifier tout ça plus tard depuis /admin.\n");

  const siteName = await ask("Nom du site", "Mon site");
  const adminEmail = await ask("Email admin", "admin@local.dev");
  let adminPassword = await askPassword("Mot de passe admin");
  let generated = false;
  if (!adminPassword) {
    adminPassword = generatePassword();
    generated = true;
  }
  const presetChoices = [
    "modern",
    "editorial",
    "bold",
    "minimal",
    "warm",
  ] as const;
  const presetInput = await ask(
    `Preset visuel [${presetChoices.join(" / ")}]`,
    "modern",
  );
  const preset = (presetChoices as readonly string[]).includes(presetInput)
    ? (presetInput as (typeof presetChoices)[number])
    : "modern";

  rl.close();

  console.log("\n→ Connexion à Payload…");
  const client = await getPayload({ config });

  // 1. Admin user
  const existing = await client.find({
    collection: "users",
    where: { email: { equals: adminEmail } },
    limit: 1,
  });

  if (existing.docs[0]) {
    console.log(
      `  ↻  Admin "${adminEmail}" existe déjà — mot de passe inchangé.`,
    );
  } else {
    await client.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        name: "Admin",
      } as never,
    });
    console.log(`  ✓  Admin "${adminEmail}" créé.`);
  }

  // 2. Brand preset (le hook beforeChange applique la palette)
  await client.updateGlobal({
    slug: "brand",
    data: { preset } as never,
  });
  console.log(`  ✓  Brand preset : ${preset}`);

  // 3. Settings (FR par défaut)
  await client.updateGlobal({
    slug: "settings",
    locale: "fr",
    data: { siteName } as never,
  });
  console.log(`  ✓  Settings.siteName : "${siteName}"`);

  console.log("\n┃ C'est prêt.");
  console.log("┃");
  console.log(`┃  Admin   : http://localhost:3000/admin`);
  console.log(`┃  Email   : ${adminEmail}`);
  if (generated) console.log(`┃  Mot de passe (généré) : ${adminPassword}`);
  console.log(`┃`);
  console.log(`┃  Lance le serveur avec : pnpm dev\n`);
  process.exit(0);
}

main().catch((e) => {
  console.error("\n✗ init échoué :", e);
  process.exit(1);
});
