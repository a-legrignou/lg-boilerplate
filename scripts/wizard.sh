#!/usr/bin/env bash
# =============================================================================
# wizard.sh — Configuration locale du projet
# Appelé automatiquement par `make dev` au premier lancement.
# Configure : .env.local + secrets GitHub (config app uniquement)
# Pour les serveurs de prod → make infra
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/web/.env.local"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'
BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

ask()  { printf "${CYAN}  ?${NC} $1 "; }
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
info() { echo -e "${DIM}    $1${NC}"; }
h()    { echo -e "\n${BOLD}── $1${NC}"; }
box()  { echo -e "${BOLD}$1${NC}"; }

prompt() {
  local label="$1" default="$2" var_name="$3"
  ask "$label${default:+ ${DIM}[$default]${NC}}:"
  read -r value
  printf -v "$var_name" '%s' "${value:-$default}"
}

prompt_secret() {
  local label="$1" var_name="$2"
  local generated; generated=$(openssl rand -hex 32)
  ask "$label ${DIM}[auto]${NC}:"
  read -r value
  printf -v "$var_name" '%s' "${value:-$generated}"
}

yn() {
  local label="$1" default="${2:-n}"
  ask "$label ${DIM}[$([ "$default" = "y" ] && echo "Y/n" || echo "y/N")]${NC}:"
  read -r value
  [[ "${value:-$default}" =~ ^[Yy]$ ]]
}

# ── Header ────────────────────────────────────────────────────────────────────
clear
echo ""
box "╔══════════════════════════════════════════╗"
box "║        Configuration du projet          ║"
box "╚══════════════════════════════════════════╝"
echo ""
info "Réponds aux questions. Entrée = valeur par défaut."
info "Pour configurer les serveurs de prod → make infra"

# ── Projet ────────────────────────────────────────────────────────────────────
h "Projet"

prompt "Nom du projet" "Mon Projet" SITE_NAME
prompt "URL de production" "https://mon-projet.fr" SITE_URL
prompt "URL du CMS en prod" "https://cms.mon-projet.fr" DIRECTUS_PUBLIC_URL

echo ""
info "Modules à activer :"
yn "  Blog / articles"    "y" && ENABLE_BLOG=true     || ENABLE_BLOG=false
yn "  Catalogue produits" "n" && ENABLE_PRODUCTS=true  || ENABLE_PRODUCTS=false
yn "  Authentification"   "y" && ENABLE_AUTH=true      || ENABLE_AUTH=false
yn "  Dashboard admin"    "y" && ENABLE_ADMIN=true     || ENABLE_ADMIN=false

# ── Secrets ───────────────────────────────────────────────────────────────────
h "Secrets"
info "Générés automatiquement — Entrée pour accepter."
echo ""

prompt_secret "NEXT_REVALIDATE_TOKEN" NEXT_REVALIDATE_TOKEN
prompt_secret "DRAFT_SECRET         " DRAFT_SECRET

# ── GitHub ────────────────────────────────────────────────────────────────────
h "GitHub"

GH_REPO=""
PUSH_GH_SECRETS=false
if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
  GH_REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
  if [[ -n "$GH_REPO" ]]; then
    info "Repo détecté : $GH_REPO"
    yn "  Pousser les secrets sur GitHub" "y" && PUSH_GH_SECRETS=true || true
  fi
else
  info "gh non disponible — secrets GitHub à configurer via make infra"
fi

# ── Génération .env.local ─────────────────────────────────────────────────────
h "Génération"

cat > "$ENV_FILE" << EOF
# Généré le $(date +%Y-%m-%d) — ne jamais committer

NEXT_PUBLIC_SITE_NAME="${SITE_NAME}"
NEXT_PUBLIC_SITE_URL="${SITE_URL}"
NEXT_PUBLIC_SITE_DESCRIPTION=""
NEXT_PUBLIC_APP_ENV=development

DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=

NEXT_REVALIDATE_TOKEN=${NEXT_REVALIDATE_TOKEN}
DRAFT_SECRET=${DRAFT_SECRET}

NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
NEXT_PUBLIC_DIRECTUS_ASSETS=http://localhost:8055/assets/

NEXT_PUBLIC_ENABLE_CORE_PAGES=true
NEXT_PUBLIC_ENABLE_BLOG=${ENABLE_BLOG}
NEXT_PUBLIC_ENABLE_PRODUCTS=${ENABLE_PRODUCTS}
NEXT_PUBLIC_ENABLE_AUTH=${ENABLE_AUTH}
NEXT_PUBLIC_ENABLE_ADMIN=${ENABLE_ADMIN}

POSTGRES_DB=app_db
POSTGRES_USER=app
POSTGRES_PASSWORD=app_dev
DIRECTUS_SECRET=dev-secret-change-me
DIRECTUS_ADMIN_EMAIL=admin@local.dev
DIRECTUS_ADMIN_PASSWORD=admin123
EOF
ok ".env.local créé"

# ── GitHub Secrets (config app uniquement) ────────────────────────────────────
if [[ "$PUSH_GH_SECRETS" == "true" ]]; then
  push_secret() {
    local name="$1" value="$2"
    [[ -z "$value" ]] && return
    printf "  → %-35s" "$name"
    echo "$value" | gh secret set "$name" -R "$GH_REPO" 2>/dev/null && echo "✓" || echo "✗"
  }
  push_secret "NEXT_PUBLIC_SITE_URL"        "$SITE_URL"
  push_secret "NEXT_PUBLIC_DIRECTUS_URL"    "$DIRECTUS_PUBLIC_URL"
  push_secret "NEXT_PUBLIC_DIRECTUS_ASSETS" "${DIRECTUS_PUBLIC_URL}/assets/"
  push_secret "SITE_URL"                    "$SITE_URL"
  push_secret "DIRECTUS_PUBLIC_URL"         "$DIRECTUS_PUBLIC_URL"
  push_secret "NEXT_REVALIDATE_TOKEN"       "$NEXT_REVALIDATE_TOKEN"
  push_secret "DRAFT_SECRET"               "$DRAFT_SECRET"
  ok "Secrets GitHub → $GH_REPO"
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
box "╔══════════════════════════════════════════╗"
box "║            Prêt à coder !               ║"
box "╚══════════════════════════════════════════╝"
echo ""
echo "  Local  →  http://localhost:3000"
echo "  CMS    →  http://localhost:8055/admin"
echo "             admin@local.dev / admin123"
echo ""
echo -e "  Pour mettre en prod → ${BOLD}make infra${NC}"
echo ""
