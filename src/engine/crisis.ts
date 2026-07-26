import { CRISES } from "@/data/crises.fr";
import type { Arc, ArcStep, PlayerState, Phase } from "./types";
import { matchesContext } from "./context";

// Une jauge qui touche le fond n'est pas qu'un chiffre rouge dans l'interface.
// Elle déclenche un fil de crise, tout de suite, et certaines de ses issues
// mettent un terme à la carrière. Contrairement aux arcs ordinaires, une crise
// ne se tire pas au hasard : elle s'impose, et elle passe devant tout le reste.

/**
 * La crise à jouer maintenant, s'il y en a une. Une même crise ne se déclenche
 * qu'une fois par carrière : les jauges basses sont fréquentes, on ne va pas
 * rejouer la même scène à chaque saison difficile.
 */
export function pickCrisis(
  state: PlayerState,
  phase: Phase,
): { arc: Arc; step: ArcStep } | null {
  for (const arc of CRISES) {
    if (state.completedArcs.includes(arc.id)) continue;
    // Une crise déjà en cours est gérée par le mécanisme d'arcs habituel.
    if (state.activeArcs.some((a) => a.arcId === arc.id)) continue;
    if (arc.trigger && !matchesContext(arc.trigger, state, phase)) continue;

    const entry = arc.steps.find((s) => s.id === arc.entry);
    if (!entry || !matchesContext(entry, state, phase)) continue;

    return { arc, step: entry };
  }
  return null;
}

/** Une crise est-elle en train de menacer la carrière ? Sert à l'affichage. */
export function isCrisisArc(arcId: string | null): boolean {
  if (!arcId) return false;
  return CRISES.some((c) => c.id === arcId);
}
