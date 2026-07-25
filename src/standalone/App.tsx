"use client";

// Version autonome du jeu, sans Next.js ni routeur : les trois écrans sont
// pilotés par un état local. Utilisée pour produire un fichier HTML unique
// (voir scripts/build-standalone.mjs) partageable par simple lien.

import { useState } from "react";
import CharacterCreation from "@/components/CharacterCreation";
import HeaderHud from "@/components/HeaderHud";
import StatsBar from "@/components/StatsBar";
import { EventCard, OutcomeCard, PhaseResultCard } from "@/components/GameCards";
import SeasonSummary from "@/components/SeasonSummary";
import FinalScore from "@/components/FinalScore";
import { useGame, useHydrated } from "@/state/gameStore";
import type { CreationChoices } from "@/engine/types";

type Screen = "home" | "create" | "play";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const hydrated = useHydrated();
  const career = useGame((s) => s.career);
  const startNew = useGame((s) => s.startNew);
  const choose = useGame((s) => s.choose);
  const advance = useGame((s) => s.advance);
  const clear = useGame((s) => s.clear);

  function handleCreated(creation: CreationChoices) {
    startNew(creation);
    setScreen("play");
  }

  if (screen === "create") {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            className="text-sm text-white/60 hover:text-white"
            onClick={() => setScreen("home")}
          >
            ← Accueil
          </button>
          <h1 className="text-lg font-bold text-white/80">Nouvelle carrière</h1>
        </div>
        <CharacterCreation onComplete={handleCreated} />
      </main>
    );
  }

  if (screen === "play" && career) {
    return (
      <PlayScreen
        onMenu={() => setScreen("home")}
        onAbandon={() => {
          clear();
          setScreen("home");
        }}
        onReplay={() => {
          clear();
          setScreen("create");
        }}
        choose={choose}
        advance={advance}
      />
    );
  }

  const hasSave = hydrated && career !== null && !career.finalResult;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-12">
      <div className="text-center">
        <div className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
          Simulateur de carrière esport
        </div>
        <h1 className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-violet bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
          FiveStack
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
          Incarne un joueur pro de League of Legends. Chaque choix compte : gravis les ligues, gère
          ta forme et ton mental, et écris ta légende jusqu&apos;aux Worlds.
        </p>
      </div>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        {hasSave && (
          <button className="btn-primary text-lg" onClick={() => setScreen("play")}>
            ▶ Continuer — Saison {career!.season}
          </button>
        )}
        <button
          className={hasSave ? "btn-ghost" : "btn-primary text-lg"}
          onClick={() => setScreen("create")}
        >
          Nouvelle carrière
        </button>
      </div>

      <div className="mt-12 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
        <Feature icon="🧭" title="Des choix" text="Événements narratifs qui façonnent ta trajectoire." />
        <Feature icon="📈" title="Une progression" text="Splits, MSI, Worlds, transferts et déclin." />
        <Feature icon="🏆" title="Un verdict" text="Un score sur 100 et un rang en fin de carrière." />
      </div>

      <footer className="mt-12 text-center text-xs text-white/40">
        Jouable sans compte · sauvegarde locale · inspiré des jeux de carrière à choix
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-white/60">{text}</div>
    </div>
  );
}

function PlayScreen({
  onMenu,
  onAbandon,
  onReplay,
  choose,
  advance,
}: {
  onMenu: () => void;
  onAbandon: () => void;
  onReplay: () => void;
  choose: (id: string) => void;
  advance: () => void;
}) {
  const career = useGame((s) => s.career)!;
  // Confirmation en deux temps : `confirm()` peut être bloqué en iframe.
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const finished = career.status === "finished";

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-8">
      {!finished && (
        <div className="mb-4 flex items-center justify-between">
          <button className="text-sm text-white/50 hover:text-white" onClick={onMenu}>
            ← Menu
          </button>
          {confirmAbandon ? (
            <span className="flex items-center gap-3 text-sm">
              <span className="text-white/60">Abandonner ?</span>
              <button className="font-semibold text-rose-300 hover:text-rose-200" onClick={onAbandon}>
                Oui
              </button>
              <button className="text-white/50 hover:text-white" onClick={() => setConfirmAbandon(false)}>
                Non
              </button>
            </span>
          ) : (
            <button
              className="text-sm text-white/40 hover:text-rose-300"
              onClick={() => setConfirmAbandon(true)}
            >
              Abandonner
            </button>
          )}
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
          <FinalScore result={career.finalResult} pseudo={career.pseudo} onReplay={onReplay} />
        )}
      </div>
    </main>
  );
}
