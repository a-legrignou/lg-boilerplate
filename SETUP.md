# Nouveau projet — Guide de setup

---

## Prerequis

### Outils locaux (Mac)

| Outil | Version min. | Verification |
|---|---|---|
| Node.js | 20+ | `node -v` |
| npm | 10+ | `npm -v` |
| Git | 2.x | `git --version` |
| SSH | - | `ssh -V` |

### Comptes et acces

| Service | Ce qu'il faut | Ou le creer |
|---|---|---|
| **GitHub** | Repo prive + Personal Access Token (scope `Contents: Read-only`) | github.com > Settings > Developer settings > PAT > Fine-grained |
| **Directus** | Instance deployee + compte de service avec Static Token | Directus > Settings > Users > [service account] > Token |
| **Serveur** | VPS Ubuntu 20+ avec acces SSH root/sudo | OVH, Hetzner, Scaleway, etc. |
| **Domaine** | Nom de domaine pointe vers l'IP du serveur (A record) | Registrar DNS |

### Serveur

- Ubuntu 20.04+ (ou Debian 11+)
- Ports **80** et **443** ouverts (firewall)
- Acces SSH via cle (pas mot de passe)
- Au moins 1 Go RAM / 10 Go disque

> Node, Nginx, PM2, Certbot sont installes automatiquement par `deploy.sh --first`.

---

## Etape 1 — Cloner et initialiser

```bash
# Cloner le template
git clone https://github.com/a-legrignou/coreo-front.git mon-site
cd mon-site

# Reinitialiser Git pour le nouveau projet
rm -rf .git && git init
git remote add origin https://github.com/a-legrignou/mon-site.git

# Installer les dependances
npm install
```

---

## Etape 2 — Cle SSH serveur

```bash
# Generer une cle dediee au projet
mkdir -p ~/.ssh/mon-projet
ssh-keygen -t ed25519 -C "mon-projet-deploy" -f ~/.ssh/mon-projet/key -N ""
chmod 600 ~/.ssh/mon-projet/key

# Copier la cle publique sur le serveur
ssh-copy-id -i ~/.ssh/mon-projet/key.pub ubuntu@xxx.xxx.xxx.xxx

# Tester la connexion
ssh -i ~/.ssh/mon-projet/key ubuntu@xxx.xxx.xxx.xxx exit && echo "OK"
```

---

## Etape 3 — Configuration

### 3.1 `.deploy/config.env` — identite + infra (committe)

```env
# Projet
PROJECT_NAME=mon-projet
SITE_NAME=Mon Site
ENV=prod

# Domaine
DOMAIN=mon-site.fr
SITE_URL=https://mon-site.fr

# Serveur
SSH_USER=ubuntu
SSH_HOST=xxx.xxx.xxx.xxx
SSH_KEY=~/.ssh/mon-projet/key
SECRETS=~/.ssh/mon-projet/secrets.env

# Application
CLIENT_PORT=3000
NODE_MIN_VERSION=20
BRANCH=main

# Services
DIRECTUS=https://admin.mon-site.fr
REPO_URL=https://github.com/a-legrignou/mon-site.git
REPO_SLUG=a-legrignou/mon-site
```

### 3.2 `.env.local` — dev local (jamais committe)

```env
NEXT_PUBLIC_DIRECTUS_URL=https://admin.mon-site.fr
NEXT_PUBLIC_DIRECTUS_ASSETS=https://admin.mon-site.fr/assets/
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Mon Site
NEXT_PUBLIC_APP_ENV=development
DIRECTUS_URL=https://admin.mon-site.fr
```

### 3.3 Secrets Mac — `~/.ssh/mon-projet/secrets.env` (jamais committe)

```bash
cat > ~/.ssh/mon-projet/secrets.env << 'EOF'
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
DIRECTUS_STATIC_TOKEN=xxxxxxxxxxxx
EOF
chmod 600 ~/.ssh/mon-projet/secrets.env
```

### 3.4 Secrets serveur — `/etc/coreo/secrets.env`

```bash
ssh -i ~/.ssh/mon-projet/key ubuntu@xxx.xxx.xxx.xxx "
  sudo mkdir -p /etc/coreo
  cat << 'EOF' | sudo tee /etc/coreo/secrets.env
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
DIRECTUS_STATIC_TOKEN=xxxxxxxxxxxx
EOF
  sudo chmod 600 /etc/coreo/secrets.env
"
```

### Ou trouver les tokens

| Token | Ou | Permissions |
|---|---|---|
| `GITHUB_TOKEN` | github.com > Settings > Developer settings > PAT > Fine-grained | Repository: `mon-site` / Contents: `Read-only` |
| `DIRECTUS_STATIC_TOKEN` | Directus > Settings > Users > [service account] > Token | Role avec acces lecture aux collections |

---

## Etape 4 — Directus

### Collection `site_settings` (singleton)

| Champ | Type | Obligatoire | Exemple |
|---|---|---|---|
| `site_name` | string | oui | Mon Site |
| `site_tagline` | text | oui | Description courte du site |
| `legal_name` | string | oui | SAS Mon Site |
| `contact_email` | string | oui | contact@mon-site.fr |
| `site_url` | string | oui | https://mon-site.fr |
| `linkedin_url` | string | non | https://linkedin.com/company/mon-site |
| `offices` | string | non | Paris · Lyon |
| `logo` | file | oui | Logo principal |
| `default_og_image` | file | oui | Image OG par defaut (1200x630) |
| `default_seo_description` | text | oui | Description SEO globale |
| `default_seo_title` | string | non | Titre SEO par defaut |
| `google_site_verification` | string | non | Token Google Search Console |
| `twitter_handle` | string | non | @mon_site |

### Collections de contenu

Les collections `pages`, `sections`, `blocks`, `posts`, `case_studies`, `products`, `team_members` suivent le meme schema que le projet source.

Pour demarrer rapidement : exporter le schema Directus du projet source via `npx directus schema snapshot` et l'appliquer sur la nouvelle instance.

---

## Etape 5 — Design

### 5.1 Couleurs — `src/styles/global.css` (ligne ~28)

```css
--color-navy: #1c2a39;   /* primaire — fonds sombres, CTA, header */
--color-gold: #c6a75c;   /* accent — highlights, hover, bordures */
--color-sage: #7a8f85;   /* secondaire — badges, validation, soft UI */
```

### 5.2 Typographie — `src/app/layout.js` (ligne ~3)

```js
// Remplacer par la font du projet
import { EB_Garamond } from "next/font/google";
```

### 5.3 Animations (optionnel)

Les widgets decoratifs (`beamlines`, `grid-flow`, `marquee`) sont dans `src/components/widgets/`.
Supprimer ou adapter selon le design du nouveau projet.

---

## Etape 6 — Dev local

```bash
npm run dev
```

### Verification

- [ ] Page d'accueil charge sans erreur
- [ ] Logo et nom du site viennent de Directus
- [ ] Footer : tagline, LinkedIn, mentions legales OK
- [ ] Dark mode fonctionne
- [ ] `http://localhost:3000/api/auth/me` retourne `{"user":null,"tier":"public","authenticated":false}`

---

## Etape 7 — Premier deploiement

```bash
bash deploy.sh --first
```

Ce que fait cette commande automatiquement :

```
1. Verification des prerequis (cle SSH, tokens, connexion serveur)
2. Build local (verifie que le code compile)
3. Git add + commit + push
4. SSH vers le serveur :
   a. Clone le repo (ou git pull)
   b. Installe Node.js, Nginx, PM2, Certbot
   c. Genere le certificat SSL Let's Encrypt
   d. Configure Nginx (HTTPS, reverse proxy)
   e. Genere .env.production
   f. npm ci + npm run build
   g. Demarre l'app via PM2
   h. Configure PM2 au demarrage (reboot safe)
```

### Mises a jour suivantes

```bash
bash deploy.sh                 # commit auto + deploy
bash deploy.sh "mon message"   # commit avec message custom
```

---

## Etape 8 — Diagnostic

```bash
bash diag.sh            # audit complet via SSH
bash diag.sh --local    # audit local
```

### Ce qui est verifie

| Module | Checks |
|---|---|
| Environnement | Node.js, npm, version Next.js |
| Variables | .env.production, variables requises |
| PM2 | Status processus, uptime, restarts |
| Port | Next.js ecoute sur le bon port |
| API | Routes critiques (auth, homepage) |
| Nginx | Config valide, service actif, logs |
| SSL | HTTPS accessible, expiration certificat |
| Systeme | Disque, RAM, load average, taille build |

Le rapport JSON est accessible dans l'admin : `/admin/health` (connexion requise).

---

## Checklist finale

### Config

- [ ] `.deploy/config.env` rempli (PROJECT_NAME, DOMAIN, SSH_*, DIRECTUS, REPO_*)
- [ ] `.env.local` rempli
- [ ] Secrets Mac : `~/.ssh/mon-projet/secrets.env` (GITHUB_TOKEN, DIRECTUS_STATIC_TOKEN)
- [ ] Secrets serveur : `/etc/coreo/secrets.env` (idem)

### Directus

- [ ] Instance deployee et accessible
- [ ] `site_settings` rempli (nom, tagline, logo, SEO)
- [ ] Collections de contenu creees (pages, sections, blocks, posts)
- [ ] Compte de service avec Static Token

### Design

- [ ] Couleurs modifiees dans `global.css`
- [ ] Font modifiee dans `layout.js`

### Deploiement

- [ ] Cle SSH configuree et testee
- [ ] DNS pointe vers le serveur (A record)
- [ ] `npm run dev` fonctionne en local
- [ ] `bash deploy.sh --first` reussi
- [ ] `https://mon-site.fr` accessible
- [ ] `bash diag.sh` — tous les checks verts

---

## Architecture

```
.deploy/                        # Infrastructure
  config.env                    #   Config projet (committe)
  secrets.env.example           #   Template secrets
  install.sh                    #   Premier deploiement (serveur)
  update.sh                     #   Mise a jour (serveur)
  lib/                          #   Modules : utils, node, nginx, pm2, build
  templates/                    #   Templates : nginx.conf, ecosystem, .env

.diag/                          # Diagnostic
  run.sh                        #   Orchestrateur (serveur)
  lib/                          #   Modules : env, pm2, nginx, ssl, api, system

src/
  app/
    api/                        # Routes API
      auth/                     #   Login, logout, refresh, me
      contact/                  #   Formulaire contact
      csrf/                     #   Token CSRF
      admin/health/             #   Rapport diagnostic
      */pdf/                    #   Export PDF
    [locale]/                   # Pages localisees
      page.js                   #   Accueil
      [...slug]/page.js         #   Pages dynamiques
      blog/                     #   Blog listing + detail
      contact/                  #   Contact
      login/                    #   Connexion
      account/                  #   Espace membre
      admin/health/             #   Dashboard diagnostic
    layout.js                   # Layout racine
    robots.js                   # robots.txt dynamique
    sitemap.js                  # Sitemap dynamique

  components/
    ui/                         # shadcn/ui (27 composants)
    blocks/                     # Blocs CMS (paragraph, image, kpi, list, etc.)
    sections/                   # Sections de page (faq, areas, trust-bar, etc.)
    layout/                     # Footer, post, maintenance
    menus/                      # Top menu + mobile
    forms/                      # Contact, satisfaction, login
    widgets/                    # Decoratifs (beamlines, marquee, timeline, etc.)
    pdf/                        # Generateurs PDF (blog, expertise, case study)

  lib/
    models/                     # Acces donnees Directus (TypeScript, cache)
    types/                      # Types TypeScript complets
    controllers/                # Renderer (blocks/sections), forms, posts
    utils/                      # Auth, CSRF, Directus client, assets, cn
    hooks/                      # Dark mode, locale, cookie consent, filters
    validators/                 # Schemas Zod (contact, satisfaction)
    seo/                        # Metadata Next.js + JSON-LD Schema.org

  styles/
    global.css                  # Design tokens, theme clair/sombre, animations
    tones.ts                    # Mapping couleurs par tone de section
```
