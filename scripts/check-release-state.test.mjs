import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { findReleaseCommit, validateReleaseFiles } from "./check-release-state.mjs";

const aligned = {
  versionText: "1.2.3\n",
  manifestText: '{".":"1.2.3"}',
  pyprojectText: '[project]\nname = "example"\nversion = "1.2.3"\n',
  uvLockText: '[[package]]\nname = "zscaler-skill"\nversion = "1.2.3"\n',
  changelogText: "# Changelog\n\n## [1.2.3] - 2026-07-09\n",
};

test("release files pass when every version surface agrees", () => {
  assert.deepEqual(validateReleaseFiles(aligned), { version: "1.2.3", errors: [] });
});

test("release files report every stale version surface", () => {
  const state = validateReleaseFiles({
    ...aligned,
    manifestText: '{".":"1.2.2"}',
    pyprojectText: '[project]\nversion = "0.2.0"\n',
    uvLockText: '[[package]]\nname = "zscaler-skill"\nversion = "0.2.0"\n',
    changelogText: "# Changelog\n\n## [1.2.1]\n",
  });
  assert.equal(state.errors.length, 4);
  assert.match(state.errors[0], /release manifest/);
  assert.match(state.errors[1], /pyproject\.toml/);
  assert.match(state.errors[2], /uv\.lock/);
  assert.match(state.errors[3], /CHANGELOG\.md/);
});

test("release files reject a non-semver VERSION", () => {
  const state = validateReleaseFiles({ ...aligned, versionText: "v1.2.3\n" });
  assert.deepEqual(state.errors, ['VERSION is not a plain semantic version: "v1.2.3"']);
});

test("release files require the manifest to be a JSON object", () => {
  for (const manifestText of ["null", "[]", '"1.2.3"']) {
    const state = validateReleaseFiles({ ...aligned, manifestText });
    assert.deepEqual(state.errors, ["release manifest must be a JSON object"]);
  }
});

test('release files require an own "." manifest version', () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{"package":"1.2.3"}' });
  assert.deepEqual(state.errors, ['release manifest has no own "." version']);
});

test("release files reject a null manifest version without a duplicate mismatch", () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{".":null}' });
  assert.deepEqual(state.errors, ['release manifest "." is not a plain semantic version: null']);
});

test("release files reject a non-string manifest version without a duplicate mismatch", () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{".":123}' });
  assert.deepEqual(state.errors, ['release manifest "." is not a plain semantic version: 123']);
});

test("release files reject a malformed manifest version without a duplicate mismatch", () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{".":"v1.2.3"}' });
  assert.deepEqual(state.errors, [
    'release manifest "." is not a plain semantic version: "v1.2.3"',
  ]);
});

test("release files reject malformed manifest JSON without secondary errors", () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{".":"1.2.3"' });
  assert.equal(state.errors.length, 1);
  assert.match(state.errors[0], /^\.release-please-manifest\.json is invalid JSON:/);
});

test("release files report a well-formed mismatched manifest version once", () => {
  const state = validateReleaseFiles({ ...aligned, manifestText: '{".":"1.2.2"}' });
  assert.deepEqual(state.errors, ['release manifest has "1.2.2"; expected 1.2.3']);
});

test("release commit is the newest first-parent transition to the current version", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "release-commit-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const commit = (message) => {
    git("add", ".");
    git("commit", "-q", "-m", message);
    return git("rev-parse", "HEAD");
  };

  git("init", "-q");
  git("config", "user.name", "Release Test");
  git("config", "user.email", "release-test@example.invalid");
  fs.writeFileSync(path.join(root, "VERSION"), "1.2.2\n");
  commit("initial version");

  fs.writeFileSync(path.join(root, "VERSION"), "1.2.3\n");
  const firstIntroduction = commit("release 1.2.3");
  fs.writeFileSync(path.join(root, "README.md"), "later work\n");
  commit("advance main");
  assert.deepEqual(findReleaseCommit(root, "1.2.3"), { commit: firstIntroduction });

  fs.writeFileSync(path.join(root, "VERSION"), " 1.2.3\n");
  commit("same semantic version");
  assert.deepEqual(findReleaseCommit(root, "1.2.3"), { commit: firstIntroduction });

  fs.writeFileSync(path.join(root, "VERSION"), "1.2.4\n");
  commit("release 1.2.4");
  fs.writeFileSync(path.join(root, "VERSION"), "1.2.3\n");
  const reintroduction = commit("reintroduce 1.2.3");
  fs.appendFileSync(path.join(root, "README.md"), "more work\n");
  commit("advance main again");
  assert.deepEqual(findReleaseCommit(root, "1.2.3"), { commit: reintroduction });
});

test("Release Please is the sole automatic release publisher", () => {
  const repairWorkflow = fs.readFileSync(
    new URL("../.github/workflows/auto-tag.yml", import.meta.url),
    "utf8",
  );
  const releaseWorkflow = fs.readFileSync(
    new URL("../.github/workflows/release-please.yml", import.meta.url),
    "utf8",
  );

  assert.match(repairWorkflow, /^\s{2}workflow_dispatch:/m);
  assert.doesNotMatch(repairWorkflow, /^\s{2}push:/m);
  assert.match(releaseWorkflow, /^\s{2}push:/m);
  assert.match(releaseWorkflow, /branches: \[main\]/);
  assert.match(releaseWorkflow, /skip-github-release: false/);
});

test("manual release repair consistently uses the derived release commit", () => {
  const workflow = fs.readFileSync(
    new URL("../.github/workflows/auto-tag.yml", import.meta.url),
    "utf8",
  );
  assert.match(
    workflow,
    /release_commit="\$\(node scripts\/check-release-state\.mjs --release-commit\)"/,
  );
  assert.match(
    workflow,
    /echo "release_commit=\$\{release_commit\}" >> "\$GITHUB_OUTPUT"/,
  );
  assert.match(
    workflow,
    /git fetch --force --tags origin \+refs\/heads\/main:refs\/remotes\/origin\/main/,
  );
  assert.match(
    workflow,
    /"\$GITHUB_REF" != "refs\/heads\/main"/,
  );
  assert.match(
    workflow,
    /git merge-base --is-ancestor "\$release_commit" refs\/remotes\/origin\/main/,
  );
  assert.match(workflow, /"\$tagged_commit" != "\$release_commit"/);
  assert.match(workflow, /git tag -a "\$next" "\$release_commit"/);
  assert.match(workflow, /RELEASE_COMMIT: \$\{\{ steps\.tag\.outputs\.release_commit \}\}/);
  assert.match(workflow, /--target "\$RELEASE_COMMIT"/);
});
