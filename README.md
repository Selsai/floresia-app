# Floresia - application web

Interface React et Vite du projet pedagogique Floresia.

## Developpement

```powershell
npm install
npm run dev
```

Copier `.env.example` en `.env` et renseigner les variables locales.

## Verification

```powershell
npm run lint
npm test
npm run build
```

Le code est organise par fonctionnalite dans `src/pages`, `src/components` et `src/context`. Les medias sont regroupes dans `src/assets`. Les fichiers de `public` gardent une URL stable pour les ressources referencees par API.
