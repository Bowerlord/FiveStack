import type { PlayerState } from "./types";

// Le talent a un plafond, mais ce n'est pas un mur : un travail de fond ingrat
// peut le repousser de quelques points. Ça reste coûteux et limité — le talent
// de départ garde son importance, sinon toutes les carrières convergeraient.

/** Points de plafond qu'une carrière entière peut gagner au maximum. */
export const MAX_POTENTIAL_GAIN = 12;

export const POTENTIAL_CEILING = 99;

/** Le joueur bute-t-il sur son plafond ? (À deux points près : il le sent venir.) */
export function isAtCap(state: PlayerState): boolean {
  return state.stats.skill >= state.potential - 2;
}

/** Reste-t-il de la marge pour repousser le plafond ? */
export function canRaisePotential(state: PlayerState): boolean {
  return state.potentialGained < MAX_POTENTIAL_GAIN && state.potential < POTENTIAL_CEILING;
}

/**
 * Repousse le plafond. Le gain s'érode à mesure qu'on l'a déjà repoussé :
 * les premiers paliers se franchissent, les derniers se méritent.
 */
export function raisePotential(state: PlayerState, requested: number): number {
  if (!canRaisePotential(state)) return 0;

  const alreadyEarned = state.potentialGained;
  const diminished = Math.max(1, Math.round(requested * (1 - alreadyEarned / (MAX_POTENTIAL_GAIN + 4))));
  const room = Math.min(MAX_POTENTIAL_GAIN - alreadyEarned, POTENTIAL_CEILING - state.potential);
  const gain = Math.min(diminished, room);

  state.potential += gain;
  state.potentialGained += gain;
  return gain;
}
