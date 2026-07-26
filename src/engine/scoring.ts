import { getLeague, getTeam } from "@/data/teams";
import { getEpiloguePath } from "./epilogue";
import type { FinalResult, PlayerState } from "./types";
import { clamp } from "./util";

interface Rank {
  min: number;
  rank: string;
  tagline: string;
}

// Paliers de rang (du plus prestigieux au plus modeste).
const RANKS: Rank[] = [
  { min: 92, rank: "Le GOAT", tagline: "Ton nom restera gravé dans l'histoire de l'esport." },
  { min: 80, rank: "Légende vivante", tagline: "Une carrière que les prochaines générations étudieront." },
  { min: 68, rank: "Superstar mondiale", tagline: "Tu as brillé sous les projecteurs les plus intenses." },
  { min: 55, rank: "Star régionale", tagline: "Une référence respectée dans ta ligue." },
  { min: 40, rank: "Joueur pro accompli", tagline: "Une belle carrière de joueur professionnel." },
  { min: 25, rank: "Carrière honnête", tagline: "Tu as vécu ton rêve, même sans les sommets." },
  { min: 0, rank: "Rêve inachevé", tagline: "L'aventure fut courte, mais elle valait la peine d'être tentée." },
];

export function computeFinalResult(state: PlayerState): FinalResult {
  const p = state.palmares;

  let score = 0;
  score += p.worldsWon * 10;
  score += p.msiWon * 5;
  score += p.splitsWon * 2;
  score += p.worldsAppearances * 2;
  score += p.msiAppearances * 1;
  score += p.mvpAwards * 2;
  score += p.allProSelections * 1;
  score += state.bestReputation * 0.13; // jusqu'à 16 pts
  score += state.stats.communaute * 0.06; // l'empreinte laissée sur la communauté
  score += clamp(state.stats.argent / 60000, 0, 5); // richesse (jusqu'à 5 pts)

  const peakLeague = getLeague(state.peakLeagueId);
  if (peakLeague?.tier === "MAJOR") score += 4;

  // La reconversion fait partie de la carrière : en esport, l'après compte.
  const epilogue = state.epiloguePathId ? getEpiloguePath(state.epiloguePathId) : undefined;
  if (epilogue) score += epilogue.scoreBonus;

  score = Math.round(clamp(score, 0, 100));

  const rank = RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];

  const highlights = buildHighlights(state);

  return {
    score,
    rank: rank.rank,
    tagline: rank.tagline,
    seasonsPlayed: state.season,
    peakLeagueName: peakLeague?.name ?? "—",
    palmares: p,
    highlights,
    epilogueLabel: epilogue?.label,
    epilogueNarrative: epilogue?.narrative,
  };
}

function buildHighlights(state: PlayerState): string[] {
  const p = state.palmares;
  const out: string[] = [];
  if (p.worldsWon > 0) out.push(`🏆 Champion du monde ×${p.worldsWon}`);
  if (p.msiWon > 0) out.push(`🥇 Vainqueur du MSI ×${p.msiWon}`);
  if (p.splitsWon > 0) out.push(`🏅 Split(s) remporté(s) : ${p.splitsWon}`);
  if (p.worldsAppearances > 0) out.push(`🌍 Participations aux Worlds : ${p.worldsAppearances}`);
  if (p.mvpAwards > 0) out.push(`⭐ Trophées MVP : ${p.mvpAwards}`);
  if (p.allProSelections > 0) out.push(`📋 Sélections All-Pro : ${p.allProSelections}`);
  out.push(`💰 Fortune amassée : ${state.stats.argent.toLocaleString("fr-FR")} €`);
  out.push(`📈 Cote maximale atteinte : ${state.bestReputation}/100`);
  out.push(`📣 Capital communauté : ${state.stats.communaute}/100`);
  const team = getTeam(state.teamId);
  if (team) out.push(`🎽 Dernier club : ${team.name}`);
  if (out.length === 1) out.unshift("Une carrière discrète, loin des trophées.");
  return out;
}
