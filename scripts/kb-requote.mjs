// scripts/kb-requote.mjs — repair quotes that a capture re-render broke only by spacing.
//
// A re-render can add or drop whitespace between characters (block boundaries inside a table cell, a bold
// run next to a word) without changing a word of the page. A quote or `after` anchor that no longer
// anchors is re-quoted when the capture holds exactly one span equal to it once all whitespace is ignored;
// that span, as the capture now spaces it, replaces it. Anything else (a reworded page, a span that occurs
// twice) is left broken for a person: `kb.mjs validate` and kb-drift.mjs report it.
//
// Only capture sources are re-quoted: their text is regenerated, while other sources are pinned files whose
// quotes were taken from the text as it stands.
import fs from "node:fs";
import path from "node:path";
import { allEvidence, anchorEvidence, captureTextOf, normalizeWs } from "./kb-lib.mjs";

const IGNORABLE = /\s|‍|[​‌⁠﻿-]/;

/** The anchoring text with whitespace and bold markers removed, and each kept character's offset in `norm`. */
function despaced(norm, emphasis) {
  let text = "";
  const at = [];
  for (let i = 0; i < norm.length; i++) {
    if (emphasis && norm[i] === "*" && norm[i + 1] === "*") { i++; continue; }
    if (IGNORABLE.test(norm[i])) continue;
    text += norm[i];
    at.push(i);
  }
  return { text, at };
}

/** The one span of `norm` equal to `quote` up to whitespace, or null when there is none or more than one. */
export function respace(norm, quote, { emphasis = false } = {}) {
  const hay = despaced(norm, emphasis);
  const needle = despaced(normalizeWs(quote), emphasis).text;
  if (!needle) return null;
  const first = hay.text.indexOf(needle);
  if (first === -1 || hay.text.indexOf(needle, first + 1) !== -1) return null;
  const span = norm.slice(hay.at[first], hay.at[first + needle.length - 1] + 1);
  // Bold the capture keeps is ignored by anchoring; do not carry it into a quote written without it.
  return emphasis && !quote.includes("**") ? normalizeWs(span.replaceAll("**", "")) : span;
}

/**
 * Re-quote every capture evidence entry that fails to anchor and can be repaired by spacing alone. Returns
 * { fixed: [{ where, from, to }], broken: [{ where, errors }] }; with write, rewrites the changed files.
 */
export function requote(g, { write = false } = {}) {
  const fixed = [];
  const broken = [];
  const touched = new Set();
  const cache = new Map();
  for (const { node, ev, where } of allEvidence(g)) {
    const src = g.sources.sources[ev.source];
    if (src?.kind !== "capture" || !ev.quotes || ev.at) continue;
    const before = anchorEvidence(g, ev, cache);
    if (before.ok) continue;
    const norm = normalizeWs(captureTextOf(g, ev) ?? "");
    const next = { ...ev };
    const changes = [];
    const fix = (old) => {
      const to = respace(norm, old, { emphasis: true });
      if (to === null || to === old) return old;
      changes.push({ where, from: old, to });
      return to;
    };
    if (ev.after !== undefined) next.after = fix(ev.after);
    next.quotes = ev.quotes.map(fix);
    if (!changes.length) { broken.push({ where, errors: before.errors }); continue; }
    const after = anchorEvidence(g, next, new Map());
    if (!after.ok) { broken.push({ where, errors: after.errors }); continue; }
    if (next.after !== undefined) ev.after = next.after;
    ev.quotes = next.quotes;
    fixed.push(...changes);
    touched.add(node.file);
  }
  if (write) {
    const all = [...g.files.subjects, ...g.files.logTypes];
    for (const { file, data } of all) {
      if (touched.has(file)) fs.writeFileSync(path.join(g.root, file), `${JSON.stringify(data, null, 2)}\n`);
    }
  }
  return { fixed, broken, files: [...touched].sort() };
}
