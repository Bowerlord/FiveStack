import type { GameEvent } from "@/engine/types";

// Événements de vie hors compétition : argent, mental, longévité. Ils peuvent
// tomber à n'importe quelle phase.

export const GENERIC_EVENTS: GameEvent[] = [
  {
    id: "gen_invest",
    title: "Placement financier",
    text: "Un ami te propose d'investir tes primes dans sa start-up esport.",
    choices: [
      {
        id: "invest",
        label: "Investir une partie de tes gains",
        effects: { argent: -8000 },
        requires: { argent: 15000 },
        risk: {
          chance: 0.45,
          stat: "reputation",
          success: { effects: { argent: 40000, reputation: 3 }, text: "La boîte lève des fonds deux ans plus tard. Ton pari est largement gagnant." },
          failure: { effects: { morale: -4 }, text: "La start-up ferme en dix-huit mois. L'argent est perdu." },
        },
        resultText: "",
      },
      {
        id: "save",
        label: "Garder ton argent au chaud",
        effects: { argent: 3000, morale: 1 },
        resultText: "Prudence. Tu préfères la sécurité.",
      },
    ],
  },
  {
    id: "gen_burnout",
    title: "Signes d'épuisement",
    text: "Tu ressens moins de plaisir à jouer ces derniers temps. Un signal à ne pas ignorer.",
    minAge: 21,
    weight: 2,
    choices: [
      {
        id: "psy",
        label: "Consulter la psychologue de l'équipe",
        effects: { morale: 9, forme: 6, skill: -1 },
        resultText: "Parler fait un bien fou. Tu retrouves peu à peu la flamme.",
      },
      {
        id: "break",
        label: "Prendre deux semaines de coupure totale",
        effects: { forme: 12, morale: 8, skill: -4, chimie: -3 },
        resultText: "Tu débranches complètement. Tu reviens rouillé, mais vivant.",
      },
      {
        id: "ignore",
        label: "Serrer les dents, ça va passer",
        effects: { morale: -7, forme: -5, skill: 2 },
        resultText: "Tu enfouis la fatigue. Elle ne disparaît pas pour autant.",
      },
    ],
  },
  {
    id: "gen_apartment",
    title: "Premier vrai investissement",
    text: "Tes gains te permettent enfin d'acheter ton appartement.",
    minAge: 21,
    choices: [
      {
        id: "buy",
        label: "Acheter",
        effects: { argent: -60000, morale: 10, forme: 4 },
        requires: { argent: 80000 },
        resultText: "Un vrai chez-toi, un vrai bureau, un vrai lit. Ta qualité de vie change.",
      },
      {
        id: "rent",
        label: "Continuer à louer, rester mobile",
        effects: { morale: 2 },
        resultText: "Ta carrière peut t'emmener n'importe où. Autant rester léger.",
      },
    ],
  },
  {
    id: "gen_studies",
    title: "Reprendre des études à distance",
    text: "Ton entourage insiste : la carrière est courte, il faut préparer l'après.",
    minAge: 20,
    choices: [
      {
        id: "enroll",
        label: "T'inscrire en parallèle",
        effects: { morale: 6, skill: -2, forme: -3 },
        resultText: "Quelques heures de cours par semaine. Ça relativise beaucoup de choses.",
      },
      {
        id: "later",
        label: "Repousser à après la carrière",
        effects: { skill: 3, morale: -2 },
        resultText: "Tu mises tout sur le jeu. Le plan B attendra.",
      },
    ],
  },
  {
    id: "gen_relationship",
    title: "Une relation qui demande du temps",
    text: "Ta vie sentimentale s'accommode mal des blocs de scrims de six heures.",
    minAge: 20,
    choices: [
      {
        id: "invest",
        label: "Faire de la place dans ton planning",
        effects: { morale: 9, forme: 5, skill: -3, chimie: -2 },
        resultText: "Tu récupères un équilibre que beaucoup de joueurs n'ont pas.",
      },
      {
        id: "career",
        label: "Prioriser la carrière",
        effects: { skill: 4, morale: -6 },
        resultText: "Tu choisis le jeu. Ce sera peut-être un regret.",
      },
    ],
  },
  {
    id: "gen_veteran_advice",
    title: "Un ancien te prend à part",
    text: "Un joueur retraité que tu admires t'invite à dîner et te parle franchement de l'après.",
    minAge: 22,
    choices: [
      {
        id: "listen",
        label: "Écouter attentivement",
        effects: { morale: 6, reputation: 3, chimie: 3 },
        resultText: "Il te dit ce que personne ne dit : comment ça se termine, et comment s'y préparer.",
      },
      {
        id: "dismiss",
        label: "Tu as encore le temps d'y penser",
        effects: { morale: 2, skill: 2 },
        resultText: "Tu es en pleine carrière. L'après, ce sera pour plus tard.",
      },
    ],
  },
  {
    id: "gen_agent_switch",
    title: "Changer d'agent",
    text: "Un agent réputé te contacte, promettant de meilleurs contrats que ton représentant actuel.",
    minAge: 20,
    choices: [
      {
        id: "switch",
        label: "Changer d'agent",
        effects: { reputation: 6, argent: 10000, morale: -3 },
        resultText: "Ton nouveau représentant est agressif et efficace. Les offres affluent.",
      },
      {
        id: "loyal",
        label: "Rester fidèle",
        effects: { morale: 5, chimie: 2 },
        resultText: "Tu gardes celui qui t'a accompagné depuis le début.",
      },
    ],
  },
];
