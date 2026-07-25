import { ARCHETYPES, archetypeLabel, archetypesForRole } from "@/data/archetypes";
import type { Patch, PlayerState, Role } from "./types";
import type { Rng } from "./rng";

// Le patch : ce qui distingue une carrière esport de toute autre. Chaque saison,
// le jeu lui-même change — un style dominant hier peut devenir injouable demain.

const HEADLINES_BUFF = [
  "les {a} reviennent en force",
  "le retour des {a}",
  "les {a} dominent les scrims",
  "tout le monde s'arrache les {a}",
];

const HEADLINES_NERF = [
  "les {a} prennent un coup de massue",
  "la fin du règne des {a}",
  "les {a} disparaissent des drafts",
  "coup dur pour les {a}",
];

/** Tire le patch de la saison : deux archétypes renforcés, deux affaiblis. */
export function rollPatch(season: number, rng: Rng): Patch {
  const shuffled = [...ARCHETYPES].sort(() => rng.next() - 0.5);
  const buffed = shuffled.slice(0, 3).map((a) => a.id);
  const nerfed = shuffled.slice(3, 6).map((a) => a.id);

  const buffLine = rng.pick(HEADLINES_BUFF).replace("{a}", archetypeLabel(buffed[0]).toLowerCase());
  const nerfLine = rng.pick(HEADLINES_NERF).replace("{a}", archetypeLabel(nerfed[0]).toLowerCase());

  return {
    version: `${13 + Math.floor(season / 3)}.${((season * 4) % 24) + 1}`,
    buffed,
    nerfed,
    headline: `${buffLine.charAt(0).toUpperCase()}${buffLine.slice(1)}, ${nerfLine}.`,
  };
}

/**
 * Impact du patch sur la performance du joueur.
 *
 * Un pool large amortit les coups : c'est tout l'intérêt d'investir dans sa
 * polyvalence plutôt que de rester sur un seul champion fétiche.
 */
export function metaDelta(state: PlayerState): number {
  const patch = state.patch;
  if (!patch) return 0;

  let delta = 0;

  // La signature est le style le plus joué : son sort pèse le plus lourd.
  if (patch.buffed.includes(state.signature)) delta += 4;
  if (patch.nerfed.includes(state.signature)) delta -= 6;

  // Le reste du pool apporte des options de repli.
  for (const id of state.pool) {
    if (id === state.signature) continue;
    if (patch.buffed.includes(id)) delta += 2;
    if (patch.nerfed.includes(id)) delta -= 1;
  }

  // Un pool étroit rend prévisible ; un pool large ouvre des solutions de draft.
  // Plafonné : la polyvalence aide, elle ne remplace pas le niveau de jeu.
  delta += Math.min(3, Math.max(-2, (state.pool.length - 2) * 1));

  return delta;
}

/** Texte expliquant au joueur ce que le patch lui fait, concrètement. */
export function metaSummary(state: PlayerState): string {
  const patch = state.patch;
  if (!patch) return "";
  const sigBuffed = patch.buffed.includes(state.signature);
  const sigNerfed = patch.nerfed.includes(state.signature);
  const poolBuffed = state.pool.filter((id) => id !== state.signature && patch.buffed.includes(id));

  if (sigBuffed) return `🔥 Ton style de prédilection (${archetypeLabel(state.signature)}) est renforcé : la saison s'annonce belle.`;
  if (sigNerfed) {
    return state.pool.length > 2
      ? `⚠️ Ton style fétiche (${archetypeLabel(state.signature)}) est nerf, mais ton pool large te laisse des options.`
      : `🚨 Ton style fétiche (${archetypeLabel(state.signature)}) est nerf et ton pool est étroit. Ça va faire mal.`;
  }
  if (poolBuffed.length > 0) return `👍 ${archetypeLabel(poolBuffed[0])} est renforcé — tu as ça dans ton pool.`;
  return "😐 Ce patch ne change pas grand-chose pour toi.";
}

/** Choisit un archétype à apprendre, hors du pool actuel. */
export function pickLearnableArchetype(role: Role, pool: string[], rng: Rng): string | null {
  const candidates = archetypesForRole(role).filter((a) => !pool.includes(a.id));
  if (candidates.length === 0) return null;
  return rng.pick(candidates).id;
}

/** Risque d'être « ban out » en draft : un pool étroit se contre facilement. */
export function banOutRisk(state: PlayerState): number {
  if (state.pool.length >= 4) return 0.1;
  if (state.pool.length === 3) return 0.25;
  return 0.45;
}
