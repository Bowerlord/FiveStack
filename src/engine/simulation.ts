import { getLeague, getTeam } from "@/data/teams";
import type { Phase, PhaseResult, PlayerState } from "./types";
import type { Rng } from "./rng";
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

/**
 * Simule une phase compétitive : met à jour palmarès, flags de qualification,
 * statistiques et narratif, puis renvoie le résultat à afficher.
 */
export function simulatePhase(state: PlayerState, phase: Phase, rng: Rng): PhaseResult {
  const R = performanceBase(state) + rng.range(-14, 14);
  const label = PHASE_LABELS[phase];

  if (phase === "spring" || phase === "summer") {
    return simulateDomestic(state, phase, label, R, rng);
  }
  return simulateInternational(state, phase, label, R, rng);
}

function winnings(state: PlayerState, base: number): number {
  const major = getLeague(state.leagueId)?.tier === "MAJOR";
  return major ? base * 5 : base;
}

function simulateDomestic(
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

  if (R >= 74) {
    placementText = `Champion du ${label.toLowerCase()} !`;
    detail = "Un run maîtrisé de bout en bout, ponctué d'une finale à sens unique.";
    state.palmares.splitsWon += 1;
    applyEffect(state, { reputation: 9, morale: 9, chimie: 4, argent: winnings(state, 8000) });
    qualify(state, phase);
    qualifiedNext = `Qualifié pour le ${qualifiesInternational}`;
    maybeAwards(state, R, rng, true);
  } else if (R >= 61) {
    placementText = "Finaliste des playoffs";
    detail = "Une belle campagne stoppée aux portes du titre.";
    applyEffect(state, { reputation: 5, morale: 4, argent: winnings(state, 3000) });
    qualify(state, phase);
    qualifiedNext = `Qualifié pour le ${qualifiesInternational}`;
    maybeAwards(state, R, rng, false);
  } else if (R >= 49) {
    placementText = "Éliminé en playoffs";
    detail = "Vous avez atteint les playoffs sans aller au bout.";
    applyEffect(state, { reputation: 1, morale: 1 });
  } else {
    placementText = "Saison régulière ratée";
    detail = "Pas de playoffs cette fois. Il faudra se remettre en question.";
    applyEffect(state, { reputation: -3, morale: -6, chimie: -2 });
  }

  state.seasonResults.push({ competition: label, placement: placementText });
  state.seasonNarrative.push(`${label} : ${placementText}`);
  return { phase, label, placementText, detail, qualifiedNext };
}

function simulateInternational(
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

  if (R >= (isWorlds ? 82 : 80)) {
    placementText = isWorlds ? "🏆 CHAMPION DU MONDE !" : "🥇 Vainqueur du MSI !";
    detail = "Le sommet. Une performance qui restera dans les mémoires.";
    if (isWorlds) {
      state.palmares.worldsWon += 1;
      applyEffect(state, { reputation: 22, morale: 16, argent: 180000 });
    } else {
      state.palmares.msiWon += 1;
      applyEffect(state, { reputation: 12, morale: 12, argent: 60000 });
    }
    maybeAwards(state, R, rng, true);
  } else if (R >= (isWorlds ? 68 : 65)) {
    placementText = isWorlds ? "Demi-finaliste mondial" : "Finaliste du MSI";
    detail = "Un parcours remarquable sur la scène internationale.";
    applyEffect(state, { reputation: 10, morale: 6, argent: 30000 });
    maybeAwards(state, R, rng, false);
  } else if (R >= 54) {
    placementText = isWorlds ? "Éliminé en quarts" : "Éliminé en demi-finale";
    detail = "L'aventure s'arrête, mais l'expérience est précieuse.";
    applyEffect(state, { reputation: 5, morale: 1 });
  } else {
    placementText = "Éliminé en phase de groupes";
    detail = "Le niveau mondial était un cran au-dessus cette fois.";
    applyEffect(state, { reputation: 2, morale: -4 });
  }

  state.seasonResults.push({ competition: label, placement: placementText });
  state.seasonNarrative.push(`${label} : ${placementText}`);
  return { phase, label, placementText, detail };
}

function qualify(state: PlayerState, phase: Phase): void {
  if (phase === "spring") state.qualifiedMSI = true;
  else state.qualifiedWorlds = true;
}

function maybeAwards(state: PlayerState, R: number, rng: Rng, champion: boolean): void {
  if (state.stats.skill >= 68 && R >= 70 && rng.chance(champion ? 0.5 : 0.28)) {
    state.palmares.mvpAwards += 1;
    state.palmares.allProSelections += 1;
    state.seasonNarrative.push("⭐ Élu MVP par les analystes !");
  } else if (state.stats.skill >= 62 && R >= 66 && rng.chance(0.35)) {
    state.palmares.allProSelections += 1;
    state.seasonNarrative.push("📋 Sélectionné dans l'équipe All-Pro.");
  }
}
