/* ==========================================================================
   content-securite.js — Livret Sécurité (e0 → e14)
   16 ecrans appondus au parcours existant. Forme adaptee au MOTEUR REEL
   (engine.js) : { id, num, kind, theme, eyebrow, title, points, badge, data }.
   Le brief supposait App.renderers[type] + score separe ; le moteur reel
   dispatch App.mechanics[def.kind] sur un registre lineaire unique. On adapte
   sans toucher engine.js (cf. brief 06, regle 2).

   e3 reutilise la mecanique native 'qcm'. e14 a son propre kind
   'ressources_securite' (donnees plus riches que le 'resources' de s16, qu'on
   ne veut pas casser). Les autres ecrans utilisent les nouveaux kinds definis
   dans mechanics-securite.js.
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});

  // num : on continue la numerotation globale apres les 17 ecrans Prevention.
  var base = (App.CONTENT && App.CONTENT.length) ? App.CONTENT.length : 17;
  var n = 0;
  function num() { return base + (++n); }

  var SECURITE = [

    /* ---------- e0 : texte ---------- */
    {
      id: "e0", num: num(), kind: "texte", theme: "intro",
      eyebrow: "Livret sécurité", title: "Bienvenue dans ton livret santé-sécurité interactif",
      points: 0, badge: null,
      data: {
        texte: "Ce module fait partie de ton accueil dans la structure. Pour t'informer des règles de santé et de sécurité, sous une forme interactive.<br><br>Tu vas y retrouver les informations essentielles sur les risques au travail (incendie, chutes, déplacements, hygiène, risques psychosociaux…) et les réflexes à adopter dès ton arrivée.<br><br>L'objectif est que tu saches quoi faire, à qui t'adresser et comment contribuer à ta propre sécurité et à celle des autres.",
        bouton: "Découvrir le cadre"
      }
    },

    /* ---------- e0b : vrai_faux_series ---------- */
    {
      id: "e0b", num: num(), kind: "vrai_faux_series", theme: "intro",
      eyebrow: "Cadre & obligations", title: "Les obligations de chacun",
      points: 1, badge: { id: "obligations", label: "Je connais le cadre" },
      data: {
        texte_introduction: "La loi donne des responsabilités à l'employeur… mais aussi aux agents. À toi de jouer : vrai ou faux ?",
        series: [
          {
            affirmation: "L'employeur doit évaluer les risques, mettre en place des mesures de prévention et informer les agents.",
            bonne_reponse: "vrai",
            feedback: "Oui. L'employeur a une obligation de sécurité : évaluer les risques, mettre en œuvre la prévention, informer et former les agents."
          },
          {
            affirmation: "Les agents n'ont aucune obligation, ils doivent seulement appliquer la loi si on la leur rappelle.",
            bonne_reponse: "faux",
            feedback: "Non. Les agents doivent aussi prendre soin de leur propre santé et de celle de leurs collègues, respecter les consignes de sécurité, utiliser correctement les équipements et signaler les situations dangereuses."
          },
          {
            affirmation: "Prévenir les risques, ce n'est pas seulement respecter la loi, c'est aussi améliorer le fonctionnement et la qualité du service.",
            bonne_reponse: "vrai",
            feedback: "Exact. La prévention a des enjeux humains, organisationnels et économiques : moins d'accidents, moins de dysfonctionnements, meilleure qualité du service."
          }
        ],
        bouton: "Voir les responsabilités"
      }
    },

    /* ---------- e0c : cartes_a_retourner ---------- */
    {
      id: "e0c", num: num(), kind: "cartes_a_retourner", theme: "intro",
      eyebrow: "Responsabilités", title: "Les différentes responsabilités",
      points: 0, badge: null,
      data: {
        texte: "Un même comportement peut engager différentes formes de responsabilité. Clique sur chaque carte pour en savoir plus.",
        cartes: [
          {
            titre_carte: "Responsabilité professionnelle / disciplinaire",
            texte_verso: "Elle concerne la relation entre l'agent et l'employeur. La méconnaissance des règles d'hygiène et de sécurité peut être considérée comme une faute disciplinaire. Tout manquement à une obligation peut entraîner une sanction prévue par le règlement intérieur."
          },
          {
            titre_carte: "Responsabilité pénale",
            texte_verso: "Elle concerne le respect des lois et règlements. La responsabilité pénale peut être engagée en cas de manquement aux dispositions légales ou réglementaires (mise en danger d'autrui, non-respect de consignes de sécurité essentielles…)."
          },
          {
            titre_carte: "Responsabilité civile",
            texte_verso: "Chacun est responsable du dommage qu'il cause à autrui, par son fait, sa négligence ou son imprudence. La collectivité peut aussi voir sa responsabilité engagée si un agent ne respecte pas une obligation qui lui incombe."
          }
        ],
        bouton: "Entrer dans le parcours sécurité"
      }
    },

    /* ---------- e1 : texte ---------- */
    {
      id: "e1", num: num(), kind: "texte", theme: "securite",
      eyebrow: "Sécurité", title: "On commence par la sécurité",
      points: 0, badge: null,
      data: {
        texte: "Avant de parler de stress ou d'organisation du travail, on s'assure que les bases de la sécurité sont en place : incendie, parking, escaliers, déplacements, électricité…<br><br>Tu vas voir des petites scènes, choisir des réponses et découvrir des réflexes simples à adopter dès ton arrivée.",
        bouton: "Commencer par l'incendie"
      }
    },

    /* ---------- e2 : drag_drop (ordonner) ---------- */
    {
      id: "e2", num: num(), kind: "drag_drop", theme: "securite",
      eyebrow: "Incendie", title: "En cas d'alarme : les étapes dans l'ordre",
      points: 1, badge: { id: "evacuation", label: "Je sais évacuer" },
      data: {
        texte: "L'alarme incendie retentit pendant que tu es dans les locaux. Remets les étapes dans le bon ordre.",
        elements_a_ordonner: [
          "Je m'arrête de travailler et je garde mon calme.",
          "Je me dirige vers la sortie la plus proche, sans prendre l'ascenseur.",
          "Je rejoins le point de rassemblement prévu.",
          "Si je suis bloqué, je signale ma présence."
        ],
        feedback_si_bon_ordre: "C'est l'ordre attendu : arrêter son activité, évacuer calmement par la sortie la plus proche, ne pas utiliser l'ascenseur, rejoindre le point de rassemblement et signaler sa présence si l'on est bloqué.",
        feedback_si_mauvais_ordre: "En cas d'alarme, on ne reste pas à son poste pour terminer une tâche, on ne revient pas chercher ses affaires et on n'utilise pas l'ascenseur. L'objectif est d'évacuer rapidement et calmement vers le point de rassemblement."
      }
    },

    /* ---------- e3 : qcm (mecanique NATIVE) ---------- */
    {
      id: "e3", num: num(), kind: "qcm", theme: "securite",
      eyebrow: "Incendie", title: "Incendie : attention à l'alarme",
      points: 1, badge: { id: "alarme", label: "Je respecte l'alarme" },
      data: {
        situation: "Tu disposes d'un badge personnel pour accéder aux locaux. Tu aimerais arriver beaucoup plus tôt que l'horaire habituel pour avancer sur un dossier… et l'alarme sonne.",
        question: "Que dois-tu retenir de cette situation ?",
        options: [
          { key: "A", text: "C'est sûrement une fausse alerte, je coupe l'alarme et je continue." },
          { key: "B", text: "En dehors des horaires prévus, l'accès aux locaux peut déclencher l'alarme : je dois respecter les plages d'ouverture et les consignes d'accès." },
          { key: "C", text: "Les alarmes se déclenchent souvent sans raison, ce n'est pas très grave." }
        ],
        correct: "B",
        feedback: "Le système d'alarme sert à protéger les personnes et les locaux. Venir en dehors des horaires prévus peut déclencher l'alarme et mobiliser l'astreinte ou les secours. Respecter les horaires et les modalités d'accès, c'est déjà faire de la prévention incendie."
      }
    },

    /* ---------- e4 : mini_jeu Incendie ---------- */
    {
      id: "e4", num: num(), kind: "mini_jeu", theme: "securite",
      eyebrow: "Incendie", title: "Mini-jeu – Incendie : comprendre pour prévenir",
      points: 1, badge: { id: "feu", label: "Je maîtrise le feu" },
      data: {
        texte_introduction: "3 manches rapides pour tester tes réflexes : reconstituer le triangle du feu, repérer les effets sur la santé et choisir les bons gestes de prévention.",
        seuil_reussite: 2,
        bouton_fin: "Passer au parking",
        manches: [
          {
            id: "e4_m1", type: "drag_drop_zones",
            titre_manche: "Manche 1 — Reconstituer le triangle du feu",
            consigne: "Glisse les bons éléments dans le triangle pour reconstituer les 3 ingrédients d'un incendie.",
            illustration_id: "triangle_feu",
            elements_disponibles: [
              "Un combustible (bois, papier, mobilier, produits, matériaux…)",
              "Un comburant (oxygène de l'air)",
              "Une source de chaleur (flamme, étincelle, installation électrique défectueuse…)",
              "Un extincteur",
              "Un plan d'évacuation"
            ],
            elements_corrects: [
              "Un combustible (bois, papier, mobilier, produits, matériaux…)",
              "Un comburant (oxygène de l'air)",
              "Une source de chaleur (flamme, étincelle, installation électrique défectueuse…)"
            ],
            nb_zones_cibles: 3,
            feedback_reussi: "C'est ça : pour qu'un incendie se déclare, il faut un combustible, un comburant (oxygène) et une source de chaleur. Sans l'un de ces trois éléments, la combustion ne démarre pas.",
            feedback_erreurs: "Les extincteurs et les plans d'évacuation servent à la protection, mais ne font pas partie des « ingrédients » de l'incendie. Les trois éléments à placer sont : combustible, comburant, source de chaleur."
          },
          {
            id: "e4_m2", type: "vrai_faux_series",
            titre_manche: "Manche 2 — Effets sur la santé : vrai ou faux ?",
            consigne: "Dis si chaque effet peut être lié à un incendie.",
            series: [
              { affirmation: "Brûlures cutanées.", bonne_reponse: "vrai", feedback: "Oui. Les brûlures font partie des effets directs d'un incendie sur la santé." },
              { affirmation: "Intoxication par les fumées et les gaz.", bonne_reponse: "vrai", feedback: "Oui. Les fumées et les gaz dégagés peuvent entraîner une intoxication parfois très grave." },
              { affirmation: "Écrasement du corps par chute d'objets ou d'éléments de structure.", bonne_reponse: "vrai", feedback: "Oui. Un incendie peut provoquer l'effondrement de structures (toit, mur, rayonnages…) et causer des écrasements." },
              { affirmation: "Un simple rhume sans autre conséquence.", bonne_reponse: "faux", feedback: "Non. Les effets principaux mis en avant sont brûlures, intoxications, blessures graves. Le rhume n'est pas l'enjeu ici." }
            ]
          },
          {
            id: "e4_m3", type: "qcm_multi",
            titre_manche: "Manche 3 — Choisir les bons gestes de prévention",
            consigne: "Coche les gestes qui vont dans le sens de la prévention des incendies.",
            options: [
              "Ne pas fumer à proximité des zones dangereuses (locaux techniques, produits chimiques, garages…).",
              "Entreposer des cartons devant un tableau électrique, « juste en attendant ».",
              "Isoler les produits combustibles (stockés dans un local prévu, fermé).",
              "Signaler à ton responsable une odeur de chaud ou un équipement électrique qui fait des étincelles.",
              "Bloquer une porte coupe-feu avec une cale pour qu'elle reste ouverte."
            ],
            bonnes_reponses_index: [0, 2, 3],
            feedback_si_reussi: "Bien vu : ne pas fumer près des zones à risque, isoler les produits combustibles et signaler toute anomalie (odeur de chaud, étincelles…) font partie des mesures de prévention recommandées.",
            feedback_si_erreurs: "Les bons réflexes sont : ne pas fumer dans les zones dangereuses, isoler les produits combustibles et signaler les anomalies sur les circuits ou matériels électriques. Entreposer des cartons devant un tableau électrique ou bloquer une porte coupe-feu augmente au contraire le risque en cas d'incendie."
          }
        ]
      }
    },

    /* ---------- e5 : mini_jeu Parking ---------- */
    {
      id: "e5", num: num(), kind: "mini_jeu", theme: "physique",
      eyebrow: "Parking & route", title: "Mini-jeu – Parking et déplacements",
      points: 1, badge: { id: "parking", label: "Je me gare bien" },
      data: {
        texte_introduction: "3 manches pour réfléchir à la façon de te garer, circuler sur le parking et mesurer le poids du risque routier lié au travail.",
        seuil_reussite: 2,
        bouton_fin: "Passer au téléphone au volant",
        manches: [
          {
            id: "e5_m1", type: "qcm",
            titre_manche: "Manche 1 — Où te garer ?",
            consigne: "Sur un schéma de parking, plusieurs emplacements possibles apparaissent. Choisis celui qui respecte le mieux la sécurité.",
            illustration_id: "parking_schema",
            question: "Où te gares-tu ?",
            options: ["Emplacement A", "Emplacement B", "Emplacement C", "Emplacement D"],
            legendes: [
              "A — Juste devant une issue de secours.",
              "B — À moitié sur la voie de circulation et à moitié sur une place.",
              "C — Place matérialisée, en marche arrière, sans gêner la circulation.",
              "D — Devant un accès pompier / borne incendie."
            ],
            bonne_reponse_index: 2,
            feedback_correct: "C'est le bon choix : une place matérialisée, en marche arrière, sans gêner la circulation ni les issues. Le stationnement inadapté peut gêner l'évacuation, l'accès des secours et augmenter le risque de heurt de piétons.",
            feedback_incorrect: "Se garer devant une issue de secours, sur une voie de circulation ou devant un accès pompier crée des risques : difficulté à évacuer, gêne pour les secours, vision réduite pour les conducteurs. Même pressé, on privilégie une place matérialisée, en marche arrière, qui ne bloque pas les accès."
          },
          {
            id: "e5_m2", type: "vrai_faux_series",
            titre_manche: "Manche 2 — Circulation sur le parking : vrai ou faux ?",
            consigne: "Dis si ces comportements sont adaptés sur le parking.",
            series: [
              { affirmation: "Sur le parking, je roule au pas et je fais particulièrement attention aux piétons.", bonne_reponse: "vrai", feedback: "Oui. Le parking est une zone de cohabitation véhicules / piétons : on roule au pas et on anticipe les traversées, sorties d'angle mort, etc." },
              { affirmation: "Je peux dépasser un autre véhicule sur le parking, même si la visibilité est réduite.", bonne_reponse: "faux", feedback: "Non. Les manœuvres brusques ou les dépassements sur un parking augmentent le risque de collision ou de heurt de personne." },
              { affirmation: "Je respecte les sens de circulation et les zones réservées (places PMR, zones livraisons…).", bonne_reponse: "vrai", feedback: "Oui. Les marquages et les zones réservées ont un rôle de sécurité (accès pour les personnes en situation de handicap, manœuvres de véhicules spécifiques, etc.)." }
            ]
          },
          {
            id: "e5_m3", type: "qcm",
            titre_manche: "Manche 3 — Quiz chiffres : risque routier",
            consigne: "À ton avis, le risque routier (trajets domicile–travail et déplacements professionnels) pèse combien dans les accidents mortels liés au travail ?",
            question: "Part des accidents mortels liés au travail dus au risque routier :",
            options: ["Environ 10 %", "Environ 30 %", "Environ 50 %"],
            bonne_reponse_index: 1,
            feedback_correct: "Exact : le risque routier représente environ 30 % des accidents mortels liés au travail, ce qui en fait la première cause de mortalité professionnelle.",
            feedback_incorrect: "En réalité, le risque routier représente autour de 30 % des accidents mortels liés au travail, et il est considéré comme la première cause de décès au travail."
          }
        ]
      }
    },

    /* ---------- e6 : mini_jeu Téléphone au volant ---------- */
    {
      id: "e6", num: num(), kind: "mini_jeu", theme: "physique",
      eyebrow: "Risque routier", title: "Mini-jeu – Téléphone au volant en visite à domicile",
      points: 1, badge: { id: "telephone_volant", label: "Je conduis sans téléphone" },
      data: {
        texte_introduction: "Les déplacements pour les visites à domicile font partie du travail : c'est le risque routier « mission ». L'usage du téléphone pendant la conduite augmente fortement le risque d'accident.",
        seuil_reussite: 2,
        bouton_fin: "Passer aux escaliers et aux chutes",
        manches: [
          {
            id: "e6_m1", type: "qcm",
            titre_manche: "Manche 1 — En tournée de visites",
            consigne: "Tu es en tournée de visites à domicile. Tu es en voiture entre deux adresses, ton téléphone professionnel sonne.",
            question: "Quel est le bon réflexe ?",
            options: [
              "Je décroche en conduisant : c'est forcément important, je verrai plus tard pour me garer.",
              "Je laisse sonner, je poursuis ma route, puis je m'arrête dans un endroit sécurisé (parking, aire de stationnement) pour écouter le message et rappeler.",
              "Je ralentis un peu et je regarde rapidement qui appelle pour décider si je décroche ou pas."
            ],
            bonne_reponse_index: 1,
            feedback_correct: "C'est le réflexe attendu : pendant la conduite, tu restes concentré sur la route. Tu laisses la messagerie prendre l'appel et tu traites l'information dès que tu peux t'arrêter dans un endroit sécurisé.",
            feedback_incorrect: "Téléphoner ou manipuler ton téléphone en conduisant détourne ton attention, même « quelques secondes », et augmente clairement le risque d'accident."
          },
          {
            id: "e6_m2", type: "qcm_multi",
            titre_manche: "Manche 2 — Organisation des communications",
            consigne: "Dans une équipe qui fait beaucoup de visites à domicile, quels sont les bons réglages / habitudes pour limiter l'usage du téléphone en conduisant ? (plusieurs réponses possibles)",
            options: [
              "Mettre le téléphone en mode silencieux ou « mode conduite » pendant les trajets, et laisser la messagerie répondre.",
              "Autoriser les collègues à t'appeler pendant les trajets pour « gagner du temps » sur l'organisation.",
              "Prévoir des créneaux d'appels avec le secrétariat en dehors des temps de conduite (avant la tournée, pause, fin de tournée).",
              "Regarder rapidement les SMS aux feux rouges pour rester réactif.",
              "Utiliser la messagerie pour informer que tu es en déplacement et que tu rappelleras."
            ],
            bonnes_reponses_index: [0, 2, 4],
            feedback_si_reussi: "Oui : mettre le téléphone en mode silencieux, organiser des temps de communication en dehors de la conduite et utiliser la messagerie limitent efficacement le téléphone au volant.",
            feedback_si_erreurs: "Les bonnes pratiques : téléphone en silencieux ou « mode conduite » pendant les trajets ; communications organisées à des moments précis (avant/après la tournée, pauses) ; messagerie qui prend le relais. Encourager les appels pendant la conduite ou consulter les SMS au feu rouge va à l'encontre de la prévention."
          }
        ]
      }
    },

    /* ---------- e7 : mini_jeu Escaliers et chutes ---------- */
    {
      id: "e7", num: num(), kind: "mini_jeu", theme: "physique",
      eyebrow: "Chutes", title: "Mini-jeu – Escaliers et chutes",
      points: 1, badge: { id: "chutes", label: "J'évite les chutes" },
      data: {
        texte_introduction: "Les chutes (de plain-pied ou dans les escaliers) représentent environ 1 accident du travail sur 5. À toi de repérer tous les éléments qui transforment un simple couloir en parcours à risque.",
        seuil_reussite: 2,
        bouton_fin: "Passer au bureau et à l'écran",
        manches: [
          {
            id: "e7_m1", type: "qcm_multi",
            titre_manche: "Manche 1 — Trouve les pièges",
            consigne: "On te décrit un couloir qui mène à un escalier. Coche tout ce qui peut favoriser une chute ou un faux pas.",
            illustration_id: "couloir_risques",
            description_scene: "Un sac posé au milieu du couloir. Une petite flaque d'eau près de l'entrée, non essuyée. Un câble d'alimentation qui traverse le passage. Un tapis roulé qui dépasse sur le côté. Une pile de dossiers rangés au sol contre un mur. Un éclairage faible (une ampoule sur deux fonctionne). Les dernières marches de l'escalier sont mal contrastées. La main courante est présente et accessible.",
            options: [
              "Le sac au milieu du couloir.",
              "La flaque d'eau non essuyée.",
              "Le câble qui traverse le passage.",
              "Le tapis roulé qui dépasse.",
              "La pile de dossiers qui empiète sur le passage.",
              "L'éclairage faible.",
              "Le manque de contraste des dernières marches.",
              "La main courante accessible."
            ],
            bonnes_reponses_index: [0, 1, 2, 3, 4, 5, 6],
            feedback_si_reussi: "Exact : obstacles (sac, dossiers), câbles au sol, tapis mal positionné, zones glissantes et éclairage insuffisant sont des facteurs classiques de chutes. Le manque de contraste sur les marches peut aussi gêner l'appréciation du relief. La main courante, au contraire, est un moyen de se sécuriser.",
            feedback_si_erreurs: "Les éléments qui augmentent le risque de chute : le sac au milieu du couloir, la pile de dossiers qui déborde, le câble qui traverse, la flaque d'eau non essuyée, le tapis roulé, l'éclairage insuffisant et le manque de contraste des marches. La main courante, elle, est une aide."
          },
          {
            id: "e7_m2", type: "qcm",
            titre_manche: "Manche 2 — Quiz chiffres : chutes au travail",
            consigne: "Pour te situer : à ton avis, les chutes représentent quelle part des accidents du travail ?",
            question: "Part des accidents du travail liés à des chutes (plain-pied ou hauteur) :",
            options: ["Environ 5 %", "Environ 10 %", "Environ 20 %"],
            bonne_reponse_index: 2,
            feedback_correct: "Oui : les chutes représentent environ 1 accident du travail sur 5, et la majorité sont des chutes de plain-pied (glissade, faux pas, obstacle).",
            feedback_incorrect: "En réalité, les chutes représentent environ 20 % des accidents du travail, et la majorité sont des chutes de plain-pied. Ce n'est donc pas un « petit risque » : les réflexes dans les couloirs et escaliers sont essentiels dès l'arrivée dans la structure."
          }
        ]
      }
    },

    /* ---------- e9 : mini_jeu Poste de travail ---------- */
    {
      id: "e9", num: num(), kind: "mini_jeu", theme: "physique",
      eyebrow: "Poste de travail", title: "Mini-jeu – Ton bureau : avant / après",
      points: 1, badge: { id: "bureau_ok", label: "Mon bureau est bien réglé" },
      data: {
        texte_introduction: "Le travail sur écran peut provoquer fatigue visuelle et douleurs (nuque, épaules, dos). Quelques réglages simples peuvent déjà changer beaucoup.",
        seuil_reussite: 2,
        bouton_fin: "Passer à la suite du parcours",
        manches: [
          {
            id: "e9_m1", type: "qcm",
            titre_manche: "Manche 1 — Quel poste tu choisis ?",
            consigne: "On te montre 3 bureaux (A, B, C). Choisis celui où tu préfèrerais t'installer, en pensant au confort de ton dos et de ta nuque.",
            illustration_id: "bureau_abc",
            question: "Quel bureau est le plus protecteur pour ta nuque et ton dos ?",
            options: ["Bureau A", "Bureau B", "Bureau C"],
            legendes: [
              "A — Écran très bas, chaise trop basse ; tête penchée vers l'avant.",
              "B — Écran à hauteur des yeux, à une longueur de bras ; pieds à plat ; clavier proche.",
              "C — Écran sur le côté (tête tournée) ; téléphone coincé à l'épaule ; documents au sol."
            ],
            bonne_reponse_index: 1,
            feedback_correct: "Oui : un écran à peu près à hauteur des yeux, à distance raisonnable, des pieds en appui et le clavier proche limitent la posture « tête penchée » (« tech neck ») et les tensions sur le dos et les épaules.",
            feedback_incorrect: "Le bureau le plus protecteur est le B : écran à hauteur des yeux, à une longueur de bras, chaise réglée pour avoir les pieds en appui, clavier proche. Les bureaux A et C obligent à pencher beaucoup la tête ou à la garder tournée longtemps, ce qui favorise les douleurs de nuque et de dos."
          },
          {
            id: "e9_m2", type: "qcm_multi",
            titre_manche: "Manche 2 — Trouve ce qui coince",
            consigne: "On te décrit une journée type au bureau. Coche ce qui te paraît à risque pour la nuque et le dos.",
            description_scene: "Tu passes de longs moments à lire sur ton téléphone en le tenant à hauteur de ventre. Tu restes plusieurs heures d'affilée assis sans te lever. Tu coinces parfois le téléphone entre ton épaule et ton oreille pour taper en même temps au clavier. Tu fais une petite pause toutes les 45–60 minutes pour bouger. Tu ajustes la hauteur de ta chaise si tu as mal aux cuisses ou aux genoux.",
            options: [
              "Lire longtemps sur le téléphone en le tenant très bas.",
              "Rester plusieurs heures assis sans se lever.",
              "Coincer le téléphone entre l'épaule et l'oreille pour taper en même temps.",
              "Faire une petite pause pour bouger ou regarder au loin.",
              "Ajuster la hauteur de la chaise en fonction de ton ressenti."
            ],
            bonnes_reponses_index: [0, 1, 2],
            feedback_si_reussi: "Exact : lire longtemps sur le téléphone en le tenant bas, rester des heures sans bouger et coincer le téléphone entre épaule et oreille favorisent les douleurs de nuque et de dos. Les pauses régulières et l'ajustement de la chaise sont au contraire des moyens de prévention.",
            feedback_si_erreurs: "Les comportements à risque sont : lire longtemps sur le téléphone en le tenant très bas (tête penchée) ; rester assis sans bouger pendant de longues durées ; coincer le téléphone entre l'épaule et l'oreille pour taper au clavier. Faire des pauses et ajuster la chaise vont plutôt dans le bon sens."
          }
        ]
      }
    },

    /* ---------- e10 : mini_jeu Violences externes ---------- */
    {
      id: "e10", num: num(), kind: "mini_jeu", theme: "rps",
      eyebrow: "Violences externes", title: "Mini-jeu – Agressivité et violences externes",
      points: 1, badge: { id: "violences_ext", label: "Je réagis aux violences externes" },
      data: {
        texte_introduction: "Les violences externes sont des violences exercées contre un agent par des personnes extérieures à la structure (usagers, patients, clients…). Elles peuvent prendre la forme d'incivilités, d'insultes, de menaces, d'agressions verbales ou physiques.",
        seuil_reussite: 2,
        bouton_fin: "Passer au harcèlement moral",
        manches: [
          {
            id: "e10_m1", type: "qcm",
            titre_manche: "Manche 1 — Scène au guichet / en visite",
            consigne: "Tu es en contact avec un usager (au guichet, au téléphone ou en visite). Il élève la voix, te coupe la parole, t'accuse de « ne rien faire », puis t'insulte.",
            question: "Parmi ces réactions, laquelle va dans le sens de la prévention ?",
            options: [
              "Considérer que « ça fait partie du métier », ne rien dire et continuer comme si de rien n'était.",
              "Répondre sur le même ton pour montrer que tu ne te laisses pas faire.",
              "Rester calme, mettre fin à l'échange si besoin, et en parler rapidement à ton responsable ou aux acteurs de prévention (référent, SST, médecin du travail, représentants du personnel…)."
            ],
            bonne_reponse_index: 2,
            feedback_correct: "C'est la réaction attendue : tu n'as pas à subir seul des insultes ou menaces. Les violences externes doivent être connues, analysées et faire l'objet de mesures de prévention (aménagements, procédures, soutien…).",
            feedback_incorrect: "Les violences externes (insultes, menaces, agressions) ne sont ni « normales », ni à gérer seul. Les banaliser ou répondre sur le même ton risque d'envenimer la situation. Il est important d'en parler et d'utiliser les dispositifs de signalement et de soutien prévus."
          },
          {
            id: "e10_m2", type: "qcm_multi",
            titre_manche: "Manche 2 — Violences externes ou difficultés « normales » ?",
            consigne: "Coche ce qui relève des violences externes (et doit être signalé).",
            options: [
              "Un usager parle vite, mais sans agressivité particulière.",
              "Un usager te traite d'incapable et dit que tu « le fais exprès pour lui gâcher la vie ».",
              "Un usager te menace de « t'attendre à la sortie ».",
              "Un usager lève la main sur toi ou te bouscule.",
              "Un usager te demande de réexpliquer parce qu'il n'a pas compris."
            ],
            bonnes_reponses_index: [1, 2, 3],
            feedback_si_reussi: "Les incivilités répétées, insultes, menaces et agressions physiques font partie des violences externes et doivent être prises en compte dans la prévention. Un simple désaccord ou une demande d'explication ne constitue pas en soi une violence externe.",
            feedback_si_erreurs: "Les violences externes comprennent notamment : insultes (situation 2), menaces (situation 3) et agressions physiques (situation 4). Les situations 1 et 5 relèvent plutôt de difficultés de communication à gérer par le dialogue."
          }
        ]
      }
    },

    /* ---------- e11 : mini_jeu Harcèlement moral ---------- */
    {
      id: "e11", num: num(), kind: "mini_jeu", theme: "rps",
      eyebrow: "Harcèlement", title: "Harcèlement moral : repérer et réagir",
      points: 1, badge: { id: "harcelement", label: "Je repère le harcèlement" },
      data: {
        texte_introduction: "Le harcèlement moral se caractérise par des agissements répétés qui ont pour objet ou pour effet de dégrader les conditions de travail d'une personne, de porter atteinte à sa dignité ou d'altérer sa santé. Il ne s'agit pas d'un simple conflit ponctuel ou d'un désaccord isolé.",
        seuil_reussite: 1,
        bouton_fin: "Passer à l'organisation du travail",
        manches: [
          {
            id: "e11_m1", type: "qcm_multi",
            titre_manche: "Manche 1 — Harcèlement ou pas ?",
            consigne: "Plusieurs situations sont décrites. Coche celles qui peuvent faire penser à du harcèlement moral.",
            options: [
              "Remarques occasionnelles sur un travail à améliorer, avec explications et échanges.",
              "Un collègue ou un supérieur te dénigre quasiment tous les jours devant les autres (« tu es nul », « tu ralentis tout le monde »), malgré ton travail correct.",
              "On te confie systématiquement des tâches dévalorisantes ou sans rapport avec ton métier, sans explication, alors que tes missions habituelles sont retirées.",
              "Un désaccord ponctuel en réunion, avec un ton un peu vif mais qui se calme ensuite.",
              "On t'isole : on ne te transmet plus certaines informations importantes, on te met à l'écart des réunions qui concernent ton travail."
            ],
            bonnes_reponses_index: [1, 2, 4],
            feedback_si_reussi: "Le harcèlement moral se manifeste par des agissements répétés qui dégradent les conditions de travail : dénigrements répétés, mise à l'écart organisée, tâches systématiquement dévalorisantes. Un désaccord ponctuel ou une remarque professionnelle argumentée n'entrent pas, en eux-mêmes, dans cette définition.",
            feedback_si_erreurs: "Les situations 2, 3 et 5 peuvent faire penser à du harcèlement moral : répétition de dénigrements, mise à l'écart, modification injustifiée et durable du travail. Les situations 1 et 4 relèvent plutôt d'un conflit ponctuel ou d'un recadrage."
          },
          {
            id: "e11_m2", type: "texte",
            titre_manche: "Manche 2 — Que faire si je me reconnais ?",
            texte: "Si tu te reconnais dans certaines situations, l'idée n'est pas de rester seul :<br>• <strong>Noter</strong> des faits concrets (dates, situations, propos tenus).<br>• <strong>En parler</strong> à une personne ressource (responsable, médecin du travail, service RH, représentants du personnel, référent RPS ou harcèlement s'il existe).<br>• <strong>Utiliser</strong> les dispositifs de signalement mis en place par la structure.<br><br>L'employeur a l'obligation de protéger la santé physique et mentale des agents et de prévenir le harcèlement moral."
          }
        ]
      }
    },

    /* ---------- e12 : mini_jeu RPS et organisation ---------- */
    {
      id: "e12", num: num(), kind: "mini_jeu", theme: "rps",
      eyebrow: "RPS", title: "Mini-jeu – Quand l'organisation du travail pèse",
      points: 1, badge: { id: "rps_orga", label: "Je comprends les RPS" },
      data: {
        texte_introduction: "Les risques psychosociaux (RPS) sont des risques pour la santé physique et mentale qui trouvent leur origine dans les conditions d'emploi, l'organisation du travail et les relations de travail (stress, violences internes ou externes, harcèlement, épuisement…).",
        seuil_reussite: 2,
        bouton_fin: "Voir les acteurs qui peuvent t'aider",
        manches: [
          {
            id: "e12_m1", type: "qcm_multi",
            titre_manche: "Manche 1 — Ça ressemble à quoi, un travail qui pèse ?",
            consigne: "Plusieurs situations sont décrites. Coche celles qui peuvent augmenter le risque de RPS au niveau de l'organisation du travail.",
            options: [
              "Les priorités changent souvent au dernier moment, sans explication claire.",
              "Les objectifs sont flous ou contradictoires : les consignes varient selon les interlocuteurs.",
              "On te demande régulièrement de faire beaucoup plus que ce qui est prévu, sans moyens supplémentaires et sans que ce soit discuté.",
              "Tu as la possibilité d'échanger régulièrement sur ton travail en réunion d'équipe ou en entretien.",
              "Les changements importants (organisation, outils, procédures) sont annoncés sans explication, juste par mail, à la dernière minute."
            ],
            bonnes_reponses_index: [0, 1, 2, 4],
            feedback_si_reussi: "Ces situations peuvent augmenter le risque de RPS : priorités changeantes sans explication, objectifs flous ou contradictoires, surcharge non discutée, changements non expliqués. Le fait d'avoir des temps d'échange sur le travail (option 4) est au contraire un levier de prévention.",
            feedback_si_erreurs: "Les facteurs qui augmentent le risque de RPS : priorités instables et peu expliquées ; objectifs flous ou contradictoires ; surcharge non discutée, manque de moyens ; changements annoncés sans explication ni dialogue. Disposer de temps pour parler du travail est plutôt protecteur."
          },
          {
            id: "e12_m2", type: "qcm_multi",
            titre_manche: "Manche 2 — Ce qui aide au quotidien",
            consigne: "Cette fois, coche ce qui peut t'aider à mieux vivre ton travail au quotidien.",
            options: [
              "Savoir clairement ce qu'on attend de toi (missions, priorités, procédures accessibles).",
              "Pouvoir ajuster certains détails d'organisation avec ton responsable.",
              "Avoir des temps réguliers pour échanger sur les difficultés (réunion d'équipe, entretien, supervision).",
              "Recevoir des retours uniquement quand ça ne va pas.",
              "Être informé en amont des changements importants (nouvelle procédure, nouvel outil, nouvelle organisation)."
            ],
            bonnes_reponses_index: [0, 1, 2, 4],
            feedback_si_reussi: "La clarté du travail, des marges de manœuvre sur l'organisation, des temps d'échange et une information anticipée sur les changements sont des leviers classiques de prévention des RPS. Les retours uniquement négatifs sont au contraire sources de tension et de démotivation.",
            feedback_si_erreurs: "Les leviers de prévention : définir clairement les missions et les priorités ; laisser des marges d'ajustement dans la façon de faire le travail ; organiser des temps d'échanges réguliers ; expliquer les changements en amont. Un feedback uniquement critique fragilise la reconnaissance et les rapports sociaux."
          }
        ]
      }
    },

    /* ---------- e13 : mini_jeu Qui fait quoi ? (association) ---------- */
    {
      id: "e13", num: num(), kind: "mini_jeu", theme: "intro",
      eyebrow: "Acteurs", title: "Mini-jeu – Qui fait quoi ?",
      points: 1, badge: { id: "qui_fait_quoi", label: "Je sais qui contacter" },
      data: {
        texte_introduction: "Plusieurs personnes ressources peuvent t'aider en matière de santé et de sécurité au travail : SST, référent handicap, service en charge de la prévention (SDCP)… À toi d'associer chaque personne à son rôle.",
        seuil_reussite: 1,
        bouton_fin: "Terminer le parcours / Voir le récap",
        manches: [
          {
            id: "e13_m1", type: "association",
            titre_manche: "Manche unique — Associer les personnes et les rôles",
            consigne: "Relie chaque personne à son rôle principal.",
            elements_gauche: ["Élisabeth Hervé", "Sonia Naze", "Nathalie Fourcart", "Maeva Dupuy", "Laetitia Assezat"],
            elements_droite: [
              "Sauveteur Secouriste du Travail (SST)",
              "Référent handicap",
              "SDCP (Salarié Désigné Compétent en Prévention)",
              "SDCP + Référent handicap"
            ],
            associations_correctes: {
              "Élisabeth Hervé": "Sauveteur Secouriste du Travail (SST)",
              "Sonia Naze": "Sauveteur Secouriste du Travail (SST)",
              "Nathalie Fourcart": "Sauveteur Secouriste du Travail (SST)",
              "Maeva Dupuy": "SDCP + Référent handicap",
              "Laetitia Assezat": "SDCP (Salarié Désigné Compétent en Prévention)"
            },
            feedback_si_reussi: "Bravo : les SST (Élisabeth Hervé, Sonia Naze, Nathalie Fourcart) sont formés pour porter secours en cas d'accident. Maeva Dupuy est à la fois SDCP et référente handicap. Laetitia Assezat est SDCP.",
            feedback_si_erreurs: "Élisabeth Hervé, Sonia Naze, Nathalie Fourcart : Sauveteurs Secouristes du Travail (SST). Maeva Dupuy : SDCP et référente handicap. Laetitia Assezat : SDCP (Salarié Désigné Compétent en Prévention)."
          }
        ]
      }
    },

    /* ---------- e14 : ressources_securite ---------- */
    {
      id: "e14", num: num(), kind: "ressources_securite", theme: "intro",
      eyebrow: "Ressources", title: "À qui je peux en parler ?",
      points: 0, badge: null,
      data: {
        introduction: "Tu n'es pas seul : plusieurs acteurs peuvent t'aider en cas de difficulté, de question de santé, de sécurité ou d'organisation du travail.",
        blocs: [
          {
            sous_titre: "Sauveteurs Secouristes du Travail (SST)",
            legende: "En cas d'accident ou de malaise",
            icone: "shield",
            personnes: ["Élisabeth Hervé", "Sonia Naze", "Nathalie Fourcart"],
            contenu: "Ils interviennent en cas d'accident ou de malaise pour donner les premiers secours et alerter les secours spécialisés. Ils contribuent aussi à repérer des situations à risque."
          },
          {
            sous_titre: "Référent handicap",
            legende: "Pour les questions liées au handicap",
            icone: "hand",
            personnes: ["Maeva Dupuy"],
            contenu: "Elle peut t'aider à parler d'une situation de handicap (déclarée ou non), d'une maladie chronique, d'un besoin d'aménagement de poste ou d'horaires."
          },
          {
            sous_titre: "SDCP (Salariés Désignés Compétents en Prévention)",
            legende: "Pour les risques professionnels et l'organisation",
            icone: "shield",
            personnes: ["Laetitia Assezat", "Maeva Dupuy"],
            contenu: "Ils contribuent à l'évaluation des risques, au DUERP et au suivi des actions de prévention. Tu peux les solliciter si tu repères une situation dangereuse ou un problème d'organisation."
          },
          {
            sous_titre: "Médecin du travail / santé au travail",
            legende: "Pour le lien santé ↔ travail",
            icone: "leaf",
            personnes: [],
            contenu: "Le médecin du travail a pour mission de prévenir toute altération de la santé liée au travail. Il surveille la santé des agents, conseille sur les aménagements de poste."
          },
          {
            sous_titre: "Représentants du personnel / CSE",
            legende: "Pour faire remonter les problèmes collectifs",
            icone: "users",
            personnes: [],
            contenu: "Les représentants du personnel au CSE veillent à la santé, à la sécurité et aux conditions de travail des agents. Ils peuvent remonter des problèmes d'organisation et demander des actions."
          },
          {
            sous_titre: "Encadrement / hiérarchie de proximité",
            legende: "Le premier relais au quotidien",
            icone: "users",
            personnes: [],
            contenu: "Ton responsable direct reste un interlocuteur de proximité pour parler de ta charge de travail, de l'organisation, des tensions dans l'équipe."
          }
        ],
        message_cloture: "Selon la situation, tu peux choisir à qui tu te sens le plus à l'aise de parler en premier. L'important, c'est de ne pas rester seul avec une situation qui te met en difficulté.",
        bouton: "Terminer le livret"
      }
    }

  ];

  App.SCREENS_SECURITE = SECURITE;

  // On appond au registre lineaire du moteur (un seul parcours, un seul score).
  // Le brief imaginait 2 modules a scores separes ; le moteur reel n'a qu'un
  // registre/score/cle localStorage. On etend sans casser engine.js ni la
  // Prevention existante : maxScore se recalcule tout seul a l'init.
  if (typeof App.registerScreens === "function") {
    App.registerScreens(SECURITE);
  }
})(window);
