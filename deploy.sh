#!/bin/bash
# =============================================================
# deploy.sh — Déploiement depuis le Mac
#
# Usage :
#   bash deploy.sh              → commit auto + mise à jour
#   bash deploy.sh "mon message" → commit avec message custom
#   bash deploy.sh --first       → premier déploiement complet
# =============================================================

set -euo pipefail

# ── Chargement config ─────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$SCRIPT_DIR/.deploy/config.env"
[ -f "$CONFIG" ] || { echo "✘ config.env introuvable : $CONFIG"; exit 1; }
set -o allexport; source "$CONFIG"; set +o allexport

# Expansion ~ manuelle (non faite par source)
SSH_KEY="${SSH_KEY/#\~/$HOME}"
SECRETS="${SECRETS/#\~/$HOME}"

GREEN="\033[0;32m"; YELLOW="\033[1;33m"; CYAN="\033[0;36m"; RED="\033[0;31m"; RESET="\033[0m"
step()  { echo -e "\n${CYAN}▶ $1${RESET}"; }
ok()    { echo -e "${GREEN}✔ $1${RESET}"; }
warn()  { echo -e "${YELLOW}⚠ $1${RESET}"; }
fail()  { echo -e "${RED}✘ $1${RESET}"; exit 1; }

# ─────────────────────────────────────────────────────────────
# 0. Vérification des prérequis
# ─────────────────────────────────────────────────────────────
step "0/4 — Vérification des prérequis"

# Clé SSH — présence + permissions
if [ -f "$SSH_KEY" ]; then
  PERMS=$(stat -f "%OLp" "$SSH_KEY" 2>/dev/null || stat -c "%a" "$SSH_KEY" 2>/dev/null)
  if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
    ok "Clé SSH OK (permissions $PERMS)"
  else
    chmod 600 "$SSH_KEY"
    ok "Clé SSH OK (permissions corrigées → 600)"
  fi
else
  fail "Clé SSH introuvable : $SSH_KEY"
fi

# Secrets locaux — présence + format token
[ -f "$SECRETS" ] || fail "Secrets introuvables : $SECRETS"
GITHUB_TOKEN_VAL=$(grep "^GITHUB_TOKEN=" "$SECRETS" | cut -d= -f2- | tr -d '"' || true)
if [ -z "$GITHUB_TOKEN_VAL" ]; then
  fail "GITHUB_TOKEN manquant dans $SECRETS"
elif [[ "$GITHUB_TOKEN_VAL" =~ ^(ghp_|github_pat_)[A-Za-z0-9_]{10,} ]]; then
  ok "GITHUB_TOKEN format OK"
else
  warn "GITHUB_TOKEN format inattendu (attendu : ghp_... ou github_pat_...)"
fi

# Connexion SSH serveur
ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o BatchMode=yes "$SSH_USER@$SSH_HOST" exit 2>/dev/null \
  && ok "SSH serveur OK" \
  || fail "Connexion SSH impossible ($SSH_USER@$SSH_HOST)"

# Token GitHub sur le serveur — présence + accès repo
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" "
  [ -f /etc/coreo/secrets.env ] && grep -q GITHUB_TOKEN /etc/coreo/secrets.env || { echo 'NO_TOKEN'; exit 1; }
  source /etc/coreo/secrets.env
  curl -sf -o /dev/null -w '%{http_code}' \
    -H \"Authorization: Bearer \$GITHUB_TOKEN\" \
    https://api.github.com/repos/$REPO_SLUG | grep -q '200' || { echo 'BAD_TOKEN'; exit 1; }
" && ok "GitHub token serveur OK" \
  || fail "Token GitHub invalide ou absent sur le serveur"

# ─────────────────────────────────────────────────────────────
# 1. Build local
# ─────────────────────────────────────────────────────────────
FIRST_DEPLOY=false
COMMIT_MSG="${1:-}"

if [ "${1:-}" = "--first" ]; then
  FIRST_DEPLOY=true
  COMMIT_MSG=""
fi

step "1/4 — Build local"
npm run build 2>&1 || fail "Build échoué — push annulé"
ok "Build OK"

# ─────────────────────────────────────────────────────────────
# 2. Git : add + commit + push
# ─────────────────────────────────────────────────────────────
step "2/4 — Git push"

if git diff --quiet && git diff --cached --quiet; then
  ok "Rien à committer (working tree clean)"
else
  [ -z "$COMMIT_MSG" ] && COMMIT_MSG="deploy: $(date '+%Y-%m-%d %H:%M')"
  git add -A
  git commit -m "$COMMIT_MSG"
  ok "Commit : $COMMIT_MSG"
fi

git push origin "$BRANCH"
ok "Push → origin/$BRANCH"

# ─────────────────────────────────────────────────────────────
# 3. SSH + déploiement
# ─────────────────────────────────────────────────────────────
step "3/4 — Connexion SSH → $SSH_USER@$SSH_HOST"

# Auto-detection : premier deploiement si le repo n'existe pas sur le serveur
if ! $FIRST_DEPLOY; then
  HAS_REPO=$(ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" "[ -d $APP_DIR/.git ] && echo yes || echo no")
  if [ "$HAS_REPO" = "no" ]; then
    FIRST_DEPLOY=true
    warn "Repo absent sur le serveur — basculement en premier deploiement"
  fi
fi

if $FIRST_DEPLOY; then

  step "4/4 — Premier déploiement (install complète)"
  warn "Installation Node, Nginx, PM2, SSL, build. ~3-5 min."

  ssh -t -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" bash <<REMOTE
    set -e
    if [ -d "$APP_DIR/.git" ]; then
      git -C "$APP_DIR" pull origin $BRANCH
    else
      sudo mkdir -p "$APP_DIR"
      sudo chown -R \$USER:\$USER "$APP_DIR"
      git clone "$REPO_URL" "$APP_DIR"
    fi
    bash "$APP_DIR/.deploy/install.sh"
REMOTE

else

  step "4/4 — Mise à jour du serveur"
  ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" "
    [ -f $APP_DIR/.deploy/update.sh ] || git -C $APP_DIR pull origin $BRANCH
    bash $APP_DIR/.deploy/update.sh
  "

fi

echo ""
echo -e "${GREEN}════════════════════════════════════${RESET}"
echo -e "${GREEN}  ✔ Déployé sur $SITE_URL${RESET}"
echo -e "${GREEN}════════════════════════════════════${RESET}"
