import { getLeague } from "@/data/teams";
import type { EventContext, Phase, PlayerState, Stats } from "./types";
import { isAtCap } from "./potential";
import { currentPrestige } from "./mercato";

// Une situation doit coller à l'endroit où l'on se trouve : un rookie anonyme
// en ligue régionale et un vétéran titré en LCK ne vivent pas les mêmes choses.

/** Titres majeurs remportés (splits, MSI, Worlds). */
export function totalTitles(state: PlayerState): number {
  const p = state.palmares;
  return p.splitsWon + p.msiWon + p.worldsWon;
}

function statsMeet(stats: Stats, min?: Partial<Record<keyof Stats, number>>): boolean {
  if (!min) return true;
  return Object.entries(min).every(([k, v]) => stats[k as keyof Stats] >= (v ?? 0));
}

function statsUnder(stats: Stats, max?: Partial<Record<keyof Stats, number>>): boolean {
  if (!max) return true;
  return Object.entries(max).every(([k, v]) => stats[k as keyof Stats] <= (v ?? 100));
}

/** L'ensemble des conditions de contexte est-il satisfait ? */
export function matchesContext(
  ctx: EventContext,
  state: PlayerState,
  phase: Phase,
): boolean {
  if (ctx.phases && !ctx.phases.includes(phase)) return false;
  if (ctx.minAge !== undefined && state.age < ctx.minAge) return false;
  if (ctx.maxAge !== undefined && state.age > ctx.maxAge) return false;
  if (ctx.roles && !ctx.roles.includes(state.role)) return false;

  if (ctx.leagueTier) {
    const tier = getLeague(state.leagueId)?.tier;
    if (!tier || !ctx.leagueTier.includes(tier)) return false;
  }

  if (ctx.minSeason !== undefined && state.season < ctx.minSeason) return false;
  if (ctx.maxSeason !== undefined && state.season > ctx.maxSeason) return false;

  const prestige = currentPrestige(state);
  if (ctx.minPrestige !== undefined && prestige < ctx.minPrestige) return false;
  if (ctx.maxPrestige !== undefined && prestige > ctx.maxPrestige) return false;

  if (!statsMeet(state.stats, ctx.requiresStats)) return false;
  if (!statsUnder(state.stats, ctx.maxStats)) return false;

  if (ctx.minTitles !== undefined && totalTitles(state) < ctx.minTitles) return false;
  if (ctx.minSeasonsAtTeam !== undefined && state.seasonsAtTeam < ctx.minSeasonsAtTeam) {
    return false;
  }
  if (ctx.maxSeasonsAtTeam !== undefined && state.seasonsAtTeam > ctx.maxSeasonsAtTeam) {
    return false;
  }
  if (ctx.atPotentialCap && !isAtCap(state)) return false;

  return true;
}
