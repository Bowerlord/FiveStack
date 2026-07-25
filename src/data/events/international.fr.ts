import type { GameEvent } from "@/engine/types";

// MSI et Worlds : décalage horaire, pression médiatique mondiale, scouts dans
// les gradins. Une autre échelle que le championnat domestique.

export const INTERNATIONAL_EVENTS: GameEvent[] = [
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
        effects: { morale: 6, communaute: 6, skill: 2 },
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
        effects: { communaute: 8, morale: 4, chimie: -2 },
        resultText: "Ta déclaration fait les gros titres et met la pression sur l'adversaire.",
      },
      {
        id: "modest",
        label: "Rester mesuré et respectueux",
        effects: { chimie: 3, morale: 2, reputation: 3 },
        resultText: "Une réponse posée, appréciée du milieu.",
      },
    ],
  },
  {
    id: "intl_east_west",
    title: "Le fossé Est-Ouest",
    text: "Les analystes répètent depuis des années que ta région ne peut pas rivaliser avec l'Asie.",
    phases: ["msi", "worlds"],
    weight: 2,
    choices: [
      {
        id: "fuel",
        label: "En faire ton carburant",
        effects: { morale: 6, skill: 3, communaute: 5 },
        resultText: "Tu épingles l'article au mur de ta chambre d'hôtel. Ça te tient éveillé.",
      },
      {
        id: "study",
        label: "Étudier leurs VOD jusqu'à l'obsession",
        effects: { skill: 6, forme: -5 },
        resultText: "Tu connais leurs patterns par cœur. Ils ne te surprendront pas.",
      },
    ],
  },
  {
    id: "intl_crowd",
    title: "Une arène hostile",
    text: "Vingt mille personnes hurlent pour l'équipe d'en face. Chaque erreur de ta part déclenche une ovation.",
    phases: ["msi", "worlds"],
    choices: [
      {
        id: "feed",
        label: "Te nourrir de l'hostilité",
        effects: { morale: 5, communaute: 6 },
        requires: { morale: 45 },
        resultText: "Plus ils sifflent, mieux tu joues. Tu salues même la foule après un bon play.",
      },
      {
        id: "block",
        label: "Casque à fond, ignorer totalement",
        effects: { skill: 4, communaute: -2 },
        resultText: "Tu n'entends plus rien. Il n'y a que la Faille.",
      },
    ],
  },
  {
    id: "intl_group_draw",
    title: "Tirage au sort des groupes",
    text: "Vous héritez du groupe de la mort : deux favoris et une équipe imprévisible.",
    phases: ["msi", "worlds"],
    choices: [
      {
        id: "focus_one",
        label: "Concentrer la préparation sur un adversaire",
        effects: { skill: 5, chimie: 2 },
        resultText: "Vous serez prêts contre eux. Pour les autres, il faudra improviser.",
      },
      {
        id: "spread",
        label: "Préparer les trois équipes également",
        effects: { skill: 2, chimie: 5, forme: -4 },
        resultText: "Préparation étalée : solide partout, tranchant nulle part.",
      },
    ],
  },
  {
    id: "intl_last_dance",
    title: "Peut-être ta dernière chance",
    text: "À ton âge, les occasions de jouer un titre mondial se comptent désormais sur les doigts d'une main.",
    phases: ["msi", "worlds"],
    minAge: 25,
    weight: 2,
    choices: [
      {
        id: "everything",
        label: "Tout laisser sur la scène",
        effects: { skill: 4, morale: 6, forme: -7 },
        resultText: "Tu joues chaque partie comme si c'était la dernière. Parce que c'est peut-être le cas.",
      },
      {
        id: "serene",
        label: "Aborder ça avec sérénité",
        effects: { morale: 7, chimie: 4 },
        resultText: "Tu as déjà tout vécu. Tu profites, simplement.",
      },
    ],
  },
];
