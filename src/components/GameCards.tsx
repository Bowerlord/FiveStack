"use client";

import type {
  ArcStep,
  Choice,
  ChoiceOutcome,
  ClutchMoment,
  GameEvent,
  PhaseResult,
  Stats,
} from "@/engine/types";
import { meetsRequirements, missingRequirements, riskPercent, riskStat } from "@/engine";
import { effectLines, formatArgent, statLabel } from "@/lib/display";

/**
 * Bouton de choix. Les options verrouillées restent visibles avec leur
 * prérequis : c'est ce qui donne envie de construire un profil plutôt que de
 * subir des options qui apparaissent sans explication.
 */
export function ChoiceButton({
  choice,
  stats,
  onChoose,
}: {
  choice: Choice;
  stats: Stats;
  onChoose: (id: string) => void;
}) {
  // La probabilité affichée est celle du joueur, pas une valeur figée : elle
  // dépend de la qualité qui gouverne le pari.
  const chance = choice.risk ? riskPercent(choice.risk, stats) : null;
  const govStat = choice.risk ? riskStat(choice.risk) : null;
  const unlocked = meetsRequirements(stats, choice.requires);
  const missing = missingRequirements(stats, choice.requires);
  // Ce que l'option prélève sur ton compte : l'argent sert à s'acheter ce que le
  // club ne fournit pas, autant que ce soit lisible avant de cliquer.
  const cost = Math.max(0, -(choice.effects.argent ?? 0));

  if (!unlocked) {
    return (
      <div
        className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 opacity-60"
        aria-disabled="true"
      >
        <span className="font-semibold text-white/40">🔒 {choice.label}</span>
        <div className="mt-1 text-xs text-rose-300/80">
          {missing.map(([key, min]) => `${statLabel(key)} ${min} requis`).join(" · ")}
        </div>
      </div>
    );
  }

  return (
    <button className="choice-btn" onClick={() => onChoose(choice.id)}>
      <span className="font-semibold text-white">{choice.label}</span>
      {choice.risk && govStat && chance !== null && (
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-300">
            🎲 {chance} % de réussite
          </span>
          <span className="text-white/50">
            selon ton {statLabel(govStat).toLowerCase()} ({stats[govStat]})
          </span>
        </span>
      )}
      {choice.raisesPotential !== undefined && (
        <span className="mt-1.5 block text-xs font-semibold text-neon-cyan">
          ⛰️ Peut repousser ton plafond de talent
        </span>
      )}
      {cost > 0 && (
        <span className="mt-1.5 block text-xs font-semibold text-neon-gold">
          💰 Te coûte {formatArgent(cost)} — il t&apos;en restera{" "}
          {formatArgent(stats.argent - cost)}
        </span>
      )}
      {choice.endsCareer && (
        <span className="mt-1.5 block text-xs font-bold text-rose-300">
          ⛔ Met fin à ta carrière immédiatement
        </span>
      )}
    </button>
  );
}

// Carte d'événement : titre, contexte et choix.
export function EventCard({
  event,
  stats,
  onChoose,
}: {
  event: GameEvent;
  stats: Stats;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-white">{event.title}</h2>
      <p className="mt-3 leading-relaxed text-white/75">{event.text}</p>
      <div className="mt-6 space-y-3">
        {event.choices.map((c) => (
          <ChoiceButton key={c.id} choice={c} stats={stats} onChoose={onChoose} />
        ))}
      </div>
    </div>
  );
}

/**
 * Moment décisif : draft ou call en jeu. Signalé visuellement comme un temps
 * fort — c'est ici que se gagnent et se perdent les titres.
 */
export function ClutchCard({
  moment,
  stats,
  onChoose,
}: {
  moment: ClutchMoment;
  stats: Stats;
  onChoose: (choiceId: string) => void;
}) {
  const isDraft = moment.kind === "draft";
  return (
    <div className="card overflow-hidden border-neon-gold/40">
      <div
        className={`px-6 py-3 ${
          isDraft
            ? "bg-gradient-to-r from-neon-violet/30 to-neon-blue/20"
            : "bg-gradient-to-r from-neon-gold/25 to-neon-pink/20"
        }`}
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {isDraft ? "⚔️ Phase de draft" : "🔥 Moment décisif"}
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">{moment.title}</h2>
        <p className="mt-3 leading-relaxed text-white/75">{moment.text}</p>
        <div className="mt-6 space-y-3">
          {moment.choices.map((c) => (
            <ChoiceButton key={c.id} choice={c} stats={stats} onChoose={onChoose} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Étape d'un fil narratif. Signalée comme telle pour que le joueur comprenne
 * qu'il est dans une histoire qui le suit, et pas devant un événement isolé.
 */
export function ArcCard({
  step,
  label,
  stats,
  crisis = false,
  onChoose,
}: {
  step: ArcStep;
  label: string;
  stats: Stats;
  /** Une crise se distingue d'un fil ordinaire : la carrière peut s'y arrêter. */
  crisis?: boolean;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className={`card overflow-hidden ${crisis ? "border-rose-400/60" : "border-neon-violet/40"}`}>
      <div
        className={
          crisis
            ? "bg-gradient-to-r from-rose-500/35 to-rose-400/10 px-6 py-3"
            : "bg-gradient-to-r from-neon-violet/30 to-neon-pink/15 px-6 py-3"
        }
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {crisis ? "🚨" : "📖"} {label}
        </div>
        {crisis && (
          <div className="mt-1 text-xs text-rose-200/90">
            Ta carrière peut s&apos;arrêter ici. Lis bien avant de trancher.
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">{step.title}</h2>
        <p className="mt-3 leading-relaxed text-white/75">{step.text}</p>
        <div className="mt-6 space-y-3">
          {step.choices.map((c) => (
            <ChoiceButton key={c.id} choice={c} stats={stats} onChoose={onChoose} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Retour après un choix : conséquence narrative + deltas de stats.
export function OutcomeCard({
  outcome,
  onNext,
}: {
  outcome: ChoiceOutcome;
  onNext: () => void;
}) {
  const lines = effectLines(outcome.effects);
  const gamble = outcome.gambleWon;

  return (
    <div className="card p-6">
      <div className="text-sm uppercase tracking-wider text-neon-blue">Tu as choisi</div>
      <h2 className="mt-1 text-lg font-bold text-white">{outcome.choiceLabel}</h2>

      {gamble !== undefined && (
        <div
          className={`mt-3 inline-block rounded-lg px-3 py-1 text-sm font-bold ${
            gamble ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
          }`}
        >
          {gamble ? "🎲 Pari réussi !" : "🎲 Pari perdu…"}
        </div>
      )}

      <p className="mt-3 leading-relaxed text-white/75">{outcome.resultText}</p>

      {lines.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {lines.map((l) => (
            <span
              key={l.key}
              className={`rounded-lg px-2.5 py-1 text-sm font-semibold ${
                l.positive
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {l.label} {l.text}
            </span>
          ))}
        </div>
      )}

      {outcome.skillWasted !== undefined && outcome.skillWasted > 0 && (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
          ⛰️ {outcome.skillWasted} point{outcome.skillWasted > 1 ? "s" : ""} de skill perdu
          {outcome.skillWasted > 1 ? "s" : ""} : tu as atteint ton plafond de talent. Seul un travail
          de fond peut le repousser.
        </div>
      )}

      {outcome.potentialRaised !== undefined && outcome.potentialRaised > 0 && (
        <div className="mt-3 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-sm font-semibold text-neon-cyan">
          ⛰️ Plafond de talent repoussé de +{outcome.potentialRaised}
        </div>
      )}

      {outcome.perfDelta !== undefined && outcome.perfDelta !== 0 && (
        <div
          className={`mt-3 rounded-xl border px-4 py-2 text-sm font-semibold ${
            outcome.perfDelta > 0
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/30 bg-rose-400/10 text-rose-300"
          }`}
        >
          Impact sur le match : {outcome.perfDelta > 0 ? "+" : ""}
          {outcome.perfDelta}
        </div>
      )}

      <button className="btn-primary mt-6 w-full" onClick={onNext}>
        Continuer
      </button>
    </div>
  );
}

// Résultat d'une phase compétitive (split / MSI / Worlds).
export function PhaseResultCard({
  result,
  onNext,
}: {
  result: PhaseResult;
  onNext: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-neon-violet/25 to-neon-blue/25 px-6 py-4">
        <div className="text-sm uppercase tracking-wider text-white/70">{result.label}</div>
        <h2 className="mt-1 text-2xl font-extrabold text-white">{result.placementText}</h2>
      </div>
      <div className="p-6">
        <p className="leading-relaxed text-white/75">{result.detail}</p>
        {result.qualifiedNext && (
          <div className="mt-4 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 font-semibold text-neon-cyan">
            ✅ {result.qualifiedNext}
          </div>
        )}
        <button className="btn-primary mt-6 w-full" onClick={onNext}>
          Continuer
        </button>
      </div>
    </div>
  );
}
