import type { Arc } from "@/engine/types";

// Les crises : quand une jauge touche le fond, le jeu ne se contente plus de
// l'afficher en rouge. Il t'arrête et te met devant un choix qui peut mettre un
// terme à la carrière. Un fil de crise ne se tire pas au hasard — il s'impose.

export const CRISES: Arc[] = [
  // ──────────────────────────  Plus un euro  ──────────────────────────
  {
    id: "crisis_broke",
    label: "Le compte à zéro",
    entry: "broke_rent",
    critical: true,
    trigger: { maxStats: { argent: 0 } },
    steps: [
      {
        id: "broke_rent",
        title: "Le loyer, et rien pour le payer",
        text: "Ton compte affiche zéro. Le loyer tombe dans quatre jours et la structure traîne à verser ce qu'elle te doit. Tu as passé la nuit à faire des calculs au lieu de dormir.",
        maxStats: { argent: 0 },
        choices: [
          {
            id: "family",
            label: "Demander de l'aide à ta famille",
            effects: { argent: 12000, morale: -9, communaute: -2 },
            resultText:
              "Ils t'avancent de quoi tenir. Personne ne dit rien, mais le regard de ton père à table pèse plus lourd que la somme.",
            arcNext: { stepId: "broke_after", delaySeasons: 1 },
          },
          {
            id: "stream",
            label: "Streamer toutes les nuits pour rentrer de l'argent",
            effects: { argent: 22000, communaute: 12, forme: -14, skill: -3 },
            resultText:
              "Six heures de stream après six heures d'entraînement. L'audience grimpe, ton corps décroche.",
            arcNext: { stepId: "broke_after", delaySeasons: 1 },
          },
          {
            id: "anycontract",
            label: "Signer le premier contrat qui se présente, à n'importe quel prix",
            effects: { argent: 35000, reputation: -8, morale: -4 },
            resultText:
              "Tu signes sans négocier, sans lire les clauses. Ton agent est furieux : tu viens de brader ta valeur pour deux ans.",
            arcNext: { stepId: null },
          },
          {
            id: "quit",
            label: "Arrêter le circuit et prendre un vrai travail",
            effects: { morale: -12 },
            endsCareer: true,
            resultText:
              "Tu rends ton maillot un mardi matin, sans conférence de presse. Le rêve ne paye pas le loyer, et personne ne t'avait promis qu'il le ferait.",
            arcNext: { stepId: null },
          },
        ],
      },
      {
        id: "broke_after",
        title: "Le même mois, un an plus tard",
        text: "Tu as tenu. Mais la peur du découvert ne t'a pas quitté : elle est là à chaque fin de mois, et elle change la façon dont tu négocies.",
        choices: [
          {
            id: "hard",
            label: "Ne plus jamais signer sans garanties écrites",
            effects: { reputation: 4, morale: 6, argent: 8000 },
            resultText:
              "Tu lis les contrats ligne par ligne, maintenant. Ça agace les recruteurs et ça te protège.",
            arcNext: { stepId: null },
          },
          {
            id: "spend",
            label: "Te rattraper sur tout ce dont tu as été privé",
            effects: { morale: 10, argent: -18000, forme: -3 },
            resultText:
              "Tu compenses des années de privation en quelques semaines. Ça fait du bien, et ça ne construit rien.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ──────────────────────────  Le corps lâche  ──────────────────────────
  {
    id: "crisis_burnout",
    label: "Le corps qui dit stop",
    entry: "burn_wall",
    critical: true,
    trigger: { maxStats: { forme: 16 }, minSeason: 2 },
    steps: [
      {
        id: "burn_wall",
        title: "Le mur",
        text: "Tu n'arrives plus à enchaîner deux parties sans que ta vision se brouille. Le kiné parle de surmenage, le médecin de la structure évoque un arrêt. Ton coach, lui, parle du match de samedi.",
        maxStats: { forme: 20 },
        choices: [
          {
            id: "stop",
            label: "Accepter l'arrêt médical, quoi qu'en dise le coach",
            effects: { forme: 30, morale: 5, reputation: -6, chimie: -8 },
            resultText:
              "Trois semaines sans écran. Tu perds ta place de titulaire et le fil du méta, tu récupères un corps qui fonctionne.",
            arcNext: { stepId: null },
          },
          {
            id: "therapy",
            label: "Payer un préparateur physique et un kiné à plein temps",
            effects: { forme: 26, morale: 7, argent: -45000 },
            requires: { argent: 45000 },
            resultText:
              "Séances quotidiennes, sommeil surveillé, alimentation revue. C'est ce que font les meilleurs — et ça coûte ce que ça coûte.",
            arcNext: { stepId: null },
          },
          {
            id: "push",
            label: "Serrer les dents jusqu'à la fin de la saison",
            effects: { reputation: 3, chimie: 4 },
            risk: {
              chance: 0.42,
              stat: "forme",
              success: {
                effects: { forme: 6, morale: 4, reputation: 5 },
                text: "Tu tiens. Tout le monde salue ton courage, et personne ne saura à quel prix.",
              },
              failure: {
                effects: { forme: -8, morale: -10, skill: -4 },
                text: "Ton corps a rendu les armes en pleine série. Tu as joué la fin de saison à 40 % de tes moyens.",
              },
            },
            resultText: "",
            arcNext: { stepId: "burn_verdict", delaySeasons: 1 },
          },
        ],
      },
      {
        id: "burn_verdict",
        title: "Le verdict du spécialiste",
        text: "Un an que tu joues avec la douleur. Le spécialiste étale les examens sur son bureau et ne prend pas de gants : « Vous pouvez continuer. Mais pas longtemps, et pas à ce niveau. »",
        choices: [
          {
            id: "adapt",
            label: "Réduire la charge et jouer plus intelligemment",
            effects: { forme: 18, skill: -3, morale: 3 },
            resultText:
              "Moins d'heures, plus de vidéo. Tu compenses la main par la lecture de jeu — un autre joueur, pas un moins bon.",
            arcNext: { stepId: null },
          },
          {
            id: "ignore",
            label: "Ne rien changer : tu joueras jusqu'à ce que ça casse",
            effects: { morale: 4, reputation: 4 },
            endsCareer: true,
            resultText:
              "Ça a cassé un mardi de pré-saison, sans public et sans caméra. Le diagnostic est sans appel : plus jamais au niveau pro.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },

  // ──────────────────────────  La tête ne suit plus  ──────────────────────────
  {
    id: "crisis_morale",
    label: "L'envie disparue",
    entry: "mind_empty",
    critical: true,
    trigger: { maxStats: { morale: 16 }, minSeason: 2 },
    steps: [
      {
        id: "mind_empty",
        title: "Plus envie d'allumer le PC",
        text: "Ce n'est pas de la fatigue. Tu regardes l'écran de connexion et tu ne ressens plus rien — ni l'excitation, ni la peur, rien. Ça fait trois semaines.",
        maxStats: { morale: 20 },
        choices: [
          {
            id: "psy",
            label: "Payer un préparateur mental, sérieusement cette fois",
            effects: { morale: 24, forme: 6, argent: -30000 },
            requires: { argent: 30000 },
            resultText:
              "Deux séances par semaine. Tu apprends à séparer ce que tu vaux de ce que dit le classement. Personne ne t'avait appris ça.",
            arcNext: { stepId: null },
          },
          {
            id: "talk",
            label: "En parler au groupe, à visage découvert",
            effects: { morale: 16, chimie: 12, reputation: -3 },
            resultText:
              "Le silence dans la salle, puis le support qui dit « moi aussi ». Vous êtes cinq, et personne n'avait rien dit.",
            arcNext: { stepId: null },
          },
          {
            id: "hide",
            label: "Ne rien dire et continuer à jouer",
            effects: { reputation: 2 },
            risk: {
              chance: 0.35,
              stat: "morale",
              success: {
                effects: { morale: 12, skill: 3 },
                text: "Ça revient tout seul, un soir, sur une partie sans enjeu. Tu ne sauras jamais pourquoi.",
              },
              failure: {
                effects: { morale: -8, chimie: -10, forme: -6 },
                text: "Tu joues en pilote automatique. Le groupe le voit, personne n'ose en parler, et l'ambiance s'effondre.",
              },
            },
            resultText: "",
            arcNext: { stepId: "mind_verdict", delaySeasons: 1 },
          },
          {
            id: "walk",
            label: "Tout arrêter maintenant",
            effects: {},
            endsCareer: true,
            resultText:
              "Tu envoies un message au manager à trois heures du matin. Deux lignes. C'est la première décision qui te soulage depuis des mois.",
            arcNext: { stepId: null },
          },
        ],
      },
      {
        id: "mind_verdict",
        title: "Un an à faire semblant",
        text: "Tu as tenu la façade une saison entière. Le staff met tes contre-performances sur le compte du méta. Toi, tu sais.",
        choices: [
          {
            id: "help",
            label: "Demander de l'aide, enfin",
            effects: { morale: 20, chimie: 8, forme: 5 },
            resultText:
              "Il aura fallu un an. Le préparateur mental te dira que c'est la moyenne, et que ça n'a rien de honteux.",
            arcNext: { stepId: null },
          },
          {
            id: "done",
            label: "Reconnaître que c'est fini",
            effects: {},
            endsCareer: true,
            resultText:
              "Tu ne t'arrêtes pas sur une blessure ni sur un échec sportif. Tu t'arrêtes parce que l'envie n'est jamais revenue.",
            arcNext: { stepId: null },
          },
        ],
      },
    ],
  },
];
