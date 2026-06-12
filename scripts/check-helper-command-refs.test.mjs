import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { scanFiles } from "./check-helper-command-refs.mjs";
import { capabilities } from "./investigator-artifacts.mjs";

const VALID_COMMANDS = new Set(capabilities().supported);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zscaler-check-refs-test-"));
}

function writeFile(dir, relPath, content) {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  return full;
}

test("valid command mentions pass with zero errors", () => {
  const dir = makeTempDir();
  const file = writeFile(
    dir,
    "AGENTS.md",
    [
      "Run `node scripts/investigator-artifacts.mjs open-case --root ...`",
      "Then run `node scripts/investigator-artifacts.mjs record-loads --root ...`",
      "Also use `node scripts/investigator-artifacts.mjs status --root ...`",
    ].join("\n"),
  );

  const { errors, mentionCount } = scanFiles(dir, [file], VALID_COMMANDS);
  assert.equal(errors.length, 0, `expected no errors, got: ${errors.join("; ")}`);
  assert.equal(mentionCount, 3);
});

test("unknown command token in a fixture file fails with the file named", () => {
  const dir = makeTempDir();
  const file = writeFile(
    dir,
    "docs/test.md",
    "node scripts/investigator-artifacts.mjs does-not-exist --root /repo\n",
  );

  const { errors } = scanFiles(dir, [file], VALID_COMMANDS);
  assert.ok(errors.length > 0, "expected at least one error");
  assert.ok(
    errors[0].includes("docs/test.md"),
    `error should name the file — got: ${errors[0]}`,
  );
  assert.ok(
    errors[0].includes("does-not-exist"),
    `error should name the bad token — got: ${errors[0]}`,
  );
});

test("multiple unknown tokens are all reported", () => {
  const dir = makeTempDir();
  const file = writeFile(
    dir,
    "README.md",
    [
      "node scripts/investigator-artifacts.mjs bad-command --root /x",
      "node scripts/investigator-artifacts.mjs another-bad --root /y",
    ].join("\n"),
  );

  const { errors } = scanFiles(dir, [file], VALID_COMMANDS);
  assert.equal(errors.length, 2);
});

test("mix of valid and invalid tokens only reports the invalid ones", () => {
  const dir = makeTempDir();
  const file = writeFile(
    dir,
    "agents/test.md",
    [
      "node scripts/investigator-artifacts.mjs open-case --root /x",
      "node scripts/investigator-artifacts.mjs fake-command --root /y",
      "node scripts/investigator-artifacts.mjs save-journal --root /z",
    ].join("\n"),
  );

  const { errors, mentionCount } = scanFiles(dir, [file], VALID_COMMANDS);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes("fake-command"));
  assert.equal(mentionCount, 3);
});

test("file with no command mentions passes with zero mentions", () => {
  const dir = makeTempDir();
  const file = writeFile(dir, "SKILL.md", "No helper calls here.\n");

  const { errors, mentionCount } = scanFiles(dir, [file], VALID_COMMANDS);
  assert.equal(errors.length, 0);
  assert.equal(mentionCount, 0);
});
