# Architecture Existante — À Lire Avant Tout

## Stack technique

- Vanilla HTML5 / CSS3 / JS ES6 — **zéro framework, zéro dépendance NPM**
- PWA avec Service Worker (`sw.js`)
- LocalStorage pour la persistance

---

## Fichiers clés

```
site/
├── index.html
├── sw.js
├── css/
│   ├── tokens.css          ← variables CSS globales (NE PAS MODIFIER)
│   ├── base.css            ← layout global (NE PAS MODIFIER)
│   ├── components.css      ← boutons, toasts, badges (NE PAS MODIFIER)
│   ├── screens.css         ← mise en page des écrans (NE PAS MODIFIER)
│   ├── screen-workstation.css
│   └── screen-hidden.css
└── js/
    ├── engine.js           ← cœur applicatif (MODIFIER UNIQUEMENT SI NÉCESSAIRE)
    ├── content.js          ← données des 17 écrans du Parcours Prévention
    ├── illustrations.js    ← SVG inline générés dynamiquement
    ├── mechanics.js        ← renderers des mécaniques existantes
    ├── screen-workstation.js
    ├── screen-hidden.js
    └── main.js             ← point d'entrée
```

---

## Le moteur — `window.App`

### State
```js
App.state = {
  index: 0,        // écran courant (0-based)
  score: 0,        // score cumulé
  badges: [],      // badges débloqués
  answers: {},     // { screenId: responseData }
  visited: []      // ids des écrans vus
}
```

### Navigation
```js
App.goTo(index)     // navigue vers un écran par index
App.next()          // écran suivant
App.isAnswered(id)  // true si l'écran a déjà une réponse enregistrée
```

### Score & Badges
```js
App.addScore(points)          // ajoute des points
App.unlockBadge(badgeId)      // débloque un badge + affiche toast
App.saveAnswer(id, data)      // persiste la réponse
```

### Builder DOM
```js
App.el(tag, props, children)
// props accepte : className, id, dataset, aria, on (événements), style, text
// children : string | Element | Array
// Exemple :
App.el('button', { className: 'btn-primary', on: { click: handler } }, 'Valider')
```

---

## Mécaniques existantes (dans `mechanics.js`)

| Type | Description |
|---|---|
| `intro` | Écran de présentation, chips de catégories, bouton CTA |
| `flip` | Carte à retourner (3 faces : situation → risque → réflexe) |
| `qcm` | QCM choix unique, feedback immédiat |
| `truefalse` | Série d'affirmations vrai/faux successives |
| `thermometer` | Échelle de gravité (vert/orange/rouge) |
| `dialogue` | Bulles de dialogue suivies d'un QCM |
| `choicepath` | Scénario à bifurcation avec conséquences |
| `ordering` | Multi-sélection de bons réflexes |
| `workstation` | Drag & sélection de réglages bureau (module dédié) |
| `hidden` | Chasse aux risques cliquables sur scène (module dédié) |
| `resources` | Écran informatif liste de contacts |
| `final` | Bilan score + badges |

---

## Convention de données (`content.js`)

Chaque screen est un objet :
```js
{
  id: 'sXX',
  type: 'qcm',          // correspond à un renderer dans mechanics.js
  theme: 'rps',         // appliqué en data-theme sur le conteneur
  points: 1,
  badge: { id: 'monbadge', label: 'Mon badge' }, // ou null
  // ... données spécifiques au type
}
```

### Thèmes disponibles
| Valeur | Couleur | Usage |
|---|---|---|
| `intro` | Teal `#0F8676` | Intro, ressources |
| `rps` | Teal `#0F8676` | Risques psychosociaux |
| `physique` | Cobalt `#2E6FA0` | Risques physiques |
| `securite` | Rouge `#D86A60` | Sécurité |
| `sante` | Vert `#57B36F` | Santé/hygiène |
| `final` | Teal | Bilan final |

---

## Pattern idempotence (OBLIGATOIRE à respecter)

Si `App.isAnswered(screenId)` est `true` quand l'écran se charge :
1. Afficher l'état résolu (bonnes réponses en vert, mauvaises grisées)
2. Montrer le feedback immédiatement
3. Ne pas re-créditer de points ni re-déclencher de badge
4. Afficher directement le bouton "Continuer"
