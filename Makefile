.PHONY: dev infra snapshot stop reset deploy backup \
        build lint typecheck test test-e2e help \
        _infra-up _setup

# ══════════════════════════════════════════════════════════════════════════════
# COMMANDES PRINCIPALES
# ══════════════════════════════════════════════════════════════════════════════

## Développement local — premier lancement ou reprise quotidienne
dev: _setup _infra-up
	pnpm dev

## Configure les serveurs de production (VPS + GitHub Secrets)
## À lancer une fois quand le projet est prêt à être mis en ligne
infra:
	@bash scripts/wizard-infra.sh

## Capture le schéma Directus → Git (après modif dans l'interface)
snapshot:
	@bash scripts/cms-snapshot.sh

# ══════════════════════════════════════════════════════════════════════════════
# COMMANDES SECONDAIRES
# ══════════════════════════════════════════════════════════════════════════════

## Arrête les conteneurs Docker
stop:
	docker compose -f infra/local/docker-compose.yml down

## Repart de zéro — EFFACE la base de données
reset:
	@printf "⚠️  Efface la base de données et les uploads. Continuer ? [y/N] " && \
	  read confirm && [ "$$confirm" = "y" ] || exit 0
	docker compose -f infra/local/docker-compose.yml down -v
	@echo "Volumes supprimés. Relance avec : make dev"

## Déploiement manuel (le CI/CD le fait automatiquement via git push)
deploy:
	@bash scripts/deploy.sh

backup:
	@bash scripts/backup.sh

# ── Qualité ───────────────────────────────────────────────────────────────────
build:      ; pnpm build
lint:       ; pnpm lint
typecheck:  ; pnpm typecheck
test:       ; pnpm test
test-e2e:   ; pnpm test:e2e

# ══════════════════════════════════════════════════════════════════════════════
# INTERNES
# ══════════════════════════════════════════════════════════════════════════════

_setup:
	@[ -f apps/web/.env.local ] || bash scripts/setup.sh

_infra-up:
	@bash scripts/docker-ensure.sh
	@docker compose -f infra/local/docker-compose.yml ps --services --filter "status=running" 2>/dev/null \
	  | grep -q "directus" \
	  || (echo "▶ Démarrage de l'infra..." && docker compose -f infra/local/docker-compose.yml up -d)
	@bash scripts/cms-apply.sh --silent

# ══════════════════════════════════════════════════════════════════════════════

help:
	@echo ""
	@echo "  make dev        Développement local (setup auto au premier lancement)"
	@echo "  make infra      Configurer les serveurs de production"
	@echo "  make snapshot   Sauvegarder le schéma Directus dans Git"
	@echo ""
	@echo "  make stop       Arrêter les conteneurs"
	@echo "  make reset      Repartir de zéro (⚠ efface la DB)"
	@echo "  make deploy     Déploiement manuel"
	@echo ""
