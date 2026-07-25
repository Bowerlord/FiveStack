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

/**
 * localStorage peut être indisponible : rendu côté serveur, navigation privée
 * Safari, iframe cloisonnée… On retombe alors sur un stockage mémoire pour que
 * la partie reste jouable (simplement non conservée entre deux visites).
 */
function safeStorage(): Storage {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = "__fivestack_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    // stockage refusé : on bascule en mémoire
  }
  const mem = new Map<string, string>();
  return {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => void mem.set(k, v),
    removeItem: (k) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i) => Array.from(mem.keys())[i] ?? null,
    get length() {
      return mem.size;
    },
  } as Storage;
}

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
      storage: createJSONStorage(() => safeStorage()),
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
