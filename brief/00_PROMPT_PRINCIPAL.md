# Mission : Étendre Étapes Santé — Livret Sécurité Interactif

## Contexte global

Tu travailles sur une PWA vanilla (HTML5 / CSS3 / JS ES6, zero framework).
Le projet s'appelle **Étapes Santé — Parcours Prévention**.
L'architecture existante est documentée dans `01_ARCHITECTURE_EXISTANTE.md`.

Tu dois **ajouter un second module** appelé **"Livret Sécurité"** (écrans e0 à e14)
en t'appuyant sur les fichiers de brief suivants :

| Fichier | Contenu |
|---|---|
| `01_ARCHITECTURE_EXISTANTE.md` | Comment fonctionne le moteur actuel |
| `02_NOUVEAUX_TYPES_MECANIQUES.md` | Les 6 nouvelles mécaniques à implémenter |
| `03_CONTENU_SCREENS_e0_e7.md` | Données complètes des écrans e0 → e7 |
| `04_CONTENU_SCREENS_e9_e14.md` | Données complètes des écrans e9 → e14 |
| `05_DESIGN_SYSTEM.md` | Thèmes couleur, tokens, règles DA à respecter |
| `06_REGLES_IMPLEMENTATION.md` | Contraintes techniques non négociables |

---

## Ce que tu dois produire

### 1. Nouveaux fichiers JS
- `js/content-securite.js` — données des 15 écrans du module Sécurité
- `js/mechanics-securite.js` — renderers pour les 6 nouvelles mécaniques
- `js/screen-dragdrop.js` — module drag & drop (réutilisable)
- `js/screen-association.js` — module association de paires

### 2. Nouveaux fichiers CSS
- `css/screen-securite.css` — styles spécifiques au module Sécurité
- `css/mechanics-new.css` — styles des nouvelles mécaniques

### 3. Modifications de fichiers existants
- `index.html` — ajouter les balises `<script>` et `<link>` pour les nouveaux modules
- `js/main.js` — enregistrer le module Sécurité au démarrage
- `sw.js` — ajouter les nouveaux fichiers au cache

### 4. Aucune modification de
- `js/engine.js` (sauf si absolument nécessaire — documenter pourquoi)
- `css/tokens.css`
- `css/base.css`
- Les fichiers du module Parcours Prévention existant

---

## Règle d'or

**Ne casse rien de l'existant.**
Les deux modules (Parcours Prévention + Livret Sécurité) doivent coexister.
Chaque module a son propre tableau de screens et son propre score.
