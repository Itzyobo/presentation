# Contenu des Écrans — Module Sécurité (e9 → e14)

---

## e9 — Mini-jeu Poste de travail (type: `mini_jeu`)

```js
{
  id: 'e9',
  type: 'mini_jeu',
  theme: 'physique',
  points: 1,
  badge: { id: 'bureau_ok', label: 'Mon bureau est bien réglé' },
  titre: 'Mini-jeu – Ton bureau : avant / après',
  texte_introduction: 'Le travail sur écran peut provoquer fatigue visuelle et douleurs (nuque, épaules, dos). Quelques réglages simples peuvent déjà changer beaucoup.',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e9_m1',
      type: 'qcm',
      titre_manche: 'Manche 1 — Quel poste tu choisis ?',
      consigne: 'On te montre 3 bureaux (A, B, C). Choisis celui où tu préfèrerais t\'installer, en pensant au confort de ton dos et de ta nuque.',
      // ILLUSTRATION REQUISE : 3 bureaux côte à côte (voir image PDF)
      illustration_id: 'bureau_abc',
      description_options: {
        A: 'Écran très bas, presque au niveau du clavier ; chaise trop basse ; tu es obligé de pencher beaucoup la tête vers l\'avant.',
        B: 'Écran à hauteur des yeux, à une distance d\'environ une longueur de bras ; chaise réglée pour avoir les pieds à plat ; clavier proche de toi.',
        C: 'Écran sur le côté (tu dois tourner la tête en permanence) ; téléphone coincé entre l\'oreille et l\'épaule ; beaucoup de documents au sol.'
      },
      question: 'Quel bureau est le plus protecteur pour ta nuque et ton dos ?',
      options: ['Bureau A', 'Bureau B', 'Bureau C'],
      bonne_reponse_index: 1,
      feedback_correct: 'Oui : un écran à peu près à hauteur des yeux, à distance raisonnable, des pieds en appui et le clavier proche limitent la posture "tête penchée" ("tech neck") et les tensions sur le dos et les épaules.',
      feedback_incorrect: 'Le bureau le plus protecteur est le B : écran à hauteur des yeux, à une longueur de bras, chaise réglée pour avoir les pieds en appui, clavier proche. Les bureaux A et C obligent à pencher beaucoup la tête ou à la garder tournée longtemps, ce qui favorise les douleurs de nuque et de dos.'
    },
    {
      id: 'e9_m2',
      type: 'qcm_multi',
      titre_manche: 'Manche 2 — Trouve ce qui coince',
      consigne: 'On te décrit une journée type au bureau. Coche ce qui te paraît à risque pour la nuque et le dos.',
      description_scene: 'Tu passes de longs moments à lire sur ton téléphone en le tenant à hauteur de ventre. Tu restes plusieurs heures d\'affilée assis sans te lever. Tu coinces parfois le téléphone entre ton épaule et ton oreille pour taper en même temps au clavier. Tu fais une petite pause toutes les 45–60 minutes pour bouger. Tu ajustes la hauteur de ta chaise si tu as mal aux cuisses ou aux genoux.',
      question: 'Qu\'est-ce qui favorise les tensions et les douleurs dans cette journée ?',
      options: [
        'Lire longtemps sur le téléphone en le tenant très bas.',
        'Rester plusieurs heures assis sans se lever.',
        'Coincer le téléphone entre l\'épaule et l\'oreille pour taper en même temps.',
        'Faire une petite pause pour bouger ou regarder au loin.',
        'Ajuster la hauteur de la chaise en fonction de ton ressenti.'
      ],
      bonnes_reponses_index: [0, 1, 2],
      feedback_si_reussi: 'Exact : lire longtemps sur le téléphone en le tenant bas, rester des heures sans bouger et coincer le téléphone entre épaule et oreille favorisent les douleurs de nuque et de dos. Les pauses régulières et l\'ajustement de la chaise sont au contraire des moyens de prévention.',
      feedback_si_erreurs: 'Les comportements à risque sont : lire longtemps sur le téléphone en le tenant très bas (tête penchée) ; rester assis sans bouger pendant de longues durées ; coincer le téléphone entre l\'épaule et l\'oreille pour taper au clavier. Faire des pauses et ajuster la chaise vont plutôt dans le bon sens.'
    }
  ],
  bouton_fin: 'Passer à la suite du parcours'
}
```

---

## e10 — Mini-jeu Agressivité / violences externes (type: `mini_jeu`)

```js
{
  id: 'e10',
  type: 'mini_jeu',
  theme: 'rps',
  points: 1,
  badge: { id: 'violences_ext', label: 'Je réagis aux violences externes' },
  titre: 'Mini-jeu – Agressivité et violences externes',
  texte_introduction: 'Les violences externes sont des violences exercées contre un agent par des personnes extérieures à la structure (usagers, patients, clients…). Elles peuvent prendre la forme d\'incivilités, d\'insultes, de menaces, d\'agressions verbales ou physiques.',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e10_m1',
      type: 'qcm',
      titre_manche: 'Manche 1 — Scène au guichet / en visite',
      consigne: 'Tu es en contact avec un usager (au guichet, au téléphone ou en visite). Il élève la voix, te coupe la parole, t\'accuse de "ne rien faire", puis t\'insulte.',
      question: 'Parmi ces réactions, laquelle va dans le sens de la prévention ?',
      options: [
        'Considérer que "ça fait partie du métier", ne rien dire et continuer comme si de rien n\'était.',
        'Répondre sur le même ton pour montrer que tu ne te laisses pas faire.',
        'Rester calme, mettre fin à l\'échange si besoin, et en parler rapidement à ton responsable ou aux acteurs de prévention (référent, SST, médecin du travail, représentants du personnel…).'
      ],
      bonne_reponse_index: 2,
      feedback_correct: 'C\'est la réaction attendue : tu n\'as pas à subir seul des insultes ou menaces. Les violences externes doivent être connues, analysées et faire l\'objet de mesures de prévention (aménagements, procédures, soutien…).',
      feedback_incorrect: 'Les violences externes (insultes, menaces, agressions) ne sont ni "normales", ni à gérer seul. Les banaliser ou répondre sur le même ton risque d\'envenimer la situation. Il est important d\'en parler et d\'utiliser les dispositifs de signalement et de soutien prévus.'
    },
    {
      id: 'e10_m2',
      type: 'qcm_multi',
      titre_manche: 'Manche 2 — Violences externes ou difficultés "normales" ?',
      consigne: 'Coche ce qui relève des violences externes (et doit être signalé).',
      options: [
        'Un usager parle vite, mais sans agressivité particulière.',
        'Un usager te traite d\'incapable et dit que tu "le fais exprès pour lui gâcher la vie".',
        'Un usager te menace de "t\'attendre à la sortie".',
        'Un usager lève la main sur toi ou te bouscule.',
        'Un usager te demande de réexpliquer parce qu\'il n\'a pas compris.'
      ],
      bonnes_reponses_index: [1, 2, 3],
      feedback_si_reussi: 'Les incivilités répétées, insultes, menaces et agressions physiques font partie des violences externes et doivent être prises en compte dans la prévention. Un simple désaccord ou une demande d\'explication ne constitue pas en soi une violence externe.',
      feedback_si_erreurs: 'Les violences externes comprennent notamment : insultes (situation 2), menaces (situation 3) et agressions physiques (situation 4). Les situations 1 et 5 relèvent plutôt de difficultés de communication à gérer par le dialogue.'
    }
  ],
  bouton_fin: 'Passer au harcèlement moral'
}
```

---

## e11 — Harcèlement moral (type: `mini_jeu`)

```js
{
  id: 'e11',
  type: 'mini_jeu',
  theme: 'rps',
  points: 1,
  badge: { id: 'harcelement', label: 'Je repère le harcèlement' },
  titre: 'Harcèlement moral : repérer et réagir',
  texte_introduction: 'Le harcèlement moral se caractérise par des agissements répétés qui ont pour objet ou pour effet de dégrader les conditions de travail d\'une personne, de porter atteinte à sa dignité ou d\'altérer sa santé. Il ne s\'agit pas d\'un simple conflit ponctuel ou d\'un désaccord isolé.',
  seuil_reussite: 1,  // 1 manche sur 2 (manche 2 est informative)
  manches: [
    {
      id: 'e11_m1',
      type: 'qcm_multi',
      titre_manche: 'Manche 1 — Harcèlement ou pas ?',
      consigne: 'Plusieurs situations sont décrites. Coche celles qui peuvent faire penser à du harcèlement moral.',
      options: [
        'Remarques occasionnelles sur un travail à améliorer, avec explications et échanges.',
        'Un collègue ou un supérieur te dénigre quasiment tous les jours devant les autres ("tu es nul", "tu ralentis tout le monde"), malgré ton travail correct.',
        'On te confie systématiquement des tâches dévalorisantes ou sans rapport avec ton métier, sans explication, alors que tes missions habituelles sont retirées.',
        'Un désaccord ponctuel en réunion, avec un ton un peu vif mais qui se calme ensuite.',
        'On t\'isole : on ne te transmet plus certaines informations importantes, on te met à l\'écart des réunions qui concernent ton travail.'
      ],
      bonnes_reponses_index: [1, 2, 4],
      feedback_si_reussi: 'Le harcèlement moral se manifeste par des agissements répétés qui dégradent les conditions de travail : dénigrements répétés, mise à l\'écart organisée, tâches systématiquement dévalorisantes. Un désaccord ponctuel ou une remarque professionnelle argumentée n\'entrent pas, en eux-mêmes, dans cette définition.',
      feedback_si_erreurs: 'Les situations 2, 3 et 5 peuvent faire penser à du harcèlement moral : répétition de dénigrements, mise à l\'écart, modification injustifiée et durable du travail. Les situations 1 et 4 relèvent plutôt d\'un conflit ponctuel ou d\'un recadrage.'
    },
    {
      id: 'e11_m2',
      type: 'texte',  // manche informative, pas de scoring
      titre_manche: 'Manche 2 — Que faire si je me reconnais ?',
      texte: `Si tu te reconnais dans certaines situations, l'idée n'est pas de rester seul :<br>
• <strong>Noter</strong> des faits concrets (dates, situations, propos tenus).<br>
• <strong>En parler</strong> à une personne ressource (responsable, médecin du travail, service RH, représentants du personnel, référent RPS ou harcèlement s'il existe).<br>
• <strong>Utiliser</strong> les dispositifs de signalement mis en place par la structure.<br><br>
L'employeur a l'obligation de protéger la santé physique et mentale des agents et de prévenir le harcèlement moral.`
    }
  ],
  bouton_fin: 'Passer à l\'organisation du travail'
}
```

---

## e12 — Mini-jeu RPS et organisation (type: `mini_jeu`)

```js
{
  id: 'e12',
  type: 'mini_jeu',
  theme: 'rps',
  points: 1,
  badge: { id: 'rps_orga', label: 'Je comprends les RPS' },
  titre: 'Mini-jeu – Quand l\'organisation du travail pèse',
  texte_introduction: 'Les risques psychosociaux (RPS) sont des risques pour la santé physique et mentale qui trouvent leur origine dans les conditions d\'emploi, l\'organisation du travail et les relations de travail (stress, violences internes ou externes, harcèlement, épuisement…).',
  seuil_reussite: 2,
  manches: [
    {
      id: 'e12_m1',
      type: 'qcm_multi',
      titre_manche: 'Manche 1 — Ça ressemble à quoi, un travail qui pèse ?',
      consigne: 'Plusieurs situations sont décrites. Coche celles qui peuvent augmenter le risque de RPS au niveau de l\'organisation du travail.',
      options: [
        'Les priorités changent souvent au dernier moment, sans explication claire.',
        'Les objectifs sont flous ou contradictoires : les consignes varient selon les interlocuteurs.',
        'On te demande régulièrement de faire beaucoup plus que ce qui est prévu, sans moyens supplémentaires et sans que ce soit discuté.',
        'Tu as la possibilité d\'échanger régulièrement sur ton travail en réunion d\'équipe ou en entretien.',
        'Les changements importants (organisation, outils, procédures) sont annoncés sans explication, juste par mail, à la dernière minute.'
      ],
      bonnes_reponses_index: [0, 1, 2, 4],
      feedback_si_reussi: 'Ces situations peuvent augmenter le risque de RPS : priorités changeantes sans explication, objectifs flous ou contradictoires, surcharge non discutée, changements non expliqués. Le fait d\'avoir des temps d\'échange sur le travail (option 4) est au contraire un levier de prévention.',
      feedback_si_erreurs: 'Les facteurs qui augmentent le risque de RPS : priorités instables et peu expliquées ; objectifs flous ou contradictoires ; surcharge non discutée, manque de moyens ; changements annoncés sans explication ni dialogue. Disposer de temps pour parler du travail est plutôt protecteur.'
    },
    {
      id: 'e12_m2',
      type: 'qcm_multi',
      titre_manche: 'Manche 2 — Ce qui aide au quotidien',
      consigne: 'Cette fois, coche ce qui peut t\'aider à mieux vivre ton travail au quotidien.',
      options: [
        'Savoir clairement ce qu\'on attend de toi (missions, priorités, procédures accessibles).',
        'Pouvoir ajuster certains détails d\'organisation avec ton responsable.',
        'Avoir des temps réguliers pour échanger sur les difficultés (réunion d\'équipe, entretien, supervision).',
        'Recevoir des retours uniquement quand ça ne va pas.',
        'Être informé en amont des changements importants (nouvelle procédure, nouvel outil, nouvelle organisation).'
      ],
      bonnes_reponses_index: [0, 1, 2, 4],
      feedback_si_reussi: 'La clarté du travail, des marges de manœuvre sur l\'organisation, des temps d\'échange et une information anticipée sur les changements sont des leviers classiques de prévention des RPS. Les retours uniquement négatifs sont au contraire sources de tension et de démotivation.',
      feedback_si_erreurs: 'Les leviers de prévention : définir clairement les missions et les priorités ; laisser des marges d\'ajustement dans la façon de faire le travail ; organiser des temps d\'échanges réguliers ; expliquer les changements en amont. Un feedback uniquement critique fragilise la reconnaissance et les rapports sociaux.'
    }
  ],
  bouton_fin: 'Voir les acteurs qui peuvent t\'aider'
}
```

---

## e13 — Mini-jeu Qui fait quoi ? (type: `mini_jeu`)

```js
{
  id: 'e13',
  type: 'mini_jeu',
  theme: 'intro',
  points: 1,
  badge: { id: 'qui_fait_quoi', label: 'Je sais qui contacter' },
  titre: 'Mini-jeu – Qui fait quoi ?',
  texte_introduction: 'Plusieurs personnes ressources peuvent t\'aider en matière de santé et de sécurité au travail : SST, référent handicap, service en charge de la prévention (SDCP)… À toi d\'associer chaque personne à son rôle.',
  seuil_reussite: 1,
  manches: [
    {
      id: 'e13_m1',
      type: 'association',
      titre_manche: 'Manche unique — Associer les personnes et les rôles',
      consigne: 'Relie chaque personne à son rôle principal.',
      // PHOTOS DISPONIBLES dans assets/ : maeva_dupuy.jpg, laetitia_assezat.jpg,
      // nathalie_fourcart.jpg, elisabeth_herve.jpg, sonia_naze.jpg
      elements_gauche: [
        'Élisabeth Hervé',
        'Sonia Naze',
        'Nathalie Fourcart',
        'Maeva Dupuy',
        'Laetitia Assezat'
      ],
      elements_droite: [
        'Sauveteur Secouriste du Travail (SST)',
        'Référent handicap',
        'SDCP (Salarié Désigné Compétent en Prévention)',
        'SDCP + Référent handicap'
      ],
      associations_correctes: {
        'Élisabeth Hervé': 'Sauveteur Secouriste du Travail (SST)',
        'Sonia Naze': 'Sauveteur Secouriste du Travail (SST)',
        'Nathalie Fourcart': 'Sauveteur Secouriste du Travail (SST)',
        'Maeva Dupuy': 'SDCP + Référent handicap',
        'Laetitia Assezat': 'SDCP (Salarié Désigné Compétent en Prévention)'
      },
      feedback_si_reussi: 'Bravo : les SST (Élisabeth Hervé, Sonia Naze, Nathalie Fourcart) sont formés pour porter secours en cas d\'accident. Maeva Dupuy est à la fois SDCP et référente handicap. Laetitia Assezat est SDCP.',
      feedback_si_erreurs: 'Élisabeth Hervé, Sonia Naze, Nathalie Fourcart : Sauveteurs Secouristes du Travail (SST). Maeva Dupuy : SDCP et référente handicap. Laetitia Assezat : SDCP (Salarié Désigné Compétent en Prévention).'
    }
  ],
  bouton_fin: 'Terminer le parcours / Voir le récap'
}
```

---

## e14 — Récap "À qui je peux en parler ?" (type: `resources`)

> Ce type `resources` existe déjà dans `mechanics.js` (utilisé pour s16 du Parcours Prévention).
> Adapter avec les données spécifiques au module Sécurité.

```js
{
  id: 'e14',
  type: 'resources',
  theme: 'intro',
  points: 0,
  badge: null,
  titre: 'À qui je peux en parler ?',
  introduction: 'Tu n\'es pas seul : plusieurs acteurs peuvent t\'aider en cas de difficulté, de question de santé, de sécurité ou d\'organisation du travail.',
  blocs: [
    {
      sous_titre: 'Sauveteurs Secouristes du Travail (SST)',
      legende: 'En cas d\'accident ou de malaise',
      icone: 'shield',
      // Photos : voir assets/
      personnes: ['Élisabeth Hervé', 'Sonia Naze', 'Nathalie Fourcart'],
      contenu: 'Ils interviennent en cas d\'accident ou de malaise pour donner les premiers secours et alerter les secours spécialisés. Ils contribuent aussi à repérer des situations à risque.'
    },
    {
      sous_titre: 'Référent handicap',
      legende: 'Pour les questions liées au handicap',
      icone: 'hand',
      personnes: ['Maeva Dupuy'],
      contenu: 'Elle peut t\'aider à parler d\'une situation de handicap (déclarée ou non), d\'une maladie chronique, d\'un besoin d\'aménagement de poste ou d\'horaires.'
    },
    {
      sous_titre: 'SDCP (Salariés Désignés Compétents en Prévention)',
      legende: 'Pour les risques professionnels et l\'organisation',
      icone: 'shield',
      personnes: ['Laetitia Assezat', 'Maeva Dupuy'],
      contenu: 'Ils contribuent à l\'évaluation des risques, au DUERP et au suivi des actions de prévention. Tu peux les solliciter si tu repères une situation dangereuse ou un problème d\'organisation.'
    },
    {
      sous_titre: 'Médecin du travail / santé au travail',
      legende: 'Pour le lien santé ↔ travail',
      icone: 'leaf',
      personnes: [],
      contenu: 'Le médecin du travail a pour mission de prévenir toute altération de la santé liée au travail. Il surveille la santé des agents, conseille sur les aménagements de poste.'
    },
    {
      sous_titre: 'Représentants du personnel / CSE',
      legende: 'Pour faire remonter les problèmes collectifs',
      icone: 'users',
      personnes: [],
      contenu: 'Les représentants du personnel au CSE veillent à la santé, à la sécurité et aux conditions de travail des agents. Ils peuvent remonter des problèmes d\'organisation et demander des actions.'
    },
    {
      sous_titre: 'Encadrement / hiérarchie de proximité',
      legende: 'Le premier relais au quotidien',
      icone: 'users',
      personnes: [],
      contenu: 'Ton responsable direct reste un interlocuteur de proximité pour parler de ta charge de travail, de l\'organisation, des tensions dans l\'équipe.'
    }
  ],
  message_cloture: 'Selon la situation, tu peux choisir à qui tu te sens le plus à l\'aise de parler en premier. L\'important, c\'est de ne pas rester seul avec une situation qui te met en difficulté.',
  bouton_principal: 'Terminer le livret'
}
```
