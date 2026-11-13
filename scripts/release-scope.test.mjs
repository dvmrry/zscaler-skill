import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { isShipped, shippedFiles } from "./release-scope.mjs";

test("what the skill's users get ships, so a change to it releases a version", () => {
  for (const file of [
    "references/zia/zia.cloud-app-control.custom-applications.json",
    "references/_meta/text/zia/zia.url-filtering.md",
    "SKILL.md",
    "AGENTS.md",
    "README.md",
    "agents/zscaler/prompt.md",
    ".devin/rules/zscaler.md",
    ".agents/skills/zscaler/SKILL.md",
    ".claude/commands/z-researcher.md",
    "scripts/kb.mjs",
    "scripts/kb-resolve.mjs",
    "scripts/kb-lib.mjs",
    "scripts/check-data-contract.mjs",
    "scripts/runtime-data-path.mjs",
    "docs/getting-started.md",
    "docs/data-contract/knowledge.md",
    "vendor/zscaler-sdk-go",
    "a-new-top-level-file.md",
  ]) {
    assert.equal(isShipped(file), true, file);
  }
});

test("what only maintainers and CI use does not ship, so a change to only that may carry no-release", () => {
  for (const file of [
    ".github/workflows/release-notes.yml",
    ".githooks/pre-commit",
    ".node-version",
    "biome.json",
    "renovate.json",
    "pyproject.toml",
    "uv.lock",
    "VERSION",
    "package.json",
    "docs/release.md",
    "docs/maintenance.md",
    "docs/releases/v0.19.0.md",
    "CHANGELOG.md",
    "scripts/README.md",
    "scripts/gen-text.test.mjs",
    "scripts/agent_patterns.test.py",
    "scripts/test_help_capture.py",
    "scripts/test-release-version.sh",
    "scripts/fixtures/overlay/overlay.json",
    "scripts/check-full.mjs",
    "scripts/check-hygiene.py",
    "scripts/check-citations.sh",
    "scripts/release-version.sh",
    "scripts/release-scope.mjs",
    "scripts/gen-text.mjs",
    "scripts/tf-schema.go",
    "scripts/kb-refresh.mjs",
    "scripts/kb-reanchor.mjs",
    "scripts/kb-eval.mjs",
    "scripts/refresh-postman.sh",
    "scripts/help_capture.py",
    "scripts/claim_audit.py",
    "scripts/automate-capture/build_openapi_from_blobs.py",
  ]) {
    assert.equal(isShipped(file), false, file);
  }
});

test("shippedFiles keeps only the shipped files, in order", () => {
  assert.deepEqual(shippedFiles([".github/workflows/x.yml", "SKILL.md", "scripts/kb-eval.mjs", "references/zia/a.json"]), [
    "SKILL.md",
    "references/zia/a.json",
  ]);
});

test("the command prints the shipped files a change touches, and nothing for a maintainer-only change", () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "release-scope-"));
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: repo, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    fs.writeFileSync(path.join(repo, file), text);
  };
  const script = fileURLToPath(new URL("./release-scope.mjs", import.meta.url));
  const scope = (base, head) => {
    const result = spawnSync(process.execPath, [script, base, head], { cwd: repo, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  try {
    git("init", "-q", "-b", "main");
    git("config", "user.email", "test@example.com");
    git("config", "user.name", "test");
    write("SKILL.md", "one\n");
    git("add", "-A");
    git("commit", "-q", "-m", "base");
    const base = git("rev-parse", "HEAD");
    write(".github/workflows/ci.yml", "on: push\n");
    git("add", "-A");
    git("commit", "-q", "-m", "ci only");
    assert.equal(scope(base, "HEAD"), "");
    write("references/zia/a.json", "{}\n");
    git("add", "-A");
    git("commit", "-q", "-m", "a subject");
    assert.equal(scope(base, "HEAD"), "references/zia/a.json\n");
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});
