# Contenu des Écrans — Module Sécurité (e0 → e7)

Ces données alimentent `js/content-securite.js`.
Copie-les telles quelles dans le tableau `SCREENS_SECURITE`.

---

## e0 — Bienvenue (type: `texte`)

```js
{
  id: 'e0',
  type: 'texte',
  theme: 'intro',
  points: 0,
  badge: null,
  titre: 'Bienvenue dans ton livret santé-sécurité interactif',
  texte: `Ce module fait partie de ton accueil dans la structure. Pour t'informer des règles de santé et de sécurité, sous une forme interactive.<br><br>
Tu vas y retrouver les informations essentielles sur les risques au travail (incendie, chutes, déplacements, hygiène, risques psychosociaux…) et les réflexes à adopter dès ton arrivée.<br><br>
L'objectif est que tu saches quoi faire, à qui t'adresser et comment contribuer à ta propre sécurité et à celle des autres.`,
  bouton_principal: 'Découvrir le cadre'
}
```

---

## e0b — Obligations de chacun (type: `vrai_faux_series`)

```js
{
  id: 'e0b',
  type: 'vrai_faux_series',
  theme: 'intro',
  points: 1,
  badge: null,
  titre: 'Les obligations de chacun',
  texte_introduction: 'La loi donne des responsabilités à l\'employeur… mais aussi aux agents. À toi de jouer : vrai ou faux ?',
  series: [
    {
      affirmation: 'L\'employeur doit évaluer les risques, mettre en place des mesures de prévention et informer les agents.',
      bonne_reponse: 'vrai',
      feedback: 'Oui. L\'employeur a une obligation de sécurité : évaluer les risques, mettre en œuvre la prévention, informer et former les agents.'
    },
    {
      affirmation: 'Les agents n\'ont aucune obligation, ils doivent seulement appliquer la loi si on la leur rappelle.',
      bonne_reponse: 'faux',
      feedback: 'Non. Les agents doivent aussi prendre soin de leur propre santé et de celle de leurs collègues, respecter les consignes de sécurité, utiliser correctement les équipements et signaler les situations dangereuses.'
    },
    {
      affirmation: 'Prévenir les risques, ce n\'est pas seulement respecter la loi, c\'est aussi améliorer le fonctionnement et la qualité du service.',
      bonne_reponse: 'vrai',
      feedback: 'Exact. La prévention a des enjeux humains, organisationnels et économiques : moins d\'accidents, moins de dysfonctionnements, meilleure qualité du service.'
    }
  ],
  bouton_principal: 'Voir les responsabilités'
}
```

---

## e0c — Les différentes responsabilités (type: `cartes_a_retourner`)

```js
{
  id: 'e0c',
  type: 'cartes_a_retourner',
  theme: 'intro',
  points: 0,
  badge: null,
  titre: 'Les différentes responsabilités',
  texte: 'Un même comportement peut engager différentes formes de responsabilité. Clique sur chaque carte pour en savoir plus.',
  cartes: [
    {
      titre_carte: 'Responsabilité professionnelle / disciplinaire',
      texte_verso: 'Elle concerne la relation entre l\'agent et l\'employeur. La méconnaissance des règles d\'hygiène et de sécurité peut être considérée comme une faute disciplinaire. Tout manquement à une obligation peut entraîner une sanction prévue par le règlement intérieur.'
    },
    {
      titre_carte: 'Responsabilité pénale',
      texte_verso: 'Elle concerne le respect des lois et règlements. La responsabilité pénale peut être engagée en cas de manquement aux dispositions légales ou réglementaires (mise en danger d\'autrui, non-respect de consignes de sécurité essentielles…).'
    },
    {
      titre_carte: 'Responsabilité civile',
      texte_verso: 'Chacun est responsable du dommage qu\'il cause à autrui, par son fait, sa négligence ou son imprudence. La collectivité peut aussi voir sa responsabilité engagée si un agent ne respecte pas une obligation qui lui incombe.'
    }
  ],
  bouton_principal: 'Entrer dans le parcours sécurité'
}
```

---

## e1 — Accueil parcours sécurité (type: `texte`)

```js
{
  id: 'e1',
  type: 'texte',
  theme: 'securite',
  points: 0,
  badge: null,
  titre: 'On commence par la sécurité',
  texte: `Avant de parler de stress ou d'organisation du travail, on s'assure que les bases de la sécurité sont en place : incendie, parking, escaliers, déplacements, électricité…<br><br>
Tu vas voir des petites scènes, choisir des réponses et découvrir des réflexes simples à adopter dès ton arrivée.`,
  bouton_principal: 'Commencer par l\'incendie'
}
```

---

## e2 — Quand l'alarme sonne (type: `drag_drop`)

```js
{
  id: 'e2',
  type: 'drag_drop',
  theme: 'securite',
  points: 1,
  badge: { id: 'evacuation', label: 'Je sais évacuer' },
  titre: 'En cas d\'alarme : les étapes dans l\'ordre',
  texte: 'L\'alarme incendie retentit pendant que tu es dans les locaux. Remets les étapes dans le bon ordre.',
  elements_a_ordonner: [
    'Je m\'arrête de travailler et je garde mon calme.',
    'Je me dirige vers la sortie la plus proche, sans prendre l\'ascenseur.',
    'Je rejoins le point de rassemblement prévu.',
    'Si je suis bloqué, je signale ma présence.'
  ],
  feedback_si_bon_ordre: 'C\'est l\'ordre attendu : arrêter son activité, évacuer calmement par la sortie la plus proche, ne pas utiliser l\'ascenseur, rejoindre le point de rassemblement et signaler sa présence si l\'on est bloqué.',
  feedback_si_mauvais_ordre: 'En cas d\'alarme, on ne reste pas à son poste pour terminer une tâche, on ne revient pas chercher ses affaires et on n\'utilise pas l\'ascenseur. L\'objectif est d\'évacuer rapidement et calmement vers le point de rassemblement.'
}
```

---

## e3 — Incendie : attention à l'alarme (type: `qcm`)

> Note : Le PDF nomme cet écran "ÉCRAN 3" avec id `e2` — **utiliser `e3`** pour éviter le conflit.

```js
{
  id: 'e3',
  type: 'qcm',
  theme: 'securite',
  points: 1,
  badge: null,
  titre: 'Incendie : attention à l\'alarme',
  situation: 'Tu disposes d\'un badge personnel pour accéder aux locaux. Tu aimerais arriver beaucoup plus tôt que l\'horaire habituel pour avancer sur un dossier… et l\'alarme sonne.',
  question: 'Que dois-tu retenir de cette situation ?',
  options: [
    'C\'est sûrement une fausse alerte, je coupe l\'alarme et je continue.',
    'En dehors des horaires prévus, l\'accès aux locaux peut déclencher l\'alarme : je dois respecter les plages d\'ouverture et les consignes d\'accès.',
    'Les alarmes se déclenchent souvent sans raison, ce n\'est pas très grave.'
  ],
  bonne_reponse_index: 1,  // 0-based
  feedback_correct: 'Tu as raison : le système d\'alarme sert à protéger les personnes et les locaux. Venir en dehors des horaires prévus peut déclencher l\'alarme et mobiliser l\'astreinte ou les secours. Respecter les horaires et les modalités d\'accès, c\'est déjà faire de la prévention incendie.',
  feedback_incorrect: 'Entrer en dehors des horaires autorisés en comptant sur le fait que "quelqu\'un coupera l\'alarme" n\'est pas acceptable. L\'alarme de sécurité n\'est pas un détail : elle protège les locaux et les personnes. On respecte les horaires et les consignes d\'accès, ou on demande un aménagement si nécessaire.'
}
```

---

## e4 — Mini-jeu Incendie (type: `mini_jeu`)

```js
{
  id: 'e4',
  type: 'mini_jeu',
  theme: 'securite',
  points: 1,
  badge: { id: 'feu', label: 'Je maîtrise le feu' },
  titre: 'Mini-jeu – Incendie : comprendre pour prévenir',
  texte_introduction: '3 manches rapides pour tester tes réflexes : reconstituer le triangle du feu, repérer les effets sur la santé et choisir les bons gestes de prévention.',
  seuil_reussite: 2,  // 2 manches sur 3 pour obtenir le point
  manches: [
    {
      id: 'e4_m1',
      type: 'drag_drop',
      titre_manche: 'Manche 1 — Reconstituer le triangle du feu',
      consigne: 'Glisse les bons éléments dans le triangle pour reconstituer les 3 ingrédients d\'un incendie.',
      // Pour cette manche spéciale : drag vers des zones cibles (pas un simple ordre)
      // Le moteur doit identifier les 3 bons éléments parmi 5
      elements_disponibles: [
        'Un combustible (bois, papier, mobilier, produits, matériaux…)',
        'Un comburant (oxygène de l\'air)',
        'Une source de chaleur (flamme, étincelle, installation électrique défectueuse…)',
        'Un extincteur',
        'Un plan d\'évacuation'
      ],
      elements_corrects: [
        'Un combustible (bois, papier, mobilier, produits, matériaux…)',
        'Un comburant (oxygène de l\'air)',
        'Une source de chaleur (flamme, étincelle, installation électrique défectueuse…)'
      ],
      nb_zones_cibles: 3,
      feedback_reussi: 'C\'est ça : pour qu\'un incendie se déclare, il faut un combustible, un comburant (oxygène) et une source de chaleur. Sans l\'un de ces trois éléments, la combustion ne démarre pas.',
      feedback_erreurs: 'Les extincteurs et les plans d\'évacuation servent à la protection, mais ne font pas partie des "ingrédients" de l\'incendie. Les trois éléments à placer sont : combustible, comburant, source de chaleur.'
    },
    {
      id: 'e4_m2',
      type: 'vrai_faux_series',
      titre_manche: 'Manche 2 — Effets sur la santé : vrai ou faux ?',
      consigne: 'Dis si chaque effet peut être lié à un incendie.',
      series: [
        {
          affirmation: 'Brûlures cutanées.',
          bonne_reponse: 'vrai',
          feedback: 'Oui. Les brûlures font partie des effets directs d\'un incendie sur la santé.'
        },
        {
          affirmation: 'Intoxication par les fumées et les gaz.',
          bonne_reponse: 'vrai',
          feedback: 'Oui. Les fumées et les gaz dégagés peuvent entraîner une intoxication parfois très grave.'
        },
        {
          affirmation: 'Écrasement du corps par chute d\'objets ou d\'éléments de structure.',
          bonne_reponse: 'vrai',
          feedback: 'Oui. Un incendie peut provoquer l\'effondrement de structures (toit, mur, rayonnages…) et causer des écrasements.'
        },
        {
          affirmation: 'Un simple rhume sans autre conséquence.',
          bonne_reponse: 'faux',
          feedback: 'Non. Les effets principaux mis en avant sont brûlures, intoxications, blessures graves. Le rhume n\'est pas l\'enjeu ici.'
        }
      ]
    },
    {
      id: 'e4_m3',
      type: 'qcm_multi',
      titre_manche: 'Manche 3 — Choisir les bons gestes de prévention',
      consigne: 'Coche les gestes qui vont dans le sens de la prévention des incendies.',
      options: [
        'Ne pas fumer à proximité des zones dangereuses (locaux techniques, produits chimiques, garages…).',
        'Entreposer des cartons devant un tableau électrique, "juste en attendant".',
        'Isoler les produits combustibles (stockés dans un local prévu, fermé).',
        'Signaler à ton responsable une odeur de chaud ou un équipement électrique qui fait des étincelles.',
        'Bloquer une porte coupe-feu avec une cale pour qu\'elle reste ouverte.'
      ],
      bonnes_reponses_index: [0, 2, 3],  // 0-based
      feedback_si_reussi: 'Bien vu : ne pas fumer près des zones à risque, isoler les produits combustibles et signaler toute anomalie (odeur de chaud, étincelles…) font partie des mesures de prévention recommandées.',
      feedback_si_erreurs: 'Les bons réflexes sont : ne pas fumer dans les zones dangereuses, isoler les produits combustibles et signaler les anomalies sur les circuits ou matériels électriques. Entreposer des cartons devant un tableau électrique ou bloquer une porte coupe-feu augmente au contraire le risque en cas d\'incendie.'
    }
  ],
  bouton_fin: 'Passer au parking'
}
```

---

## e5 — Mini-jeu Parking (type: `mini_jeu`)

```js
{
  id: 'e5',
  type: 'mini_jeu',
  theme: 'physique',
  points: 1,
  badge: { id: 'parking', label: 'Je me gare bien' },
  titre: 'Mini-jeu – Parking et déplacements',
  texte_introduction: '3 manches pour réfléchir à la façon de te garer, circuler sur le parking et mesurer le poids du risque routier lié au travail.',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e5_m1',
      type: 'qcm',
      titre_manche: 'Manche 1 — Où te garer ?',
      consigne: 'Sur un schéma de parking, plusieurs emplacements possibles apparaissent. Choisis celui qui respecte le mieux la sécurité.',
      // ILLUSTRATION REQUISE : schéma parking avec positions A, B, C, D
      // Voir assets/parking-schema.svg à créer ou générer via illustrations.js
      illustration_id: 'parking_schema',
      description_positions: {
        A: 'Juste devant une issue de secours.',
        B: 'À moitié sur la voie de circulation et à moitié sur une place.',
        C: 'Place matérialisée, en marche arrière, sans gêner la circulation.',
        D: 'Devant un accès pompier / borne incendie.'
      },
      question: 'Où te gares-tu ?',
      options: ['Emplacement A', 'Emplacement B', 'Emplacement C', 'Emplacement D'],
      bonne_reponse_index: 2,
      feedback_correct: 'C\'est le bon choix : une place matérialisée, en marche arrière, sans gêner la circulation ni les issues. Le stationnement inadapté peut gêner l\'évacuation, l\'accès des secours et augmenter le risque de heurt de piétons.',
      feedback_incorrect: 'Se garer devant une issue de secours, sur une voie de circulation ou devant un accès pompier crée des risques : difficulté à évacuer, gêne pour les secours, vision réduite pour les conducteurs. Même pressé, on privilégie une place matérialisée, en marche arrière, qui ne bloque pas les accès.'
    },
    {
      id: 'e5_m2',
      type: 'vrai_faux_series',
      titre_manche: 'Manche 2 — Circulation sur le parking : vrai ou faux ?',
      consigne: 'Dis si ces comportements sont adaptés sur le parking.',
      series: [
        {
          affirmation: 'Sur le parking, je roule au pas et je fais particulièrement attention aux piétons.',
          bonne_reponse: 'vrai',
          feedback: 'Oui. Le parking est une zone de cohabitation véhicules / piétons : on roule au pas et on anticipe les traversées, sorties d\'angle mort, etc.'
        },
        {
          affirmation: 'Je peux dépasser un autre véhicule sur le parking, même si la visibilité est réduite.',
          bonne_reponse: 'faux',
          feedback: 'Non. Les manœuvres brusques ou les dépassements sur un parking augmentent le risque de collision ou de heurt de personne.'
        },
        {
          affirmation: 'Je respecte les sens de circulation et les zones réservées (places PMR, zones livraisons…).',
          bonne_reponse: 'vrai',
          feedback: 'Oui. Les marquages et les zones réservées ont un rôle de sécurité (accès pour les personnes en situation de handicap, manœuvres de véhicules spécifiques, etc.).'
        }
      ]
    },
    {
      id: 'e5_m3',
      type: 'qcm',
      titre_manche: 'Manche 3 — Quiz chiffres : risque routier',
      consigne: 'À ton avis, le risque routier (trajets domicile–travail et déplacements professionnels) pèse combien dans les accidents mortels liés au travail ?',
      question: 'Part des accidents mortels liés au travail dus au risque routier :',
      options: ['Environ 10 %', 'Environ 30 %', 'Environ 50 %'],
      bonne_reponse_index: 1,
      feedback_correct: 'Exact : le risque routier représente environ 30 % des accidents mortels liés au travail, ce qui en fait la première cause de mortalité professionnelle.',
      feedback_incorrect: 'En réalité, le risque routier représente autour de 30 % des accidents mortels liés au travail, et il est considéré comme la première cause de décès au travail.'
    }
  ],
  bouton_fin: 'Passer au téléphone au volant'
}
```

---

## e6 — Mini-jeu Téléphone au volant (type: `mini_jeu`)

```js
{
  id: 'e6',
  type: 'mini_jeu',
  theme: 'physique',
  points: 1,
  badge: { id: 'telephone_volant', label: 'Je conduis sans téléphone' },
  titre: 'Mini-jeu – Téléphone au volant en visite à domicile',
  texte_introduction: 'Les déplacements pour les visites à domicile font partie du travail : c\'est le risque routier "mission". L\'usage du téléphone pendant la conduite augmente fortement le risque d\'accident.',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e6_m1',
      type: 'qcm',
      titre_manche: 'Manche 1 — En tournée de visites',
      consigne: 'Tu es en tournée de visites à domicile. Tu es en voiture entre deux adresses, ton téléphone professionnel sonne.',
      question: 'Quel est le bon réflexe ?',
      options: [
        'Je décroche en conduisant : c\'est forcément important, je verrai plus tard pour me garer.',
        'Je laisse sonner, je poursuis ma route, puis je m\'arrête dans un endroit sécurisé (parking, aire de stationnement) pour écouter le message et rappeler.',
        'Je ralentis un peu et je regarde rapidement qui appelle pour décider si je décroche ou pas.'
      ],
      bonne_reponse_index: 1,
      feedback_correct: 'C\'est le réflexe attendu : pendant la conduite, tu restes concentré sur la route. Tu laisses la messagerie prendre l\'appel et tu traites l\'information dès que tu peux t\'arrêter dans un endroit sécurisé.',
      feedback_incorrect: 'Téléphoner ou manipuler ton téléphone en conduisant détourne ton attention, même "quelques secondes", et augmente clairement le risque d\'accident.'
    },
    {
      id: 'e6_m2',
      type: 'qcm_multi',
      titre_manche: 'Manche 2 — Organisation des communications',
      consigne: 'Dans une équipe qui fait beaucoup de visites à domicile, quels sont les bons réglages / habitudes pour limiter l\'usage du téléphone en conduisant ? (plusieurs réponses possibles)',
      options: [
        'Mettre le téléphone en mode silencieux ou "mode conduite" pendant les trajets, et laisser la messagerie répondre.',
        'Autoriser les collègues à t\'appeler pendant les trajets pour "gagner du temps" sur l\'organisation.',
        'Prévoir des créneaux d\'appels avec le secrétariat en dehors des temps de conduite (avant la tournée, pause, fin de tournée).',
        'Regarder rapidement les SMS aux feux rouges pour rester réactif.',
        'Utiliser la messagerie pour informer que tu es en déplacement et que tu rappelleras.'
      ],
      bonnes_reponses_index: [0, 2, 4],
      feedback_si_reussi: 'Oui : mettre le téléphone en mode silencieux, organiser des temps de communication en dehors de la conduite et utiliser la messagerie limitent efficacement le téléphone au volant.',
      feedback_si_erreurs: 'Les bonnes pratiques : téléphone en silencieux ou "mode conduite" pendant les trajets ; communications organisées à des moments précis (avant/après la tournée, pauses) ; messagerie qui prend le relais. Encourager les appels pendant la conduite ou consulter les SMS au feu rouge va à l\'encontre de la prévention.'
    }
  ],
  bouton_fin: 'Passer aux escaliers et aux chutes'
}
```

---

## e7 — Mini-jeu Escaliers et chutes (type: `mini_jeu`)

```js
{
  id: 'e7',
  type: 'mini_jeu',
  theme: 'physique',
  points: 1,
  badge: { id: 'chutes', label: 'J\'évite les chutes' },
  titre: 'Mini-jeu – Escaliers et chutes',
  texte_introduction: 'Les chutes (de plain-pied ou dans les escaliers) représentent environ 1 accident du travail sur 5. À toi de repérer tous les éléments qui transforment un simple couloir en parcours à risque.',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e7_m1',
      type: 'qcm_multi',
      titre_manche: 'Manche 1 — Trouve les pièges',
      consigne: 'On te décrit un couloir qui mène à un escalier. Coche tout ce qui peut favoriser une chute ou un faux pas.',
      // ILLUSTRATION REQUISE : scène couloir avec escalier (voir image PDF page 7)
      illustration_id: 'couloir_risques',
      description_scene: 'Un sac posé au milieu du couloir. Une petite flaque d\'eau près de l\'entrée, non essuyée. Un câble d\'alimentation qui traverse le passage. Un tapis roulé qui dépasse sur le côté. Une pile de dossiers rangés au sol contre un mur. Un éclairage faible (une ampoule sur deux fonctionne). Les dernières marches de l\'escalier sont mal contrastées. La main courante est présente et accessible.',
      options: [
        'Le sac au milieu du couloir.',
        'La flaque d\'eau non essuyée.',
        'Le câble qui traverse le passage.',
        'Le tapis roulé qui dépasse.',
        'La pile de dossiers qui empiète sur le passage.',
        'L\'éclairage faible.',
        'Le manque de contraste des dernières marches.',
        'La main courante accessible.'
      ],
      bonnes_reponses_index: [0, 1, 2, 3, 4, 5, 6],  // 0-based — la main courante (index 7) est une aide, pas un risque
      feedback_si_reussi: 'Exact : obstacles (sac, dossiers), câbles au sol, tapis mal positionné, zones glissantes et éclairage insuffisant sont des facteurs classiques de chutes. Le manque de contraste sur les marches peut aussi gêner l\'appréciation du relief. La main courante, au contraire, est un moyen de se sécuriser.',
      feedback_si_erreurs: 'Les éléments qui augmentent le risque de chute : le sac au milieu du couloir, la pile de dossiers qui déborde, le câble qui traverse, la flaque d\'eau non essuyée, le tapis roulé, l\'éclairage insuffisant et le manque de contraste des marches. La main courante, elle, est une aide.'
    },
    {
      id: 'e7_m2',
      type: 'qcm',
      titre_manche: 'Manche 2 — Quiz chiffres : chutes au travail',
      consigne: 'Pour te situer : à ton avis, les chutes représentent quelle part des accidents du travail ?',
      question: 'Part des accidents du travail liés à des chutes (plain-pied ou hauteur) :',
      options: ['Environ 5 %', 'Environ 10 %', 'Environ 20 %'],
      bonne_reponse_index: 2,
      feedback_correct: 'Oui : les chutes représentent environ 1 accident du travail sur 5, et la majorité sont des chutes de plain-pied (glissade, faux pas, obstacle).',
      feedback_incorrect: 'En réalité, les chutes représentent environ 20 % des accidents du travail, et la majorité sont des chutes de plain-pied. Ce n\'est donc pas un "petit risque" : les réflexes dans les couloirs et escaliers sont essentiels dès l\'arrivée dans la structure.'
    }
  ],
  bouton_fin: 'Passer au bureau et à l\'écran'
}
```
