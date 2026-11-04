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
// With --by-subject, any number of check reports and the pin review together, as one list per subject of what needs
// reading there, so each subject gets one owner however many sources it cites.
//
// With --renames, the names a help check's diffs replaced (an old line and its new line differ in one short span:
// "Internet & SaaS" -> "Internet Access") and the subjects whose own wording still uses the old name. The review
// above covers evidence; a rename also reaches titles, aliases, prose and statements that cite other pages.
//
// Usage: node scripts/kb-drift.mjs <check-report.json> [--json]
//        node scripts/kb-drift.mjs --renames <help-check-report.json> [--json]
//        node scripts/kb-drift.mjs --pins <base-ref> [--json]
//        node scripts/kb-drift.mjs --by-subject [<check-report.json> ...] [--pins <base-ref>] [--json]

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
    // An entry whose `at` names only fixed refs is not moved by a pin bump; one that also names HEAD is.
    if (!files || (ev.at && !ev.at.includes("HEAD")) || !files.has(ev.path)) continue;
    const file = `${g.sources.sources[ev.source].root}/${ev.path}`;
    if (!pages.has(file)) pages.set(file, { file, status: "drift", from: pins[ev.source].from.slice(0, 7), to: pins[ev.source].to.slice(0, 7), evidence: [] });
    pages.get(file).evidence.push({ subject: node.id, where, ...classify(g, ev, files.get(ev.path), cache) });
  }
  return [...pages.values()].sort((a, b) => a.file.localeCompare(b.file));
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Classify every evidence entry that cites a page in the report. */
export function driftReview(g, report) {
  // issue_capture.py lists every issue it checked; one that did not change has nothing to review.
  const pages = new Map(report.pages.filter((p) => p.status !== "unchanged").map((p) => [p.file, { ...p, evidence: [] }]));
  const cache = new Map();
  for (const { node, ev, where } of allEvidence(g)) {
    if (ev.source !== (report.source || "zscaler-help")) continue;
    const page = pages.get(ev.path);
    if (!page) continue;
    const item = { subject: node.id, where };
    // A moved page kept its content: only evidence that points at its address can have changed.
    if (page.status !== "drift" && page.status !== "moved") {
      page.evidence.push({ ...item, state: page.status });
      continue;
    }
    page.evidence.push({ ...item, ...classify(g, ev, page.changed_lines, cache) });
  }
  return [...pages.values()];
}

export function markdown(pages, title = "Help capture drift") {
  const out = [`# ${title}`, ""];
  const count = (s) => pages.reduce((n, p) => n + p.evidence.filter((e) => e.state === s).length, 0);
  out.push(
    `${pages.filter((p) => p.status === "drift" || p.status === "moved").length} file(s) changed; evidence citing them: ` +
      `${count("broken")} broken, ${count("in-change")} in changed text, ${count("untouched")} untouched.`,
    "",
  );
  for (const p of pages) {
    const head = p.status === "drift" ? `revision ${p.from ?? "?"} -> ${p.to ?? "?"}` : p.status;
    out.push(`## ${p.file} (${head})`, "");
    if (p.message) out.push(p.message, "");
    for (const state of ["broken", "in-change", "gone", "unavailable", "returned"]) {
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

// Words of instructions and sentence glue: a span made only of these is an edit to the steps, not a renamed thing.
const GLUE = new Set("a an and or the to of for in on at by with from go select click enter edit delete add remove choose".split(" "));
const span = (words) => words.join(" ").replace(/^[^\w&]+|[^\w&)]+$/g, "");
/** A changed span worth a sweep: it names something (an acronym, or a word that is not glue), not a case change. */
const named = (from, to) =>
  from.length >= 3 && from.toLowerCase() !== to.toLowerCase() &&
  (/[A-Z]{2,}|[A-Z][a-z]+[A-Z]/.test(from) || from.split(/\s+/).some((w) => /^[A-Za-z]{3,}$/.test(w) && !GLUE.has(w.toLowerCase())) && from.split(/\s+/).length > 1);

/**
 * Names a help check's diffs replaced: for each removed line and the added line in its place, the one span that
 * differs between their common prefix and suffix (at most five words each side). [{ from, to, files }], most pages
 * first.
 */
export function renames(report) {
  const pairs = new Map();
  for (const p of report.pages) {
    if (!p.diff) continue;
    let minus = [];
    let plus = [];
    const flush = () => {
      for (let i = 0; i < Math.min(minus.length, plus.length); i++) {
        const a = minus[i].trim().split(/\s+/);
        const b = plus[i].trim().split(/\s+/);
        let head = 0;
        while (head < a.length && head < b.length && a[head] === b[head]) head++;
        let tail = 0;
        while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
        // A span that starts with a joiner ("& SaaS") keeps the word before it ("Internet & SaaS").
        if (head > 0 && /^(?:&|and|or|of)$/i.test(a[head] ?? "")) head--;
        const from = span(a.slice(head, a.length - tail));
        const to = span(b.slice(head, b.length - tail));
        if (!from || !to || from.split(" ").length > 5 || to.split(" ").length > 5 || !named(from, to)) continue;
        const key = `${from}\u0000${to}`;
        if (!pairs.has(key)) pairs.set(key, { from, to, files: new Set() });
        pairs.get(key).files.add(p.file);
      }
      minus = [];
      plus = [];
    };
    for (const line of p.diff.split("\n")) {
      if (line.startsWith("---") || line.startsWith("+++")) continue;
      if (line.startsWith("-")) minus.push(line.slice(1));
      else if (line.startsWith("+")) plus.push(line.slice(1));
      else flush();
    }
    flush();
  }
  return [...pairs.values()].map((r) => ({ ...r, files: [...r.files].sort() })).sort((a, b) => b.files.length - a.files.length || a.from.localeCompare(b.from));
}

/** The graph's own wording in a subject (not its quotes): title, aliases, prose, statements, gaps, divergences, checks. */
function* ownText(data) {
  yield data.title ?? "";
  yield* data.aliases ?? [];
  for (const b of data.prose ?? []) yield* [b.label ?? "", b.text ?? "", ...(b.items ?? []), ...(b.steps ?? [])].map(String);
  for (const c of Object.values(data.claims ?? {})) yield* [c.statement ?? "", c.conditions ?? ""];
  for (const gp of Object.values(data.gaps ?? {})) yield* [gp.title ?? "", gp.detail ?? ""];
  for (const d of Object.values(data.divergences ?? {})) yield* [d.summary ?? "", d.impact ?? "", ...(d.positions ?? []).map((x) => x.says ?? "")];
  for (const ch of data.checks ?? []) yield ch.do ?? "";
}

/** For each rename, the subjects whose own wording still uses the old name. */
export function renameSweep(g, list) {
  return list.map((r) => {
    const re = new RegExp(`(?<![\\w])${r.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`, "i");
    const subjects = g.files.subjects.filter(({ data }) => [...ownText(data)].some((t) => re.test(t))).map(({ data }) => data.id).sort();
    return { ...r, subjects };
  });
}

/** The rename sweep as Markdown: renames that leave the old name somewhere, then the ones that do not. */
export function renamesMarkdown(swept) {
  const out = ["# Renames in the changed pages", ""];
  const open = swept.filter((r) => r.subjects.length);
  out.push(`${swept.length} replaced name(s); ${open.length} still used in the graph's own wording.`, "");
  for (const r of open) {
    const shown = r.subjects.slice(0, 12).map((s) => `\`${s}\``).join(", ");
    const more = r.subjects.length > 12 ? `, and ${r.subjects.length - 12} more` : "";
    out.push(`## "${r.from}" -> "${r.to}" (${r.files.length} page(s), ${r.subjects.length} subject(s))`, "", `${shown}${more}`, "");
  }
  return out.join("\n");
}

/** The subject a review entry belongs to: the subject of a claim, gap or divergence, or the type of a field. */
const subjectOf = (id) => (id.includes(":") ? id.split(":")[0] : id.split("#")[0]);

/**
 * The entries of any number of reviews that need reading (everything but untouched), grouped by subject and sorted:
 * [{ subject, entries: [{ file, state, where, errors? }] }].
 */
export function bySubject(pages) {
  const subjects = new Map();
  for (const p of pages) {
    for (const e of p.evidence) {
      if (e.state === "untouched") continue;
      const id = subjectOf(e.subject);
      if (!subjects.has(id)) subjects.set(id, { subject: id, entries: [] });
      subjects.get(id).entries.push({ file: p.file, state: e.state, where: e.where, ...(e.errors ? { errors: e.errors } : {}) });
    }
  }
  return [...subjects.values()].sort((a, b) => a.subject.localeCompare(b.subject));
}

/** The by-subject review as Markdown. */
export function subjectsMarkdown(subjects, title = "Review by subject") {
  const n = subjects.reduce((k, s) => k + s.entries.length, 0);
  const out = [`# ${title}`, "", `${subjects.length} subject(s), ${n} entries to read.`, ""];
  for (const s of subjects) {
    out.push(`## ${s.subject}`, "");
    for (const e of s.entries) out.push(`- **${e.state}** ${e.where} (\`${e.file}\`)${e.errors ? `: ${e.errors[0]}` : ""}`);
    out.push("");
  }
  return out.join("\n");
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const pinsAt = args.indexOf("--pins");
  const base = pinsAt === -1 ? undefined : args[pinsAt + 1];
  const files = args.filter((a, i) => !a.startsWith("--") && (pinsAt === -1 || i !== pinsAt + 1));
  const grouped = args.includes("--by-subject");
  const renamesAt = args.indexOf("--renames");
  if (renamesAt !== -1) {
    const report = args[renamesAt + 1];
    if (!report) {
      console.error("usage: node scripts/kb-drift.mjs --renames <help-check-report.json> [--json]");
      process.exit(2);
    }
    const swept = renameSweep(buildGraph(loadPublic(ROOT)), renames(JSON.parse(fs.readFileSync(report, "utf8"))));
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(swept, null, 2)}\n` : `${renamesMarkdown(swept)}\n`);
    process.exit(0);
  }
  if ((pinsAt !== -1 && !base) || (grouped ? !files.length && !base : base ? files.length : files.length !== 1)) {
    console.error(
      "usage: node scripts/kb-drift.mjs <check-report.json> [--json]\n       node scripts/kb-drift.mjs --pins <base-ref> [--json]\n" +
        "       node scripts/kb-drift.mjs --by-subject [<check-report.json> ...] [--pins <base-ref>] [--json]",
    );
    process.exit(2);
  }
  const g = buildGraph(loadPublic(ROOT));
  const pages = [...files.flatMap((f) => driftReview(g, JSON.parse(fs.readFileSync(f, "utf8")))), ...(base ? pinReview(g, movedPins(g, base)) : [])];
  if (grouped) {
    const subjects = bySubject(pages);
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(subjects, null, 2)}\n` : `${subjectsMarkdown(subjects)}\n`);
  } else {
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(pages, null, 2)}\n` : `${markdown(pages, base ? `Submodule pin drift since ${base}` : undefined)}\n`);
  }
  // Broken evidence must be re-anchored before the pull request can merge.
  process.exitCode = pages.some((p) => p.evidence.some((e) => e.state === "broken")) ? 1 : 0;
}
