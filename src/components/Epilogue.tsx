"use client";

import type { PlayerState } from "@/engine/types";
import { EPILOGUE_PATHS, meetsRequirements, missingRequirements } from "@/engine";
import { statLabel } from "@/lib/display";

/**
 * Second acte : en esport on raccroche à 25 ans, et ce qu'on a construit pendant
 * sa carrière (communauté, cohésion, argent, crédibilité) décide des portes qui
 * s'ouvrent. Les voies verrouillées restent visibles — elles racontent ce que le
 * joueur aurait pu devenir.
 */
export default function Epilogue({
  career,
  onChoose,
}: {
  career: PlayerState;
  onChoose: (pathId: string) => void;
}) {
  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-[0.3em] text-white/50">Fin de parcours</div>
      <h2 className="mt-1 text-2xl font-extrabold text-white">Et maintenant ?</h2>
      <p className="mt-2 text-white/70">
        Tu raccroches à {career.age} ans, après {career.season} saisons. En esport, ce n&apos;est
        pas une fin : c&apos;est un choix de plus.
      </p>

      <div className="mt-5 space-y-3">
        {EPILOGUE_PATHS.map((path) => {
          const unlocked = meetsRequirements(career.stats, path.requires);
          const missing = missingRequirements(career.stats, path.requires);

          if (!unlocked) {
            return (
              <div
                key={path.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4 opacity-55"
                aria-disabled="true"
              >
                <div className="font-semibold text-white/40">🔒 {path.label}</div>
                <p className="mt-1 text-sm text-white/35">{path.description}</p>
                <div className="mt-1.5 text-xs text-rose-300/70">
                  {missing.map(([k, min]) => `${statLabel(k)} ${min} requis`).join(" · ")}
                </div>
              </div>
            );
          }

          return (
            <button
              key={path.id}
              onClick={() => onChoose(path.id)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-neon-cyan/60 hover:bg-neon-cyan/10 active:scale-[0.99]"
            >
              <div className="font-semibold text-white">{path.label}</div>
              <p className="mt-1 text-sm text-white/65">{path.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
