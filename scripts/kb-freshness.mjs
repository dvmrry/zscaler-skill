// kb-freshness.mjs — how old is the vendor material the knowledge graph rests on?
//
// Age is the material's own date (materialDate in kb-lib.mjs: the vendor's published date where the source
// gives one, the commit date for code, else the day the content was first seen), never the day the repo
// captured a file. The report lists, per source, every captured file with its date, basis, age and how many
// evidence entries cite it; what is undated; and each code pin, with the newest upstream release when asked.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { allEvidence, helpCapture, materialDate } from "./kb-lib.mjs";

const DAY = 86400000;
const age = (date, today) => Math.floor((Date.parse(today) - Date.parse(date)) / DAY);

function captureFiles(g, src, id) {
  const root = path.join(g.root, src.root);
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else out.push({ source: id, path: path.relative(root, full).split(path.sep).join("/") });
    }
  };
  if (fs.existsSync(root)) walk(root);
  return out;
}

/**
 * The newest release upstream, by release date, and whether the pin already contains it. Version order is
 * not release order: a repository can carry a stray old tag that sorts highest (zscaler-sdk-python's v2.0.0
 * is from 2025, older than v1.10.0). Fetches tags into the submodule (network); never moves the pin.
 */
function upstreamRelease(dir) {
  const git = (...a) => execFileSync("git", ["-C", dir, ...a], { encoding: "utf8", timeout: 120000, stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    git("fetch", "-q", "--tags", "origin");
    const newest = git("tag", "--sort=-creatordate", "--format=%(creatordate:short) %(refname:short)")
      .split("\n").map((l) => l.split(" ")).find(([, t]) => /^v?\d+\.\d+\.\d+(-[\w.]+)?$/.test(t || ""));
    if (!newest) return null;
    let contained = true;
    try { git("merge-base", "--is-ancestor", newest[1], "HEAD"); } catch { contained = false; }
    return { tag: newest[1], date: newest[0], contained };
  } catch {
    return null;
  }
}

export function freshness(g, { days = 365, upstream = false, today = new Date().toISOString().slice(0, 10) } = {}) {
  const cited = new Map();
  for (const { ev } of allEvidence(g)) {
    const k = `${ev.source}:${ev.path}`;
    cited.set(k, (cited.get(k) || 0) + 1);
  }
  const files = [];
  const code = [];
  const cache = new Map();
  for (const [id, src] of Object.entries(g.sources.sources)) {
    if (src.kind === "submodule") {
      const dir = path.join(g.root, src.root);
      const git = (...a) => {
        try { return execFileSync("git", ["-C", dir, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; }
      };
      // describe without --abbrev=0: "v3.8.48-1-g4b71012" says the pin is one commit past that tag.
      const pin = { source: id, pin_tag: git("describe", "--tags") || null, pin_date: git("log", "-1", "--format=%cs") || null };
      if (pin.pin_date) pin.age_days = age(pin.pin_date, today);
      if (upstream) pin.upstream = upstreamRelease(dir);
      code.push(pin);
      continue;
    }
    for (const f of captureFiles(g, src, id)) {
      const dated = materialDate(g, f, cache);
      const doc = helpCapture(path.join(g.root, src.root, f.path));
      files.push({
        ...f,
        ...(doc ? { kind: doc.kind } : {}),
        as_of: dated?.as_of || null,
        basis: dated?.basis || null,
        ...(dated ? { age_days: age(dated.as_of, today) } : {}),
        cited_by: cited.get(`${f.source}:${f.path}`) || 0,
      });
    }
  }
  const summary = {};
  for (const f of files) {
    summary[f.source] ||= { files: 0, cited_files: 0, undated: 0, by_basis: {}, oldest: null };
    const s = summary[f.source];
    s.files++;
    if (f.cited_by) s.cited_files++;
    if (!f.as_of) { s.undated++; continue; }
    s.by_basis[f.basis] = (s.by_basis[f.basis] || 0) + 1;
    if (!s.oldest || f.as_of < s.oldest.as_of) s.oldest = { path: f.path, as_of: f.as_of };
  }
  const stale = files.filter((f) => f.cited_by && f.age_days > days).sort((a, b) => b.age_days - a.age_days);
  const undated = files.filter((f) => f.cited_by && !f.as_of);
  return { today, threshold_days: days, summary, stale, undated, code, files };
}

export function freshnessText(r) {
  const out = [`Material age (as of ${r.today}; stale = cited and older than ${r.threshold_days} days)`, ""];
  for (const [id, s] of Object.entries(r.summary)) {
    const basis = Object.entries(s.by_basis).map(([b, n]) => `${b} ${n}`).join(", ");
    out.push(`${id}: ${s.files} files (${s.cited_files} cited); dated by ${basis || "nothing"}${s.undated ? `; ${s.undated} undated` : ""}${s.oldest ? `; oldest ${s.oldest.as_of} (${s.oldest.path})` : ""}`);
  }
  out.push("", `Stale cited material: ${r.stale.length}`);
  for (const f of r.stale.slice(0, 25)) out.push(`  ${f.as_of}  ${String(f.age_days).padStart(4)} d  ${f.basis.padEnd(18)} ${f.cited_by} citations  ${f.source}/${f.path}`);
  if (r.stale.length > 25) out.push(`  ... ${r.stale.length - 25} more (--json for all)`);
  out.push("", `Undated cited material: ${r.undated.length}`);
  for (const f of r.undated) out.push(`  ${f.cited_by} citations  ${f.source}/${f.path}`);
  out.push("", "Code pins:");
  for (const c of r.code) {
    const u = c.upstream;
    const behind = !u ? "" : u.contained ? "  current" : `  BEHIND: ${u.tag} released ${u.date}`;
    out.push(`  ${c.source.padEnd(30)} ${(c.pin_tag || "-").padEnd(22)} ${c.pin_date || "-"}${c.age_days !== undefined ? ` (${c.age_days} d)` : ""}${behind}`);
  }
  return out.join("\n") + "\n";
}
