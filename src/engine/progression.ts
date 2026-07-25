import { getLeague, getTeam, getTeamsByTier } from "@/data/teams";
import type { LeagueTier, Phase, PlayerState, SeasonSummary } from "./types";
import { Rng } from "./rng";
import { drawEvents, getEvent } from "./events";
import { simulatePhase } from "./simulation";
import { computeFinalResult } from "./scoring";
import { applyEffect, cloneState } from "./util";

// ──────────────────────────────  Helpers de phase  ──────────────────────────────

function popNextEvent(state: PlayerState): void {
  const id = state.pendingEventIds.shift();
  state.currentEvent = id ? getEvent(id) ?? null : null;
  state.status = "event";
}

/** Entre dans une phase : tire ses événements, ou déclenche directement son issue. */
export function enterPhase(state: PlayerState, phase: Phase, rng: Rng): void {
  state.phase = phase;
  state.pendingEventIds = drawEvents(state, phase, rng);
  state.currentEvent = null;
  if (state.pendingEventIds.length > 0) {
    popNextEvent(state);
  } else {
    runPhaseOutcome(state, rng);
  }
}

function runPhaseOutcome(state: PlayerState, rng: Rng): void {
  if (state.phase === "preseason") {
    // Pas d'écran de résultat : on enchaîne sur le split de printemps.
    enterPhase(state, "spring", rng);
    return;
  }
  state.lastPhaseResult = simulatePhase(state, state.phase, rng);
  state.status = "phase_result";
}

function nextPhaseAfter(state: PlayerState): Phase | null {
  switch (state.phase) {
    case "spring":
      return state.qualifiedMSI ? "msi" : "summer";
    case "msi":
      return "summer";
    case "summer":
      return state.qualifiedWorlds ? "worlds" : null;
    case "worlds":
      return null;
    default:
      return null;
  }
}

// ──────────────────────────────  Saisons  ──────────────────────────────

function beginSeason(state: PlayerState, rng: Rng): void {
  state.season += 1;
  state.usedEventIds = [];
  state.qualifiedMSI = false;
  state.qualifiedWorlds = false;
  state.seasonResults = [];
  state.seasonNarrative = [];
  state.transferNote = null;
  state.lastPhaseResult = null;
  enterPhase(state, "preseason", rng);
}

function endSeason(state: PlayerState, rng: Rng): void {
  runOffseason(state, rng);
  state.lastSeasonSummary = buildSeasonSummary(state);
  state.retired = shouldRetire(state, rng);
  state.status = "season_summary";
}

function runOffseason(state: PlayerState, rng: Rng): void {
  state.age += 1;

  // Dérive de niveau selon l'âge (pic vers 22-24, déclin après 27).
  const age = state.age;
  if (age <= 22) applyEffect(state, { skill: rng.int(1, 4) });
  else if (age <= 25) applyEffect(state, { skill: rng.int(0, 2) });
  else if (age <= 27) applyEffect(state, { skill: rng.int(-1, 1) });
  else applyEffect(state, { skill: -rng.int(2, 5) });

  // Récupération intersaison.
  applyEffect(state, { forme: rng.int(8, 16), morale: rng.int(3, 8) });

  // Salaire annuel selon la cote et le niveau de ligue.
  const league = getLeague(state.leagueId);
  const salaryBase = league?.tier === "MAJOR" ? 60000 : 15000;
  const salary = Math.round(salaryBase * (0.5 + state.stats.reputation / 100));
  applyEffect(state, { argent: salary });

  handleTransfer(state, rng);
}

function handleTransfer(state: PlayerState, rng: Rng): void {
  // Les recruteurs des ligues majeures regardent d'abord le niveau de jeu ; la
  // notoriété aide, mais ne suffit pas à décrocher un contrat au plus haut niveau.
  const desirability = state.stats.reputation * 0.3 + state.stats.skill * 0.7;
  const currentLeague = getLeague(state.leagueId);
  if (!currentLeague) return;

  let targetTier: LeagueTier = currentLeague.tier;
  let forceMove = false;
  if (currentLeague.tier === "ERL" && desirability >= 72) {
    targetTier = "MAJOR";
    forceMove = true;
  } else if (currentLeague.tier === "MAJOR" && desirability < 55) {
    targetTier = "ERL";
    forceMove = true;
  }

  if (!forceMove && !rng.chance(0.28)) return; // pas de mouvement cette intersaison

  const candidates = getTeamsByTier(targetTier).filter((t) => t.id !== state.teamId);
  if (candidates.length === 0) return;

  // On vise une équipe dont le prestige colle à la désirabilité, avec un peu d'aléa.
  const target = candidates
    .map((t) => ({ t, gap: Math.abs(t.prestige - (desirability + rng.range(-8, 8))) }))
    .sort((a, b) => a.gap - b.gap)[0].t;

  const fromMajor = currentLeague.tier === "MAJOR";
  const toMajor = targetTier === "MAJOR";
  state.teamId = target.id;
  state.leagueId = target.leagueId;

  const newLeague = getLeague(target.leagueId);
  const peakLeague = getLeague(state.peakLeagueId);
  if (newLeague && (!peakLeague || newLeague.strength > peakLeague.strength)) {
    state.peakLeagueId = newLeague.id;
  }

  // Nouvelle équipe : l'alchimie repart de bas.
  state.stats.chimie = rng.int(30, 45);
  applyEffect(state, { reputation: toMajor && !fromMajor ? 5 : 2, morale: 4 });

  if (toMajor && !fromMajor) {
    state.transferNote = `🚀 Transfert en ${newLeague?.name} : tu rejoins ${target.name} !`;
  } else if (!toMajor && fromMajor) {
    state.transferNote = `📉 Retour en ${newLeague?.name} chez ${target.name}.`;
  } else {
    state.transferNote = `✍️ Nouveau contrat chez ${target.name} (${newLeague?.name}).`;
  }
  state.seasonNarrative.push(state.transferNote);
}

function shouldRetire(state: PlayerState, rng: Rng): boolean {
  const age = state.age;
  if (age >= 33) return true;
  if (state.stats.forme <= 8 && age >= 24) return true;
  if (age >= 27) {
    let p = (age - 26) * 0.16;
    if (state.stats.skill < 45) p += 0.2;
    if (state.stats.forme < 30) p += 0.15;
    if (state.stats.morale < 25) p += 0.15;
    return rng.chance(Math.min(0.9, p));
  }
  return false;
}

function buildSeasonSummary(state: PlayerState): SeasonSummary {
  const team = getTeam(state.teamId);
  const league = getLeague(state.leagueId);
  return {
    season: state.season,
    age: state.age,
    teamName: team?.name ?? "—",
    leagueName: league?.name ?? "—",
    results: [...state.seasonResults],
    transferNote: state.transferNote ?? undefined,
    narrative: [...state.seasonNarrative],
    stats: { ...state.stats },
  };
}

// ──────────────────────────────  API publique de boucle  ──────────────────────────────

/** Applique le choix courant : effets + retour, puis passe en attente de « Continuer ». */
export function resolveChoice(input: PlayerState, choiceId: string): PlayerState {
  if (input.status !== "event" || !input.currentEvent) return input;
  const state = cloneState(input);
  const event = state.currentEvent!;
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return input;

  applyEffect(state, choice.effects);
  state.lastOutcome = {
    choiceLabel: choice.label,
    resultText: choice.resultText,
    effects: choice.effects,
  };
  state.status = "event_result";
  return state;
}

/** Fait avancer le jeu depuis un écran intermédiaire (résultat, bilan de saison…). */
export function next(input: PlayerState): PlayerState {
  const state = cloneState(input);
  const rng = new Rng(state.rngState);

  switch (state.status) {
    case "event_result":
      if (state.pendingEventIds.length > 0) popNextEvent(state);
      else runPhaseOutcome(state, rng);
      break;
    case "phase_result": {
      const nxt = nextPhaseAfter(state);
      if (nxt === null) endSeason(state, rng);
      else enterPhase(state, nxt, rng);
      break;
    }
    case "season_summary":
      if (state.retired) {
        state.finalResult = computeFinalResult(state);
        state.status = "finished";
      } else {
        beginSeason(state, rng);
      }
      break;
    default:
      break; // 'event' et 'finished' : rien à faire
  }

  state.rngState = rng.state;
  return state;
}
