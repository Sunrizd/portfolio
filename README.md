# Portfolio SysAdmin - Système "ROOT ACCESS"

Portfolio personnel conçu comme une interface en ligne de commande (CLI) moderne avec un thème Catppuccin.
Le projet inclut un **CMS intégré (Dockerisé)** pour gérer le contenu sans toucher au code.

## 🚀 Démarrage Rapide

### 1. Installation
Tout le projet est conteneurisé.

1.  Clonez le dépôt.
2.  **Configuration initiale :**
    ```bash
    cp public/config.example.json public/config.json
    cp public/seo.example.json public/seo.json
    cp public/robots.example.txt public/robots.txt
    cp public/sitemap.example.xml public/sitemap.xml
    cp public/assets/preview_example.jpg public/assets/preview.jpg
    ```
3.  Lancez l'interface d'administration :

```bash
docker compose up -d
```

-   **Interface Admin (CMS) :** `http://votre-ip:3030/sys-ops`
-   L'accès est protégé par URL masquée (modifiez le path dans le code si nécessaire).

### 2. Mettre à jour le contenu (Texte, Projets...)
1.  Allez sur l'interface Admin `/sys-ops`.
2.  Utilisez l'interface visuelle pour :
    -   Modifier les textes (Hero, À propos...).
    -   Ajouter/Ordonner des projets (Drag & Drop).
    -   Gérer vos compétences.
3.  Cliquez sur **Sauvegarder**.
    - La mise à jour est **immédiate** sur le site en production (le CMS met à jour `dist/` automatiquement).

### 3. Mettre à jour le CODE (JS, CSS, Structure)
Si vous modifiez des fichiers dans le dossier `src/` (ex: changer une couleur, la logique JS), vous devez reconstruire le site.

Utilisez cette commande (pas besoin d'installer Node sur votre machine) :

```bash
docker exec portfolio-sysops npm run build
```

Cela va recompiler les sources et mettre à jour le dossier `dist/`

---

## 🛠 Architecture

-   **Frontend :** Vanilla JS, Vite, CSS (Variables CSS pour le thème).
-   **CMS :** Node.js (Express), JSONEditor, Quill (Rich Text), SortableJS.
-   **Données :** `public/config.json` (Fichier unique contenant tout le contenu).
-   **Déploiement :** Docker + Nginx (servant le dossier `dist`).

## 📁 Structure des fichiers

```bash
.
├── cms/                # Code source de l'interface Admin
├── cms-server.js       # Serveur Node.js du CMS (API)
├── public/
│   └── config.json     # ⚠️ LA SOURCE DE VÉRITÉ (Tout le contenu est ici)
├── src/                # Code source du site (JS, CSS)
├── dist/               # Site compilé (Production)
├── docker-compose.yml  # Configuration des conteneurs
└── Dockerfile          # Environnement Node.js
```

## 🎨 Thème

Le projet utilise la palette **Catppuccin Mocha**.
Les couleurs sont définies dans `src/style.css` et `cms/index.html`.

## 🛡 Sécurité

-   Le CMS est isolé dans un conteneur.
-   L'accès fichier est restreint à `config.json` et `seo.json`.
-   **Recommandation :** Pour la production, protégez l'accès au port 3030 via un pare-feu ou une authentification Basic Auth sur votre Reverse Proxy.
