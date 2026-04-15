#!/bin/bash
# =============================================================
# diag.sh — Diagnostic serveur depuis le Mac
#
# Usage :
#   bash diag.sh          → diagnostic complet via SSH
#   bash diag.sh --local  → diagnostic sur la machine locale
# =============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$SCRIPT_DIR/.deploy/config.env"
[ -f "$CONFIG" ] || { echo "✘ config.env introuvable : $CONFIG"; exit 1; }
set -o allexport; source "$CONFIG"; set +o allexport

SSH_KEY="${SSH_KEY/#\~/$HOME}"

if [ "${1:-}" = "--local" ]; then
  bash "$SCRIPT_DIR/.diag/run.sh"
else
  ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" "bash $APP_DIR/.diag/run.sh"
fi
