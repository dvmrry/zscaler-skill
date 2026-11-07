import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { validateReleaseFiles } from "./check-release-state.mjs";

const aligned = {
  versionText: "1.2.3\n",
  pyprojectText: '[project]\nname = "example"\nversion = "1.2.3"\n',
  uvLockText: '[[package]]\nname = "zscaler-skill"\nversion = "1.2.3"\n',
  notes: ["v1.2.2.md", "v1.2.3.md"],
};

test("release files pass when every version surface and the newest notes agree", () => {
  assert.deepEqual(validateReleaseFiles(aligned), { version: "1.2.3", errors: [] });
});

test("release files report every stale version surface", () => {
  const state = validateReleaseFiles({
    ...aligned,
    pyprojectText: '[project]\nversion = "0.2.0"\n',
    uvLockText: '[[package]]\nname = "zscaler-skill"\nversion = "0.2.0"\n',
    notes: ["v1.2.4.md"],
  });
  assert.equal(state.errors.length, 3);
  assert.match(state.errors[0], /pyproject\.toml/);
  assert.match(state.errors[1], /uv\.lock/);
  assert.match(state.errors[2], /newest release notes are docs\/releases\/v1\.2\.4\.md; expected v1\.2\.3\.md/);
});

test("release files reject a non-semver VERSION", () => {
  const state = validateReleaseFiles({ ...aligned, versionText: "v1.2.3\n" });
  assert.deepEqual(state.errors, ['VERSION is not a plain semantic version: "v1.2.3"']);
});

test("the newest notes file is chosen by version, not by name order", () => {
  const state = validateReleaseFiles({ ...aligned, versionText: "1.10.0\n", pyprojectText: 'version = "1.10.0"\n', uvLockText: '[[package]]\nname = "zscaler-skill"\nversion = "1.10.0"\n', notes: ["v1.9.0.md", "v1.10.0.md"] });
  assert.deepEqual(state.errors, []);
});

test("a misnamed notes file is reported, and no notes at all is allowed", () => {
  assert.deepEqual(validateReleaseFiles({ ...aligned, notes: ["v1.2.3.md", "1.2.4.md"] }).errors, [
    "docs/releases/1.2.4.md is not named vMAJOR.MINOR.PATCH.md",
  ]);
  assert.deepEqual(validateReleaseFiles({ ...aligned, notes: [] }).errors, []);
});

test("the release workflow is the sole publisher, and it publishes the notes review saw", () => {
  const workflows = new URL("../.github/workflows/", import.meta.url);
  const release = fs.readFileSync(new URL("release.yml", workflows), "utf8");
  const check = fs.readFileSync(new URL("release-notes.yml", workflows), "utf8");
  for (const gone of ["release-please.yml", "auto-tag.yml"]) assert.ok(!fs.existsSync(new URL(gone, workflows)), gone);
  assert.match(release, /^ {2}push:\n {4}branches:\n {6}- main$/m);
  assert.match(release, /bash scripts\/release-version\.sh "\$BEFORE" "\$GITHUB_SHA"/);
  assert.match(release, /gh release create "\$VERSION" --title "\$VERSION" --notes-file "docs\/releases\/\$\{VERSION\}\.md"/);
  assert.match(check, /bash scripts\/release-version\.sh HEAD\^1 HEAD/);
  assert.match(check, /no-release/);
});
