# Déploiement — VPS Ubuntu 24.04 + Dokploy

Guide complet pour passer de zéro à une application en production.

---

## Prérequis

- VPS Ubuntu 24.04 LTS (recommandé : 2 vCPU / 4 Go RAM minimum)
- Accès SSH root ou sudo
- Nom de domaine pointé sur l'IP du VPS (A record)
- Compte GitHub avec accès au repo

---

## 1. Préparer le VPS

```bash
# Mise à jour système
apt update && apt upgrade -y

# Dépendances de base
apt install -y curl git ufw

# Pare-feu : autoriser SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

## 2. Installer Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Vérification
docker --version
```

---

## 3. Installer Dokploy

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Dokploy se lance sur le port **3000** par défaut. Accède à `http://<IP-VPS>:3000` pour le premier setup (création compte admin).

> Dokploy embarque Traefik pour le reverse proxy et Let's Encrypt. Assure-toi que les ports 80 et 443 sont ouverts avant ce step.

---

## 4. Configurer le projet dans Dokploy

### 4.1 Créer un projet

Dans l'interface Dokploy :

1. **Projects → New Project** → Nomme-le (ex: `coreo-boilerplate`)
2. **Add Application → Docker Compose**
3. Source : GitHub → sélectionne le repo
4. Compose file : `infra/dokploy/docker-compose.yml`

### 4.2 Variables d'environnement

Dans l'onglet **Environment** de l'application, colle le contenu de `.env.example` adapté :

```env
# PostgreSQL
POSTGRES_DB=app_db
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<mot-de-passe-fort>

# Directus
DIRECTUS_ADMIN_EMAIL=admin@ton-domaine.fr
DIRECTUS_ADMIN_PASSWORD=<mot-de-passe-fort>
DIRECTUS_SECRET=<chaîne-aléatoire-64-chars>
DIRECTUS_PUBLIC_URL=https://cms.ton-domaine.fr
DIRECTUS_ACCESS_TOKEN_TTL=15m
DIRECTUS_REFRESH_TOKEN_TTL=7d

# Next.js
NEXT_PUBLIC_SITE_URL=https://ton-domaine.fr
NEXT_PUBLIC_SITE_NAME=Mon Application
NEXT_REVALIDATE_TOKEN=<chaîne-aléatoire-32-chars>
DIRECTUS_URL=http://directus:8055

# Modules
NEXT_PUBLIC_ENABLE_CORE_PAGES=true
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_PRODUCTS=false
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### 4.3 Domaines (Traefik)

Dans l'onglet **Domains** :

- `ton-domaine.fr` → service `web` port 3000
- `cms.ton-domaine.fr` → service `directus` port 8055

Coche **HTTPS / Let's Encrypt** pour chacun. Traefik génère les certificats automatiquement.

---

## 5. Premier déploiement

```bash
# Depuis ton poste local
make deploy
# ou manuellement :
bash scripts/deploy.sh
```

Le script :

1. Vérifie la branche et le working tree
2. Lance les tests
3. Tag la version en semver
4. Push sur `main`
5. Appelle l'API Dokploy pour déclencher le build
6. Attend et vérifie `/api/health`

---

## 6. Appliquer le schéma Directus

Après le premier déploiement, applique le schéma initial :

```bash
# Dans le container Directus (via Dokploy → Terminal, ou SSH)
npx directus schema apply /directus/extensions/snapshots/initial-schema.yml --yes
```

Ou via le script bootstrap :

```bash
docker compose exec directus node bootstrap.js
```

---

## 7. Récupérer les secrets CI/CD

Dans GitHub → Settings → Secrets → Actions, ajoute :

| Secret            | Valeur                                |
| ----------------- | ------------------------------------- |
| `DOKPLOY_API_URL` | `https://dokploy.ton-domaine.fr`      |
| `DOKPLOY_API_KEY` | Clé API Dokploy (Settings → API Keys) |
| `DOKPLOY_APP_ID`  | ID de l'application (URL Dokploy)     |
| `SITE_URL`        | `https://ton-domaine.fr`              |

---

## 8. Backup automatique

Le script `scripts/backup.sh` dump Postgres + assets Directus vers S3.
Configure le cron via Dokploy → Schedules ou directement sur le VPS :

```bash
crontab -e
# Backup quotidien à 3h du matin
0 3 * * * /path/to/scripts/backup.sh >> /var/log/coreo-backup.log 2>&1
```

Variables requises dans l'environnement : `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`.

---

## 9. Mise à jour future

```bash
git pull origin main
make deploy
```

Le pipeline CI/CD (`.github/workflows/deploy.yml`) gère :

- Lint + typecheck
- Tests Vitest
- Build image Docker → GHCR
- Déploiement via Dokploy
- Rollback automatique si le healthcheck échoue
