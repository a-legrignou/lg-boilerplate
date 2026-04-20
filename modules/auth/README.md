# Module auth

Ce module complète l’authentification Directus avec des préférences utilisateur et un espace account.

## Collections Directus

- `user_preferences`

## Objectifs

- stocker les préférences utilisateur liées à Directus `users`
- faciliter l’intégration du dashboard `/account`

## Routes

- `/auth` — page de connexion
- `/api/auth/login` — connexion via Directus
- `/api/auth/logout` — déconnexion et suppression des cookies
- `/api/auth/refresh` — rafraîchissement de session
- `/api/auth/me` — état d’authentification
- `/account` — espace utilisateur protégé
