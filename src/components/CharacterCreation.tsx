"use client";

import { useState } from "react";
import type { CreationChoices, CreationOption, Role } from "@/engine/types";
import {
  ENTOURAGES,
  LIFESTYLES,
  NATIONALITIES,
  ORIGINS,
  ROLES,
} from "@/data/attributes";
import { getStartTeams } from "@/data/teams";
import { getLeague } from "@/data/teams";
import { archetypesForRole } from "@/data/archetypes";
import { effectLines } from "@/lib/display";

const START_TEAMS = getStartTeams();

const STEPS = ["Identité", "Rôle", "Style", "Parcours", "Mode de vie", "Entourage", "Équipe"] as const;

export default function CharacterCreation({
  onComplete,
}: {
  onComplete: (creation: CreationChoices) => void;
}) {
  const [step, setStep] = useState(0);
  const [pseudo, setPseudo] = useState("");
  const [nationalityId, setNationalityId] = useState("fr");
  const [role, setRole] = useState<Role>("Mid");
  const [originId, setOriginId] = useState("soloq");
  const [lifestyleId, setLifestyleId] = useState("equilibre");
  const [entourageId, setEntourageId] = useState("coach");
  const [startTeamId, setStartTeamId] = useState(START_TEAMS[0].id);
  const [signatureId, setSignatureId] = useState(archetypesForRole("Mid")[0].id);

  // Changer de rôle invalide la signature : chaque poste a ses propres styles.
  const roleArchetypes = archetypesForRole(role);
  const currentSignature = roleArchetypes.some((a) => a.id === signatureId)
    ? signatureId
    : roleArchetypes[0].id;

  const canNext = step === 0 ? pseudo.trim().length > 0 : true;
  const isLast = step === STEPS.length - 1;

  function finish() {
    onComplete({
      pseudo,
      nationalityId,
      role,
      originId,
      lifestyleId,
      entourageId,
      startTeamId,
      signatureId: currentSignature,
    });
  }

  return (
    <div className="card p-6">
      {/* Progression */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-neon-blue" : "bg-white/10"
              }`}
            />
            <div
              className={`mt-1.5 hidden text-center text-xs sm:block ${
                i === step ? "text-white" : "text-white/40"
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <StepTitle>Qui es-tu ?</StepTitle>
          <label className="mb-2 block text-sm text-white/70">Pseudo de joueur</label>
          <input
            autoFocus
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={16}
            placeholder="ex. Faketory"
            className="mb-6 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon-blue"
          />
          <label className="mb-2 block text-sm text-white/70">Nationalité</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {NATIONALITIES.map((n) => (
              <button
                key={n.id}
                onClick={() => setNationalityId(n.id)}
                className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                  nationalityId === n.id
                    ? "border-neon-blue bg-neon-blue/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{n.flag}</span>
                {n.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <StepTitle>Choisis ton rôle</StepTitle>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <SelectableRow
                key={r.id}
                selected={role === r.id}
                onClick={() => setRole(r.id)}
                title={r.label}
                description={r.description}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <StepTitle>Ton style de prédilection</StepTitle>
          <p className="mb-4 text-sm text-white/60">
            C&apos;est ta marque de fabrique. Chaque saison, un patch renforce ou affaiblit les
            styles : rester sur un seul te rend prévisible, en apprendre d&apos;autres te protège.
          </p>
          <div className="space-y-2">
            {roleArchetypes.map((a) => (
              <SelectableRow
                key={a.id}
                selected={currentSignature === a.id}
                onClick={() => setSignatureId(a.id)}
                title={a.label}
                description={a.description}
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <OptionStep
          title="Ton parcours jusqu'ici"
          options={ORIGINS}
          selectedId={originId}
          onSelect={setOriginId}
        />
      )}

      {step === 4 && (
        <OptionStep
          title="Ton mode de vie"
          options={LIFESTYLES}
          selectedId={lifestyleId}
          onSelect={setLifestyleId}
        />
      )}

      {step === 5 && (
        <OptionStep
          title="Ton entourage"
          options={ENTOURAGES}
          selectedId={entourageId}
          onSelect={setEntourageId}
        />
      )}

      {step === 6 && (
        <div>
          <StepTitle>Ta première équipe</StepTitle>
          <p className="mb-4 text-sm text-white/60">
            Tu débutes dans une ligue régionale. À toi de gravir les échelons vers la LEC, la LCK… et
            les Worlds.
          </p>
          <div className="space-y-2">
            {START_TEAMS.map((t) => {
              const league = getLeague(t.leagueId);
              return (
                <SelectableRow
                  key={t.id}
                  selected={startTeamId === t.id}
                  onClick={() => setStartTeamId(t.id)}
                  title={t.name}
                  description={`${league?.name} · ${league?.region} · Prestige ${t.prestige}/100`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          className="btn-ghost disabled:opacity-40"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Retour
        </button>
        {isLast ? (
          <button className="btn-primary" onClick={finish}>
            🚀 Démarrer la carrière
          </button>
        ) : (
          <button
            className="btn-primary disabled:opacity-40"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-bold text-white">{children}</h2>;
}

function OptionStep({
  title,
  options,
  selectedId,
  onSelect,
}: {
  title: string;
  options: CreationOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <StepTitle>{title}</StepTitle>
      <div className="space-y-2">
        {options.map((o) => (
          <SelectableRow
            key={o.id}
            selected={selectedId === o.id}
            onClick={() => onSelect(o.id)}
            title={o.label}
            description={o.description}
            effects={o}
          />
        ))}
      </div>
    </div>
  );
}

function SelectableRow({
  selected,
  onClick,
  title,
  description,
  effects,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  effects?: CreationOption;
}) {
  const lines = effects ? effectLines(effects.effects) : [];
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
        selected
          ? "border-neon-blue bg-neon-blue/10"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">{title}</span>
        {selected && <span className="text-neon-blue">✓</span>}
      </div>
      <p className="mt-1 text-sm text-white/60">{description}</p>
      {lines.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lines.map((l) => (
            <span
              key={l.key}
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                l.positive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {l.label} {l.text}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
