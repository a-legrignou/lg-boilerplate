#!/bin/bash
# =============================================================
# deploy.sh — Script de déploiement Coreo Group
# Exécuté sur le serveur via GitHub Actions
# =============================================================

set -euo pipefail  # Arrête si une commande échoue

APP_DIR="/var/www/coreo"
PM2_APP="coreo"
LOG_FILE="/var/log/coreo/deploy.log"
NODE_VERSION="22"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

# ── Charger nvm si présent ────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

mkdir -p "$(dirname "$LOG_FILE")"

log "════════════════════════════════════"
log "Déploiement démarré"
log "Commit : $(git -C "$APP_DIR" rev-parse --short HEAD 2>/dev/null || echo 'inconnu')"

# ── 1. Pull ───────────────────────────────────────────────────
log "1/4 — git pull..."
cd "$APP_DIR"
git pull origin main

log "Nouveau commit : $(git rev-parse --short HEAD)"

# ── 2. Dépendances ───────────────────────────────────────────
log "2/4 — npm ci..."
npm ci

# ── 3. Build ─────────────────────────────────────────────────
# Le .env reste sur le serveur et n'est jamais touché
log "3/4 — npm run build..."
npm run build

# ── 4. Reload PM2 (zero-downtime) ────────────────────────────
log "4/4 — pm2 reload $PM2_APP..."
pm2 reload "$PM2_APP" --update-env

log "Déploiement terminé ✓"
log "════════════════════════════════════"
