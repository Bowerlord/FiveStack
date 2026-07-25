"use client";

import type { SeasonSummary as SeasonSummaryData } from "@/engine/types";

export default function SeasonSummary({
  summary,
  retired,
  onNext,
}: {
  summary: SeasonSummaryData;
  retired: boolean;
  onNext: () => void;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-extrabold text-white">Bilan — Saison {summary.season}</h2>
        <span className="text-sm text-white/60">
          {summary.age} ans · {summary.teamName} ({summary.leagueName})
        </span>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/50">
          Résultats
        </h3>
        {summary.results.length === 0 ? (
          <p className="text-white/60">Aucune compétition disputée cette saison.</p>
        ) : (
          <ul className="space-y-2">
            {summary.results.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2"
              >
                <span className="text-white/70">{r.competition}</span>
                <span className="font-semibold text-white">{r.placement}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {summary.transferNote && (
        <div className="mt-4 rounded-xl border border-neon-blue/40 bg-neon-blue/10 px-4 py-3 font-semibold text-neon-blue">
          {summary.transferNote}
        </div>
      )}

      {retired && (
        <div className="mt-4 rounded-xl border border-neon-gold/40 bg-neon-gold/10 px-4 py-3 text-neon-gold">
          🎬 Le rideau tombe sur ta carrière. Il est temps de faire les comptes…
        </div>
      )}

      <button className="btn-primary mt-6 w-full" onClick={onNext}>
        {retired ? "Voir le bilan de carrière" : "Saison suivante"}
      </button>
    </div>
  );
}
