import type { Archetype, Role } from "@/engine/types";

// Styles de jeu maîtrisables, propres à chaque poste. Le patch de début de saison
// en renforce certains et en affaiblit d'autres : c'est le terrain qui bouge.

export const ARCHETYPES: Archetype[] = [
  // ─── Top ───
  { id: "top_tank", role: "Top", label: "Tank d'engage", description: "Tu encaisses et tu ouvres les combats pour ton équipe." },
  { id: "top_bruiser", role: "Top", label: "Bruiser", description: "Un profil hybride qui tient la ligne et frappe fort." },
  { id: "top_carry", role: "Top", label: "Carry d'île", description: "Tu gagnes ton duel seul et tu fais basculer la carte." },
  { id: "top_split", role: "Top", label: "Split-pusher", description: "Tu manges les tourelles pendant que ça se bat ailleurs." },
  { id: "top_weaver", role: "Top", label: "Poke et zonage", description: "Tu uses l'adversaire à distance et tu contrôles l'espace." },

  // ─── Jungle ───
  { id: "jgl_farm", role: "Jungle", label: "Jungler farm", description: "Tu montes en puissance et tu deviens un monstre en late." },
  { id: "jgl_gank", role: "Jungle", label: "Jungler agressif", description: "Tu vis dans les lignes adverses dès le niveau 3." },
  { id: "jgl_objective", role: "Jungle", label: "Contrôleur d'objectifs", description: "Dragons et Baron : tu joues la carte, pas les kills." },
  { id: "jgl_tank", role: "Jungle", label: "Tank initiateur", description: "Tu lances les combats et tu protèges tes carries." },
  { id: "jgl_assassin", role: "Jungle", label: "Assassin", description: "Tu supprimes la menace adverse avant qu'elle n'existe." },

  // ─── Mid ───
  { id: "mid_control", role: "Mid", label: "Mage de contrôle", description: "Tu verrouilles la zone et tu dictes le tempo." },
  { id: "mid_assassin", role: "Mid", label: "Assassin", description: "Tu cherches l'ouverture et tu punis la moindre erreur." },
  { id: "mid_roam", role: "Mid", label: "Roameur", description: "Tu abandonnes ta ligne pour faire gagner les autres." },
  { id: "mid_scaling", role: "Mid", label: "Scaling", description: "Tu survis à la phase de lignes pour exploser ensuite." },
  { id: "mid_lane_bully", role: "Mid", label: "Lane bully", description: "Tu écrases ton adversaire dès les premières minutes." },

  // ─── ADC ───
  { id: "adc_crit", role: "ADC", label: "Carry critique", description: "Le profil classique : des dégâts énormes en fin de partie." },
  { id: "adc_lane", role: "ADC", label: "Lane dominant", description: "Tu gagnes ta ligne et tu prends le contrôle du bas de carte." },
  { id: "adc_utility", role: "ADC", label: "Tireur utilitaire", description: "Moins de dégâts, mais tu apportes du contrôle à l'équipe." },
  { id: "adc_hypercarry", role: "ADC", label: "Hypercarry", description: "Faible au début, injouable si la partie s'éternise." },
  { id: "adc_poke", role: "ADC", label: "Poke de siège", description: "Tu grignotes les défenses avant même l'affrontement." },

  // ─── Support ───
  { id: "sup_engage", role: "Support", label: "Support engage", description: "Tu ouvres les combats et tu prends tous les risques." },
  { id: "sup_enchant", role: "Support", label: "Enchanteur", description: "Tu gardes ton carry en vie coûte que coûte." },
  { id: "sup_roam", role: "Support", label: "Support roameur", description: "Tu quittes le bas de carte pour créer des avantages ailleurs." },
  { id: "sup_vision", role: "Support", label: "Maître de la vision", description: "Tu rends la carte lisible pour toute ton équipe." },
  { id: "sup_mage", role: "Support", label: "Support mage", description: "Tu apportes des dégâts et de la pression en phase de lignes." },
];

export function getArchetype(id: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}

export function archetypesForRole(role: Role): Archetype[] {
  return ARCHETYPES.filter((a) => a.role === role);
}

export function archetypeLabel(id: string): string {
  return getArchetype(id)?.label ?? id;
}
