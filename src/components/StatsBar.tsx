"use client";

import type { Stats } from "@/engine/types";
import { STAT_META, formatArgent } from "@/lib/display";

/**
 * Barres de statistiques. Le skill affiche son plafond de talent : un gain
 * silencieusement perdu passerait pour un bug.
 */
export default function StatsBar({ stats, potential }: { stats: Stats; potential?: number }) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STAT_META.map((m) => {
          const value = stats[m.key];
          const capped = m.key === "skill" && potential !== undefined;
          const atCap = capped && value >= potential! - 2;
          return (
            <div key={m.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-white/80">
                  <span className="mr-1">{m.icon}</span>
                  {m.label}
                </span>
                <span className="font-semibold tabular-nums text-white/90">
                  {value}
                  {capped && (
                    <span className={atCap ? "text-amber-300" : "text-white/40"}>
                      {" / "}
                      {potential}
                    </span>
                  )}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${m.bar} transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
                {capped && potential! < 100 && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-amber-300/70"
                    style={{ left: `${potential}%` }}
                    title={`Plafond de talent : ${potential}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-neon-gold/30 bg-neon-gold/10 px-4 py-2">
        <span className="text-sm text-white/80">💰 Argent</span>
        <span className="font-bold tabular-nums text-neon-gold">{formatArgent(stats.argent)}</span>
      </div>
    </div>
  );
}
