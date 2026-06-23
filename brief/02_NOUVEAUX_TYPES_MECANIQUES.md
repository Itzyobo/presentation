# Nouvelles Mécaniques — Spécifications Complètes

Ces 6 types n'existent pas encore dans `mechanics.js`.
Tu dois les implémenter dans `js/mechanics-securite.js`.

---

## 1. `texte` — Écran informatif pur

**Usage :** Introduction d'un module, présentation sans question.

**Données attendues dans le screen :**
```js
{
  type: 'texte',
  titre: 'string',
  texte: 'string (HTML autorisé)',
  bouton_principal: 'string'  // label du bouton
}
```

**Comportement :**
- Affiche titre + texte + illustration SVG (optionnelle)
- Bouton CTA appelle `App.next()`
- `points: 0` — pas de scoring

---

## 2. `vrai_faux_series` — Série d'affirmations vrai/faux

**Usage :** Plusieurs affirmations à valider l'une après l'autre dans le même écran.

**Données attendues :**
```js
{
  type: 'vrai_faux_series',
  titre: 'string',
  texte_introduction: 'string',
  series: [
    {
      affirmation: 'string',
      bonne_reponse: 'vrai' | 'faux',
      feedback: 'string'
    }
    // ...
  ],
  bouton_principal: 'string'
}
```

**Comportement :**
- Afficher une affirmation à la fois avec 2 boutons : VRAI / FAUX
- Après chaque clic : feedback immédiat (vert si correct, rouge si incorrect)
- Passer automatiquement à l'affirmation suivante après 1,5s (ou bouton "Suivant")
- Une fois toutes les affirmations traitées : afficher bouton "Continuer" → `App.next()`
- **Score :** 1 point si TOUTES les affirmations sont correctes, 0 sinon
- Respecter l'idempotence : si `App.isAnswered(id)`, montrer toutes les réponses résolues directement

---

## 3. `cartes_a_retourner` — Flip cards multi (pas de scoring)

**Usage :** Présenter des concepts en cards retournables (recto = titre, verso = explication).

**Données attendues :**
```js
{
  type: 'cartes_a_retourner',
  titre: 'string',
  texte: 'string',
  cartes: [
    {
      titre_carte: 'string',   // face recto
      texte_verso: 'string'    // face verso (HTML autorisé)
    }
  ],
  bouton_principal: 'string'
}
```

**Comportement :**
- Grille de cards (2 colonnes sur desktop, 1 sur mobile)
- Clic sur une card → flip CSS 3D (animation `rotateY(180deg)`)
- Recto : fond `var(--accent)`, titre centré en blanc
- Verso : fond blanc, texte affiché, icône "✓" pour indiquer lu
- Bouton "Continuer" disponible dès le départ (pas de scoring, écran informatif)
- `points: 0`

---

## 4. `qcm_multi` — QCM à réponses multiples

**Usage :** Plusieurs bonnes réponses possibles parmi une liste d'options.

**Données attendues :**
```js
{
  type: 'qcm_multi',
  titre: 'string',
  situation: 'string',        // contexte (optionnel)
  consigne: 'string',         // "Coche tout ce qui..."
  options: ['string', ...],
  bonnes_reponses_index: [1, 3, 4],  // tableau d'index (1-based)
  feedback_si_reussi: 'string',
  feedback_si_erreurs: 'string',
  a_retenir: 'string'         // optionnel
}
```

**Comportement :**
- Cases à cocher (checkbox style) pour chaque option
- Bouton "Valider" (disabled tant qu'aucune option cochée)
- Après validation :
  - Options correctes cochées → fond vert
  - Options incorrectes cochées → fond rouge
  - Options correctes non cochées → surlignées en orange (manquées)
  - Options incorrectes non cochées → grisées
- Afficher `feedback_si_reussi` si toutes les bonnes réponses et seulement elles sont cochées
- Afficher `feedback_si_erreurs` sinon
- **Score :** 1 point si réponse parfaite (exactement les bonnes réponses), 0 sinon
- Bouton "Continuer" → `App.next()`

---

## 5. `drag_drop` — Ordonner des éléments par glisser-déposer

**Usage :** Remettre des étapes dans le bon ordre.

**Données attendues :**
```js
{
  type: 'drag_drop',
  titre: 'string',
  texte: 'string',
  elements_a_ordonner: ['string', ...],  // ordre correct = ordre du tableau
  feedback_si_bon_ordre: 'string',
  feedback_si_mauvais_ordre: 'string'
}
```

**Comportement :**
- Afficher les éléments dans un ordre mélangé au départ (Fisher-Yates shuffle)
- Interface drag & drop native HTML5 (`draggable="true"`, events `dragstart/dragover/drop`)
- Sur mobile : fallback touch events (`touchstart/touchmove/touchend`)
- Bouton "Valider l'ordre" → comparer avec `elements_a_ordonner`
- Si correct : feedback vert + 1 point
- Si incorrect : feedback rouge + afficher le bon ordre
- Bouton "Continuer" → `App.next()`
- **Score :** 1 point si ordre parfait

---

## 6. `association` — Relier des paires (match)

**Usage :** Associer des éléments de gauche à des éléments de droite.

**Données attendues :**
```js
{
  type: 'association',
  titre: 'string',
  texte_introduction: 'string',
  consigne: 'string',
  elements_gauche: ['string', ...],   // noms des personnes/éléments
  elements_droite: ['string', ...],   // rôles/catégories
  associations_correctes: {
    'Élément gauche 1': 'Rôle A',
    'Élément gauche 2': 'Rôle B',
    // ...
  },
  feedback_si_reussi: 'string',
  feedback_si_erreurs: 'string'
}
```

**Comportement :**
- Colonne gauche : liste d'éléments cliquables
- Colonne droite : liste de rôles cliquables
- Clic gauche puis clic droite → crée une liaison (ligne SVG ou style CSS)
- Chaque liaison peut être annulée en recliquant
- Bouton "Valider" → vérifier toutes les liaisons
- Liaisons correctes → ligne verte
- Liaisons incorrectes → ligne rouge + indication de la bonne réponse
- **Score :** 1 point si toutes les associations sont correctes

---

## Conteneur "Mini-jeu" (wrapper commun)

Les écrans de type `mini_jeu_*` sont en réalité des **screens composites** :
un screen parent + N manches (sous-écrans internes).

**Pattern à implémenter :**
```js
// Un screen mini_jeu contient un tableau de manches
{
  type: 'mini_jeu',
  id: 'e4',
  titre: 'string',
  texte_introduction: 'string',
  theme: 'securite',
  points: 1,  // 1 point total pour le mini-jeu (pas par manche)
  manches: [
    { id: 'e4_m1', type: 'drag_drop', ... },
    { id: 'e4_m2', type: 'vrai_faux_series', ... },
    { id: 'e4_m3', type: 'qcm_multi', ... }
  ],
  bouton_fin: 'string'
}
```

**Comportement du wrapper :**
- Afficher un indicateur de progression : "Manche 1/3", "Manche 2/3"…
- Chaque manche se déroule séquentiellement dans le même screen
- Le score du mini-jeu = 1 point si ≥ 2/3 manches réussies (seuil configurable)
- Bouton fin de mini-jeu → `App.next()`
