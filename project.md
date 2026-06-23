# Étapes Santé — Parcours Prévention

Ce document présente une vue d'ensemble complète du projet **Étapes Santé — Parcours Prévention**, son architecture technique, son système de design, son fonctionnement interactif, ainsi que l'intégralité des questions, réponses et explications des 17 étapes qui composent l'application.

---

## Table des Matières
1. [Présentation du Projet](#1-présentation-du-projet)
2. [Architecture Technique](#2-architecture-technique)
3. [Structure des Fichiers](#3-structure-des-fichiers)
4. [Fonctionnement du Moteur (Engine)](#4-fonctionnement-du-moteur-engine)
5. [Guide Complet des Étapes (Questions & Réponses)](#5-guide-complet-des-étapes-questions--réponses)
   - [Étape 1 : Bienvenue (Intro)](#étape-1--bienvenue-intro)
   - [Étape 2 : Prendre ses repères (Flip Card)](#étape-2--prendre-ses-repères-flip-card)
   - [Étape 3 : Le travail devient flou (QCM)](#étape-3--le-travail-devient-flou-qcm)
   - [Étape 4 : Demander de l'aide (Vrai/Faux)](#étape-4--demander-de-laide-vraifaux)
   - [Étape 5 : Les relations internes (Thermomètre)](#étape-5--les-relations-internes-thermomètre)
   - [Étape 6 : Le management participatif (Dialogue / QCM)](#étape-6--le-management-participatif-dialogue--qcm)
   - [Étape 7 : La clarté des rôles (QCM)](#étape-7--la-clarté-des-rôles-qcm)
   - [Étape 8 : Les procédures (Chemins / Choix)](#étape-8--les-procédures-chemins--choix)
   - [Étape 9 : La montée en compétence (QCM)](#étape-9--la-montée-en-compétence-qcm)
   - [Étape 10 : Le poste de travail et l'écran (Réglages Bureau)](#étape-10--le-poste-de-travail-et-lécran-réglages-bureau)
   - [Étape 11 : Les chutes et les circulations (Chasse aux risques)](#étape-11--les-chutes-et-les-circulations-chasse-aux-risques)
   - [Étape 12 : Lumière, bruit et température (Vrai/Faux)](#étape-12--lumière-bruit-et-température-vraifaux)
   - [Étape 13 : Déplacements et route (Chemins / Choix)](#étape-13--déplacements-et-route-chemins--choix)
   - [Étape 14 : Sécurité électrique et incendie (QCM)](#étape-14--sécurité-électrique-et-incendie-qcm)
   - [Étape 15 : Hygiène et santé (Sélection de réflexes)](#étape-15--hygiène-et-santé-sélection-de-réflexes)
   - [Étape 16 : Les interlocuteurs ressources (Ressources)](#étape-16--les-interlocuteurs-ressources-ressources)
   - [Étape 17 : Ton parcours prévention (Bilan / Score final)](#étape-17--ton-parcours-prévention-bilan--score-final)

---

## 1. Présentation du Projet

**Étapes Santé — Parcours Prévention** est une application web progressive (PWA) de sensibilisation à la prévention des risques professionnels. Conçue sous forme de parcours d'apprentissage interactif (gamification), elle a pour but d'aider les collaborateurs à :
- **Repérer** les situations de risques au quotidien.
- **Parler** au bon moment et aux bons interlocuteurs.
- **Agir tôt** en adoptant le réflexe le plus sûr.

Le parcours aborde quatre grands domaines de prévention :
1. **Risques Psychosociaux (RPS)** : charge mentale, clarté des rôles, gestion des priorités et du changement.
2. **Risques Physiques** : ergonomie sur écran, prévention des chutes, nuisances environnementales, risque routier.
3. **Sécurité** : sécurité électrique, incendie, signalement des anomalies.
4. **Santé & Hygiène** : gestes barrières, propreté du poste, prévention sanitaire.

---

## 2. Architecture Technique

Le projet repose sur une approche **Vanilla (sans framework externe)**, garantissant des performances maximales et une légèreté absolue :
*   **HTML5** : Structure sémantique du shell applicatif et de la navigation.
*   **CSS3 (Design System & CSS Variables)** : Organisation modulaire en couches (`tokens`, `base`, `components`, `screens`).
*   **Vanilla JS (ES5/ES6 classique)** : Moteur autonome gérant l'état, la navigation, le score, les badges et la persistance.
*   **LocalStorage** : Sauvegarde automatique de la progression, du score et des badges débloqués pour permettre aux utilisateurs de reprendre là où ils s'étaient arrêtés.
*   **PWA & Service Worker (`sw.js`)** : Mise en cache des ressources critiques pour un fonctionnement 100% hors-ligne.

### Thèmes de couleur et variables CSS
L'application applique dynamiquement des thèmes basés sur les catégories d'étapes en modifiant l'attribut `data-theme` de l'écran, ce qui met à jour les variables CSS d'accentuation :
*   `rps` / `intro` / `final` : Teinte **Teal / Émeraude** (`#0F8676`)
*   `physique` : Teinte **Bleu Cobalt** (`#2E6FA0`)
*   `securite` : Teinte **Rouge Alerte** (`#D86A60`)
*   `sante` : Teinte **Vert Feuille** (`#57B36F`)

---

## 3. Structure des Fichiers

```text
site/
├── index.html                  # Structure principale de l'application (Shell HTML)
├── manifest.webmanifest         # Configuration PWA pour l'installation sur mobile/bureau
├── sw.js                       # Service Worker pour le support du mode hors-ligne
├── logo.png                    # Logo principal
├── assets/                     # Icônes et éléments visuels
│   ├── favicon.svg             # Favicon vectoriel
│   └── logo.png                # Icône de l'application
├── css/                        # Feuilles de style modulaires
│   ├── tokens.css              # Variables de design (couleurs, ombres, typographies, easings)
│   ├── base.css                # Styles globaux, structure du conteneur principal, header, footer
│   ├── components.css          # Composants UI (boutons, tiroir de badges, toasts, feedbacks)
│   ├── screens.css             # Mise en page des écrans et des questions
│   ├── screen-workstation.css  # Styles spécifiques pour le drag & drop (Phase 2)
│   └── screen-hidden.css       # Styles spécifiques pour la chasse aux risques (Phase 2)
└── js/                         # Logique JavaScript
    ├── engine.js               # Cœur applicatif (State, Navigation, Score, Badges, DOM Builder)
    ├── content.js              # Définition des données et contenus des 17 étapes
    ├── illustrations.js        # Génération d'illustrations vectorielles SVG inline
    ├── mechanics.js            # Usines de rendu interactif pour chaque type de question
    ├── screen-workstation.js   # Module d'extension pour l'étape 10 (Interactive)
    ├── screen-hidden.js        # Module d'extension pour l'étape 11 (Interactive)
    └── main.js                 # Point d'entrée, initialisation du moteur et enregistrement du SW
```

---

## 4. Fonctionnement du Moteur (Engine)

La logique applicative se structure autour de `window.App` :

### A. Gestion de l'état (`App.state`)
L'état conserve les informations suivantes :
- `index` : L'étape courante (0 à 16).
- `score` : Le score actuel (maximum possible de **14 points**).
- `badges` : Un tableau des badges débloqués par l'utilisateur.
- `answers` : Un objet stockant les réponses enregistrées par écran.
- `visited` : Un tableau des identifiants des écrans visités.

### B. Idempotence & Révisites
Le moteur respecte strictement la règle de l'**idempotence**. Si un utilisateur revient sur une étape déjà complétée (`App.isAnswered(screenId)` est vrai), le comportement s'adapte :
1. L'état résolu est affiché (les bonnes réponses sont surlignées en vert, les mauvaises sont grisées ou masquées).
2. Le feedback correct et le bloc "À retenir" sont immédiatement visibles.
3. Aucun point supplémentaire n'est crédité.
4. Aucun toast de badge n'est ré-affiché si le badge est déjà possédé.
5. L'utilisateur peut avancer librement avec le bouton "Continuer".

### C. Le Mini-Builder DOM (`App.el`)
Pour éviter le recours à des frameworks, l'application génère ses éléments dynamiquement à l'aide d'une fonction d'aide performante :
`App.el(tag, props, children)`
Cette fonction génère un élément HTML, lui affecte des classes, des attributs ARIA, des écouteurs d'événements, applique des styles en ligne, et y injecte des enfants ou du texte de manière récursive.

---

## 5. Guide Complet des Étapes (Questions & Réponses)

Voici la liste exhaustive des 17 étapes définies dans `js/content.js`. 
Chaque écran interactif (S2 à S15) permet de remporter **1 point** (score max global de **14**).

---

### Étape 1 : Bienvenue (Intro)
*   **ID** : `s01`
*   **Type** : `intro` (Écran de présentation)
*   **Thème** : `intro` (Teal)
*   **Points** : 0 (Pas de point)
*   **Badge** : Aucun
*   **Situation/Présentation** : 
    "Tu vas découvrir plusieurs situations du quotidien professionnel. À chaque étape, repère ce qui peut compliquer le travail, choisis le bon réflexe et retiens des repères simples pour préserver la santé, la sécurité et la qualité du travail. Ici, la prévention concerne à la fois les risques psychosociaux, les risques physiques, les risques sanitaires et les consignes de sécurité."
*   **Mots-clés (Chips)** : RPS, Risques physiques, Santé & hygiène, Sécurité
*   **Bouton d'action** : "Commencer"

---

### Étape 2 : Prendre ses repères (Flip Card)
*   **ID** : `s02`
*   **Type** : `flip` (Carte à retourner)
*   **Thème** : `rps` (Risques Psychosociaux)
*   **Points** : 1
*   **Badge Débloqué** : **"Je prends mes repères"** (ID: `repere`)
*   **Contenu de la carte (Faces successives)** :
    1.  **La situation** : "Tu arrives sur une nouvelle mission et tu dois comprendre rapidement comment fonctionne l'organisation."
    2.  **Le risque** : "Devoir avancer sans repères clairs."
    3.  **Le bon réflexe** : "Demander les consignes, les priorités, les contacts utiles et les points de vigilance liés au poste."
*   **Feedback de validation** : "Un bon démarrage aide à travailler plus sereinement. Plus les repères sont clairs au départ, plus il est facile de s'intégrer et d'éviter les erreurs inutiles."

---

### Étape 3 : Le travail devient flou (QCM)
*   **ID** : `s03`
*   **Type** : `qcm` (Choix unique)
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : Aucun
*   **Situation** : "Plusieurs demandes arrivent en même temps, mais personne ne te dit clairement ce qui est prioritaire."
*   **Question** : "Que fais-tu ?"
*   **Options de réponse** :
    *   [ ] **A** : "Je fais tout en même temps."
    *   [x] **B** : "Je demande ce qui est prioritaire." *(Option correcte)*
    *   [ ] **C** : "Je fais comme je pense sans en parler."
*   **Feedback si correct** : "Quand le travail devient flou, il faut clarifier rapidement. Le flou augmente la charge mentale, fatigue inutilement et rend les erreurs plus probables."
*   **À retenir** : "Tu n’as pas à deviner."

---

### Étape 4 : Demander de l'aide (Vrai/Faux)
*   **ID** : `s04`
*   **Type** : `truefalse` (Affirmations successives)
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"Je clarifie tôt"** (ID: `clarifie`)
*   **Affirmations & Réponses** :
    1.  "Demander une précision, c'est perdre du temps."
        *   Réponse attendue : **FAUX**
        *   Explication : "Demander une précision permet souvent de gagner du temps, de limiter les erreurs et de réduire la pression inutile."
    2.  "Demander un appui est un signe de faiblesse."
        *   Réponse attendue : **FAUX**
        *   Explication : "Demander un appui est un réflexe professionnel normal, surtout lorsqu'un outil, une tâche ou une consigne ne sont pas encore maîtrisés."

---

### Étape 5 : Les relations internes (Thermomètre)
*   **ID** : `s05`
*   **Type** : `thermometer` (Échelle de gravité)
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"Je repère les signaux"** (ID: `signaux`)
*   **Situation** : "L'ambiance devient tendue, les échanges sont plus difficiles et certains malentendus reviennent souvent."
*   **Question** : "À quel niveau places-tu cette situation ?"
*   **Niveaux proposés** :
    *   [ ] **Vert** (Stable)
    *   [x] **Orange** (Vigilance) *(Réponse correcte)*
    *   [x] **Rouge** (Alerte) *(Réponse correcte)*
*   **Feedback** : "Les tensions relationnelles doivent être repérées tôt. Quand elles durent, elles alourdissent le travail, fatiguent les équipes et peuvent détériorer la coopération."
*   **À retenir** : "Parler tôt évite souvent que la situation ne s'installe."

---

### Étape 6 : Le management participatif (Dialogue / QCM)
*   **ID** : `s06`
*   **Type** : `dialogue` (Conversation suivie d'un QCM)
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"Je comprends le changement"** (ID: `changement`)
*   **Mise en situation** : "Une nouvelle organisation est annoncée, mais elle n'est pas expliquée clairement."
*   **Dialogue simulé** :
    *   *Toi* : "Je ne comprends pas bien pourquoi on change cette façon de faire."
    *   *Un collègue* : "Ce n'est pas grave, on verra plus tard."
*   **Question** : "Quelle est la meilleure réaction ?"
*   **Options de réponse** :
    *   [ ] **A** : "Ne rien demander."
    *   [x] **B** : "Chercher à comprendre le sens du changement." *(Option correcte)*
    *   [ ] **C** : "Faire semblant d'avoir compris."
*   **Feedback** : "Un changement se vit mieux quand il est expliqué, préparé et accompagné. Comprendre son sens aide à réduire l'incertitude et la fatigue mentale."

---

### Étape 7 : La clarté des rôles (QCM)
*   **ID** : `s07`
*   **Type** : `qcm`
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"Je sais qui fait quoi"** (ID: `qui`)
*   **Situation** : "Deux personnes pensent devoir faire la même chose, tandis qu'une autre tâche n'est prise en charge par personne."
*   **Question** : "Quel risque cette situation crée-t-elle ?"
*   **Options de réponse** :
    *   [ ] **A** : "Une meilleure organisation."
    *   [x] **B** : "Des doublons, des oublis et des tensions." *(Option correcte)*
    *   [ ] **C** : "Une simplification du travail."
*   **Feedback** : "Quand les rôles ne sont pas clairs, l'activité devient plus confuse. Chacun doit savoir ce qu'il fait, ce qu'il ne fait pas et à qui s'adresser."
*   **À retenir** : "Savoir qui fait quoi sécurise le collectif."

---

### Étape 8 : Les procédures (Chemins / Choix)
*   **ID** : `s08`
*   **Type** : `choicepath` (Sélection de scénario avec conséquences)
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"Je sécurise ma pratique"** (ID: `securise`)
*   **Situation** : "Tu cherches une procédure, mais tu ne sais pas où la trouver ni si elle est à jour."
*   **Choix possibles & Conséquences** :
    1.  **Option** : "Je me débrouille sans support."
        *   *Statut* : Mauvais réflexe
        *   *Conséquence* : "Je risque de perdre du temps ou de travailler avec une mauvaise information."
    2.  **Option** : "Je cherche la bonne version et je demande où la trouver."
        *   *Statut* : **Bon réflexe (Correct)**
        *   *Conséquence* : "Je sécurise ma pratique et je limite les erreurs."
*   **Feedback** : "Des procédures accessibles et actualisées permettent de gagner du temps et de travailler de manière plus fiable."

---

### Étape 9 : La montée en compétence (QCM)
*   **ID** : `s09`
*   **Type** : `qcm`
*   **Thème** : `rps`
*   **Points** : 1
*   **Badge Débloqué** : **"J'apprends sans rester seul"** (ID: `apprends`)
*   **Situation** : "Tu dois utiliser un outil métier que tu maîtrises encore mal."
*   **Question** : "Quel est le meilleur réflexe ?"
*   **Options de réponse** :
    *   [ ] **A** : "Faire semblant de savoir."
    *   [x] **B** : "Demander un appui ou une formation." *(Option correcte)*
    *   [ ] **C** : "Éviter l'outil autant que possible."
*   **Feedback** : "On travaille plus sereinement quand on se sent accompagné. Demander une aide ou une formation permet de progresser sans rester seul face à la difficulté."
*   **À retenir** : "Demander de l'aide fait partie du travail."

---

### Étape 10 : Le poste de travail et l'écran (Réglages Bureau)
*   **ID** : `s10`
*   **Type** : `workstation` (Sélection de réglages optimaux)
*   **Thème** : `physique` (Risques physiques)
*   **Points** : 1
*   **Badge Débloqué** : **"Mon poste est ajusté"** (ID: `poste`)
*   **Instruction** : "Règle le poste idéal : sélectionne les bons réglages pour l'écran, le clavier, les objets fréquents et l'assise."
*   **Éléments à sélectionner (Corrects)** :
    *   [x] "Écran face à soi, haut à hauteur des yeux"
    *   [x] "Clavier proche, poignets droits"
    *   [x] "Objets fréquents à portée de main"
    *   [x] "Assise réglée, dos soutenu, pieds à plat"
    *   [x] "Lumière sans reflet sur l'écran"
    *   [x] "Alterner les tâches pour reposer les yeux"
*   **Éléments à ignorer (Distracteurs / Faux)** :
    *   [ ] "Écran loin et de côté"
    *   [ ] "Objets utiles hors de portée"
    *   [ ] "Rester 4h sans bouger"
*   **Feedback** : "Un poste bien réglé limite les tensions physiques, la fatigue visuelle et la baisse d'attention. Le livret de sécurité rappelle aussi l'importance d'un bon positionnement devant l'écran."
*   **À retenir** : "Un poste mal adapté fatigue plus vite."

---

### Étape 11 : Les chutes et les circulations (Chasse aux risques)
*   **ID** : `s11`
*   **Type** : `hidden` (Chasse aux risques interactifs)
*   **Thème** : `physique`
*   **Points** : 1
*   **Badge Débloqué** : **"J'ai l'œil sécurité"** (ID: `oeil`)
*   **Instruction** : "Repère les éléments à risque parmi ces éléments de la scène."
*   **Dangers à repérer (Sélections correctes)** :
    *   [x] "Une marche mal visible" (ID: `marche`)
    *   [x] "Une rallonge qui traîne" (ID: `rallonge`)
    *   [x] "Un passage encombré" (ID: `passage`)
    *   [x] "Un obstacle au sol" (ID: `obstacle`)
    *   [x] "Un rangement dangereux" (ID: `rangement`)
*   **Éléments sûrs à ignorer (Distracteurs)** :
    *   [ ] "Une plante bien rangée" (ID: `plante`)
    *   [ ] "Une affiche de consignes" (ID: `affiche`)
    *   [ ] "Un extincteur accessible" (ID: `extincteur`)
*   **Feedback** : "Les chutes de plain-pied ou de hauteur peuvent souvent être évitées grâce à un rangement correct, à des circulations dégagées et à une meilleure visibilité des zones à risque."
*   **À retenir** : "Un passage dégagé évite beaucoup d'accidents."

---

### Étape 12 : Lumière, bruit et température (Vrai/Faux)
*   **ID** : `s12`
*   **Type** : `truefalse` (Affirmation unique)
*   **Thème** : `physique`
*   **Points** : 1
*   **Badge Débloqué** : Aucun
*   **Affirmation & Réponse** :
    1.  "Un espace trop sombre, trop bruyant ou trop chaud n'a pas vraiment d'effet sur le travail."
        *   Réponse attendue : **FAUX**
        *   Explication : "L'ambiance lumineuse, la température et le bruit influencent directement la fatigue, la concentration et le confort de travail."
*   **À retenir** : "L'environnement compte autant que la tâche."

---

### Étape 13 : Déplacements et route (Chemins / Choix)
*   **ID** : `s13`
*   **Type** : `choicepath` (Sélection de scénario avec conséquences)
*   **Thème** : `physique`
*   **Points** : 1
*   **Badge Débloqué** : **"Je roule prudemment"** (ID: `route`)
*   **Situation** : "Tu dois te déplacer pour ta mission alors que la météo est dégradée."
*   **Choix possibles & Conséquences** :
    1.  **Option** : "Je pars sans vérifier."
        *   *Statut* : Mauvais réflexe
        *   *Conséquence* : "Je m'expose à un risque routier accru."
    2.  **Option** : "Je vérifie le véhicule, les consignes et les conditions météo."
        *   *Statut* : **Bon réflexe (Correct)**
        *   *Conséquence* : "J'adapte mon déplacement et je réduis le risque."
    3.  **Option** : "Je prends le risque pour gagner du temps."
        *   *Statut* : Mauvais réflexe
        *   *Conséquence* : "Gagner quelques minutes ne vaut pas un accident."
*   **Feedback** : "Le risque routier et les trajets en conditions difficiles doivent être pris au sérieux. Vérifier les conditions et adapter son déplacement est un bon réflexe de prévention."

---

### Étape 14 : Sécurité électrique et incendie (QCM)
*   **ID** : `s14`
*   **Type** : `qcm`
*   **Thème** : `securite` (Sécurité)
*   **Points** : 1
*   **Badge Débloqué** : **"Je signale à temps"** (ID: `signale`)
*   **Situation** : "Tu repères une rallonge abîmée, un comportement dangereux ou une anomalie dans un espace de circulation."
*   **Question** : "Que fais-tu ?"
*   **Options de réponse** :
    *   [ ] **A** : "Je continue comme si de rien n'était."
    *   [x] **B** : "Je signale immédiatement le problème." *(Option correcte)*
    *   [ ] **C** : "J'attends que quelqu'un d'autre s'en occupe."
*   **Feedback** : "Signaler une anomalie rapidement permet d'éviter l'accident. Les consignes d'évacuation, la vigilance électrique et le respect des zones de circulation font partie des repères de base en sécurité."
*   **À retenir** : "Signaler tôt, c'est déjà prévenir."

---

### Étape 15 : Hygiène et santé (Sélection de réflexes)
*   **ID** : `s15`
*   **Type** : `ordering` (Multi-sélection de bons réflexes)
*   **Thème** : `sante` (Santé & hygiène)
*   **Points** : 1
*   **Badge Débloqué** : **"Je protège ma santé"** (ID: `protege`)
*   **Instruction** : "Sélectionne les bons réflexes à adopter au quotidien."
*   **Réflexes sains à sélectionner (Corrects)** :
    *   [x] "Se laver les mains"
    *   [x] "Garder le poste propre"
    *   [x] "Utiliser les zones de pause prévues"
    *   [x] "Signaler une anomalie"
    *   [x] "Respecter les consignes sanitaires"
    *   [x] "Garder les voies de circulation dégagées"
*   **Mauvais réflexes à ignorer (Distracteurs / Faux)** :
    *   [ ] "Laisser traîner le matériel"
    *   [ ] "Ignorer une petite anomalie"
*   **Feedback** : "Les gestes simples d'hygiène, d'ordre et de propreté participent directement à la prévention des risques sanitaires et à la sécurité de tous."

---

### Étape 16 : Les interlocuteurs ressources (Ressources)
*   **ID** : `s16`
*   **Type** : `resources` (Écran informatif des contacts ressources)
*   **Thème** : `intro`
*   **Points** : 0
*   **Badge** : Aucun
*   **Description** : "En cas de doute, de difficulté ou de situation à risque, tu peux te tourner vers :"
*   **Liste des ressources présentées** :
    1.  **Ton responsable hiérarchique** (Icône : `users`)
    2.  **Les sauveteurs secouristes du travail (SST)** (Icône : `shield`)
    3.  **Le correspondant sécurité du site** (Icône : `shield`)
    4.  **Le service de santé au travail** (Icône : `leaf`)
    5.  **L'infirmière** (Icône : `hand`)
    6.  **Les membres du CSE / CSSCT** (Icône : `users`)
*   **À retenir** : "Tu n'as pas à gérer seul une situation à risque."

---

### Étape 17 : Ton parcours prévention (Bilan / Score final)
*   **ID** : `s17`
*   **Type** : `final` (Écran de récapitulation final)
*   **Thème** : `final`
*   **Points** : 0
*   **Badge** : Aucun
*   **Tiers d'évaluation du score (sur 14 points)** :
    *   **0 à 3 points** : "Tu as commencé à repérer l'essentiel."
    *   **4 à 7 points** : "Bon niveau de vigilance."
    *   **8 à 12 points** : "Très bon réflexe de prévention."
    *   **13 points et plus** : "Réflexes prévention bien installés."
*   **Message de synthèse** : "Repérer, parler, agir tôt : c'est le meilleur réflexe pour prévenir les risques psychosociaux, les risques physiques et les risques sanitaires. Un travail clair, des échanges réguliers, des moyens adaptés et des espaces sûrs permettent de mieux avancer ensemble."
*   **Boutons d'action** :
    *   **"Continuer au Livret sécurité"** *(Bouton principal mis en évidence)* : Permet de poursuivre le parcours en enchaînant sur le deuxième module ("Livret Sécurité") à l'étape e0.
    *   **"Revoir les étapes"** *(Bouton secondaire)* : Permet de relancer le premier parcours pour consulter les explications.
    *   **"Tout recommencer"** : Réinitialise la progression, le score et les badges.

---

## 6. Guide Complet du Livret Sécurité (Questions & Réponses)

Le module **Livret Sécurité** prolonge le parcours préventif avec 15 étapes dédiées à la sécurité opérationnelle, aux risques physiques (chutes, routier, etc.) et aux risques psychosociaux (violences externes, harcèlement).

### Étape e0 : Bienvenue dans ton livret (Intro)
*   **Thème** : `intro`
*   **Situation** : Présentation du module de sécurité.
*   **Points** : 0 | **Badge** : Aucun

### Étape e0b : Les obligations de chacun (Vrai/Faux)
*   **Thème** : `intro`
*   **Situation** : La loi donne des responsabilités à l'employeur mais aussi aux agents.
*   **Points** : 1 | **Badge Débloqué** : **"Je connais le cadre"** (ID: `obligations`)

### Étape e0c : Les différentes responsabilités (Cartes à retourner)
*   **Thème** : `intro`
*   **Situation** : Explications sur les responsabilités (professionnelle, pénale, civile).
*   **Points** : 0 | **Badge** : Aucun

### Étape e1 : On commence par la sécurité (Intro)
*   **Thème** : `securite`
*   **Points** : 0 | **Badge** : Aucun

### Étape e2 : En cas d'alarme : les étapes dans l'ordre (Drag & Drop)
*   **Thème** : `securite`
*   **Situation** : L'alarme incendie retentit. Remets les étapes d'évacuation dans l'ordre.
*   **Points** : 1 | **Badge Débloqué** : **"Je sais évacuer"** (ID: `evacuation`)

### Étape e3 : Incendie : attention à l'alarme (QCM)
*   **Thème** : `securite`
*   **Situation** : Tu arrives plus tôt que prévu et l'alarme sonne.
*   **Réponse correcte** : "En dehors des horaires prévus, l'accès aux locaux peut déclencher l'alarme : je dois respecter les plages d'ouverture..."
*   **Points** : 1 | **Badge Débloqué** : **"Je respecte l'alarme"** (ID: `alarme`)

### Étape e4 : Mini-jeu – Incendie : comprendre pour prévenir
*   **Thème** : `securite`
*   **Situation** : 3 manches rapides pour tester tes réflexes sur le triangle du feu, les effets sur la santé et les gestes de prévention.
*   **Points** : 1 | **Badge Débloqué** : **"Je maîtrise le feu"** (ID: `feu`)

### Étape e5 : Mini-jeu – Parking et déplacements
*   **Thème** : `physique`
*   **Situation** : 3 manches pour réfléchir à la façon de te garer, circuler sur le parking et mesurer le poids du risque routier.
*   **Points** : 1 | **Badge Débloqué** : **"Je me gare bien"** (ID: `parking`)

### Étape e6 : Mini-jeu – Téléphone au volant en visite à domicile
*   **Thème** : `physique`
*   **Situation** : En tournée de visites, gestion du téléphone au volant.
*   **Points** : 1 | **Badge Débloqué** : **"Je conduis sans téléphone"** (ID: `telephone_volant`)

### Étape e7 : Mini-jeu – Escaliers et chutes
*   **Thème** : `physique`
*   **Situation** : Les chutes représentent environ 1 accident du travail sur 5. Trouve les pièges dans un couloir.
*   **Points** : 1 | **Badge Débloqué** : **"J'évite les chutes"** (ID: `chutes`)

### Étape e9 : Mini-jeu – Ton bureau : avant / après
*   **Thème** : `physique`
*   **Situation** : Choix du poste de travail idéal pour le dos et la nuque.
*   **Points** : 1 | **Badge Débloqué** : **"Mon bureau est bien réglé"** (ID: `bureau_ok`)

### Étape e10 : Mini-jeu – Agressivité et violences externes
*   **Thème** : `rps`
*   **Situation** : Réaction face à un usager agressif.
*   **Points** : 1 | **Badge Débloqué** : **"Je réagis aux violences externes"** (ID: `violences_ext`)

### Étape e11 : Harcèlement moral : repérer et réagir
*   **Thème** : `rps`
*   **Situation** : Reconnaître le harcèlement moral (dénigrement, isolement, etc.).
*   **Points** : 1 | **Badge Débloqué** : **"Je repère le harcèlement"** (ID: `harcelement`)

### Étape e12 : Mini-jeu – Quand l'organisation du travail pèse
*   **Thème** : `rps`
*   **Situation** : Facteurs de stress liés à l'organisation (priorités instables, charge de travail).
*   **Points** : 1 | **Badge Débloqué** : **"Je comprends les RPS"** (ID: `rps_orga`)

### Étape e13 : Mini-jeu – Qui fait quoi ? (Association)
*   **Thème** : `intro`
*   **Situation** : Associer chaque personne ressource (SST, référent handicap, SDCP) à son rôle.
*   **Points** : 1 | **Badge Débloqué** : **"Je sais qui contacter"** (ID: `qui_fait_quoi`)

### Étape e14 : À qui je peux en parler ? (Ressources)
*   **Thème** : `intro`
*   **Situation** : Récapitulatif des interlocuteurs de prévention.
*   **Points** : 0 | **Badge** : Aucun

