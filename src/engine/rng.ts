// RNG déterministe et sérialisable (mulberry32).
// L'état tient dans un seul entier => une carrière est reproductible à partir
// d'une graine, ce qui permettra plus tard à un backend de rejouer/valider une partie.

export class Rng {
  state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** Flottant dans [0, 1). */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Entier dans [min, max] inclus. */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Flottant dans [min, max). */
  range(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /** Renvoie true avec la probabilité p (0-1). */
  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Tirage pondéré (poids >= 0). Renvoie null si la liste est vide. */
  weightedPick<T>(arr: readonly T[], weightOf: (item: T) => number): T | null {
    if (arr.length === 0) return null;
    const total = arr.reduce((s, it) => s + Math.max(0, weightOf(it)), 0);
    if (total <= 0) return arr[Math.floor(this.next() * arr.length)];
    let r = this.next() * total;
    for (const it of arr) {
      r -= Math.max(0, weightOf(it));
      if (r <= 0) return it;
    }
    return arr[arr.length - 1];
  }
}

/** Génère une graine aléatoire (utilisée à la création d'une carrière). */
export function randomSeed(): number {
  return (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1;
}
