#!/usr/bin/env bash
# =============================================================================
# vps-setup.sh — Prépare un VPS Ubuntu 22/24 pour Dokploy
#
# Usage :
#   make vps-setup VPS=root@1.2.3.4
#   make vps-setup VPS=root@1.2.3.4 ROLE=back
#   make vps-setup VPS=root@1.2.3.4 ROLE=front
#
# Ce script installe sur le VPS distant :
#   - Docker Engine
#   - Dokploy (orchestrateur + Traefik + Let's Encrypt)
#
# Prérequis :
#   - Un VPS Ubuntu 22.04 ou 24.04 tout neuf
#   - Accès SSH root (clé SSH ajoutée au VPS par le provider)
# =============================================================================

set -euo pipefail

VPS="${1:-}"
ROLE="${2:-front}"
SSH_KEY="${3:-}"
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"
[[ -n "$SSH_KEY" ]] && SSH_OPTS="$SSH_OPTS -i $SSH_KEY"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }
err()  { echo -e "${RED}  ✗${NC} $1" >&2; exit 1; }
step() { echo -e "\n${GREEN}▶${NC} $1"; }

if [[ -z "$VPS" ]]; then
  echo ""
  echo "Usage : ./scripts/vps-setup.sh <user@ip> [front|back]"
  echo ""
  echo "Exemples :"
  echo "  ./scripts/vps-setup.sh root@1.2.3.4 front"
  echo "  ./scripts/vps-setup.sh root@5.6.7.8 back"
  echo ""
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║      Setup VPS — rôle : $ROLE               "
echo "║      Cible : $VPS"
echo "╚══════════════════════════════════════════════╝"
echo ""
warn "Ce script va installer Docker + Dokploy sur $VPS."
printf "Continuer ? [y/N] " && read -r confirm && [ "$confirm" = "y" ] || exit 0

# ── Test de connexion SSH ──────────────────────────────────────────────────────
step "Test de connexion SSH vers $VPS..."
ssh $SSH_OPTS "$VPS" "echo ok" \
  || err "Impossible de se connecter à $VPS. Vérifiez l'IP et votre clé SSH."
ok "Connexion SSH OK"

# ── Installation distante ──────────────────────────────────────────────────────
step "Installation de Docker + Dokploy sur $VPS..."

ssh $SSH_OPTS "$VPS" bash << 'REMOTE'
set -e

# Docker Engine
if ! command -v docker &>/dev/null; then
  echo "  → Installation de Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo "  ✓ Docker installé"
else
  echo "  ✓ Docker déjà présent"
fi

# Dokploy
if ! command -v dokploy &>/dev/null; then
  echo "  → Installation de Dokploy..."
  curl -sSL https://dokploy.com/install.sh | sh
  echo "  ✓ Dokploy installé"
else
  echo "  ✓ Dokploy déjà présent"
fi

echo ""
echo "  Dokploy accessible sur : http://$(curl -s ifconfig.me):3000"
REMOTE

ok "VPS prêt"

# ── Instructions post-install ──────────────────────────────────────────────────
VPS_IP=$(echo "$VPS" | cut -d@ -f2)

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  VPS $ROLE configuré !                                      "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Étapes suivantes (dans Dokploy UI) :"
echo ""
echo "  1. Ouvre http://$VPS_IP:3000"
echo "  2. Crée ton compte admin Dokploy"
echo "  3. Nouveau projet → Docker Compose"
echo "     → Repo GitHub : ton-org/mon-projet"
echo "     → Fichier compose :"

if [[ "$ROLE" == "back" ]]; then
  echo "       infra/back/docker-compose.yml"
else
  echo "       infra/front/docker-compose.yml"
fi

echo "  4. Remplis les variables d'environnement de prod"
echo "  5. Settings → API Keys → copie la clé"
echo ""
echo "  Puis dans GitHub → Settings → Secrets :"

if [[ "$ROLE" == "back" ]]; then
  echo "    DOKPLOY_BACK_API_URL  = http://$VPS_IP:3000"
  echo "    DOKPLOY_BACK_API_KEY  = (clé copiée depuis Dokploy)"
  echo "    DOKPLOY_BACK_APP_ID   = (ID de l'app dans Dokploy)"
else
  echo "    DOKPLOY_FRONT_API_URL = http://$VPS_IP:3000"
  echo "    DOKPLOY_FRONT_API_KEY = (clé copiée depuis Dokploy)"
  echo "    DOKPLOY_FRONT_APP_ID  = (ID de l'app dans Dokploy)"
fi

echo ""
