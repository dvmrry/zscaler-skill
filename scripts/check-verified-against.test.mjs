import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checker = path.join(path.dirname(fileURLToPath(import.meta.url)), "check-verified-against.py");
const repositoryRoot = path.resolve(path.dirname(checker), "..");
const sha = "a".repeat(40);

function temporaryRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "verified-against-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "references"), { recursive: true });
  fs.mkdirSync(path.join(root, "vendor", "zscaler-help"), { recursive: true });
  fs.mkdirSync(path.join(root, "vendor", "zscaler-api-specs"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor", "README.md"), "Vendor sources\n");
  fs.writeFileSync(
    path.join(root, ".gitmodules"),
    '[submodule "vendor/example"]\n\tpath = vendor/example\n\turl = https://example.invalid/example.git\n',
  );
  return root;
}

function writeReference(root, frontmatter) {
  fs.writeFileSync(path.join(root, "references", "example.md"), `---\n${frontmatter}\n---\n`);
}

function runCheck(root) {
  return spawnSync(checker, [root], { encoding: "utf8" });
}

function runCheckWithArgs(root, ...args) {
  return spawnSync(checker, [root, ...args], { encoding: "utf8" });
}

function assertPass(result) {
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

function assertFails(result, pattern) {
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, pattern);
}

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function initializeSubmoduleRepository(root) {
  const repository = path.join(root, "vendor", "example");
  fs.mkdirSync(repository, { recursive: true });
  git(repository, "init", "--quiet");
  git(repository, "config", "user.name", "Test User");
  git(repository, "config", "user.email", "test@example.invalid");
  fs.writeFileSync(path.join(repository, "source.txt"), "first\n");
  git(repository, "add", "source.txt");
  git(repository, "commit", "--quiet", "-m", "first");
  const first = git(repository, "rev-parse", "HEAD");
  fs.appendFileSync(path.join(repository, "source.txt"), "second\n");
  git(repository, "commit", "--quiet", "-am", "second");
  return first;
}

function initializeTrackedRepository(root) {
  git(root, "init", "--quiet");
  git(root, "config", "user.name", "Test User");
  git(root, "config", "user.email", "test@example.invalid");
  fs.writeFileSync(path.join(root, "vendor", "zscaler-help", "existing.md"), "existing\n");
  fs.writeFileSync(path.join(root, "vendor", "zscaler-api-specs", "existing.json"), "{}\n");
  git(root, "add", ".gitmodules", "vendor");
  git(root, "commit", "--quiet", "-m", "base captures");
  const oldPin = git(root, "rev-parse", "HEAD");

  const capturePaths = Array.from(
    { length: 5 },
    (_, index) => `vendor/zscaler-help/new-capture-${index + 1}.md`,
  );
  for (const capturePath of capturePaths) {
    fs.writeFileSync(path.join(root, capturePath), `${capturePath}\n`);
  }
  git(root, "add", "vendor/zscaler-help");
  git(root, "commit", "--quiet", "-m", "add captures");
  const capturePin = git(root, "rev-parse", "HEAD");
  return { oldPin, capturePin, capturePaths };
}

function writeTrackedReference(root, name, pin, source, extraSources = []) {
  const renderedSources = [source, ...extraSources]
    .map((entry) => `  - ${JSON.stringify(entry)}`)
    .join("\n");
  fs.writeFileSync(
    path.join(root, "references", name),
    `---\ntitle: ${JSON.stringify(name)}\nverified-against:\n  vendor/zscaler-help: ${pin}\nsources:\n${renderedSources}\n---\n# Reference\n`,
  );
}

test("parses a flow-style verified-against mapping", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `title: Example\nverified-against: {vendor/zscaler-help: ${sha}}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 entries/);
});

test("parses a verified-against mapping indented with four spaces", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `title: Example\nverified-against:\n    vendor/zscaler-help: ${sha}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 entries/);
});

test("requires verified-against to be a mapping", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "title: Example\nverified-against: [vendor/zscaler-help]");
  assertFails(runCheck(root), /verified-against must be a mapping/);
});

test("rejects non-scalar and malformed SHA values", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "verified-against:\n  vendor/zscaler-help: [not, a, sha]");
  assertFails(runCheck(root), /must contain a scalar 40-hex commit SHA/);

  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha} trailing-junk`);
  assertFails(runCheck(root), /with only an optional parenthetical label/);
});

test("validates pins for tracked non-submodule vendor sources", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha} (v1.2.3)`);
  const valid = runCheck(root);
  assertPass(valid);
  assert.match(valid.stdout, /1 entries, 0 unique commit object/);

  writeReference(root, "verified-against:\n  vendor/zscaler-help: abcdef0");
  assertFails(runCheck(root), /40-hex commit SHA/);
});

test("rejects unsafe and nonexistent vendor paths", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, "verified-against:\n  vendor/../outside: abcdef0");
  const unsafe = runCheck(root);
  assertFails(unsafe, /safe repository-relative vendor path/);
  assert.match(unsafe.stdout + unsafe.stderr, /40-hex commit SHA/);

  fs.rmSync(path.join(root, "vendor", "zscaler-help"), { recursive: true });
  writeReference(root, `verified-against:\n  vendor/zscaler-help: ${sha}`);
  assertFails(runCheck(root), /recognized verified-against root vendor\/zscaler-help does not exist/);

  writeReference(root, `verified-against:\n  vendor/zscaler-helps: ${sha}`);
  assertFails(runCheck(root), /is not a recognized provenance root/);
});

test("rejects descendants of submodule roots and ordinary vendor files", (t) => {
  const root = temporaryRoot(t);
  fs.mkdirSync(path.join(root, "vendor", "example"), { recursive: true });
  fs.writeFileSync(path.join(root, "vendor", "example", "source.txt"), "source\n");
  writeReference(root, `verified-against:\n  vendor/example/source.txt: ${sha}`);
  assertFails(runCheck(root), /must equal the provenance root vendor\/example/);

  writeReference(root, `verified-against:\n  vendor/README.md: ${sha}`);
  assertFails(runCheck(root), /is not a recognized provenance root/);
});

test("rejects duplicate verified-against fields with source lines", (t) => {
  const root = temporaryRoot(t);
  writeReference(
    root,
    `verified-against:\n  vendor/zscaler-help: ${sha}\nverified-against:\n  vendor/zscaler-api-specs: ${sha}`,
  );
  assertFails(runCheck(root), /example\.md:4: duplicate top-level verified-against field \(first declared at line 2\)/);
});

test("rejects duplicate vendor keys with source lines", (t) => {
  const root = temporaryRoot(t);
  writeReference(
    root,
    `verified-against:\n  vendor/zscaler-help: ${sha}\n  vendor/zscaler-help: ${"b".repeat(40)}`,
  );
  assertFails(runCheck(root), /example\.md:4: duplicate verified-against key 'vendor\/zscaler-help' \(first declared at line 3\)/);
});

test("allows a declared but uninitialized submodule path", (t) => {
  const root = temporaryRoot(t);
  writeReference(root, `verified-against:\n  vendor/example: ${sha}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /skipped 1 uninitialized submodule/);
});

test("accepts a historical commit available in an initialized submodule", (t) => {
  const root = temporaryRoot(t);
  const first = initializeSubmoduleRepository(root);
  writeReference(root, `verified-against:\n  vendor/example: ${first}`);
  const result = runCheck(root);
  assertPass(result);
  assert.match(result.stdout, /1 unique commit object/);
});

test("rejects a missing commit in an initialized submodule", (t) => {
  const root = temporaryRoot(t);
  initializeSubmoduleRepository(root);
  const missing = "f".repeat(40);
  writeReference(root, `verified-against:\n  vendor/example: ${missing}`);
  assertFails(runCheck(root), new RegExp(`${missing} does not resolve to a commit`));
});

test("changed references fail when five exact Help sources are absent at a resolving pin", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  for (const [index, capturePath] of state.capturePaths.entries()) {
    writeTrackedReference(root, `changed-${index + 1}.md`, state.oldPin, capturePath);
  }
  git(root, "add", "references");
  git(root, "commit", "--quiet", "-m", "add references with stale source pins");

  const result = runCheckWithArgs(root, "--base", state.capturePin, "--head", "HEAD");
  assert.equal(result.status, 1, result.stdout + result.stderr);
  for (const [index, capturePath] of state.capturePaths.entries()) {
    assert.match(
      result.stdout,
      new RegExp(
        `references/changed-${index + 1}\\.md:6: source path ${capturePath.replaceAll("/", "\\/")} .* does not exist at recorded pin ${state.oldPin}`,
      ),
    );
  }
  assert.match(result.stdout, /Changed reference source paths: 5 document\(s\), 5 exact path\(s\) checked/);
});

test("changed references pass when exact Help sources exist at the recorded pin", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  for (const [index, capturePath] of state.capturePaths.entries()) {
    writeTrackedReference(root, `changed-${index + 1}.md`, state.capturePin, capturePath);
  }
  git(root, "add", "references");
  git(root, "commit", "--quiet", "-m", "add references with current source pins");

  const result = runCheckWithArgs(root, "--base", state.capturePin, "--head", "HEAD");
  assertPass(result);
  assert.match(result.stdout, /changed reference source paths: 5 document\(s\), 5 exact path\(s\) checked/);
});

test("unchanged references with legacy missing-at-pin paths are outside the diff gate", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "legacy.md", state.oldPin, state.capturePaths[0]);
  git(root, "add", "references/legacy.md");
  git(root, "commit", "--quiet", "-m", "legacy reference");
  const base = git(root, "rev-parse", "HEAD");
  fs.writeFileSync(path.join(root, "README.md"), "unrelated\n");
  git(root, "add", "README.md");
  git(root, "commit", "--quiet", "-m", "unrelated change");

  const result = runCheckWithArgs(root, "--base", base, "--head", "HEAD");
  assertPass(result);
  assert.match(result.stdout, /changed reference source paths: 0 document\(s\), 0 exact path\(s\) checked/);
});

test("a worktree correction is not blocked by the unchanged legacy index snapshot", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "legacy.md", state.oldPin, state.capturePaths[0]);
  git(root, "add", "references/legacy.md");
  git(root, "commit", "--quiet", "-m", "legacy reference");
  const base = git(root, "rev-parse", "HEAD");
  writeTrackedReference(root, "legacy.md", state.capturePin, state.capturePaths[0]);

  const result = runCheckWithArgs(root, "--base", base);
  assertPass(result);
  assert.match(result.stdout, /1 document\(s\), 1 exact path\(s\) checked/);
});

test("worktree mode checks unstaged, staged, and untracked reference documents", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  git(root, "commit", "--quiet", "-m", "tracked reference");
  const base = git(root, "rev-parse", "HEAD");

  writeTrackedReference(root, "tracked.md", state.oldPin, state.capturePaths[0]);
  const unstaged = runCheckWithArgs(root, "--base", base);
  assert.equal(unstaged.status, 1, unstaged.stdout + unstaged.stderr);
  assert.match(unstaged.stdout, /references\/tracked\.md:6 \[worktree\]: source path/);

  git(root, "add", "references/tracked.md");
  const staged = runCheckWithArgs(root, "--base", base);
  assert.equal(staged.status, 1, staged.stdout + staged.stderr);
  assert.match(staged.stdout, /references\/tracked\.md:6 \[index\]: source path/);

  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  writeTrackedReference(root, "untracked.md", state.oldPin, state.capturePaths[0]);

  const untracked = runCheckWithArgs(root, "--base", base);
  assert.equal(untracked.status, 1, untracked.stdout + untracked.stderr);
  assert.match(untracked.stdout, /references\/untracked\.md:6 \[worktree\]: source path/);
});

test("explicit head keeps committed-range validation isolated from dirty references", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  git(root, "commit", "--quiet", "-m", "tracked reference");
  const base = git(root, "rev-parse", "HEAD");
  writeTrackedReference(root, "tracked.md", state.oldPin, state.capturePaths[0]);

  const result = runCheckWithArgs(root, "--base", base, "--head", "HEAD");
  assertPass(result);
  assert.match(result.stdout, /changed reference source paths: 0 document\(s\)/);
});

test("explicit head also isolates global pin parsing from malformed dirty frontmatter", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  git(root, "commit", "--quiet", "-m", "tracked reference");
  const base = git(root, "rev-parse", "HEAD");
  fs.writeFileSync(
    path.join(root, "references", "tracked.md"),
    "---\ntitle: Dirty\nverified-against: [not-a-mapping]\nsources: []\n---\n",
  );

  const result = runCheckWithArgs(root, "--base", base, "--head", "HEAD");
  assertPass(result);
  assert.match(result.stdout, /changed reference source paths: 0 document\(s\)/);
});

test("worktree mode rejects a bad index snapshot even when the working tree is corrected", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  git(root, "commit", "--quiet", "-m", "tracked reference");
  const base = git(root, "rev-parse", "HEAD");

  writeTrackedReference(root, "tracked.md", state.oldPin, state.capturePaths[0]);
  git(root, "add", "references/tracked.md");
  writeTrackedReference(root, "tracked.md", state.capturePin, state.capturePaths[0]);

  const result = runCheckWithArgs(root, "--base", base);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /references\/tracked\.md:6 \[index\]: source path/);
});

test("changed tracked sources fail clearly when the superproject pin does not resolve", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  const missingPin = "f".repeat(40);
  writeTrackedReference(root, "missing-pin.md", missingPin, state.capturePaths[0]);

  const result = runCheckWithArgs(root, "--base", state.capturePin);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    new RegExp(
      `references/missing-pin\\.md:4 \\[worktree\\]: recorded pin ${missingPin} for vendor/zscaler-help does not resolve`,
    ),
  );
});

test("non-exact tracked sources are excluded, but an exact source requires its root pin", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  fs.writeFileSync(
    path.join(root, "references", "excluded.md"),
    `---\ntitle: Excluded\nverified-against: {}\nsources:\n  - "https://help.zscaler.com/example"\n  - "vendor/zscaler-help/**"\n  - "vendor/zscaler-help/"\n  - "vendor/zscaler-help/new-capture-1.md (descriptive note)"\n  - "vendor/zscaler-help/new-capture-1.md"\n---\n# Excluded\n`,
  );

  const result = runCheckWithArgs(root, "--base", state.capturePin);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(
    result.stdout,
    /exact source path vendor\/zscaler-help\/new-capture-1\.md requires a verified-against pin for vendor\/zscaler-help/,
  );
  assert.match(result.stdout, /1 document\(s\), 1 exact path\(s\) checked, 3 non-exact tracked source entry\/entries excluded/);
});

test("valid exact filenames with ampersands are checked rather than excluded", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  const ampersandPath = "vendor/zscaler-help/Recommended_URL_&_Cloud_App_Control_Policy.txt";
  fs.writeFileSync(path.join(root, ampersandPath), "capture\n");
  git(root, "add", ampersandPath);
  git(root, "commit", "--quiet", "-m", "ampersand capture");
  const ampersandPin = git(root, "rev-parse", "HEAD");
  writeTrackedReference(root, "ampersand.md", state.oldPin, ampersandPath);

  const result = runCheckWithArgs(root, "--base", ampersandPin);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Recommended_URL_&_Cloud_App_Control_Policy\.txt/);
  assert.match(result.stdout, /1 exact path\(s\) checked, 0 non-exact tracked source entry\/entries excluded/);
});

test("NUL-delimited discovery checks untracked reference names containing newlines", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "adversarial\nname.md", state.oldPin, state.capturePaths[0]);

  const result = runCheckWithArgs(root, "--base", state.capturePin);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /references\/adversarial\\nname\.md:6 \[worktree\]: source path/);
});

test("an exact source that resolves to a directory tree does not satisfy the file predicate", (t) => {
  const root = temporaryRoot(t);
  const state = initializeTrackedRepository(root);
  writeTrackedReference(root, "tree.md", state.capturePin, "vendor/zscaler-help");
  const treeReference = path.join(root, "references", "tree.md");
  fs.writeFileSync(
    treeReference,
    fs.readFileSync(treeReference, "utf8").replace(
      '  - "vendor/zscaler-help"',
      '  - "vendor/zscaler-help/subdirectory"',
    ),
  );
  fs.mkdirSync(path.join(root, "vendor", "zscaler-help", "subdirectory"));
  fs.writeFileSync(path.join(root, "vendor", "zscaler-help", "subdirectory", "file.md"), "capture\n");
  git(root, "add", "vendor/zscaler-help/subdirectory");
  git(root, "commit", "--quiet", "-m", "tree source");
  const treePin = git(root, "rev-parse", "HEAD");
  fs.writeFileSync(
    treeReference,
    fs.readFileSync(treeReference, "utf8").replace(state.capturePin, treePin),
  );

  const result = runCheckWithArgs(root, "--base", treePin);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /is a tree, not a file/);
});

test("full gate and hygiene CI invoke changed source-path validation as blocking", () => {
  const fullGate = fs.readFileSync(path.join(repositoryRoot, "scripts", "check-full.mjs"), "utf8");
  assert.match(
    fullGate,
    /name: "changed reference source-pin paths",[\s\S]*?check-verified-against\.py[\s\S]*?"--base", referenceFreshnessBase/,
  );

  const workflow = fs.readFileSync(
    path.join(repositoryRoot, ".github", "workflows", "check-hygiene.yml"),
    "utf8",
  );
  const stepStart = workflow.indexOf("name: Check verified-against provenance and changed source paths");
  const nextStep = workflow.indexOf("\n      - name:", stepStart + 1);
  assert.ok(stepStart >= 0);
  const step = workflow.slice(stepStart, nextStep);
  assert.match(step, /check-verified-against\.py --base[^\n]+--head HEAD/);
  assert.doesNotMatch(step, /continue-on-error:\s*true/);
});

test("option-shaped refs are rejected before Git can interpret them", (t) => {
  const root = temporaryRoot(t);
  initializeTrackedRepository(root);
  const outputName = "probe-output:.gitmodules";
  const result = runCheckWithArgs(root, "--base", "HEAD", "--head=--output=probe-output");
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stderr, /--head must not begin with '-'/);
  assert.equal(fs.existsSync(path.join(root, outputName)), false);
});
