# README — Pour Claude Code

## Lis ceci EN PREMIER

Tu dois étendre une PWA vanilla existante appelée **Étapes Santé**.
La mission complète est dans `00_PROMPT_PRINCIPAL.md`.

## Ordre de lecture des fichiers

1. `00_PROMPT_PRINCIPAL.md` — Vue d'ensemble de la mission
2. `01_ARCHITECTURE_EXISTANTE.md` — Comment fonctionne le moteur actuel (**lis avant d'écrire une ligne**)
3. `02_NOUVEAUX_TYPES_MECANIQUES.md` — Spécifications des 6 nouvelles mécaniques
4. `03_CONTENU_SCREENS_e0_e7.md` — Données JSON des écrans e0 à e7
5. `04_CONTENU_SCREENS_e9_e14.md` — Données JSON des écrans e9 à e14
6. `05_DESIGN_SYSTEM.md` — Variables CSS, thèmes, composants à réutiliser
7. `06_REGLES_IMPLEMENTATION.md` — Contraintes techniques non négociables

## Résumé en 3 lignes

- **Ajouter** un module "Livret Sécurité" (15 écrans e0–e14) avec 6 nouvelles mécaniques interactives
- **Ne pas casser** le module "Parcours Prévention" existant (s01–s17)
- **Respecter** le design system vanilla (CSS variables, pas de framework)

## Fichiers à créer (nouveaux)

```
js/content-securite.js      ← données des 15 écrans
js/mechanics-securite.js    ← renderers des nouvelles mécaniques
js/screen-dragdrop.js       ← module drag & drop
js/screen-association.js    ← module association de paires
css/mechanics-new.css       ← styles des nouvelles mécaniques
css/screen-securite.css     ← styles du module sécurité
```

## Fichiers à modifier (existants)

```
index.html    ← ajouter <script> et <link> dans le bon ordre
js/main.js    ← enregistrer le nouveau module
sw.js         ← ajouter les nouveaux fichiers au cache
```
