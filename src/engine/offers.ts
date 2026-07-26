import { getLeague, getTeam, getTeamsByTier } from "@/data/teams";
import { homeRegion, sameMarket } from "@/data/attributes";
import type { Offer, OfferKind, PlayerState, Team } from "./types";
import type { Rng } from "./rng";
import { applyEffect } from "./util";
import { totalTitles } from "./context";
import { sortByPrestige, teamNote, teamPrestige, teamTrend } from "./mercato";

// À l'intersaison, le joueur ne subit plus son transfert : il reçoit des offres
// et tranche. Les arguments de chaque offre sont dérivés des données réelles de
// l'équipe — prestige du moment, mouvements du mercato, santé financière, niveau
// de ligue, place à prendre — au lieu d'être des formules figées.

/**
 * Attractivité du joueur sur le marché. Le niveau de jeu domine, la notoriété
 * aide, et le palmarès pèse : un double champion de sa régionale se fait
 * repérer, même si son niveau brut n'est pas encore celui de l'élite.
 */
export function desirability(state: PlayerState): number {
  const p = state.palmares;
  const record = Math.min(
    9,
    p.splitsWon * 1.5 + p.msiWon * 2.5 + p.worldsWon * 4 + p.worldsAppearances * 1,
  );
  return state.stats.skill * 0.8 + state.stats.reputation * 0.2 + record;
}

function salaryFor(prestige: number, isMajor: boolean, reputation: number): number {
  const base = isMajor ? 60000 : 15000;
  return Math.round(base * (0.5 + reputation / 100) * (0.7 + prestige / 100));
}

/**
 * Le joueur serait-il un import dans cette ligue ? Il faut à la fois une
 * barrière régionale et un vrai changement de marché : passer d'un club de LCK
 * à un autre club de LCK n'est pas un départ à l'étranger, et un Coréen qui
 * rentre en LCK revient chez lui.
 */
function moveKind(state: PlayerState, target: Team): { isImport: boolean; isHomecoming: boolean } {
  const from = getLeague(state.leagueId);
  const to = getLeague(target.leagueId);
  if (!to) return { isImport: false, isHomecoming: false };

  const home = homeRegion(state.nationalityId);
  const staysInMarket = from ? sameMarket(from.region, to.region) : false;
  const goesHome = sameMarket(to.region, home);

  return {
    isImport: to.importBarrier === true && !staysInMarket && !goesHome,
    isHomecoming: !staysInMarket && goesHome,
  };
}

// ──────────────────  Arguments dérivés des données de l'équipe  ──────────────────

function prestigeArgument(prestige: number): string {
  if (prestige >= 85) return "Un des tout meilleurs effectifs du monde";
  if (prestige >= 72) return "Effectif taillé pour les phases finales";
  if (prestige >= 55) return "Roster solide, sans star écrasante";
  if (prestige >= 40) return "Équipe de milieu de tableau";
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
function roleArgument(prestige: number, d: number): string {
  if (d >= prestige + 12) return "Tu arrives comme la pièce maîtresse du projet";
  if (d >= prestige - 4) return "Titulaire indiscutable dès la pré-saison";
  return "Place à gagner : la concurrence sera réelle";
}

/** Ce que le mercato vient de faire à cette équipe : la vraie info du moment. */
function mercatoArgument(
  state: PlayerState,
  teamId: string,
): { text: string; good: boolean } | null {
  const note = teamNote(state, teamId);
  if (!note) return null;
  const team = getTeam(teamId);
  return { text: `${team?.name ?? "L'équipe"} ${note}`, good: teamTrend(state, teamId) >= 0 };
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
  const prestige = teamPrestige(state, team.id);
  const stability = stabilityNote(team);
  const { isImport, isHomecoming } = moveKind(state, team);

  const pros = [
    prestigeArgument(prestige),
    leagueArgument(team.leagueId),
    roleArgument(prestige, d),
  ];
  const cons: string[] = [];

  if (stability.good) pros.push(stability.text);
  else cons.push(stability.text);

  // Le mouvement de mercato est l'argument le plus parlant : il change à chaque
  // intersaison, contrairement au prestige de fond.
  const mercato = mercatoArgument(state, team.id);
  if (mercato) (mercato.good ? pros : cons).push(mercato.text);

  if (isImport) cons.push("Langue et éloignement : l'alchimie repart de très bas");
  if (isHomecoming) pros.push("Tu rentres au pays : ni visa, ni barrière de langue");
  if (prestige >= 80) cons.push("Une saison sans titre y serait vue comme un échec");
  if (seed.chemistry !== undefined && !isHomecoming) {
    cons.push("Nouveau roster : tout est à reconstruire");
  }

  pros.push(...(seed.extraPros ?? []));
  cons.push(...(seed.extraCons ?? []));

  return {
    id: `${seed.kind}_${team.id}`,
    kind: seed.kind,
    teamId: team.id,
    teamName: team.name,
    leagueName: league?.name ?? "—",
    salary: Math.round(
      salaryFor(prestige, isMajor, state.stats.reputation) * (seed.salaryMultiplier ?? 1),
    ),
    pros,
    cons,
    effects: seed.effects ?? {},
    chemistryOnArrival: seed.chemistry,
  };
}

/**
 * L'offre de prolongation. Ses arguments changent d'une saison à l'autre : ce
 * que le club vient de faire au mercato, ton ancienneté, ton statut dans le
 * groupe, la saison que vous venez de vivre.
 */
function buildStayOffer(state: PlayerState, current: Team, d: number): Offer {
  const league = getLeague(current.leagueId)!;
  const prestige = teamPrestige(state, current.id);
  const trend = teamTrend(state, current.id);
  const loyalty = Math.min(10, 2 + state.seasonsAtTeam * 2);

  const pros = [`Alchimie préservée (+${loyalty} chimie)`];
  const cons: string[] = [];

  // Ce qui vient de se passer au mercato : l'argument qui bouge vraiment.
  const mercato = mercatoArgument(state, current.id);
  if (mercato) (mercato.good ? pros : cons).push(mercato.text);
  else if (trend >= 6) pros.push("L'effectif monte en puissance depuis ton arrivée");
  else if (trend <= -6) cons.push("Le niveau de l'effectif s'érode saison après saison");
  else pros.push("Un groupe stable, que tu connais par cœur");

  if (state.titlesThisSeason >= 2) pros.push("Le groupe qui a tout gagné cette année reste soudé");
  else if (state.titlesThisSeason === 1) pros.push("Vous venez de gagner ensemble : la dynamique est là");
  else if (totalTitles(state) > 0) pros.push("Vous avez déjà gagné ensemble par le passé");

  if (state.seasonsAtTeam >= 4) pros.push("Tu es une figure du club, avec le poids qui va avec");
  else if (state.seasonsAtTeam >= 2) pros.push("Tu n'as plus rien à prouver en interne");

  if (d >= prestige + 14) cons.push("Tu es devenu trop fort pour cet effectif");
  if (prestige < 50 && league.tier === "ERL") {
    cons.push("Rester ici, c'est repousser d'un an ton passage en ligue majeure");
  }
  if (current.stability < 45) {
    cons.push("Structure fragile, dont tu connais déjà les retards de paiement");
  }
  cons.push("Pas de prime à la signature");

  return {
    id: "stay",
    kind: "stay",
    teamId: current.id,
    teamName: current.name,
    leagueName: league.name,
    salary: salaryFor(prestige, league.tier === "MAJOR", state.stats.reputation),
    pros,
    cons,
    effects: { chimie: loyalty, morale: 3 },
  };
}

/** Construit les propositions de contrat de l'intersaison. */
export function buildOffers(state: PlayerState, rng: Rng): Offer[] {
  const offers: Offer[] = [];
  const d = desirability(state);
  const current = getTeam(state.teamId);
  const currentLeague = getLeague(state.leagueId);
  if (!current || !currentLeague) return offers;

  // ── Rester. Impossible si la structure a coulé.
  if (!state.orgCollapsed) offers.push(buildStayOffer(state, current, d));

  const majors = getTeamsByTier("MAJOR").filter((t) => t.id !== state.teamId);
  const home = homeRegion(state.nationalityId);

  // Les régionales proposées restent celles de ton marché : une équipe de LDL ne
  // démarche pas un joueur qui n'a jamais quitté l'Europe.
  const erls = getTeamsByTier("ERL").filter((t) => {
    if (t.id === state.teamId) return false;
    const region = getLeague(t.leagueId)?.region ?? "";
    return sameMarket(region, currentLeague.region) || sameMarket(region, home);
  });

  const reachable = majors.filter((t) => teamPrestige(state, t.id) <= d + 14);

  // ── Le titre ouvre les portes : un champion de sa régionale est démarché par
  // une ligue majeure, même si son niveau brut n'y est pas encore.
  if (currentLeague.tier === "ERL" && state.titlesThisSeason >= 1) {
    const localMajors = majors.filter((t) =>
      sameMarket(getLeague(t.leagueId)?.region ?? "", currentLeague.region),
    );
    const pool = localMajors.length > 0 ? localMajors : majors;
    const door = [...pool].sort((a, b) => teamPrestige(state, a.id) - teamPrestige(state, b.id))[0];
    if (door) {
      offers.push(
        buildOffer(
          state,
          {
            team: door,
            kind: "major",
            extraPros: [
              state.titlesThisSeason >= 2
                ? "Ton doublé n'est passé inaperçu de personne"
                : "Ton titre t'a mis sur la short-list des recruteurs",
              "Le grand saut, un an plus tôt que prévu",
            ],
            extraCons: ["Le niveau change d'un cran : le droit à l'erreur disparaît"],
            effects: { reputation: 6, morale: 4, communaute: 4 },
            chemistry: rng.int(32, 44),
          },
          d,
        ),
      );
    }
  }

  // ── L'élite : le meilleur effectif qui veuille bien de toi.
  if (d >= 75 && reachable.length > 0) {
    const top = sortByPrestige(state, reachable)[0];
    const { isImport, isHomecoming } = moveKind(state, top);
    offers.push(
      buildOffer(
        state,
        {
          team: top,
          kind: isImport ? "import" : isHomecoming ? "homecoming" : "major",
          extraPros: ["Objectif Worlds assumé publiquement"],
          effects: isImport
            ? { reputation: 7, morale: -8, communaute: 5 }
            : { reputation: 5, morale: -4, communaute: 3 },
          chemistry: isImport ? rng.int(22, 34) : isHomecoming ? rng.int(46, 58) : rng.int(34, 48),
        },
        d,
      ),
    );
  }

  // ── Un projet à bâtir : plus d'argent, moins de titres.
  const rebuilding = reachable.filter((t) => teamPrestige(state, t.id) < 72);
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
          chemistry: rng.int(38, 50),
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
          chemistry: rng.int(54, 66),
        },
        d,
      ),
    );
  }

  // ── Rôle de vétéran-guide : moins de projecteurs, plus de responsabilités.
  const youngProjects = majors.filter((t) => {
    const p = teamPrestige(state, t.id);
    return p >= 55 && p < 75;
  });
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
          chemistry: rng.int(48, 60),
        },
        d,
      ),
    );
  }

  // ── Redescendre en régionale : se relancer quand l'élite ne veut plus.
  if (d < 58 && currentLeague.tier === "MAJOR" && erls.length > 0) {
    const t = sortByPrestige(state, erls)[0];
    offers.push(
      buildOffer(
        state,
        {
          team: t,
          kind: "erl",
          extraPros: ["Tu y redeviens la référence", "Pression nettement allégée"],
          effects: { morale: 8, reputation: -4 },
          chemistry: rng.int(46, 60),
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
        { team: t, kind: "erl", effects: { morale: 2 }, chemistry: rng.int(42, 56) },
        d,
      ),
    );
  }

  // ── Filet de sécurité : un joueur libre dont la structure a coulé doit
  // toujours avoir au moins une porte de sortie, même modeste.
  if (offers.length === 0) {
    const fallback =
      erls.length > 0 ? erls : getTeamsByTier("ERL").filter((t) => t.id !== state.teamId);
    const last = [...fallback].sort(
      (a, b) => teamPrestige(state, a.id) - teamPrestige(state, b.id),
    )[0];
    if (last) {
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
            chemistry: rng.int(42, 54),
          },
          d,
        ),
      );
    }
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
        ? `✈️ Départ à l'étranger : tu signes chez ${offer.teamName} (${offer.leagueName}).`
        : offer.kind === "homecoming"
          ? `🏠 Retour au pays : tu signes chez ${offer.teamName} (${offer.leagueName}).`
          : offer.kind === "erl"
            ? `📉 Tu rebondis chez ${offer.teamName} (${offer.leagueName}).`
            : `✍️ Nouveau contrat chez ${offer.teamName} (${offer.leagueName}).`;
  }
  state.seasonNarrative.push(state.transferNote);
}
