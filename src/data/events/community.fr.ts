import type { GameEvent } from "@/engine/types";

// Ladder SoloQ et tribunal de la communauté. Personne ne regarde un footballeur
// s'entraîner ; en esport ton classement est public et chaque partie est jugée.

export const COMMUNITY_EVENTS: GameEvent[] = [
  {
    id: "com_clip_viral",
    title: "Un clip devient viral",
    text: "Un outplay de ta SoloQ d'hier soir tourne partout. Trois millions de vues en deux jours.",
    weight: 2,
    choices: [
      {
        id: "ride",
        label: "Enchaîner avec du contenu tant que c'est chaud",
        effects: { communaute: 12, argent: 6000, forme: -5 },
        resultText: "Tu capitalises à fond. Ta chaîne double d'audience en une semaine.",
      },
      {
        id: "ignore",
        label: "Laisser passer, tu as un match à préparer",
        effects: { skill: 4, communaute: 3 },
        resultText: "Le clip vit sa vie sans toi. Ton coach approuve.",
      },
    ],
  },
  {
    id: "com_meme",
    title: "Tu deviens un meme",
    text: "Une erreur ridicule en plein match officiel est devenue le meme de la semaine. Ton nom est un verbe maintenant.",
    weight: 2,
    choices: [
      {
        id: "selfmock",
        label: "En rire le premier",
        effects: { communaute: 10, morale: 3 },
        resultText: "Tu postes le meme toi-même avec une légende parfaite. Le public t'adopte.",
      },
      {
        id: "silence",
        label: "Faire le dos rond",
        effects: { morale: -5, communaute: -3, skill: 3 },
        resultText: "Tu encaisses en silence et tu mets tout dans l'entraînement.",
      },
      {
        id: "angry",
        label: "T'énerver publiquement",
        effects: { communaute: -8, morale: -3 },
        resultText: "Ta réaction devient un meme encore plus gros que le premier. Erreur.",
      },
    ],
  },
  {
    id: "com_reddit_thread",
    title: "Le thread Reddit de trop",
    text: "Un post détaillant « pourquoi tu es le maillon faible » atteint la première page. Les statistiques citées ne sont pas fausses.",
    weight: 2,
    choices: [
      {
        id: "answer",
        label: "Répondre point par point dans les commentaires",
        effects: { communaute: 6, reputation: 3, morale: -3 },
        requires: { morale: 45 },
        resultText: "Ta réponse argumentée retourne une partie du fil. Le respect revient.",
      },
      {
        id: "work",
        label: "Corriger concrètement ce qu'on te reproche",
        effects: { skill: 6, forme: -4, morale: -2 },
        resultText: "Tu bosses exactement les points cités. Dans un mois, le thread sera obsolète.",
      },
      {
        id: "offline",
        label: "Te déconnecter complètement des réseaux",
        effects: { morale: 7, communaute: -5 },
        resultText: "Tu supprimes les applis de ton téléphone. Le calme revient.",
      },
    ],
  },
  {
    id: "com_ladder_rank1",
    title: "Course au rank 1",
    text: "Tu es à quelques centaines de points de la première place du ladder européen. Ce serait une vitrine énorme.",
    weight: 2,
    choices: [
      {
        id: "push",
        label: "Enchaîner les nuits blanches pour l'atteindre",
        effects: { communaute: 10, skill: 4, forme: -10 },
        requires: { forme: 40 },
        resultText: "Rank 1 européen. Tout le milieu en parle — et tu dors quatre heures par nuit.",
      },
      {
        id: "stop",
        label: "T'arrêter là, la compétition passe avant",
        effects: { forme: 5, morale: 3 },
        resultText: "Le ladder n'est pas ce qui remplit les vitrines. Tu passes à autre chose.",
      },
    ],
  },
  {
    id: "com_toxic_logs",
    title: "Tes logs de chat fuitent",
    text: "Des messages agressifs envoyés en SoloQ il y a des mois refont surface. Riot regarde le dossier.",
    weight: 2,
    choices: [
      {
        id: "apologize",
        label: "Excuses publiques et sincères",
        effects: { communaute: -3, reputation: -2, morale: -3, chimie: 3 },
        resultText: "Tu assumes sans chercher d'excuse. L'orage passe en quelques jours.",
      },
      {
        id: "context",
        label: "Expliquer le contexte",
        effects: { communaute: -6, morale: 2 },
        resultText: "Personne n'a envie d'entendre le contexte. Ça envenime les choses.",
      },
      {
        id: "quiet",
        label: "Laisser le community manager gérer",
        effects: { communaute: -4, chimie: -2 },
        resultText: "Un communiqué tiède est publié. Le sujet s'éteint doucement.",
      },
    ],
  },
  {
    id: "com_charity",
    title: "Tournoi caritatif",
    text: "On te propose de participer à un événement caritatif diffusé en direct.",
    choices: [
      {
        id: "join",
        label: "Participer avec le sourire",
        effects: { communaute: 8, morale: 4, forme: -2 },
        resultText: "Beau geste, très bien perçu par la communauté.",
      },
      {
        id: "skip",
        label: "Décliner pour te reposer",
        effects: { forme: 4, communaute: -3 },
        resultText: "Tu privilégies ta récupération.",
      },
    ],
  },
  {
    id: "com_doc",
    title: "Un documentaire sur toi",
    text: "Un média veut réaliser un mini-documentaire sur ton parcours.",
    minAge: 20,
    choices: [
      {
        id: "yes",
        label: "Accepter et t'ouvrir à la caméra",
        effects: { communaute: 11, reputation: 4, forme: -3 },
        resultText: "Le doc touche les fans. Ton histoire inspire.",
      },
      {
        id: "no",
        label: "Refuser, tu préserves ta vie privée",
        effects: { morale: 3, forme: 2 },
        resultText: "Tu gardes ton intimité loin des caméras.",
      },
    ],
  },
  {
    id: "com_young_fan",
    title: "Message d'un jeune fan",
    text: "Un ado t'écrit que tu es sa raison de croire en ses rêves d'esport.",
    choices: [
      {
        id: "reply",
        label: "Prendre le temps de lui répondre",
        effects: { morale: 6, communaute: 4 },
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
    id: "com_cocreator",
    title: "Collaboration avec un gros créateur",
    text: "Un streamer à un million d'abonnés te propose une série de vidéos ensemble.",
    choices: [
      {
        id: "collab",
        label: "Accepter la collaboration",
        effects: { communaute: 12, argent: 8000, forme: -5, chimie: -2 },
        resultText: "L'exposition est massive. Tu touches un public qui ne regardait pas la ligue.",
      },
      {
        id: "later",
        label: "Reporter à l'intersaison",
        effects: { forme: 3, skill: 2 },
        resultText: "Tu gardes la tête dans la compétition. L'offre tiendra.",
      },
    ],
  },
  {
    id: "com_hate_wave",
    title: "Vague de haine après une défaite",
    text: "Ton compte est inondé de messages d'insultes après ton erreur en fin de match.",
    weight: 2,
    choices: [
      {
        id: "block",
        label: "Bloquer, filtrer et continuer",
        effects: { morale: 3, communaute: -2 },
        resultText: "Tu nettoies tes mentions et tu passes à autre chose. Solution saine.",
      },
      {
        id: "speak",
        label: "Parler publiquement de la santé mentale des joueurs",
        effects: { communaute: 9, reputation: 5, morale: 4 },
        requires: { morale: 40 },
        resultText: "Ton message est repris partout. Plusieurs joueurs te remercient en privé.",
      },
      {
        id: "internalize",
        label: "Encaisser en silence",
        effects: { morale: -9, skill: 3 },
        resultText: "Tu lis tout, jusqu'au dernier message. Ça laisse des traces.",
      },
    ],
  },
];
