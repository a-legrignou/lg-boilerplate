# LG Boilerplate

Stack : **Next.js 16 · Directus CMS · PostgreSQL · Docker**

---

## Démarrer un projet

**Sur GitHub** → bouton **"Use this template"** → donne un nom → clone.

```bash
git clone git@github.com:ton-org/mon-projet.git
cd mon-projet
make dev
```

Un assistant te guide pour configurer le projet, les secrets, et les serveurs.
Tout est automatique — y compris l'installation de Docker si absent.

---

## Workflow quotidien

```bash
make dev        # reprendre le travail (démarre tout si nécessaire)
make snapshot   # après avoir modifié le schéma dans Directus
make push       # commit + push Git + déploiement automatique
```

---

## Mettre en production

```bash
make infra      # configure les VPS + guide Dokploy (une seule fois)
make push       # → CI/CD → front + back déployés automatiquement
```

---

## Modules

Dans `apps/web/.env.local` :

```env
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_PRODUCTS=false
NEXT_PUBLIC_ENABLE_AUTH=true
```

---

## Commandes

```bash
make dev        # lance tout (setup auto au premier lancement)
make infra      # configure les serveurs de production
make snapshot   # schéma Directus → Git
make stop       # arrêter les conteneurs
make reset      # repartir de zéro (⚠ efface la DB)
make push       # commit + push Git + déploiement
make deploy     # déploiement manuel (sans push Git)
make help       # toutes les commandes
```

---

## Stack

|       |                                                  |
| ----- | ------------------------------------------------ |
| Front | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| CMS   | Directus 11 (headless, self-hosted)              |
| BDD   | PostgreSQL 16 + Redis 7                          |
| Auth  | Directus natif, cookies httpOnly                 |
| Infra | Docker, Dokploy, Traefik, Let's Encrypt          |
| CI/CD | GitHub Actions → GHCR → Dokploy                  |
