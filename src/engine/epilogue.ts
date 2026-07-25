import type { EpiloguePath, PlayerState } from "./types";
import { meetsRequirements } from "./util";

// On raccroche à 25 ans. En esport, ce n'est pas une fin : c'est un second acte.
// Ce que tu as construit pendant ta carrière — communauté, cohésion, argent,
// crédibilité — détermine les portes qui s'ouvrent ensuite.

export const EPILOGUE_PATHS: EpiloguePath[] = [
  {
    id: "streamer",
    label: "Devenir streamer à plein temps",
    description: "Ta communauté te suit depuis des années. Elle t'attend au tournant de la reconversion.",
    requires: { communaute: 55 },
    narrative:
      "Tu annonces ta retraite un jeudi soir, en direct, devant des dizaines de milliers de personnes. Le lendemain, tu rallumes le stream — et ils sont tous là. Plus de scrims, plus de coach, plus de pression : juste toi, ta communauté et le jeu que tu aimes. Certains diront que tu n'as jamais vraiment arrêté.",
    scoreBonus: 4,
  },
  {
    id: "coach",
    label: "Passer coach",
    description: "Tu as toujours été la voix qui calme le vocal. Le banc t'attend.",
    requires: { chimie: 60 },
    narrative:
      "Tu troques la souris pour le tableau blanc. Les premières semaines sont étranges : regarder cinq joueurs faire les erreurs que tu faisais, sans pouvoir prendre le clavier. Puis vient ce moment, en fin de saison, où ton équipe exécute exactement ce que tu avais dessiné. Tu comprends que tu n'as pas quitté la compétition — tu as changé de siège.",
    scoreBonus: 5,
  },
  {
    id: "analyst",
    label: "Rejoindre le desk analyste",
    description: "Ta lecture de jeu et ta notoriété font de toi une voix écoutée.",
    requires: { reputation: 55, communaute: 40 },
    narrative:
      "Costume, oreillette, lumière rouge. Tu analyses maintenant les drafts des autres, et tu es bon — parce que tu as vécu chacune de ces décisions de l'intérieur. Quand tu dis qu'un joueur va craquer sous la pression, personne dans le studio ne te contredit.",
    scoreBonus: 4,
  },
  {
    id: "owner",
    label: "Monter ta propre structure",
    description: "Tu as l'argent et le carnet d'adresses. À toi de bâtir.",
    requires: { argent: 400000 },
    narrative:
      "Tu investis tes gains dans une structure à ton nom. Le premier roster est un désastre, le deuxième monte en LFL. Tu découvres que gérer des joueurs est infiniment plus dur que d'en être un — et que tu adores ça.",
    scoreBonus: 6,
  },
  {
    id: "away",
    label: "Tourner la page",
    description: "Tu quittes complètement le milieu. Il y a une vie après.",
    narrative:
      "Tu ne rallumes pas le stream. Tu ne réponds pas aux offres de casting. Tu reprends des études, ou un métier dont personne dans le milieu ne parlera jamais. De temps en temps, un clip de toi ressort quelque part et quelqu'un demande « il est devenu quoi ? ». Tu vas très bien, merci.",
    scoreBonus: 0,
  },
];

/** Voies réellement ouvertes au joueur, au vu de ce qu'il a construit. */
export function availableEpiloguePaths(state: PlayerState): EpiloguePath[] {
  const unlocked = EPILOGUE_PATHS.filter((p) => meetsRequirements(state.stats, p.requires));
  // « Tourner la page » n'a aucun prérequis : il y a toujours au moins une issue.
  return unlocked.length > 0 ? unlocked : [EPILOGUE_PATHS[EPILOGUE_PATHS.length - 1]];
}

export function getEpiloguePath(id: string): EpiloguePath | undefined {
  return EPILOGUE_PATHS.find((p) => p.id === id);
}
