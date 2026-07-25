import type { Effect, PlayerState, Stats } from "./types";

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Borne les stats (0-100, argent >= 0) et arrondit. */
export function normalizeStats(stats: Stats): Stats {
  return {
    skill: clamp(Math.round(stats.skill), 0, 100),
    reputation: clamp(Math.round(stats.reputation), 0, 100),
    morale: clamp(Math.round(stats.morale), 0, 100),
    forme: clamp(Math.round(stats.forme), 0, 100),
    chimie: clamp(Math.round(stats.chimie), 0, 100),
    argent: Math.max(0, Math.round(stats.argent)),
  };
}

/** Applique un effet (deltas) aux stats d'un état, en le bornant. */
export function applyEffect(state: PlayerState, effect: Effect): void {
  const s = state.stats;
  for (const [key, delta] of Object.entries(effect)) {
    if (delta === undefined) continue;
    s[key as keyof Stats] += delta;
  }
  state.stats = normalizeStats(s);
  // Le talent brut ne dépasse jamais le potentiel de la carrière.
  if (state.stats.skill > state.potential) state.stats.skill = state.potential;
  if (state.stats.reputation > state.bestReputation) {
    state.bestReputation = state.stats.reputation;
  }
}

/** Clone profond d'un état (les fonctions publiques travaillent sur une copie). */
export function cloneState(state: PlayerState): PlayerState {
  return structuredClone(state);
}
