import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FiveStack — Écris ta légende de l'esport",
  description:
    "Simulateur de carrière esport (League of Legends) basé sur des choix. Crée ton joueur, prends les bonnes décisions et vise les Worlds.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
