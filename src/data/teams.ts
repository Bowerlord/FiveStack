import type { League, Team } from "@/engine/types";
import { homeRegion, sameMarket } from "./attributes";

// Ligues fictives inspirées de l'écosystème LoL (ERL régionales + ligues majeures).
export const LEAGUES: League[] = [
  { id: "lfl", name: "LFL", tier: "ERL", region: "France", strength: 50 },
  { id: "superliga", name: "Superliga", tier: "ERL", region: "Espagne", strength: 51 },
  { id: "prime", name: "Prime League", tier: "ERL", region: "Allemagne", strength: 49 },
  // Filières de formation asiatiques : le point de départ d'un joueur coréen ou
  // chinois. Niveau plus relevé que les ERL européennes, mais aucune route vers
  // les Worlds — il faut passer par la ligue majeure de sa région.
  { id: "lck_cl", name: "LCK Challengers", tier: "ERL", region: "Corée", strength: 60 },
  { id: "ldl", name: "LDL", tier: "ERL", region: "Chine", strength: 58 },
  { id: "lec", name: "LEC", tier: "MAJOR", region: "Europe", strength: 70 },
  { id: "lck", name: "LCK", tier: "MAJOR", region: "Corée", strength: 76, importBarrier: true },
  { id: "lpl", name: "LPL", tier: "MAJOR", region: "Chine", strength: 75, importBarrier: true },
];

// Équipes fictives (noms inventés pour éviter toute marque réelle).
export const TEAMS: Team[] = [
  // ERL — équipes de départ
  { id: "sirius", name: "Sirius Academy", leagueId: "lfl", prestige: 38, stability: 45 },
  { id: "vipers", name: "Neo Vipers", leagueId: "lfl", prestige: 34, stability: 32 },
  { id: "bulls", name: "Bulldogs GC", leagueId: "superliga", prestige: 40, stability: 50 },
  { id: "comets", name: "Comètes Esport", leagueId: "superliga", prestige: 33, stability: 28 },
  { id: "wolves", name: "Wolves Rising", leagueId: "prime", prestige: 37, stability: 44 },
  { id: "ravens", name: "Ravenshold", leagueId: "prime", prestige: 32, stability: 35 },
  { id: "hanul", name: "Hanul Challengers", leagueId: "lck_cl", prestige: 46, stability: 62 },
  { id: "jinju", name: "Jinju Rookies", leagueId: "lck_cl", prestige: 41, stability: 48 },
  { id: "yulong", name: "Yulong Development", leagueId: "ldl", prestige: 44, stability: 55 },
  { id: "hanpo", name: "Hanpo Youth", leagueId: "ldl", prestige: 39, stability: 41 },

  // LEC
  { id: "titans", name: "Titans Gaming", leagueId: "lec", prestige: 74, stability: 78 },
  { id: "nova", name: "Nova Collective", leagueId: "lec", prestige: 68, stability: 62 },
  { id: "aegis", name: "Aegis Prime", leagueId: "lec", prestige: 63, stability: 40 },

  // LCK
  { id: "dragons", name: "Azure Dragons", leagueId: "lck", prestige: 88, stability: 90 },
  { id: "phoenix", name: "Phoenix Order", leagueId: "lck", prestige: 82, stability: 84 },
  { id: "seoul", name: "Seoul Sentinels", leagueId: "lck", prestige: 76, stability: 70 },

  // LPL
  { id: "empire", name: "Crimson Empire", leagueId: "lpl", prestige: 86, stability: 82 },
  { id: "nebula", name: "Nebula Squad", leagueId: "lpl", prestige: 78, stability: 58 },
];

export function getTeam(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getLeague(id: string): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

export function getStartTeams(): Team[] {
  return TEAMS.filter((t) => getLeague(t.leagueId)?.tier === "ERL");
}

/** Région d'une équipe, via sa ligue. */
export function teamRegion(teamId: string): string {
  const team = getTeam(teamId);
  return (team && getLeague(team.leagueId)?.region) ?? "Europe";
}

/**
 * Équipes de départ, celles du pays du joueur d'abord : un Coréen commence en
 * LCK Challengers, pas en LFL. Les structures étrangères restent accessibles,
 * mais s'y lancer coûte cher en adaptation.
 */
export function getStartTeamsFor(nationalityId: string): Team[] {
  const home = homeRegion(nationalityId);
  const erls = getStartTeams();
  const rank = (t: Team) => {
    const region = getLeague(t.leagueId)?.region ?? "";
    if (region === home) return 0; // son pays
    if (sameMarket(region, home)) return 1; // même marché (Europe)
    return 2; // expatriation dès les débuts
  };
  return [...erls].sort((a, b) => rank(a) - rank(b) || b.prestige - a.prestige);
}

/** Le joueur serait-il un expatrié dans cette équipe dès son arrivée ? */
export function isExpatriation(nationalityId: string, teamId: string): boolean {
  return !sameMarket(teamRegion(teamId), homeRegion(nationalityId));
}

export function getTeamsByTier(tier: League["tier"]): Team[] {
  return TEAMS.filter((t) => getLeague(t.leagueId)?.tier === tier);
}
