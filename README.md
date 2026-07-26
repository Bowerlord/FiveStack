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

Certaines décisions ne se referment pas tout de suite : elles ouvrent un **fil narratif qui court sur
plusieurs saisons** — une douleur au poignet qu'on ignore, un rival de ta génération, un mentor, une
affaire qui ressort. Toutes ne finissent pas bien.

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
   parcours, mode de vie, entourage et équipe de départ — les filières de ton pays d'abord. Chaque
   option applique des bonus/malus.
2. **Patch notes** en début de saison : ce qui est renforcé, ce qui est affaibli, et l'effet sur
   **ton** pool de champions.
3. **Carrière** : pré-saison (mercato, travail du pool) puis split de printemps, MSI (si qualifié),
   split d'été et Worlds (si qualifié). Tu réponds aux événements ; en finale et à l'international,
   tu prends la main sur la **draft** et sur un **call décisif**.
4. **Bilan** de fin de saison, puis **choix de ton avenir** : prolonger, rejoindre une grande écurie,
   un projet à bâtir, ou partir en LCK/LPL (avec la barrière de la langue).
5. **Reconversion** au moment de raccrocher — de ton plein gré, ou parce qu'une crise a tranché pour
   toi : streamer, coach, analyste, patron de structure ou tourner la page.
6. **Verdict** : score /100, rang et palmarès.

**Statistiques** : Skill, Cote (réputation pro), Moral, Forme, Chimie d'équipe, **Communauté**, Argent.
L'**argent** n'est pas décoratif : il paie un coach personnel, un suivi médical, un déménagement — ou
il dort sur ton compte et rapporte jusqu'à 5 points au bilan. Tomber à zéro déclenche une crise.
Ton **rang SoloQ** est dérivé de ton niveau et affiché en permanence : en esport, ta vitrine est publique.

### Ce qui fait l'identité esport du jeu

- **Patchs & pool de champions** — le jeu change sous tes pieds. Un pool étroit te rend prévisible et
  te fait *ban out* en draft ; élargir ton répertoire coûte du temps et de la forme.
- **Moments décisifs** — bans et calls en jeu, avec de vrais paris. Chaque pari est **piloté par la
  statistique qui le gouverne** : voler un smite dépend de ton skill, un engage surprise de la chimie
  du groupe, un positionnement limite de ta forme. La probabilité affichée est *la tienne*.
- **Plafond de talent franchissable** — chaque carrière a son potentiel (55–99). Il borne ton niveau
  de jeu, il est affiché en clair (« Skill 69 / 69 »), et certains choix rares le repoussent.
- **Arcs multi-saisons** — des fils narratifs à embranchements qui reviennent saison après saison, avec
  de vraies mauvaises fins (une blessure niée peut écourter la carrière).
- **Choix conditionnés** — certaines options exigent un minimum de forme, de chimie ou de moral. Elles
  restent visibles, verrouillées, pour que tu saches quoi construire.
- **Situations contextuelles** — le jeu tient compte d'où tu en es : anonyme en régionale, premier jour
  en ligue majeure, poids d'un palmarès à défendre, barrière de la langue, vétéran du club.
- **Ladder SoloQ & communauté** — clips viraux, threads Reddit, memes, vagues de haine.
- **Instabilité des orgs** — sponsors qui partent, salaires impayés, structures qui coulent. Quand ton
  org met la clé sous la porte, l'option « prolonger » disparaît vraiment du mercato.
- **Crises** — quand une jauge touche le fond (plus un euro, corps ou mental à bout), le jeu t'arrête
  et te met devant un choix qui peut mettre un terme à la carrière, sur le champ.
- **L'argent s'échange contre de la performance** — coach personnel, kiné à plein temps, appartement
  près du gaming house, aide à ta famille. Ton magot compte jusqu'à 5 points dans le score final :
  dépenser est un arbitrage, pas une évidence.
- **Mercato** — les effectifs bougent chaque hiver. Une équipe se renforce, une autre perd ses
  titulaires, et les propositions de contrat le disent noir sur blanc.
- **Cohérence régionale** — tu débutes dans la filière de ton pays (LCK Challengers pour un Coréen,
  LFL pour un Français). Partir ailleurs dès tes débuts coûte cher en adaptation, et changer de club
  au sein d'une même région n'est pas un « départ à l'étranger ».
- **Reconversion** — on raccroche entre 27 et 33 ans, parfois bien plus tôt sur une crise ; le
  second acte fait partie du bilan.

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
    risk.ts              Probabilité d'un pari selon la stat qui le gouverne
    potential.ts         Plafond de talent et conditions pour le repousser
    context.ts           Filtrage des situations selon l'état de la carrière
    arcs.ts              Fils narratifs multi-saisons (un seul actif à la fois)
    crisis.ts            Crises imposées quand une jauge touche le fond
    mercato.ts           Prestige des équipes qui évolue d'une saison à l'autre
    meta.ts              Patchs, pool de champions, risque de ban out
    offers.ts            Offres de contrat de l'intersaison
    epilogue.ts          Voies de reconversion
    ladder.ts            Rang SoloQ dérivé
    progression.ts       Orchestrateur : phases → saisons → transferts → retraite
    scoring.ts           Score final /100 et rang
  data/                  Contenu FR (rôles, archétypes, ligues, équipes)
    events/              ~104 événements par thème (dont ~20 propres à chaque poste)
      context.fr.ts      Situations liées au contexte (ligue, palmarès, ancienneté…)
      money.fr.ts        Ce qu'on peut s'acheter quand on en a les moyens
    arcs.fr.ts           Les 5 arcs multi-saisons et leurs embranchements
    crises.fr.ts         Les 3 fils de crise, dont les issues fatales
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
| Choix aléatoires | 46,6 | 43 | 7,0 % | 3,2 % |
| Choix réfléchis | **80,4** | 87 | 47,8 % | 47,4 % |

L'écart entre les deux lignes est la mesure qui compte : c'est lui qui dit si les choix pèsent
vraiment. Des tests verrouillent ces invariants pour éviter toute dérive.

## Pistes d'évolution

- Backend & comptes, classements en ligne
- Davantage d'arcs, et des fils qui se croisent entre eux
- Internationalisation (actuellement FR uniquement)
- Sons, animations, partage du bilan de carrière
