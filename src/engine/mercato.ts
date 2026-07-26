import { TEAMS, getTeam } from "@/data/teams";
import type { PlayerState, Team } from "./types";
import type { Rng } from "./rng";
import { clamp } from "./util";

// Le mercato : les effectifs ne sont pas gravés dans le marbre. Chaque hiver,
// une équipe se renforce, une autre perd ses titulaires. Sans ça, rester dans
// son club offrait exactement les mêmes arguments saison après saison — et une
// équipe « qui monte » n'existait nulle part.

/** Amplitude maximale d'un mouvement de mercato sur une seule intersaison. */
const MAX_SWING = 9;
/** Écart maximal cumulé par rapport au prestige d'origine. */
const MAX_DRIFT = 18;
/** Force du retour à la moyenne : une équipe ne dérive pas indéfiniment. */
const REVERSION = 0.25;

/** Prestige réel d'une équipe, mercato compris. */
export function teamPrestige(state: PlayerState, teamId: string): number {
  const base = getTeam(teamId)?.prestige ?? 40;
  return clamp(base + (state.teamDeltas[teamId] ?? 0), 20, 96);
}

/** Prestige de l'équipe du joueur. */
export function currentPrestige(state: PlayerState): number {
  return teamPrestige(state, state.teamId);
}

/** Ce que le mercato a fait à cette équipe : positif = renforcée. */
export function teamTrend(state: PlayerState, teamId: string): number {
  return state.teamDeltas[teamId] ?? 0;
}

/** La phrase à afficher sur cette équipe cet hiver, s'il y a de quoi le dire. */
export function teamNote(state: PlayerState, teamId: string): string | null {
  return state.teamNotes[teamId] ?? null;
}

const REINFORCED = [
  "a recruté deux titulaires cet hiver",
  "s'est offert un coach reconnu",
  "a mis les moyens sur le mercato",
  "a récupéré une star en fin de contrat",
  "a promu deux joueurs très attendus de son académie",
];

const WEAKENED = [
  "a perdu son joueur star, parti à l'étranger",
  "a vu deux titulaires claquer la porte",
  "n'a pas retenu son coach",
  "a dû vendre pour équilibrer ses comptes",
  "sort d'un hiver blanc, sans recrue",
];

/**
 * Fait bouger tout le marché d'une intersaison. Les mouvements sont tirés au
 * RNG seedé, donc reproductibles, et ramenés vers le prestige d'origine pour
 * qu'aucune équipe ne dérive sans fin.
 */
export function runMercato(state: PlayerState, rng: Rng): void {
  state.teamNotes = {};

  for (const team of TEAMS) {
    const drift = state.teamDeltas[team.id] ?? 0;

    // Retour à la moyenne uniquement : sans lui, les gros clubs gonflaient
    // saison après saison jusqu'à écraser tout le monde.
    const swing = rng.range(-MAX_SWING, MAX_SWING) - drift * REVERSION;
    const next = clamp(Math.round(drift + swing), -MAX_DRIFT, MAX_DRIFT);

    state.teamDeltas[team.id] = next;

    // On ne commente que les mouvements marquants : le bruit de fond n'intéresse
    // personne, et noyer le joueur d'infos ne l'aide pas à choisir.
    const move = next - drift;
    if (move >= 5) state.teamNotes[team.id] = rng.pick(REINFORCED);
    else if (move <= -5) state.teamNotes[team.id] = rng.pick(WEAKENED);
  }
}

/** Équipes classées par prestige réel, mercato compris. */
export function sortByPrestige(state: PlayerState, teams: Team[]): Team[] {
  return [...teams].sort((a, b) => teamPrestige(state, b.id) - teamPrestige(state, a.id));
}
