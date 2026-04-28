/**
 * make update — applique les upgrades du boilerplate à un site existant.
 *
 *   1. Lit .boilerplate-version pour connaître la version actuelle du site.
 *   2. Liste tous les fichiers scripts/upgrades/<from>-to-<to>.ts.
 *   3. Trouve la chaîne d'upgrades à appliquer (current → latest), sans saut.
 *   4. Affiche le plan, demande confirmation (sauf --yes).
 *   5. Applique chaque upgrade dans l'ordre, met à jour .boilerplate-version après chaque succès.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline/promises";
import { exec as execCb } from "child_process";
import { promisify } from "util";
import type { Upgrade, UpgradeContext } from "./types";

const execAsync = promisify(execCb);

const filename = fileURLToPath(import.meta.url);
const upgradesDir = path.dirname(filename);
const rootDir = path.resolve(upgradesDir, "..", "..");
const versionFile = path.join(rootDir, ".boilerplate-version");

const yes = process.argv.includes("--yes");

const semverParts = (v: string) => v.split(".").map((n) => parseInt(n, 10));
const compare = (a: string, b: string): number => {
  const [aM, am, ap] = semverParts(a);
  const [bM, bm, bp] = semverParts(b);
  return aM - bM || am - bm || ap - bp;
};

function readVersion(): string {
  if (!existsSync(versionFile)) return "1.0.0";
  return readFileSync(versionFile, "utf8").trim() || "1.0.0";
}

function writeVersion(v: string) {
  writeFileSync(versionFile, `${v}\n`);
}

async function loadUpgrades(): Promise<Upgrade[]> {
  const files = readdirSync(upgradesDir).filter((f) =>
    /^\d+\.\d+\.\d+-to-\d+\.\d+\.\d+\.ts$/.test(f),
  );
  const out: Upgrade[] = [];
  for (const f of files) {
    const mod = (await import(path.join(upgradesDir, f))) as {
      default?: Upgrade;
    };
    if (mod.default) out.push(mod.default);
  }
  return out.sort((a, b) => compare(a.from, b.from));
}

function buildPath(current: string, upgrades: Upgrade[]): Upgrade[] {
  const path: Upgrade[] = [];
  let v = current;
  while (true) {
    const next = upgrades.find((u) => u.from === v);
    if (!next) break;
    path.push(next);
    v = next.to;
  }
  return path;
}

async function confirm(msg: string): Promise<boolean> {
  if (yes) return true;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ans = (await rl.question(`${msg} [y/N] `)).trim().toLowerCase();
  rl.close();
  return ans === "y" || ans === "yes" || ans === "o" || ans === "oui";
}

async function main() {
  const current = readVersion();
  const all = await loadUpgrades();
  const plan = buildPath(current, all);

  console.log(`\n📦  Version courante : ${current}`);

  if (plan.length === 0) {
    const latest = all.length ? all[all.length - 1].to : current;
    console.log(`✅  Aucun upgrade à appliquer (latest = ${latest})\n`);
    return;
  }

  console.log(`\n${plan.length} upgrade(s) à appliquer :\n`);
  for (const u of plan) {
    const flag = u.breaking ? "⚠ BREAKING" : "·";
    console.log(`  ${flag}  ${u.from} → ${u.to}    ${u.description}`);
  }
  console.log("");

  const ok = await confirm("Continuer ?");
  if (!ok) {
    console.log("Annulé.\n");
    return;
  }

  const ctx: UpgradeContext = {
    rootDir,
    log: (msg) => console.log(`     ${msg}`),
    exec: async (cmd) => {
      const { stdout, stderr } = await execAsync(cmd, { cwd: rootDir });
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());
    },
  };

  for (const u of plan) {
    console.log(`\n→  Application de ${u.from} → ${u.to}`);
    try {
      await u.up(ctx);
      writeVersion(u.to);
      console.log(`✓  ${u.to} appliqué`);
      if (u.releaseNotes) {
        console.log("\n--- Notes de version ---");
        console.log(u.releaseNotes.trim());
        console.log("------------------------");
      }
    } catch (err) {
      console.error(`✗  Échec sur ${u.from} → ${u.to}`);
      console.error(err);
      console.error(
        `\n.boilerplate-version reste à ${readVersion()}. Corrige le problème puis relance \`make update\`.\n`,
      );
      process.exit(1);
    }
  }

  console.log(`\n✅  Site à jour en ${readVersion()}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
