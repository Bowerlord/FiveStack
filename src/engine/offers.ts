import { getLeague, getTeam, getTeamsByTier } from "@/data/teams";
import type { Offer, OfferKind, PlayerState, Team } from "./types";
import type { Rng } from "./rng";
import { applyEffect } from "./util";
import { totalTitles } from "./context";

// À l'intersaison, le joueur ne subit plus son transfert : il reçoit des offres
// et tranche. Les arguments de chaque offre sont dérivés des données réelles de
// l'équipe — prestige, santé financière, niveau de ligue, place à prendre — au
// lieu d'être des formules figées : deux propositions ne se ressemblent jamais
// tout à fait.

/**
 * Attractivité du joueur sur le marché. Le niveau de jeu domine largement : la
 * notoriété aide à décrocher un essai, elle ne remplace pas la main.
 */
export function desirability(state: PlayerState): number {
  return state.stats.skill * 0.8 + state.stats.reputation * 0.2;
}

function salaryFor(prestige: number, isMajor: boolean, reputation: number): number {
  const base = isMajor ? 60000 : 15000;
  return Math.round(base * (0.5 + reputation / 100) * (0.7 + prestige / 100));
}

// ──────────────────  Arguments dérivés des données de l'équipe  ──────────────────

function prestigeArgument(team: Team): string {
  if (team.prestige >= 85) return "Un des tout meilleurs effectifs du monde";
  if (team.prestige >= 72) return "Effectif taillé pour les phases finales";
  if (team.prestige >= 55) return "Roster solide, sans star écrasante";
  if (team.prestige >= 40) return "Équipe de milieu de tableau";
  return "Effectif modeste : tout reposera sur toi";
}

function stabilityNote(team: Team): { text: string; good: boolean } {
  if (team.stability >= 78) return { text: "Structure financièrement irréprochable", good: true };
  if (team.stability >= 60) return { text: "Structure saine, salaires versés à l'heure", good: true };
  if (team.stability >= 42) return { text: "Finances correctes mais sans marge", good: false };
  if (team.stability >= 30) return { text: "Trésorerie tendue : retards de paiement déjà constatés", good: false };
  return { text: "Structure au bord du dépôt de bilan", good: false };
}

function leagueArgument(leagueId: string): string {
  const l = getLeague(leagueId);
  if (!l) return "";
  if (l.tier !== "MAJOR") return `${l.name} : aucune route vers les Worlds`;
  if (l.strength >= 75) return `${l.name} : le championnat le plus relevé du monde`;
  return `${l.name} : accès direct aux compétitions internationales`;
}

/** Place à prendre dans l'effectif, selon l'écart entre ton niveau et le leur. */
function roleArgument(team: Team, d: number): string {
  if (d >= team.prestige + 12) return "Tu arrives comme la pièce maîtresse du projet";
  if (d >= team.prestige - 4) return "Titulaire indiscutable dès la pré-saison";
  return "Place à gagner : la concurrence sera réelle";
}

interface OfferSeed {
  team: Team;
  kind: OfferKind;
  salaryMultiplier?: number;
  extraPros?: string[];
  extraCons?: string[];
  effects?: Offer["effects"];
  chemistry?: number;
}

function buildOffer(state: PlayerState, seed: OfferSeed, d: number): Offer {
  const { team } = seed;
  const league = getLeague(team.leagueId);
  const isMajor = league?.tier === "MAJOR";
  const isImport = league?.importBarrier === true;
  const stability = stabilityNote(team);

  const pros = [prestigeArgument(team), leagueArgument(team.leagueId), roleArgument(team, d)];
  const cons: string[] = [];
  if (stability.good) pros.push(stability.text);
  else cons.push(stability.text);
  if (isImport) cons.push("Langue et éloignement : l'alchimie repart de très bas");
  if (team.prestige >= 80) cons.push("Une saison sans titre y serait vue comme un échec");
  if (seed.chemistry !== undefined) cons.push("Nouveau roster : tout est à reconstruire");

  pros.push(...(seed.extraPros ?? []));
  cons.push(...(seed.extraCons ?? []));

  return {
    id: `${seed.kind}_${team.id}`,
    kind: seed.kind,
    teamId: team.id,
    teamName: team.name,
    leagueName: league?.name ?? "—",
    salary: Math.round(
      salaryFor(team.prestige, isMajor, state.stats.reputation) * (seed.salaryMultiplier ?? 1),
    ),
    pros,
    cons,
    effects: seed.effects ?? {},
    chemistryOnArrival: seed.chemistry,
  };
}

/** Construit les propositions de contrat de l'intersaison. */
export function buildOffers(state: PlayerState, rng: Rng): Offer[] {
  const offers: Offer[] = [];
  const d = desirability(state);
  const current = getTeam(state.teamId);
  const currentLeague = getLeague(state.leagueId);
  if (!current || !currentLeague) return offers;

  // ── Rester : la fidélité paie en cohésion. Impossible si la structure a coulé.
  if (!state.orgCollapsed) {
    const loyalty = Math.min(10, 2 + state.seasonsAtTeam * 2);
    const stayPros = [`Alchimie préservée (+${loyalty} chimie)`, "Aucune adaptation à refaire"];
    if (state.seasonsAtTeam >= 3) stayPros.push("Tu es devenu une figure du club");
    if (totalTitles(state) > 0) stayPros.push("Le groupe qui a gagné reste ensemble");
    offers.push({
      id: "stay",
      kind: "stay",
      teamId: current.id,
      teamName: current.name,
      leagueName: currentLeague.name,
      salary: salaryFor(current.prestige, currentLeague.tier === "MAJOR", state.stats.reputation),
      pros: stayPros,
      cons: [
        "Pas de prime à la signature",
        current.stability < 45
          ? "Structure fragile, dont tu connais déjà les retards de paiement"
          : "Aucun changement de statut ni d'ambition",
      ],
      effects: { chimie: loyalty, morale: 3 },
    });
  }

  const majors = getTeamsByTier("MAJOR").filter((t) => t.id !== state.teamId);
  const erls = getTeamsByTier("ERL").filter((t) => t.id !== state.teamId);
  const reachable = majors.filter((t) => t.prestige <= d + 14);

  // ── L'élite : le meilleur effectif qui veuille bien de toi.
  if (d >= 75 && reachable.length > 0) {
    const top = [...reachable].sort((a, b) => b.prestige - a.prestige)[0];
    const isImport = getLeague(top.leagueId)?.importBarrier === true;
    offers.push(
      buildOffer(
        state,
        {
          team: top,
          kind: isImport ? "import" : "major",
          extraPros: ["Objectif Worlds assumé publiquement"],
          effects: isImport
            ? { reputation: 7, morale: -8, communaute: 5 }
            : { reputation: 5, morale: -4, communaute: 3 },
          chemistry: isImport ? rng.int(18, 28) : rng.int(30, 45),
        },
        d,
      ),
    );
  }

  // ── Un projet à bâtir : plus d'argent, moins de titres.
  const rebuilding = reachable.filter((t) => t.prestige < 72);
  if (d >= 66 && rebuilding.length > 0) {
    const t = rng.pick(rebuilding);
    offers.push(
      buildOffer(
        state,
        {
          team: t,
          kind: "rebuild",
          salaryMultiplier: 1.35,
          extraPros: [
            "Salaire nettement au-dessus de ta valeur de marché",
            "Projet construit autour de toi",
          ],
          extraCons: ["Aucun titre à espérer avant deux ou trois saisons"],
          effects: { reputation: 2, argent: 15000 },
          chemistry: rng.int(35, 50),
        },
        d,
      ),
    );
  }

  // ── Retrouver un ancien coéquipier : l'alchimie démarre bien plus haut.
  if (state.season >= 4 && reachable.length > 0 && rng.chance(0.35)) {
    const t = rng.pick(reachable);
    offers.push(
      buildOffer(
        state,
        {
          team: t,
          kind: "major",
          extraPros: ["Tu y retrouves un ancien coéquipier — vous vous comprenez déjà"],
          effects: { morale: 6, reputation: 2 },
          chemistry: rng.int(52, 66),
        },
        d,
      ),
    );
  }

  // ── Rôle de vétéran-guide : moins de projecteurs, plus de responsabilités.
  const youngProjects = majors.filter((t) => t.prestige >= 55 && t.prestige < 75);
  if (state.age >= 24 && totalTitles(state) >= 1 && youngProjects.length > 0 && rng.chance(0.5)) {
    const t = rng.pick(youngProjects);
    offers.push(
      buildOffer(
        state,
        {
          team: t,
          kind: "rebuild",
          salaryMultiplier: 1.1,
          extraPros: ["On te veut pour encadrer une équipe très jeune", "Statut de capitaine"],
          extraCons: ["Tu ne seras plus le joueur autour duquel tout tourne"],
          effects: { chimie: 8, reputation: 3, morale: 2 },
          chemistry: rng.int(45, 58),
        },
        d,
      ),
    );
  }

  // ── Redescendre en régionale : se relancer quand l'élite ne veut plus.
  if (d < 58 && currentLeague.tier === "MAJOR" && erls.length > 0) {
    const t = [...erls].sort((a, b) => b.prestige - a.prestige)[0];
    offers.push(
      buildOffer(
        state,
        {
          team: t,
          kind: "erl",
          extraPros: ["Tu y redeviens la référence", "Pression nettement allégée"],
          effects: { morale: 8, reputation: -4 },
          chemistry: rng.int(45, 60),
        },
        d,
      ),
    );
  }

  // ── Une régionale ambitieuse pour un joueur encore en construction.
  if (currentLeague.tier === "ERL" && d < 75 && erls.length > 0 && rng.chance(0.7)) {
    const t = rng.pick(erls);
    offers.push(
      buildOffer(
        state,
        { team: t, kind: "erl", effects: { morale: 2 }, chemistry: rng.int(40, 55) },
        d,
      ),
    );
  }

  // ── Filet de sécurité : un joueur libre dont la structure a coulé doit
  // toujours avoir au moins une porte de sortie, même modeste.
  if (offers.length === 0 && erls.length > 0) {
    const last = [...erls].sort((a, b) => a.prestige - b.prestige)[0];
    offers.push(
      buildOffer(
        state,
        {
          team: last,
          kind: "erl",
          salaryMultiplier: 0.8,
          extraPros: ["Une équipe accepte de te relancer", "Temps de jeu garanti"],
          extraCons: ["Le seul contrat sur la table", "Un cran en dessous de tes ambitions"],
          effects: { morale: -4 },
          chemistry: rng.int(40, 52),
        },
        d,
      ),
    );
  }

  return offers;
}

/** Applique l'offre retenue : club, ligue, alchimie, prime de signature. */
export function acceptOffer(state: PlayerState, offer: Offer): void {
  const previousTeam = state.teamId;

  state.teamId = offer.teamId;
  const team = getTeam(offer.teamId);
  if (team) state.leagueId = team.leagueId;

  if (offer.chemistryOnArrival !== undefined) {
    state.stats.chimie = offer.chemistryOnArrival;
  }
  applyEffect(state, offer.effects);
  applyEffect(state, { argent: offer.salary });

  const league = getLeague(state.leagueId);
  const peak = getLeague(state.peakLeagueId);
  if (league && (!peak || league.strength > peak.strength)) {
    state.peakLeagueId = league.id;
  }

  if (offer.teamId === previousTeam) {
    state.seasonsAtTeam += 1;
    state.transferNote = `🤝 Tu prolonges chez ${offer.teamName} (${state.seasonsAtTeam} saisons).`;
  } else {
    state.seasonsAtTeam = 1;
    state.transferNote =
      offer.kind === "import"
        ? `✈️ Direction la ${offer.leagueName} : tu signes chez ${offer.teamName} !`
        : offer.kind === "erl"
          ? `📉 Tu rebondis chez ${offer.teamName} (${offer.leagueName}).`
          : `✍️ Nouveau contrat chez ${offer.teamName} (${offer.leagueName}).`;
  }
  state.seasonNarrative.push(state.transferNote);
}
