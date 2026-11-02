// scripts/kb-lint.mjs — deterministic evidence checks for Tier A claims.
//
// A Tier A claim must have every material part stated by its evidence (design spec, "What Tier A evidence must
// cover"). Most of that needs judgment and is left to the claim audit; these checks catch the parts a string match
// can settle, measured against the audit before they were written:
//
//   version     a version in the statement (4.8, v4.7.23) appears nowhere in the evidence. The heading above a
//               changelog quote counts, so the quote's own release section states its version.
//   identifier  a backticked name in the statement (a field, function, path or resource) appears nowhere in the
//               evidence: not in a quote, `after`, the file path, the pointer, `expect`, or the claim's `binds`.
//               Illustrations are exempt: example hosts (example.com) and assignments (`page_size=0`).
//   number      a number of two or more digits in the statement appears nowhere in the evidence. A warning: a
//               count of a quoted list, or a status code a quoted constant implies, is fine.
//   pin         the statement places itself relative to the checked-out pin ("the pinned release", "at the pin"),
//               which goes stale at the next bump; name the release instead.
//
// Matching ignores case, whitespace and Markdown bold, as quote anchoring does.

import { headingsAbove } from "./kb-lib.mjs";

const VERSION = /\b(v?\d+\.\d+(?:\.\d+)*)\b/g;
const NUMBER = /(?<![\w.`/-])(\d{2,}|\d{1,3}(?:,\d{3})+)(?![\w.%`/-])/g;
const TICK = /`([^`]+)`/g;
const ILLUSTRATION = /\bexample\.|\bsafemarch\.|=/i;
const PIN = /\b(?:the|current|at the) pin(?:ned (?:release|version|commit|tag))?\b|\bpinned release\b/i;
// Release notes, whose section headings name the release each entry belongs to.
const CHANGELOG = /(?:^|\/)(?:changelog|changes|history|release[-_]?notes)[^/]*\.(?:md|markdown|txt|rst)$/i;
// An absence word, then only articles, other code names and list joiners up to the name: "without `x`",
// "has no `a` or `b`", "lacks the `c`".
const ABSENCE = /\b(?:without|no|not|lacks?|lacking|omits?|missing|never)\b(?:\s|,|\b(?:or|and|nor|a|an|the|any)\b|`[^`]*`)*$/i;

export const CHECKS = { version: "error", identifier: "error", number: "warning", pin: "error" };

function flat(s) {
  return String(s).replace(/\*\*/g, "").toLowerCase().replace(/[\s\\]+/g, "");
}

/** Everything a claim's evidence states or locates, flattened for matching; `context` adds text around the quotes. */
export function evidenceText(claim, context = []) {
  const parts = [...(claim.binds || []), ...context];
  for (const ev of claim.evidence || []) {
    parts.push(...(ev.quotes || []), ev.after || "", ev.path || "", ev.pointer || "", ...(ev.at || []));
    for (const k of ["expect", "expect_absent"]) if (k in ev) parts.push(JSON.stringify(ev[k]));
  }
  return flat(parts.join(" "));
}

function hasIdentifier(text, name) {
  const t = flat(name);
  if (text.includes(t)) return true;
  // A code expression may be quoted with different spacing or split across lines: every word must be there.
  const words = t.match(/[a-z0-9_]{3,}/g) || [];
  return words.length > 0 && words.every((w) => text.includes(w));
}

/**
 * Findings for one claim: [{ check, level, missing: [...] }]. Only Tier A claims with evidence are checked.
 * `context` is text the evidence locates without quoting, such as a changelog quote's release heading.
 */
export function lintClaim(claim, context = []) {
  if (claim.tier !== "A" || !(claim.evidence || []).length) return [];
  const text = evidenceText(claim, context);
  const plain = claim.statement.replace(TICK, " ");
  const out = [];
  const add = (check, missing) => {
    if (missing.length) out.push({ check, level: CHECKS[check], missing: [...new Set(missing)] });
  };
  add("version", [...plain.matchAll(VERSION)].map((m) => m[1]).filter((v) => !text.includes(flat(v.replace(/^v/i, "")))));
  // A name the statement says is absent ("without `x`", "has no `x`") cannot be in the evidence; whether the
  // absence is supported is the claim audit's call, not a string match's.
  const names = [...claim.statement.matchAll(TICK)]
    .filter((m) => !ABSENCE.test(claim.statement.slice(Math.max(0, m.index - 80), m.index)))
    .map((m) => m[1])
    .filter((n) => !ILLUSTRATION.test(n));
  add("identifier", names.filter((n) => !hasIdentifier(text, n)));
  add("number", [...plain.matchAll(NUMBER)].map((m) => m[1]).filter((n) => !text.replace(/,/g, "").includes(n.replace(/,/g, ""))));
  add("pin", [...claim.statement.matchAll(new RegExp(PIN, "gi"))].map((m) => m[0]));
  return out;
}

/** One finding as a line of text. */
export function describe(f) {
  return f.check === "pin" ? `statement is relative to the pin (${f.missing.join(", ")}); name the release` : `${f.check} not in evidence: ${f.missing.join(", ")}`;
}

/** Findings for every claim in the graph, or with `only` (a set of subject IDs) for those subjects' claims. */
export function lintGraph(g, { only = null } = {}) {
  const findings = [];
  const cache = new Map();
  for (const node of g.nodes.values()) {
    if (node.kind !== "claim" || (only && !only.has(node.subject))) continue;
    const context = (node.data.evidence || []).filter((ev) => CHANGELOG.test(ev.path || "")).flatMap((ev) => headingsAbove(g, ev, cache));
    for (const f of lintClaim(node.data, context)) findings.push({ id: node.id, file: node.file, ...f });
  }
  return findings;
}
