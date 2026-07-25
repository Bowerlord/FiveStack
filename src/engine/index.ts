// API publique du moteur de jeu (TypeScript pur, réutilisable côté serveur).

export * from "./types";
export { Rng, randomSeed } from "./rng";
export { startCareer } from "./createCareer";
export { resolveChoice, next } from "./progression";
export { computeFinalResult } from "./scoring";
export { phaseLabel } from "./simulation";
export { normalizeStats } from "./util";
