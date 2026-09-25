# Architecture du front Florésia

Ce document décrit les fichiers du front afin de retrouver rapidement une fonctionnalité.

## Fichiers de la racine

| Chemin | Rôle |
|---|---|
| `package.json` | Dépendances et commandes npm. |
| `package-lock.json` | Versions exactes installées. |
| `index.html` | HTML initial, SEO et ressources prioritaires. |
| `vite.config.js` | Build Vite et copie de `.htaccess`. |
| `vitest.config.js` | Environnement et couverture des tests. |
| `eslint.config.js` | Règles JavaScript et React. |
| `.env.example` | Exemple des variables publiques. |
| `.env.production` | Valeurs publiques du build en ligne. |
| `.gitignore` | Fichiers locaux, builds et archives exclus. |
| `README.md` | Installation, contrôles et déploiement. |

## Code dans `src`

| Chemin | Rôle |
|---|---|
| `main.jsx` | Monte React dans la page. |
| `app/App.jsx` | Routes, contextes et structure commune. |
| `index.css` | Variables et styles généraux. |
| `services/api.js` | Toutes les requêtes vers l’API. |
| `utils/price.js` | Formatage des prix en euros. |
| `data/stores.js` | Recherche et tri des fleuristes de démonstration. |
| `context/auth` | Session, connexion et inscription. |
| `context/cart` | Panier, quantités et total. |
| `context/toast` | Messages temporaires. |
| `context/confirm` | Demandes de confirmation. |

## Composants

| Dossier | Rôle |
|---|---|
| `components/navbar` | Navigation et menu mobile. |
| `components/footer` | Pied de page et liens. |
| `components/chat` | Chatbot Flora. |
| `components/consent` | Cookies et chargement conditionnel de GA4. |
| `components/meta` | Titres, descriptions, canonique et réseaux sociaux. |
| `components/address` | Autocomplétion d’adresse et coordonnées. |
| `components/select` | Liste déroulante accessible. |
| `components/loading` | Squelettes de chargement. |

## Pages

| Dossier | Rôle |
|---|---|
| `pages/home` | Accueil et sélections. |
| `pages/shop` | Catalogue, filtres et favoris. |
| `pages/product` | Détail d’un bouquet. |
| `pages/custom-bouquet` | Composition personnalisée. |
| `pages/cart` | Panier, livraison, retrait et paiement. |
| `pages/orders` | Succès ou annulation de commande. |
| `pages/account` | Connexion, profil, adresses et commandes. |
| `pages/blog` | Journal floral et commentaires. |
| `pages/community` | Avis et galerie. |
| `pages/admin` | Gestion administrateur. |
| `pages/information` | Contact, mentions, conditions, RGPD et cookies. |
| `pages/not-found` | Route inconnue. |

## Images et fichiers publics

| Dossier | Contenu |
|---|---|
| `src/assets/brand` | Logo et panier. |
| `src/assets/home` | Décors de l’accueil. |
| `src/assets/blog` | Illustration du journal. |
| `src/assets/community` | Bannière, galerie et témoignages. |
| `src/assets/custom-bouquet` | Ruban du configurateur. |
| `src/assets/chat` | Icône de Flora. |
| `src/assets/footer` | Décors du pied de page. |
| `src/assets/shared` | Ciseau partagé. |
| `public/products` | Images stables des bouquets. |
| `public/flowers` | Images stables des fleurs. |
| `public/blog` | Images stables des articles. |
| `public/.htaccess` | Routes SPA, cache et compression. |
| `public/accueil-hero.webp` | Image principale préchargée. |

Les fichiers WebP sont les versions légères utilisées dans l’interface. Certains PNG restent comme sources originales ou images sociales.

## Scripts et tests

| Chemin | Rôle |
|---|---|
| `scripts/generate-seo-files.mjs` | Génère `sitemap.xml` et `robots.txt`. |
| `tests/parcours.test.jsx` | Parcours publics. |
| `tests/commande.test.jsx` | Panier et commande. |
| `tests/services-contextes.test.jsx` | API, session et panier. |
| `tests/address-autocomplete.test.jsx` | Sélection d’adresse. |
| `tests/consent-manager.test.jsx` | Choix des cookies. |
| `tests/fixtures.jsx` | Données communes. |
| `tests/setup.js` | Préparation de Vitest. |

## Parcours d’une donnée

Une page appelle `services/api.js`. Le service ajoute le jeton aux routes protégées, contacte l’API et transforme les erreurs en messages lisibles. La page ou un contexte met ensuite l’interface à jour.
