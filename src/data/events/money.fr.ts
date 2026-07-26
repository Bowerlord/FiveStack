import type { GameEvent } from "@/engine/types";

// À quoi sert l'argent ? À acheter ce que ton club ne te donne pas. Un coach
// personnel, un kiné à plein temps, un appartement à dix minutes du gaming
// house : les vrais joueurs pros paient ça de leur poche.
//
// Le choix est toujours le même en substance — convertir ton argent en
// performance, ou le garder. Un magot compte jusqu'à 5 points dans le score
// final : dépenser n'est pas gratuit, c'est un arbitrage.

export const MONEY_EVENTS: GameEvent[] = [
  {
    id: "money_coach",
    title: "Un coach personnel te propose ses services",
    text: "Un ancien joueur devenu coach individuel te contacte. Il ne travaille qu'avec quatre joueurs, tous en ligue majeure. Ses tarifs sont ceux d'un salaire annuel de régionale.",
    phases: ["preseason"],
    minSeason: 2,
    weight: 2,
    choices: [
      {
        id: "hire",
        label: "L'engager pour la saison (80 000 €)",
        effects: { argent: -80000, skill: 3, morale: 2 },
        requires: { argent: 80000 },
        resultText:
          "Trois séances par semaine, review individuelle de chaque partie. Tu vois des choses sur la carte que tu ne voyais pas.",
      },
      {
        id: "trial",
        label: "Prendre un mois d'essai (25 000 €)",
        effects: { argent: -25000, skill: 2 },
        requires: { argent: 25000 },
        resultText: "Un mois, c'est court. Assez pour corriger deux mauvaises habitudes tenaces.",
      },
      {
        id: "decline",
        label: "Décliner : le staff du club suffit",
        effects: { morale: 1 },
        resultText:
          "Tu gardes ton argent. Le coach de l'équipe fait le travail — pour cinq joueurs à la fois.",
      },
    ],
  },
  {
    id: "money_physio",
    title: "Ton corps réclame un vrai suivi",
    text: "Le kiné du club passe deux jours par semaine, pour dix joueurs. Un cabinet privé te propose un suivi quotidien : kiné, préparateur physique, bilan du sommeil.",
    phases: ["preseason", "spring", "summer"],
    weight: 2,
    choices: [
      {
        id: "full",
        label: "Souscrire au suivi complet (60 000 €)",
        effects: { argent: -60000, forme: 9, morale: 3 },
        requires: { argent: 60000 },
        resultText:
          "Ton poignet, tes cervicales et ton sommeil sont suivis comme ceux d'un athlète. Parce que c'est ce que tu es.",
      },
      {
        id: "basic",
        label: "Prendre juste les séances de kiné (20 000 €)",
        effects: { argent: -20000, forme: 4 },
        requires: { argent: 20000 },
        resultText: "Deux séances par semaine. Les douleurs reculent sans disparaître.",
      },
      {
        id: "skip",
        label: "Faire avec le staff du club",
        effects: {},
        resultText: "Tu prends rendez-vous quand ça fait mal. C'est-à-dire trop tard.",
      },
    ],
  },
  {
    id: "money_move",
    title: "Deux heures de trajet par jour",
    text: "Tu habites loin du gaming house. Quatre heures de transport hebdomadaires que les autres passent à jouer ensemble. Un appartement se libère à dix minutes à pied.",
    phases: ["preseason"],
    weight: 2,
    choices: [
      {
        id: "move",
        label: "Déménager tout de suite (55 000 €)",
        effects: { argent: -55000, forme: 5, chimie: 5 },
        requires: { argent: 55000 },
        resultText:
          "Tu dors une heure de plus et tu traînes avec le groupe après l'entraînement. Les deux comptent.",
      },
      {
        id: "stay",
        label: "Rester où tu es",
        effects: { forme: -2 },
        resultText: "Le loyer reste bas, les trajets restent longs.",
      },
    ],
  },
  {
    id: "money_family",
    title: "Ta famille a besoin d'aide",
    text: "Ton frère t'appelle : la voiture est morte, et avec elle le boulot de ton père. Tu as sur ton compte plus que ce qu'ils gagnent en deux ans.",
    phases: ["preseason", "spring", "summer"],
    minSeason: 3,
    weight: 2,
    choices: [
      {
        id: "help",
        label: "Régler le problème sans discuter (40 000 €)",
        effects: { argent: -40000, morale: 8, communaute: 3 },
        requires: { argent: 40000 },
        resultText:
          "Tu envoies l'argent le jour même. C'est la première fois que ce métier te semble vraiment servir à quelque chose.",
      },
      {
        id: "loan",
        label: "Avancer la somme comme un prêt",
        effects: { argent: -40000, morale: 4 },
        requires: { argent: 40000 },
        resultText:
          "Tu poses des conditions. Ils acceptent, un peu froidement. L'argent circule, quelque chose s'est refroidi.",
      },
      {
        id: "no",
        label: "Expliquer que tu dois penser à ta reconversion",
        effects: { morale: -8 },
        resultText:
          "Tu as raison sur le fond. Ça ne rend pas le coup de téléphone moins pénible.",
      },
    ],
  },
  {
    id: "money_analyst",
    title: "Un analyste freelance veut travailler ton pool",
    text: "Il a bossé pour deux équipes de LEC et vient d'être licencié. Il te propose de construire, avec toi, un répertoire de champions adapté aux trois prochains patchs.",
    phases: ["preseason"],
    minSeason: 2,
    weight: 2,
    choices: [
      {
        id: "hire",
        label: "Le payer pour l'intersaison (70 000 €)",
        effects: { argent: -70000, skill: 2 },
        requires: { argent: 70000 },
        learnsArchetype: true,
        resultText:
          "Vous passez trois semaines sur les patch notes et la file de test. Tu arrives avec un style que personne n'attendait.",
      },
      {
        id: "chat",
        label: "Lui offrir un café et lui poser des questions",
        effects: { skill: 1, communaute: 2 },
        resultText: "Deux heures de discussion, quelques bonnes idées, rien de structuré.",
      },
    ],
  },
];
