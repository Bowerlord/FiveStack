import type { GameEvent } from "@/engine/types";
import { PRESEASON_EVENTS } from "./preseason.fr";
import { SPLIT_EVENTS } from "./split.fr";
import { INTERNATIONAL_EVENTS } from "./international.fr";
import { ROLE_EVENTS } from "./roles.fr";
import { ORG_EVENTS } from "./org.fr";
import { COMMUNITY_EVENTS } from "./community.fr";
import { GENERIC_EVENTS } from "./generic.fr";

// Pool complet. Ajouter du contenu = pousser un objet dans le fichier thématique
// correspondant ; le moteur (tirage pondéré, sans répétition) n'a rien à savoir.

export const EVENTS: GameEvent[] = [
  ...PRESEASON_EVENTS,
  ...SPLIT_EVENTS,
  ...INTERNATIONAL_EVENTS,
  ...ROLE_EVENTS,
  ...ORG_EVENTS,
  ...COMMUNITY_EVENTS,
  ...GENERIC_EVENTS,
];

export function getEventById(id: string): GameEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
