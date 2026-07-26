import { ARCS, getArc } from "@/data/arcs.fr";
import type { ActiveArc, ArcStep, PlayerState, Phase } from "./types";
import type { Rng } from "./rng";
import { matchesContext } from "./context";

// Les fils narratifs : une histoire qui te suit de saison en saison. Une
// rivalité, un poignet qu'on a trop longtemps ignoré, un mentor. Chaque fil a
// plusieurs issues — et elles ne sont pas toutes heureuses.

/** Étape d'arc à jouer maintenant, s'il y en a une d'échue et pertinente. */
export function dueArcStep(
  state: PlayerState,
  phase: Phase,
): { arcId: string; step: ArcStep } | null {
  for (const active of state.activeArcs) {
    if (state.season < active.dueSeason) continue;
    const arc = getArc(active.arcId);
    const step = arc?.steps.find((s) => s.id === active.stepId);
    if (!step) continue;
    // Une étape peut attendre la bonne phase (une finale, une pré-saison…).
    if (!matchesContext(step, state, phase)) continue;
    return { arcId: active.arcId, step };
  }
  return null;
}

/** Tente de démarrer un nouveau fil narratif, si le contexte s'y prête. */
export function maybeStartArc(state: PlayerState, phase: Phase, rng: Rng): ArcStep | null {
  // Un seul fil à la fois : deux histoires en parallèle deviennent illisibles.
  if (state.activeArcs.length > 0) return null;

  const candidates = ARCS.filter((arc) => {
    if (state.completedArcs.includes(arc.id)) return false;
    if (arc.trigger && !matchesContext(arc.trigger, state, phase)) return false;
    const entry = arc.steps.find((s) => s.id === arc.entry);
    return entry !== undefined && matchesContext(entry, state, phase);
  });

  if (candidates.length === 0) return null;
  if (!rng.chance(0.55)) return null; // les histoires ne démarrent pas toutes en même temps

  const arc = rng.weightedPick(candidates, (a) => a.weight ?? 1);
  if (!arc) return null;
  const entry = arc.steps.find((s) => s.id === arc.entry)!;

  state.activeArcs.push({ arcId: arc.id, stepId: arc.entry, dueSeason: state.season });
  state.currentArcId = arc.id;
  return entry;
}

/**
 * Applique la suite d'un fil après un choix : étape suivante (éventuellement
 * différée de quelques saisons) ou clôture du fil.
 */
export function advanceArc(
  state: PlayerState,
  arcId: string,
  next: { stepId: string | null; delaySeasons?: number } | undefined,
): void {
  const idx = state.activeArcs.findIndex((a) => a.arcId === arcId);
  if (idx < 0) return;

  if (!next || next.stepId === null) {
    state.activeArcs.splice(idx, 1);
    if (!state.completedArcs.includes(arcId)) state.completedArcs.push(arcId);
    return;
  }

  state.activeArcs[idx] = {
    arcId,
    stepId: next.stepId,
    dueSeason: state.season + (next.delaySeasons ?? 0),
  };
}

/** Libellé du fil en cours, pour le rappeler au joueur. */
export function arcLabel(arcId: string): string {
  return getArc(arcId)?.label ?? "";
}
