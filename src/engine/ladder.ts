import type { PlayerState } from "./types";

// Le classement SoloQ est public : c'est la vitrine permanente d'un joueur pro.
// Il se déduit du niveau et de la forme — inutile d'en faire une statistique de
// plus, mais il donne une lecture immédiate du standing du joueur.

const TIERS: { min: number; label: string }[] = [
  { min: 92, label: "Challenger" },
  { min: 84, label: "Grandmaster" },
  { min: 76, label: "Master" },
  { min: 66, label: "Diamant I" },
  { min: 58, label: "Diamant III" },
  { min: 50, label: "Émeraude I" },
  { min: 42, label: "Émeraude III" },
  { min: 34, label: "Platine II" },
  { min: 0, label: "Or I" },
];

/** Rang SoloQ affiché : niveau de jeu, légèrement pondéré par la forme. */
export function soloQueueRank(state: PlayerState): string {
  const value = state.stats.skill * 0.85 + state.stats.forme * 0.15;
  const tier = TIERS.find((t) => value >= t.min) ?? TIERS[TIERS.length - 1];
  if (tier.label === "Challenger") {
    // Plus le joueur est fort, plus il grimpe dans le top du ladder.
    const place = Math.max(1, Math.round(60 - (value - 92) * 6));
    return `Challenger #${place}`;
  }
  return tier.label;
}
