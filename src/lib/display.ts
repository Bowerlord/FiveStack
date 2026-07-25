import type { Effect, StatKey } from "@/engine/types";

export interface StatMeta {
  key: StatKey;
  label: string;
  icon: string;
  bar: string; // classe Tailwind de couleur de la barre
}

// Statistiques affichées sous forme de barres (0-100). `argent` est traité à part.
export const STAT_META: StatMeta[] = [
  { key: "skill", label: "Skill", icon: "🎯", bar: "bg-neon-blue" },
  { key: "reputation", label: "Cote", icon: "📈", bar: "bg-neon-violet" },
  { key: "morale", label: "Moral", icon: "🧠", bar: "bg-neon-cyan" },
  { key: "forme", label: "Forme", icon: "💪", bar: "bg-neon-gold" },
  { key: "chimie", label: "Chimie", icon: "🤝", bar: "bg-neon-pink" },
  { key: "communaute", label: "Communauté", icon: "📣", bar: "bg-emerald-400" },
];

const STAT_LABELS: Record<StatKey, string> = {
  skill: "Skill",
  reputation: "Cote",
  morale: "Moral",
  forme: "Forme",
  chimie: "Chimie",
  communaute: "Communauté",
  argent: "Argent",
};

/** Libellé lisible d'une statistique (pour les prérequis, notamment). */
export function statLabel(key: StatKey): string {
  return STAT_LABELS[key];
}

export function formatArgent(v: number): string {
  return `${v.toLocaleString("fr-FR")} €`;
}

export interface EffectLine {
  key: StatKey;
  label: string;
  text: string; // ex. "+6", "-4", "+15 000 €"
  positive: boolean;
}

/** Transforme un effet en lignes affichables (deltas signés). */
export function effectLines(effect: Effect): EffectLine[] {
  const out: EffectLine[] = [];
  for (const [k, delta] of Object.entries(effect)) {
    if (!delta) continue;
    const key = k as StatKey;
    const positive = delta > 0;
    const sign = positive ? "+" : "";
    const text =
      key === "argent"
        ? `${sign}${delta.toLocaleString("fr-FR")} €`
        : `${sign}${delta}`;
    out.push({ key, label: STAT_LABELS[key], text, positive });
  }
  return out;
}
