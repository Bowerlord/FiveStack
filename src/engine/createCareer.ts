import { ENTOURAGES, LIFESTYLES, ORIGINS, getOption } from "@/data/attributes";
import { getLeague, getTeam } from "@/data/teams";
import type { CreationChoices, Effect, PlayerState, Stats } from "./types";
import { Rng } from "./rng";
import { enterPhase } from "./progression";
import { applyEffect, normalizeStats } from "./util";

// Statistiques de base d'un jeune joueur (avant bonus de création).
const BASE_STATS: Stats = {
  skill: 48,
  reputation: 20,
  morale: 60,
  forme: 70,
  chimie: 45,
  argent: 5000,
};

const STARTING_AGE = 17;

/** Construit une nouvelle carrière prête à jouer (première phase déjà tirée). */
export function startCareer(creation: CreationChoices, seed: number): PlayerState {
  const team = getTeam(creation.startTeamId);
  const leagueId = team?.leagueId ?? "lfl";

  const state: PlayerState = {
    seed,
    rngState: seed >>> 0,
    creation,
    pseudo: creation.pseudo.trim() || "Rookie",
    nationalityId: creation.nationalityId,
    role: creation.role,
    age: STARTING_AGE,
    season: 1,
    teamId: creation.startTeamId,
    leagueId,
    retired: false,
    stats: { ...BASE_STATS },
    bestReputation: BASE_STATS.reputation,
    peakLeagueId: leagueId,
    palmares: {
      splitsWon: 0,
      msiWon: 0,
      worldsWon: 0,
      msiAppearances: 0,
      worldsAppearances: 0,
      mvpAwards: 0,
      allProSelections: 0,
    },
    status: "event",
    phase: "preseason",
    pendingEventIds: [],
    usedEventIds: [],
    currentEvent: null,
    lastOutcome: null,
    lastPhaseResult: null,
    qualifiedMSI: false,
    qualifiedWorlds: false,
    seasonResults: [],
    seasonNarrative: [],
    transferNote: null,
    lastSeasonSummary: null,
    finalResult: null,
  };

  // Bonus de création cumulés (origine + mode de vie + entourage).
  const bonuses: Effect[] = [
    getOption(ORIGINS, creation.originId)?.effects ?? {},
    getOption(LIFESTYLES, creation.lifestyleId)?.effects ?? {},
    getOption(ENTOURAGES, creation.entourageId)?.effects ?? {},
  ];
  for (const b of bonuses) applyEffect(state, b);
  state.stats = normalizeStats(state.stats);
  state.bestReputation = Math.max(state.bestReputation, state.stats.reputation);

  // On lance la première phase (pré-saison) avec un RNG dérivé de la graine.
  const rng = new Rng(state.rngState);
  enterPhase(state, "preseason", rng);
  state.rngState = rng.state;

  // Sécurité : la ligue de départ est bien la ligue de pic initiale.
  if (getLeague(leagueId)) state.peakLeagueId = leagueId;

  return state;
}
