# Règles d'Implémentation — Non Négociables

## 1. Isolation des modules

Le module Sécurité (e0–e14) **ne doit pas polluer** le module Parcours Prévention (s01–s17).

```js
// content-securite.js expose :
window.SCREENS_SECURITE = [ /* e0 à e14 */ ];

// main.js gère les deux modules indépendamment
// Chaque module a son propre score (App.scoreSecurite, App.scorePrevention)
// LocalStorage : clés séparées
//   'etap_prevension_state' (existant)
//   'etap_securite_state'   (nouveau)
```

---

## 2. Enregistrement des renderers

Dans `mechanics-securite.js`, enregistrer les nouveaux types dans le registre existant :

```js
// Supposons que mechanics.js utilise un registre du type :
// App.renderers = { 'qcm': renderQcm, 'flip': renderFlip, ... }

// Dans mechanics-securite.js, APRÈS le chargement de mechanics.js :
App.renderers['texte']            = renderTexte;
App.renderers['vrai_faux_series'] = renderVraiFauxSeries;
App.renderers['cartes_a_retourner'] = renderCartesARetourner;
App.renderers['qcm_multi']        = renderQcmMulti;
App.renderers['drag_drop']        = renderDragDrop;
App.renderers['association']      = renderAssociation;
App.renderers['mini_jeu']         = renderMiniJeu;
```

**Si `App.renderers` n'existe pas** (le moteur dispatch autrement) :
→ Lire `engine.js` et adapter sans le modifier.

---

## 3. Idempotence obligatoire

**Chaque renderer doit vérifier `App.isAnswered(screen.id)` en entrée.**

Pattern standard :
```js
function renderQcmMulti(screen, container) {
  if (App.isAnswered(screen.id)) {
    renderQcmMultiResolved(screen, container);  // vue résolue
    return;
  }
  // ... rendu interactif normal
}
```

La vue résolue doit montrer :
- Options correctes cochées → fond `var(--color-correct)`
- Options incorrectes cochées → fond `var(--color-error)`
- Feedback complet visible
- Bouton "Continuer" actif

---

## 4. Drag & Drop : fallback mobile obligatoire

```js
// Détection simple
const isTouchDevice = 'ontouchstart' in window;

if (isTouchDevice) {
  // Utiliser les événements touch (touchstart, touchmove, touchend)
  // Calculer la position via touch.clientX / touch.clientY
  // Identifier la drop zone avec document.elementFromPoint()
} else {
  // API drag HTML5 standard
}
```

---

## 5. Association de paires — rendu SVG des lignes

```js
// Utiliser un <svg> overlay positionné en absolute par-dessus la grille
// Les lignes sont dessinées avec <line> SVG entre les centres des éléments liés
// Recalculer les positions au resize (window.addEventListener('resize', redrawLines))

function drawLine(fromEl, toEl, svgOverlay, isCorrect) {
  const fromRect = fromEl.getBoundingClientRect();
  const toRect   = toEl.getBoundingClientRect();
  // ... calculer x1, y1, x2, y2 relatifs au svgOverlay
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('stroke', isCorrect ? 'var(--color-correct)' : 'var(--color-error)');
  // ...
}
```

---

## 6. Score du mini-jeu

```js
// À la fin du dernier manche d'un mini-jeu :
function evaluateMiniJeu(screen, mancheResults) {
  const nbReussis = mancheResults.filter(r => r.correct).length;
  const point = nbReussis >= screen.seuil_reussite ? 1 : 0;
  
  if (!App.isAnswered(screen.id)) {
    App.addScore(point);
    if (point && screen.badge) {
      App.unlockBadge(screen.badge.id, screen.badge.label);
    }
    App.saveAnswer(screen.id, { mancheResults, point });
  }
}
```

---

## 7. Ordre de chargement dans `index.html`

```html
<!-- CSS existant (ne pas modifier l'ordre) -->
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/screens.css">
<link rel="stylesheet" href="css/screen-workstation.css">
<link rel="stylesheet" href="css/screen-hidden.css">

<!-- NOUVEAUX CSS (après les existants) -->
<link rel="stylesheet" href="css/mechanics-new.css">
<link rel="stylesheet" href="css/screen-securite.css">

<!-- JS existant (ne pas modifier l'ordre) -->
<script src="js/engine.js"></script>
<script src="js/content.js"></script>
<script src="js/illustrations.js"></script>
<script src="js/mechanics.js"></script>
<script src="js/screen-workstation.js"></script>
<script src="js/screen-hidden.js"></script>

<!-- NOUVEAUX JS (après les existants, avant main.js) -->
<script src="js/content-securite.js"></script>
<script src="js/mechanics-securite.js"></script>
<script src="js/screen-dragdrop.js"></script>
<script src="js/screen-association.js"></script>

<script src="js/main.js"></script>  <!-- toujours en dernier -->
```

---

## 8. Service Worker — mise en cache

Ajouter dans `sw.js` dans le tableau `CACHE_FILES` :
```js
'css/mechanics-new.css',
'css/screen-securite.css',
'js/content-securite.js',
'js/mechanics-securite.js',
'js/screen-dragdrop.js',
'js/screen-association.js',
// + les éventuels assets photos
'assets/maeva_dupuy.jpg',
'assets/laetitia_assezat.jpg',
'assets/nathalie_fourcart.jpg',
'assets/elisabeth_herve.jpg',
'assets/sonia_naze.jpg'
```

---

## 9. Gestion des photos (écran e13, e14)

Les photos des personnes ressources sont des fichiers réels fournis par le client.
Elles se trouvent dans `/assets/` avec les noms :
- `maeva_dupuy.jpg`
- `laetitia_assezat.jpg`
- `nathalie_fourcart.jpg`
- `elisabeth_herve.jpg`
- `sonia_naze.jpg`

**Dans le code, toujours utiliser un fallback si l'image ne charge pas :**
```js
App.el('img', {
  src: `assets/${personneId}.jpg`,
  alt: personneName,
  on: { error: (e) => { e.target.style.display = 'none'; } }
})
```

---

## 10. Checklist de validation finale

Avant de considérer la tâche terminée, vérifier :

- [ ] Les 15 écrans du module Sécurité s'affichent sans erreur console
- [ ] Le Parcours Prévention existant (s01–s17) fonctionne toujours
- [ ] Chaque nouvelle mécanique respecte l'idempotence
- [ ] Le drag & drop fonctionne sur desktop ET mobile (touch)
- [ ] L'association de paires dessine les lignes SVG correctement
- [ ] Le score du module Sécurité est indépendant du module Prévention
- [ ] Le Service Worker met en cache tous les nouveaux fichiers
- [ ] Aucun `console.error` en navigation normale
- [ ] Les thèmes de couleur s'appliquent correctement par écran
