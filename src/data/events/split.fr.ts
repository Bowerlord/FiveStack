import type { GameEvent } from "@/engine/types";

// Événements de saison régulière : la vie d'un split, entre forme, cohésion,
// patchs en cours de route et gestion de la pression.

export const SPLIT_EVENTS: GameEvent[] = [
  {
    id: "split_slump",
    title: "Passage à vide",
    text: "Trois défaites d'affilée. Les critiques pleuvent sur les réseaux et le doute s'installe.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "grind",
        label: "Doubler les heures de SoloQ",
        effects: { skill: 5, forme: -6, morale: -2 },
        resultText: "Tu grind jusqu'à l'aube. Ta forme baisse mais ta mécanique redevient nette.",
      },
      {
        id: "reset",
        label: "Prendre un jour off avec l'équipe",
        effects: { forme: 8, morale: 7, chimie: 5, skill: -1 },
        resultText:
          "Une journée pour souffler ensemble ressoude le groupe, et tu reviens physiquement frais.",
      },
      {
        id: "media",
        label: "Répondre cash aux critiques en interview",
        effects: { communaute: 6, morale: 3, chimie: -3 },
        requires: { morale: 40 },
        resultText: "Ta punchline devient virale. Le public adore, le staff un peu moins.",
      },
    ],
  },
  {
    id: "split_highlight",
    title: "Un highlight de folie",
    text: "Tu réalises un outplay en 1v3 qui fait le tour du monde. Le clip explose.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "ride",
        label: "Surfer sur la hype en stream",
        effects: { communaute: 10, argent: 4000, forme: -3 },
        resultText: "Tes viewers explosent. Ta cote grimpe autant que ta fatigue.",
      },
      {
        id: "humble",
        label: "Rester humble et créditer l'équipe",
        effects: { chimie: 7, morale: 4, reputation: 4 },
        resultText: "Le vestiaire apprécie ta modestie. La cohésion monte.",
      },
    ],
  },
  {
    id: "split_conflict",
    title: "Tension dans le vestiaire",
    text: "Ton jungler t'accuse publiquement de ne jamais suivre les calls.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "talk",
        label: "Crever l'abcès en tête-à-tête",
        effects: { chimie: 8, morale: 2 },
        resultText: "Discussion franche autour d'un café : l'air est plus respirable.",
      },
      {
        id: "coach",
        label: "En référer au coach",
        effects: { chimie: 2, morale: -1 },
        resultText: "Le coach arbitre. Réglé sur le papier, mais un froid demeure.",
      },
      {
        id: "clap",
        label: "Répondre du tac au tac",
        effects: { chimie: -8, morale: 4, communaute: 4 },
        resultText: "Le clash fuite sur les réseaux. Ambiance électrique.",
      },
    ],
  },
  {
    id: "split_midpatch",
    title: "Un patch en plein split",
    text: "Riot sort un patch surprise à mi-saison. Toute la préparation de la semaine passe à la poubelle.",
    phases: ["spring", "summer"],
    weight: 3,
    choices: [
      {
        id: "adapt",
        label: "Tout réapprendre en urgence",
        effects: { skill: 5, forme: -5 },
        resultText: "Nuit blanche sur le PBE. Tu arrives préparé là où d'autres improvisent.",
      },
      {
        id: "stick",
        label: "Garder vos plans, tant pis",
        effects: { chimie: 3, skill: -3 },
        resultText: "Vous jouez ce que vous savez faire. Prévisible, mais solide.",
      },
      {
        id: "exploit",
        label: "Chercher l'abus caché du patch",
        effects: {},
        requires: { skill: 60 },
        risk: {
          chance: 0.5,
          stat: "skill",
          success: { effects: { skill: 8, communaute: 8, reputation: 5 }, text: "Tu trouves une interaction cassée avant tout le monde. Deux semaines de domination avant le hotfix." },
          failure: { effects: { forme: -6, morale: -4 }, text: "Des dizaines d'heures perdues sur une piste sans issue." },
        },
        resultText: "",
      },
    ],
  },
  {
    id: "split_wrist",
    title: "Douleur au poignet",
    text: "Une tendinite pointe le bout de son nez en pleine phase régulière.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "rest",
        label: "Se reposer et consulter",
        effects: { forme: 8, skill: -2, morale: -2 },
        resultText: "Tu soignes ça à temps. Sage décision sur le long terme.",
      },
      {
        id: "push",
        label: "Serrer les dents et jouer quand même",
        effects: { forme: -12, reputation: 3, skill: 1 },
        resultText: "Tu tiens ta place mais tu joues avec la douleur. Risqué.",
      },
    ],
  },
  {
    id: "split_sponsor",
    title: "Offre de sponsoring",
    text: "Une marque de matériel gaming te propose un partenariat personnel.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "accept",
        label: "Signer le partenariat",
        effects: { argent: 12000, communaute: 4, forme: -2 },
        resultText: "Beaux revenus et visibilité, contre quelques obligations de tournage.",
      },
      {
        id: "decline",
        label: "Refuser pour rester focus",
        effects: { skill: 3, morale: 2 },
        resultText: "Tu gardes ton énergie pour la compétition.",
      },
    ],
  },
  {
    id: "split_carry",
    title: "Le poids du carry",
    text: "L'équipe compte de plus en plus sur toi pour gagner les parties.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "embrace",
        label: "Assumer le statut de franchise player",
        effects: { skill: 5, reputation: 6, morale: -3 },
        resultText: "Tu deviens le point de référence. La pression monte d'un cran.",
      },
      {
        id: "share",
        label: "Répartir la charge sur le roster",
        effects: { chimie: 7, skill: -1 },
        resultText: "Un jeu plus collectif, moins dépendant de tes épaules.",
      },
    ],
  },
  {
    id: "split_bench",
    title: "Menace de banc",
    text: "Le coach évoque à demi-mot de faire tourner l'effectif. Le remplaçant s'entraîne beaucoup.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "fight",
        label: "Tout donner pour garder ta place",
        effects: { skill: 6, forme: -6, morale: -3 },
        resultText: "Tu écrases les scrims de la semaine. Le sujet ne revient plus.",
      },
      {
        id: "talk",
        label: "Demander une explication franche au coach",
        effects: { chimie: 5, morale: 4 },
        requires: { morale: 40 },
        resultText: "Il te dit exactement ce qu'il attend. Au moins, c'est clair.",
      },
      {
        id: "sulk",
        label: "Le prendre très mal",
        effects: { morale: -6, chimie: -6, skill: 2 },
        resultText: "Tu t'enfermes. L'ambiance se dégrade et le staff le remarque.",
      },
    ],
  },
  {
    id: "split_scrim_leak",
    title: "Fuite de scrims",
    text: "Une de vos stratégies préparées a manifestement fuité chez un rival.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "investigate",
        label: "Chercher la fuite en interne",
        effects: { chimie: -5, morale: -2, skill: 2 },
        resultText: "L'enquête crée un climat de suspicion, mais la fuite se tarit.",
      },
      {
        id: "adapt",
        label: "Changer complètement de plan de jeu",
        effects: { skill: 4, chimie: 4, forme: -4 },
        resultText: "Vous repartez de zéro. Ils préparent un match que vous ne jouerez pas.",
      },
    ],
  },
  {
    id: "split_rivalry",
    title: "Guerre des mots avec un rival",
    text: "Un joueur star de la ligue te provoque ouvertement en interview.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "fire",
        label: "Répondre et enflammer la rivalité",
        effects: { communaute: 9, morale: 3, chimie: -2 },
        resultText: "Le public adore le beef. La revanche sera scrutée.",
      },
      {
        id: "ice",
        label: "Répondre sur la Faille, pas sur Twitter",
        effects: { skill: 4, reputation: 3 },
        resultText: "Tu gardes ton sang-froid et tu prépares ta réponse en jeu.",
      },
    ],
  },
  {
    id: "split_stream_burnout",
    title: "Trop de stream ?",
    text: "Entre entraînement et streams quotidiens, tes journées n'en finissent plus.",
    phases: ["spring", "summer"],
    minAge: 19,
    choices: [
      {
        id: "cut",
        label: "Réduire le stream pour te préserver",
        effects: { forme: 8, morale: 3, communaute: -5 },
        resultText: "Moins de revenus et de visibilité, mais tu retrouves de l'énergie.",
      },
      {
        id: "double",
        label: "Continuer, la communauté d'abord",
        effects: { argent: 6000, communaute: 7, forme: -9 },
        resultText: "Ta chaîne cartonne, mais les cernes s'installent.",
      },
    ],
  },
  {
    id: "split_secret_strat",
    title: "Une stratégie secrète",
    text: "Le coach a préparé une compo surprise pour piéger un rival direct.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "trust",
        label: "Faire confiance au staff et la jouer",
        effects: { chimie: 6, skill: 2, communaute: 3 },
        resultText: "La compo déstabilise l'adversaire. Le coach jubile.",
      },
      {
        id: "doubt",
        label: "Préférer votre jeu habituel",
        effects: { skill: 2, chimie: -3 },
        resultText: "Vous restez sur du connu. Sûr, mais prévisible.",
      },
    ],
  },
  {
    id: "split_family",
    title: "Un appel de la maison",
    text: "Un proche traverse une période difficile et aimerait te voir.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "visit",
        label: "Prendre deux jours pour rentrer",
        effects: { morale: 8, forme: 4, skill: -2, chimie: -2 },
        resultText: "Tu reviens le cœur léger, prêt à te reconcentrer.",
      },
      {
        id: "call",
        label: "Rester, mais appeler tous les soirs",
        effects: { morale: 2, skill: 1 },
        resultText: "Tu gardes le lien à distance sans lâcher la compétition.",
      },
    ],
  },
  {
    id: "split_comeback",
    title: "Remontada improbable",
    text: "Menés 0-2 dans la série, vous arrachez la belle après trois heures de jeu.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "celebrate",
        label: "Célébrer comme il se doit",
        effects: { morale: 8, chimie: 7, communaute: 5, forme: -3 },
        resultText: "La soirée restera dans les annales du roster.",
      },
      {
        id: "review",
        label: "Revoir immédiatement les erreurs des deux premières games",
        effects: { skill: 5, chimie: 2, morale: -2 },
        resultText: "Personne n'a envie, mais vous ne referez pas les mêmes fautes.",
      },
    ],
  },
  {
    id: "split_fan",
    title: "Rencontre avec les fans",
    text: "La structure organise une session de dédicaces après un match à domicile.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "give",
        label: "Rester deux heures de plus avec le public",
        effects: { communaute: 9, morale: 4, forme: -3 },
        resultText: "Les fans repartent conquis. Ta popularité grimpe.",
      },
      {
        id: "quick",
        label: "Faire court pour aller t'entraîner",
        effects: { skill: 3, communaute: -3 },
        resultText: "Efficace, mais quelques fans restent sur leur faim.",
      },
    ],
  },
  {
    id: "split_smurf",
    title: "Un compte smurf qui pose problème",
    text: "Tu joues sur un compte secondaire pour t'entraîner tranquillement. Un streamer l'a repéré et en parle publiquement.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "own",
        label: "Assumer publiquement",
        effects: { communaute: 5, reputation: -2 },
        resultText: "Tu expliques pourquoi. Une partie du public comprend, l'autre te tombe dessus.",
      },
      {
        id: "stop",
        label: "Arrêter et jouer sur ton compte principal",
        effects: { skill: -2, morale: -3, reputation: 3 },
        resultText: "Plus d'échappatoire : chaque partie est scrutée.",
      },
    ],
  },
  {
    id: "split_coach_clash",
    title: "Désaccord tactique avec le coach",
    text: "Il veut jouer autour du haut de carte. Tu es convaincu que la partie se gagne en bas.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "impose",
        label: "Imposer ta lecture",
        effects: { chimie: -4, skill: 3, reputation: 3 },
        requires: { reputation: 55 },
        resultText: "Ton statut te donne raison. Le coach s'incline, sans enthousiasme.",
      },
      {
        id: "follow",
        label: "Suivre le plan du staff",
        effects: { chimie: 6, morale: -2 },
        resultText: "Tu exécutes sans discuter. La cohésion prime.",
      },
      {
        id: "compromise",
        label: "Proposer un plan hybride",
        effects: { chimie: 4, skill: 2 },
        requires: { chimie: 50 },
        resultText: "Vous trouvez un terrain d'entente qui satisfait tout le monde.",
      },
    ],
  },
  {
    id: "split_travel",
    title: "Semaine de déplacements",
    text: "Trois matchs à l'extérieur en cinq jours, avec des trajets à rallonge.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "sleep",
        label: "Dormir dans les transports, récupérer au maximum",
        effects: { forme: 5, skill: -1 },
        resultText: "Tu arrives frais à chaque match. Le reste attendra.",
      },
      {
        id: "vod",
        label: "Bosser les VOD pendant les trajets",
        effects: { skill: 4, forme: -5 },
        resultText: "Tu prépares chaque adversaire dans le train. Efficace mais épuisant.",
      },
    ],
  },
  {
    id: "split_perfect_game",
    title: "Partie parfaite",
    text: "Vous venez de gagner sans concéder une seule mort. La ligue entière en parle.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "humble",
        label: "Minimiser en conférence de presse",
        effects: { reputation: 5, chimie: 4 },
        resultText: "Tu refuses de t'enflammer. Les observateurs saluent la maturité.",
      },
      {
        id: "statement",
        label: "En faire une déclaration d'intention",
        effects: { communaute: 8, reputation: 4, chimie: -2 },
        resultText: "« On est là pour tout gagner. » Le message est reçu par toute la ligue.",
      },
    ],
  },
  {
    id: "split_tiebreak",
    title: "Match décisif pour les playoffs",
    text: "Une seule place reste à prendre, et c'est ce match qui décide.",
    phases: ["spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "calm",
        label: "Aborder le match comme un autre",
        effects: { chimie: 4, skill: 2 },
        resultText: "Routine habituelle, même préparation. Vous jouez sans trembler.",
      },
      {
        id: "hype",
        label: "Mettre l'équipe sous tension positive",
        effects: { morale: 6, chimie: 3, forme: -3 },
        requires: { chimie: 45 },
        resultText: "Tu galvanises le vestiaire avant d'entrer sur scène.",
      },
    ],
  },
];
