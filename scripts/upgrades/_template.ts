/**
 * Template d'upgrade — copie ce fichier en `<from>-to-<to>.ts` et adapte.
 *
 * Règles :
 * - `from` doit matcher la version courante d'un site qui peut recevoir cet upgrade.
 * - `to` est la version cible. Le runner met à jour .boilerplate-version après succès.
 * - `up()` doit être idempotent : un re-run ne doit pas casser. Vérifie avant de modifier.
 * - Préfère plusieurs petits scripts (ex: 1.0.0→1.0.1, 1.0.1→1.0.2) plutôt qu'un gros (1.0.0→1.1.0)
 *   pour faciliter le rollback et la lisibilité.
 *
 * Pour activer ce script : renomme-le sans le `_` initial.
 */
import path from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import type { Upgrade } from "./types";

const upgrade: Upgrade = {
  from: "1.0.0",
  to: "1.0.1",
  description: "Description courte de ce que fait cet upgrade.",
  breaking: false,

  releaseNotes: `
- Ajoute X
- Renomme Y en Z (codemod automatique appliqué)
- Action manuelle requise : Y dans .env.local

Voir CHANGELOG.md pour le détail.
  `,

  async up({ rootDir, log, exec }) {
    // Exemple 1 — Bump une dépendance
    await exec("pnpm add some-package@^2.0.0");
    log("some-package mis à jour vers ^2.0.0");

    // Exemple 2 — Génère + applique une migration Payload
    await exec("pnpm payload migrate:create upgrade_v1_0_1");
    await exec("pnpm payload migrate");

    // Exemple 3 — Codemod (rename d'un import)
    const filePath = path.join(rootDir, "src/lib/example.ts");
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf8");
      if (content.includes("oldName")) {
        writeFileSync(filePath, content.replace(/oldName/g, "newName"));
        log("src/lib/example.ts : oldName → newName");
      }
    }

    // Exemple 4 — Crée un nouveau fichier (config par défaut)
    const newFile = path.join(rootDir, "src/lib/new-feature.ts");
    if (!existsSync(newFile)) {
      writeFileSync(
        newFile,
        `// Nouvelle feature ajoutée par v1.0.1\nexport const flag = false\n`,
      );
      log("src/lib/new-feature.ts créé");
    }
  },
};

export default upgrade;
