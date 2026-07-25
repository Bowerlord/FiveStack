"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGame, useHydrated } from "@/state/gameStore";
import GameScreen from "@/components/GameScreen";

export default function JouerPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const career = useGame((s) => s.career);
  const choose = useGame((s) => s.choose);
  const clutch = useGame((s) => s.clutch);
  const offer = useGame((s) => s.offer);
  const epilogue = useGame((s) => s.epilogue);
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

      <GameScreen
        career={career}
        onChoose={choose}
        onClutch={clutch}
        onOffer={offer}
        onEpilogue={epilogue}
        onNext={advance}
        onReplay={() => {
          clear();
          router.push("/creer");
        }}
      />
    </main>
  );
}
