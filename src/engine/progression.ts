import { getLeague, getTeam } from "@/data/teams";
import type { Effect, Offer, Phase, PlayerState, SeasonSummary } from "./types";
import { Rng } from "./rng";
import { drawEvents, getEvent } from "./events";
import {
  computePhaseMargin,
  isDecisiveMoment,
  resolvePhaseOutcome,
} from "./simulation";
import { buildClutchQueue, draftPenalty, loadClutch, stageForPhase } from "./clutch";
import { metaDelta, pickLearnableArchetype, rollPatch } from "./meta";
import { acceptOffer, buildOffers } from "./offers";
import { advanceArc, dueArcStep, maybeStartArc } from "./arcs";
import { riskChance } from "./risk";
import { raisePotential } from "./potential";
import { computeFinalResult } from "./scoring";
import { applyEffect, cloneState } from "./util";

// ──────────────────────────────  Événements de phase  ──────────────────────────────

function popNextEvent(state: PlayerState): void {
  const id = state.pendingEventIds.shift();
  state.currentEvent = id ? getEvent(id) ?? null : null;
  state.status = "event";
}

/**
 * Une étape de fil narratif échue passe avant le tirage aléatoire : une
 * histoire en cours prime toujours sur une situation anodine.
 */
function tryArcStep(state: PlayerState, phase: Phase, rng: Rng): boolean {
  const due = dueArcStep(state, phase);
  if (due) {
    state.currentArcId = due.arcId;
    state.currentArcStep = due.step;
    state.status = "arc";
    return true;
  }
  const started = maybeStartArc(state, phase, rng);
  if (started) {
    state.currentArcStep = started;
    state.status = "arc";
    return true;
  }
  return false;
}

/** Entre dans une phase : tire ses événements, ou déclenche directement son issue. */
export function enterPhase(state: PlayerState, phase: Phase, rng: Rng): void {
  state.phase = phase;
  state.pendingEventIds = drawEvents(state, phase, rng);
  state.currentEvent = null;
  state.currentArcStep = null;
  if (tryArcStep(state, phase, rng)) return;
  if (state.pendingEventIds.length > 0) {
    popNextEvent(state);
  } else {
    startPhaseOutcome(state, rng);
  }
}

/**
 * Fin des événements d'une phase : on calcule la marge de performance, puis on
 * laisse la main au joueur si l'échéance est décisive (finale, MSI, Worlds).
 */
function startPhaseOutcome(state: PlayerState, rng: Rng): void {
  if (state.phase === "preseason") {
    enterPhase(state, "spring", rng); // la pré-saison n'a pas de classement
    return;
  }

  let margin = computePhaseMargin(state, state.phase, rng);

  if (isDecisiveMoment(state.phase, margin)) {
    const stage = stageForPhase(state.phase);
    // Un pool étroit se fait bannir ses champions avant même de jouer.
    const penalty = draftPenalty(state, rng);
    margin += penalty.delta;
    if (penalty.note) state.seasonNarrative.push(penalty.note);

    state.pendingMargin = margin;
    state.clutchDelta = 0;
    state.clutchStage = stage;
    state.clutchQueue = buildClutchQueue(state, stage, rng);
    if (state.clutchQueue.length > 0) {
      popNextClutch(state);
      return;
    }
  }

  finishPhase(state, margin, rng);
}

function finishPhase(state: PlayerState, margin: number, rng: Rng): void {
  state.lastPhaseResult = resolvePhaseOutcome(state, state.phase, margin, rng);
  state.pendingMargin = null;
  state.clutchStage = null;
  state.status = "phase_result";
}

function popNextClutch(state: PlayerState): void {
  const id = state.clutchQueue.shift();
  state.currentClutch = id ? loadClutch(id) : null;
  state.status = "clutch";
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
  state.offers = [];
  state.orgCollapsed = false;
  // Le jeu change sous les pieds du joueur : nouveau patch chaque saison.
  state.patch = rollPatch(state.season, rng);
  state.status = "patch_notes";
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

  // La notoriété s'érode si on ne fait plus parler de soi.
  applyEffect(state, { communaute: -rng.int(1, 4) });

  // Une structure fragile peut ne pas honorer les salaires.
  const team = getTeam(state.teamId);
  if (team && rng.chance(Math.max(0, (60 - team.stability) / 160))) {
    state.seasonNarrative.push(
      `💸 ${team.name} traverse une crise financière : une partie de ton salaire n'a jamais été versée.`,
    );
    applyEffect(state, { morale: -6 });
  }
}

/** Les offres ne sont proposées qu'aux joueurs encore en activité. */
function openTransferWindow(state: PlayerState, rng: Rng): void {
  state.offers = buildOffers(state, rng);
  state.status = "transfer_choice";
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
  const rng = new Rng(state.rngState);
  const event = state.currentEvent!;
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return input;

  let resultText = choice.resultText;
  let effects = choice.effects;
  let gambleWon: boolean | undefined;

  if (choice.risk) {
    gambleWon = rng.chance(riskChance(choice.risk, state.stats));
    const branch = gambleWon ? choice.risk.success : choice.risk.failure;
    effects = { ...choice.effects, ...branch.effects };
    resultText = branch.text;
  }

  const outcome = applyChoiceEffects(state, choice, effects, rng);
  state.lastOutcome = { choiceLabel: choice.label, resultText: resultText + outcome.suffix, effects, gambleWon, ...outcome.extra };
  state.status = "event_result";
  state.rngState = rng.state;
  return state;
}

/**
 * Applique les conséquences communes à tous les choix : statistiques, plafond
 * de talent, apprentissage d'archétype, disparition de l'org, suite d'un arc.
 */
function applyChoiceEffects(
  state: PlayerState,
  choice: { effects: Effect; learnsArchetype?: boolean; raisesPotential?: number; collapsesOrg?: boolean; arcNext?: { stepId: string | null; delaySeasons?: number } },
  effects: Effect,
  rng: Rng,
): { suffix: string; extra: { skillWasted?: number; potentialRaised?: number } } {
  let suffix = "";
  const extra: { skillWasted?: number; potentialRaised?: number } = {};

  // Le plafond de talent est repoussé AVANT d'appliquer les gains, pour que le
  // travail de fond profite immédiatement.
  if (choice.raisesPotential) {
    const gained = raisePotential(state, choice.raisesPotential);
    if (gained > 0) {
      extra.potentialRaised = gained;
      suffix += ` Ton plafond de talent passe à ${state.potential}.`;
    }
  }

  const wasted = applyEffect(state, effects);
  if (wasted > 0) extra.skillWasted = wasted;

  if (choice.learnsArchetype) {
    const learned = pickLearnableArchetype(state.role, state.pool, rng);
    if (learned) {
      state.pool.push(learned);
      suffix += " Tu ajoutes un nouveau style à ton répertoire.";
    }
  }

  if (choice.collapsesOrg) {
    state.orgCollapsed = true;
    suffix += " La structure fermera ses portes : tu seras libre à la fin de la saison.";
  }

  if (state.currentArcId) {
    advanceArc(state, state.currentArcId, choice.arcNext);
  }

  return { suffix, extra };
}

/** Applique le choix d'une étape de fil narratif. */
export function resolveArcChoice(input: PlayerState, choiceId: string): PlayerState {
  if (input.status !== "arc" || !input.currentArcStep) return input;
  const state = cloneState(input);
  const rng = new Rng(state.rngState);
  const step = state.currentArcStep!;
  const choice = step.choices.find((c) => c.id === choiceId);
  if (!choice) return input;

  let resultText = choice.resultText;
  let effects = choice.effects;
  let gambleWon: boolean | undefined;

  if (choice.risk) {
    gambleWon = rng.chance(riskChance(choice.risk, state.stats));
    const branch = gambleWon ? choice.risk.success : choice.risk.failure;
    effects = { ...choice.effects, ...branch.effects };
    resultText = branch.text;
  }

  const outcome = applyChoiceEffects(state, choice, effects, rng);
  state.currentArcStep = null;
  state.currentArcId = null;
  state.lastOutcome = { choiceLabel: choice.label, resultText: resultText + outcome.suffix, effects, gambleWon, ...outcome.extra };
  state.status = "event_result";
  state.rngState = rng.state;
  return state;
}

/** Applique le choix d'un moment décisif (draft ou call en jeu). */
export function resolveClutch(input: PlayerState, choiceId: string): PlayerState {
  if (input.status !== "clutch" || !input.currentClutch) return input;
  const state = cloneState(input);
  const rng = new Rng(state.rngState);
  const moment = state.currentClutch!;
  const choice = moment.choices.find((c) => c.id === choiceId);
  if (!choice) return input;

  let resultText = choice.resultText;
  let effects = choice.effects;
  let perfDelta = choice.perfDelta ?? 0;
  let gambleWon: boolean | undefined;

  if (choice.risk) {
    gambleWon = rng.chance(riskChance(choice.risk, state.stats));
    const branch = gambleWon ? choice.risk.success : choice.risk.failure;
    effects = { ...choice.effects, ...branch.effects };
    resultText = branch.text;
    perfDelta = branch.perfDelta ?? 0;
  }

  const wasted = applyEffect(state, effects);
  state.clutchDelta += perfDelta;
  state.lastOutcome = {
    choiceLabel: choice.label,
    resultText,
    effects,
    gambleWon,
    perfDelta,
    ...(wasted > 0 ? { skillWasted: wasted } : {}),
  };
  state.status = "clutch_result";
  state.rngState = rng.state;
  return state;
}

/** Retient une offre de contrat et enchaîne sur la saison suivante. */
export function chooseOffer(input: PlayerState, offerId: string): PlayerState {
  if (input.status !== "transfer_choice") return input;
  const state = cloneState(input);
  const rng = new Rng(state.rngState);
  const offer: Offer | undefined = state.offers.find((o) => o.id === offerId);
  if (offer) acceptOffer(state, offer);
  state.offers = [];
  beginSeason(state, rng);
  state.rngState = rng.state;
  return state;
}

/** Retient une voie de reconversion et clôt la carrière. */
export function chooseEpilogue(input: PlayerState, pathId: string): PlayerState {
  if (input.status !== "epilogue") return input;
  const state = cloneState(input);
  state.epiloguePathId = pathId;
  state.finalResult = computeFinalResult(state);
  state.status = "finished";
  return state;
}

/** Fait avancer le jeu depuis un écran intermédiaire (résultat, bilan…). */
export function next(input: PlayerState): PlayerState {
  const state = cloneState(input);
  const rng = new Rng(state.rngState);

  switch (state.status) {
    case "patch_notes":
      enterPhase(state, "preseason", rng);
      break;
    case "event_result":
      if (state.pendingEventIds.length > 0) popNextEvent(state);
      else startPhaseOutcome(state, rng);
      break;
    case "arc":
      break; // en attente du choix du joueur
    case "clutch_result":
      if (state.clutchQueue.length > 0) popNextClutch(state);
      else finishPhase(state, (state.pendingMargin ?? 0) + state.clutchDelta, rng);
      break;
    case "phase_result": {
      const nxt = nextPhaseAfter(state);
      if (nxt === null) endSeason(state, rng);
      else enterPhase(state, nxt, rng);
      break;
    }
    case "season_summary":
      if (state.retired) state.status = "epilogue";
      else openTransferWindow(state, rng);
      break;
    default:
      break; // 'event', 'clutch', 'transfer_choice', 'epilogue', 'finished'
  }

  state.rngState = rng.state;
  return state;
}

export { metaDelta };
