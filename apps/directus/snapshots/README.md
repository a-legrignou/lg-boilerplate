# Snapshots Directus

Ce dossier contient les fichiers d’export/import Directus.

## Bonnes pratiques

- `directus schema apply --yes ./snapshots/initial-schema.yml` pour importer la base commune.
- Pour livrer chaque module, ajoutez un fichier YAML spécifique sous `modules/*/schema`.
- Les collections sont organisées par module pour rester activables et isolées.
