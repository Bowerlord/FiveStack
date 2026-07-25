"use client";

import type { PlayerState } from "@/engine/types";
import { phaseLabel } from "@/engine";
import { getNationality } from "@/data/attributes";
import { getLeague, getTeam } from "@/data/teams";

export default function HeaderHud({ career }: { career: PlayerState }) {
  const nat = getNationality(career.nationalityId);
  const team = getTeam(career.teamId);
  const league = getLeague(career.leagueId);

  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/15 text-2xl">
          {nat?.flag ?? "🎮"}
        </div>
        <div>
          <div className="text-lg font-bold leading-tight">{career.pseudo}</div>
          <div className="text-sm text-white/60">
            {career.role} · {career.age} ans
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
