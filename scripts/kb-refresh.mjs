#!/usr/bin/env node
// kb-refresh.mjs — the knowledge-graph refresh loop (docs/maintenance.md) as one command, for the weekly job.
//
// Refetches every help and issue capture and rewrites the ones that moved, re-quotes spacing-only breaks,
// regenerates the log-type layer and the records, then writes the drift review a pull request needs:
//   <out>/help.json, <out>/issues.json   the check reports (kb-drift.mjs input)
//   <out>/review.md                      the full review, diffs included
//   <out>/body.md                        the pull-request description, bounded to GitHub's size limit
// and prints a one-line JSON summary. It never commits, pushes or runs the gate; the workflow does that.
// Broken evidence is the output, not a failure: the pull request is where it gets re-anchored.
//
// Usage: node scripts/kb-refresh.mjs --out <dir outside the checkout>
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { driftReview, markdown } from "./kb-drift.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// GitHub rejects a pull-request body over 65536 characters.
export const BODY_LIMIT = 60000;

/** Run one step from the repo root; `ok` lists the exit codes that are not failures. */
function step(command, args, { ok = [0], capture = false } = {}) {
  const r = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", capture ? "pipe" : "inherit", "inherit"] });
  if (r.error || !ok.includes(r.status)) throw new Error(`${command} ${args.join(" ")} exited ${r.error?.message ?? r.status}`);
  return r.stdout;
}

/** Evidence counts by state across a review's pages. */
export function counts(pages) {
  const n = { files: pages.filter((p) => p.status === "drift").length, broken: 0, "in-change": 0, untouched: 0, gone: 0, unavailable: 0 };
  for (const p of pages) for (const e of p.evidence) n[e.state] = (n[e.state] ?? 0) + 1;
  return n;
}

/**
 * The pull-request description: what to do, then each review. Reviews that do not fit are cut at a page
 * boundary and the rest are named, so a reviewer knows to read the artifact.
 */
export function prBody(reviews, limit = BODY_LIMIT) {
  const head = [
    "Weekly knowledge-graph refresh: captures whose source moved were refetched and rewritten, spacing-only",
    "quote breaks re-quoted, and the generated layers and records regenerated (`node scripts/kb-refresh.mjs`).",
    "",
    "Before merging: re-anchor every **broken** entry (or turn the claim into a gap when the source no longer",
    "says it), read every **in-change** entry against its claim, and run the claim audit on the claims you",
    "touch. The gate fails until nothing is broken. The full review, diffs included, is the run's",
    "`kb-refresh` artifact.",
    "",
  ].join("\n");
  let body = head;
  const cut = [];
  for (const { title, pages } of reviews) {
    const n = counts(pages);
    const summary = `${n.files} changed; evidence: ${n.broken} broken, ${n["in-change"]} in changed text, ${n.untouched} untouched`;
    if (!pages.length) {
      body += `\n## ${title}\n\nNothing changed.\n`;
      continue;
    }
    const full = markdown(pages, title).replace(/^# /, "## ");
    if (body.length + full.length + 1 <= limit) {
      body += `\n${full}\n`;
      continue;
    }
    // Keep the pages that fit, without their diffs, and name the rest.
    let part = `\n## ${title}\n\n${summary}. Diffs omitted; see the artifact.\n`;
    const left = [];
    for (const p of pages) {
      const one = markdown([{ ...p, diff: undefined }], title).split("\n").slice(4).join("\n").replace(/^## /m, "### ");
      if (!left.length && body.length + part.length + one.length + 200 <= limit) part += `\n${one}`;
      else left.push(p.file);
    }
    if (left.length) cut.push(`${title}: ${left.length} file(s) not shown (${left.slice(0, 5).join(", ")}${left.length > 5 ? ", ..." : ""})`);
    body += part;
  }
  if (cut.length) body += `\n## Not shown\n\n${cut.map((c) => `- ${c}`).join("\n")}\n`;
  return body;
}

function main(argv) {
  const at = argv.indexOf("--out");
  const out = at === -1 ? undefined : argv[at + 1];
  if (!out) {
    console.error("usage: node scripts/kb-refresh.mjs --out <dir>");
    return 2;
  }
  const dir = path.resolve(out);
  if (!path.relative(ROOT, dir).startsWith("..")) {
    console.error(`--out must be outside the checkout: ${dir}`);
    return 2;
  }
  fs.mkdirSync(dir, { recursive: true });
  // Both checks exit 1 when something drifted; that is the expected case, not a failure.
  const reports = [
    { title: "Help capture drift", file: "help.json", args: ["scripts/help_capture.py", "check", "--replace", "--json"] },
    { title: "GitHub issue drift", file: "issues.json", args: ["scripts/issue_capture.py", "check", "--replace", "--json"] },
  ];
  for (const r of reports) fs.writeFileSync(path.join(dir, r.file), step("python3", r.args, { ok: [0, 1], capture: true }));
  step(process.execPath, ["scripts/kb.mjs", "requote", "--write"]);
  step(process.execPath, ["scripts/gen-log-types.mjs"]);
  step(process.execPath, ["scripts/kb.mjs", "manifest"]);
  // verified exits 1 when a citation fails, which is what the review below reports; it writes the record either way.
  step(process.execPath, ["scripts/kb.mjs", "verified"], { ok: [0, 1] });
  // Reviewed after requote, so `broken` is what is left for a person.
  const g = buildGraph(loadPublic(ROOT));
  const reviews = reports.map((r) => ({ title: r.title, pages: driftReview(g, JSON.parse(fs.readFileSync(path.join(dir, r.file), "utf8"))) }));
  fs.writeFileSync(path.join(dir, "review.md"), reviews.map((r) => markdown(r.pages, r.title)).join("\n"));
  fs.writeFileSync(path.join(dir, "body.md"), prBody(reviews));
  const summary = Object.fromEntries(reviews.map((r, i) => [reports[i].file.replace(".json", ""), counts(r.pages)]));
  process.stdout.write(`${JSON.stringify(summary)}\n`);
  return 0;
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
