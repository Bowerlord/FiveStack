import type { Risk, Stats } from "./types";
import { clamp } from "./util";

// Un pari n'est pas une pièce qu'on lance : sa réussite dépend de ce que vaut
// le joueur. Le smite volé se joue sur le niveau de jeu, l'engage surprise sur
// la cohésion de l'équipe, le play héroïque de fin de partie sur la fraîcheur.

/** Statistique de référence : au-dessus, le pari devient plus sûr ; en dessous, plus risqué. */
const PIVOT = 60;

/** Combien un point de statistique déplace la probabilité. */
const PER_POINT = 0.006;

const MIN_CHANCE = 0.12;
const MAX_CHANCE = 0.92;

/** Statistique qui gouverne un pari (le niveau de jeu par défaut). */
export function riskStat(risk: Risk): keyof Stats {
  return risk.stat ?? "skill";
}

/**
 * Probabilité réelle de réussite, une fois la statistique prise en compte.
 * Bornée pour qu'un pari reste un pari : même au sommet, ça peut rater.
 */
export function riskChance(risk: Risk, stats: Stats): number {
  const value = stats[riskStat(risk)];
  return clamp(risk.chance + (value - PIVOT) * PER_POINT, MIN_CHANCE, MAX_CHANCE);
}

/** Pourcentage arrondi, pour l'affichage. */
export function riskPercent(risk: Risk, stats: Stats): number {
  return Math.round(riskChance(risk, stats) * 100);
}
