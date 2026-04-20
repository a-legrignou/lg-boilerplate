#!/usr/bin/env bash
# =============================================================================
# cms-snapshot.sh — Capture le schéma Directus actuel → Git
#
# Équivalent d'un "export de structure" WordPress/phpMyAdmin, mais versionné.
# Lancer après avoir modifié des collections/champs dans l'interface Directus.
#
# Usage : make cms-snapshot
#         ./scripts/cms-snapshot.sh [--name mon-nom]
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/local/docker-compose.yml"
SNAPSHOTS_DIR="$ROOT_DIR/apps/directus/snapshots"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }

# Nom du snapshot : initial-schema.yml par défaut, ou custom avec --name
SNAPSHOT_NAME="initial-schema"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) SNAPSHOT_NAME="$2"; shift 2 ;;
    *) shift ;;
  esac
done

DATE=$(date +%Y%m%d)
FILENAME="${SNAPSHOT_NAME}.yml"
OUTPUT_PATH="$SNAPSHOTS_DIR/$FILENAME"

echo ""
echo "▶ Capture du schéma Directus → apps/directus/snapshots/$FILENAME"

# Vérifier que Directus tourne
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8055/server/health || echo "000")
if [[ "$STATUS" != "200" ]]; then
  echo -e "${RED}  ✗${NC} Directus n'est pas démarré. Lancez : make infra-up" >&2
  exit 1
fi

# Snapshot dans le conteneur, puis copié sur l'hôte via le volume monté
docker compose -f "$COMPOSE_FILE" exec -T directus \
  npx directus schema snapshot --yes "/directus/snapshots/$FILENAME"

ok "Snapshot écrit dans apps/directus/snapshots/$FILENAME"

# Afficher le diff Git si le fichier existait déjà
if git -C "$ROOT_DIR" ls-files --error-unmatch "$OUTPUT_PATH" &>/dev/null 2>&1; then
  DIFF=$(git -C "$ROOT_DIR" diff -- "$OUTPUT_PATH" 2>/dev/null || true)
  if [[ -n "$DIFF" ]]; then
    echo ""
    warn "Changements détectés dans le schéma :"
    echo "$DIFF" | head -60
    echo ""
    echo "  → Commitez avec :"
    echo "    git add apps/directus/snapshots/$FILENAME"
    echo "    git commit -m \"schema: update $SNAPSHOT_NAME\""
  else
    ok "Aucun changement par rapport au snapshot Git existant."
  fi
else
  echo ""
  echo "  → Nouveau fichier. Commitez avec :"
  echo "    git add apps/directus/snapshots/$FILENAME"
  echo "    git commit -m \"schema: add $SNAPSHOT_NAME\""
fi
echo ""
