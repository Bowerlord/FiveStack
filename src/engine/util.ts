import type { Effect, PlayerState, Requirement, Stats } from "./types";

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
    communaute: clamp(Math.round(stats.communaute), 0, 100),
    argent: Math.max(0, Math.round(stats.argent)),
  };
}

/**
 * Applique un effet (deltas) aux stats d'un état, en le bornant.
 * Renvoie les points de skill perdus parce que le plafond de talent est atteint :
 * un gain avalé en silence passerait pour un bug aux yeux du joueur.
 */
export function applyEffect(state: PlayerState, effect: Effect): number {
  const s = state.stats;
  for (const [key, delta] of Object.entries(effect)) {
    if (delta === undefined) continue;
    s[key as keyof Stats] += delta;
  }
  state.stats = normalizeStats(s);

  let wasted = 0;
  if (state.stats.skill > state.potential) {
    wasted = state.stats.skill - state.potential;
    state.stats.skill = state.potential;
  }
  if (state.stats.reputation > state.bestReputation) {
    state.bestReputation = state.stats.reputation;
  }
  return wasted;
}

/** Le joueur satisfait-il les prérequis d'une option ? */
export function meetsRequirements(stats: Stats, requires?: Requirement): boolean {
  if (!requires) return true;
  return Object.entries(requires).every(([key, min]) => stats[key as keyof Stats] >= (min ?? 0));
}

/** Prérequis non satisfaits, pour expliquer au joueur ce qui lui manque. */
export function missingRequirements(stats: Stats, requires?: Requirement): [keyof Stats, number][] {
  if (!requires) return [];
  return Object.entries(requires)
    .filter(([key, min]) => stats[key as keyof Stats] < (min ?? 0))
    .map(([key, min]) => [key as keyof Stats, min ?? 0]);
}

/** Clone profond d'un état (les fonctions publiques travaillent sur une copie). */
export function cloneState(state: PlayerState): PlayerState {
  return structuredClone(state);
}
