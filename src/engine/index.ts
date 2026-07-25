// API publique du moteur de jeu (TypeScript pur, réutilisable côté serveur).

export * from "./types";
export { Rng, randomSeed } from "./rng";
export { startCareer } from "./createCareer";
export { resolveChoice, resolveClutch, chooseOffer, chooseEpilogue, next } from "./progression";
export { computeFinalResult } from "./scoring";
export { phaseLabel } from "./simulation";
export { normalizeStats, meetsRequirements, missingRequirements } from "./util";
export { metaSummary, metaDelta } from "./meta";
export { availableEpiloguePaths, getEpiloguePath, EPILOGUE_PATHS } from "./epilogue";
export { desirability } from "./offers";
export { soloQueueRank } from "./ladder";
