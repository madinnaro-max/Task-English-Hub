# Task&English Hub — mise en ligne et installation (version 1.2.0)

## Fichiers à envoyer sur GitHub — tous au même endroit que `index.html` (aucun sous-dossier)

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (remplace l'ancienne version) |
| `manifest.json` | Carte d'identité de l'appli : nom, icônes, plein écran (obligatoire pour « Installer ») |
| `service-worker.js` | Fonctionnement hors ligne et mises à jour automatiques |
| `icon-192.png`, `icon-512.png` | Icônes de l'application (obligatoires pour « Installer ») |
| `maskable-192.png`, `maskable-512.png` | Icônes adaptées aux formes d'icônes Android |
| `apple-touch-icon.png` | Icône pour iPhone / iPad |

L'ancien dossier `icons/` n'est plus utilisé : vous pouvez le supprimer du dépôt.

## Mise en ligne depuis le site GitHub

1. Ouvrir le dépôt → **Add file** → **Upload files**.
2. Sélectionner **les 8 fichiers ci-dessus d'un coup** (tout le contenu du dossier) → **Commit changes**.
3. **Settings** → **Pages** : vérifier que le site est publié et que **Enforce HTTPS** est coché.
4. Attendre 1 à 2 minutes que GitHub Pages publie la nouvelle version.

## Installation sur Android (Chrome)

1. Ouvrir l'adresse `https://…github.io/…` dans Chrome (onglet normal, pas en navigation privée)
   et recharger la page une fois.
2. Si un fichier manque encore, l'appli affiche d'elle-même un message rouge après quelques
   secondes. Le détail est dans **Paramètres → Vérifier l'installation** (la version doit être 1.2.0).
3. Quand tout est vert : menu **⋮** → **Installer l'application** (ou le bouton « Installer » de l'appli).

Les données déjà saisies dans Chrome à la même adresse sont conservées dans l'appli installée.

## Mises à jour

Remplacer `index.html` dans le dépôt suffit : l'appli installée charge la nouvelle version à la
prochaine ouverture avec Internet. Si vous ajoutez ou renommez des fichiers, augmentez aussi
`VERSION` en haut de `service-worker.js`.

## Données

Chaque appareil garde ses propres données (stockage du navigateur). Pour les transférer :
Paramètres → **Exporter mes données (.json)**, puis **Importer** sur l'autre appareil.
