import type { ClutchMoment } from "@/engine/types";

// Moments décisifs : les finales, le MSI et les Worlds ne se simulent plus tout
// seuls. Deux temps — la draft, puis un call en jeu — où le joueur tranche.
// `perfDelta` modifie la performance sur le match ; `risk` transforme le choix
// en pari (tirage seedé, donc reproductible).

export const DRAFT_MOMENTS: ClutchMoment[] = [
  {
    id: "draft_pocket",
    kind: "draft",
    title: "Phase de bans — ton pocket pick est ouvert",
    text: "Dernier ban adverse passé : ils ont laissé ton pocket pick libre. Le sortir maintenant, c'est prendre l'avantage sur cette game — mais ils l'auront vu et le banniront pour le reste de la série.",
    weight: 2,
    choices: [
      {
        id: "take",
        label: "Le prendre tout de suite",
        effects: { communaute: 3 },
        perfDelta: 4,
        resultText: "Tu le verrouilles. Le casteur hurle, le public se lève. Ils savent maintenant à quoi s'attendre.",
      },
      {
        id: "hide",
        label: "Le cacher pour plus tard dans le Bo5",
        effects: { chimie: 2 },
        perfDelta: 1,
        resultText: "Tu joues un pick standard. Ta carte maîtresse reste dans ta manche.",
      },
      {
        id: "bait",
        label: "Faire semblant de le viser pour les piéger",
        effects: {},
        requires: { chimie: 55 },
        risk: {
          chance: 0.55,
          success: { perfDelta: 5, effects: { chimie: 4, communaute: 5 }, text: "Ils mordent et gaspillent un ban. Ton coach t'applaudit debout." },
          failure: { perfDelta: -3, effects: { morale: -4 }, text: "Ils ne tombent pas dans le panneau et te contrent proprement. Draft perdue." },
        },
        resultText: "",
      },
    ],
  },
  {
    id: "draft_firstpick",
    kind: "draft",
    title: "Premier pick de la série",
    text: "Vous avez le premier choix. Sécuriser un pick fort mais lisible, ou tenter un pick flexible qui masque vos intentions ?",
    choices: [
      {
        id: "safe",
        label: "Le pick le plus fort du patch",
        effects: {},
        perfDelta: 2,
        resultText: "Valeur sûre. Personne ne pourra dire que la draft était le problème.",
      },
      {
        id: "flex",
        label: "Un pick flexible pour cacher ta ligne",
        effects: { chimie: 3 },
        perfDelta: 2,
        requires: { chimie: 50 },
        resultText: "Ton pick peut aller sur deux postes. L'adversaire doit deviner — et il devine mal.",
      },
      {
        id: "counter",
        label: "Laisser passer pour contre-pick",
        effects: {},
        risk: {
          chance: 0.5,
          success: { perfDelta: 4, effects: { skill: 2 }, text: "Ils s'engagent en premier et tu les punis avec le contre parfait." },
          failure: { perfDelta: -4, effects: { morale: -3 }, text: "Ils prennent exactement ce que tu voulais. Tu joues la game en retard." },
        },
        resultText: "",
      },
    ],
  },
  {
    id: "draft_comfort",
    kind: "draft",
    title: "Le coach veut te sortir de ta zone de confort",
    text: "Le staff a préparé un pick que tu n'as jamais joué en match officiel, mais qui est parfait contre leur composition.",
    choices: [
      {
        id: "trust",
        label: "Faire confiance au staff",
        effects: { chimie: 5 },
        risk: {
          chance: 0.6,
          success: { perfDelta: 4, effects: { skill: 3, communaute: 4 }, text: "Tu le joues comme si tu l'avais toujours joué. Le staff exulte." },
          failure: { perfDelta: -4, effects: { morale: -5 }, text: "Trop peu de reps. Tu rates deux sorts décisifs et ça se voit." },
        },
        resultText: "",
      },
      {
        id: "refuse",
        label: "Refuser et rester sur ton pool",
        effects: { chimie: -4 },
        perfDelta: 2,
        resultText: "Tu joues ce que tu maîtrises. Le coach serre les dents mais accepte.",
      },
    ],
  },
  {
    id: "draft_banned_out",
    kind: "draft",
    title: "Ils bannissent tout ton pool",
    text: "Trois bans consécutifs dirigés contre toi. Ils ont fait leurs devoirs et refusent de te laisser ta zone de confort.",
    weight: 2,
    choices: [
      {
        id: "adapt",
        label: "Sortir un pick inattendu",
        effects: {},
        requires: { skill: 62 },
        perfDelta: 3,
        resultText: "Tu sors quelque chose que personne n'avait préparé. Le public n'en revient pas.",
      },
      {
        id: "fill",
        label: "Prendre un pick neutre et jouer collectif",
        effects: { chimie: 5 },
        perfDelta: 1,
        resultText: "Tu t'effaces au profit de l'équipe. Ce ne sera pas ton match, mais ça peut suffire.",
      },
    ],
  },
  {
    id: "draft_teamcomp",
    kind: "draft",
    title: "Quelle identité pour cette composition ?",
    text: "Deux directions s'offrent à vous pour le dernier pick : une composition qui veut tout faire exploser avant 20 minutes, ou une qui mise sur la fin de partie.",
    choices: [
      {
        id: "early",
        label: "Composition agressive early game",
        effects: {},
        perfDelta: 2,
        resultText: "Vous partez pour étouffer la partie dès les premières minutes.",
      },
      {
        id: "late",
        label: "Composition scaling",
        effects: {},
        risk: {
          chance: 0.55,
          success: { perfDelta: 5, effects: { chimie: 3 }, text: "Vous survivez à la tempête et vous déroulez en fin de partie." },
          failure: { perfDelta: -4, effects: { morale: -3 }, text: "Vous n'atteignez jamais votre fenêtre. Étouffés avant de pouvoir jouer." },
        },
        resultText: "",
      },
    ],
  },
];

export const CALL_MOMENTS: ClutchMoment[] = [
  {
    id: "call_baron",
    kind: "call",
    title: "Baron à 45 secondes",
    text: "Vous menez de 2 000 golds. Le Baron réapparaît dans 45 secondes et quatre adversaires sont visibles sur la carte. Le cinquième — leur carry — est introuvable.",
    weight: 2,
    choices: [
      {
        id: "engage",
        label: "Engager le combat maintenant, à 5 contre 4",
        effects: {},
        risk: {
          chance: 0.55,
          success: { perfDelta: 6, effects: { communaute: 6, chimie: 4 }, text: "Vous les surprenez et vous les balayez. Baron gratuit, partie pliée." },
          failure: { perfDelta: -5, effects: { morale: -6 }, text: "Leur carry sortait d'un buisson. Vous perdez le combat et le Baron." },
        },
        resultText: "",
      },
      {
        id: "vision",
        label: "Poser la vision et temporiser",
        effects: { chimie: 3 },
        perfDelta: 2,
        resultText: "Vous sécurisez la zone avant de vous engager. Lent, mais propre.",
      },
      {
        id: "split",
        label: "Envoyer un split-push pour créer la pression",
        effects: {},
        requires: { forme: 50 },
        perfDelta: 2,
        resultText: "Pendant qu'ils regardent le Baron, une tourelle tombe de l'autre côté de la carte.",
      },
    ],
  },
  {
    id: "call_dragon_soul",
    kind: "call",
    title: "Âme du dragon en jeu",
    text: "Le quatrième dragon arrive. Le prendre vous donne l'âme et sans doute la partie — mais ils sont positionnés et vous attendent.",
    weight: 2,
    choices: [
      {
        id: "force",
        label: "Forcer le dragon",
        effects: {},
        risk: {
          chance: 0.5,
          success: { perfDelta: 6, effects: { communaute: 5 }, text: "Vous volez l'âme sous leur nez. L'arène explose." },
          failure: { perfDelta: -4, effects: { morale: -5, chimie: -3 }, text: "Combat perdu dans la fosse. Ils prennent l'âme et l'ascendant." },
        },
        resultText: "",
      },
      {
        id: "trade",
        label: "Échanger contre les tourelles du côté opposé",
        effects: { chimie: 4 },
        perfDelta: 2,
        resultText: "Vous leur laissez l'âme et vous prenez la carte. Un échange assumé.",
      },
      {
        id: "reset",
        label: "Reset et rejouer la carte proprement",
        effects: { forme: 2 },
        perfDelta: 1,
        resultText: "Vous refusez le combat. La partie s'allonge, mais rien n'est perdu.",
      },
    ],
  },
  {
    id: "call_throw",
    kind: "call",
    title: "Vous êtes en train de tout perdre",
    text: "Vous meniez largement. Deux combats ratés plus tard, ils sont à vos portes et le nexus est exposé. Il reste une inhibitrice.",
    weight: 2,
    choices: [
      {
        id: "rally",
        label: "Prendre la parole et remobiliser l'équipe",
        effects: { chimie: 6, morale: 3 },
        requires: { morale: 45 },
        perfDelta: 3,
        resultText: "Tu poses ta voix dans le vocal. Le calme revient, la défense tient.",
      },
      {
        id: "hero",
        label: "Tenter un play héroïque en solo",
        effects: {},
        risk: {
          chance: 0.4,
          success: { perfDelta: 6, effects: { communaute: 10, reputation: 5 }, text: "Un 1v3 défensif d'anthologie. Le clip tournera pendant des années." },
          failure: { perfDelta: -6, effects: { morale: -7, communaute: -4 }, text: "Tu meurs seul, inutilement. Le clip tournera aussi — pas pour les bonnes raisons." },
        },
        resultText: "",
      },
      {
        id: "defend",
        label: "Défendre passivement et attendre la faute",
        effects: {},
        perfDelta: 1,
        resultText: "Vous jouez la montre sous la tourelle en espérant une erreur.",
      },
    ],
  },
  {
    id: "call_game5",
    kind: "call",
    title: "Game 5, dernière partie",
    text: "2-2. Tout se joue maintenant. Le vestiaire est silencieux, les mains tremblent un peu.",
    stages: ["msi", "worlds"],
    weight: 3,
    choices: [
      {
        id: "focus",
        label: "Te mettre en bulle et jouer ton match",
        effects: { skill: 2 },
        perfDelta: 2,
        resultText: "Tu coupes tout. Il n'y a plus que l'écran et tes cinq touches.",
      },
      {
        id: "lead",
        label: "Prendre le shotcall sur tes épaules",
        effects: { chimie: 5 },
        requires: { morale: 55, chimie: 55 },
        perfDelta: 4,
        resultText: "Tu prends la main sur le vocal. L'équipe te suit sans discuter.",
      },
      {
        id: "crowd",
        label: "Aller chercher le public pour te transcender",
        effects: { communaute: 8, morale: 4 },
        perfDelta: 2,
        resultText: "Tu lèves les bras avant même le début. L'arène répond. Tu joues porté.",
      },
    ],
  },
  {
    id: "call_early_invade",
    kind: "call",
    title: "Invade au niveau 1",
    text: "Le coach propose un invade dès l'apparition. Gros gain potentiel, mais si leur vision vous voit venir, vous démarrez la partie en retard.",
    choices: [
      {
        id: "go",
        label: "Y aller à cinq",
        effects: {},
        risk: {
          chance: 0.5,
          success: { perfDelta: 4, effects: { chimie: 5, communaute: 4 }, text: "Premier sang gratuit et leur jungler décalé. Départ parfait." },
          failure: { perfDelta: -4, effects: { chimie: -3 }, text: "Ils vous attendaient. Vous perdez deux joueurs et tout le tempo." },
        },
        resultText: "",
      },
      {
        id: "standard",
        label: "Départ standard, poser la vision",
        effects: { chimie: 2 },
        perfDelta: 1,
        resultText: "Vous jouez sobrement. Pas de risque, pas de cadeau.",
      },
    ],
  },
  {
    id: "call_tilt",
    kind: "call",
    title: "Ton coéquipier craque",
    text: "Votre ADC vient d'enchaîner deux morts évitables et il commence à s'énerver dans le vocal, en pleine série.",
    choices: [
      {
        id: "support",
        label: "Le rassurer et rejouer autour de lui",
        effects: { chimie: 7, morale: 2 },
        perfDelta: 2,
        resultText: "Tu le remets dans la partie. Il réussit le combat suivant.",
      },
      {
        id: "takeover",
        label: "Prendre les ressources et porter l'équipe",
        effects: { reputation: 4, chimie: -4 },
        requires: { skill: 68 },
        perfDelta: 3,
        resultText: "Tu prends tout sur toi. Ça passe, mais il ne te le pardonnera pas tout de suite.",
      },
      {
        id: "mute",
        label: "Couper le vocal et jouer ta partie",
        effects: { chimie: -6, morale: 2 },
        perfDelta: 1,
        resultText: "Silence radio. Tu joues seul, l'équipe aussi.",
      },
    ],
  },
  {
    id: "call_stall",
    kind: "call",
    title: "Partie qui s'éternise",
    text: "50 minutes. Personne n'ose engager. Les nerfs lâchent avant les nexus.",
    choices: [
      {
        id: "patient",
        label: "Rester patient et attendre l'erreur",
        effects: { forme: -3 },
        requires: { forme: 40 },
        perfDelta: 2,
        resultText: "Tu tiens mentalement plus longtemps qu'eux. Ils craquent en premier.",
      },
      {
        id: "pick",
        label: "Chercher un pick isolé",
        effects: {},
        risk: {
          chance: 0.55,
          success: { perfDelta: 5, effects: { communaute: 4 }, text: "Tu attrapes leur support hors position. La partie se termine dans la foulée." },
          failure: { perfDelta: -4, effects: { morale: -4 }, text: "Tu te fais attraper toi. À ce stade, une mort suffit à tout perdre." },
        },
        resultText: "",
      },
    ],
  },

  // ─── Moments propres à chaque poste ───
  {
    id: "call_top_teleport",
    kind: "call",
    title: "Téléportation : le call du Top laner",
    text: "Un combat éclate en bas de carte. Tu as ta téléportation et une vague qui va tomber sur leur tourelle.",
    roles: ["Top"],
    choices: [
      {
        id: "tp",
        label: "Téléporter pour sauver le combat",
        effects: { chimie: 5 },
        perfDelta: 2,
        resultText: "Tu arrives à trois contre cinq et tu renverses l'échange.",
      },
      {
        id: "push",
        label: "Ignorer et prendre la tourelle",
        effects: { chimie: -3 },
        perfDelta: 3,
        requires: { skill: 60 },
        resultText: "Ils perdent le combat, tu prends deux tourelles. Sur le papier, tu as gagné l'échange.",
      },
    ],
  },
  {
    id: "call_jgl_steal",
    kind: "call",
    title: "Le smite de la vie",
    text: "Baron à 800 points de vie, ton équipe est morte. Tu es seul dans un buisson, ton smite est prêt.",
    roles: ["Jungle"],
    choices: [
      {
        id: "steal",
        label: "Tenter le vol",
        effects: {},
        risk: {
          chance: 0.45,
          success: { perfDelta: 7, effects: { communaute: 12, reputation: 6 }, text: "VOLÉ ! L'arène devient folle. Ce smite passera en boucle pendant des années." },
          failure: { perfDelta: -4, effects: { morale: -5 }, text: "Trop tard d'une demi-seconde. Tu meurs dans la fosse, ils ont le Baron." },
        },
        resultText: "",
      },
      {
        id: "leave",
        label: "Reculer et préparer la défense",
        effects: { chimie: 3 },
        perfDelta: 1,
        resultText: "Tu renonces au vol et tu vas défendre. Sage, mais frustrant.",
      },
    ],
  },
  {
    id: "call_mid_roam",
    kind: "call",
    title: "Rotation décisive du midlaner",
    text: "Ta ligne est poussée. Tu peux partir aider en haut, ou rester pour prendre l'avantage de niveau.",
    roles: ["Mid"],
    choices: [
      {
        id: "roam",
        label: "Partir créer l'avantage ailleurs",
        effects: { chimie: 6 },
        perfDelta: 2,
        resultText: "Ton arrivée fait basculer le haut de carte. Ton top laner te doit une bière.",
      },
      {
        id: "farm",
        label: "Rester et prendre ton avance",
        effects: { skill: 2 },
        perfDelta: 2,
        resultText: "Tu prends deux niveaux d'avance et tu deviens intouchable en ligne.",
      },
    ],
  },
  {
    id: "call_adc_position",
    kind: "call",
    title: "Positionnement du carry",
    text: "Combat décisif imminent. Tu es la principale source de dégâts, mais aussi la cible numéro un.",
    roles: ["ADC"],
    choices: [
      {
        id: "safe",
        label: "Jouer très en retrait",
        effects: {},
        perfDelta: 2,
        resultText: "Tu survis à tous les combats. Tes dégâts sont là quand il le faut.",
      },
      {
        id: "aggressive",
        label: "Avancer pour maximiser tes dégâts",
        effects: {},
        requires: { forme: 55 },
        risk: {
          chance: 0.55,
          success: { perfDelta: 6, effects: { communaute: 6 }, text: "Positionnement parfait au millimètre. Tu efface leur équipe entière." },
          failure: { perfDelta: -4, effects: { morale: -4 }, text: "Un pas de trop. Tu te fais assassiner avant d'avoir touché quoi que ce soit." },
        },
        resultText: "",
      },
    ],
  },
  {
    id: "call_sup_engage",
    kind: "call",
    title: "L'engage du support",
    text: "Tu vois une ouverture sur leur carry. Si tu engages, ton équipe doit suivre immédiatement — sinon tu meurs pour rien.",
    roles: ["Support"],
    choices: [
      {
        id: "engage",
        label: "Engager sans prévenir",
        effects: {},
        risk: {
          chance: 0.5,
          success: { perfDelta: 6, effects: { communaute: 7, chimie: 3 }, text: "Ils suivent d'instinct. Leur carry meurt en trois secondes." },
          failure: { perfDelta: -5, effects: { chimie: -6, morale: -4 }, text: "Personne ne suit. Tu meurs seul et l'équipe te le fait savoir." },
        },
        resultText: "",
      },
      {
        id: "callit",
        label: "Annoncer l'engage et attendre le go",
        effects: { chimie: 5 },
        requires: { chimie: 50 },
        perfDelta: 3,
        resultText: "Tu annonces, ils confirment, vous partez ensemble. Manuel de l'engage parfait.",
      },
      {
        id: "peel",
        label: "Rester protéger ton carry",
        effects: { chimie: 3 },
        perfDelta: 2,
        resultText: "Tu gardes ton ADC en vie tout le combat. Moins spectaculaire, tout aussi efficace.",
      },
    ],
  },
];

export const CLUTCH_MOMENTS: ClutchMoment[] = [...DRAFT_MOMENTS, ...CALL_MOMENTS];

export function getClutchMoment(id: string): ClutchMoment | undefined {
  return CLUTCH_MOMENTS.find((c) => c.id === id);
}
