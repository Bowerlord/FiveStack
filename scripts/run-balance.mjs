// Compile le banc d'équilibrage (TypeScript + alias @) puis l'exécute.
import { build } from "esbuild";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = await build({
  entryPoints: [resolve(root, "scripts/balance.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  alias: { "@": resolve(root, "src") },
  write: false,
  logLevel: "error",
});
const dir = mkdtempSync(resolve(tmpdir(), "fivestack-"));
const file = resolve(dir, "balance.mjs");
writeFileSync(file, out.outputFiles[0].text);
try {
  await import(pathToFileURL(file).href);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
