.PHONY: dev setup init db-up db-down db-reset migrate payload-migrate payload-types payload-importmap types seed test test-e2e build lint typecheck check clean update import export new help

## Premier lancement OU reprise quotidienne
dev: setup db-up migrate payload-migrate
	pnpm dev

## Setup initial — crée .env.local + installe les deps
setup:
	@if [ ! -f .env.local ]; then \
	  cp .env.example .env.local; \
	  PAYLOAD_SECRET=$$(openssl rand -base64 32 | tr -d '\n' | tr '+/' '-_'); \
	  AUTH_SECRET=$$(openssl rand -base64 32 | tr -d '\n' | tr '+/' '-_'); \
	  sed -i.bak \
	    -e "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=$$PAYLOAD_SECRET|" \
	    -e "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$$AUTH_SECRET|" \
	    .env.local && rm .env.local.bak; \
	  echo "  ✓ .env.local créé (secrets générés)"; \
	fi
	@[ -d node_modules ] || pnpm install

## Démarre Postgres (Docker)
db-up:
	@docker compose up -d postgres
	@printf "  ⏳ Attente Postgres"
	@until docker compose exec -T postgres pg_isready -U lg -d lg >/dev/null 2>&1; do \
	  printf "."; sleep 1; \
	done; echo " ✓"

## Applique le schéma Better Auth (idempotent)
migrate:
	@set -a; . ./.env.local; set +a; \
	  pnpm auth:migrate >/dev/null 2>&1 \
	    && echo "  ✓ Schéma Better Auth OK" \
	    || (echo "  ✗ Migration Better Auth échouée — voir : pnpm auth:migrate"; exit 1)

## Applique les migrations Payload (idempotent)
payload-migrate:
	@set -a; . ./.env.local; set +a; \
	  pnpm payload migrate 2>&1 | grep -v "^\[" | grep -v "^$$" || true; \
	  echo "  ✓ Migrations Payload OK"

## Génère les types TypeScript depuis la config Payload
payload-types:
	@set -a; . ./.env.local; set +a; \
	  pnpm payload generate:types >/dev/null 2>&1 && echo "  ✓ Types Payload régénérés"

## Régénère l'importMap admin (à lancer après ajout d'un plugin avec UI)
payload-importmap:
	@set -a; . ./.env.local; set +a; \
	  pnpm payload generate:importmap >/dev/null 2>&1 && echo "  ✓ ImportMap admin régénéré"

## Régénère types + importMap (alias pratique)
types: payload-types payload-importmap

## Stoppe Postgres
db-down:
	docker compose down

## ⚠ Efface la base
db-reset:
	@printf "⚠️  Efface la base de données. Continuer ? [y/N] " && \
	  read confirm && [ "$$confirm" = "y" ] || exit 0
	docker compose down -v
	@echo "  ✓ Volumes supprimés. Relance avec : make dev"

## Lance lint + typecheck + tests unitaires (avant un commit ou un push)
check: lint typecheck test

## Initialise un nouveau site Folio : prompts (nom, admin email/password, preset), crée l'admin, configure Brand + Settings
init: setup db-up migrate payload-migrate
	@set -a; . ./.env.local; set +a; pnpm tsx scripts/init.ts

## Pré-remplit la DB avec des Pages, Posts, Snippets, Brand de démo (idempotent)
seed:
	@set -a; . ./.env.local; set +a; pnpm seed

## Toolkit data — scaffold une nouvelle collection (interactif)
new:
	@set -a; . ./.env.local; set +a; pnpm folio:new

## Toolkit data — importe un JSON dans une collection
##   Usage : make import COLL=cases FILE=data/cases.json [LOCALE=fr] [UPSERT=slug]
import:
	@set -a; . ./.env.local; set +a; \
	  pnpm folio:import $(COLL) $(FILE) \
	    $(if $(LOCALE),--locale $(LOCALE)) \
	    $(if $(UPSERT),--upsert-by $(UPSERT)) \
	    $(if $(DRY),--dry-run)

## Toolkit data — exporte une collection vers un JSON
##   Usage : make export COLL=posts FILE=backup/posts.json [LOCALE=fr] [WHERE=_status=published]
export:
	@set -a; . ./.env.local; set +a; \
	  pnpm folio:export $(COLL) $(FILE) \
	    $(if $(LOCALE),--locale $(LOCALE)) \
	    $(if $(WHERE),--where $(WHERE))

## Nettoie le cache Next + l'importMap admin (à lancer après changement de schéma Payload)
clean:
	@rm -rf .next
	@echo "  ✓ .next supprimé"
	@echo "  Tip: relance avec : make dev"

## Applique les upgrades du boilerplate (de la version courante à la dernière)
update:
	@set -a; . ./.env.local; set +a; pnpm tsx scripts/upgrades/index.ts

build:     ; pnpm build
lint:      ; pnpm lint
typecheck: ; pnpm typecheck
test:      ; pnpm test
test-e2e:  ; pnpm test:e2e

help:
	@echo ""
	@echo "  make dev               Lancer le projet (setup + Postgres + migrations + Next.js)"
	@echo "  make setup             .env.local + pnpm install (idempotent)"
	@echo ""
	@echo "  make db-up             Démarrer Postgres (Docker)"
	@echo "  make db-down           Stopper Postgres"
	@echo "  make db-reset          Effacer la base (avec confirmation)"
	@echo ""
	@echo "  make migrate           Appliquer le schéma Better Auth"
	@echo "  make payload-migrate   Appliquer les migrations Payload"
	@echo "  make types             Régénérer types TS + importMap admin"
	@echo ""
	@echo "  make check             Lint + typecheck + tests unitaires"
	@echo "  make test              Tests unitaires (Vitest)"
	@echo "  make test-e2e          Tests E2E (Playwright)"
	@echo "  make seed              Pré-remplit la DB avec des données de démo"
	@echo "  make clean             Supprime .next (à lancer si écran blanc /admin après migration)"
	@echo "  make update            Applique les upgrades du boilerplate (lit .boilerplate-version)"
	@echo "  make build             pnpm build"
	@echo ""
