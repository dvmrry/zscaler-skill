import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const executableConsumers = [
  "scripts/benchmark-investigator-helper.mjs",
  "scripts/bridge/run-investigation.mjs",
  ".github/workflows/maintenance-digest.yml",
  ".github/workflows/vendor-impact.yml",
];

test("runtime-data consumers do not hardcode the default mount", async () => {
  for (const relativePath of executableConsumers) {
    const source = await readFile(path.join(root, relativePath), "utf8");
    assert.doesNotMatch(
      source,
      /path\.join\([^\n]*["']_data["']/,
      `${relativePath} bypasses the runtime-data resolver`,
    );
    assert.doesNotMatch(
      source,
      /(?:>|>>|path:)\s*[^\n]*_data\/(?:schemas|bridge-runs|bridge-digests)/,
      `${relativePath} writes to the default mount directly`,
    );
  }
});

test("runtime-data workflows resolve paths through the shared CLI", async () => {
  for (const relativePath of executableConsumers.filter((file) =>
    file.startsWith(".github/workflows/"),
  )) {
    const source = await readFile(path.join(root, relativePath), "utf8");
    assert.match(source, /scripts\/runtime-data-path\.mjs/);
    assert.match(source, /ZSCALER_SKILL_RUNTIME_CONFIG/);
  }
});
