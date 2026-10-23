#!/usr/bin/env node
// kb-drift.mjs — turn a help-capture drift report into the review a CI pull request needs.
//
// Input: the JSON that `python3 scripts/help_capture.py check --replace --json` (or issue_capture.py, whose
// report names its source) prints, run after the drifted captures were rewritten. For every evidence entry that cites a changed page it says which of
// three things is true, so a reviewer reads only what can have changed meaning:
//   broken     the quote or pointer no longer anchors: run `kb.mjs requote --write` first, then re-anchor
//              what is left by hand (docs/maintenance.md, "Knowledge-graph refresh loop")
//   in-change  it still anchors, but on or next to a changed line: read the change against the claim
//   untouched  it anchors away from every change: nothing to review
// Pages that are gone or under maintenance are listed with the claims that cite them.
//
// With --pins <base-ref>, the same review for submodule sources: every source whose pin differs between
// <base-ref> and the index is diffed between the two pins, and each evidence entry citing a changed file gets
// the same three states. A pin bump can leave a quote anchored while the code around it changed what the
// claim says, so `in-change` is the list to read, not only `broken`.
//
// Usage: node scripts/kb-drift.mjs <check-report.json> [--json]
//        node scripts/kb-drift.mjs --pins <base-ref> [--json]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allEvidence, anchorEvidence, buildGraph, loadPublic } from "./kb-lib.mjs";

/** broken, in-change or untouched for one evidence entry against the changed lines of its file. */
function classify(g, ev, changedLines, cache) {
  const r = anchorEvidence(g, ev, cache);
  if (r.errors.length) return { state: "broken", errors: r.errors };
  const changed = new Set(changedLines || []);
  // A pointer into a changed file cannot be placed on a line: review it with the change.
  const near = r.anchors.some((a) => a.pointer !== undefined || [a.line - 1, a.line, a.line + 1].some((l) => changed.has(l)));
  return { state: near ? "in-change" : "untouched" };
}

const git = (cwd, args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", maxBuffer: 256 << 20 });

/** New-side line numbers each file's diff touches (a pure deletion marks the lines around it). */
function changedLinesByFile(dir, from, to) {
  const out = new Map();
  let file = null;
  for (const line of git(dir, ["diff", "--unified=0", "--no-renames", from, to]).split("\n")) {
    const f = line.match(/^\+\+\+ (?:b\/(.*)|\/dev\/null)$/);
    if (f) { file = f[1] ?? null; if (file && !out.has(file)) out.set(file, []); continue; }
    const h = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (!h || !file) continue;
    const start = Number(h[1]);
    const count = h[2] === undefined ? 1 : Number(h[2]);
    if (count === 0) out.get(file).push(start, start + 1);
    else for (let l = start; l < start + count; l++) out.get(file).push(l);
  }
  return out;
}

/**
 * The submodule sources whose pin moved: { source: { from, to } }, comparing <base-ref>'s gitlink with the
 * index's. Both commits must be present in the submodule (a bump fetched them).
 */
export function movedPins(g, base) {
  const pins = {};
  for (const [name, src] of Object.entries(g.sources.sources)) {
    if (src.kind !== "submodule") continue;
    const at = (ref) => {
      try { return git(g.root, ["ls-tree", ref, "--", src.root]).match(/^160000 commit ([0-9a-f]{40})/m)?.[1] ?? null; } catch { return null; }
    };
    const from = at(base);
    const to = git(g.root, ["ls-files", "-s", "--", src.root]).match(/^160000 ([0-9a-f]{40}) /m)?.[1] ?? null;
    if (from && to && from !== to) pins[name] = { from, to };
  }
  return pins;
}

/** Classify every evidence entry citing a file that changed between a moved source's two pins. */
export function pinReview(g, pins) {
  const pages = new Map();
  const cache = new Map();
  const changes = new Map(Object.entries(pins).map(([name, p]) => [name, changedLinesByFile(path.join(g.root, g.sources.sources[name].root), p.from, p.to)]));
  for (const { node, ev, where } of allEvidence(g)) {
    const files = changes.get(ev.source);
    // An entry with `at` cites fixed refs, which a pin bump does not move.
    if (!files || ev.at || !files.has(ev.path)) continue;
    const file = `${g.sources.sources[ev.source].root}/${ev.path}`;
    if (!pages.has(file)) pages.set(file, { file, status: "drift", from: pins[ev.source].from.slice(0, 7), to: pins[ev.source].to.slice(0, 7), evidence: [] });
    pages.get(file).evidence.push({ subject: node.id, where, ...classify(g, ev, files.get(ev.path), cache) });
  }
  return [...pages.values()].sort((a, b) => a.file.localeCompare(b.file));
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Classify every evidence entry that cites a page in the report. */
export function driftReview(g, report) {
  const pages = new Map(report.pages.map((p) => [p.file, { ...p, evidence: [] }]));
  const cache = new Map();
  for (const { node, ev, where } of allEvidence(g)) {
    if (ev.source !== (report.source || "zscaler-help")) continue;
    const page = pages.get(ev.path);
    if (!page) continue;
    const item = { subject: node.id, where };
    if (page.status !== "drift") {
      page.evidence.push({ ...item, state: page.status });
      continue;
    }
    page.evidence.push({ ...item, ...classify(g, ev, page.changed_lines, cache) });
  }
  return [...pages.values()];
}

function markdown(pages, title = "Help capture drift") {
  const out = [`# ${title}`, ""];
  const count = (s) => pages.reduce((n, p) => n + p.evidence.filter((e) => e.state === s).length, 0);
  out.push(
    `${pages.filter((p) => p.status === "drift").length} file(s) changed; evidence citing them: ` +
      `${count("broken")} broken, ${count("in-change")} in changed text, ${count("untouched")} untouched.`,
    "",
  );
  for (const p of pages) {
    const head = p.status === "drift" ? `revision ${p.from ?? "?"} -> ${p.to ?? "?"}` : p.status;
    out.push(`## ${p.file} (${head})`, "");
    if (p.message) out.push(p.message, "");
    for (const state of ["broken", "in-change", "gone", "unavailable"]) {
      const list = p.evidence.filter((e) => e.state === state);
      if (!list.length) continue;
      out.push(`**${state}**`, "");
      for (const e of list) out.push(`- \`${e.subject}\` ${e.where}${e.errors ? `: ${e.errors[0]}` : ""}`);
      out.push("");
    }
    const untouched = p.evidence.filter((e) => e.state === "untouched").length;
    if (untouched) out.push(`${untouched} evidence entries anchor away from the change.`, "");
    if (p.diff) out.push("```diff", p.diff.trimEnd(), "```", "");
  }
  return out.join("\n");
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const pinsAt = args.indexOf("--pins");
  const base = pinsAt === -1 ? undefined : args[pinsAt + 1];
  const [file] = args.filter((a, i) => !a.startsWith("--") && i !== pinsAt + 1);
  if (pinsAt === -1 ? !file : !base) {
    console.error("usage: node scripts/kb-drift.mjs <check-report.json> [--json]\n       node scripts/kb-drift.mjs --pins <base-ref> [--json]");
    process.exit(2);
  }
  const g = buildGraph(loadPublic(ROOT));
  const pages = base ? pinReview(g, movedPins(g, base)) : driftReview(g, JSON.parse(fs.readFileSync(file, "utf8")));
  process.stdout.write(args.includes("--json") ? `${JSON.stringify(pages, null, 2)}\n` : `${markdown(pages, base ? `Submodule pin drift since ${base}` : undefined)}\n`);
  // Broken evidence must be re-anchored before the pull request can merge.
  process.exitCode = pages.some((p) => p.evidence.some((e) => e.state === "broken")) ? 1 : 0;
}
