import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  startCareer,
  resolveChoice,
  next,
  randomSeed,
  type CreationChoices,
  type PlayerState,
} from "@/engine";

interface GameStore {
  career: PlayerState | null;
  startNew: (creation: CreationChoices) => void;
  choose: (choiceId: string) => void;
  advance: () => void;
  clear: () => void;
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      career: null,
      startNew: (creation) => set({ career: startCareer(creation, randomSeed()) }),
      choose: (choiceId) => {
        const c = get().career;
        if (c) set({ career: resolveChoice(c, choiceId) });
      },
      advance: () => {
        const c = get().career;
        if (c) set({ career: next(c) });
      },
      clear: () => set({ career: null }),
    }),
    {
      name: "fivestack-save",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : // Pas de stockage côté serveur : persist ignore proprement.
            (undefined as unknown as Storage),
      ),
      partialize: (s) => ({ career: s.career }),
    },
  ),
);

/**
 * Vrai une fois le composant monté côté client. `localStorage` étant synchrone,
 * le store est déjà réhydraté à ce moment-là : on peut lire `career` sans risque
 * de décalage d'hydratation SSR.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
