"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGame, useHydrated } from "@/state/gameStore";
import HeaderHud from "@/components/HeaderHud";
import StatsBar from "@/components/StatsBar";
import { EventCard, OutcomeCard, PhaseResultCard } from "@/components/GameCards";
import SeasonSummary from "@/components/SeasonSummary";
import FinalScore from "@/components/FinalScore";

export default function JouerPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const career = useGame((s) => s.career);
  const choose = useGame((s) => s.choose);
  const advance = useGame((s) => s.advance);
  const clear = useGame((s) => s.clear);

  // Pas de sauvegarde => retour à l'accueil.
  useEffect(() => {
    if (hydrated && !career) router.replace("/");
  }, [hydrated, career, router]);

  if (!hydrated || !career) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/50">
        Chargement…
      </main>
    );
  }

  const finished = career.status === "finished";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      {!finished && (
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Menu
          </Link>
          <button
            className="text-sm text-white/40 hover:text-rose-300"
            onClick={() => {
              if (confirm("Abandonner cette carrière ? La sauvegarde sera effacée.")) {
                clear();
                router.push("/");
              }
            }}
          >
            Abandonner
          </button>
        </div>
      )}

      <div className="space-y-4">
        {!finished && (
          <>
            <HeaderHud career={career} />
            <StatsBar stats={career.stats} />
          </>
        )}

        {career.status === "event" && career.currentEvent && (
          <EventCard event={career.currentEvent} onChoose={choose} />
        )}

        {career.status === "event_result" && career.lastOutcome && (
          <OutcomeCard outcome={career.lastOutcome} onNext={advance} />
        )}

        {career.status === "phase_result" && career.lastPhaseResult && (
          <PhaseResultCard result={career.lastPhaseResult} onNext={advance} />
        )}

        {career.status === "season_summary" && career.lastSeasonSummary && (
          <SeasonSummary
            summary={career.lastSeasonSummary}
            retired={career.retired}
            onNext={advance}
          />
        )}

        {finished && career.finalResult && (
          <FinalScore
            result={career.finalResult}
            pseudo={career.pseudo}
            onReplay={() => {
              clear();
              router.push("/creer");
            }}
          />
        )}
      </div>
    </main>
  );
}
