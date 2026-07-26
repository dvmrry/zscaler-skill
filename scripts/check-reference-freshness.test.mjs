import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { extractFrontmatter } from "./check-reference-freshness.mjs";

const checker = path.join(path.dirname(fileURLToPath(import.meta.url)), "check-reference-freshness.mjs");
const repositoryRoot = path.resolve(path.dirname(checker), "..");

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function writeReference(root, { date, pin, body = "Original body.\n", flow = false }) {
  const mapping = flow
    ? `verified-against: {vendor/example: ${pin} (v1)}`
    : `verified-against:\n    vendor/example: ${pin} (v1)`;
  fs.writeFileSync(
    path.join(root, "references", "example.md"),
    `---\ntitle: Example\nlast-verified: "${date}"\n${mapping}\n---\n# Example\n\n${body}`,
  );
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reference-freshness-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "references"), { recursive: true });
  const submodule = path.join(root, "vendor", "example");
  fs.mkdirSync(submodule, { recursive: true });

  git(root, "init", "--quiet");
  git(root, "config", "user.name", "Test User");
  git(root, "config", "user.email", "test@example.invalid");
  git(submodule, "init", "--quiet");
  git(submodule, "config", "user.name", "Test User");
  git(submodule, "config", "user.email", "test@example.invalid");
  fs.writeFileSync(path.join(submodule, "source.txt"), "first\n");
  git(submodule, "add", "source.txt");
  git(submodule, "commit", "--quiet", "-m", "first");
  const first = git(submodule, "rev-parse", "HEAD");

  fs.writeFileSync(
    path.join(root, ".gitmodules"),
    '[submodule "vendor/example"]\n\tpath = vendor/example\n\turl = https://example.invalid/example.git\n',
  );
  writeReference(root, { date: "2026-07-20", pin: first });
  git(root, "add", ".gitmodules", "references/example.md", "vendor/example");
  git(root, "commit", "--quiet", "-m", "base");
  const base = git(root, "rev-parse", "HEAD");

  fs.appendFileSync(path.join(submodule, "source.txt"), "second\n");
  git(submodule, "commit", "--quiet", "-am", "second");
  const second = git(submodule, "rev-parse", "HEAD");
  return { root, submodule, base, first, second };
}

function commitHead(state, document) {
  writeReference(state.root, document);
  git(state.root, "add", "references/example.md", "vendor/example");
  git(state.root, "commit", "--quiet", "-m", "head");
}

function runCheck(state, ...args) {
  return spawnSync(process.execPath, [checker, "--root", state.root, "--base", state.base, ...args], {
    encoding: "utf8",
  });
}

test("parses block and flow verified-against mappings", () => {
  const block = extractFrontmatter(
    `---\nlast-verified: "2026-07-26"\nverified-against:\n    vendor/example: ${"a".repeat(40)} (v1)\n---\nBody\n`,
  );
  assert.equal(block.lastVerified, "2026-07-26");
  assert.equal(block.verifiedAgainst.get("vendor/example").value, `${"a".repeat(40)} (v1)`);

  const flow = extractFrontmatter(
    `---\nlast-verified: '2026-07-26'\nverified-against: {vendor/example: ${"b".repeat(40)} (v2)}\n---\nBody\n`,
  );
  assert.equal(flow.lastVerified, "2026-07-26");
  assert.equal(flow.verifiedAgainst.get("vendor/example").value, `${"b".repeat(40)} (v2)`);
});

test("hygiene CI runs the checker as an advisory after provenance validation", () => {
  const workflow = fs.readFileSync(
    path.join(repositoryRoot, ".github", "workflows", "check-hygiene.yml"),
    "utf8",
  );
  const provenanceIndex = workflow.indexOf("name: Check verified-against provenance");
  const freshnessIndex = workflow.indexOf("name: Check reference freshness semantics (advisory)");
  assert.ok(provenanceIndex >= 0);
  assert.ok(freshnessIndex > provenanceIndex);
  assert.match(
    workflow.slice(freshnessIndex, freshnessIndex + 400),
    /continue-on-error: true[\s\S]*node scripts\/check-reference-freshness\.mjs --base[^\n]+--head HEAD/,
  );
});

test("default worktree mode catches an unstaged stale pin", (t) => {
  const state = fixture(t);
  writeReference(state.root, {
    date: "2026-07-26",
    pin: state.first,
    body: "Unstaged behavior.\n",
  });

  const result = runCheck(state, "--strict");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Head: worktree/);
  assert.match(result.stdout, /WARN fresh-date-stale-pin/);
});

test("default worktree mode catches a staged stale pin", (t) => {
  const state = fixture(t);
  writeReference(state.root, {
    date: "2026-07-26",
    pin: state.first,
    body: "Staged behavior.\n",
  });
  git(state.root, "add", "references/example.md", "vendor/example");

  const result = runCheck(state, "--strict");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /WARN fresh-date-stale-pin/);
});

test("default worktree mode checks untracked reference documents", (t) => {
  const state = fixture(t);
  fs.writeFileSync(
    path.join(state.root, "references", "untracked.md"),
    `---\nlast-verified: "2026-07-26"\nverified-against:\n  vendor/example: ${state.first}\n---\n# Untracked\n`,
  );

  const result = runCheck(state, "--strict");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /references\/untracked\.md:4: last-verified advanced/);
});

test("an explicit head keeps committed-range CI isolated from dirty files", (t) => {
  const state = fixture(t);
  writeReference(state.root, {
    date: "2026-07-26",
    pin: state.first,
    body: "Dirty behavior.\n",
  });

  const result = runCheck(state, "--head", "HEAD", "--strict");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Head: HEAD/);
  assert.match(result.stdout, /Changed reference docs: 0/);
});

test("fresh date over a stale submodule pin is advisory, then blocking in strict mode", (t) => {
  const state = fixture(t);
  commitHead(state, {
    date: "2026-07-26",
    pin: state.first,
    body: "Updated behavior.\n",
  });

  const advisory = runCheck(state);
  assert.equal(advisory.status, 0, advisory.stderr);
  assert.match(advisory.stdout, /WARN fresh-date-stale-pin/);
  assert.match(advisory.stdout, new RegExp(`current tree SHA is ${state.second}`));

  const strict = runCheck(state, "--strict");
  assert.equal(strict.status, 1, strict.stdout + strict.stderr);
});

test("a newly added document still checks its verification pins", (t) => {
  const state = fixture(t);
  fs.writeFileSync(
    path.join(state.root, "references", "added.md"),
    `---\nlast-verified: "2026-07-26"\nverified-against:\n  vendor/example: ${state.first}\n---\n# Added\n`,
  );
  git(state.root, "add", "references/added.md", "vendor/example");
  git(state.root, "commit", "--quiet", "-m", "head");

  const result = runCheck(state, "--strict");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /references\/added\.md:4: last-verified advanced/);
});

test("a fresh date with a current flow-style pin passes", (t) => {
  const state = fixture(t);
  commitHead(state, {
    date: "2026-07-26",
    pin: state.second,
    body: "Updated behavior.\n",
    flow: true,
  });
  const result = runCheck(state, "--strict");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /No reference freshness advisories/);
});

test("a cited but uninitialized submodule is advisory, then blocking in strict mode", (t) => {
  const state = fixture(t);
  commitHead(state, {
    date: "2026-07-26",
    pin: state.second,
    body: "Updated behavior.\n",
  });
  fs.rmSync(state.submodule, { recursive: true, force: true });
  fs.mkdirSync(state.submodule, { recursive: true });

  const advisory = runCheck(state);
  assert.equal(advisory.status, 0, advisory.stderr);
  assert.match(advisory.stdout, /WARN cited-root-uninitialized/);

  const strict = runCheck(state, "--strict");
  assert.equal(strict.status, 1, strict.stdout + strict.stderr);
});

test("substantive body change with current pins and an unchanged date stays advisory", (t) => {
  const state = fixture(t);
  commitHead(state, {
    date: "2026-07-20",
    pin: state.second,
    body: "Updated behavior.\n",
  });
  const result = runCheck(state, "--strict");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /REVIEW content-date-unchanged/);
  assert.match(result.stdout, /not a cleanup queue/);
});

test("frontmatter-only pin refresh does not count as substantive body change", (t) => {
  const state = fixture(t);
  commitHead(state, {
    date: "2026-07-20",
    pin: state.second,
  });
  const result = runCheck(state, "--strict");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /REVIEW content-date-unchanged/);
});
