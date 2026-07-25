import type { GameEvent } from "@/engine/types";

// Pool d'événements à choix (français). Data-driven : ajouter un événement = pousser
// un objet ici. `phases` restreint l'apparition ; absent = toutes les phases.

export const EVENTS: GameEvent[] = [
  // ─────────────────────────────  PRÉ-SAISON / MERCATO  ─────────────────────────────
  {
    id: "preseason_bootcamp",
    title: "Bootcamp de pré-saison",
    text: "Le staff propose un bootcamp intensif de trois semaines en Corée avant le début du split.",
    phases: ["preseason"],
    weight: 2,
    choices: [
      {
        id: "go",
        label: "Partir au bootcamp, à fond",
        effects: { skill: 6, forme: -4, chimie: 5, morale: -2 },
        resultText: "Les scrims contre les meilleures équipes te font monter en flèche, mais tu rentres épuisé.",
      },
      {
        id: "light",
        label: "Y aller, mais lever le pied",
        effects: { skill: 3, chimie: 3 },
        resultText: "Tu progresses tranquillement sans te cramer. Un compromis raisonnable.",
      },
      {
        id: "stay",
        label: "Rester à la maison pour souffler",
        effects: { forme: 8, morale: 5, chimie: -3, skill: -2 },
        resultText: "Reposé et détendu, mais tu as manqué de précieuses heures de coordination.",
      },
    ],
  },
  {
    id: "preseason_contract",
    title: "Renégociation de contrat",
    text: "Ton agent a décroché une offre de prolongation avec une belle revalorisation salariale.",
    phases: ["preseason"],
    minAge: 18,
    choices: [
      {
        id: "sign",
        label: "Signer, la sécurité avant tout",
        effects: { argent: 15000, morale: 4, reputation: 2 },
        resultText: "Contrat sécurisé. Tu abordes la saison l'esprit tranquille.",
      },
      {
        id: "gamble",
        label: "Attendre une meilleure offre ailleurs",
        effects: { reputation: 4, morale: -3, argent: -2000 },
        resultText: "Pari risqué : tu fais monter la hype autour de toi, mais rien n'est garanti.",
      },
    ],
  },
  {
    id: "preseason_igl",
    title: "Qui portera le shotcall ?",
    text: "L'équipe cherche un leader in-game. Le coach pense à toi.",
    phases: ["preseason"],
    choices: [
      {
        id: "take",
        label: "Endosser le rôle de leader",
        effects: { chimie: 8, reputation: 5, skill: -2, morale: -3 },
        resultText: "Tu prends les rênes. Plus de responsabilités, plus de respect du vestiaire.",
      },
      {
        id: "focus",
        label: "Rester concentré sur ton propre jeu",
        effects: { skill: 4, chimie: -2 },
        resultText: "Tu délègues le leadership et tu peaufines ta mécanique.",
      },
    ],
  },
  {
    id: "preseason_diet",
    title: "Nouveau préparateur physique",
    text: "La structure recrute un préparateur physique et impose un programme sport + sommeil.",
    phases: ["preseason"],
    choices: [
      {
        id: "commit",
        label: "Suivre le programme sérieusement",
        effects: { forme: 12, morale: -2 },
        resultText: "Ton corps te dit merci : tu tiendras mieux la longueur du split.",
      },
      {
        id: "ignore",
        label: "Faire semblant, tu connais ton corps",
        effects: { forme: -3, morale: 3 },
        resultText: "Tu gardes tes habitudes. Le préparateur n'est pas dupe.",
      },
    ],
  },
  {
    id: "preseason_newbie",
    title: "Une jeune recrue prometteuse",
    text: "L'équipe intègre un rookie ultra-talentueux qui joue ton rôle en académie.",
    phases: ["preseason"],
    minAge: 22,
    choices: [
      {
        id: "mentor",
        label: "Le prendre sous ton aile",
        effects: { chimie: 7, morale: 3, reputation: 3 },
        resultText: "Tu deviens une figure de vestiaire respectée. Le staff apprécie.",
      },
      {
        id: "rival",
        label: "Le voir comme une menace et hausser ton niveau",
        effects: { skill: 6, forme: -3, morale: -4 },
        resultText: "La peur du banc te pousse à te dépasser en scrim.",
      },
    ],
  },

  // ─────────────────────────────  EN SPLIT (spring / summer)  ─────────────────────────────
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
        effects: { morale: 7, chimie: 5, skill: -1 },
        resultText: "Une journée pour souffler ensemble ressoude le groupe.",
      },
      {
        id: "media",
        label: "Répondre cash aux haters en interview",
        effects: { reputation: 4, morale: 3, chimie: -3 },
        resultText: "Ta punchline devient virale. Le public adore, le staff un peu moins.",
      },
    ],
  },
  {
    id: "split_highlight",
    title: "Un highlight de folie",
    text: "Tu réalises un outplay en 1v3 qui fait le tour du monde. Le clip explose.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "ride",
        label: "Surfer sur la hype en stream",
        effects: { reputation: 9, argent: 4000, forme: -3 },
        resultText: "Tes viewers explosent. Ta cote grimpe autant que ta fatigue.",
      },
      {
        id: "humble",
        label: "Rester humble et créditer l'équipe",
        effects: { chimie: 7, morale: 4, reputation: 3 },
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
        effects: { chimie: -8, morale: 4, reputation: 2 },
        resultText: "Le clash fuite sur Twitter. Ambiance électrique.",
      },
    ],
  },
  {
    id: "split_meta",
    title: "Un patch bouleverse la méta",
    text: "Le nouveau patch nerf ton champion de prédilection. Tout est à repenser.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "adapt",
        label: "Maîtriser les nouveaux picks forts",
        effects: { skill: 6, forme: -3 },
        resultText: "Tu t'adaptes vite et prends de l'avance sur la concurrence.",
      },
      {
        id: "onetrick",
        label: "Continuer à forcer ton main",
        effects: { skill: -3, morale: 3, reputation: 2 },
        resultText: "Tu t'accroches à ton identité de jeu, au risque d'être puni en draft.",
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
        effects: { argent: 12000, reputation: 5, forme: -2 },
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
    id: "split_toxic",
    title: "Dérapage en SoloQ",
    text: "Un de tes messages toxiques en ranked est capturé et partagé.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "apologize",
        label: "Présenter des excuses publiques",
        effects: { reputation: -2, morale: -2, chimie: 3 },
        resultText: "Tu assumes et tu t'excuses. L'orage passe vite.",
      },
      {
        id: "deny",
        label: "Minimiser et passer à autre chose",
        effects: { reputation: -6, morale: 1 },
        resultText: "Ton silence agace. Le sujet traîne quelques jours.",
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
        effects: { reputation: 7, morale: 4, forme: -3 },
        resultText: "Les fans repartent conquis. Ta popularité grimpe.",
      },
      {
        id: "quick",
        label: "Faire court pour aller t'entraîner",
        effects: { skill: 3, reputation: -2 },
        resultText: "Efficace, mais quelques fans restent sur leur faim.",
      },
    ],
  },
  {
    id: "split_shotcall_win",
    title: "Le call de la saison",
    text: "En plein Baron, tu proposes un call osé qui peut tout faire basculer.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "bold",
        label: "Tenter le play héroïque",
        effects: { skill: 4, reputation: 6, chimie: 4 },
        resultText: "Ça passe ! Un teamfight parfait, l'équipe est galvanisée.",
      },
      {
        id: "safe",
        label: "Jouer la sécurité et temporiser",
        effects: { chimie: 3, morale: 1 },
        resultText: "Choix prudent : vous gardez le contrôle sans prendre de risque.",
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
        effects: { forme: 8, morale: 3, argent: -3000 },
        resultText: "Moins de revenus, mais tu retrouves de l'énergie compétitive.",
      },
      {
        id: "double",
        label: "Continuer, la communauté d'abord",
        effects: { argent: 6000, reputation: 4, forme: -9 },
        resultText: "Ta chaîne cartonne, mais les cernes s'installent.",
      },
    ],
  },
  {
    id: "split_scrim_secret",
    title: "Une stratégie secrète",
    text: "Le coach a préparé une compo surprise pour piéger un rival direct.",
    phases: ["spring", "summer"],
    choices: [
      {
        id: "trust",
        label: "Faire confiance au staff et la jouer",
        effects: { chimie: 6, skill: 2, reputation: 3 },
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

  // ─────────────────────────────  INTERNATIONAL (MSI / Worlds)  ─────────────────────────────
  {
    id: "intl_pressure",
    title: "La scène mondiale",
    text: "Premiers pas sur la scène internationale. Les projecteurs sont braqués sur toi.",
    phases: ["msi", "worlds"],
    weight: 2,
    choices: [
      {
        id: "embrace",
        label: "Savourer le moment",
        effects: { morale: 6, reputation: 6, skill: 2 },
        resultText: "Tu joues libéré. L'ambiance de l'arène te transcende.",
      },
      {
        id: "tunnel",
        label: "Te mettre en bulle, tunnel vision",
        effects: { skill: 5, morale: -3, chimie: -2 },
        resultText: "Concentration maximale, au prix d'un peu d'isolement.",
      },
    ],
  },
  {
    id: "intl_scout",
    title: "Les scouts observent",
    text: "Des recruteurs de grandes ligues sont dans les gradins, carnet à la main.",
    phases: ["msi", "worlds"],
    choices: [
      {
        id: "showcase",
        label: "En faire des caisses pour te montrer",
        effects: { reputation: 8, chimie: -4, skill: 1 },
        resultText: "Tu forces les highlights. Les scouts te remarquent, l'équipe moins ravie.",
      },
      {
        id: "team",
        label: "Jouer pour l'équipe avant tout",
        effects: { chimie: 6, reputation: 3 },
        resultText: "Ton jeu collectif impressionne les analystes avertis.",
      },
    ],
  },
  {
    id: "intl_jetlag",
    title: "Décalage horaire",
    text: "Le voyage à l'autre bout du monde a chamboulé ton sommeil avant un match clé.",
    phases: ["msi", "worlds"],
    choices: [
      {
        id: "adapt",
        label: "Forcer l'adaptation avec le staff",
        effects: { forme: 5, skill: 1 },
        resultText: "Protocole lumière + sieste : tu récupères juste à temps.",
      },
      {
        id: "coffee",
        label: "Tenir à la caféine",
        effects: { forme: -6, skill: 2, morale: -2 },
        resultText: "Tu tiens le coup sur le moment, mais la dette de sommeil s'accumule.",
      },
    ],
  },
  {
    id: "intl_press",
    title: "Conférence de presse mondiale",
    text: "Un journaliste te demande si ton équipe peut vraiment battre les favoris.",
    phases: ["msi", "worlds"],
    choices: [
      {
        id: "confident",
        label: "Afficher une confiance totale",
        effects: { reputation: 6, morale: 4, chimie: -2 },
        resultText: "Ta déclaration fait les gros titres et met la pression sur l'adversaire.",
      },
      {
        id: "modest",
        label: "Rester mesuré et respectueux",
        effects: { chimie: 3, morale: 2 },
        resultText: "Une réponse posée, appréciée du milieu.",
      },
    ],
  },

  // ─────────────────────────────  GÉNÉRIQUES (toutes phases)  ─────────────────────────────
  {
    id: "gen_invest",
    title: "Placement financier",
    text: "Un ami te propose d'investir tes primes dans sa start-up esport.",
    choices: [
      {
        id: "invest",
        label: "Investir une partie de tes gains",
        effects: { argent: -8000, reputation: 3 },
        resultText: "Pari sur l'avenir. On verra bien ce que ça donne.",
      },
      {
        id: "save",
        label: "Garder ton argent au chaud",
        effects: { argent: 2000, morale: 1 },
        resultText: "Prudence. Tu préfères la sécurité.",
      },
    ],
  },
  {
    id: "gen_charity",
    title: "Événement caritatif",
    text: "On te propose de participer à un tournoi caritatif diffusé en direct.",
    choices: [
      {
        id: "join",
        label: "Participer avec le sourire",
        effects: { reputation: 6, morale: 4, forme: -2 },
        resultText: "Beau geste, très bien perçu par la communauté.",
      },
      {
        id: "skip",
        label: "Décliner pour te reposer",
        effects: { forme: 4, reputation: -2 },
        resultText: "Tu privilégies ta récupération.",
      },
    ],
  },
  {
    id: "gen_doc",
    title: "Un documentaire sur toi",
    text: "Un média veut réaliser un mini-documentaire sur ton parcours.",
    minAge: 20,
    choices: [
      {
        id: "yes",
        label: "Accepter et t'ouvrir à la caméra",
        effects: { reputation: 8, morale: 3, forme: -3 },
        resultText: "Le doc touche les fans. Ton histoire inspire.",
      },
      {
        id: "no",
        label: "Refuser, tu préserves ta vie privée",
        effects: { morale: 2, forme: 2 },
        resultText: "Tu gardes ton intimité loin des caméras.",
      },
    ],
  },
  {
    id: "gen_mentor_young",
    title: "Message d'un jeune fan",
    text: "Un ado t'écrit que tu es sa raison de croire en ses rêves d'esport.",
    choices: [
      {
        id: "reply",
        label: "Prendre le temps de lui répondre",
        effects: { morale: 6, reputation: 3 },
        resultText: "Un moment simple qui te rappelle pourquoi tu joues.",
      },
      {
        id: "ignore",
        label: "Passer, tu es débordé",
        effects: { skill: 1, morale: -2 },
        resultText: "Tu restes concentré sur ta routine.",
      },
    ],
  },
  {
    id: "gen_burnout_signs",
    title: "Signes d'épuisement",
    text: "Tu ressens moins de plaisir à jouer ces derniers temps. Un signal à ne pas ignorer.",
    minAge: 21,
    choices: [
      {
        id: "psy",
        label: "Consulter le psychologue de l'équipe",
        effects: { morale: 8, forme: 5, skill: -1 },
        resultText: "Parler fait un bien fou. Tu retrouves peu à peu la flamme.",
      },
      {
        id: "ignore",
        label: "Serrer les dents, ça va passer",
        effects: { morale: -6, forme: -4, skill: 2 },
        resultText: "Tu enfouis la fatigue. Elle ne disparaît pas pour autant.",
      },
    ],
  },
  {
    id: "gen_rivalry",
    title: "Guerre des mots avec un rival",
    text: "Un joueur star de la ligue te provoque ouvertement en interview.",
    choices: [
      {
        id: "fire",
        label: "Répondre et enflammer la rivalité",
        effects: { reputation: 7, morale: 3, chimie: -2 },
        resultText: "Le public adore le beef. La revanche sera scrutée.",
      },
      {
        id: "ice",
        label: "Répondre sur le serveur, pas sur Twitter",
        effects: { skill: 4, reputation: 2 },
        resultText: "Tu gardes ton sang-froid et tu prépares ta réponse en jeu.",
      },
    ],
  },
];

export function getEventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
