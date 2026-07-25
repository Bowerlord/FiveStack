"use client";

import type { FinalResult } from "@/engine/types";

export default function FinalScore({
  result,
  pseudo,
  onReplay,
}: {
  result: FinalResult;
  pseudo: string;
  onReplay: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-br from-neon-violet/30 via-neon-blue/20 to-neon-cyan/20 px-6 py-8 text-center">
        <div className="text-sm uppercase tracking-[0.3em] text-white/60">Fin de carrière</div>
        <div className="mt-3 text-7xl font-black tabular-nums text-white drop-shadow">
          {result.score}
          <span className="text-2xl text-white/50">/100</span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-neon-cyan">{result.rank}</div>
        <p className="mx-auto mt-2 max-w-md text-white/75">{result.tagline}</p>
      </div>

      <div className="p-6">
        <div className="mb-4 text-center text-white/70">
          <span className="font-semibold text-white">{pseudo}</span> — {result.seasonsPlayed}{" "}
          saison(s) · sommet atteint : {result.peakLeagueName}
        </div>

        {result.epilogueNarrative && (
          <div className="mb-5 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-4">
            <div className="text-sm font-bold uppercase tracking-wider text-neon-cyan">
              Après la carrière — {result.epilogueLabel}
            </div>
            <p className="mt-2 leading-relaxed text-white/75">{result.epilogueNarrative}</p>
          </div>
        )}

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/50">
          Palmarès & faits marquants
        </h3>
        <ul className="space-y-2">
          {result.highlights.map((h, i) => (
            <li
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/85"
            >
              {h}
            </li>
          ))}
        </ul>

        <button className="btn-primary mt-6 w-full" onClick={onReplay}>
          Rejouer une nouvelle carrière
        </button>
      </div>
    </div>
  );
}
