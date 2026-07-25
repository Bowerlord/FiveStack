// Types du domaine — moteur pur, aucune dépendance UI/React.

export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export type LeagueTier = "ERL" | "MAJOR";

export interface League {
  id: string;
  name: string; // ex. "LFL", "LEC", "LCK"
  tier: LeagueTier;
  region: string;
  strength: number; // niveau moyen de la ligue (0-100)
  /** Une arrivée dans cette région impose-t-elle une adaptation (langue, visa) ? */
  importBarrier?: boolean;
}

export interface Team {
  id: string;
  name: string;
  leagueId: string;
  prestige: number; // 0-100
  /** Santé financière de la structure (0-100). Une org fragile peut couler. */
  stability: number;
}

export interface Nationality {
  id: string;
  name: string;
  flag: string; // emoji drapeau
}

/** Un style de jeu maîtrisable. Le patch en renforce et en affaiblit chaque saison. */
export interface Archetype {
  id: string;
  role: Role;
  label: string;
  description: string;
}

/** Statistiques du joueur. Toutes bornées 0-100 sauf `argent` (euros, >= 0). */
export interface Stats {
  skill: number;
  reputation: number;
  morale: number;
  forme: number;
  chimie: number;
  /** Capital communauté : hype, clips, soutien du public. Distinct de la cote pro. */
  communaute: number;
  argent: number;
}

export type StatKey = keyof Stats;

/** Effet d'un choix : deltas à appliquer aux statistiques. */
export type Effect = Partial<Record<StatKey, number>>;

/** Seuils minimaux à atteindre pour débloquer une option. */
export type Requirement = Partial<Record<StatKey, number>>;

/** Un bonus de départ associé à une option de création. */
export interface CreationOption {
  id: string;
  label: string;
  description: string;
  effects: Effect;
}

/** Issue d'un pari : ce qui arrive en cas de réussite ou d'échec. */
export interface RiskOutcome {
  effects: Effect;
  /** Modificateur de performance sur le match en cours (moments décisifs). */
  perfDelta?: number;
  text: string;
}

export interface Choice {
  id: string;
  label: string;
  effects: Effect;
  resultText: string; // retour affiché après le choix
  /** Prérequis : l'option reste visible mais verrouillée si non atteints. */
  requires?: Requirement;
  /** Modificateur de performance appliqué au match en cours. */
  perfDelta?: number;
  /** Pari : le résultat est tiré au sort (RNG seedé, donc reproductible). */
  risk?: { chance: number; success: RiskOutcome; failure: RiskOutcome };
  /** Fait apprendre un nouvel archétype au joueur (élargit son pool). */
  learnsArchetype?: boolean;
}

export type Phase = "preseason" | "spring" | "msi" | "summer" | "worlds";

export interface GameEvent {
  id: string;
  title: string;
  text: string;
  /** Phases où l'événement peut apparaître. Absent = toutes phases. */
  phases?: Phase[];
  minAge?: number;
  maxAge?: number;
  roles?: Role[];
  weight?: number; // poids de tirage (défaut 1)
  choices: Choice[];
}

/** Compétition concernée par un moment décisif. */
export type ClutchStage = "split" | "msi" | "worlds";

/** Étape d'un moment décisif : la draft, puis un call en jeu. */
export interface ClutchMoment {
  id: string;
  kind: "draft" | "call";
  title: string;
  /** Mise en situation concrète (score de la série, temps de jeu, état de la carte). */
  text: string;
  stages?: ClutchStage[];
  roles?: Role[];
  weight?: number;
  choices: Choice[];
}

/** Mise à jour du jeu : le terrain change sous les pieds du joueur. */
export interface Patch {
  version: string; // ex. "14.7"
  buffed: string[]; // ids d'archétypes renforcés
  nerfed: string[]; // ids d'archétypes affaiblis
  headline: string;
}

export type OfferKind = "stay" | "major" | "rebuild" | "import" | "erl";

/** Proposition de contrat à l'intersaison. */
export interface Offer {
  id: string;
  kind: OfferKind;
  teamId: string;
  teamName: string;
  leagueName: string;
  salary: number;
  pros: string[];
  cons: string[];
  /** Appliqué à la signature du contrat. */
  effects: Effect;
  /** Nouvelle valeur de chimie à l'arrivée (l'alchimie se reconstruit). */
  chemistryOnArrival?: number;
}

/** Voie de reconversion après la carrière de joueur. */
export interface EpiloguePath {
  id: string;
  label: string;
  description: string;
  requires?: Requirement;
  narrative: string;
  scoreBonus: number;
}

export interface Palmares {
  splitsWon: number;
  msiWon: number;
  worldsWon: number;
  msiAppearances: number;
  worldsAppearances: number;
  mvpAwards: number;
  allProSelections: number;
}

export interface CreationChoices {
  pseudo: string;
  nationalityId: string;
  role: Role;
  originId: string;
  lifestyleId: string;
  entourageId: string;
  startTeamId: string;
  /** Archétype de prédilection : la marque de fabrique du joueur. */
  signatureId: string;
}

/** Résultat d'une phase compétitive, pour l'écran intermédiaire. */
export interface PhaseResult {
  phase: Phase;
  label: string; // ex. "Split de printemps"
  placementText: string; // ex. "Champion !", "Éliminé en playoffs"
  detail: string;
  qualifiedNext?: string; // ex. "Qualifié pour le MSI"
}

export interface SeasonResultLine {
  competition: string;
  placement: string;
}

export interface SeasonSummary {
  season: number;
  age: number;
  teamName: string;
  leagueName: string;
  results: SeasonResultLine[];
  transferNote?: string;
  narrative: string[];
  stats: Stats;
}

export interface FinalResult {
  score: number; // 0-100
  rank: string;
  tagline: string;
  seasonsPlayed: number;
  peakLeagueName: string;
  palmares: Palmares;
  highlights: string[];
  /** Reconversion choisie et son récit. */
  epilogueLabel?: string;
  epilogueNarrative?: string;
}

export type GameStatus =
  | "patch_notes"
  | "event"
  | "event_result"
  | "clutch"
  | "clutch_result"
  | "phase_result"
  | "season_summary"
  | "transfer_choice"
  | "epilogue"
  | "finished";

/** Retour immédiat après un choix (texte + deltas), pour l'affichage. */
export interface ChoiceOutcome {
  choiceLabel: string;
  resultText: string;
  effects: Effect;
  /** Renseigné pour un pari : la tentative a-t-elle réussi ? */
  gambleWon?: boolean;
  /** Impact sur le match en cours, s'il y en a un. */
  perfDelta?: number;
}

export interface PlayerState {
  // Déterminisme
  seed: number;
  rngState: number;

  // Identité
  creation: CreationChoices;
  pseudo: string;
  nationalityId: string;
  role: Role;

  // Progression
  age: number;
  season: number;
  teamId: string;
  leagueId: string;
  /** Saisons consécutives dans l'équipe actuelle (fidélité). */
  seasonsAtTeam: number;
  retired: boolean;

  stats: Stats;
  /** Plafond de `skill` propre à la carrière : tout le monde n'a pas le même talent. */
  potential: number;
  bestReputation: number;
  peakLeagueId: string;
  palmares: Palmares;

  // Méta : pool de champions et patch en cours
  /** Archétypes maîtrisés. Un pool large protège des patchs et des bans. */
  pool: string[];
  signature: string;
  patch: Patch | null;

  // Boucle de jeu
  status: GameStatus;
  phase: Phase;
  pendingEventIds: string[]; // événements restants pour la phase courante
  usedEventIds: string[]; // évite les répétitions sur la saison
  currentEvent: GameEvent | null;
  lastOutcome: ChoiceOutcome | null;
  lastPhaseResult: PhaseResult | null;

  // Moments décisifs
  /** Marge de performance en attente, le temps que le joueur tranche. */
  pendingMargin: number | null;
  clutchQueue: string[];
  currentClutch: ClutchMoment | null;
  clutchDelta: number;
  clutchStage: ClutchStage | null;

  // Intersaison
  offers: Offer[];

  // Flags de saison
  qualifiedMSI: boolean;
  qualifiedWorlds: boolean;
  seasonResults: SeasonResultLine[];
  seasonNarrative: string[];
  transferNote: string | null;

  lastSeasonSummary: SeasonSummary | null;
  epiloguePathId: string | null;
  finalResult: FinalResult | null;
}
