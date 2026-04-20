#!/bin/bash

set -e

echo "🚀 Déploiement"

# Vérifications pré-déploiement
if [[ $(git status --porcelain) ]]; then
  echo "❌ Working tree pas propre. Committez vos changements."
  exit 1
fi

if [[ $(git branch --show-current) != "main" ]]; then
  echo "❌ Pas sur la branche main."
  exit 1
fi

# Tests locaux
echo "🧪 Lancement des tests..."
pnpm test
pnpm test:e2e

# Tag automatique (semver)
current_version=$(node -p "require('./package.json').version")
new_version=$(echo $current_version | awk -F. '{print $1"."$2"."($3+1)}')
echo "📦 Nouvelle version: $new_version"
npm version $new_version --no-git-tag-version
git add package.json
git commit -m "chore: bump version to $new_version"

# Push
echo "📤 Push vers remote..."
git push origin main --tags

# Déploiement Dokploy
echo "⚙️ Déclenchement déploiement Dokploy..."
curl -X POST $DOKPLOY_API_URL/api/deploy \
  -H "Authorization: Bearer $DOKPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "your-project-id"}'

# Healthcheck post-déploiement
echo "🔍 Vérification santé..."
sleep 30
if curl -f $SITE_URL/api/health > /dev/null; then
  echo "✅ Déploiement réussi !"
else
  echo "❌ Healthcheck échoué. Rollback nécessaire."
  # TODO: rollback automatique
  exit 1
fi
