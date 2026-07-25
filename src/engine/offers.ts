import { getLeague, getTeam, getTeamsByTier } from "@/data/teams";
import type { Offer, PlayerState } from "./types";
import type { Rng } from "./rng";
import { applyEffect } from "./util";

// À l'intersaison, le joueur ne subit plus son transfert : il reçoit des offres
// et tranche. Chaque piste a un coût réel — l'alchimie d'équipe se reconstruit
// de zéro à chaque changement, et partir à l'étranger coûte encore plus cher.

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

/** Construit les propositions de contrat de l'intersaison. */
export function buildOffers(state: PlayerState, rng: Rng): Offer[] {
  const offers: Offer[] = [];
  const d = desirability(state);
  const current = getTeam(state.teamId);
  const currentLeague = getLeague(state.leagueId);
  if (!current || !currentLeague) return offers;

  // ── Rester : la fidélité paie en cohésion.
  const loyalty = Math.min(10, 2 + state.seasonsAtTeam * 2);
  offers.push({
    id: "stay",
    kind: "stay",
    teamId: current.id,
    teamName: current.name,
    leagueName: currentLeague.name,
    salary: salaryFor(current.prestige, currentLeague.tier === "MAJOR", state.stats.reputation),
    pros: [`Alchimie conservée (+${loyalty} chimie)`, "Aucune adaptation à faire", "Le vestiaire te connaît"],
    cons: ["Pas de prime à la signature", "Aucun changement de statut"],
    effects: { chimie: loyalty, morale: 3 },
  });

  const eligibleMajors = getTeamsByTier("MAJOR").filter(
    (t) => t.id !== state.teamId && t.prestige <= d + 14,
  );
  const eligibleErls = getTeamsByTier("ERL").filter((t) => t.id !== state.teamId);

  // ── Une grosse écurie : prestige et argent, mais la pression va avec.
  if (d >= 75 && eligibleMajors.length > 0) {
    const top = [...eligibleMajors].sort((a, b) => b.prestige - a.prestige)[0];
    const league = getLeague(top.leagueId);
    const isImport = league?.importBarrier === true;
    offers.push({
      id: `major_${top.id}`,
      kind: isImport ? "import" : "major",
      teamId: top.id,
      teamName: top.name,
      leagueName: league?.name ?? "—",
      salary: salaryFor(top.prestige, true, state.stats.reputation),
      pros: [
        `Effectif d'élite (prestige ${top.prestige})`,
        "Objectif Worlds assumé",
        "Salaire au sommet du marché",
      ],
      cons: isImport
        ? ["Barrière de la langue : alchimie très basse au départ", "Loin de chez toi (moral −)", "Pression maximale"]
        : ["Alchimie à reconstruire", "Pression et attentes énormes"],
      effects: isImport
        ? { reputation: 7, morale: -8, communaute: 5 }
        : { reputation: 5, morale: -4, communaute: 3 },
      chemistryOnArrival: isImport ? rng.int(18, 28) : rng.int(30, 45),
    });
  }

  // ── Un projet en reconstruction : du temps de jeu et de l'argent, peu de titres.
  const rebuild = eligibleMajors.filter((t) => t.prestige < 72);
  if (d >= 66 && rebuild.length > 0) {
    const t = rng.pick(rebuild);
    const league = getLeague(t.leagueId);
    offers.push({
      id: `rebuild_${t.id}`,
      kind: "rebuild",
      teamId: t.id,
      teamName: t.name,
      leagueName: league?.name ?? "—",
      salary: Math.round(salaryFor(t.prestige, true, state.stats.reputation) * 1.3),
      pros: ["Salaire surévalué", "Rôle central garanti", "Projet construit autour de toi"],
      cons: ["Effectif limité", "Peu de chances de titre à court terme", "Alchimie à créer"],
      effects: { reputation: 2, argent: 15000 },
      chemistryOnArrival: rng.int(35, 50),
    });
  }

  // ── Redescendre en régionale : se relancer quand le haut niveau ne veut plus.
  if (d < 58 && currentLeague.tier === "MAJOR" && eligibleErls.length > 0) {
    const t = [...eligibleErls].sort((a, b) => b.prestige - a.prestige)[0];
    const league = getLeague(t.leagueId);
    offers.push({
      id: `erl_${t.id}`,
      kind: "erl",
      teamId: t.id,
      teamName: t.name,
      leagueName: league?.name ?? "—",
      salary: salaryFor(t.prestige, false, state.stats.reputation),
      pros: ["Tu redeviens la star de l'équipe", "Moins de pression, moral préservé", "Temps de jeu assuré"],
      cons: ["Plus aucune chance de Worlds", "Salaire divisé", "Retour en arrière assumé"],
      effects: { morale: 8, reputation: -4 },
      chemistryOnArrival: rng.int(45, 60),
    });
  }

  // ── Une régionale ambitieuse pour un joueur encore en développement.
  if (currentLeague.tier === "ERL" && d < 75 && eligibleErls.length > 0 && rng.chance(0.6)) {
    const t = rng.pick(eligibleErls);
    const league = getLeague(t.leagueId);
    offers.push({
      id: `erl_${t.id}`,
      kind: "erl",
      teamId: t.id,
      teamName: t.name,
      leagueName: league?.name ?? "—",
      salary: salaryFor(t.prestige, false, state.stats.reputation),
      pros: ["Structure ambitieuse", "Un nouveau départ", `Prestige ${t.prestige}`],
      cons: ["Alchimie repartie de zéro", "Toujours pas l'élite"],
      effects: { morale: 2 },
      chemistryOnArrival: rng.int(40, 55),
    });
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
    const label =
      offer.kind === "import"
        ? `✈️ Direction la ${offer.leagueName} : tu signes chez ${offer.teamName} !`
        : offer.kind === "erl"
          ? `📉 Tu rebondis chez ${offer.teamName} (${offer.leagueName}).`
          : `✍️ Nouveau contrat chez ${offer.teamName} (${offer.leagueName}).`;
    state.transferNote = label;
  }
  state.seasonNarrative.push(state.transferNote);
}
