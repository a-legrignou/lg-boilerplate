#!/usr/bin/env bash
# =============================================================================
# wizard-infra.sh — Configuration des serveurs de production
# Appelé par `make infra`
# Configure : VPS (Docker + Dokploy) + GitHub Secrets Dokploy
# =============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVERS_FILE="$ROOT_DIR/infra/servers.conf"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'
BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

ask()  { printf "${CYAN}  ?${NC} $1 "; }
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }
info() { echo -e "${DIM}    $1${NC}"; }
h()    { echo -e "\n${BOLD}── $1${NC}"; }
box()  { echo -e "${BOLD}$1${NC}"; }

prompt() {
  local label="$1" default="$2" var_name="$3"
  ask "$label${default:+ ${DIM}[$default]${NC}}:"
  read -r value
  printf -v "$var_name" '%s' "${value:-$default}"
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
box "║     Configuration des serveurs prod     ║"
box "╚══════════════════════════════════════════╝"
echo ""
info "Configure les VPS et les secrets GitHub pour le déploiement."
info "Prérequis : avoir 2 VPS Ubuntu avec accès SSH root."

# ── VPS ───────────────────────────────────────────────────────────────────────
h "Serveurs"

# Pré-remplir depuis servers.conf si existe
FRONT_VPS=""; BACK_VPS=""; SSH_KEY="$HOME/.ssh/id_ed25519"
[[ -f "$SERVERS_FILE" ]] && { set -a; source "$SERVERS_FILE"; set +a; } 2>/dev/null || true
[[ -f "$SSH_KEY" ]] || SSH_KEY="$HOME/.ssh/id_rsa"

prompt "VPS front — user@ip" "$FRONT_VPS" FRONT_VPS
prompt "VPS back  — user@ip" "$BACK_VPS"  BACK_VPS
prompt "Clé SSH" "$SSH_KEY" SSH_KEY

# ── Sauvegarde servers.conf ───────────────────────────────────────────────────
cat > "$SERVERS_FILE" << EOF
# Généré le $(date +%Y-%m-%d) — dans .gitignore
FRONT_VPS=${FRONT_VPS}
BACK_VPS=${BACK_VPS}
SSH_KEY=${SSH_KEY}
EOF
ok "infra/servers.conf mis à jour"

# ── Setup VPS ─────────────────────────────────────────────────────────────────
h "Installation Docker + Dokploy sur les VPS"

FRONT_OK=false; BACK_OK=false

if [[ -n "$FRONT_VPS" ]]; then
  echo ""
  info "VPS front : $FRONT_VPS"
  bash "$ROOT_DIR/scripts/vps-setup.sh" "$FRONT_VPS" front "$SSH_KEY" \
    && FRONT_OK=true \
    || warn "Échec VPS front — vérifie l'accès SSH et relance make infra"
fi

if [[ -n "$BACK_VPS" ]]; then
  echo ""
  info "VPS back : $BACK_VPS"
  bash "$ROOT_DIR/scripts/vps-setup.sh" "$BACK_VPS" back "$SSH_KEY" \
    && BACK_OK=true \
    || warn "Échec VPS back — vérifie l'accès SSH et relance make infra"
fi

# ── Guide Dokploy ─────────────────────────────────────────────────────────────
FRONT_IP=$(echo "$FRONT_VPS" | cut -d@ -f2 2>/dev/null || echo "")
BACK_IP=$(echo "$BACK_VPS"   | cut -d@ -f2 2>/dev/null || echo "")

echo ""
h "Étape manuelle — Dokploy UI (5 min)"
echo ""
echo "  ┌──────────────────────────────────────────────────────────────────┐"

STEP=1
if [[ -n "$FRONT_IP" && "$FRONT_OK" == "true" ]]; then
  echo "  │"
  echo "  │  $STEP. VPS FRONT → http://$FRONT_IP:3000"
  echo "  │     • Crée ton compte admin"
  echo "  │     • Nouveau projet → Docker Compose"
  echo "  │       Fichier : infra/front/docker-compose.yml"
  echo "  │     • Remplis les variables d'env de prod"
  echo "  │     • Settings → API Keys → crée une clé → copie-la"
  echo "  │     • Note l'ID du projet (dans l'URL)"
  echo "  │"
  echo "  │     GitHub Secrets à ajouter :"
  echo "  │       DOKPLOY_FRONT_API_URL = http://$FRONT_IP:3000"
  echo "  │       DOKPLOY_FRONT_API_KEY = <clé copiée>"
  echo "  │       DOKPLOY_FRONT_APP_ID  = <id du projet>"
  STEP=$((STEP + 1))
fi

if [[ -n "$BACK_IP" && "$BACK_OK" == "true" ]]; then
  echo "  │"
  echo "  │  $STEP. VPS BACK → http://$BACK_IP:3000"
  echo "  │     • Même opération"
  echo "  │       Fichier : infra/back/docker-compose.yml"
  echo "  │"
  echo "  │     GitHub Secrets à ajouter :"
  echo "  │       DOKPLOY_BACK_API_URL = http://$BACK_IP:3000"
  echo "  │       DOKPLOY_BACK_API_KEY = <clé copiée>"
  echo "  │       DOKPLOY_BACK_APP_ID  = <id du projet>"
fi

echo "  │"
echo "  └──────────────────────────────────────────────────────────────────┘"

# ── GitHub CLI ────────────────────────────────────────────────────────────────
echo ""
if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
  GH_REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
  if [[ -n "$GH_REPO" ]]; then
    info "Une fois les clés Dokploy récupérées, tu peux les pousser avec :"
    echo ""
    echo "    gh secret set DOKPLOY_FRONT_API_KEY -R $GH_REPO"
    echo "    gh secret set DOKPLOY_FRONT_APP_ID  -R $GH_REPO"
    echo "    gh secret set DOKPLOY_BACK_API_KEY  -R $GH_REPO"
    echo "    gh secret set DOKPLOY_BACK_APP_ID   -R $GH_REPO"
    echo ""
  fi
fi

echo ""
box "╔══════════════════════════════════════════╗"
box "║   Une fois les secrets configurés :     ║"
box "╚══════════════════════════════════════════╝"
echo ""
echo "    git push origin main"
echo ""
echo "  → CI/CD → build → déploiement front + back automatique"
echo ""
