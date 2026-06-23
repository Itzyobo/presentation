# Design System — Règles DA à Respecter

## Principe absolu

**Ne pas modifier `tokens.css`.** Toutes les nouvelles mécaniques utilisent les variables CSS existantes.
Créer uniquement `css/screen-securite.css` et `css/mechanics-new.css` pour les ajouts.

---

## Variables CSS disponibles (extraites de `tokens.css`)

### Couleurs d'accentuation (changent avec `data-theme`)
```css
var(--accent)          /* couleur principale du thème actif */
var(--accent-light)    /* version claire */
var(--accent-dark)     /* version foncée */
```

### Couleurs sémantiques fixes
```css
var(--color-correct)   /* vert validation : #2ECC71 ou équivalent */
var(--color-error)     /* rouge erreur */
var(--color-warning)   /* orange manqué */
var(--color-neutral)   /* gris désactivé */
```

### Typographie
```css
var(--font-base)       /* police principale */
var(--font-size-sm)
var(--font-size-md)
var(--font-size-lg)
var(--font-size-xl)
```

### Espacements
```css
var(--space-xs)   /* 4px */
var(--space-sm)   /* 8px */
var(--space-md)   /* 16px */
var(--space-lg)   /* 24px */
var(--space-xl)   /* 32px */
```

### Ombres et rayons
```css
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
var(--shadow-sm)
var(--shadow-md)
```

---

## Thèmes par écran du module Sécurité

| Écran | theme | Couleur |
|---|---|---|
| e0, e0b, e0c, e1 | `intro` | Teal `#0F8676` |
| e2, e3, e4 | `securite` | Rouge `#D86A60` |
| e5, e6, e7, e9 | `physique` | Cobalt `#2E6FA0` |
| e10, e11, e12 | `rps` | Teal `#0F8676` |
| e13, e14 | `intro` | Teal `#0F8676` |

---

## Composants UI existants à réutiliser (dans `components.css`)

### Boutons
```css
.btn-primary      /* bouton d'action principal */
.btn-secondary    /* bouton secondaire */
.btn-ghost        /* bouton discret */
.btn:disabled     /* état désactivé */
```

### Feedback
```css
.feedback-block           /* bloc de retour après réponse */
.feedback-block--correct  /* feedback vert */
.feedback-block--error    /* feedback rouge */
.a-retenir               /* bloc "À retenir" */
```

### Cartes
```css
.card              /* carte standard */
.card--interactive /* carte cliquable avec hover */
```

---

## Nouvelles règles CSS à créer dans `mechanics-new.css`

### Flip card (pour `cartes_a_retourner`)
```css
.flip-card-container { perspective: 1000px; }
.flip-card {
  transition: transform 0.5s;
  transform-style: preserve-3d;
  /* recto = .flip-card__front, verso = .flip-card__back */
}
.flip-card.is-flipped { transform: rotateY(180deg); }
.flip-card__back { transform: rotateY(180deg); backface-visibility: hidden; }
```

### Checkbox QCM multi
```css
.option-checkbox {
  /* style custom pour remplacer la checkbox native */
  /* utilise var(--accent) pour l'état coché */
}
.option-checkbox--correct  { background: var(--color-correct); }
.option-checkbox--error    { background: var(--color-error); }
.option-checkbox--missed   { border: 2px solid var(--color-warning); }
```

### Drag & Drop
```css
.drag-item {
  cursor: grab;
  /* fond : var(--accent-light), border: 2px solid var(--accent) */
}
.drag-item.is-dragging { opacity: 0.5; cursor: grabbing; }
.drop-zone {
  border: 2px dashed var(--accent);
  min-height: 48px;
}
.drop-zone.drag-over { background: var(--accent-light); }
```

### Association de paires
```css
.association-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}
.assoc-item { cursor: pointer; }
.assoc-item.is-selected { border: 2px solid var(--accent); }
.assoc-line-correct  { stroke: var(--color-correct); }
.assoc-line-error    { stroke: var(--color-error); }
```

### Indicateur de manche (mini-jeu)
```css
.manche-indicator {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  margin-bottom: var(--space-md);
}
.manche-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--color-neutral);
}
.manche-dot.is-active   { background: var(--accent); }
.manche-dot.is-done     { background: var(--color-correct); }
.manche-dot.is-failed   { background: var(--color-error); }
```

---

## Illustrations SVG requises

Les illustrations suivantes doivent être ajoutées dans `js/illustrations.js`
en suivant le pattern des SVG existants (fonctions qui retournent un string SVG) :

| ID | Description | Écran |
|---|---|---|
| `parking_schema` | Schéma aérien d'un parking avec emplacements A, B, C, D annotés | e5 |
| `couloir_risques` | Couloir + escalier avec obstacles visibles | e7 |
| `bureau_abc` | 3 bureaux côte à côte avec étiquettes A, B, C | e9 |
| `triangle_feu` | Triangle SVG avec 3 zones cibles drag & drop | e4 |

**Style des illustrations :** Flat design, palette cohérente avec le thème de l'écran, traits arrondis, même style que les illustrations existantes.

---

## Comportement responsive

Règle existante à respecter :
- Desktop (> 768px) : layout 2 colonnes pour les grilles
- Mobile (≤ 768px) : layout 1 colonne, boutons full-width, touch events pour drag & drop
