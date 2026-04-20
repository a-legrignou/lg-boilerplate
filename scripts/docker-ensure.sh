#!/usr/bin/env bash
# =============================================================================
# docker-ensure.sh
# Installe Docker et pnpm selon l'OS détecté, puis s'assure que le daemon tourne.
# Appelé automatiquement par `make dev`.
#
# Supports : macOS (Homebrew + Colima), Ubuntu/Debian, Fedora/RHEL, Arch
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }
err()  { echo -e "${RED}  ✗${NC} $1" >&2; exit 1; }
step() { echo -e "\n${GREEN}▶${NC} $1"; }

OS="$(uname -s)"

# ── Détection Linux distro ────────────────────────────────────────────────────
detect_linux_distro() {
  if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    echo "${ID:-unknown}"
  else
    echo "unknown"
  fi
}

# =============================================================================
# macOS
# =============================================================================
install_macos() {
  # Homebrew
  if ! command -v brew &>/dev/null; then
    step "Installation de Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    [[ -f /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
    ok "Homebrew installé"
  fi

  # pnpm
  if ! command -v pnpm &>/dev/null; then
    step "Installation de pnpm..."
    brew install pnpm
    ok "pnpm installé"
  fi

  # Docker CLI + Colima (pas de Docker Desktop)
  if ! command -v docker &>/dev/null; then
    step "Installation de Docker + Colima..."
    brew install docker docker-compose colima
    ok "Docker + Colima installés"
  fi

  # Daemon Docker via Colima
  if ! docker info &>/dev/null 2>&1; then
    step "Démarrage du daemon Docker (Colima)..."
    colima start --cpu 2 --memory 4 --disk 60
    ok "Colima démarré"
  fi
}

# =============================================================================
# Ubuntu / Debian
# =============================================================================
install_debian() {
  # pnpm
  if ! command -v pnpm &>/dev/null; then
    step "Installation de pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PNPM_HOME="$HOME/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
    ok "pnpm installé"
  fi

  # Docker Engine
  if ! command -v docker &>/dev/null; then
    step "Installation de Docker Engine..."
    sudo apt-get update -qq
    sudo apt-get install -y -qq ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
      | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker "$USER"
    ok "Docker installé"
    warn "Ferme et rouvre ton terminal pour activer les permissions Docker sans sudo."
  fi

  # Daemon
  if ! docker info &>/dev/null 2>&1; then
    step "Démarrage du daemon Docker..."
    sudo systemctl start docker
    ok "Docker démarré"
  fi
}

# =============================================================================
# Fedora / RHEL / CentOS
# =============================================================================
install_fedora() {
  if ! command -v pnpm &>/dev/null; then
    step "Installation de pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PNPM_HOME="$HOME/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
    ok "pnpm installé"
  fi

  if ! command -v docker &>/dev/null; then
    step "Installation de Docker Engine..."
    sudo dnf -y install dnf-plugins-core
    sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
    sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker "$USER"
    ok "Docker installé"
  fi

  if ! docker info &>/dev/null 2>&1; then
    step "Démarrage du daemon Docker..."
    sudo systemctl start docker
    ok "Docker démarré"
  fi
}

# =============================================================================
# Arch Linux
# =============================================================================
install_arch() {
  if ! command -v pnpm &>/dev/null; then
    step "Installation de pnpm..."
    sudo pacman -Sy --noconfirm pnpm
    ok "pnpm installé"
  fi

  if ! command -v docker &>/dev/null; then
    step "Installation de Docker..."
    sudo pacman -Sy --noconfirm docker docker-compose
    sudo usermod -aG docker "$USER"
    ok "Docker installé"
  fi

  if ! docker info &>/dev/null 2>&1; then
    step "Démarrage du daemon Docker..."
    sudo systemctl start docker
    ok "Docker démarré"
  fi
}

# =============================================================================
# Dispatch selon OS
# =============================================================================
ok "OS détecté : $OS"

case "$OS" in
  Darwin)
    install_macos
    ;;
  Linux)
    DISTRO=$(detect_linux_distro)
    ok "Distribution : $DISTRO"
    case "$DISTRO" in
      ubuntu|debian|linuxmint|pop)  install_debian ;;
      fedora|rhel|centos|rocky)     install_fedora ;;
      arch|manjaro|endeavouros)     install_arch   ;;
      *)
        # Fallback : script officiel Docker
        if ! command -v docker &>/dev/null; then
          step "Installation de Docker via script officiel..."
          curl -fsSL https://get.docker.com | sh
          sudo usermod -aG docker "$USER"
        fi
        if ! command -v pnpm &>/dev/null; then
          curl -fsSL https://get.pnpm.io/install.sh | sh -
        fi
        if ! docker info &>/dev/null 2>&1; then
          sudo systemctl start docker 2>/dev/null || true
        fi
        ;;
    esac
    ;;
  *)
    err "OS non supporté : $OS. Installe Docker manuellement : https://docs.docker.com/get-docker/"
    ;;
esac

ok "Docker prêt"
