"use client";

import type { Stats } from "@/engine/types";
import { STAT_META, formatArgent } from "@/lib/display";

export default function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STAT_META.map((m) => {
          const value = stats[m.key];
          return (
            <div key={m.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-white/80">
                  <span className="mr-1">{m.icon}</span>
                  {m.label}
                </span>
                <span className="font-semibold tabular-nums text-white/90">{value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${m.bar} transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
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
