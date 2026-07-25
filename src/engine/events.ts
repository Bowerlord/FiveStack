import { EVENTS } from "@/data/events.fr";
import type { GameEvent, Phase, PlayerState } from "./types";
import type { Rng } from "./rng";

// Nombre d'événements tirés par phase.
const EVENTS_PER_PHASE: Record<Phase, number> = {
  preseason: 1,
  spring: 2,
  summer: 2,
  msi: 1,
  worlds: 1,
};

function isEligible(event: GameEvent, state: PlayerState, phase: Phase): boolean {
  if (event.phases && !event.phases.includes(phase)) return false;
  if (event.minAge !== undefined && state.age < event.minAge) return false;
  if (event.maxAge !== undefined && state.age > event.maxAge) return false;
  if (event.roles && !event.roles.includes(state.role)) return false;
  if (state.usedEventIds.includes(event.id)) return false;
  return true;
}

/**
 * Tire les événements de la phase courante. Mute `state.usedEventIds` et renvoie
 * les identifiants sélectionnés (tirage pondéré, sans répétition sur la saison).
 */
export function drawEvents(state: PlayerState, phase: Phase, rng: Rng): string[] {
  const count = EVENTS_PER_PHASE[phase];
  const pool = EVENTS.filter((e) => isEligible(e, state, phase));
  const chosen: string[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const pick = rng.weightedPick(pool, (e) => e.weight ?? 1);
    if (!pick) break;
    chosen.push(pick.id);
    state.usedEventIds.push(pick.id);
    const idx = pool.indexOf(pick);
    if (idx >= 0) pool.splice(idx, 1);
  }

  return chosen;
}

export function getEvent(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
