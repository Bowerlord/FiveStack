"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import CharacterCreation from "@/components/CharacterCreation";
import { useGame } from "@/state/gameStore";
import type { CreationChoices } from "@/engine/types";

export default function CreerPage() {
  const router = useRouter();
  const startNew = useGame((s) => s.startNew);

  function handleComplete(creation: CreationChoices) {
    startNew(creation);
    router.push("/jouer");
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-white/60 hover:text-white">
          ← Accueil
        </Link>
        <h1 className="text-lg font-bold text-white/80">Nouvelle carrière</h1>
      </div>
      <CharacterCreation onComplete={handleComplete} />
    </main>
  );
}
