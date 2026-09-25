# Architecture du front Florésia

Ce document sert de repère rapide pour retrouver une fonctionnalité sans parcourir tout le projet.

## Racine

| Chemin | Rôle |
|---|---|
| `index.html` | Modèle HTML et métadonnées initiales. |
| `vite.config.js` | Configuration du build. |
| `vitest.config.js` | Configuration des tests. |
| `.env.example` | Variables publiques attendues. |
| `scripts/generate-seo-files.mjs` | Génère le sitemap et robots.txt. |
| `public/` | Fichiers publics copiés dans le build. |
| `tests/` | Tests des parcours essentiels. |

## Code de l’application

| Chemin | Rôle |
|---|---|
| `src/main.jsx` | Monte l’application React. |
| `src/app/App.jsx` | Déclare les routes et contextes globaux. |
| `src/index.css` | Variables et styles partagés. |
| `src/services/api.js` | Centralise les appels vers l’API. |
| `src/context/auth` | Gère la session utilisateur. |
| `src/context/cart` | Gère le panier et ses totaux. |
| `src/context/toast` | Affiche les messages temporaires. |
| `src/context/confirm` | Affiche les confirmations. |
| `src/components/consent` | Gère les cookies et GA4. |
| `src/components/meta` | Met à jour les métadonnées SEO. |
| `src/components/address` | Recherche et sélectionne une adresse. |
| `src/components/chat` | Affiche le chatbot Flora. |

## Pages

| Dossier | Fonctionnalité |
|---|---|
| `pages/home` | Accueil et sélections. |
| `pages/shop` | Catalogue, filtres et favoris. |
| `pages/product` | Détail d’un bouquet. |
| `pages/custom-bouquet` | Composition personnalisée. |
| `pages/cart` | Panier, livraison et paiement simulé. |
| `pages/orders` | Résultat de la commande. |
| `pages/account` | Compte, profil et adresses. |
| `pages/blog` | Articles et commentaires. |
| `pages/community` | Avis et galerie. |
| `pages/admin` | Gestion administrateur. |
| `pages/information` | Pages légales et contact. |

## Parcours d’une donnée

Une page appelle `services/api.js`. Le service ajoute le jeton si la route est protégée, contacte l’API et transforme les erreurs en messages lisibles. La page ou un contexte met ensuite l’interface à jour.
