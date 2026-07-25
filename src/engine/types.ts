// Types du domaine — moteur pur, aucune dépendance UI/React.

export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export type LeagueTier = "ERL" | "MAJOR";

export interface League {
  id: string;
  name: string; // ex. "LFL", "LEC", "LCK"
  tier: LeagueTier;
  region: string;
  strength: number; // niveau moyen de la ligue (0-100)
}

export interface Team {
  id: string;
  name: string;
  leagueId: string;
  prestige: number; // 0-100
}

export interface Nationality {
  id: string;
  name: string;
  flag: string; // emoji drapeau
}

/** Statistiques du joueur. Toutes bornées 0-100 sauf `argent` (euros, >= 0). */
export interface Stats {
  skill: number;
  reputation: number;
  morale: number;
  forme: number;
  chimie: number;
  argent: number;
}

export type StatKey = keyof Stats;

/** Effet d'un choix : deltas à appliquer aux statistiques. */
export type Effect = Partial<Record<StatKey, number>>;

/** Un bonus de départ associé à une option de création. */
export interface CreationOption {
  id: string;
  label: string;
  description: string;
  effects: Effect;
}

export interface Choice {
  id: string;
  label: string;
  effects: Effect;
  resultText: string; // retour affiché après le choix
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
}

export type GameStatus =
  | "event"
  | "event_result"
  | "phase_result"
  | "season_summary"
  | "finished";

/** Retour immédiat après un choix (texte + deltas), pour l'affichage. */
export interface ChoiceOutcome {
  choiceLabel: string;
  resultText: string;
  effects: Effect;
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
  retired: boolean;

  stats: Stats;
  bestReputation: number;
  peakLeagueId: string;
  palmares: Palmares;

  // Boucle de jeu
  status: GameStatus;
  phase: Phase;
  pendingEventIds: string[]; // événements restants pour la phase courante
  usedEventIds: string[]; // évite les répétitions sur la saison
  currentEvent: GameEvent | null;
  lastOutcome: ChoiceOutcome | null;
  lastPhaseResult: PhaseResult | null;

  // Flags de saison
  qualifiedMSI: boolean;
  qualifiedWorlds: boolean;
  seasonResults: SeasonResultLine[];
  seasonNarrative: string[];
  transferNote: string | null;

  lastSeasonSummary: SeasonSummary | null;
  finalResult: FinalResult | null;
}
