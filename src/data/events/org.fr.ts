import type { GameEvent } from "@/engine/types";

// Instabilité des structures : très spécifique à l'esport. Les orgs coulent,
// les sponsors partent, les salaires arrivent en retard. Ton avenir ne dépend
// pas seulement de ton niveau de jeu.

export const ORG_EVENTS: GameEvent[] = [
  {
    id: "org_sponsor_leaves",
    title: "Le sponsor principal se retire",
    text: "Le partenaire titre met fin au contrat du jour au lendemain. La structure perd la moitié de son budget.",
    weight: 2,
    choices: [
      {
        id: "paycut",
        label: "Accepter une baisse de salaire pour sauver l'équipe",
        effects: { chimie: 8, morale: -3, argent: -8000 },
        resultText: "Le roster reste intact grâce à toi. Le manager n'oubliera pas.",
      },
      {
        id: "refuse",
        label: "Refuser : ton contrat est ton contrat",
        effects: { morale: 3, chimie: -6 },
        resultText: "Tu es dans ton droit. Deux coéquipiers, eux, ont accepté — et ils le savent.",
      },
    ],
  },
  {
    id: "org_unpaid",
    title: "Salaires en retard",
    text: "Deux mois que personne n'a été payé. Le manager promet que « ça arrive la semaine prochaine ».",
    weight: 2,
    choices: [
      {
        id: "public",
        label: "Rendre l'affaire publique",
        effects: { communaute: 9, reputation: 4, morale: -4, chimie: -3 },
        resultText: "Ton thread fait un scandale. Tu es payé dans les 48 heures — et grillé auprès de certains managers.",
      },
      {
        id: "wait",
        label: "Patienter et faire confiance",
        effects: { morale: -7, chimie: 4 },
        resultText: "Tu attends en serrant les dents. L'argent finira par arriver. Peut-être.",
      },
      {
        id: "lawyer",
        label: "Passer par un avocat",
        effects: { argent: 12000, chimie: -5, morale: 2 },
        requires: { argent: 20000 },
        resultText: "La procédure aboutit. Tu récupères ton dû, l'ambiance en prend un coup.",
      },
    ],
  },
  {
    id: "org_folding",
    title: "La structure met la clé sous la porte",
    text: "Réunion d'urgence : l'org cesse ses activités à la fin du split. Tout le monde sera libre.",
    weight: 2,
    minAge: 19,
    choices: [
      {
        id: "finish",
        label: "Finir la saison dignement",
        effects: { chimie: 9, reputation: 5, morale: -3 },
        resultText: "Vous jouez les derniers matchs pour l'honneur. Le milieu salue l'attitude.",
      },
      {
        id: "shop",
        label: "Chercher immédiatement un nouveau club",
        effects: { reputation: 3, chimie: -7, argent: 5000 },
        resultText: "Tu sécurises ton avenir pendant que les autres encaissent le choc.",
      },
    ],
  },
  {
    id: "org_slot_sold",
    title: "Le slot de franchise est revendu",
    text: "Les propriétaires vendent la place en ligue à un groupe d'investisseurs. Nouveau nom, nouvelle direction, nouveaux objectifs.",
    choices: [
      {
        id: "adapt",
        label: "Jouer le jeu de la nouvelle direction",
        effects: { chimie: 5, argent: 8000 },
        resultText: "Les nouveaux propriétaires ont de l'ambition et de l'argent. Tu t'aligne.",
      },
      {
        id: "wary",
        label: "Rester méfiant et te concentrer sur ton jeu",
        effects: { skill: 4, chimie: -2 },
        resultText: "Tu as vu trop de projets s'effondrer pour t'emballer.",
      },
    ],
  },
  {
    id: "org_manager_toxic",
    title: "Un manager qui dépasse les bornes",
    text: "Il impose des horaires délirants et humilie les joueurs en réunion.",
    weight: 2,
    choices: [
      {
        id: "confront",
        label: "Le confronter devant tout le monde",
        effects: { chimie: 7, morale: 5, reputation: -3 },
        requires: { morale: 50 },
        resultText: "Le vestiaire te suit. La direction est obligée de réagir.",
      },
      {
        id: "endure",
        label: "Encaisser en silence",
        effects: { morale: -8, forme: -4, skill: 2 },
        resultText: "Tu tiens, mais quelque chose se casse doucement.",
      },
      {
        id: "leak",
        label: "Faire fuiter des messages à la presse",
        effects: { communaute: 8, chimie: -5, reputation: -2 },
        resultText: "Les captures d'écran font le tour du milieu. Il est démis en trois jours.",
      },
    ],
  },
  {
    id: "org_academy_investment",
    title: "L'org investit dans son académie",
    text: "La structure demande aux joueurs titulaires de consacrer du temps aux jeunes.",
    choices: [
      {
        id: "mentor",
        label: "T'impliquer sérieusement",
        effects: { chimie: 6, reputation: 4, forme: -3 },
        resultText: "Tu y prends goût. Deux de tes protégés perceront plus tard.",
      },
      {
        id: "decline",
        label: "Refuser, tu as ta propre saison à jouer",
        effects: { skill: 3, chimie: -3 },
        resultText: "Tu restes concentré sur ton propre niveau.",
      },
    ],
  },
  {
    id: "org_merch",
    title: "Ta ligne de maillots",
    text: "L'org veut lancer un maillot à ton nom et te propose un pourcentage sur les ventes.",
    choices: [
      {
        id: "involved",
        label: "T'impliquer dans le design",
        effects: { communaute: 8, argent: 10000, forme: -2 },
        requires: { communaute: 40 },
        resultText: "Le maillot part en rupture de stock en deux jours.",
      },
      {
        id: "sign",
        label: "Signer et laisser faire",
        effects: { argent: 5000, communaute: 2 },
        resultText: "Un revenu passif sans effort. Le design est... discutable.",
      },
    ],
  },
  {
    id: "org_relocation",
    title: "Déménagement du siège",
    text: "La structure déplace ses installations à 800 km. Tout le roster doit suivre.",
    choices: [
      {
        id: "follow",
        label: "Suivre sans discuter",
        effects: { chimie: 5, morale: -4 },
        resultText: "Tu recommences ta vie ailleurs. Le groupe reste soudé.",
      },
      {
        id: "negotiate",
        label: "Négocier de rester à distance",
        effects: { morale: 6, chimie: -6 },
        resultText: "Tu obtiens un aménagement. Tu manques les moments informels du groupe.",
      },
    ],
  },
];
