// Banc d'équilibrage : joue des centaines de carrières et mesure la distribution
// des scores. Sert à vérifier deux choses — qu'une carrière au hasard reste
// moyenne, et que bien jouer fait une vraie différence.
//
//   npm run balance

import {
  startCareer,
  resolveChoice,
  resolveClutch,
  chooseOffer,
  chooseEpilogue,
  next,
  Rng,
  meetsRequirements,
  availableEpiloguePaths,
  type Choice,
  type CreationChoices,
  type PlayerState,
} from "@/engine";

const ORIGINS = ["soloq", "academie", "amateur", "streamer"];
const LIFESTYLES = ["discipline", "fetard", "createur", "equilibre"];
const ENTOURAGES = ["coach", "agent", "famille", "amis"];
const ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;
const SIGNATURES: Record<string, string> = {
  Top: "top_bruiser",
  Jungle: "jgl_objective",
  Mid: "mid_control",
  ADC: "adc_crit",
  Support: "sup_engage",
};

function randomCreation(rng: Rng): CreationChoices {
  const role = rng.pick(ROLES);
  return {
    pseudo: "Bench",
    nationalityId: "fr",
    role,
    originId: rng.pick(ORIGINS),
    lifestyleId: rng.pick(LIFESTYLES),
    entourageId: rng.pick(ENTOURAGES),
    startTeamId: "sirius",
    signatureId: SIGNATURES[role],
  };
}

const OPTIMAL_CREATION: CreationChoices = {
  pseudo: "Meta",
  nationalityId: "fr",
  role: "Mid",
  originId: "soloq",
  lifestyleId: "discipline",
  entourageId: "coach",
  startTeamId: "sirius",
  signatureId: "mid_control",
};

type Strategy = (options: Choice[], state: PlayerState, rng: Rng) => Choice;

/** Joueur qui clique au hasard. */
const random: Strategy = (options, _s, rng) => rng.pick(options);

/** Joueur qui réfléchit : privilégie le niveau, la cohésion et sa santé. */
const smart: Strategy = (options, state) => {
  const w: Record<string, number> = {
    skill: 3,
    chimie: 2,
    forme: 1.6,
    morale: 1,
    reputation: 1.2,
    communaute: 0.8,
    argent: 0.00004,
  };
  let best = options[0];
  let bestValue = -Infinity;
  for (const c of options) {
    let v = 0;
    for (const [k, d] of Object.entries(c.effects)) v += (d ?? 0) * (w[k] ?? 0);
    if (c.perfDelta) v += c.perfDelta * 2.5;
    if (c.risk) {
      // Espérance du pari, en tenant compte de la performance en jeu.
      const val = (o: { effects: Record<string, number | undefined>; perfDelta?: number }) => {
        let x = (o.perfDelta ?? 0) * 2.5;
        for (const [k, d] of Object.entries(o.effects)) x += (d ?? 0) * (w[k] ?? 0);
        return x;
      };
      v += c.risk.chance * val(c.risk.success) + (1 - c.risk.chance) * val(c.risk.failure);
    }
    // Élargir son pool paie sur la durée : le patch peut tuer un style unique.
    if (c.learnsArchetype && state.pool.length < 4) v += 14;
    // Se soigner quand la forme devient critique.
    if (state.stats.forme < 40 && (c.effects.forme ?? 0) > 0) v += 12;
    if (v > bestValue) {
      bestValue = v;
      best = c;
    }
  }
  return best;
};

function openChoices(list: Choice[], state: PlayerState): Choice[] {
  const open = list.filter((c) => meetsRequirements(state.stats, c.requires));
  return open.length > 0 ? open : list;
}

function play(seed: number, strategy: Strategy, creation?: CreationChoices): PlayerState {
  const rng = new Rng((seed ^ 0x9e3779b9) >>> 0);
  let s = startCareer(creation ?? randomCreation(rng), seed);
  let guard = 0;
  while (s.status !== "finished" && guard++ < 6000) {
    switch (s.status) {
      case "event":
        s = resolveChoice(s, strategy(openChoices(s.currentEvent!.choices, s), s, rng).id);
        break;
      case "clutch":
        s = resolveClutch(s, strategy(openChoices(s.currentClutch!.choices, s), s, rng).id);
        break;
      case "transfer_choice":
        s = chooseOffer(s, rng.pick(s.offers).id);
        break;
      case "epilogue": {
        const paths = availableEpiloguePaths(s);
        s = chooseEpilogue(s, paths[paths.length - 1].id);
        break;
      }
      default:
        s = next(s);
    }
  }
  return s;
}

interface Report {
  moyenne: string;
  mediane: number;
  p90: number;
  max: number;
  parfait: string;
  goat: string;
  worldsParCarriere: string;
  titreMondial: string;
  ligueMajeure: string;
  saisons: string;
}

function run(strategy: Strategy, n: number, creation?: CreationChoices): Report {
  const scores: number[] = [];
  let worlds = 0;
  let anyTitle = 0;
  let majors = 0;
  let seasons = 0;

  for (let i = 1; i <= n; i++) {
    const s = play(i * 7919, strategy, creation);
    scores.push(s.finalResult!.score);
    worlds += s.palmares.worldsWon;
    seasons += s.season;
    if (s.palmares.worldsWon > 0) anyTitle++;
    if (["LEC", "LCK", "LPL"].includes(s.finalResult!.peakLeagueName)) majors++;
  }

  scores.sort((a, b) => a - b);
  const q = (p: number) => scores[Math.floor(p * (scores.length - 1))];
  const pct = (v: number) => `${((v / n) * 100).toFixed(1)} %`;

  return {
    moyenne: (scores.reduce((a, b) => a + b, 0) / n).toFixed(1),
    mediane: q(0.5),
    p90: q(0.9),
    max: q(1),
    parfait: pct(scores.filter((s) => s === 100).length),
    goat: pct(scores.filter((s) => s >= 92).length),
    worldsParCarriere: (worlds / n).toFixed(2),
    titreMondial: pct(anyTitle),
    ligueMajeure: pct(majors),
    saisons: (seasons / n).toFixed(1),
  };
}

const N = Number(process.argv[2] ?? 400);
console.log(`Carrières simulées : ${N} par stratégie\n`);
console.log("── Choix aléatoires, création aléatoire ──");
console.table(run(random, N));
console.log("── Choix réfléchis, build optimisé ──");
console.table(run(smart, N, OPTIMAL_CREATION));
