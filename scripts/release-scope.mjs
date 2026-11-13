#!/usr/bin/env node
// release-scope.mjs — which of a change's files ship to the people who use the skill. A pull request that changes a
// shipped file releases a version (docs/releases/vX.Y.Z.md and the version bump in the same pull request); only one
// that changes nothing shipped may carry the no-release label. Every path ships unless it is on the maintainer-only
// list below, so a new file needs a release until someone decides otherwise here. See docs/release.md.
//
//   node scripts/release-scope.mjs <base> <head>   prints the shipped files the change touches, one per line
import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

// What only maintainers and CI use: repository and CI config, tests, gates, the refresh, capture, eval and release
// tooling, generators (a generator change that alters its output also changes references/, which ships), and the
// maintainer docs.
const MAINTAINER_ONLY = [
  /^\.github\//,
  /^\.githooks\//,
  /^(\.gitattributes|\.gitignore|\.node-version|biome\.json|renovate\.json|package\.json|pyproject\.toml|uv\.lock|VERSION)$/,
  /^(CHANGELOG|IMPROVEMENTS)\.md$/,
  /^docs\/(maintenance|release|evals)\.md$/,
  /^docs\/releases\//,
  /^scripts\/README\.md$/,
  /(^|\/)[^/]+\.test\.(mjs|py)$/,
  /^scripts\/(test_[^/]+\.py|test-[^/]+\.sh)$/,
  /^scripts\/fixtures\//,
  /^scripts\/check-(?!data-contract\.mjs$)[^/]+$/,
  /^scripts\/(release-version\.sh|release-scope\.mjs)$/,
  /^scripts\/gen-[^/]+\.mjs$/,
  /^scripts\/tf-schema\.go$/,
  /^scripts\/(kb-refresh|kb-reanchor|kb-requote|kb-move|kb-drift|kb-eval|bump-pins|capture-queue|vendor-impact-summary|regen-goldens|refresh-discovery)\.mjs$/,
  /^scripts\/refresh-[^/]+\.sh$/,
  /^scripts\/(help_capture|zscaler_pages|automate_pages|postman_capture|issue_capture|issue_watch_config|l1_inventory|claim_audit)\.py$/,
  /^scripts\/(issue-watch|maintenance-digest|run-evals|find-asymmetries)\.py$/,
  /^scripts\/automate-capture\//,
];

export function isShipped(file) {
  return !MAINTAINER_ONLY.some((pattern) => pattern.test(file));
}

export function shippedFiles(files) {
  return files.filter(isShipped);
}

function changedFiles(base, head) {
  const result = spawnSync("git", ["diff", "--name-only", "--no-renames", `${base}...${head}`], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git diff ${base}...${head} failed: ${result.stderr.trim()}`);
  return result.stdout.split("\n").filter(Boolean);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [base, head] = process.argv.slice(2);
  if (!base || !head) {
    console.error("usage: node scripts/release-scope.mjs <base> <head>");
    process.exit(2);
  }
  for (const file of shippedFiles(changedFiles(base, head))) console.log(file);
}
