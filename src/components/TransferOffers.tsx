"use client";

import type { Offer } from "@/engine/types";
import { formatArgent } from "@/lib/display";

const KIND_BADGE: Record<Offer["kind"], { label: string; className: string }> = {
  stay: { label: "Prolongation", className: "bg-neon-cyan/20 text-neon-cyan" },
  major: { label: "Grande écurie", className: "bg-neon-gold/20 text-neon-gold" },
  rebuild: { label: "Projet à bâtir", className: "bg-neon-blue/20 text-neon-blue" },
  import: { label: "Départ à l'étranger", className: "bg-neon-pink/20 text-neon-pink" },
  homecoming: { label: "Retour au pays", className: "bg-emerald-500/20 text-emerald-300" },
  erl: { label: "Ligue régionale", className: "bg-white/15 text-white/80" },
};

/**
 * Intersaison : le joueur ne subit plus son transfert, il tranche. Chaque offre
 * affiche franchement ses contreparties.
 */
export default function TransferOffers({
  offers,
  onChoose,
}: {
  offers: Offer[];
  onChoose: (offerId: string) => void;
}) {
  return (
    <div className="card p-6">
      <h2 className="text-2xl font-extrabold text-white">Intersaison — ton avenir</h2>
      <p className="mt-2 text-white/70">
        {offers.length > 1
          ? "Les propositions sont sur la table. À toi de choisir la suite de ta carrière."
          : "Le marché est calme cette année. Peu d'options s'offrent à toi."}
      </p>

      <div className="mt-5 space-y-3">
        {offers.map((offer) => {
          const badge = KIND_BADGE[offer.kind];
          return (
            <button
              key={offer.id}
              onClick={() => onChoose(offer.id)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-neon-blue/60 hover:bg-neon-blue/10 active:scale-[0.99]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-lg font-bold text-white">{offer.teamName}</span>
                  <span className="ml-2 text-sm text-white/50">{offer.leagueName}</span>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badge.className}`}>
                  {badge.label}
                </span>
              </div>

              <div className="mt-2 text-sm font-semibold text-neon-gold">
                {formatArgent(offer.salary)} / saison
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ul className="space-y-1">
                  {offer.pros.map((p, i) => (
                    <li key={i} className="text-sm text-emerald-300/90">
                      + {p}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {offer.cons.map((c, i) => (
                    <li key={i} className="text-sm text-rose-300/90">
                      − {c}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
