import type { GameEvent } from "@/engine/types";

// Situations qui n'ont de sens qu'à un endroit précis de la carrière : le
// rookie anonyme d'une régionale et le vétéran titré de LCK ne vivent pas les
// mêmes journées. Filtrées par ligue, prestige, palmarès, ancienneté, moral.

export const CONTEXT_EVENTS: GameEvent[] = [
  // ─────────────────  DÉBUTS EN LIGUE RÉGIONALE  ─────────────────
  {
    id: "ctx_nobody",
    title: "Personne ne sait qui tu es",
    text: "Tu joues dans une salle de 200 places, devant un stream qui plafonne à 3 000 spectateurs. Ta famille demande encore si « ça peut vraiment devenir un métier ».",
    leagueTier: ["ERL"],
    maxSeason: 3,
    weight: 2,
    choices: [
      {
        id: "prove",
        label: "En faire ton moteur",
        effects: { skill: 5, morale: 3, forme: -3 },
        resultText: "Tu t'entraînes comme si quelqu'un regardait. Un jour, quelqu'un regardera.",
      },
      {
        id: "content",
        label: "Te créer une audience toi-même",
        effects: { communaute: 9, skill: -2, forme: -3 },
        resultText: "Tu streames tes SoloQ tous les soirs. Lentement, une petite communauté se forme.",
      },
    ],
  },
  {
    id: "ctx_erl_salary",
    title: "Le salaire d'une régionale",
    text: "Tu partages un appartement à trois pour tenir le mois. Un ami d'enfance te propose un vrai emploi, avec un vrai contrat.",
    leagueTier: ["ERL"],
    minAge: 19,
    maxPrestige: 45,
    choices: [
      {
        id: "stay",
        label: "Refuser, tu y crois encore",
        effects: { morale: -4, skill: 4 },
        resultText: "Tu raccroches en te disant que tu as intérêt à réussir.",
      },
      {
        id: "parttime",
        label: "Accepter un mi-temps en parallèle",
        effects: { argent: 9000, forme: -6, skill: -3, morale: 4 },
        resultText: "Tes journées sont doubles. Au moins, tu ne comptes plus chaque euro.",
      },
    ],
  },

  // ─────────────────  ARRIVÉE DANS L'ÉLITE  ─────────────────
  {
    id: "ctx_first_major",
    title: "Premier jour dans une ligue majeure",
    text: "Studio de production, cinq caméras, un public qui remplit une salle entière. Tes coéquipiers ont des titres que tu regardais à la télé il y a trois ans.",
    leagueTier: ["MAJOR"],
    minSeasonsAtTeam: 1,
    maxSeasonsAtTeam: 1,
    weight: 3,
    choices: [
      {
        id: "humble",
        label: "Te faire tout petit et observer",
        effects: { chimie: 7, skill: 3, reputation: -2 },
        resultText: "Tu écoutes plus que tu ne parles. Le vestiaire apprécie la retenue.",
      },
      {
        id: "assert",
        label: "Imposer ta voix dès le premier scrim",
        effects: { reputation: 5, chimie: -5, morale: 4 },
        resultText: "Tu ne laisses personne décider que tu es le petit nouveau.",
      },
      {
        id: "overwhelmed",
        label: "Avouer que tu es dépassé",
        effects: { morale: 6, chimie: 5, reputation: -3 },
        resultText: "Ton honnêteté désarme le vestiaire. Deux vétérans te prennent à part le soir même.",
      },
    ],
  },
  {
    id: "ctx_superteam",
    title: "Le poids d'une superteam",
    text: "Ton effectif est le plus cher de la ligue. Finir deuxième serait déjà considéré comme un échec par tout le monde.",
    leagueTier: ["MAJOR"],
    minPrestige: 78,
    weight: 2,
    choices: [
      {
        id: "embrace",
        label: "Assumer : vous êtes là pour tout gagner",
        effects: { reputation: 6, morale: -4, skill: 3 },
        resultText: "Tu déclares viser les Worlds dès la première interview. Plus de marche arrière.",
      },
      {
        id: "shield",
        label: "Protéger le groupe de la pression extérieure",
        effects: { chimie: 9, morale: 5, reputation: -2 },
        resultText: "Tu absorbes les questions à la place des autres. Le vestiaire respire.",
      },
    ],
  },

  // ─────────────────  STATUT ET PALMARÈS  ─────────────────
  {
    id: "ctx_titled",
    title: "Le poids du palmarès",
    text: "Tu as gagné. Les jeunes te regardent différemment, et chaque contre-performance est désormais analysée comme le début de ton déclin.",
    minTitles: 2,
    weight: 2,
    choices: [
      {
        id: "hungry",
        label: "Repartir à la chasse comme si tu n'avais rien gagné",
        effects: { skill: 5, morale: -3, forme: -4 },
        resultText: "Tu ranges les trophées dans un carton. Ils ne joueront pas la saison prochaine à ta place.",
      },
      {
        id: "enjoy",
        label: "Savourer ce que tu as construit",
        effects: { morale: 8, communaute: 5, skill: -2 },
        resultText: "Tu prends le temps de mesurer le chemin parcouru. Rare, dans ce milieu.",
      },
    ],
  },
  {
    id: "ctx_legend_pressure",
    title: "On parle de toi au passé",
    text: "Un analyste évoque ta carrière au passé composé, en direct, alors que tu es encore titulaire.",
    minAge: 25,
    minTitles: 1,
    weight: 2,
    choices: [
      {
        id: "answer",
        label: "Répondre sur la Faille",
        effects: { skill: 5, forme: -5, morale: 3 },
        resultText: "Tu enchaînes trois performances qui font taire tout le monde pendant un mois.",
      },
      {
        id: "accept",
        label: "Reconnaître que la fin approche",
        effects: { morale: 5, chimie: 6, reputation: 3 },
        resultText: "Tu parles ouvertement de l'après. Le milieu salue la lucidité.",
      },
    ],
  },

  // ─────────────────  ANCIENNETÉ ET VESTIAIRE  ─────────────────
  {
    id: "ctx_veteran_of_team",
    title: "Tu es la mémoire du club",
    text: "Tu es le seul rescapé du roster d'il y a quatre ans. Les nouveaux te demandent comment « on fait ici ».",
    minSeasonsAtTeam: 4,
    weight: 2,
    choices: [
      {
        id: "culture",
        label: "Transmettre la culture du club",
        effects: { chimie: 10, reputation: 4, morale: 4 },
        resultText: "Tu deviens le dépositaire de quelque chose qui te dépasse.",
      },
      {
        id: "detach",
        label: "T'en tenir à ton propre jeu",
        effects: { skill: 4, chimie: -4 },
        resultText: "Tu n'as pas signé pour être le guide du vestiaire.",
      },
    ],
  },
  {
    id: "ctx_new_arrival",
    title: "Tout est à reconstruire",
    text: "Nouvelle structure, nouveaux coéquipiers, nouveaux automatismes. Rien de ce que tu avais construit ailleurs ne se transfère.",
    minSeasonsAtTeam: 1,
    maxSeasonsAtTeam: 1,
    maxStats: { chimie: 45 },
    weight: 3,
    choices: [
      {
        id: "invest",
        label: "Passer tes soirées à créer du lien",
        effects: { chimie: 12, forme: -5, skill: -2 },
        resultText: "Repas, duos SoloQ, discussions tardives. En quelques semaines, ça commence à parler la même langue.",
      },
      {
        id: "pro",
        label: "Rester purement professionnel",
        effects: { skill: 5, chimie: 2, morale: -2 },
        resultText: "Tu fais ton travail, correctement, sans t'attacher.",
      },
    ],
  },

  // ─────────────────  CRISES  ─────────────────
  {
    id: "ctx_morale_crisis",
    title: "Tu n'as plus envie d'allumer le PC",
    text: "Ce n'est plus de la fatigue. Le matin, l'idée de te connecter te pèse physiquement.",
    maxStats: { morale: 30 },
    weight: 4,
    choices: [
      {
        id: "stop",
        label: "Tout arrêter deux semaines",
        effects: { morale: 18, forme: 10, skill: -5, chimie: -4 },
        resultText: "Tu coupes tout. Au bout de dix jours, l'envie revient sans prévenir.",
      },
      {
        id: "talk",
        label: "En parler au staff, franchement",
        effects: { morale: 12, chimie: 6, reputation: -2 },
        resultText: "Le staff allège ton programme. Personne ne te le reproche.",
      },
      {
        id: "hide",
        label: "Faire semblant que tout va bien",
        effects: { morale: -8, skill: 3, forme: -5 },
        resultText: "Tu tiens la façade. Elle finira par se fissurer devant tout le monde.",
      },
    ],
  },
  {
    id: "ctx_forme_crisis",
    title: "Ton corps lâche",
    text: "Dos bloqué, yeux qui brûlent, sommeil en miettes. Tu tiens debout à la caféine depuis trois semaines.",
    maxStats: { forme: 30 },
    weight: 4,
    choices: [
      {
        id: "medical",
        label: "Te mettre entre les mains du staff médical",
        effects: { forme: 20, skill: -3, morale: 4 },
        resultText: "Programme complet : kiné, sommeil, nutrition. Trois semaines plus tard, tu te reconnais.",
      },
      {
        id: "push",
        label: "Tenir jusqu'à la fin du split",
        effects: { forme: -8, skill: 2, reputation: 3 },
        resultText: "Tu finis la saison sur les rotules. Le staff note ton abnégation — et ton inconscience.",
      },
    ],
  },

  // ─────────────────  LE PLAFOND DE TALENT  ─────────────────
  {
    id: "ctx_cap_grind",
    title: "Le mur mécanique",
    text: "Tes statistiques stagnent depuis des mois. Un coach mécanique indépendant, réputé pour des méthodes brutales, propose de te prendre en charge tout un intersaison.",
    atPotentialCap: true,
    phases: ["preseason"],
    minSeason: 3,
    weight: 3,
    choices: [
      {
        id: "hire",
        label: "Le payer de ta poche et t'y soumettre",
        effects: { argent: -25000, forme: -10, morale: -6 },
        requires: { argent: 30000 },
        raisesPotential: 4,
        resultText: "Six semaines à réapprendre des gestes que tu croyais acquis. C'est humiliant, et ça marche.",
      },
      {
        id: "self",
        label: "T'imposer toi-même un programme de fond",
        effects: { forme: -6, morale: -3 },
        risk: {
          chance: 0.5,
          stat: "morale",
          success: {
            effects: { skill: 4, morale: 6 },
            text: "Sans personne pour te pousser, tu tiens quand même le programme jusqu'au bout. Le plafond bouge.",
          },
          failure: {
            effects: { morale: -6, forme: -4 },
            text: "Au bout de trois semaines, tu laisses filer. Rien n'a changé.",
          },
        },
        resultText: "",
        raisesPotential: 2,
      },
      {
        id: "skip",
        label: "Miser sur ton jeu collectif à la place",
        effects: { chimie: 9, morale: 4 },
        resultText: "Tu compenses par la lecture et la communication. C'est aussi une façon de progresser.",
      },
    ],
  },

  // ─────────────────  IMPORT ET DÉPAYSEMENT  ─────────────────
  {
    id: "ctx_import_language",
    title: "La barrière de la langue",
    text: "Les calls fusent dans une langue que tu ne maîtrises pas. L'interprète traduit avec deux secondes de retard — une éternité en teamfight.",
    leagueTier: ["MAJOR"],
    maxStats: { chimie: 40 },
    minSeasonsAtTeam: 1,
    maxSeasonsAtTeam: 2,
    weight: 3,
    choices: [
      {
        id: "learn",
        label: "Apprendre la langue, sérieusement",
        effects: { chimie: 14, forme: -6, skill: -2, morale: -3 },
        resultText: "Cours tous les matins avant les scrims. Six mois plus tard, tu n'as plus besoin d'interprète.",
      },
      {
        id: "shortlist",
        label: "Imposer un lexique de calls en anglais",
        effects: { chimie: 7, reputation: -2 },
        resultText: "Vingt mots-clés que tout le monde apprend. Rudimentaire mais efficace.",
      },
      {
        id: "isolate",
        label: "T'isoler et jouer ta partie",
        effects: { skill: 5, chimie: -6, morale: -6 },
        resultText: "Tu deviens le joueur qu'on ne comprend pas et qui ne comprend personne.",
      },
    ],
  },
];
