import type { Arc } from "@/engine/types";

// Fils narratifs multi-saisons. Chaque arc démarre selon le contexte, revient
// plus tard, et se referme sur une issue qui dépend de tes choix — certaines
// laissent des traces pour le reste de la carrière.

export const ARCS: Arc[] = [
  // ───────────────────────────  LE POIGNET  ───────────────────────────
  {
    id: "wrist",
    label: "Ce poignet qui te lance",
    entry: "twinge",
    weight: 3,
    trigger: { minSeason: 2, minAge: 18 },
    steps: [
      {
        id: "twinge",
        title: "Une gêne au poignet",
        text: "Rien de méchant : une gêne après les longues sessions, qui part en dormant. Le kiné de la structure te propose un bilan complet — trois jours sans souris.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "checkup",
            label: "Faire le bilan tout de suite",
            effects: { forme: 6, skill: -2 },
            resultText: "Rien de cassé, mais on te met sur un protocole d'étirements strict. Contraignant, efficace.",
            arcNext: { stepId: "managed", delaySeasons: 2 },
          },
          {
            id: "ignore",
            label: "Ignorer, tu as un split à jouer",
            effects: { skill: 3, forme: -3 },
            resultText: "Tu serres les dents. La gêne s'installe dans le décor, tu n'y penses même plus.",
            arcNext: { stepId: "flare", delaySeasons: 1 },
          },
        ],
      },
      {
        id: "managed",
        title: "Le protocole paie",
        text: "Deux ans que tu suis les étirements sans jamais sauter une séance. Le kiné te le dit : à ce rythme, ton poignet tiendra bien plus longtemps que la moyenne du circuit.",
        phases: ["preseason"],
        choices: [
          {
            id: "keep",
            label: "Continuer, discipline avant tout",
            effects: { forme: 12, morale: 4 },
            resultText: "Tu es l'un des rares joueurs de ta génération à ne jamais avoir manqué un match sur blessure.",
            arcNext: { stepId: null },
          },
        ],
      },
      {
        id: "flare",
        title: "La douleur ne part plus",
        text: "Ce n'est plus une gêne. Certains matins, tu n'arrives pas à fermer la main. L'imagerie parle d'une inflammation chronique : soit tu t'arrêtes maintenant, soit tu joues aux anti-inflammatoires.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "surgery",
            label: "T'arrêter et te faire opérer",
            effects: { forme: 14, skill: -8, morale: -6, reputation: -4 },
            resultText: "Trois mois sans compétition. Tu reviens diminué mécaniquement, mais ton poignet est réparé.",
            arcNext: { stepId: "comeback", delaySeasons: 1 },
          },
          {
            id: "painkillers",
            label: "Jouer sous anti-inflammatoires",
            effects: { skill: 2, forme: -10, morale: -4 },
            resultText: "Tu ne rates aucun match. Personne ne sait ce que ça te coûte le matin.",
            arcNext: { stepId: "breakdown", delaySeasons: 2 },
          },
        ],
      },
      {
        id: "comeback",
        title: "Le retour",
        text: "Six mois après l'opération, la douleur a disparu. Il te reste à retrouver la main que tu avais avant.",
        phases: ["preseason", "spring"],
        choices: [
          {
            id: "rebuild",
            label: "Tout reconstruire, patiemment",
            effects: { skill: 6, forme: 8, morale: 5 },
            raisesPotential: 2,
            resultText: "Tu réapprends ta mécanique de zéro, proprement. Certains disent que tu joues mieux qu'avant.",
            arcNext: { stepId: null },
          },
          {
            id: "rush",
            label: "Forcer le retour à ton ancien niveau",
            effects: {},
            risk: {
              chance: 0.45,
              stat: "forme",
              success: { effects: { skill: 8, morale: 6 }, text: "Ton corps encaisse. Tu retrouves ton niveau en quelques semaines." },
              failure: { effects: { forme: -14, skill: -4, morale: -8 }, text: "Rechute. Le poignet lâche à nouveau, et cette fois personne ne parle de guérison complète." },
            },
            resultText: "",
            arcNext: { stepId: null },
          },
        ],
      },
      {
        id: "breakdown",
        title: "Le poignet a dit stop",
        text: "En plein scrim, ta main s'ouvre toute seule. Le médecin est catégorique : à ce stade, chaque partie jouée aggrave des dégâts déjà irréversibles.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "stop",
            label: "Écouter, enfin",
            effects: { forme: 10, skill: -6, morale: -8 },
            resultText: "Tu lèves le pied pour de bon. Tu joueras moins, mais tu joueras encore.",
            arcNext: { stepId: null },
          },
          {
            id: "onemore",
            label: "Une dernière saison, quoi qu'il en coûte",
            effects: { skill: 4, forme: -20, morale: -6, communaute: 8 },
            resultText: "Tu joues au-delà du raisonnable. Le public le sait et t'acclame ; ton corps, lui, ne pardonnera pas.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ───────────────────────────  LA RIVALITÉ  ───────────────────────────
  {
    id: "rival",
    label: "Le rival de ta génération",
    entry: "emerges",
    weight: 3,
    trigger: { minSeason: 2 },
    steps: [
      {
        id: "emerges",
        title: "Un rival de ta génération",
        text: "Il a ton âge, ton poste, et la presse ne parle que de lui. En interview, on lui demande ce qu'il pense de toi : « il est correct ». Correct.",
        phases: ["spring", "summer"],
        choices: [
          {
            id: "fuel",
            label: "En faire une affaire personnelle",
            effects: { skill: 5, morale: -3, communaute: 6 },
            resultText: "Tu épingles la citation au-dessus de ton écran. Tu ne l'oublieras pas.",
            arcNext: { stepId: "duel", delaySeasons: 1 },
          },
          {
            id: "respect",
            label: "Le prendre comme un étalon de mesure",
            effects: { skill: 3, morale: 3, reputation: 3 },
            resultText: "Tu étudies son jeu sans animosité. Il y a des choses à apprendre là-dedans.",
            arcNext: { stepId: "duel", delaySeasons: 1 },
          },
        ],
      },
      {
        id: "duel",
        title: "Face à lui, enfin",
        text: "Vos deux équipes se croisent dans un match qui décide d'une qualification. Toute la ligue attend ce duel depuis un an.",
        phases: ["spring", "summer"],
        choices: [
          {
            id: "outplay",
            label: "Chercher le duel direct",
            effects: {},
            risk: {
              chance: 0.5,
              stat: "skill",
              success: { effects: { skill: 4, reputation: 8, communaute: 12, morale: 6 }, text: "Tu le domines de la tête et des épaules. Le récit change de camp." },
              failure: { effects: { morale: -8, reputation: -5, communaute: -4 }, text: "Il te punit devant tout le monde. Le clip tourne pendant des semaines." },
            },
            resultText: "",
            arcNext: { stepId: "final", delaySeasons: 2 },
          },
          {
            id: "team",
            label: "Jouer collectif et le prendre à revers",
            effects: { chimie: 8, skill: 2, reputation: 4 },
            resultText: "Tu refuses son terrain. Ton équipe gagne le match, et c'est tout ce qui compte.",
            arcNext: { stepId: "final", delaySeasons: 2 },
          },
        ],
      },
      {
        id: "final",
        title: "Le rival, en finale",
        text: "Des années que ça dure. Cette fois c'est une finale, et l'un de vous deux soulèvera le trophée devant l'autre.",
        phases: ["spring", "summer", "worlds"],
        choices: [
          {
            id: "allin",
            label: "Tout miser sur ce match",
            effects: { forme: -8 },
            risk: {
              chance: 0.5,
              stat: "skill",
              success: { effects: { reputation: 12, communaute: 18, morale: 12 }, text: "Tu gagnes. Après la poignée de main, il te dit simplement « c'était toi le meilleur ». Tu attendais ça depuis des années." },
              failure: { effects: { morale: -12, communaute: -6 }, text: "Il te bat. Encore. Tu resteras celui qui n'a jamais réussi à le faire tomber." },
            },
            resultText: "",
            arcNext: { stepId: null },
          },
          {
            id: "peace",
            label: "Aborder ça comme un match parmi d'autres",
            effects: { morale: 6, chimie: 4, skill: 2 },
            resultText: "Tu as arrêté de jouer contre lui il y a longtemps. Tu joues pour ton équipe, c'est tout.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ───────────────────────────  LE MENTOR  ───────────────────────────
  {
    id: "mentor",
    label: "Le vétéran qui t'a pris sous son aile",
    entry: "meets",
    weight: 2,
    trigger: { maxAge: 21, minSeason: 1 },
    steps: [
      {
        id: "meets",
        title: "Un vétéran te prend sous son aile",
        text: "Un ancien en fin de carrière passe ses soirées à revoir tes VOD avec toi. Il ne te doit rien, il le fait parce qu'il a envie.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "absorb",
            label: "Tout absorber",
            effects: { skill: 6, chimie: 5, morale: 4 },
            resultText: "Il te transmet en un hiver ce que d'autres mettent cinq ans à comprendre.",
            arcNext: { stepId: "fall", delaySeasons: 2 },
          },
          {
            id: "polite",
            label: "Rester poli mais garder tes distances",
            effects: { skill: 2, morale: 1 },
            resultText: "Tu écoutes d'une oreille. Tu as tes propres idées sur le jeu.",
            arcNext: { stepId: "fall", delaySeasons: 3 },
          },
        ],
      },
      {
        id: "fall",
        title: "Il s'écroule",
        text: "Ton mentor est aujourd'hui remplaçant, poussé dehors par un joueur de dix ans son cadet. Il t'appelle un soir, la voix mal assurée, pour te demander si tu peux glisser un mot au staff.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "help",
            label: "Le recommander, quitte à t'exposer",
            effects: { chimie: 6, morale: 8, reputation: -3 },
            resultText: "Le staff te fait remarquer que ce n'est pas ton rôle. Tu t'en fiches : il t'a fait le joueur que tu es.",
            arcNext: { stepId: "legacy", delaySeasons: 3 },
          },
          {
            id: "decline",
            label: "Refuser, ce n'est pas ta place",
            effects: { morale: -7, reputation: 2 },
            resultText: "Tu ne réponds pas au deuxième message. C'est le milieu qui veut ça, tu te répètes.",
            arcNext: { stepId: "legacy", delaySeasons: 3 },
          },
          {
            id: "hire",
            label: "Le faire venir comme coach avec ton propre argent",
            effects: { argent: -40000, chimie: 12, morale: 10 },
            requires: { argent: 60000 },
            resultText: "Tu paies son salaire de ta poche pendant six mois. Personne à l'extérieur ne le saura jamais.",
            arcNext: { stepId: "legacy", delaySeasons: 2 },
          },
        ],
      },
      {
        id: "legacy",
        title: "À ton tour",
        text: "Un rookie de ton équipe traverse exactement ce que tu traversais à ses débuts. Il ne demande rien, mais il traîne dans la salle quand tu revois tes parties.",
        phases: ["preseason", "spring", "summer"],
        minAge: 22,
        choices: [
          {
            id: "pass",
            label: "Transmettre à ton tour",
            effects: { chimie: 10, morale: 8, reputation: 5 },
            resultText: "Tu fais pour lui ce qu'on a fait pour toi. C'est comme ça que ça se perpétue.",
            arcNext: { stepId: null },
          },
          {
            id: "focus",
            label: "Rester sur ta propre carrière",
            effects: { skill: 5, morale: -3 },
            resultText: "Tu as encore des titres à aller chercher. Le rookie apprendra tout seul, comme tout le monde.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ───────────────────────────  L'AFFAIRE  ───────────────────────────
  {
    id: "scandal",
    label: "L'affaire des messages",
    entry: "leak",
    weight: 2,
    trigger: { minSeason: 3, requiresStats: { communaute: 35 } },
    steps: [
      {
        id: "leak",
        title: "Une capture d'écran circule",
        text: "Des messages privés où tu descends un ancien coéquipier fuitent sur les réseaux. Ils sont authentiques.",
        phases: ["spring", "summer", "preseason"],
        choices: [
          {
            id: "own",
            label: "Assumer publiquement et t'excuser",
            effects: { communaute: -6, reputation: -3, morale: -4, chimie: 4 },
            resultText: "Tu publies un message sans excuse de circonstance. Une partie du public respecte la franchise.",
            arcNext: { stepId: "aftermath", delaySeasons: 1 },
          },
          {
            id: "deny",
            label: "Nier en bloc",
            effects: { communaute: -3, morale: 2 },
            resultText: "Tu parles de captures trafiquées. Ça tient — pour l'instant.",
            arcNext: { stepId: "escalate", delaySeasons: 1 },
          },
        ],
      },
      {
        id: "escalate",
        title: "D'autres messages sortent",
        text: "La personne qui détenait les captures en publie vingt de plus, horodatées. Ton démenti ne tient plus une seconde.",
        phases: ["spring", "summer", "preseason"],
        choices: [
          {
            id: "confess",
            label: "Tout reconnaître, tard",
            effects: { communaute: -18, reputation: -10, morale: -10 },
            resultText: "L'aveu après le mensonge coûte bien plus cher que l'aveu seul. Ta structure publie un communiqué glacial.",
            arcNext: { stepId: "aftermath", delaySeasons: 1 },
          },
          {
            id: "lawyer",
            label: "Passer en mode juridique",
            effects: { argent: -25000, communaute: -12, morale: -6 },
            requires: { argent: 30000 },
            resultText: "Les avocats font taire l'affaire sans jamais la régler. Le milieu, lui, n'oublie pas.",
            arcNext: { stepId: "aftermath", delaySeasons: 2 },
          },
        ],
      },
      {
        id: "aftermath",
        title: "Ce qu'il en reste",
        text: "Des mois plus tard, l'affaire ressort dès qu'on prononce ton nom. Un média te propose une longue interview pour en parler une bonne fois.",
        phases: ["preseason", "spring", "summer"],
        choices: [
          {
            id: "interview",
            label: "Y aller sans filtre",
            effects: { communaute: 14, morale: 8, reputation: 5 },
            resultText: "Tu réponds à tout, sans esquive. L'interview fait date et referme le dossier.",
            arcNext: { stepId: null },
          },
          {
            id: "silence",
            label: "Refuser et laisser le temps faire",
            effects: { communaute: -4, morale: 3 },
            resultText: "Tu ne réponds plus jamais aux questions là-dessus. Ça s'éteint lentement, sans jamais s'éteindre tout à fait.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ───────────────────────────  LE PALIER  ───────────────────────────
  {
    id: "plateau",
    label: "Le mur du talent",
    entry: "wall",
    weight: 4,
    trigger: { atPotentialCap: true, minSeason: 2 },
    steps: [
      {
        id: "wall",
        title: "Tu ne progresses plus",
        text: "Tu t'entraînes autant qu'avant, tu revois tes VOD, et pourtant rien ne bouge. L'analyste te le dit franchement : tu as atteint le plafond de ce que ta mécanique actuelle permet.",
        phases: ["preseason"],
        atPotentialCap: true,
        choices: [
          {
            id: "rebuild",
            label: "Tout casser et reconstruire ta mécanique",
            effects: { skill: -4, forme: -8, morale: -5 },
            resultText: "Tu repars des fondations : grip, position d'écran, routine de warm-up. Ça fait mal, et ça va prendre des mois.",
            arcNext: { stepId: "breakthrough", delaySeasons: 1 },
          },
          {
            id: "accept",
            label: "Accepter ton niveau et jouer sur le reste",
            effects: { chimie: 8, morale: 6, reputation: 3 },
            resultText: "Tu ne seras jamais le plus mécanique du circuit. Tu peux être le plus intelligent.",
            arcNext: { stepId: null },
          },
        ],
      },
      {
        id: "breakthrough",
        title: "Le déclic",
        text: "Un an de travail ingrat. Et puis un matin, en scrim, tu réussis trois fois de suite un geste qui t'était inaccessible.",
        phases: ["preseason", "spring"],
        choices: [
          {
            id: "push",
            label: "Pousser encore, tu tiens quelque chose",
            effects: { skill: 5, forme: -5, morale: 8 },
            raisesPotential: 5,
            resultText: "Le mur a bougé. Ton plafond n'est plus là où tu le croyais.",
            arcNext: { stepId: null },
          },
          {
            id: "consolidate",
            label: "Consolider ce que tu viens de gagner",
            effects: { skill: 4, chimie: 5, forme: 4 },
            raisesPotential: 2,
            resultText: "Tu stabilises ton nouveau niveau au lieu de courir après le suivant. Sage.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },
];

export function getArc(id: string): Arc | undefined {
  return ARCS.find((a) => a.id === id);
}
