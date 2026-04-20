# Configuration Dokploy

Ce dossier contient la configuration pour déployer avec Dokploy.

## Prérequis

- VPS Ubuntu 24.04 LTS
- Dokploy installé (voir docs/deployment.md)

## Utilisation

1. Copiez `.env.example` vers `.env` et ajustez les valeurs
2. Importez `docker-compose.yml` dans Dokploy
3. Configurez Traefik via l'interface Dokploy ou utilisez `traefik.yml`
4. Déployez !

## Services

- **postgres** : Base de données PostgreSQL 16
- **redis** : Cache et sessions
- **directus** : CMS headless
- **web** : Application Next.js
- **minio** : Stockage S3-compatible (optionnel)

## Sécurité

- Certificats SSL auto via Let's Encrypt
- Variables d'env validées
- Healthchecks intégrés
