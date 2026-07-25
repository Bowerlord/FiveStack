import { getLeague, getTeam } from "@/data/teams";
import type { Phase, PhaseResult, PlayerState } from "./types";
import type { Rng } from "./rng";
import { metaDelta } from "./meta";
import { applyEffect } from "./util";

const PHASE_LABELS: Record<Phase, string> = {
  preseason: "Pré-saison",
  spring: "Split de printemps",
  summer: "Split d'été",
  msi: "MSI",
  worlds: "Worlds",
};

export function phaseLabel(phase: Phase): string {
  return PHASE_LABELS[phase];
}

/** Niveau à battre sur la scène internationale : l'élite mondiale ne pardonne pas. */
const WORLD_ELITE_LEVEL = 77;

/** Seuils de classement, exprimés en marge de performance. */
const CHAMPION = 15;
const FINALIST = 7;
const PLAYOFFS = 0;

/** Force compétitive du joueur pour la phase (0-100 environ, hors bruit). */
function performanceBase(state: PlayerState): number {
  const team = getTeam(state.teamId);
  const prestige = team?.prestige ?? 40;
  const s = state.stats;
  return (
    0.42 * s.skill +
    0.20 * s.chimie +
    0.13 * s.forme +
    0.05 * s.morale +
    0.20 * prestige
  );
}

export function isDomestic(phase: Phase): boolean {
  return phase === "spring" || phase === "summer";
}

/**
 * Marge de performance : ce que vaut le joueur, moins le niveau de l'opposition,
 * plus l'effet du patch en cours. Le classement n'est PAS encore décidé — le
 * joueur va d'abord trancher ses moments décisifs.
 */
export function computePhaseMargin(state: PlayerState, phase: Phase, rng: Rng): number {
  const opposition = isDomestic(phase)
    ? getLeague(state.leagueId)?.strength ?? 50
    : WORLD_ELITE_LEVEL;
  return performanceBase(state) + metaDelta(state) - opposition + rng.range(-11, 11);
}

/**
 * Le joueur a-t-il droit à une séquence de décisions ? En championnat, seulement
 * s'il atteint la finale ; en international, toujours (on y est déjà).
 */
export function isDecisiveMoment(phase: Phase, margin: number): boolean {
  return isDomestic(phase) ? margin >= FINALIST : true;
}

/** Traduit la marge finale en classement, palmarès et gains. */
export function resolvePhaseOutcome(
  state: PlayerState,
  phase: Phase,
  margin: number,
  rng: Rng,
): PhaseResult {
  const label = PHASE_LABELS[phase];
  return isDomestic(phase)
    ? resolveDomestic(state, phase, label, margin, rng)
    : resolveInternational(state, phase, label, margin, rng);
}

function winnings(state: PlayerState, base: number): number {
  const major = getLeague(state.leagueId)?.tier === "MAJOR";
  return major ? base * 5 : base;
}

function resolveDomestic(
  state: PlayerState,
  phase: Phase,
  label: string,
  R: number,
  rng: Rng,
): PhaseResult {
  applyEffect(state, { forme: -4 });
  let placementText: string;
  let detail: string;
  let qualifiedNext: string | undefined;
  const qualifiesInternational = phase === "spring" ? "MSI" : "Worlds";

  if (R >= CHAMPION) {
    placementText = `Champion du ${label.toLowerCase()} !`;
    detail = "Un run maîtrisé de bout en bout, ponctué d'une finale à sens unique.";
    state.palmares.splitsWon += 1;
    applyEffect(state, { reputation: 9, morale: 9, chimie: 4, communaute: 7, argent: winnings(state, 8000) });
    qualify(state, phase);
    if (isQualified(state, phase)) qualifiedNext = `Qualifié pour le ${qualifiesInternational}`;
    maybeAwards(state, R, rng, true);
  } else if (R >= FINALIST) {
    placementText = "Finaliste des playoffs";
    detail = "Une belle campagne stoppée aux portes du titre.";
    applyEffect(state, { reputation: 5, morale: 4, communaute: 3, argent: winnings(state, 3000) });
    qualify(state, phase);
    if (isQualified(state, phase)) qualifiedNext = `Qualifié pour le ${qualifiesInternational}`;
    maybeAwards(state, R, rng, false);
  } else if (R >= PLAYOFFS) {
    placementText = "Éliminé en playoffs";
    detail = "Vous avez atteint les playoffs sans aller au bout.";
    applyEffect(state, { reputation: 1, morale: 1 });
  } else {
    placementText = "Saison régulière ratée";
    detail = "Pas de playoffs cette fois. Il faudra se remettre en question.";
    applyEffect(state, { reputation: -3, morale: -6, chimie: -2, communaute: -3 });
  }

  state.seasonResults.push({ competition: label, placement: placementText });
  state.seasonNarrative.push(`${label} : ${placementText}`);
  return { phase, label, placementText, detail, qualifiedNext };
}

function resolveInternational(
  state: PlayerState,
  phase: Phase,
  label: string,
  R: number,
  rng: Rng,
): PhaseResult {
  applyEffect(state, { forme: -5 });
  if (phase === "msi") state.palmares.msiAppearances += 1;
  else state.palmares.worldsAppearances += 1;

  let placementText: string;
  let detail: string;
  const isWorlds = phase === "worlds";

  if (R >= (isWorlds ? 16 : 13)) {
    placementText = isWorlds ? "🏆 CHAMPION DU MONDE !" : "🥇 Vainqueur du MSI !";
    detail = "Le sommet. Une performance qui restera dans les mémoires.";
    if (isWorlds) {
      state.palmares.worldsWon += 1;
      applyEffect(state, { reputation: 22, morale: 16, communaute: 20, argent: 180000 });
    } else {
      state.palmares.msiWon += 1;
      applyEffect(state, { reputation: 12, morale: 12, communaute: 10, argent: 60000 });
    }
    maybeAwards(state, R, rng, true);
  } else if (R >= (isWorlds ? 6 : 4)) {
    placementText = isWorlds ? "Demi-finaliste mondial" : "Finaliste du MSI";
    detail = "Un parcours remarquable sur la scène internationale.";
    applyEffect(state, { reputation: 10, morale: 6, communaute: 8, argent: 30000 });
    maybeAwards(state, R, rng, false);
  } else if (R >= -4) {
    placementText = isWorlds ? "Éliminé en quarts" : "Éliminé en demi-finale";
    detail = "L'aventure s'arrête, mais l'expérience est précieuse.";
    applyEffect(state, { reputation: 5, morale: 1, communaute: 4 });
  } else {
    placementText = "Éliminé en phase de groupes";
    detail = "Le niveau mondial était un cran au-dessus cette fois.";
    applyEffect(state, { reputation: 2, morale: -4, communaute: -2 });
  }

  state.seasonResults.push({ competition: label, placement: placementText });
  state.seasonNarrative.push(`${label} : ${placementText}`);
  return { phase, label, placementText, detail };
}

/**
 * Seules les ligues majeures envoient leurs équipes en compétition
 * internationale : briller en ligue régionale ouvre la porte d'un grand club,
 * pas celle des Worlds.
 */
function qualify(state: PlayerState, phase: Phase): void {
  if (getLeague(state.leagueId)?.tier !== "MAJOR") return;
  if (phase === "spring") state.qualifiedMSI = true;
  else state.qualifiedWorlds = true;
}

function isQualified(state: PlayerState, phase: Phase): boolean {
  return phase === "spring" ? state.qualifiedMSI : state.qualifiedWorlds;
}

function maybeAwards(state: PlayerState, R: number, rng: Rng, champion: boolean): void {
  if (state.stats.skill >= 70 && R >= 14 && rng.chance(champion ? 0.4 : 0.2)) {
    state.palmares.mvpAwards += 1;
    state.palmares.allProSelections += 1;
    state.seasonNarrative.push("⭐ Élu MVP par les analystes !");
  } else if (state.stats.skill >= 62 && R >= 8 && rng.chance(0.3)) {
    state.palmares.allProSelections += 1;
    state.seasonNarrative.push("📋 Sélectionné dans l'équipe All-Pro.");
  }
}
