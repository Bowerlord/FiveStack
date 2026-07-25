// Produit une version du jeu en UN SEUL fichier HTML (React, moteur et styles
// tout inlinés, aucune ressource externe). Pratique pour partager le jeu par
// simple lien, l'ouvrir sur mobile ou le déposer sur n'importe quel hébergeur.
//
//   npm run build:standalone   ->   dist/fivestack.html

import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const tmpCss = resolve(dist, ".tailwind.css");

mkdirSync(dist, { recursive: true });

// 1. Bundle de l'application (JSX -> JS, dépendances incluses).
const bundle = await build({
  entryPoints: [resolve(root, "src/standalone/main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  alias: { "@": resolve(root, "src") },
  define: { "process.env.NODE_ENV": '"production"' },
  write: false,
  logLevel: "warning",
});
const js = bundle.outputFiles[0].text;

// 2. Feuille de styles Tailwind compilée.
execFileSync(
  "npx",
  ["tailwindcss", "-i", resolve(root, "app/globals.css"), "-o", tmpCss, "--minify"],
  { cwd: root, stdio: ["ignore", "ignore", "inherit"] },
);
const css = readFileSync(tmpCss, "utf8");
rmSync(tmpCss, { force: true });

// 3. Assemblage. Le contenu est volontairement limité à <title>/<style>/<div>/
//    <script> : il peut être servi tel quel ou inséré dans un gabarit HTML.
const guard = (s) => s.replace(/<\/(script|style)/gi, "<\\/$1");

const html = `<title>FiveStack — Écris ta légende de l'esport</title>
<style>${guard(css)}</style>
<div id="root"></div>
<script>${guard(js)}</script>
`;

const out = resolve(dist, "fivestack.html");
writeFileSync(out, html);

const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;
console.log(`✓ ${out}`);
console.log(`  JS ${kb(js.length)} · CSS ${kb(css.length)} · total ${kb(html.length)}`);
