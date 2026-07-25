import { CALL_MOMENTS, DRAFT_MOMENTS, getClutchMoment } from "@/data/clutch.fr";
import { archetypeLabel } from "@/data/archetypes";
import type { ChoiceOutcome, ClutchMoment, ClutchStage, PlayerState } from "./types";
import type { Rng } from "./rng";
import { banOutRisk } from "./meta";
import { applyEffect } from "./util";

// Séquence d'un moment décisif : une draft puis un call en jeu. Le joueur y
// gagne (ou y perd) une marge de performance avant que le classement ne tombe.

function eligible(m: ClutchMoment, state: PlayerState, stage: ClutchStage): boolean {
  if (m.stages && !m.stages.includes(stage)) return false;
  if (m.roles && !m.roles.includes(state.role)) return false;
  return true;
}

/** Construit la séquence de moments décisifs pour une échéance donnée. */
export function buildClutchQueue(state: PlayerState, stage: ClutchStage, rng: Rng): string[] {
  const drafts = DRAFT_MOMENTS.filter((m) => eligible(m, state, stage));
  const calls = CALL_MOMENTS.filter((m) => eligible(m, state, stage));

  const queue: string[] = [];
  const draft = rng.weightedPick(drafts, (m) => m.weight ?? 1);
  if (draft) queue.push(draft.id);
  const call = rng.weightedPick(calls, (m) => m.weight ?? 1);
  if (call) queue.push(call.id);
  return queue;
}

export function loadClutch(id: string): ClutchMoment | null {
  return getClutchMoment(id) ?? null;
}

/**
 * Malus de draft appliqué avant la séquence : un pool étroit se fait bannir ses
 * champions. C'est ce qui rend l'investissement dans la polyvalence payant.
 */
export function draftPenalty(state: PlayerState, rng: Rng): { delta: number; note: string | null } {
  if (rng.chance(banOutRisk(state))) {
    const narrow = state.pool.length <= 2;
    return {
      delta: narrow ? -7 : -3,
      note: `🚫 Ils ont banni ${archetypeLabel(state.signature)} — ton style de prédilection est hors de la table.`,
    };
  }
  return { delta: 0, note: null };
}

/**
 * Applique le choix d'un moment décisif. Gère les paris (`risk`) via le RNG
 * seedé et renvoie le retour à afficher plus la marge gagnée.
 */
export function resolveClutchChoice(
  state: PlayerState,
  choiceId: string,
  rng: Rng,
): { outcome: ChoiceOutcome; perfDelta: number } | null {
  const moment = state.currentClutch;
  if (!moment) return null;
  const choice = moment.choices.find((c) => c.id === choiceId);
  if (!choice) return null;

  if (choice.risk) {
    const won = rng.chance(choice.risk.chance);
    const branch = won ? choice.risk.success : choice.risk.failure;
    applyEffect(state, { ...choice.effects, ...branch.effects });
    return {
      outcome: {
        choiceLabel: choice.label,
        resultText: branch.text,
        effects: { ...choice.effects, ...branch.effects },
        gambleWon: won,
        perfDelta: branch.perfDelta ?? 0,
      },
      perfDelta: branch.perfDelta ?? 0,
    };
  }

  applyEffect(state, choice.effects);
  return {
    outcome: {
      choiceLabel: choice.label,
      resultText: choice.resultText,
      effects: choice.effects,
      perfDelta: choice.perfDelta ?? 0,
    },
    perfDelta: choice.perfDelta ?? 0,
  };
}

/** Compétition correspondant à la phase, pour filtrer les moments décisifs. */
export function stageForPhase(phase: PlayerState["phase"]): ClutchStage {
  if (phase === "msi") return "msi";
  if (phase === "worlds") return "worlds";
  return "split";
}
