import { ENTOURAGES, LIFESTYLES, ORIGINS, getOption } from "@/data/attributes";
import { archetypesForRole } from "@/data/archetypes";
import { getLeague, getTeam } from "@/data/teams";
import type { CreationChoices, Effect, PlayerState, Stats } from "./types";
import { Rng } from "./rng";
import { rollPatch } from "./meta";
import { applyEffect, clamp, normalizeStats } from "./util";

// Statistiques de base d'un jeune joueur (avant bonus de création).
const BASE_STATS: Stats = {
  skill: 48,
  reputation: 20,
  morale: 60,
  forme: 70,
  chimie: 45,
  communaute: 10,
  argent: 5000,
};

const STARTING_AGE = 17;

// Bonus de potentiel selon le parcours : un prodige de la SoloQ part avec un
// plafond plus haut qu'un joueur amateur reconverti.
const POTENTIAL_BY_ORIGIN: Record<string, number> = {
  soloq: 8,
  academie: 4,
  amateur: 0,
  streamer: -3,
};

/** Construit une nouvelle carrière prête à jouer (patch de la saison 1 révélé). */
export function startCareer(creation: CreationChoices, seed: number): PlayerState {
  const team = getTeam(creation.startTeamId);
  const leagueId = team?.leagueId ?? "lfl";

  // Le potentiel est tiré à la création : c'est le talent que tu ignores encore.
  const potentialRng = new Rng((seed ^ 0x5bf03635) >>> 0);
  const potential = clamp(
    potentialRng.int(58, 88) + (POTENTIAL_BY_ORIGIN[creation.originId] ?? 0),
    55,
    99,
  );

  const rng = new Rng(seed >>> 0);

  // Le pool de départ : la signature choisie plus un second style tiré au sort.
  const roster = archetypesForRole(creation.role);
  const signature =
    roster.find((a) => a.id === creation.signatureId)?.id ?? roster[0]?.id ?? "";
  const others = roster.filter((a) => a.id !== signature);
  const pool = [signature];
  if (others.length > 0) pool.push(rng.pick(others).id);

  const state: PlayerState = {
    seed,
    rngState: rng.state,
    creation,
    pseudo: creation.pseudo.trim() || "Rookie",
    nationalityId: creation.nationalityId,
    role: creation.role,
    age: STARTING_AGE,
    season: 1,
    teamId: creation.startTeamId,
    leagueId,
    seasonsAtTeam: 1,
    retired: false,
    stats: { ...BASE_STATS },
    potential,
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
    pool,
    signature,
    patch: null,
    status: "patch_notes",
    phase: "preseason",
    pendingEventIds: [],
    usedEventIds: [],
    currentEvent: null,
    lastOutcome: null,
    lastPhaseResult: null,
    pendingMargin: null,
    clutchQueue: [],
    currentClutch: null,
    clutchDelta: 0,
    clutchStage: null,
    offers: [],
    qualifiedMSI: false,
    qualifiedWorlds: false,
    seasonResults: [],
    seasonNarrative: [],
    transferNote: null,
    lastSeasonSummary: null,
    epiloguePathId: null,
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

  // Premier patch : la carrière commence par découvrir l'état du jeu.
  state.patch = rollPatch(1, rng);
  state.rngState = rng.state;

  if (getLeague(leagueId)) state.peakLeagueId = leagueId;

  return state;
}
