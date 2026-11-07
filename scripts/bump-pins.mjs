#!/usr/bin/env node
// bump-pins.mjs — move the submodules to their upstream heads, as Renovate does on main, for a checkout Renovate
// does not watch (a long-lived branch). A submodule renovate.json holds for approval (`dependencyDashboardApproval`)
// moves only to the newest release tag on its upstream branch, so claims cite a version that shipped. Without
// --apply it lists what would move; with it, it checks each one out at its target and stages the new pin. It
// fetches from each submodule's remote, tags included and forced, so local tags match what a fresh clone gets, and
// names any tag that now points at a different commit: evidence `at` resolves through tag names. It never commits
// or pushes. Review the moves next with
// `node scripts/kb-drift.mjs --pins HEAD` (docs/maintenance.md, "Knowledge-graph refresh loop", step 4).
//
// Usage: node scripts/bump-pins.mjs [--apply] [--only <path>,<path>]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (cwd, args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const tryGit = (cwd, args) => {
  try {
    return git(cwd, args);
  } catch {
    return null;
  }
};

/** Submodule paths renovate.json holds for approval: they move only to a release tag. */
export function releaseTagOnly(root = ROOT) {
  const config = JSON.parse(fs.readFileSync(path.join(root, "renovate.json"), "utf8"));
  return new Set((config.packageRules || []).filter((r) => r.dependencyDashboardApproval).flatMap((r) => r.matchDepNames || []));
}

/** The submodule paths .gitmodules lists. */
export function submodulePaths(root = ROOT) {
  const out = tryGit(root, ["config", "-f", ".gitmodules", "--get-regexp", "^submodule\\..*\\.path$"]) ?? "";
  return out.split("\n").filter(Boolean).map((l) => l.split(" ")[1]);
}

/**
 * Where one fetched submodule should move: its upstream default branch head, or with `tagsOnly` the newest
 * version tag merged into that branch. { sha, label } or { error }.
 */
export function target(dir, { tagsOnly = false } = {}) {
  const head = tryGit(dir, ["rev-parse", "--verify", "-q", "origin/HEAD"]) ?? tryGit(dir, ["rev-parse", "--verify", "-q", "origin/main"]);
  if (!head) return { error: "no origin/HEAD or origin/main" };
  if (!tagsOnly) return { sha: head, label: "origin/HEAD" };
  const tag = (tryGit(dir, ["tag", "--merged", head, "--sort=-v:refname"]) ?? "").split("\n").find((t) => /^v?\d+(\.\d+)+$/.test(t));
  return tag ? { sha: git(dir, ["rev-list", "-n1", tag]), label: tag } : { error: "no release tag on the upstream branch" };
}

/** Each tag's commit (annotated tags peeled), from one `git show-ref`. */
export function tagCommits(dir) {
  const out = new Map();
  for (const line of (tryGit(dir, ["show-ref", "--tags", "-d"]) ?? "").split("\n").filter(Boolean)) {
    const [sha, ref] = line.split(" ");
    const name = ref.replace(/^refs\/tags\//, "");
    if (name.endsWith("^{}")) out.set(name.slice(0, -3), sha);
    else if (!out.has(name)) out.set(name, sha);
  }
  return out;
}

/** The tags whose commit changed between two `tagCommits` maps. */
export function movedTags(before, after) {
  return [...before].filter(([t, c]) => after.has(t) && after.get(t) !== c).map(([t]) => t).sort();
}

/**
 * One row per submodule: where it is, where it would go, how far, whether upstream rewrote its history, and which
 * of its tags upstream moved.
 */
export function plan(root = ROOT, { only = null, fetch = true } = {}) {
  const tagged = releaseTagOnly(root);
  return submodulePaths(root)
    .filter((p) => !only || only.has(p))
    .map((p) => {
      const dir = path.join(root, p);
      const from = tryGit(dir, ["rev-parse", "HEAD"]);
      if (!from) return { path: p, error: "not checked out" };
      const tagsBefore = tagCommits(dir);
      if (fetch && tryGit(dir, ["fetch", "-q", "--tags", "--force", "origin"]) === null) return { path: p, from, error: "fetch failed" };
      const moved = movedTags(tagsBefore, tagCommits(dir));
      const t = target(dir, { tagsOnly: tagged.has(p) });
      if (t.error) return { path: p, from, error: t.error };
      const behind = Number(tryGit(dir, ["rev-list", "--count", `${from}..${t.sha}`]) ?? 0);
      // A pin that is not an ancestor of the target was rewritten away upstream; a fresh clone may not fetch it.
      const rewritten = from !== t.sha && tryGit(dir, ["merge-base", "--is-ancestor", from, t.sha]) === null;
      return { path: p, from, to: t.sha, label: t.label, behind, rewritten, moved };
    });
}

function main(argv) {
  const at = argv.indexOf("--only");
  if (argv.some((a, i) => a.startsWith("--") ? !["--apply", "--only"].includes(a) : i !== at + 1) || (at !== -1 && !argv[at + 1])) {
    console.error("usage: node scripts/bump-pins.mjs [--apply] [--only <path>,<path>]");
    return 2;
  }
  const only = at === -1 ? null : new Set((argv[at + 1] || "").split(",").filter(Boolean));
  const rows = plan(ROOT, { only });
  const moving = rows.filter((r) => r.to && r.to !== r.from);
  for (const r of rows) {
    if (r.moved?.length) console.log(`${r.path}: upstream moved ${r.moved.length} tag(s) to other commits (${r.moved.slice(0, 5).join(", ")}${r.moved.length > 5 ? ", ..." : ""}); run kb.mjs validate`);
    if (r.error) console.log(`${r.path}: ${r.error}`);
    else if (r.to === r.from) continue;
    else console.log(`${r.path}: ${r.from.slice(0, 7)} -> ${r.to.slice(0, 7)} (${r.label}, ${r.behind} commits${r.rewritten ? "; upstream rewrote history, old pin not on its branch" : ""})`);
  }
  console.log(`${moving.length} of ${rows.length} submodules ${argv.includes("--apply") ? "moved and staged" : "would move (run with --apply)"}`);
  if (!argv.includes("--apply")) return 0;
  for (const r of moving) {
    git(path.join(ROOT, r.path), ["checkout", "-q", "--detach", r.to]);
    git(ROOT, ["add", r.path]);
  }
  return 0;
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
