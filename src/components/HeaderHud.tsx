"use client";

import type { PlayerState } from "@/engine/types";
import { phaseLabel, soloQueueRank } from "@/engine";
import { getNationality } from "@/data/attributes";
import { archetypeLabel } from "@/data/archetypes";
import { getLeague, getTeam } from "@/data/teams";

export default function HeaderHud({ career }: { career: PlayerState }) {
  const nat = getNationality(career.nationalityId);
  const team = getTeam(career.teamId);
  const league = getLeague(career.leagueId);

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/15 text-2xl">
            {nat?.flag ?? "🎮"}
          </div>
          <div>
            <div className="text-lg font-bold leading-tight">{career.pseudo}</div>
            <div className="text-sm text-white/60">
              {career.role} · {career.age} ans · ★ {archetypeLabel(career.signature)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Chip label="Saison" value={String(career.season)} />
          <Chip label="Équipe" value={team?.name ?? "—"} />
          <Chip label="Ligue" value={league?.name ?? "—"} accent />
          <Chip label="Phase" value={phaseLabel(career.phase)} />
        </div>
      </div>

      {/* Ligne « vitrine publique » : ton ladder et le patch en cours. */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-xs">
        <span className="rounded-md bg-neon-cyan/15 px-2 py-1 font-semibold text-neon-cyan">
          🪜 SoloQ : {soloQueueRank(career)}
        </span>
        {career.patch && (
          <span className="rounded-md bg-white/5 px-2 py-1 text-white/60">
            🔧 Patch {career.patch.version}
          </span>
        )}
        <span className="rounded-md bg-white/5 px-2 py-1 text-white/60">
          🎭 Pool : {career.pool.length} style{career.pool.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

function Chip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-1.5 ${
        accent ? "border-neon-violet/40 bg-neon-violet/10" : "border-white/10 bg-white/5"
      }`}
    >
      <span className="mr-1 text-white/50">{label}</span>
      <span className="font-semibold text-white/90">{value}</span>
    </div>
  );
}
