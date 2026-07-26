"use client";

import type { PlayerState } from "@/engine/types";
import HeaderHud from "./HeaderHud";
import StatsBar from "./StatsBar";
import PatchNotes from "./PatchNotes";
import TransferOffers from "./TransferOffers";
import Epilogue from "./Epilogue";
import SeasonSummary from "./SeasonSummary";
import FinalScore from "./FinalScore";
import { ArcCard, ClutchCard, EventCard, OutcomeCard, PhaseResultCard } from "./GameCards";
import { arcLabel, isCrisisArc } from "@/engine";

/**
 * Rendu de l'état de jeu courant. Partagé par l'app Next et la version autonome
 * pour que les deux affichent exactement la même chose.
 */
export default function GameScreen({
  career,
  onChoose,
  onClutch,
  onArc,
  onOffer,
  onEpilogue,
  onNext,
  onReplay,
}: {
  career: PlayerState;
  onChoose: (choiceId: string) => void;
  onClutch: (choiceId: string) => void;
  onArc: (choiceId: string) => void;
  onOffer: (offerId: string) => void;
  onEpilogue: (pathId: string) => void;
  onNext: () => void;
  onReplay: () => void;
}) {
  const finished = career.status === "finished";
  // Les écrans « hors match » occupent tout l'espace : pas de HUD ni de stats.
  const fullscreen =
    finished || career.status === "epilogue" || career.status === "transfer_choice";

  return (
    <div className="space-y-4">
      {!fullscreen && (
        <>
          <HeaderHud career={career} />
          <StatsBar stats={career.stats} potential={career.potential} />
        </>
      )}

      {career.status === "patch_notes" && <PatchNotes career={career} onNext={onNext} />}

      {career.status === "arc" && career.currentArcStep && (
        <ArcCard
          step={career.currentArcStep}
          label={career.currentArcId ? arcLabel(career.currentArcId) : "Ton histoire"}
          crisis={isCrisisArc(career.currentArcId)}
          stats={career.stats}
          onChoose={onArc}
        />
      )}

      {career.status === "event" && career.currentEvent && (
        <EventCard event={career.currentEvent} stats={career.stats} onChoose={onChoose} />
      )}

      {career.status === "clutch" && career.currentClutch && (
        <ClutchCard moment={career.currentClutch} stats={career.stats} onChoose={onClutch} />
      )}

      {(career.status === "event_result" || career.status === "clutch_result") &&
        career.lastOutcome && <OutcomeCard outcome={career.lastOutcome} onNext={onNext} />}

      {career.status === "phase_result" && career.lastPhaseResult && (
        <PhaseResultCard result={career.lastPhaseResult} onNext={onNext} />
      )}

      {career.status === "season_summary" && career.lastSeasonSummary && (
        <SeasonSummary
          summary={career.lastSeasonSummary}
          retired={career.retired}
          onNext={onNext}
        />
      )}

      {career.status === "transfer_choice" && (
        <TransferOffers offers={career.offers} onChoose={onOffer} />
      )}

      {career.status === "epilogue" && <Epilogue career={career} onChoose={onEpilogue} />}

      {finished && career.finalResult && (
        <FinalScore result={career.finalResult} pseudo={career.pseudo} onReplay={onReplay} />
      )}
    </div>
  );
}
