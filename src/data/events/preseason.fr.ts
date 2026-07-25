import type { GameEvent } from "@/engine/types";

// Pré-saison : mercato, préparation, et surtout le travail de fond sur le pool
// de champions — c'est ici qu'on prépare (ou pas) le patch qui arrive.

export const PRESEASON_EVENTS: GameEvent[] = [
  {
    id: "pre_bootcamp",
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
    id: "pre_learn_pool",
    title: "Élargir ton pool de champions",
    text: "Le coach est formel : tu es trop prévisible. Trois semaines de travail sur un nouveau style te rendraient beaucoup plus difficile à contrer en draft.",
    phases: ["preseason"],
    weight: 4,
    choices: [
      {
        id: "learn",
        label: "Apprendre un nouveau style de jeu",
        effects: { forme: -6, morale: -2 },
        learnsArchetype: true,
        resultText: "Des heures de SoloQ ingrates, beaucoup de défaites — mais tu ajoutes une corde à ton arc.",
      },
      {
        id: "perfect",
        label: "Perfectionner ce que tu maîtrises déjà",
        effects: { skill: 5, chimie: 2 },
        resultText: "Tu affines ton style signature jusqu'à l'obsession. Personne ne le joue mieux que toi.",
      },
    ],
  },
  {
    id: "pre_learn_meta",
    title: "Le style qui monte",
    text: "Les analystes s'accordent : un style que tu ne joues pas va dominer la saison. Tu peux encore te former à temps.",
    phases: ["preseason"],
    weight: 3,
    choices: [
      {
        id: "adapt",
        label: "T'y mettre immédiatement",
        effects: { forme: -5, skill: 2 },
        learnsArchetype: true,
        resultText: "Tu passes tes nuits à apprendre. Si les analystes ont raison, ça vaudra le coup.",
      },
      {
        id: "ignore",
        label: "Parier que la méta va tourner",
        effects: { morale: 3, forme: 4 },
        resultText: "Tu restes sur tes convictions. Les métas passent, ton style reste.",
      },
    ],
  },
  {
    id: "pre_contract",
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
        effects: { reputation: 4, morale: -3 },
        resultText: "Pari risqué : tu fais monter la hype autour de toi, mais rien n'est garanti.",
      },
    ],
  },
  {
    id: "pre_igl",
    title: "Qui portera le shotcall ?",
    text: "L'équipe cherche un leader in-game. Le coach pense à toi.",
    phases: ["preseason"],
    choices: [
      {
        id: "take",
        label: "Endosser le rôle de leader",
        effects: { chimie: 8, reputation: 5, skill: -2, morale: -3 },
        requires: { morale: 45 },
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
    id: "pre_prep",
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
    id: "pre_rookie",
    title: "Une jeune recrue prometteuse",
    text: "L'équipe intègre un rookie ultra-talentueux qui joue ton rôle en académie.",
    phases: ["preseason"],
    minAge: 22,
    weight: 2,
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
      {
        id: "crush",
        label: "L'écraser en scrim pour marquer le territoire",
        effects: { skill: 3, chimie: -6, reputation: 3 },
        requires: { skill: 65 },
        resultText: "Tu le domines sans pitié. Le message est passé, l'ambiance en pâtit.",
      },
    ],
  },
  {
    id: "pre_roster_lock",
    title: "Le roster n'est pas complet",
    text: "À deux semaines du roster lock, il manque encore un joueur. Le staff hésite entre un vétéran fiable et un rookie explosif.",
    phases: ["preseason"],
    choices: [
      {
        id: "veteran",
        label: "Pousser pour le vétéran",
        effects: { chimie: 7, skill: 1 },
        resultText: "Un profil sans éclat mais sans faille. La communication devient limpide.",
      },
      {
        id: "rookie",
        label: "Pousser pour le rookie",
        effects: { chimie: -3, skill: 4, communaute: 4 },
        resultText: "Une prise de risque assumée. Le public adore l'idée.",
      },
    ],
  },
  {
    id: "pre_scrim_block",
    title: "Organisation des scrims",
    text: "Le coach fixe le rythme : blocs de scrims de six heures, six jours sur sept.",
    phases: ["preseason"],
    choices: [
      {
        id: "full",
        label: "Tout donner dans les scrims",
        effects: { chimie: 8, skill: 3, forme: -7 },
        resultText: "La coordination devient un réflexe. Vos automatismes impressionnent.",
      },
      {
        id: "balance",
        label: "Demander un jour de repos supplémentaire",
        effects: { forme: 7, morale: 4, chimie: -2 },
        requires: { morale: 40 },
        resultText: "Le coach râle, mais accepte. Tu arrives frais au premier match.",
      },
    ],
  },
  {
    id: "pre_media_day",
    title: "Media day de la ligue",
    text: "Photos officielles, interviews, séance de promo. Toute la ligue est là.",
    phases: ["preseason"],
    choices: [
      {
        id: "shine",
        label: "Jouer le jeu à fond, punchlines incluses",
        effects: { communaute: 8, reputation: 4, forme: -2 },
        resultText: "Ta phrase sur les favoris tourne partout. Tu es lancé avant même le premier match.",
      },
      {
        id: "sober",
        label: "Rester sobre et professionnel",
        effects: { reputation: 2, chimie: 2 },
        resultText: "Des réponses carrées, rien qui dépasse. Le staff apprécie.",
      },
    ],
  },
  {
    id: "pre_house",
    title: "Emménagement au gaming house",
    text: "La structure loge tout le roster sous le même toit pour la saison.",
    phases: ["preseason"],
    choices: [
      {
        id: "in",
        label: "Emménager avec l'équipe",
        effects: { chimie: 9, forme: -4 },
        resultText: "Vivre ensemble 24h/24 soude le groupe — et complique la déconnexion.",
      },
      {
        id: "out",
        label: "Garder ton propre appartement",
        effects: { forme: 7, morale: 5, chimie: -5 },
        resultText: "Tu préserves ta bulle. Les autres tissent des liens sans toi.",
      },
    ],
  },
  {
    id: "pre_nutrition",
    title: "Consultation avec la psychologue",
    text: "La structure propose un suivi psychologique en amont de la saison, avant que ça n'aille mal.",
    phases: ["preseason"],
    choices: [
      {
        id: "yes",
        label: "Accepter le suivi",
        effects: { morale: 9, forme: 3 },
        resultText: "Poser des mots sur la pression, avant qu'elle ne s'installe. Tu abordes la saison plus solide.",
      },
      {
        id: "no",
        label: "Refuser, tu gères",
        effects: { morale: -2, skill: 2 },
        resultText: "Tu préfères mettre ces heures dans le jeu.",
      },
    ],
  },
  {
    id: "pre_solo_grind",
    title: "Objectif : rank 1 avant le split",
    text: "Il reste trois semaines. Viser la première place du ladder ferait parler de toi et affûterait ta mécanique.",
    phases: ["preseason"],
    weight: 2,
    choices: [
      {
        id: "grind",
        label: "Grinder la SoloQ jusqu'au bout",
        effects: { skill: 7, communaute: 6, forme: -9 },
        requires: { forme: 45 },
        resultText: "Tu finis dans le top 5 européen. Ton nom circule, ton poignet aussi.",
      },
      {
        id: "measured",
        label: "Jouer raisonnablement",
        effects: { skill: 3, forme: -2 },
        resultText: "Quelques heures par jour, sans excès. Tu restes affûté sans te griller.",
      },
      {
        id: "rest",
        label: "Te reposer complètement",
        effects: { forme: 10, morale: 5, skill: -2 },
        resultText: "Coupure totale. Tu reviens frais mais un peu rouillé.",
      },
    ],
  },
  {
    id: "pre_analyst",
    title: "Le nouvel analyste veut tout revoir",
    text: "Il arrive avec des données sur chacun de tes matchs et une liste de tes habitudes exploitables.",
    phases: ["preseason"],
    choices: [
      {
        id: "listen",
        label: "Écouter et corriger tes automatismes",
        effects: { skill: 6, chimie: 3, morale: -3 },
        resultText: "Difficile à entendre, mais il a raison sur tout. Tes patterns deviennent illisibles.",
      },
      {
        id: "defend",
        label: "Défendre ton instinct de joueur",
        effects: { morale: 4, chimie: -3 },
        resultText: "Tu assumes ton style. Les données ne jouent pas les matchs, toi si.",
      },
    ],
  },
];
