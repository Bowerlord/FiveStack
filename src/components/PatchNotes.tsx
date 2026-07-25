"use client";

import type { PlayerState } from "@/engine/types";
import { metaSummary } from "@/engine";
import { archetypeLabel } from "@/data/archetypes";

/**
 * Écran de patch : le jeu change sous les pieds du joueur. On lui montre ce qui
 * monte, ce qui tombe, et surtout ce que ça implique pour SON pool.
 */
export default function PatchNotes({
  career,
  onNext,
}: {
  career: PlayerState;
  onNext: () => void;
}) {
  const patch = career.patch;
  if (!patch) return null;

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-neon-cyan/25 to-neon-blue/25 px-6 py-4">
        <div className="text-xs uppercase tracking-[0.25em] text-white/70">
          Saison {career.season}
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-white">Patch {patch.version}</h2>
        <p className="mt-1 text-sm text-white/70">{patch.headline}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PatchColumn title="Renforcés" icon="📈" ids={patch.buffed} pool={career.pool} positive />
          <PatchColumn title="Affaiblis" icon="📉" ids={patch.nerfed} pool={career.pool} />
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/85">
          {metaSummary(career)}
        </div>

        <div className="mt-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/50">
            Ton pool ({career.pool.length} style{career.pool.length > 1 ? "s" : ""})
          </div>
          <div className="flex flex-wrap gap-2">
            {career.pool.map((id) => (
              <span
                key={id}
                className={`rounded-lg px-2.5 py-1 text-sm ${
                  id === career.signature
                    ? "bg-neon-gold/20 font-bold text-neon-gold"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {id === career.signature ? "★ " : ""}
                {archetypeLabel(id)}
              </span>
            ))}
          </div>
        </div>

        <button className="btn-primary mt-6 w-full" onClick={onNext}>
          Commencer la saison
        </button>
      </div>
    </div>
  );
}

function PatchColumn({
  title,
  icon,
  ids,
  pool,
  positive,
}: {
  title: string;
  icon: string;
  ids: string[];
  pool: string[];
  positive?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/50">
        {icon} {title}
      </div>
      <ul className="space-y-1.5">
        {ids.map((id) => {
          const inPool = pool.includes(id);
          return (
            <li
              key={id}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                inPool
                  ? positive
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/40 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-white/[0.03] text-white/60"
              }`}
            >
              {archetypeLabel(id)}
              {inPool && <span className="ml-1 text-xs opacity-80">· dans ton pool</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
