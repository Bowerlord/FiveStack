import type { CreationOption, Nationality, Role } from "@/engine/types";

export const ROLES: { id: Role; label: string; description: string }[] = [
  { id: "Top", label: "Top", description: "L'îlot. Duels en 1v1, tanks et bruisers, souvent isolé sur la carte." },
  { id: "Jungle", label: "Jungle", description: "Le chef d'orchestre. Contrôle des objectifs et tempo des ganks." },
  { id: "Mid", label: "Mid", description: "Le playmaker. Fort potentiel de carry et de highlights." },
  { id: "ADC", label: "ADC", description: "Le tireur. Dégâts constants en fin de partie, mais fragile." },
  { id: "Support", label: "Support", description: "Le cerveau. Vision, engages et protection du carry." },
];

export const NATIONALITIES: Nationality[] = [
  { id: "fr", name: "France", flag: "🇫🇷" },
  { id: "kr", name: "Corée du Sud", flag: "🇰🇷" },
  { id: "dk", name: "Danemark", flag: "🇩🇰" },
  { id: "de", name: "Allemagne", flag: "🇩🇪" },
  { id: "es", name: "Espagne", flag: "🇪🇸" },
  { id: "cn", name: "Chine", flag: "🇨🇳" },
  { id: "se", name: "Suède", flag: "🇸🇪" },
  { id: "pl", name: "Pologne", flag: "🇵🇱" },
  { id: "si", name: "Slovénie", flag: "🇸🇮" },
  { id: "be", name: "Belgique", flag: "🇧🇪" },
];

// Origine / parcours du joueur.
export const ORIGINS: CreationOption[] = [
  {
    id: "soloq",
    label: "Prodige de la SoloQ",
    description: "Repéré au sommet du classement. Talent brut, mais tout à apprendre du jeu en équipe.",
    effects: { skill: 12, reputation: 6, chimie: -6 },
  },
  {
    id: "academie",
    label: "Académie d'un grand club",
    description: "Formé dans une structure pro. Solide, discipliné, bien entouré dès le départ.",
    effects: { skill: 6, chimie: 8, argent: 3000 },
  },
  {
    id: "amateur",
    label: "Joueur amateur reconverti",
    description: "Monté depuis les ligues amateurs à la force du poignet. Mental d'acier.",
    effects: { skill: -4, morale: 8, forme: 8 },
  },
  {
    id: "streamer",
    label: "Star montante du streaming",
    description: "Déjà une communauté. Notoriété et revenus, mais des doutes sur ton niveau compétitif.",
    effects: { skill: -6, reputation: 14, argent: 8000, chimie: -4 },
  },
];

// Mode de vie.
export const LIFESTYLES: CreationOption[] = [
  {
    id: "discipline",
    label: "Rigueur et discipline",
    description: "Sommeil, alimentation, revue de VOD. Rien n'est laissé au hasard.",
    effects: { forme: 10, skill: 4, morale: -2 },
  },
  {
    id: "fetard",
    label: "Fêtard",
    description: "Tu profites de la vie. Charismatique et populaire, mais l'hygiène de vie en prend un coup.",
    effects: { morale: 8, reputation: 6, forme: -8, skill: -3 },
  },
  {
    id: "createur",
    label: "Créateur de contenu",
    description: "Stream, vidéos, réseaux. Ta marque personnelle grandit vite.",
    effects: { reputation: 10, argent: 4000, chimie: -3 },
  },
  {
    id: "equilibre",
    label: "Équilibré",
    description: "Tu sais couper. Un mental stable pour tenir sur la durée.",
    effects: { morale: 8, forme: 5 },
  },
];

// Entourage.
export const ENTOURAGES: CreationOption[] = [
  {
    id: "coach",
    label: "Un coach mentor",
    description: "Un ancien pro qui te prend sous son aile. Progression et cohésion.",
    effects: { skill: 6, chimie: 8 },
  },
  {
    id: "agent",
    label: "Un agent ambitieux",
    description: "Il négocie dur et te met en lumière, quitte à te mettre la pression.",
    effects: { reputation: 10, argent: 5000, morale: -4 },
  },
  {
    id: "famille",
    label: "Une famille soutenante",
    description: "Un socle solide derrière toi, dans les bons comme les mauvais jours.",
    effects: { morale: 8, forme: 6 },
  },
  {
    id: "amis",
    label: "Une bande de potes",
    description: "Toujours là pour rigoler. Bon pour le moral, moins pour la concentration.",
    effects: { morale: 6, forme: -3, chimie: -4 },
  },
];

export function getOption(list: CreationOption[], id: string): CreationOption | undefined {
  return list.find((o) => o.id === id);
}

export function getNationality(id: string): Nationality | undefined {
  return NATIONALITIES.find((n) => n.id === id);
}
