#!/usr/bin/env node
// kb-refresh.mjs — the knowledge-graph refresh loop (docs/maintenance.md) as one command, for the scheduled job.
//
// Refetches every help and issue capture and rewrites the ones that moved, re-quotes spacing-only breaks,
// regenerates the log-type layer and the records, then writes the drift review a pull request needs.
// With --discovery <report.json> (refresh-discovery.mjs output) it also captures the new help pages discovery saw
// in sections already captured, and recaptures the Automate API reference when discovery saw its assets change.
// With --changed-only as well, it checks only the captures whose page discovery saw change or leave the sitemap,
// and skips the issue check: the cheap daily run. Without it every capture is refetched: the weekly run.
// Outputs:
//   <out>/help.json, <out>/issues.json   the check reports (kb-drift.mjs input)
//   <out>/review.md                      the full review, diffs included
//   <out>/by-subject.md                  the same entries grouped by subject, one owner each
//   <out>/renames.md                     names the changed help pages replaced, and the subjects still using the old
//   <out>/body.md                        the pull-request description, bounded to GitHub's size limit
//   <out>/capture-queue.md               help pages the vendor material links to that are not captured
//   <out>/discovery.json                 what the discovery report asked for and what was done (with --discovery)
// and prints a one-line JSON summary. It never commits, pushes or runs the gate; the workflow does that.
// Broken evidence is the output, not a failure: the pull request is where it gets re-anchored.
//
// Usage: node scripts/kb-refresh.mjs --out <dir outside the checkout> [--discovery <report.json> [--changed-only]]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { captureQueue, citedFiles, markdown as queueMarkdown } from "./capture-queue.mjs";
import { bySubject, driftReview, markdown, renameSweep, renames, renamesMarkdown, subjectsMarkdown } from "./kb-drift.mjs";
import { buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// GitHub rejects a pull-request body over 65536 characters.
export const BODY_LIMIT = 60000;
// New pages captured in one run; the rest wait for the next, so a site reorganisation cannot flood one pull request.
export const MAX_NEW_PAGES = 40;
const HELP_DIR = "vendor/zscaler-help";

/** Run one step from the repo root; `ok` lists the exit codes that are not failures. */
function step(command, args, { ok = [0], capture = false } = {}) {
  const r = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 << 20, stdio: ["ignore", capture ? "pipe" : "inherit", "inherit"] });
  if (r.error || !ok.includes(r.status)) throw new Error(`${command} ${args.join(" ")} exited ${r.error?.message ?? r.status}`);
  return r.stdout;
}

/** Whether a check printed its JSON report ({"pages": [...]}), which is how a drift exit is told from a crash. */
export function reportOk(text) {
  try {
    return Array.isArray(JSON.parse(text).pages);
  } catch {
    return false;
  }
}

/** The pull request's note on the capture queue: how many pages, the first few, and what to do with them. */
export function queueNote(queue, shown = 10) {
  if (!queue.length) return "";
  const top = queue.slice(0, shown).map((q) => `- ${q.url} (linked from ${q.linking_files} vendor file(s), ${q.cited_linkers} cited)`);
  return [
    "",
    "## Help pages linked but not captured",
    "",
    `${queue.length} help pages are linked from the pinned vendor material and not captured; the full list is the artifact's`,
    "`capture-queue.md`. Clear old addresses with `python3 scripts/help_capture.py alias <url> ...`, then capture what",
    "the graph needs with `python3 scripts/help_capture.py capture <url>`.",
    "",
    ...top,
    "",
  ].join("\n");
}

/** A page's section, the unit that says whether the graph captures that part of a site: host and first path segment. */
export function sectionOf(url) {
  try {
    const u = new URL(url);
    return `${u.host}/${u.pathname.split("/").filter(Boolean)[0] ?? ""}`;
  } catch {
    return null;
  }
}

/**
 * The file a new page is captured to: `<section>-<slug>.json`, since the same slug can sit in two sections (AI Guard
 * pages are published under both secure-ai-users and secure-ai-apps-infra). A slug that already starts with its
 * section keeps it once.
 */
export function captureName(url) {
  const [section, ...rest] = new URL(url).pathname.split("/").filter(Boolean);
  const slug = rest.join("-") || section;
  return `${slug === section || slug.startsWith(`${section}-`) ? slug : `${section}-${slug}`}.json`;
}

/** Every capture with the URLs it answers for: its page and the old addresses that redirect to it. */
export function captureUrls(root) {
  const dir = path.join(root, HELP_DIR);
  const out = [];
  for (const file of fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : []) {
    try {
      const src = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"))?.source;
      if (src?.url) out.push({ file, urls: [src.url, ...(src.aliases || [])] });
    } catch {
      // Not a capture.
    }
  }
  return out;
}

/**
 * What a discovery report asks of the refresh: the captures whose page changed or left the sitemap (to check), the
 * new pages in sections already captured (to capture, at most `max`; the rest are deferred), new pages in sections
 * the graph does not capture (listed only), and whether the Automate reference moved. Vendor heads and releases are
 * listed for the pull request; Renovate opens their bumps.
 */
export function discoveryPlan(captures, report, max = MAX_NEW_PAGES) {
  const byUrl = new Map(captures.flatMap((c) => c.urls.map((u) => [u, c.file])));
  const sections = new Set(captures.flatMap((c) => c.urls).map(sectionOf).filter(Boolean));
  const help = report?.sources?.help ?? {};
  const check = new Set();
  const fresh = [];
  const elsewhere = [];
  for (const c of help.changes?.candidates ?? []) {
    const file = byUrl.get(c.url);
    if (file) check.add(file);
    else if (c.field === "url" && sections.has(sectionOf(c.url))) fresh.push(c.url);
    else if (c.field === "url") elsewhere.push(c.url);
  }
  const removed = (help.removals?.candidates ?? []).map((c) => ({ url: c.url, file: byUrl.get(c.url) ?? null }));
  for (const r of removed) if (r.file) check.add(r.file);
  fresh.sort();
  const automate = report?.sources?.automate;
  return {
    check: [...check].sort(),
    capture: fresh.slice(0, max),
    deferred: fresh.slice(max),
    elsewhere: elsewhere.sort(),
    removed,
    automate: Boolean(automate?.captureRecommendation && automate.captureRecommendation !== "none"),
    vendor: (report?.sources?.vendor?.changes?.candidates ?? []).map((c) => ({ path: c.path, field: c.field, current: c.current })),
  };
}

/** The pull request's note on what discovery found and what the run did about it. */
export function discoveryNote(plan, captured = [], shown = 20) {
  const list = (items, fmt = (x) => x) => [...items.slice(0, shown).map((x) => `- ${fmt(x)}`), ...(items.length > shown ? [`- ... and ${items.length - shown} more (the artifact's \`discovery.json\`)`] : [])];
  const lines = ["", "## What discovery found", ""];
  const none = !captured.length && !plan.deferred.length && !plan.elsewhere.length && !plan.removed.length && !plan.automate && !plan.vendor.length;
  if (none) return [...lines, "Nothing new: no new help pages, no pages left the help sitemap, Automate unchanged.", ""].join("\n");
  if (captured.length) lines.push(`Captured ${captured.length} new help page(s); nothing cites them yet, so they are the next authoring work:`, "", ...list(captured, (c) => `${c.url} -> \`${c.result}\``), "");
  if (plan.deferred.length) lines.push(`${plan.deferred.length} more new page(s) wait for the next run (at most ${MAX_NEW_PAGES} a run).`, "");
  if (plan.removed.length) lines.push("Left the help sitemap (the check above says whether the capture's page is gone or redirects):", "", ...list(plan.removed, (r) => `${r.url}${r.file ? ` (\`${r.file}\`)` : " (not captured)"}`), "");
  if (plan.elsewhere.length) lines.push("New pages in sections the graph does not capture (not captured):", "", ...list(plan.elsewhere), "");
  if (plan.automate) lines.push("The Automate API reference changed: it was recaptured and the API surfaces regenerated.", "");
  if (plan.vendor.length) lines.push("Vendor repositories with a new head or release (Renovate opens the bump):", "", ...list(plan.vendor, (v) => `\`${v.path}\` ${v.field}: ${v.current}`), "");
  return lines.join("\n");
}

/** Evidence counts by state across a review's pages. */
export function counts(pages) {
  const n = { files: pages.filter((p) => p.status === "drift" || p.status === "moved").length, broken: 0, "in-change": 0, untouched: 0, gone: 0, unavailable: 0 };
  for (const p of pages) for (const e of p.evidence) n[e.state] = (n[e.state] ?? 0) + 1;
  return n;
}

/**
 * The pull-request description: what to do, then each review. Reviews that do not fit are cut at a page
 * boundary and the rest are named, so a reviewer knows to read the artifact.
 */
export function prBody(reviews, limit = BODY_LIMIT) {
  const head = [
    "Knowledge-graph refresh: captures whose source moved were refetched and rewritten, new help pages captured,",
    "spacing-only quote breaks re-quoted, and the generated layers and records regenerated",
    "(`node scripts/kb-refresh.mjs`).",
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
  const opt = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
  const out = opt("--out");
  const discovery = opt("--discovery");
  const changedOnly = argv.includes("--changed-only");
  if (!out || (changedOnly && !discovery)) {
    console.error("usage: node scripts/kb-refresh.mjs --out <dir> [--discovery <report.json> [--changed-only]]");
    return 2;
  }
  const dir = path.resolve(out);
  if (!path.relative(ROOT, dir).startsWith("..")) {
    console.error(`--out must be outside the checkout: ${dir}`);
    return 2;
  }
  fs.mkdirSync(dir, { recursive: true });
  const plan = discovery ? discoveryPlan(captureUrls(ROOT), JSON.parse(fs.readFileSync(discovery, "utf8"))) : null;
  if (changedOnly && !plan.check.length && !plan.capture.length && !plan.automate) {
    fs.writeFileSync(path.join(dir, "discovery.json"), `${JSON.stringify({ plan, captured: [] }, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ nothing_to_do: true, elsewhere: plan.elsewhere.length, vendor: plan.vendor.length })}\n`);
    return 0;
  }
  if (plan?.automate) {
    // The structured Automate reference and the OneAPI Postman collection; the surface layer is regenerated below.
    step("uv", ["run", "--with", "pydantic", "--with", "pyyaml", "--with", "httpx", "bash", "scripts/refresh-automate-zscaler.sh"]);
    step("bash", ["scripts/refresh-postman.sh"]);
  }
  // Both checks exit 1 when something drifted; that is the expected case, not a failure.
  const reports = [
    { title: "Help capture drift", file: "help.json", args: ["scripts/help_capture.py", "check", "--replace", "--json", ...(changedOnly ? plan.check : [])] },
    ...(changedOnly ? [] : [{ title: "GitHub issue drift", file: "issues.json", args: ["scripts/issue_capture.py", "check", "--replace", "--json"] }]),
  ];
  const captured = [];
  for (const r of reports) {
    // A daily run with nothing to check writes the empty report itself: the check with no names checks everything.
    const text = changedOnly && r.file === "help.json" && !plan.check.length ? '{"pages": []}' : step("python3", r.args, { ok: [0, 1], capture: true });
    // A crash exits 1 too: a check succeeded only if it printed its report (and then it rewrote the captures).
    if (!reportOk(text)) throw new Error(`python3 ${r.args.join(" ")} printed no report: it failed (its error is above)`);
    fs.writeFileSync(path.join(dir, r.file), text);
    if (r.file !== "help.json") continue;
    // New pages after the help check: a renamed page's capture follows its redirect there and keeps the old address
    // as an alias, so its new address is already captured and is skipped here.
    const have = new Set(captureUrls(ROOT).flatMap((c) => c.urls));
    for (const url of (plan?.capture ?? []).filter((u) => !have.has(u))) {
      const name = captureName(url);
      const c = spawnSync("python3", ["scripts/help_capture.py", "capture", url, name], { cwd: ROOT, encoding: "utf8" });
      const why = (c.stderr || c.stdout || "").trim().split("\n").pop() ?? "";
      captured.push({ url, result: c.status === 0 ? name : `failed: ${why.replaceAll(`${ROOT}/`, "")}` });
    }
  }
  step(process.execPath, ["scripts/kb.mjs", "requote", "--write"]);
  step(process.execPath, ["scripts/gen-log-types.mjs"]);
  // A refetched API spec page changes the surface layer as a pin bump does.
  step(process.execPath, ["scripts/gen-surfaces.mjs", "all"]);
  // A refetched release-note page adds its new releases.
  step(process.execPath, ["scripts/gen-releases.mjs"]);
  step(process.execPath, ["scripts/kb.mjs", "manifest"]);
  // verified exits 1 when a citation fails, which is what the review below reports; it writes the record either way.
  step(process.execPath, ["scripts/kb.mjs", "verified"], { ok: [0, 1] });
  // Reviewed after requote, so `broken` is what is left for a person.
  const g = buildGraph(loadPublic(ROOT));
  const reviews = reports.map((r) => ({ title: r.title, pages: driftReview(g, JSON.parse(fs.readFileSync(path.join(dir, r.file), "utf8"))) }));
  fs.writeFileSync(path.join(dir, "review.md"), reviews.map((r) => markdown(r.pages, r.title)).join("\n"));
  fs.writeFileSync(path.join(dir, "by-subject.md"), `${subjectsMarkdown(bySubject(reviews.flatMap((r) => r.pages)))}\n`);
  fs.writeFileSync(path.join(dir, "renames.md"), `${renamesMarkdown(renameSweep(g, renames(JSON.parse(fs.readFileSync(path.join(dir, "help.json"), "utf8")))))}\n`);
  const queue = captureQueue(ROOT, citedFiles(g));
  fs.writeFileSync(path.join(dir, "capture-queue.md"), queueMarkdown(queue, queue.length));
  const note = (plan ? discoveryNote(plan, captured) : "") + queueNote(queue);
  if (plan) fs.writeFileSync(path.join(dir, "discovery.json"), `${JSON.stringify({ plan, captured }, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, "body.md"), prBody(reviews, BODY_LIMIT - note.length) + note);
  const summary = {
    ...Object.fromEntries(reviews.map((r, i) => [reports[i].file.replace(".json", ""), counts(r.pages)])),
    capture_queue: queue.length,
    ...(plan ? { captured: captured.length, deferred: plan.deferred.length, automate: plan.automate } : {}),
  };
  process.stdout.write(`${JSON.stringify(summary)}\n`);
  return 0;
}

if (import.meta.main) process.exitCode = main(process.argv.slice(2));
