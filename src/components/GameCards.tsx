"use client";

import type { ChoiceOutcome, GameEvent, PhaseResult } from "@/engine/types";
import { effectLines } from "@/lib/display";

// Carte d'événement : titre, contexte et choix.
export function EventCard({
  event,
  onChoose,
}: {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-white">{event.title}</h2>
      <p className="mt-3 leading-relaxed text-white/75">{event.text}</p>
      <div className="mt-6 space-y-3">
        {event.choices.map((c) => (
          <button key={c.id} className="choice-btn" onClick={() => onChoose(c.id)}>
            <span className="font-semibold text-white">{c.label}</span>
          </button>
        ))}
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
  return (
    <div className="card p-6">
      <div className="text-sm uppercase tracking-wider text-neon-blue">Tu as choisi</div>
      <h2 className="mt-1 text-lg font-bold text-white">{outcome.choiceLabel}</h2>
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
