# Florésia – application web

Florésia est mon projet pédagogique de boutique florale. Cette application React permet de consulter les bouquets, créer une composition personnalisée, gérer son compte et son panier, simuler une commande et participer au journal floral et à la communauté.

Le site est disponible sur [floresia.fr](https://floresia.fr) et communique avec l’API publiée sur [api.floresia.fr](https://api.floresia.fr).

## Technologies principales

- React 19, React Router et Vite ;
- CSS responsive ;
- Vitest et Testing Library ;
- Google Analytics 4 chargé après consentement ;
- sitemap, métadonnées sociales et URL canoniques.

## Installation locale

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Les variables utiles sont décrites dans `.env.example`. Les secrets ne doivent jamais être enregistrés dans Git.

## Vérifications

```powershell
npm run lint
npm test -- --run
npm run build
```

Le build est créé dans `dist`. Il comprend aussi les fichiers SEO générés automatiquement.

## Organisation

- `src/pages` contient les pages métier ;
- `src/components` regroupe les éléments réutilisables ;
- `src/context` conserve les états partagés ;
- `src/services` communique avec l’API ;
- `src/assets` et `public` contiennent les médias ;
- `tests` vérifie les parcours importants.

Le rôle des dossiers et fichiers importants est détaillé dans [ARCHITECTURE.md](ARCHITECTURE.md).

## Déploiement

Le front est compilé avec les variables de production. Le contenu de `dist` est ensuite placé directement dans `public_html` sur Hostinger. Le fichier `.htaccess` gère les routes, la compression et le cache.

Ce projet a été réalisé dans le cadre de ma formation. Les commandes et paiements présentés sont des démonstrations pédagogiques.
