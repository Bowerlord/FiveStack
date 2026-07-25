"use client";

import { useRouter } from "next/navigation";
import { useGame, useHydrated } from "@/state/gameStore";

export default function HomePage() {
  const router = useRouter();
  const career = useGame((s) => s.career);
  const hydrated = useHydrated();
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
          <button className="btn-primary text-lg" onClick={() => router.push("/jouer")}>
            ▶ Continuer — Saison {career!.season}
          </button>
        )}
        <button
          className={hasSave ? "btn-ghost" : "btn-primary text-lg"}
          onClick={() => router.push("/creer")}
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
