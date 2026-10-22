#!/usr/bin/env node
// kb-drift.mjs — turn a help-capture drift report into the review a CI pull request needs.
//
// Input: the JSON that `python3 scripts/help_capture.py check --replace --json` prints, run after the
// drifted captures were rewritten. For every evidence entry that cites a changed page it says which of
// three things is true, so a reviewer reads only what can have changed meaning:
//   broken     the quote or pointer no longer anchors: run `kb.mjs requote --write` first, then re-anchor
//              what is left by hand (docs/maintenance.md, "Knowledge-graph refresh loop")
//   in-change  it still anchors, but on or next to a changed line: read the change against the claim
//   untouched  it anchors away from every change: nothing to review
// Pages that are gone or under maintenance are listed with the claims that cite them.
//
// Usage: node scripts/kb-drift.mjs <check-report.json> [--json]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allEvidence, anchorEvidence, buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Classify every evidence entry that cites a page in the report. */
export function driftReview(g, report) {
  const pages = new Map(report.pages.map((p) => [p.file, { ...p, evidence: [] }]));
  const cache = new Map();
  for (const { node, ev, where } of allEvidence(g)) {
    if (ev.source !== "zscaler-help") continue;
    const page = pages.get(ev.path);
    if (!page) continue;
    const item = { subject: node.id, where };
    if (page.status !== "drift") {
      page.evidence.push({ ...item, state: page.status });
      continue;
    }
    const r = anchorEvidence(g, ev, cache);
    if (r.errors.length) {
      page.evidence.push({ ...item, state: "broken", errors: r.errors });
      continue;
    }
    const changed = new Set(page.changed_lines || []);
    // A pointer into a changed spec cannot be placed on a line: review it with the change.
    const near = r.anchors.some((a) => a.pointer !== undefined || [a.line - 1, a.line, a.line + 1].some((l) => changed.has(l)));
    page.evidence.push({ ...item, state: near ? "in-change" : "untouched" });
  }
  return [...pages.values()];
}

function markdown(pages) {
  const out = ["# Help capture drift", ""];
  const count = (s) => pages.reduce((n, p) => n + p.evidence.filter((e) => e.state === s).length, 0);
  out.push(
    `${pages.filter((p) => p.status === "drift").length} page(s) changed; evidence citing them: ` +
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
  const [file] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!file) {
    console.error("usage: node scripts/kb-drift.mjs <check-report.json> [--json]");
    process.exit(2);
  }
  const pages = driftReview(buildGraph(loadPublic(ROOT)), JSON.parse(fs.readFileSync(file, "utf8")));
  process.stdout.write(process.argv.includes("--json") ? `${JSON.stringify(pages, null, 2)}\n` : `${markdown(pages)}\n`);
  // Broken evidence must be re-anchored before the pull request can merge.
  process.exitCode = pages.some((p) => p.evidence.some((e) => e.state === "broken")) ? 1 : 0;
}
