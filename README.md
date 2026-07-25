# FiveStack 🎮

**Simulateur de carrière esport** (League of Legends) basé sur des choix — dans l'esprit de
*Destiny Eleven*, mais appliqué à la scène pro LoL.

Tu incarnes un joueur professionnel : tu crées ton personnage, puis tu déroules ta carrière
**saison par saison**. À chaque étape, des **événements narratifs à choix multiples** modifient tes
statistiques et orientent ta trajectoire. Gravis les ligues régionales jusqu'à la LEC/LCK, dispute
le MSI et les Worlds, gère ta forme et ton mental… et découvre en fin de carrière ton **score sur
100** et ton rang (de « Rêve inachevé » au « GOAT »).

En finale, au MSI et aux Worlds, tu ne subis pas le résultat : tu tranches la **phase de bans** puis
un **call décisif en jeu**. Et chaque saison, un **patch** rebat les cartes — ton style de
prédilection peut se retrouver nerf du jour au lendemain.

Jouable en navigateur, **sans compte**, une partie dure quelques minutes. La sauvegarde est locale
(localStorage).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Autres scripts :

```bash
npm run build             # build de production
npm run start             # sert le build de production
npm run test              # tests unitaires du moteur (Vitest)
npm run balance 500       # banc d'équilibrage : distribution des scores sur N carrières
npm run build:standalone  # génère dist/fivestack.html (jeu complet en un seul fichier)
```

## Comment on joue

1. **Création** : pseudo, nationalité, rôle (Top/Jungle/Mid/ADC/Support), **style de prédilection**,
   parcours, mode de vie, entourage et équipe de départ — chaque option applique des bonus/malus.
2. **Patch notes** en début de saison : ce qui est renforcé, ce qui est affaibli, et l'effet sur
   **ton** pool de champions.
3. **Carrière** : pré-saison (mercato, travail du pool) puis split de printemps, MSI (si qualifié),
   split d'été et Worlds (si qualifié). Tu réponds aux événements ; en finale et à l'international,
   tu prends la main sur la **draft** et sur un **call décisif**.
4. **Bilan** de fin de saison, puis **choix de ton avenir** : prolonger, rejoindre une grande écurie,
   un projet à bâtir, ou partir en LCK/LPL (avec la barrière de la langue).
5. **Reconversion** au moment de raccrocher : streamer, coach, analyste, patron de structure ou
   tourner la page — selon ce que tu as construit.
6. **Verdict** : score /100, rang et palmarès.

**Statistiques** : Skill, Cote (réputation pro), Moral, Forme, Chimie d'équipe, **Communauté**, Argent.
Ton **rang SoloQ** est dérivé de ton niveau et affiché en permanence : en esport, ta vitrine est publique.

### Ce qui fait l'identité esport du jeu

- **Patchs & pool de champions** — le jeu change sous tes pieds. Un pool étroit te rend prévisible et
  te fait *ban out* en draft ; élargir ton répertoire coûte du temps et de la forme.
- **Moments décisifs** — bans et calls en jeu, avec de vrais paris (risque affiché, tirage seedé).
- **Choix conditionnés** — certaines options exigent un minimum de forme, de chimie ou de moral. Elles
  restent visibles, verrouillées, pour que tu saches quoi construire.
- **Ladder SoloQ & communauté** — clips viraux, threads Reddit, memes, vagues de haine.
- **Instabilité des orgs** — sponsors qui partent, salaires impayés, structures qui coulent.
- **Reconversion** — la carrière s'arrête à 25 ans ; le second acte fait partie du bilan.

## Architecture

Stack : **Next.js (App Router) + TypeScript + Tailwind CSS**, **Zustand** pour l'état + persistance.

```
app/                     Pages (accueil, /creer, /jouer)
src/
  engine/                Moteur de jeu — TypeScript PUR, sans dépendance UI
    types.ts             Types du domaine
    rng.ts               RNG déterministe et sérialisable (mulberry32)
    createCareer.ts      État initial à partir des choix de création
    events.ts            Tirage pondéré des événements
    simulation.ts        Marge de performance, puis classement (scindé pour les clutchs)
    clutch.ts            Moments décisifs : draft, calls, paris
    meta.ts              Patchs, pool de champions, risque de ban out
    offers.ts            Offres de contrat de l'intersaison
    epilogue.ts          Voies de reconversion
    ladder.ts            Rang SoloQ dérivé
    progression.ts       Orchestrateur : phases → saisons → transferts → retraite
    scoring.ts           Score final /100 et rang
  data/                  Contenu FR (rôles, archétypes, ligues, équipes)
    events/              ~87 événements par thème (dont ~20 propres à chaque poste)
    clutch.fr.ts         Séquences de draft et de calls décisifs
  state/gameStore.ts     Store Zustand + sauvegarde localStorage
  components/            Composants d'interface
tests/                   Tests du moteur (Vitest)
```

### Pourquoi le moteur est isolé

Tout le moteur (`src/engine`) est du TypeScript pur, sans React ni DOM, et le hasard passe par un
**RNG seedable déterministe** : une carrière est entièrement reproductible à partir de sa graine.
Cet isolement prépare l'ajout d'un **backend** (comptes, sauvegardes serveur, classements en ligne,
validation anti-triche) sans réécrire la logique de jeu.

## Équilibrage

`npm run balance` mesure la distribution des scores sur des centaines de carrières simulées, avec
deux profils : un joueur qui clique au hasard et un joueur qui optimise. Les cibles tenues
actuellement :

| | Score moyen | Médiane | Titre mondial | % GOAT |
|---|---|---|---|---|
| Choix aléatoires | 41,9 | 40 | 4,4 % | 0,4 % |
| Choix réfléchis | **76,1** | 76 | 50,2 % | 34,4 % |

L'écart entre les deux lignes est la mesure qui compte : c'est lui qui dit si les choix pèsent
vraiment. Des tests verrouillent ces invariants pour éviter toute dérive.

## Pistes d'évolution

- Backend & comptes, classements en ligne
- Rivalités récurrentes et arcs narratifs sur plusieurs saisons
- Internationalisation (actuellement FR uniquement)
- Sons, animations, partage du bilan de carrière
