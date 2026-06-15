/* ==========================================================================
   content.js — window.App.CONTENT
   Les 17 écrans du parcours « Etap-Santé », en data. Ordre = ordre du parcours.
   Enregistrés via App.registerScreens(...).
   maxScore attendu = 14 (S2..S15, 1 point chacun).
   ========================================================================== */
(function (window) {
  "use strict";

  var App = window.App || (window.App = {});

  var CONTENT = [

    /* ---------- S1 : intro ---------- */
    {
      id: "s01", num: 1, kind: "intro", theme: "intro",
      eyebrow: "Parcours prévention", title: "Bienvenue",
      points: 0, badge: null,
      data: {
        kicker: "Etap-Santé · Prévention",
        titleLines: ["Repérer.", "Parler.", "Agir tôt."],
        lead: "Tu vas découvrir plusieurs situations du quotidien professionnel. À chaque étape, repère ce qui peut compliquer le travail, choisis le bon réflexe et retiens des repères simples pour préserver la santé, la sécurité et la qualité du travail.",
        sub: "Ici, la prévention concerne à la fois les risques psychosociaux, les risques physiques, les risques sanitaires et les consignes de sécurité.",
        chips: ["RPS", "Risques physiques", "Santé & hygiène", "Sécurité"],
        cta: "Commencer"
      }
    },

    /* ---------- S2 : flip ---------- */
    {
      id: "s02", num: 2, kind: "flip", theme: "rps",
      eyebrow: "Prendre son poste", title: "Prendre ses repères",
      points: 1, badge: { id: "repere", label: "Je prends mes repères" },
      data: {
        faces: [
          { tag: "La situation", text: "Tu arrives sur une nouvelle mission et tu dois comprendre rapidement comment fonctionne l'organisation." },
          { tag: "Le risque", text: "Devoir avancer sans repères clairs." },
          { tag: "Le bon réflexe", text: "Demander les consignes, les priorités, les contacts utiles et les points de vigilance liés au poste." }
        ],
        feedback: "Un bon démarrage aide à travailler plus sereinement. Plus les repères sont clairs au départ, plus il est facile de s'intégrer et d'éviter les erreurs inutiles."
      }
    },

    /* ---------- S3 : qcm ---------- */
    {
      id: "s03", num: 3, kind: "qcm", theme: "rps",
      eyebrow: "RPS", title: "Le travail devient flou",
      points: 1, badge: null,
      data: {
        situation: "Plusieurs demandes arrivent en même temps, mais personne ne te dit clairement ce qui est prioritaire.",
        question: "Que fais-tu ?",
        options: [
          { key: "A", text: "Je fais tout en même temps." },
          { key: "B", text: "Je demande ce qui est prioritaire." },
          { key: "C", text: "Je fais comme je pense sans en parler." }
        ],
        correct: "B",
        feedback: "Quand le travail devient flou, il faut clarifier rapidement. Le flou augmente la charge mentale, fatigue inutilement et rend les erreurs plus probables.",
        retain: "Tu n'as pas à deviner."
      }
    },

    /* ---------- S4 : truefalse ---------- */
    {
      id: "s04", num: 4, kind: "truefalse", theme: "rps",
      eyebrow: "RPS", title: "Demander de l'aide",
      points: 1, badge: { id: "clarifie", label: "Je clarifie tôt" },
      data: {
        items: [
          {
            statement: "Demander une précision, c'est perdre du temps.",
            answer: false,
            feedback: "Demander une précision permet souvent de gagner du temps, de limiter les erreurs et de réduire la pression inutile."
          },
          {
            statement: "Demander un appui est un signe de faiblesse.",
            answer: false,
            feedback: "Demander un appui est un réflexe professionnel normal, surtout lorsqu'un outil, une tâche ou une consigne ne sont pas encore maîtrisés."
          }
        ]
      }
    },

    /* ---------- S5 : thermometer ---------- */
    {
      id: "s05", num: 5, kind: "thermometer", theme: "rps",
      eyebrow: "RPS", title: "Les relations internes",
      points: 1, badge: { id: "signaux", label: "Je repère les signaux" },
      data: {
        situation: "L'ambiance devient tendue, les échanges sont plus difficiles et certains malentendus reviennent souvent.",
        question: "À quel niveau places-tu cette situation ?",
        levels: [
          { key: "vert", label: "Vert", desc: "Stable" },
          { key: "orange", label: "Orange", desc: "Vigilance" },
          { key: "rouge", label: "Rouge", desc: "Alerte" }
        ],
        correct: ["orange", "rouge"],
        feedback: "Les tensions relationnelles doivent être repérées tôt. Quand elles durent, elles alourdissent le travail, fatiguent les équipes et peuvent détériorer la coopération.",
        retain: "Parler tôt évite souvent que la situation ne s'installe."
      }
    },

    /* ---------- S6 : dialogue ---------- */
    {
      id: "s06", num: 6, kind: "dialogue", theme: "rps",
      eyebrow: "RPS", title: "Le management participatif",
      points: 1, badge: { id: "changement", label: "Je comprends le changement" },
      data: {
        scene: "Une nouvelle organisation est annoncée, mais elle n'est pas expliquée clairement.",
        bubbles: [
          { who: "Toi", text: "Je ne comprends pas bien pourquoi on change cette façon de faire." },
          { who: "Un collègue", text: "Ce n'est pas grave, on verra plus tard." }
        ],
        question: "Quelle est la meilleure réaction ?",
        options: [
          { key: "A", text: "Ne rien demander." },
          { key: "B", text: "Chercher à comprendre le sens du changement." },
          { key: "C", text: "Faire semblant d'avoir compris." }
        ],
        correct: "B",
        feedback: "Un changement se vit mieux quand il est expliqué, préparé et accompagné. Comprendre son sens aide à réduire l'incertitude et la fatigue mentale."
      }
    },

    /* ---------- S7 : qcm ---------- */
    {
      id: "s07", num: 7, kind: "qcm", theme: "rps",
      eyebrow: "RPS", title: "La clarté des rôles",
      points: 1, badge: { id: "qui", label: "Je sais qui fait quoi" },
      data: {
        situation: "Deux personnes pensent devoir faire la même chose, tandis qu'une autre tâche n'est prise en charge par personne.",
        question: "Quel risque cette situation crée-t-elle ?",
        options: [
          { key: "A", text: "Une meilleure organisation." },
          { key: "B", text: "Des doublons, des oublis et des tensions." },
          { key: "C", text: "Une simplification du travail." }
        ],
        correct: "B",
        feedback: "Quand les rôles ne sont pas clairs, l'activité devient plus confuse. Chacun doit savoir ce qu'il fait, ce qu'il ne fait pas et à qui s'adresser.",
        retain: "Savoir qui fait quoi sécurise le collectif."
      }
    },

    /* ---------- S8 : choicepath ---------- */
    {
      id: "s08", num: 8, kind: "choicepath", theme: "rps",
      eyebrow: "RPS", title: "Les procédures",
      points: 1, badge: { id: "securise", label: "Je sécurise ma pratique" },
      data: {
        situation: "Tu cherches une procédure, mais tu ne sais pas où la trouver ni si elle est à jour.",
        choices: [
          { text: "Je me débrouille sans support.", consequence: "Je risque de perdre du temps ou de travailler avec une mauvaise information.", good: false },
          { text: "Je cherche la bonne version et je demande où la trouver.", consequence: "Je sécurise ma pratique et je limite les erreurs.", good: true }
        ],
        feedback: "Des procédures accessibles et actualisées permettent de gagner du temps et de travailler de manière plus fiable."
      }
    },

    /* ---------- S9 : qcm ---------- */
    {
      id: "s09", num: 9, kind: "qcm", theme: "rps",
      eyebrow: "RPS", title: "La montée en compétence",
      points: 1, badge: { id: "apprends", label: "J'apprends sans rester seul" },
      data: {
        situation: "Tu dois utiliser un outil métier que tu maîtrises encore mal.",
        question: "Quel est le meilleur réflexe ?",
        options: [
          { key: "A", text: "Faire semblant de savoir." },
          { key: "B", text: "Demander un appui ou une formation." },
          { key: "C", text: "Éviter l'outil autant que possible." }
        ],
        correct: "B",
        feedback: "On travaille plus sereinement quand on se sent accompagné. Demander une aide ou une formation permet de progresser sans rester seul face à la difficulté.",
        retain: "Demander de l'aide fait partie du travail."
      }
    },

    /* ---------- S10 : workstation ---------- */
    {
      id: "s10", num: 10, kind: "workstation", theme: "physique",
      eyebrow: "Risques physiques", title: "Le poste de travail et l'écran",
      points: 1, badge: { id: "poste", label: "Mon poste est ajusté" },
      data: {
        instruction: "Règle le poste idéal : sélectionne les bons réglages pour l'écran, le clavier, les objets fréquents et l'assise.",
        settings: [
          { text: "Écran face à soi, haut à hauteur des yeux", good: true },
          { text: "Clavier proche, poignets droits", good: true },
          { text: "Objets fréquents à portée de main", good: true },
          { text: "Assise réglée, dos soutenu, pieds à plat", good: true },
          { text: "Lumière sans reflet sur l'écran", good: true },
          { text: "Alterner les tâches pour reposer les yeux", good: true },
          { text: "Écran loin et de côté", good: false },
          { text: "Objets utiles hors de portée", good: false },
          { text: "Rester 4h sans bouger", good: false }
        ],
        feedback: "Un poste bien réglé limite les tensions physiques, la fatigue visuelle et la baisse d'attention. Le livret de sécurité rappelle aussi l'importance d'un bon positionnement devant l'écran.",
        retain: "Un poste mal adapté fatigue plus vite."
      }
    },

    /* ---------- S11 : hidden ---------- */
    {
      id: "s11", num: 11, kind: "hidden", theme: "physique",
      eyebrow: "Risques physiques", title: "Les chutes et les circulations",
      points: 1, badge: { id: "oeil", label: "J'ai l'œil sécurité" },
      data: {
        instruction: "Repère les éléments à risque parmi ces éléments de la scène.",
        hazards: [
          { id: "marche", label: "Une marche mal visible" },
          { id: "rallonge", label: "Une rallonge qui traîne" },
          { id: "passage", label: "Un passage encombré" },
          { id: "obstacle", label: "Un obstacle au sol" },
          { id: "rangement", label: "Un rangement dangereux" }
        ],
        safe: [
          { id: "plante", label: "Une plante bien rangée" },
          { id: "affiche", label: "Une affiche de consignes" },
          { id: "extincteur", label: "Un extincteur accessible" }
        ],
        feedback: "Les chutes de plain-pied ou de hauteur peuvent souvent être évitées grâce à un rangement correct, à des circulations dégagées et à une meilleure visibilité des zones à risque.",
        retain: "Un passage dégagé évite beaucoup d'accidents."
      }
    },

    /* ---------- S12 : truefalse ---------- */
    {
      id: "s12", num: 12, kind: "truefalse", theme: "physique",
      eyebrow: "Risques physiques", title: "Lumière, bruit et température",
      points: 1, badge: null,
      data: {
        items: [
          {
            statement: "Un espace trop sombre, trop bruyant ou trop chaud n'a pas vraiment d'effet sur le travail.",
            answer: false,
            feedback: "L'ambiance lumineuse, la température et le bruit influencent directement la fatigue, la concentration et le confort de travail."
          }
        ],
        retain: "L'environnement compte autant que la tâche."
      }
    },

    /* ---------- S13 : choicepath ---------- */
    {
      id: "s13", num: 13, kind: "choicepath", theme: "physique",
      eyebrow: "Risques physiques", title: "Déplacements et route",
      points: 1, badge: { id: "route", label: "Je roule prudemment" },
      data: {
        situation: "Tu dois te déplacer pour ta mission alors que la météo est dégradée.",
        choices: [
          { text: "Je pars sans vérifier.", consequence: "Je m'expose à un risque routier accru.", good: false },
          { text: "Je vérifie le véhicule, les consignes et les conditions météo.", consequence: "J'adapte mon déplacement et je réduis le risque.", good: true },
          { text: "Je prends le risque pour gagner du temps.", consequence: "Gagner quelques minutes ne vaut pas un accident.", good: false }
        ],
        feedback: "Le risque routier et les trajets en conditions difficiles doivent être pris au sérieux. Vérifier les conditions et adapter son déplacement est un bon réflexe de prévention."
      }
    },

    /* ---------- S14 : qcm ---------- */
    {
      id: "s14", num: 14, kind: "qcm", theme: "securite",
      eyebrow: "Sécurité", title: "Sécurité électrique et incendie",
      points: 1, badge: { id: "signale", label: "Je signale à temps" },
      data: {
        situation: "Tu repères une rallonge abîmée, un comportement dangereux ou une anomalie dans un espace de circulation.",
        question: "Que fais-tu ?",
        options: [
          { key: "A", text: "Je continue comme si de rien n'était." },
          { key: "B", text: "Je signale immédiatement le problème." },
          { key: "C", text: "J'attends que quelqu'un d'autre s'en occupe." }
        ],
        correct: "B",
        feedback: "Signaler une anomalie rapidement permet d'éviter l'accident. Les consignes d'évacuation, la vigilance électrique et le respect des zones de circulation font partie des repères de base en sécurité.",
        retain: "Signaler tôt, c'est déjà prévenir."
      }
    },

    /* ---------- S15 : ordering ---------- */
    {
      id: "s15", num: 15, kind: "ordering", theme: "sante",
      eyebrow: "Santé & hygiène", title: "Hygiène et santé",
      points: 1, badge: { id: "protege", label: "Je protège ma santé" },
      data: {
        instruction: "Sélectionne les bons réflexes à adopter au quotidien.",
        items: [
          { text: "Se laver les mains", good: true },
          { text: "Garder le poste propre", good: true },
          { text: "Utiliser les zones de pause prévues", good: true },
          { text: "Signaler une anomalie", good: true },
          { text: "Respecter les consignes sanitaires", good: true },
          { text: "Garder les voies de circulation dégagées", good: true },
          { text: "Laisser traîner le matériel", good: false },
          { text: "Ignorer une petite anomalie", good: false }
        ],
        feedback: "Les gestes simples d'hygiène, d'ordre et de propreté participent directement à la prévention des risques sanitaires et à la sécurité de tous."
      }
    },

    /* ---------- S16 : resources ---------- */
    {
      id: "s16", num: 16, kind: "resources", theme: "intro",
      eyebrow: "Ressources", title: "Les interlocuteurs ressources",
      points: 0, badge: null,
      data: {
        intro: "En cas de doute, de difficulté ou de situation à risque, tu peux te tourner vers :",
        contacts: [
          { label: "Ton responsable hiérarchique", icon: "users" },
          { label: "Les sauveteurs secouristes du travail (SST)", icon: "shield" },
          { label: "Le correspondant sécurité du site", icon: "shield" },
          { label: "Le service de santé au travail", icon: "leaf" },
          { label: "L'infirmière", icon: "hand" },
          { label: "Les membres du CSE / CSSCT", icon: "users" }
        ],
        retain: "Tu n'as pas à gérer seul une situation à risque."
      }
    },

    /* ---------- S17 : final ---------- */
    {
      id: "s17", num: 17, kind: "final", theme: "final",
      eyebrow: "Bilan", title: "Ton parcours prévention",
      points: 0, badge: null,
      data: {
        tiers: [
          { min: 0, max: 3, label: "Tu as commencé à repérer l'essentiel." },
          { min: 4, max: 7, label: "Bon niveau de vigilance." },
          { min: 8, max: 12, label: "Très bon réflexe de prévention." },
          { min: 13, max: 99, label: "Réflexes prévention bien installés." }
        ],
        text: "Repérer, parler, agir tôt : c'est le meilleur réflexe pour prévenir les risques psychosociaux, les risques physiques et les risques sanitaires. Un travail clair, des échanges réguliers, des moyens adaptés et des espaces sûrs permettent de mieux avancer ensemble.",
        cta: "Revoir les étapes"
      }
    }

  ];

  App.CONTENT = CONTENT;

  if (typeof App.registerScreens === "function") {
    App.registerScreens(CONTENT);
  }
})(window);
