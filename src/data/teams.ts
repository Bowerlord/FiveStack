import type { League, Team } from "@/engine/types";

// Ligues fictives inspirées de l'écosystème LoL (ERL régionales + ligues majeures).
export const LEAGUES: League[] = [
  { id: "lfl", name: "LFL", tier: "ERL", region: "France", strength: 50 },
  { id: "superliga", name: "Superliga", tier: "ERL", region: "Espagne", strength: 51 },
  { id: "prime", name: "Prime League", tier: "ERL", region: "Allemagne", strength: 49 },
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

export function getTeamsByTier(tier: League["tier"]): Team[] {
  return TEAMS.filter((t) => getLeague(t.leagueId)?.tier === tier);
}
