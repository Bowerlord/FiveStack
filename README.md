# FiveStack 🎮

**Simulateur de carrière esport** (League of Legends) basé sur des choix — dans l'esprit de
*Destiny Eleven*, mais appliqué à la scène pro LoL.

Tu incarnes un joueur professionnel : tu crées ton personnage, puis tu déroules ta carrière
**saison par saison**. À chaque étape, des **événements narratifs à choix multiples** modifient tes
statistiques et orientent ta trajectoire. Gravis les ligues régionales jusqu'à la LEC/LCK, dispute
le MSI et les Worlds, gère ta forme et ton mental… et découvre en fin de carrière ton **score sur
100** et ton rang (de « Rêve inachevé » au « GOAT »).

Jouable en navigateur, **sans compte**, une partie dure quelques minutes. La sauvegarde est locale
(localStorage).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Autres scripts :

```bash
npm run build    # build de production
npm run start    # sert le build de production
npm run test     # tests unitaires du moteur (Vitest)
```

## Comment on joue

1. **Création** : pseudo, nationalité, rôle (Top/Jungle/Mid/ADC/Support), parcours, mode de vie,
   entourage et équipe de départ — chaque option applique des bonus/malus.
2. **Carrière** : pour chaque saison, une pré-saison (mercato) puis le split de printemps, le MSI
   (si qualifié), le split d'été et les Worlds (si qualifié). Tu réponds aux événements et les
   résultats des compétitions sont simulés à partir de tes stats.
3. **Bilan** de fin de saison, transferts, vieillissement et déclin, jusqu'à la retraite.
4. **Verdict** : score /100, rang et palmarès.

**Statistiques** : Skill, Cote (réputation), Moral, Forme, Chimie d'équipe, Argent.

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
    simulation.ts        Simulation des splits / internationaux
    progression.ts       Enchaînement phases → saisons, transferts, retraite
    scoring.ts           Score final /100 et rang
  data/                  Contenu (rôles, ligues, équipes, événements FR)
  state/gameStore.ts     Store Zustand + sauvegarde localStorage
  components/            Composants d'interface
tests/                   Tests du moteur (Vitest)
```

### Pourquoi le moteur est isolé

Tout le moteur (`src/engine`) est du TypeScript pur, sans React ni DOM, et le hasard passe par un
**RNG seedable déterministe** : une carrière est entièrement reproductible à partir de sa graine.
Cet isolement prépare l'ajout d'un **backend** (comptes, sauvegardes serveur, classements en ligne,
validation anti-triche) sans réécrire la logique de jeu.

## Pistes d'évolution

- Backend & comptes, classements en ligne
- Davantage d'événements et de trajectoires (rivalités récurrentes, arcs narratifs)
- Internationalisation (actuellement FR uniquement)
- Sons, animations, partage du bilan de carrière
