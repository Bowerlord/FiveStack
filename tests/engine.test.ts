import { describe, it, expect } from "vitest";
import {
  startCareer,
  resolveChoice,
  resolveClutch,
  resolveArcChoice,
  chooseOffer,
  chooseEpilogue,
  next,
  Rng,
  meetsRequirements,
  missingRequirements,
  availableEpiloguePaths,
  isCrisisArc,
  type CreationChoices,
  type PlayerState,
  type Stats,
} from "@/engine";
import { buildOffers } from "@/engine/offers";
import { getStartTeamsFor } from "@/data/teams";
import { CRISES } from "@/data/crises.fr";

const CREATION: CreationChoices = {
  pseudo: "TestPlayer",
  nationalityId: "fr",
  role: "Mid",
  originId: "soloq",
  lifestyleId: "discipline",
  entourageId: "coach",
  startTeamId: "sirius",
  signatureId: "mid_control",
};

function statsInBounds(s: Stats): boolean {
  const keys: (keyof Stats)[] = ["skill", "reputation", "morale", "forme", "chimie", "communaute"];
  const ok01 = keys.every((k) => s[k] >= 0 && s[k] <= 100);
  return ok01 && s.argent >= 0;
}

/**
 * Avance d'un pas, en tranchant chaque écran interactif. `pick` choisit l'option
 * parmi celles réellement disponibles (les choix verrouillés sont exclus).
 */
function step(state: PlayerState, pick: <T>(options: T[]) => T): PlayerState {
  switch (state.status) {
    case "event": {
      const open = state.currentEvent!.choices.filter((c) =>
        meetsRequirements(state.stats, c.requires),
      );
      return resolveChoice(state, pick(open).id);
    }
    case "clutch": {
      const open = state.currentClutch!.choices.filter((c) =>
        meetsRequirements(state.stats, c.requires),
      );
      return resolveClutch(state, pick(open).id);
    }
    case "arc": {
      const open = state.currentArcStep!.choices.filter((c) =>
        meetsRequirements(state.stats, c.requires),
      );
      return resolveArcChoice(state, pick(open).id);
    }
    case "transfer_choice":
      return chooseOffer(state, pick(state.offers).id);
    case "epilogue":
      return chooseEpilogue(state, pick(availableEpiloguePaths(state)).id);
    default:
      return next(state);
  }
}

/** Joue une carrière jusqu'au bout en prenant toujours la 1re option ouverte. */
function playToEnd(seed: number): PlayerState {
  let state = startCareer(CREATION, seed);
  let guard = 0;
  while (state.status !== "finished" && guard < 5000) {
    guard++;
    state = step(state, (o) => o[0]);
    expect(statsInBounds(state.stats)).toBe(true);
  }
  expect(guard).toBeLessThan(5000);
  return state;
}

describe("startCareer", () => {
  it("initialise une carrière cohérente", () => {
    const s = startCareer(CREATION, 12345);
    expect(s.season).toBe(1);
    expect(s.age).toBe(17);
    expect(s.pseudo).toBe("TestPlayer");
    expect(s.role).toBe("Mid");
    expect(statsInBounds(s.stats)).toBe(true);
    // Le bonus « prodige SoloQ » + coach + discipline place le skill au-dessus de la base.
    expect(s.stats.skill).toBeGreaterThan(48);
  });

  it("démarre par les patch notes, puis une situation à trancher", () => {
    const s = startCareer(CREATION, 999);
    expect(s.status).toBe("patch_notes");
    expect(s.patch).not.toBeNull();
    expect(s.pool).toContain(s.signature);
    const after = next(s);
    // Un fil narratif peut prendre la main dès la première saison.
    expect(["event", "arc"]).toContain(after.status);
    const choices = after.currentEvent?.choices ?? after.currentArcStep!.choices;
    expect(choices.length).toBeGreaterThanOrEqual(2);
  });
});

describe("resolveChoice", () => {
  it("applique l'effet du choix et passe en event_result", () => {
    // On avance jusqu'à un événement classique (un arc peut passer devant).
    let s = next(startCareer(CREATION, 4242));
    let guard = 0;
    while (s.status !== "event" && guard++ < 50) {
      s = s.status === "arc" ? resolveArcChoice(s, s.currentArcStep!.choices[0].id) : next(s);
    }
    const event = s.currentEvent!;
    const choice = event.choices[0];
    const after = resolveChoice(s, choice.id);
    expect(after.status).toBe("event_result");
    expect(after.lastOutcome?.choiceLabel).toBe(choice.label);
    // Un effet positif attendu doit augmenter la stat correspondante (bornée).
    for (const [key, delta] of Object.entries(choice.effects)) {
      if (delta && delta > 0) {
        const k = key as keyof Stats;
        expect(after.stats[k]).toBeGreaterThanOrEqual(s.stats[k]);
      }
    }
    // L'état d'origine n'est pas muté (immutabilité côté appelant).
    expect(s.status).toBe("event");
  });
});

describe("potentiel", () => {
  it("plafonne le niveau de jeu quelle que soit la carrière", () => {
    for (const seed of [3, 88, 1234, 55555]) {
      const end = playToEnd(seed);
      expect(end.potential).toBeGreaterThanOrEqual(55);
      expect(end.potential).toBeLessThanOrEqual(99);
      expect(end.stats.skill).toBeLessThanOrEqual(end.potential);
    }
  });
});

describe("équilibrage", () => {
  it("ne distribue pas le score maximal à tout le monde", () => {
    // Des choix pris au hasard doivent donner une carrière moyenne, pas un
    // sans-faute : sans cela le jeu n'aurait aucun enjeu.
    const scores: number[] = [];
    for (let i = 1; i <= 60; i++) {
      const rng = new Rng(i * 7919);
      let s = startCareer(CREATION, i * 104729);
      let guard = 0;
      while (s.status !== "finished" && guard++ < 5000) {
        s = step(s, (o) => rng.pick(o));
      }
      scores.push(s.finalResult!.score);
    }
    const perfect = scores.filter((s) => s === 100).length / scores.length;
    const moyenne = scores.reduce((a, b) => a + b, 0) / scores.length;
    expect(perfect).toBeLessThan(0.2);
    expect(moyenne).toBeLessThan(70);
    expect(new Set(scores).size).toBeGreaterThan(5); // de vrais écarts entre parties
  });

  it("récompense nettement le jeu réfléchi par rapport au hasard", () => {
    // Le cœur du jeu : si bien choisir ne change rien, il n'y a pas de jeu.
    const play = (seed: number, smart: boolean) => {
      const rng = new Rng(seed);
      let s = startCareer(CREATION, seed * 31);
      let guard = 0;
      while (s.status !== "finished" && guard++ < 5000) {
        s = step(s, (options) => {
          if (!smart) return rng.pick(options);
          // Heuristique simple : viser le niveau de jeu et l'impact en match.
          const score = (o: unknown) => {
            const c = o as { effects?: Record<string, number>; perfDelta?: number };
            return (c.effects?.skill ?? 0) * 3 + (c.effects?.chimie ?? 0) * 2 + (c.perfDelta ?? 0) * 2.5;
          };
          return [...options].sort((a, b) => score(b) - score(a))[0];
        });
      }
      return s.finalResult!.score;
    };

    const avg = (smart: boolean) => {
      let total = 0;
      for (let i = 1; i <= 25; i++) total += play(i * 7919, smart);
      return total / 25;
    };

    expect(avg(true)).toBeGreaterThan(avg(false) + 8);
  });

  it("réserve les compétitions internationales aux ligues majeures", () => {
    // Un joueur de ligue régionale ne peut pas se qualifier pour le MSI/Worlds.
    for (const seed of [11, 222, 3333]) {
      let s = startCareer(CREATION, seed);
      let guard = 0;
      while (s.status !== "finished" && guard++ < 5000) {
        const erl = ["lfl", "superliga", "prime", "lck_cl", "ldl"].includes(s.leagueId);
        if (erl) expect(s.qualifiedMSI || s.qualifiedWorlds).toBe(false);
        s = step(s, (o) => o[0]);
      }
    }
  });
});

describe("nouveaux systèmes", () => {
  it("verrouille les choix dont les prérequis ne sont pas atteints", () => {
    const poor = { ...startCareer(CREATION, 5).stats, forme: 10, chimie: 10, morale: 10 };
    expect(meetsRequirements(poor, { forme: 50 })).toBe(false);
    expect(meetsRequirements(poor, { forme: 5 })).toBe(true);
    expect(missingRequirements(poor, { forme: 50, chimie: 60 })).toHaveLength(2);
  });

  it("applique un patch à chaque saison et garde la signature dans le pool", () => {
    let s = startCareer(CREATION, 777);
    const versions = new Set<string>();
    let guard = 0;
    while (s.status !== "finished" && guard++ < 5000) {
      expect(s.patch).not.toBeNull();
      expect(s.pool).toContain(s.signature);
      versions.add(s.patch!.version);
      s = step(s, (o) => o[0]);
    }
    expect(versions.size).toBeGreaterThan(1); // le jeu change au fil des saisons
  });

  it("propose toujours de rester lors du marché des transferts", () => {
    let s = startCareer(CREATION, 31337);
    let guard = 0;
    let sawTransfer = false;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "transfer_choice") {
        sawTransfer = true;
        expect(s.offers.length).toBeGreaterThan(0);
        expect(s.offers.some((o) => o.kind === "stay")).toBe(true);
      }
      s = step(s, (o) => o[0]);
    }
    expect(sawTransfer).toBe(true);
  });

  it("laisse toujours une porte de sortie à la reconversion", () => {
    let s = startCareer(CREATION, 24680);
    let guard = 0;
    let sawEpilogue = false;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "epilogue") {
        sawEpilogue = true;
        expect(availableEpiloguePaths(s).length).toBeGreaterThan(0);
      }
      s = step(s, (o) => o[0]);
    }
    expect(sawEpilogue).toBe(true);
    expect(s.finalResult!.epilogueLabel).toBeTruthy();
  });

  it("borne la séquence des moments décisifs", () => {
    let s = startCareer(CREATION, 8642);
    let guard = 0;
    let clutches = 0;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "clutch") {
        clutches++;
        expect(s.currentClutch).not.toBeNull();
        expect(s.clutchQueue.length).toBeLessThanOrEqual(2);
      }
      s = step(s, (o) => o[0]);
    }
    expect(clutches).toBeGreaterThan(0); // les finales donnent la main au joueur
  });
});

describe("crises et fin prématurée", () => {
  it("déclenche un fil de crise dès qu'une jauge touche le fond", () => {
    // On force la ruine : la crise doit s'imposer, sans dépendre d'un tirage.
    let s = startCareer(CREATION, 4321);
    s = { ...s, stats: { ...s.stats, argent: 0 } };
    let guard = 0;
    let sawCrisis = false;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "arc" && isCrisisArc(s.currentArcId)) sawCrisis = true;
      s = step(s, (o) => o[0]);
    }
    expect(sawCrisis).toBe(true);
  });

  it("permet à un choix de crise de mettre un terme à la carrière", () => {
    // Le choix « arrêter » du fil de la ruine doit couper la carrière net.
    let s = startCareer(CREATION, 777);
    s = { ...s, stats: { ...s.stats, argent: 0 } };
    let guard = 0;
    while (guard++ < 5000) {
      if (s.status === "arc" && s.currentArcId === "crisis_broke") {
        const quit = s.currentArcStep!.choices.find((c) => c.endsCareer)!;
        expect(quit).toBeDefined();
        const after = resolveArcChoice(s, quit.id);
        expect(after.careerEndedEarly).toBe(true);
        expect(after.retired).toBe(true);
        // L'écran suivant est la reconversion, pas la suite de la saison.
        expect(next(after).status).toBe("epilogue");
        return;
      }
      if (s.status === "finished") break;
      s = step(s, (o) => o[0]);
    }
    throw new Error("le fil de la ruine ne s'est jamais déclenché");
  });

  it("ne redémarre jamais une crise déjà vécue", () => {
    // Une crise peut s'étaler sur deux étapes ; ce qu'on interdit, c'est qu'elle
    // reprenne depuis le début alors qu'on l'a déjà traversée.
    let s = startCareer(CREATION, 20250726);
    s = { ...s, stats: { ...s.stats, argent: 0, forme: 12, morale: 12 } };
    const entries = new Map(CRISES.map((c) => [c.entry, c.id]));
    const seen: string[] = [];
    let guard = 0;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "arc" && isCrisisArc(s.currentArcId)) {
        const startedArc = entries.get(s.currentArcStep!.id);
        if (startedArc) seen.push(startedArc);
      }
      // On évite systématiquement les issues qui arrêtent la carrière, pour
      // laisser la partie se dérouler et pouvoir compter les répétitions.
      s = step(s, (options) => {
        const safe = (options as { endsCareer?: boolean }[]).filter((c) => !c.endsCareer);
        return (safe.length > 0 ? safe : options)[0] as never;
      });
    }
    expect(new Set(seen).size).toBe(seen.length);
  });
});

describe("cohérence du marché", () => {
  it("ne présente pas un transfert interne à la région comme un départ à l'étranger", () => {
    // Un joueur de LCK qui rejoint un autre club de LCK ne s'expatrie pas.
    const base = startCareer({ ...CREATION, nationalityId: "kr" }, 99);
    const inLck: PlayerState = {
      ...base,
      teamId: "seoul",
      leagueId: "lck",
      stats: { ...base.stats, skill: 88, reputation: 80 },
    };
    const offers = buildOffers(inLck, new Rng(1));
    for (const o of offers) {
      const league = o.leagueName;
      if (league === "LCK") expect(o.kind).not.toBe("import");
    }
  });

  it("propose les filières du pays du joueur en premier", () => {
    expect(getStartTeamsFor("kr")[0].leagueId).toBe("lck_cl");
    expect(getStartTeamsFor("cn")[0].leagueId).toBe("ldl");
    // Un joueur européen n'est pas envoyé en Asie pour ses débuts.
    const first = getStartTeamsFor("fr")[0];
    expect(["lfl", "superliga", "prime"]).toContain(first.leagueId);
  });

  it("fait varier les arguments de la prolongation d'une saison à l'autre", () => {
    // Sans mercato ni statut, l'offre « rester » était identique chaque année.
    let s = startCareer(CREATION, 5150);
    const stayArguments = new Set<string>();
    let guard = 0;
    while (s.status !== "finished" && guard++ < 5000) {
      if (s.status === "transfer_choice") {
        const stay = s.offers.find((o) => o.kind === "stay");
        if (stay) stayArguments.add([...stay.pros, ...stay.cons].join("|"));
      }
      s = step(s, (o) => o[0]);
    }
    expect(stayArguments.size).toBeGreaterThan(1);
  });
});

describe("carrière complète", () => {
  it("se termine avec un score borné 0-100 sur plusieurs graines", () => {
    for (const seed of [1, 7, 42, 100, 2024, 999983]) {
      const end = playToEnd(seed);
      expect(end.status).toBe("finished");
      expect(end.finalResult).not.toBeNull();
      const score = end.finalResult!.score;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(end.finalResult!.rank).toBeTruthy();
      expect(end.season).toBeGreaterThanOrEqual(1);
    }
  });

  it("est déterministe : même graine => même score", () => {
    const a = playToEnd(555);
    const b = playToEnd(555);
    expect(a.finalResult!.score).toBe(b.finalResult!.score);
    expect(a.season).toBe(b.season);
    expect(a.palmares).toEqual(b.palmares);
  });
});
