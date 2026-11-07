import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { movedTags, releaseTagOnly, tagCommits, target } from "./bump-pins.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cwd, ...a) => execFileSync("git", ["-C", cwd, "-c", "user.email=t@example.com", "-c", "user.name=t", ...a], { encoding: "utf8" }).trim();
const commit = (dir, name) => {
  fs.writeFileSync(path.join(dir, name), `${name}\n`);
  run(dir, "add", "-A");
  run(dir, "commit", "-q", "-m", name);
  return run(dir, "rev-parse", "HEAD");
};

test("a submodule moves to its upstream head, or with tags only to the newest release tag on that branch", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bump-pins-"));
  const upstream = path.join(tmp, "upstream");
  fs.mkdirSync(upstream);
  run(upstream, "init", "-q", "-b", "main");
  commit(upstream, "one");
  run(upstream, "tag", "v1.0.0");
  run(tmp, "clone", "-q", upstream, "sub");
  const sub = path.join(tmp, "sub");
  commit(upstream, "two");
  run(upstream, "tag", "v1.1.0");
  const tagged = run(upstream, "rev-parse", "HEAD");
  const head = commit(upstream, "three");
  run(sub, "fetch", "-q", "--tags", "origin");
  assert.deepEqual(target(sub), { sha: head, label: "origin/HEAD" });
  assert.deepEqual(target(sub, { tagsOnly: true }), { sha: tagged, label: "v1.1.0" });
  // Upstream re-points v1.0.0 and makes v1.1.0 annotated on the same commit: only the first moved.
  const before = tagCommits(sub);
  run(upstream, "tag", "-f", "v1.0.0", head);
  run(upstream, "tag", "-f", "-a", "-m", "release", "v1.1.0", tagged);
  run(sub, "fetch", "-q", "--tags", "--force", "origin");
  assert.deepEqual(movedTags(before, tagCommits(sub)), ["v1.0.0"]);
});

test("the tag-only submodules are the ones renovate.json holds for approval", () => {
  assert.ok(releaseTagOnly(ROOT).has("vendor/terraform-provider-zia"));
  assert.ok(!releaseTagOnly(ROOT).has("vendor/zscaler-sdk-go"));
});
