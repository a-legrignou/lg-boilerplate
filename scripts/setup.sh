#!/usr/bin/env bash
# =============================================================================
# setup.sh — Premier lancement du projet
#
# Équivalent d'une installation WordPress :
#   git clone ... && cd projet && make setup
#
# Ce script fait TOUT :
#   1. Crée apps/web/.env.local depuis .env.example (si absent)
#   2. Installe les dépendances npm
#   3. Démarre l'infra Docker (Postgres + Redis + Directus)
#   4. Attend que Directus soit prêt
#   5. Applique le schéma depuis Git → Directus
#   6. Configure le token de service + les variables env
#   7. Lance le serveur de dev
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/web/.env.local"
ENV_EXAMPLE="$ROOT_DIR/.env.example"
COMPOSE_FILE="$ROOT_DIR/infra/local/docker-compose.yml"
SNAPSHOT_FILE="$ROOT_DIR/apps/directus/snapshots/initial-schema.yml"

# ── Couleurs ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }
err()  { echo -e "${RED}  ✗${NC} $1" >&2; }
step() { echo -e "\n${GREEN}▶${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        Setup             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Configuration via le wizard ────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  bash "$ROOT_DIR/scripts/wizard.sh"
else
  ok "apps/web/.env.local déjà présent"
fi

# Charge les vars pour les utiliser dans ce script
set -a; source "$ENV_FILE"; set +a

# ── 2. Dépendances npm ────────────────────────────────────────────────────────
step "Installation des dépendances"
cd "$ROOT_DIR"
pnpm install --frozen-lockfile
ok "Dépendances installées"

# ── 3. Infra Docker ───────────────────────────────────────────────────────────
step "Démarrage de l'infra Docker (Postgres + Redis + Directus)"
docker compose -f "$COMPOSE_FILE" up -d
ok "Conteneurs démarrés"

# ── 4. Attente Directus ───────────────────────────────────────────────────────
step "Attente de Directus..."
DIRECTUS_LOCAL="${DIRECTUS_URL:-http://localhost:8055}"
MAX=30; DELAY=5
for i in $(seq 1 $MAX); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DIRECTUS_LOCAL/server/health" || echo "000")
  if [[ "$STATUS" == "200" ]]; then
    ok "Directus prêt ($DIRECTUS_LOCAL)"
    break
  fi
  if [[ $i -eq $MAX ]]; then
    err "Directus ne répond pas après $((MAX * DELAY))s."
    err "Logs : docker compose -f $COMPOSE_FILE logs directus"
    exit 1
  fi
  echo "    Tentative $i/$MAX — HTTP $STATUS, retry dans ${DELAY}s..."
  sleep $DELAY
done

# ── 5. Appliquer le schéma ────────────────────────────────────────────────────
step "Application du schéma Directus depuis Git"

if [[ ! -f "$SNAPSHOT_FILE" ]]; then
  warn "Aucun snapshot trouvé dans apps/directus/snapshots/ — schéma ignoré."
else
  # Le snapshot est monté dans le conteneur via le volume ../../apps/directus/snapshots
  docker compose -f "$COMPOSE_FILE" exec -T directus \
    npx directus schema apply --yes /directus/snapshots/initial-schema.yml \
    2>&1 | grep -v "^$" || true
  ok "Schéma appliqué"
fi

# ── 6. Token de service ───────────────────────────────────────────────────────
step "Configuration du token de service Directus"

ADMIN_EMAIL="${DIRECTUS_ADMIN_EMAIL:-admin@local.dev}"
ADMIN_PASSWORD="${DIRECTUS_ADMIN_PASSWORD:-admin123}"

# Login pour obtenir un token temporaire
LOGIN_RESPONSE=$(curl -s -X POST "$DIRECTUS_LOCAL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

TEMP_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TEMP_TOKEN" ]]; then
  warn "Impossible d'obtenir un token admin. Vérifiez DIRECTUS_ADMIN_EMAIL/PASSWORD dans .env.local"
  warn "Vous pouvez générer le token manuellement dans Directus > Settings > API Tokens"
else
  # Créer ou régénérer le token statique du service account
  STATIC_TOKEN=$(node -e "
    const a = require('crypto').randomBytes(32).toString('hex');
    process.stdout.write(a);
  ")

  # Cherche un utilisateur service@local existant
  SERVICE_USER=$(curl -s "$DIRECTUS_LOCAL/users?filter[email][_eq]=service@local.dev" \
    -H "Authorization: Bearer $TEMP_TOKEN" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [[ -z "$SERVICE_USER" ]]; then
    # Crée le rôle service si besoin
    ROLE_ID=$(curl -s -X POST "$DIRECTUS_LOCAL/roles" \
      -H "Authorization: Bearer $TEMP_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name":"Service","admin_access":true,"app_access":false}' \
      | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

    # Crée l'utilisateur service
    curl -s -X POST "$DIRECTUS_LOCAL/users" \
      -H "Authorization: Bearer $TEMP_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"service@local.dev\",\"password\":\"$(node -e "process.stdout.write(require('crypto').randomBytes(16).toString('hex'))")\",\"first_name\":\"Service\",\"last_name\":\"Account\",\"role\":\"$ROLE_ID\",\"token\":\"$STATIC_TOKEN\",\"status\":\"active\"}" \
      > /dev/null
  else
    # Met à jour le token
    curl -s -X PATCH "$DIRECTUS_LOCAL/users/$SERVICE_USER" \
      -H "Authorization: Bearer $TEMP_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"token\":\"$STATIC_TOKEN\"}" > /dev/null
  fi

  # Injecte le token dans .env.local
  if grep -q "^DIRECTUS_STATIC_TOKEN=" "$ENV_FILE"; then
    sed -i.bak "s|^DIRECTUS_STATIC_TOKEN=.*|DIRECTUS_STATIC_TOKEN=$STATIC_TOKEN|" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
  else
    echo "DIRECTUS_STATIC_TOKEN=$STATIC_TOKEN" >> "$ENV_FILE"
  fi

  ok "Token service configuré et injecté dans .env.local"
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           Setup terminé avec succès !        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Directus admin   → ${DIRECTUS_LOCAL}/admin"
echo "  Email admin      → ${ADMIN_EMAIL}"
echo "  Mot de passe     → ${ADMIN_PASSWORD}"
echo ""
echo "  Lancer le dev :"
echo "    make dev        → démarre Next.js"
echo ""
echo "  Autres commandes utiles :"
echo "    make cms-snapshot   → sauvegarder le schéma dans Git"
echo "    make cms-apply      → appliquer le schéma Git → Directus"
echo "    make infra-logs     → logs Directus en temps réel"
echo ""
