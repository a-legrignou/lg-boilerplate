#!/bin/bash

set -e

echo "💾 Sauvegarde"

# Dump PostgreSQL
echo "📊 Dump base de données..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde assets Directus
echo "📁 Sauvegarde assets..."
# TODO: rsync ou rclone vers S3

# Upload vers S3
echo "☁️ Upload vers S3..."
# TODO: aws s3 cp ou équivalent

echo "✅ Sauvegarde terminée"