import type { GameEvent } from "@/engine/types";

// Événements propres à chaque poste. Le champ `roles` du moteur existait depuis
// la V1 sans jamais servir : c'est ce qui donne enfin du poids au choix du rôle.

export const ROLE_EVENTS: GameEvent[] = [
  // ─────────────────────────────  TOP  ─────────────────────────────
  {
    id: "top_island",
    title: "Abandonné sur ton île",
    text: "Ton jungler ne monte jamais te voir. Tu encaisses un contre-matchup difficile en 1v1, sans aucune aide.",
    roles: ["Top"],
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "endure",
        label: "Serrer les dents et survivre",
        effects: { skill: 5, morale: -3 },
        resultText: "Tu limites les dégâts seul, sous pression permanente. Un travail ingrat mais précieux.",
      },
      {
        id: "demand",
        label: "Exiger de l'attention en vocal",
        effects: { chimie: -4, skill: 2, morale: 3 },
        resultText: "Tu hausses le ton. Le jungler monte enfin, le reste de la carte en souffre.",
      },
      {
        id: "outplay",
        label: "Retourner le matchup toi-même",
        effects: {},
        requires: { skill: 65 },
        risk: {
          chance: 0.55,
          success: { effects: { skill: 6, communaute: 8, reputation: 4 }, text: "Tu gagnes un duel qui semblait ingagnable. Le clip tourne dans la nuit." },
          failure: { effects: { morale: -5, chimie: -3 }, text: "Tu forces un duel perdu d'avance et tu offres deux morts." },
        },
        resultText: "",
      },
    ],
  },
  {
    id: "top_weakside",
    title: "Jouer le weakside",
    text: "Le plan de jeu tourne entièrement autour du bas de carte. On te demande de tenir sans ressources.",
    roles: ["Top"],
    choices: [
      {
        id: "accept",
        label: "Accepter le sacrifice",
        effects: { chimie: 8, reputation: -2 },
        resultText: "Tu tiens ta ligne sans rien demander. Les coéquipiers savent ce que ça coûte.",
      },
      {
        id: "refuse",
        label: "Réclamer des ressources",
        effects: { chimie: -5, skill: 4, reputation: 3 },
        resultText: "Tu obtiens gain de cause. La carte se rééquilibre autour de toi.",
      },
    ],
  },
  {
    id: "top_tank_meta",
    title: "La méta des tanks",
    text: "Le patch impose des tanks au top. Toi qui aimes porter les parties, tu vas devoir encaisser au lieu de frapper.",
    roles: ["Top"],
    choices: [
      {
        id: "embrace",
        label: "Devenir le meilleur tank de la ligue",
        effects: { skill: 5, chimie: 5, reputation: -2 },
        resultText: "Moins de highlights, beaucoup plus de victoires. Les analystes le voient.",
      },
      {
        id: "resist",
        label: "Forcer des picks de carry quand même",
        effects: { communaute: 6, chimie: -5 },
        resultText: "Le public adore ton entêtement. Le staff beaucoup moins.",
      },
    ],
  },
  {
    id: "top_veteran_duel",
    title: "Duel face à une légende",
    text: "En face, un joueur qui gagnait des Worlds quand tu jouais encore en amateur.",
    roles: ["Top"],
    choices: [
      {
        id: "respect",
        label: "Jouer prudemment et apprendre",
        effects: { skill: 4, morale: 2 },
        resultText: "Tu ne perds pas ta ligne et tu emmagasines une leçon de placement.",
      },
      {
        id: "statement",
        label: "Chercher le duel pour marquer les esprits",
        effects: {},
        risk: {
          chance: 0.45,
          success: { effects: { reputation: 8, communaute: 10, skill: 3 }, text: "Tu le solo-kill. En une action, tout le monde connaît ton nom." },
          failure: { effects: { morale: -6, reputation: -3 }, text: "Il te punit sans trembler. La leçon est publique." },
        },
        resultText: "",
      },
    ],
  },

  // ─────────────────────────────  JUNGLE  ─────────────────────────────
  {
    id: "jgl_pathing",
    title: "Quel pathing en début de partie ?",
    text: "Ton top est en difficulté, ton bot a une opportunité de plongée. Tu ne peux pas être aux deux endroits.",
    roles: ["Jungle"],
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "save",
        label: "Sauver ton top laner",
        effects: { chimie: 7, skill: 1 },
        resultText: "Tu stabilises le haut de carte. Ton top respire enfin.",
      },
      {
        id: "dive",
        label: "Plonger en bas pour créer l'avantage",
        effects: { skill: 4, chimie: -2, communaute: 4 },
        resultText: "Double kill en bas. Ton top se débrouillera.",
      },
      {
        id: "farm",
        label: "Farmer et monter en puissance",
        effects: { skill: 5, chimie: -4 },
        resultText: "Tu ignores les appels à l'aide et tu prends ton avance. Efficace, impopulaire.",
      },
    ],
  },
  {
    id: "jgl_blame",
    title: "Le jungler est toujours responsable",
    text: "Après la défaite, les quatre autres pointent ton pathing du doigt. C'est le lot du poste.",
    roles: ["Jungle"],
    weight: 2,
    choices: [
      {
        id: "own",
        label: "Assumer et proposer des corrections",
        effects: { chimie: 7, morale: -3, skill: 3 },
        resultText: "Tu prends la responsabilité. Le groupe se remet au travail au lieu de se déchirer.",
      },
      {
        id: "pushback",
        label: "Renvoyer chacun à ses erreurs",
        effects: { chimie: -7, morale: 4 },
        requires: { morale: 45 },
        resultText: "Tu sors les statistiques de chacun. Personne ne moufte, l'ambiance est glaciale.",
      },
    ],
  },
  {
    id: "jgl_objective_control",
    title: "L'obsession des objectifs",
    text: "Le coach veut que tu joues à 100 % autour des dragons, quitte à abandonner les lignes.",
    roles: ["Jungle"],
    choices: [
      {
        id: "objectives",
        label: "Tout jouer autour des objectifs",
        effects: { skill: 4, chimie: 5, communaute: -2 },
        resultText: "Vos taux de contrôle d'objectifs explosent. Le jeu est carré, sans éclat.",
      },
      {
        id: "tempo",
        label: "Privilégier le tempo et les ganks",
        effects: { skill: 3, communaute: 6, chimie: -2 },
        resultText: "Ton jeu est spectaculaire et te met en lumière.",
      },
    ],
  },
  {
    id: "jgl_counter_jungle",
    title: "Le jungler adverse te vole ta jungle",
    text: "Il est entré trois fois dans ton camp sans que personne ne réagisse.",
    roles: ["Jungle"],
    choices: [
      {
        id: "trap",
        label: "Lui tendre un piège avec ton équipe",
        effects: { chimie: 6, skill: 3 },
        requires: { chimie: 45 },
        resultText: "Vous l'attendez à sa quatrième tentative. Il ne revient plus.",
      },
      {
        id: "mirror",
        label: "Faire pareil de ton côté",
        effects: { skill: 4, forme: -3 },
        resultText: "Course à l'échalote dans les deux jungles. Tu t'en sors mieux que lui.",
      },
    ],
  },

  // ─────────────────────────────  MID  ─────────────────────────────
  {
    id: "mid_priority",
    title: "La priorité mid",
    text: "Ta ligne détermine le contrôle de la carte. Pousser donne la priorité mais t'expose aux ganks.",
    roles: ["Mid"],
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "push",
        label: "Pousser pour donner la priorité",
        effects: { chimie: 6, skill: 2, forme: -2 },
        resultText: "Ton jungler joue libéré grâce à toi. Un travail de l'ombre bien vu du staff.",
      },
      {
        id: "safe",
        label: "Jouer safe et farmer",
        effects: { skill: 4, chimie: -2 },
        resultText: "Tu gardes ton avance en toute sécurité, mais la carte se joue sans toi.",
      },
    ],
  },
  {
    id: "mid_star",
    title: "Le poste le plus exposé",
    text: "En LoL, le midlaner porte la lumière. Les caméras sont sur toi à chaque partie.",
    roles: ["Mid"],
    weight: 2,
    choices: [
      {
        id: "shine",
        label: "Assumer le statut de star",
        effects: { communaute: 9, reputation: 5, chimie: -3 },
        resultText: "Ton nom devient le premier cité quand on parle de l'équipe.",
      },
      {
        id: "team",
        label: "Renvoyer systématiquement vers l'équipe",
        effects: { chimie: 8, reputation: 2 },
        resultText: "Tu refuses le vedettariat. Le vestiaire t'en est reconnaissant.",
      },
    ],
  },
  {
    id: "mid_matchup_hell",
    title: "Un contre-matchup impossible",
    text: "L'adversaire a pris exactement ce qui te contre. Quarante minutes à subir en perspective.",
    roles: ["Mid"],
    choices: [
      {
        id: "survive",
        label: "Survivre et attendre ta fenêtre",
        effects: { skill: 5, morale: -2 },
        resultText: "Tu ne meurs pas une fois. Ton heure viendra en fin de partie.",
      },
      {
        id: "roam",
        label: "Abandonner ta ligne pour aller créer ailleurs",
        effects: { chimie: 5, skill: 2 },
        requires: { chimie: 45 },
        resultText: "Tu compenses en faisant gagner les autres lignes.",
      },
    ],
  },
  {
    id: "mid_prodigy",
    title: "On te compare à un prodige",
    text: "Un rookie de 17 ans cartonne à ton poste et la presse organise la comparaison.",
    roles: ["Mid"],
    minAge: 21,
    choices: [
      {
        id: "class",
        label: "Saluer son talent publiquement",
        effects: { reputation: 5, communaute: 4, morale: 2 },
        resultText: "Ton élégance est remarquée. Tu passes pour un vétéran respectable.",
      },
      {
        id: "prove",
        label: "Le battre à plate couture pour clore le débat",
        effects: { skill: 5, forme: -5 },
        requires: { forme: 50 },
        resultText: "Tu prépares ce match comme une finale. Le message est sans appel.",
      },
    ],
  },

  // ─────────────────────────────  ADC  ─────────────────────────────
  {
    id: "adc_duo",
    title: "L'alchimie du bot lane",
    text: "Ton support ne lit pas les mêmes fenêtres que toi. Vous jouez côte à côte, pas ensemble.",
    roles: ["ADC"],
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "duoq",
        label: "Passer vos soirées en duo SoloQ",
        effects: { chimie: 9, forme: -5 },
        resultText: "Des centaines de parties ensemble. Vous finissez par jouer sans parler.",
      },
      {
        id: "vod",
        label: "Analyser vos VOD ensemble avec le coach",
        effects: { chimie: 6, skill: 3 },
        resultText: "Vous identifiez précisément vos décalages. Le duo devient lisible.",
      },
      {
        id: "solo",
        label: "T'adapter seul à son style",
        effects: { skill: 4, chimie: 1, morale: -2 },
        resultText: "Tu fais tout le chemin. Ça fonctionne, mais tu le portes.",
      },
    ],
  },
  {
    id: "adc_fragile",
    title: "La cible numéro un",
    text: "Chaque équipe adverse construit son plan de jeu autour de ta mort.",
    roles: ["ADC"],
    weight: 2,
    choices: [
      {
        id: "protect",
        label: "Demander une composition protectrice",
        effects: { chimie: 5, skill: 2 },
        resultText: "L'équipe se construit autour de ta survie. Tu peux enfin jouer.",
      },
      {
        id: "self",
        label: "Apprendre à survivre sans protection",
        effects: { skill: 6, forme: -4 },
        requires: { forme: 45 },
        resultText: "Des heures de positionnement. Tu deviens insaisissable.",
      },
    ],
  },
  {
    id: "adc_cs",
    title: "Obsession du farm",
    text: "Ton CS par minute est le meilleur de la ligue, mais tu rates des combats en cherchant les dernières vagues.",
    roles: ["ADC"],
    choices: [
      {
        id: "balance",
        label: "Sacrifier du farm pour être présent",
        effects: { chimie: 6, skill: 2 },
        resultText: "Tu arrives à tous les combats. Tes statistiques baissent, vos victoires montent.",
      },
      {
        id: "greed",
        label: "Continuer à maximiser ton économie",
        effects: { skill: 5, chimie: -4 },
        resultText: "Tu es toujours le plus riche de la partie. Encore faut-il être là au bon moment.",
      },
    ],
  },
  {
    id: "adc_late",
    title: "Le poids de la fin de partie",
    text: "Après 35 minutes, la partie repose entièrement sur tes épaules — et tout le monde le sait.",
    roles: ["ADC"],
    choices: [
      {
        id: "clutch",
        label: "Assumer ce rôle sans trembler",
        effects: { skill: 4, reputation: 5, morale: -2 },
        resultText: "Tu deviens le joueur qu'on veut avoir en fin de partie.",
      },
      {
        id: "pressure",
        label: "Demander à l'équipe de finir plus tôt",
        effects: { chimie: 4, morale: 4 },
        resultText: "Vous jouez plus vite pour ne plus dépendre du dernier combat.",
      },
    ],
  },

  // ─────────────────────────────  SUPPORT  ─────────────────────────────
  {
    id: "sup_invisible",
    title: "Le travail invisible",
    text: "Tu as posé plus de vision que quiconque, et pourtant les analyses ne parlent que des autres.",
    roles: ["Support"],
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "keep",
        label: "Continuer sans rien demander",
        effects: { chimie: 8, skill: 2, reputation: -2 },
        resultText: "Le staff, lui, voit tout. Ta cote interne monte en flèche.",
      },
      {
        id: "speak",
        label: "Défendre ton apport publiquement",
        effects: { reputation: 6, communaute: 5, chimie: -3 },
        resultText: "Ton intervention lance un débat sur la sous-estimation des supports.",
      },
    ],
  },
  {
    id: "sup_shotcall",
    title: "Le support voit toute la carte",
    text: "Ta position te donne la meilleure lecture du jeu. Personne ne prend vraiment les décisions.",
    roles: ["Support"],
    weight: 2,
    choices: [
      {
        id: "lead",
        label: "Prendre le shotcall",
        effects: { chimie: 9, reputation: 5, forme: -3 },
        requires: { morale: 45 },
        resultText: "Ta voix devient la référence du vocal. L'équipe joue enfin dans le même sens.",
      },
      {
        id: "assist",
        label: "Alimenter en informations sans décider",
        effects: { chimie: 4, skill: 2 },
        resultText: "Tu donnes les éléments, les autres tranchent. Moins de charge mentale.",
      },
    ],
  },
  {
    id: "sup_sacrifice",
    title: "Se sacrifier pour le carry",
    text: "Un combat mal engagé : tu peux mourir pour sauver ton ADC, ou reculer et le laisser tomber.",
    roles: ["Support"],
    choices: [
      {
        id: "sacrifice",
        label: "Te sacrifier",
        effects: { chimie: 8, morale: 2 },
        resultText: "Ton carry survit et gagne le combat. Ta mort ne comptera dans aucune statistique.",
      },
      {
        id: "survive",
        label: "Reculer et rester en vie",
        effects: { skill: 3, chimie: -4 },
        resultText: "Tu préserves ta vision et ton économie. Ton ADC ne dit rien, mais il a vu.",
      },
    ],
  },
  {
    id: "sup_roam_call",
    title: "Quitter le bas de carte",
    text: "Ton ADC est en sécurité. Le haut de carte s'effondre et personne n'y va.",
    roles: ["Support"],
    choices: [
      {
        id: "roam",
        label: "Partir sauver le haut de carte",
        effects: { chimie: 6, skill: 3 },
        resultText: "Ton arrivée change tout en haut. Ton ADC gère seul en bas.",
      },
      {
        id: "stay",
        label: "Rester avec ton carry",
        effects: { chimie: 3, skill: 1 },
        resultText: "Tu protèges ton duo. Le haut de carte est perdu, mais le bas est verrouillé.",
      },
    ],
  },
];
