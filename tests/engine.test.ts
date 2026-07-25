import { describe, it, expect } from "vitest";
import {
  startCareer,
  resolveChoice,
  next,
  Rng,
  type CreationChoices,
  type PlayerState,
  type Stats,
} from "@/engine";

const CREATION: CreationChoices = {
  pseudo: "TestPlayer",
  nationalityId: "fr",
  role: "Mid",
  originId: "soloq",
  lifestyleId: "discipline",
  entourageId: "coach",
  startTeamId: "sirius",
};

function statsInBounds(s: Stats): boolean {
  const keys: (keyof Stats)[] = ["skill", "reputation", "morale", "forme", "chimie"];
  const ok01 = keys.every((k) => s[k] >= 0 && s[k] <= 100);
  return ok01 && s.argent >= 0;
}

/** Joue une carrière jusqu'au bout en choisissant toujours la 1re option (déterministe). */
function playToEnd(seed: number): PlayerState {
  let state = startCareer(CREATION, seed);
  let guard = 0;
  while (state.status !== "finished" && guard < 5000) {
    guard++;
    if (state.status === "event") {
      const first = state.currentEvent!.choices[0];
      state = resolveChoice(state, first.id);
    } else {
      state = next(state);
    }
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

  it("démarre en présentant un événement à résoudre", () => {
    const s = startCareer(CREATION, 999);
    expect(s.status).toBe("event");
    expect(s.currentEvent).not.toBeNull();
    expect(s.currentEvent!.choices.length).toBeGreaterThanOrEqual(2);
  });
});

describe("resolveChoice", () => {
  it("applique l'effet du choix et passe en event_result", () => {
    const s = startCareer(CREATION, 4242);
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
        s =
          s.status === "event"
            ? resolveChoice(s, rng.pick(s.currentEvent!.choices).id)
            : next(s);
      }
      scores.push(s.finalResult!.score);
    }
    const perfect = scores.filter((s) => s === 100).length / scores.length;
    const moyenne = scores.reduce((a, b) => a + b, 0) / scores.length;
    expect(perfect).toBeLessThan(0.2);
    expect(moyenne).toBeLessThan(70);
    expect(new Set(scores).size).toBeGreaterThan(5); // de vrais écarts entre parties
  });

  it("réserve les compétitions internationales aux ligues majeures", () => {
    // Un joueur de ligue régionale ne peut pas se qualifier pour le MSI/Worlds.
    for (const seed of [11, 222, 3333]) {
      let s = startCareer(CREATION, seed);
      let guard = 0;
      while (s.status !== "finished" && guard++ < 5000) {
        const erl = ["lfl", "superliga", "prime"].includes(s.leagueId);
        if (erl) expect(s.qualifiedMSI || s.qualifiedWorlds).toBe(false);
        s = s.status === "event" ? resolveChoice(s, s.currentEvent!.choices[0].id) : next(s);
      }
    }
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
