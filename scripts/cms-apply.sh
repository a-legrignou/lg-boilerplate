#!/usr/bin/env bash
# =============================================================================
# cms-apply.sh — Applique le schéma Git → Directus
#
# Lancer après un git pull si le snapshot a changé, ou après make infra-reset.
# Idempotent : sans danger si le schéma est déjà à jour.
#
# Usage : make cms-apply
#         ./scripts/cms-apply.sh [--file nom-du-snapshot.yml]
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/infra/local/docker-compose.yml"
SNAPSHOTS_DIR="$ROOT_DIR/apps/directus/snapshots"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()  { echo -e "${GREEN}  ✓${NC} $1"; }
err() { echo -e "${RED}  ✗${NC} $1" >&2; }

SNAPSHOT_FILE="initial-schema.yml"
SILENT=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --file)   SNAPSHOT_FILE="$2"; shift 2 ;;
    --silent) SILENT=true; shift ;;
    *) shift ;;
  esac
done

FULL_PATH="$SNAPSHOTS_DIR/$SNAPSHOT_FILE"

if [[ "$SILENT" == "false" ]]; then
  echo ""
  echo "▶ Application du schéma : apps/directus/snapshots/$SNAPSHOT_FILE → Directus"
fi

if [[ ! -f "$FULL_PATH" ]]; then
  [[ "$SILENT" == "false" ]] && warn "Aucun snapshot trouvé — ignoré."
  exit 0
fi

# Vérifier que Directus tourne
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8055/server/health || echo "000")
if [[ "$STATUS" != "200" ]]; then
  [[ "$SILENT" == "false" ]] && err "Directus n'est pas démarré."
  exit 0
fi

docker compose -f "$COMPOSE_FILE" exec -T directus \
  npx directus schema apply --yes "/directus/snapshots/$SNAPSHOT_FILE" \
  2>&1 | grep -v "^$" || true

if [[ "$SILENT" == "false" ]]; then
  ok "Schéma appliqué."
  echo ""
fi
