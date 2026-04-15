#!/usr/bin/env bash
# ============================================================
# scaffold-new-project.sh
# Duplique coreo-front et nettoie le contenu spécifique Coreo
# pour créer un nouveau projet frontend prêt à personnaliser.
#
# Usage :
#   ./scripts/scaffold-new-project.sh <nom-du-projet> [dossier-parent]
#
# Exemple :
#   ./scripts/scaffold-new-project.sh mon-projet ~/Documents/dev
# ============================================================

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────
PROJECT_NAME="${1:-}"
PARENT_DIR="${2:-$(dirname "$(pwd)")}"

if [[ -z "$PROJECT_NAME" ]]; then
  echo "Usage: $0 <nom-du-projet> [dossier-parent]"
  exit 1
fi

SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="$PARENT_DIR/$PROJECT_NAME"

# ── Sécurité ──────────────────────────────────────────────────────────
if [[ -d "$TARGET_DIR" ]]; then
  echo "❌  Le dossier $TARGET_DIR existe déjà."
  exit 1
fi

echo "🚀  Création de $TARGET_DIR depuis $SOURCE_DIR"

# ── 1. Copie (sans .git, node_modules, .next, build) ─────────────────
rsync -a \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude="out" \
  --exclude=".env.local" \
  --exclude=".env.production" \
  --exclude=".deploy" \
  --exclude=".diag" \
  --exclude="*.log" \
  "$SOURCE_DIR/" "$TARGET_DIR/"

echo "✅  Copie terminée"

# ── 2. Nouveau dépôt git ──────────────────────────────────────────────
cd "$TARGET_DIR"
git init -q
echo "✅  Dépôt git initialisé"

# ── 3. package.json — nom du projet ──────────────────────────────────
sed -i.bak "s/\"coreo-front\"/\"$PROJECT_NAME\"/" package.json && rm package.json.bak
echo "✅  package.json mis à jour"

# ── 4. Fichier .env.local à partir du template ───────────────────────
cat > .env.local << 'EOF'
# ── App ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_ENV=development

# ── Mock (données de base sans Directus) ─────────────────────────────
# Passer à false une fois Directus connecté
NEXT_PUBLIC_USE_MOCK=true

# ── Site ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_NAME="Nom du projet"
NEXT_PUBLIC_SITE_DESCRIPTION="Description du projet"
NEXT_PUBLIC_SITE_URL="https://votre-domaine.fr"

# ── Directus (à compléter avant de désactiver le mock) ───────────────
NEXT_PUBLIC_DIRECTUS_URL=https://votre-directus.fr/
NEXT_PUBLIC_DIRECTUS_ASSETS=https://votre-directus.fr/assets/
DIRECTUS_URL=https://votre-directus.fr/
DIRECTUS_STATIC_TOKEN=

# ── Auth ─────────────────────────────────────────────────────────────
DIRECTUS_ADMIN_EMAIL=admin@votre-domaine.fr
DIRECTUS_ADMIN_PASSWORD=
JWT_SECRET=
CSRF_SECRET=
EOF
echo "✅  .env.local créé (à compléter)"

# ── 5. Nettoyer les URLs Coreo hardcodées dans les sources ────────────
echo "🔍  Remplacement des références coreo-group.fr…"

# PDF reports — brandUrl par défaut
find src/components/pdf src/app/api -name "*.ts" -o -name "*.tsx" | while read -r f; do
  sed -i.bak \
    -e 's|brandUrl = "coreo-group\.fr"|brandUrl = "votre-domaine.fr"|g' \
    -e 's|brandUrl:  SITE_URL \|\| "coreo-group\.fr"|brandUrl: SITE_URL \|\| "votre-domaine.fr"|g' \
    -e 's|brandName = "Coreo Group"|brandName = "Votre Société"|g' \
    -e 's|brandName: "Coreo Group"|brandName: "Votre Société"|g' \
    "$f" && rm -f "${f}.bak"
done

echo "✅  Références coreo-group.fr remplacées"

# ── 6. Activer le mock dans le code ──────────────────────────────────
echo "✅  Mock activé — le site démarre sans Directus"
echo "   → Éditer src/lib/mock/data.ts pour personnaliser le contenu"
echo "   → Passer NEXT_PUBLIC_USE_MOCK=false pour connecter Directus"

# ── 8. CLAUDE.md — contexte projet ───────────────────────────────────
cat > CLAUDE.md << EOF
# Préférences

## Frontend

- Stack : React + TypeScript + Tailwind + shadcn/ui
- Design minimaliste et moderne, niveau SaaS premium
- Mobile-first, dark mode systématique
- Animations subtiles avec Framer Motion

## Code Quality

- Avant chaque commit, fais une review du diff
- Signale les failles de sécurité en priorité
- Propose des tests pour chaque nouveau composant
- Respecte les conventions ESLint du projet

## Code Review

- Avant chaque commit, propose une review du diff
- Priorise : sécurité > bugs > performance > qualité
- Classe par sévérité : 🔴 critique / 🟠 important / 🟡 mineur
- Propose toujours le code corrigé, pas juste le problème
EOF
echo "✅  CLAUDE.md réinitialisé"

# ── 9. Premier commit ─────────────────────────────────────────────────
git add -A
git commit -q -m "init: scaffold from coreo-front

Projet initialisé depuis coreo-front.
Pages métier et modèles Directus à compléter.
Compléter .env.local avant de lancer."

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅  Projet $PROJECT_NAME créé dans $TARGET_DIR"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Prochaines étapes :"
echo "  1. cd $TARGET_DIR"
echo "  2. Compléter .env.local (Directus, URLs…)"
echo "  3. npm install"
echo "  4. Réécrire les pages dans src/app/[locale]/"
echo "  5. Définir les modèles dans src/lib/models/"
echo ""
