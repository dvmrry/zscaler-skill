#!/usr/bin/env node
// scripts/kb-reanchor.mjs — repair claim quotes that a reworded help page or a moved vendor pin broke, with a
// model as a narrow judge.
//
// `kb.mjs requote` repairs what changed only by spacing. What is left is a page the vendor reworded or extended, or
// vendor code that changed at a new pin. For every claim, and every divergence position, whose quotes in a help
// capture or a pinned file no longer anchor, this finds each broken quote's passage as it was at --base (the capture
// then, or the file at the pin --base recorded) and says why it broke: it is missing (then the model sees the same
// part of the source now, or its most similar sentences), or it now occurs more than once (then it sees every
// occurrence), or it no longer follows its context anchor. It asks the model for one decision per broken quote:
//   replace              the new text says the same thing: a new quote, copied from the new text
//   replace_and_restate  the new text changed something the statement relies on: a new quote and a restated claim
//   anchor               the quote is unchanged but repeated: an `after` context anchor that picks its occurrence
//   old_version          (a pinned file) the claim is about one version, so the evidence is pinned to the old one
//   unsupported          the source no longer says it: left broken, for a person (or a gap)
// A replace may give an `after` anchor too, and a broken `after` anchor is re-anchored the same way. The model sees the
// statement, its other quotes and the passages; it never edits a file.
//
// The model's decisions are checked as a whole, evidence entry by evidence entry: the entry as the decisions would
// leave it must anchor by the gate's own rule (kb-lib's anchorIn) for every quote that anchors now or is repaired,
// with at most one new context anchor; and every quote whose place a decision set is placed against its old
// surroundings, the sentences just before and after it. A repair where they still are, in one place, is safe; one
// outside where they are is rejected, so a page that gained a second model's or OS's section does not move a claim
// onto the wrong one; and one whose place the text cannot settle (the page repeats that part, or its surroundings
// changed or moved) is applied with a `review` note for a person, since only the headings and the statement's meaning
// can tell which copy it is about. Rejected decisions go back to the model once, with the reason. A restated statement is taken only when every restate decision of the reply that wrote it
// was accepted. With --write the decisions are applied, the spines and verified.json are regenerated, and `kb.mjs
// check` runs on the subjects they touched. The claim audit is still the check of what a restated statement says. A
// quote the source no longer supports is left broken: turn its claim into a gap, or restate it from what the source
// now says.
//
// The model is any OpenAI-compatible chat endpoint: KB_MODEL_ENDPOINT (base URL, for example
// http://localhost:8080/v1 for a local server or https://openrouter.ai/api/v1), KB_MODEL (its model ID) and, if it needs one,
// KB_MODEL_API_KEY.
//
// A run's --json output can be read and edited, then applied as reviewed with --apply, which asks no model: a model's
// decisions differ from run to run, so a dry run reviewed by a person should be applied as it is.
//
// Usage: node scripts/kb-reanchor.mjs --base <ref> [--only <claim-id>] [--write] [--report <file.md>] [--json <file>]
//        node scripts/kb-reanchor.mjs --apply <file.json>
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allEvidence, anchorEvidence, anchorIn, buildGraph, captureText, loadPublic, normalizeWs } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUOTE_MIN = 8;
const QUOTE_MAX = 320;
// The shortest piece of a page that can stand for a passage's surroundings: shorter ones ("- Windows") repeat by chance.
const LANDMARK_MIN = 12;
// The most occurrences of a repeated quote the model is shown.
const PLACES = 6;

/** Anchoring text as quotes match it: whitespace normalized, bold markers dropped. */
export const plain = (s) => normalizeWs(s.replaceAll("**", ""));
const tokens = (s) => [...s.matchAll(/\S+/g)].map((x) => ({ w: x[0], at: x.index, end: x.index + x[0].length }));

/** Every position of `q` in `text`, from `from` on. */
export function occurrences(text, q, from = 0) {
  const out = [];
  if (!q) return out;
  for (let i = text.indexOf(q, from); i !== -1; i = text.indexOf(q, i + 1)) out.push(i);
  return out;
}

/** The text before and just after position `at`, with the `len` characters there marked: enough to tell its section. */
const place = (text, at, len) => `${text.slice(Math.max(0, at - 240), at)}⟦${text.slice(at, at + len)}⟧${text.slice(at + len, at + len + 60)}`;

// Where a normalized page splits into pieces: where a sentence, a list item, a heading or a table cell ends. A colon
// does not end one: an item's label ("Restart Service:") repeats across a page's copies of a section, its whole text less.
const CUT = /(?<=[.!?;|])\s+|\s+(?=-\s|#{1,6}\s|\d+\.\s)/g;

/** A normalized page's pieces, with where each starts. */
function pieces(text) {
  const out = [];
  let at = 0;
  for (const m of text.matchAll(CUT)) {
    out.push({ s: text.slice(at, m.index), at });
    at = m.index + m[0].length;
  }
  out.push({ s: text.slice(at), at });
  return out.filter((p) => p.s.length);
}

/** Longest-common-subsequence alignment of two word arrays, as matched index pairs. */
export function align(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Int32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const pairs = [];
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (a[i] === b[j]) pairs.push([i++, j++]);
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

/** Share of `a`'s words that `b` has (case-insensitive): a cheap measure of how much of a passage survived. */
export function overlap(a, b) {
  const words = (s) => s.toLowerCase().split(/\s+/).filter(Boolean);
  const have = new Set(words(b));
  const want = words(a);
  return want.length ? want.filter((w) => have.has(w)).length / want.length : 0;
}

/**
 * Where `quote` (found in `oldText` at or after `from`) went in `newText`: the old passage with the quote marked, and
 * the new text around the words of it that survive in place. `near` is null when none survive near the old position.
 */
export function counterpart(oldText, newText, quote, context = 500, from = 0) {
  const at = oldText.indexOf(quote, from);
  if (at === -1) return null;
  const old = `${oldText.slice(Math.max(0, at - 200), at)}⟦${quote}⟧${oldText.slice(at + quote.length, at + quote.length + 200)}`;
  const ow = tokens(oldText);
  const nw = tokens(newText);
  const qi = ow.findIndex((t) => t.at >= at);
  const qn = tokens(quote).length;
  const lo = Math.max(0, qi - 60);
  const hi = Math.min(ow.length, qi + qn + 60);
  const centre = Math.floor((qi / Math.max(1, ow.length)) * nw.length);
  const nlo = Math.max(0, centre - 500);
  const nhi = Math.min(nw.length, centre + qn + 500);
  const pairs = align(ow.slice(lo, hi).map((t) => t.w), nw.slice(nlo, nhi).map((t) => t.w)).filter(([i]) => i + lo >= qi && i + lo < qi + qn);
  if (!pairs.length) return { old, near: null };
  const start = nw[pairs[0][1] + nlo].at;
  const end = nw[pairs.at(-1)[1] + nlo].end;
  return { old, near: newText.slice(Math.max(0, start - context), Math.min(newText.length, end + context)) };
}

/**
 * The `n` sentences of `newText` most like `quote`, for a passage that moved away from where it was. The text is
 * normalized to one line, so it is split where a sentence, a list item, a heading or a table cell ends.
 */
export function similarLines(newText, quote, n = 2) {
  return newText
    .split(/(?<=[.!?:;|])\s+|\s+(?=-\s|#{1,6}\s|\d+\.\s)/)
    .map((line) => ({ line, score: overlap(quote, line) }))
    .filter((x) => x.score >= 0.4 && x.line.length <= 4 * QUOTE_MAX)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.line);
}

/**
 * Where an evidence entry's quotes anchor in `text` (normalized as `norm` normalizes), by the gate's rule (kb-lib
 * anchorIn): with an `after` anchor, the anchor must occur once and each quote resolves to its first occurrence after
 * it; without, each quote must occur once. Each quote gets its position, or a code and a reason in words.
 */
export function resolveEntry(text, norm, entry) {
  let from = 0;
  let anchorError = null;
  if (entry.after !== undefined) {
    const a = norm(entry.after);
    const at = occurrences(text, a);
    if (at.length === 1) from = at[0] + a.length;
    else anchorError = at.length ? "after-anchor is ambiguous" : "after-anchor not found";
  }
  const quotes = entry.quotes.map((q) => {
    const nq = norm(q);
    const all = occurrences(text, nq);
    const first = text.indexOf(nq, from);
    if (first === -1 && entry.after !== undefined && all.length) return { at: -1, code: "not after its anchor", detail: "it appears only before the context anchor" };
    if (first === -1) return { at: -1, code: "not in the source", detail: `it is not an exact copy of the NEW text: ${mismatch(nq, text)}` };
    if (entry.after === undefined && all.length > 1) return { at: first, code: "occurs twice", detail: `it occurs ${all.length} times in the NEW text; give "after" to pick one, or a longer quote that occurs once` };
    return { at: first };
  });
  return { anchorError, quotes };
}

/**
 * Where a passage's old surroundings are on the new page. The surroundings of the `len` characters at `at` in the old
 * page are the nearest piece before them and the nearest after, of LANDMARK_MIN characters or more, exactly as they
 * were. Each copy of the piece before, with each copy of the piece after that follows it before the next copy of the
 * piece before, is a bracket. A bracket is `near` when it is not much longer than the gap was, and `whole` when every
 * other piece the gap held (short headings such as "- Linux" included) is still in it, in order: then it is the old
 * stretch with only the passage changed. Where only one of the two is on the page (the other was changed, or the
 * passage was at the page's start or end, which the vendor can extend), the brackets are one-sided: they run from the
 * piece that is there as far as the gap allows. `lo` and `hi` take in the two pieces themselves, so a quote that runs
 * into its unchanged neighbours is still in its place.
 */
export function brackets(oldText, newText, at, len, oldPieces = pieces(oldText)) {
  let left = null;
  let right = null;
  for (const p of oldPieces) {
    if (p.s.length < LANDMARK_MIN) continue;
    if (p.at + p.s.length <= at) left = p;
    else if (p.at >= at + len) {
      right = p;
      break;
    }
  }
  const from = left ? left.at + left.s.length : 0;
  const to = right ? right.at : oldText.length;
  const gapPieces = oldPieces.filter((p) => p.at >= from && p.at + p.s.length <= to && (p.at + p.s.length <= at || p.at >= at + len)).map((p) => p.s);
  const whole = (start, end) => {
    let i = start;
    for (const g of gapPieces) {
      i = newText.indexOf(g, i);
      if (i === -1 || i + g.length > end) return false;
      i += g.length;
    }
    return true;
  };
  const reach = 3 * (to - from) + 600;
  const ll = left?.s.length ?? 0;
  const rl = right?.s.length ?? 0;
  const starts = left ? occurrences(newText, left.s).map((i) => i + ll) : [];
  const ends = right ? occurrences(newText, right.s) : [];
  const out = [];
  starts.forEach((start, k) => {
    const next = starts[k + 1] ?? Number.POSITIVE_INFINITY;
    for (const end of ends.filter((e) => e >= start && e < next)) {
      out.push({ start, end, lo: start - ll, hi: end + rl, sides: 2, near: end - start <= reach, whole: whole(start, end) });
    }
  });
  if (!out.length) {
    for (const start of starts) out.push({ start, end: Math.min(newText.length, start + reach), lo: start - ll, hi: Math.min(newText.length, start + reach), sides: 1, near: true, from: "left" });
    if (!starts.length) for (const end of ends) out.push({ start: Math.max(0, end - reach), end, lo: Math.max(0, end - reach), hi: end + rl, sides: 1, near: true, from: "right" });
  }
  return { left: left?.s ?? null, right: right?.s ?? null, gapPieces, out };
}

/**
 * Where a decision put a quote, against its old surroundings. When exactly one bracket is near, two-sided and whole,
 * that is where the quote was: a quote there, the only copy, is "safe"; a quote elsewhere is "moved" when nothing new
 * is there, and "elsewhere" when new text took the old quote's place. Without such a bracket the place cannot be
 * confirmed: a quote outside every bracket, or past a nearer copy when only one side is left, is "elsewhere"; anything
 * else is "unsure" (the page repeats that part, the text between the surroundings changed, much was inserted, or one
 * side is a page edge or was changed).
 */
export function placeOf(E, qi, at, q) {
  E.oldPieces ??= pieces(E.oldText);
  E.newPieces ??= pieces(E.newText);
  const { left, right, gapPieces, out } = brackets(E.oldText, E.newText, E.oldAt[qi], E.norm(E.ev.quotes[qi]).length, E.oldPieces);
  const holds = (b) => at >= b.lo && at + q.length <= b.hi;
  const only = (b) => occurrences(E.newText.slice(b.lo, b.hi), q).length === 1;
  const around = `between "${(left ?? "the start of the page").slice(-60)}" and "${(right ?? "the end of the page").slice(0, 60)}"`;
  const near = out.filter((b) => b.sides === 2 && b.near);
  if (near.length === 1 && near[0].whole && out.filter((b) => b.sides === 2).every((b) => b === near[0] || !b.whole)) {
    const b = near[0];
    if (holds(b)) return only(b) ? { place: "safe" } : { place: "unsure", why: `the place ${around} holds more than one copy of it` };
    const fresh = E.newPieces.filter((p) => p.s.length >= LANDMARK_MIN && p.at >= b.start && p.at + p.s.length <= b.end && !gapPieces.includes(p.s));
    if (!fresh.length) return { place: "moved", why: `nothing is left where it was, ${around}, so the vendor moved it` };
    return { place: "elsewhere", why: `it is not where the old quote was, ${around}, and new text took that place: "${fresh.map((p) => p.s).join(" ").slice(0, 160)}"` };
  }
  if (!out.length) return { place: "unsure", why: `the text that was around the old quote, ${around}, is not on the page any more` };
  const inside = out.filter(holds);
  if (!inside.length) return { place: "elsewhere", why: `it is not where the old quote was, ${around}, in any of the ${out.length} places that text is` };
  if (out.length === 1 && out[0].sides === 1) {
    // From the one side that is left, the copy nearest it is the one that was there; a farther one skipped it.
    const b = out[0];
    const copies = occurrences(E.newText.slice(b.lo, b.hi), q).map((i) => i + b.lo);
    const nearest = b.from === "left" ? copies[0] : copies.at(-1);
    if (at !== nearest) return { place: "elsewhere", why: `a nearer copy of it is where the old quote was, ${around}: ${place(E.newText, nearest, q.length)}` };
    return { place: "unsure", why: `only one side of the text that was around the old quote is still there, ${around}` };
  }
  if (out.length > 1) return { place: "unsure", why: `the text around the old quote, ${around}, is on the page in ${out.length} places, and which one the statement is about can't be told from the text` };
  if (!out[0].near) return { place: "unsure", why: `much new text came in ${around}` };
  return { place: "unsure", why: `the text between ${around} changed besides the quote` };
}

/** Why a quote no longer anchors in `text`, with every place it occurs; null when it anchors. */
function brokenWhy(text, q, scoped, from) {
  const at = occurrences(text, q);
  if (scoped) return text.indexOf(q, from) !== -1 ? null : { why: at.length ? "not after its anchor" : "missing", count: at.length, at };
  return at.length === 1 ? null : { why: at.length ? "repeated" : "missing", count: at.length, at };
}

/**
 * One evidence entry's kept quotes and broken items, from its source text before (`oldText`, may be null) and now
 * (`newText`), both normalized by `norm`. Every broken item of the entry shares one `entry` record: the entry, both
 * texts, which quotes anchor now, and where each quote was in the old text, which the checks compare against.
 */
export function entryItems(ev, t) {
  const { norm, newText, oldText } = t;
  let from = 0;
  let oldFrom = 0;
  let oldAnchorAt = -1;
  let anchorBroken = null;
  if (ev.after !== undefined) {
    const a = norm(ev.after);
    anchorBroken = brokenWhy(newText, a, false, 0);
    if (!anchorBroken) from = newText.indexOf(a) + a.length;
    oldAnchorAt = oldText?.indexOf(a) ?? -1;
    if (oldAnchorAt !== -1) oldFrom = oldAnchorAt + a.length;
  }
  const status = ev.quotes.map((q) => brokenWhy(newText, norm(q), ev.after !== undefined, from));
  const entry = {
    ev, newText, oldText, norm, pinned: Boolean(t.pinned), anchorBroken: Boolean(anchorBroken), oldAnchorAt,
    kept: new Set(ev.quotes.filter((_, i) => !status[i])),
    oldAt: ev.quotes.map((q) => (oldText ? oldText.indexOf(norm(q), oldFrom) : -1)),
  };
  const item = (quote, why, extra) => {
    const nq = norm(quote);
    const c = oldText ? counterpart(oldText, newText, nq, 500, extra.anchor ? 0 : oldFrom) : null;
    const places = why.why === "missing" ? [] : why.at.slice(0, PLACES).map((at) => place(newText, at, nq.length));
    return {
      page: t.page, quote, evidence: ev, ei: t.ei, slot: t.slot ?? "evidence", newText, norm, pinned: Boolean(t.pinned), oldRef: t.oldRef,
      releases: (ev.at || []).filter((r) => r !== "HEAD"),
      old: c?.old ?? `⟦${quote}⟧`, near: c?.near ?? null, similar: places.length || c?.near ? [] : similarLines(newText, nq),
      why: why.why, count: why.count, places, entry, ...extra,
    };
  };
  const kept = [];
  const broken = [];
  if (anchorBroken) broken.push(item(ev.after, anchorBroken, { anchor: true }));
  ev.quotes.forEach((q, qi) => {
    if (status[qi]) broken.push(item(q, status[qi], { qi }));
    else kept.push({ page: t.page, quote: q });
  });
  return { kept, broken };
}

/** What a broken item's passages are, for the prompt: why it broke, and where it is now. */
function where(b) {
  const out = [`OLD text around it (between ⟦ and ⟧): ${b.old}`];
  if (b.why === "repeated" || (b.why === "not after its anchor" && b.places.length)) {
    out.push(
      b.why === "repeated"
        ? `It still appears in the NEW text, but ${b.count} times${b.count > PLACES ? ` (the first ${PLACES} are shown)` : ""}, so it no longer points at one place: the page now repeats this passage, for example for another OS, model or product. Each place, with the text before it:`
        : `It appears in the NEW text only before its context anchor "${b.evidence.after}", at:`,
    );
    b.places.forEach((p, k) => out.push(`  [${k + 1}] ${p}`));
  } else if (b.near) out.push(`It no longer appears. NEW text at the same place: ${b.near}`);
  else if (b.similar.length) out.push(`It no longer appears, and not at the same place. The NEW text's most similar sentences:\n${b.similar.map((x) => `  ${x}`).join("\n")}`);
  else out.push("It no longer appears. NEW text at the same place: (not found; it may have been removed)");
  return out;
}

/**
 * One request: the claim's (or divergence position's) statement, the quotes that still anchor, and each broken quote
 * with why it broke and its passages.
 */
export function buildPrompt({ id, statement, context }, kept, broken) {
  const lines = context === undefined
    ? [`Claim: ${id}`, `Statement: ${statement}`, ""]
    : [`Divergence position: ${id}`, `What the sources disagree on: ${context}`, `Statement (what this position's source says): ${statement}`, ""];
  lines.push(kept.length ? "Other quotes of this statement, which still appear in their sources and stay as they are:" : "This statement has no other quotes that still appear.");
  for (const k of kept) lines.push(`- (${k.page}) "${k.quote}"`);
  lines.push("", "The statement must stay supported by all of its quotes together: keep every part of it that the other quotes support.", "");
  broken.forEach((b, i) => {
    const what = b.anchor ? "Broken context anchor (the quotes of its evidence entry are looked for after this text)" : "Broken quote";
    lines.push(`${what} ${i + 1} (${b.pinned ? "file" : "page"} ${b.page}): "${b.quote}"`);
    if (b.releases?.length) lines.push(`This evidence is also checked at ${b.releases.join(", ")}, where it still holds; "replace" makes the claim follow the current code instead.`);
    lines.push(...where(b), "");
  });
  const repeated = broken.some((b) => b.places?.length);
  lines.push(
    "For each broken item choose exactly one action:",
    '- "replace": the NEW text says the same thing the old text said. Give "new_quote": an exact copy of a contiguous part of the NEW text, 8 to 320 characters, that states what the old text stated. Copy every character exactly as it appears in the NEW text.',
    '- "replace_and_restate": the NEW text changed something the statement relies on (a name, a value, a list of options, a condition, a behavior). Give "new_quote" as above, and give "statement": the statement with only the words that change rewritten, so it says what all the quotes now support.',
  );
  if (repeated) {
    lines.push(
      '- "anchor": the quote is unchanged but appears in more than one place. Give "after": an exact copy of 8 to 320 characters of the NEW text that appears only once, before the place this statement is about and after any earlier place where the quote appears, usually the heading or first sentence of that place\'s section. Every quote of the same evidence entry is then looked for after it.',
      'A "replace" or "replace_and_restate" whose new quote appears in more than one place gives "after" the same way.',
    );
  }
  lines.push('- "unsupported": the NEW text no longer says what the old text said.');
  if (broken.some((b) => b.pinned)) {
    lines.push('- "old_version": only for a file: the claim is about one version or release (a version number, a dependency pin, a changelog entry, the code as it was in a named release), so it stays true of the old version. The quote stays and the evidence is pinned to the version it was quoted from.');
  }
  const shape = repeated
    ? '{"decisions": [{"quote": 1, "action": "replace", "new_quote": "...", "after": "only when needed", "reason": "one short sentence"}], "statement": "the statement, changed only if an action is replace_and_restate"}'
    : '{"decisions": [{"quote": 1, "action": "replace", "new_quote": "...", "reason": "one short sentence"}], "statement": "the statement, changed only if an action is replace_and_restate"}';
  lines.push("", `Reply with only this JSON: ${shape}`);
  return lines.join("\n");
}

/** Where a would-be copy of the NEW text stops matching it, for a rejected quote's reason. */
export function mismatch(q, text) {
  let lo = 0;
  let hi = q.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (text.includes(q.slice(0, mid))) lo = mid;
    else hi = mid - 1;
  }
  return lo ? `the NEW text has "${q.slice(Math.max(0, lo - 60), lo)}" but not what follows it, "${q.slice(lo, lo + 40)}"` : "no part of it is in the NEW text";
}

const ACTIONS = new Set(["replace", "replace_and_restate", "anchor"]);

/**
 * One decision checked on its own: a known action on a known item, a new quote or anchor of the right length that is
 * an exact copy of the new text, and an anchor that occurs there once. Where a quote lands, and whether the entry
 * still anchors, is checkAll's. A rejected decision carries `detail`, the reason in words, which goes back to the model.
 */
export function checkDecision(decision, broken) {
  const b = broken[decision.quote - 1];
  if (!b) return { ...decision, verdict: "no such quote" };
  const { after: given, ...rest } = decision;
  const base = { ...rest, old: b.quote, qi: b.qi, evidence: b.evidence, ei: b.ei, slot: b.slot, anchor: b.anchor };
  const no = (verdict, detail) => ({ ...base, verdict, ...(detail ? { detail } : {}) });
  if (decision.action === "unsupported") return { ...base, verdict: "unsupported" };
  if (decision.action === "old_version") return b.pinned && b.oldRef ? { ...base, pin: b.oldRef, verdict: "valid" } : no("not a pinned file", '"old_version" is only for a pinned file');
  if (!ACTIONS.has(decision.action) || (decision.action === "anchor" && b.anchor)) return no("unknown action", b.anchor ? 'a broken context anchor is repaired with "replace"' : undefined);
  let after;
  if (given && !b.anchor) {
    after = b.norm(String(given));
    if (after.length < QUOTE_MIN || after.length > QUOTE_MAX) return no("bad anchor length", '"after" must be 8 to 320 characters');
    const at = occurrences(b.newText, after);
    if (!at.length) return no("anchor not in the source", `"after" is not an exact copy of the NEW text: ${mismatch(after, b.newText)}`);
    if (at.length > 1) return no("anchor occurs twice", `"after" occurs ${at.length} times in the NEW text; it must occur once`);
  } else if (decision.action === "anchor") {
    return no("no anchor", 'an "anchor" decision needs "after"');
  }
  if (decision.action === "anchor") return { ...base, after, verdict: "valid" };
  const q = b.norm(decision.new_quote || "");
  if (q.length < QUOTE_MIN || q.length > QUOTE_MAX) return no("bad length", '"new_quote" must be 8 to 320 characters');
  if (!b.newText.includes(q)) return no("not in the source", `"new_quote" is not an exact copy of the NEW text: ${mismatch(q, b.newText)}`);
  return { ...base, new_quote: q, ...(after ? { after } : {}), verdict: "valid" };
}

/** The evidence entry as decisions would leave it: a copy, with their new quotes and their new anchor. */
function outcome(ev, decisions) {
  const copy = { ...ev, quotes: [...ev.quotes] };
  for (const c of decisions) {
    if (c.anchor) copy.after = c.new_quote;
    else if (c.new_quote !== undefined) copy.quotes[c.qi] = c.new_quote;
    if (c.after) copy.after = c.after;
  }
  return copy;
}

/**
 * Settle one evidence entry's decisions. The entry may take one new anchor. As the valid decisions leave it:
 *  - every quote whose place they set (a repaired one, one a moved anchor moved, and a re-anchored anchor) is placed
 *    against its old surroundings (placeOf). One that is "elsewhere" is rejected: its own decision, or, when an
 *    anchor placed it, every decision that gives that anchor, since the anchor is the whole entry's. One whose place is "moved" or "unsure" stays valid with a `review`
 *    reason, for a person to check: the text cannot tell whether it is the right copy;
 *  - every quote that anchors now or is repaired must anchor by the gate's rule; a quote nothing repaired anchored
 *    before, so only a moved anchor can break it, and a repaired quote that fails is its own decision's fault.
 * Each rejection changes the outcome, so this repeats until nothing more is rejected. An entry `old_version` pins
 * takes no other edit.
 */
function settleEntry(E, cs) {
  const reject = (list, verdict, detail) => list.forEach((c) => Object.assign(c, { verdict, detail }));
  const valid = () => cs.filter((c) => c.verdict === "valid");
  if (valid().some((c) => c.action === "old_version")) {
    reject(valid().filter((c) => c.action !== "old_version"), "superseded", "old_version pins the whole evidence entry to the old version");
    return;
  }
  const movers = () => valid().filter((c) => c.anchor || c.after);
  if (new Set(movers().map((c) => (c.anchor ? c.new_quote : c.after))).size > 1) {
    reject(movers(), "conflicting anchors", 'decisions for the same evidence entry move its context anchor to different places; give one "after"');
  }
  const before = resolveEntry(E.newText, E.norm, E.ev).quotes.map((x) => x.at);
  for (let round = 0; round <= cs.length; round++) {
    for (const c of cs) delete c.review;
    const copy = outcome(E.ev, valid());
    const r = resolveEntry(E.newText, E.norm, copy);
    const repairOf = (qi) => valid().find((c) => !c.anchor && c.qi === qi);
    const holds = (qi) => E.kept.has(E.ev.quotes[qi]) || repairOf(qi) !== undefined;
    // Where each quote a decision placed is, against where it was.
    const placed = [];
    const renewed = valid().find((c) => c.anchor);
    if (renewed && E.oldText && E.oldAnchorAt >= 0) {
      const anchorEntry = { ...E, oldAt: [E.oldAnchorAt], ev: { ...E.ev, quotes: [E.ev.after] }, oldPieces: undefined, newPieces: undefined };
      placed.push({ blame: [renewed], ...placeOf(anchorEntry, 0, E.newText.indexOf(renewed.new_quote), renewed.new_quote), q: renewed.new_quote });
    }
    for (const [qi, x] of r.quotes.entries()) {
      const own = repairOf(qi);
      // A broken anchor left the quotes under it resolved from the page's start; once it is repaired, each is placed again.
      if (x.code || !holds(qi) || (!own && !(E.anchorBroken && movers().length) && x.at === before[qi])) continue;
      // A context anchor is the whole entry's: a quote it misplaces makes every decision that gives it wrong.
      const blame = own && !own.after && own.action !== "anchor" ? [own] : movers();
      const q = E.norm(copy.quotes[qi]);
      if (!E.oldText || E.oldAt[qi] < 0) placed.push({ blame, place: "unsure", why: "the old text could not be read, so where the quote was cannot be checked", q });
      else placed.push({ blame, ...placeOf(E, qi, x.at, q), q });
    }
    const wrong = placed.find((x) => x.place === "elsewhere");
    if (wrong) {
      reject(wrong.blame, "another part of the page", `"${wrong.q.slice(0, 60)}": ${wrong.why}`);
      continue;
    }
    for (const x of placed) if (x.place !== "safe") for (const c of x.blame) c.review ??= `"${x.q.slice(0, 60)}": ${x.why}`;
    const failing = r.quotes.map((x, qi) => ({ ...x, qi })).filter((x) => x.code && holds(x.qi));
    if (failing.length) {
      const stranded = failing.filter((x) => !repairOf(x.qi));
      if (stranded.length && movers().length) {
        const list = stranded.map((x) => `"${copy.quotes[x.qi].slice(0, 80)}" (${x.code})`).join(", ");
        reject(movers(), "other quotes not after it", `with that context anchor, these quotes of the same evidence entry no longer anchor: ${list}`);
      } else if (failing.some((x) => repairOf(x.qi))) {
        for (const x of failing) if (repairOf(x.qi)) reject([repairOf(x.qi)], x.code, x.detail);
      } else {
        reject(valid(), "does not anchor", "the evidence entry would not anchor");
        return;
      }
      continue;
    }
    // The gate's own rule is the last word on the quotes that must hold. A broken anchor nothing repaired fails the
    // entry whatever the quotes do, so its error is not the decisions'.
    const held = { ...copy, quotes: copy.quotes.filter((_, qi) => holds(qi)) };
    const errors = anchorIn(E.newText, held, "", { emphasis: !E.pinned }).errors.filter((e) => movers().length || !E.anchorBroken || !/after-anchor/.test(e));
    if (errors.length) reject(valid(), "does not anchor", `the evidence entry would not anchor: ${errors.join("; ")}`);
    return;
  }
}

/**
 * Check a statement's decisions: each on its own, then each evidence entry as they would leave it (settleEntry). A
 * quote number may come as a string; a second decision for the same quote is rejected.
 */
export function checkAll(decisions, broken) {
  const seen = new Set();
  const out = decisions.map((d) => {
    const quote = Number(d.quote);
    if (seen.has(quote)) return { ...d, quote, verdict: "two decisions for one quote", detail: "give one decision per quote" };
    seen.add(quote);
    return checkDecision({ ...d, quote }, broken);
  });
  for (const entry of new Set(broken.map((b) => b.entry))) settleEntry(entry, out.filter((c) => broken[c.quote - 1]?.entry === entry));
  return out;
}

/** The follow-up to a reply some of whose decisions were rejected, or null when every broken item has a usable one. */
export function retryPrompt(checked, broken) {
  const lines = [];
  for (const c of checked) if (c.verdict !== "valid" && c.verdict !== "unsupported") lines.push(`- Item ${c.quote} (${c.action}): ${c.verdict}${c.detail ? `: ${c.detail}` : ""}.`);
  broken.forEach((_, i) => {
    if (!checked.some((c) => c.quote === i + 1)) lines.push(`- Item ${i + 1}: no decision was given.`);
  });
  if (!lines.length) return null;
  return [
    "Some of your decisions could not be used:",
    ...lines,
    "",
    'Reply again with only the JSON, in the same form, with decisions for these items only. If you restate, give the whole statement, with the changes your other decisions made. Use "unsupported" if the NEW text does not say it.',
  ].join("\n");
}

/**
 * The statement a statement's decisions may take, from the replies' `statement` by round. A reply's statement carries
 * every restate of that reply, so it is usable only when all of them were accepted; the latest usable one is taken
 * (a second reply is asked for the whole statement). A valid restate whose statement is not taken is rejected: its new
 * quote needs the statement changed with it.
 */
export function restatement(checked, statements, original) {
  const restates = checked.filter((c) => c.action === "replace_and_restate");
  const usable = (n) => {
    const own = restates.filter((c) => (c.round ?? 1) === n);
    return own.length > 0 && own.every((c) => c.verdict === "valid") && statements[n] && statements[n] !== original;
  };
  const round = [2, 1].find(usable);
  for (const c of restates) {
    if (c.verdict === "valid" && (round === undefined || (c.round ?? 1) > round)) {
      Object.assign(c, { verdict: "no usable statement", detail: "the reply's restated statement went with a change that was rejected, or was missing" });
    }
  }
  return round === undefined ? undefined : statements[round];
}

const SYSTEM =
  "You repair citations in a knowledge base. Each statement rests on verbatim quotes from vendor help pages and pinned vendor files (SDK and provider code, changelogs). The vendor changed a page or a file, so some quotes no longer appear in it, or now appear in more than one place. Decide, for each broken quote, how to repair it using only the NEW text you are given. Reply with JSON only.";

/** Ask the configured OpenAI-compatible endpoint; returns the reply's text and its parsed JSON. */
async function ask(messages) {
  const { KB_MODEL_ENDPOINT: endpoint, KB_MODEL: model, KB_MODEL_API_KEY: key } = process.env;
  const r = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
    body: JSON.stringify({ model, temperature: 0.1, max_tokens: 6000, messages: [{ role: "system", content: SYSTEM }, ...messages] }),
  });
  if (!r.ok) throw new Error(`${endpoint}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  const text = (await r.json()).choices?.[0]?.message?.content ?? "";
  return { text, json: JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) };
}

/**
 * Ask for one statement's decisions, and once more for those the checks rejected. A first-round decision that was
 * valid or unsupported stands; the second round's replace the rest, and all are checked again together.
 */
export async function decide(unit, kept, broken, askModel = ask) {
  const prompt = buildPrompt(unit, kept, broken);
  const first = await askModel([{ role: "user", content: prompt }]);
  const raw = (first.json.decisions || []).map((d) => ({ ...d, round: 1 }));
  let checked = checkAll(raw, broken);
  const statements = { 1: first.json.statement };
  const again = retryPrompt(checked, broken);
  if (again) {
    const second = await askModel([{ role: "user", content: prompt }, { role: "assistant", content: first.text }, { role: "user", content: again }]);
    const stand = raw.filter((_, i) => checked[i].verdict === "valid" || checked[i].verdict === "unsupported");
    const taken = new Set(stand.map((d) => Number(d.quote)));
    const fresh = (second.json.decisions || []).filter((d) => !taken.has(Number(d.quote))).map((d) => ({ ...d, round: 2 }));
    checked = checkAll([...stand, ...fresh], broken);
    statements[2] = second.json.statement;
  }
  return { decisions: checked, statement: restatement(checked, statements, unit.statement), retried: Boolean(again) };
}

const GIT = { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] };
const tryRead = (fn) => {
  try {
    return fn();
  } catch {
    return null;
  }
};

/**
 * An evidence entry's source text before and after: a capture at --base and as committed now; a pinned file at the
 * pin --base recorded and at its pin now, with the release tag (or commit) of the old pin for `old_version`.
 */
function sourceTexts(g, ev, base) {
  const src = g.sources.sources[ev.source];
  if (src.kind === "capture") {
    const file = path.join(src.root, ev.path);
    const text = (json) => plain(captureText(JSON.parse(json).blocks));
    return {
      norm: plain,
      oldText: tryRead(() => text(execFileSync("git", ["-C", g.root, "show", `${base}:${file}`], GIT))),
      newText: tryRead(() => text(fs.readFileSync(path.join(g.root, file), "utf8"))),
    };
  }
  const dir = path.join(g.root, src.root);
  const oldPin = tryRead(() => execFileSync("git", ["-C", g.root, "rev-parse", `${base}:${src.root}`], GIT).trim());
  const show = () => normalizeWs(execFileSync("git", ["-C", dir, "show", `${oldPin}:${ev.path}`], GIT));
  // A shallow or stale submodule clone may lack the old pin; fetch it once.
  const oldText = oldPin ? (tryRead(show) ?? (tryRead(() => execFileSync("git", ["-C", dir, "fetch", "-q", "origin", oldPin], GIT)) !== null ? tryRead(show) : null)) : null;
  const tag = oldPin ? tryRead(() => execFileSync("git", ["-C", dir, "describe", "--tags", "--exact-match", oldPin], GIT).trim()) : null;
  return { norm: normalizeWs, pinned: true, oldRef: tag || oldPin, oldText, newText: tryRead(() => normalizeWs(fs.readFileSync(path.join(dir, ev.path), "utf8"))) };
}

/**
 * The statements with broken quotes in help captures or pinned files: claims, and divergence positions, each with its
 * kept and broken quotes and their passages. A divergence position is a statement of its own (its `says`), with its
 * divergence's summary as context.
 */
export function worklist(g, base, only) {
  const cache = new Map();
  const units = new Map();
  for (const { node, ev } of allEvidence(g)) {
    if ((node.kind !== "claim" && node.kind !== "divergence") || (only && node.id !== only)) continue;
    const position = node.kind === "divergence" ? node.data.positions.findIndex((p) => p.evidence === ev) : undefined;
    const key = position === undefined ? node.id : `${node.id} positions[${position}]`;
    const unit = units.get(key) ?? {
      node, position, label: key, kept: [], broken: [],
      statement: position === undefined ? node.data.statement : node.data.positions[position].says,
      context: position === undefined ? undefined : node.data.summary,
    };
    units.set(key, unit);
    const kind = g.sources.sources[ev.source]?.kind;
    // An entry checked at fixed refs only never breaks on a pin move; one that also lists HEAD breaks at HEAD alone.
    const repairable = (kind === "capture" || kind === "submodule") && ev.quotes && (!ev.at || ev.at.includes("HEAD")) && ev.pointer === undefined;
    if (!repairable || anchorEvidence(g, ev, cache).ok) {
      for (const q of ev.quotes || []) unit.kept.push({ page: ev.path, quote: q });
      continue;
    }
    const t = sourceTexts(g, ev, base);
    if (!t.newText) continue;
    const slot = position === undefined ? "evidence" : "positions";
    const ei = position === undefined ? node.data.evidence.indexOf(ev) : position;
    const { kept, broken } = entryItems(ev, { ...t, page: ev.path, ei, slot });
    unit.kept.push(...kept);
    unit.broken.push(...broken);
  }
  return [...units.values()].filter((u) => u.broken.length);
}

/** The evidence entry a decision is about: a claim's evidence[ei], or a divergence's positions[ei].evidence. */
const entryOf = (node, d) => (d.slot === "positions" ? node.data.positions?.[d.ei]?.evidence : node.data.evidence?.[d.ei]);

/**
 * A reviewed run's decisions, re-attached to the statements they are about so they can be applied without asking the
 * model again. A decision whose old quote (or anchor) is no longer in its evidence entry is dropped and named.
 */
export function replay(g, results) {
  const out = [];
  for (const r of results) {
    const node = g.nodes.get(r.id);
    if (!node) {
      out.push({ ...r, decisions: [], error: "no such claim" });
      continue;
    }
    const decisions = r.decisions.map((d) => {
      const evidence = entryOf(node, d);
      const present = evidence && (d.anchor ? evidence.after === d.old : evidence.quotes?.includes(d.old));
      return present ? { ...d, evidence } : { ...d, verdict: d.verdict === "valid" ? "stale" : d.verdict };
    });
    out.push({ ...r, node, decisions });
  }
  return out;
}

/**
 * Apply a statement's valid decisions to its evidence. An `old_version` pins the whole entry and wins over its other
 * edits: an entry checked at releases and HEAD keeps its releases, any other is pinned to the old pin's release or
 * commit. A replaced quote or a new anchor follows the current pin, so the entry's release refs come off.
 */
export function applyDecisions(decisions) {
  const pinned = new Set();
  for (const d of decisions) {
    if (d.verdict !== "valid" || d.action !== "old_version" || pinned.has(d.evidence)) continue;
    const releases = (d.evidence.at || []).filter((r) => r !== "HEAD");
    d.evidence.at = releases.length ? releases : [d.pin];
    pinned.add(d.evidence);
  }
  for (const d of decisions) {
    if (d.verdict !== "valid" || d.action === "old_version" || pinned.has(d.evidence)) continue;
    if (d.anchor) d.evidence.after = d.new_quote;
    else if (d.action !== "anchor") d.evidence.quotes[d.evidence.quotes.indexOf(d.old)] = d.new_quote;
    if (d.after) d.evidence.after = d.after;
    delete d.evidence.at;
  }
}

/** Apply one result to its node: the decisions to the evidence, and a restated statement to the claim or position. */
export function applyResult(node, r) {
  applyDecisions(r.decisions);
  if (r.restated && r.position === undefined) node.data.statement = r.restated;
  else if (r.restated) node.data.positions[r.position].says = r.restated;
}

/** A result's statement label: the claim, or the divergence position. */
const labelOf = (r) => (r.position === undefined ? r.id : `${r.id} positions[${r.position}]`);

export function reportMarkdown(results) {
  const n = (v) => results.flatMap((r) => r.decisions).filter((d) => d.verdict === v).length;
  const review = results.flatMap((r) => r.decisions).filter((d) => d.verdict === "valid" && d.review).length;
  const out = [`## Re-anchored quotes`, "", `${results.length} statement(s): ${n("valid")} quote(s) re-anchored, ${review} of them to check, ${n("unsupported")} no longer supported by their source, ${results.flatMap((r) => r.decisions).length - n("valid") - n("unsupported")} rejected.`, ""];
  if (review) out.push("A re-anchored quote to check is marked **check**: its place on the page could not be confirmed from the text, so read it against its statement and the page's headings.", "");
  for (const r of results) {
    out.push(`### \`${labelOf(r)}\``, "");
    if (r.retried) out.push("Asked twice: the first reply had decisions the checks rejected.", "");
    for (const d of r.decisions) {
      out.push(`- **${d.action}** (${d.verdict}${d.verdict === "valid" && d.review ? ", **check**" : ""}): ${d.reason ?? ""}`, `  - was: "${d.old}"`);
      if (d.verdict === "valid" && d.action === "old_version") out.push(`  - kept, with the evidence pinned to ${d.pin}`);
      else if (d.verdict === "valid" && d.action === "anchor") out.push(`  - kept, now after: "${d.after}"`);
      else if (d.verdict === "valid" && d.anchor) out.push(`  - context anchor now: "${d.new_quote}"`);
      else if (d.verdict === "valid") out.push(`  - now: "${d.new_quote}"`, ...(d.after ? [`  - after: "${d.after}"`] : []));
      else if (d.detail) out.push(`  - why: ${d.detail}`);
      if (d.verdict === "valid" && d.review) out.push(`  - check: ${d.review}`);
    }
    if (r.restated) out.push("", `Statement was: ${r.statement}`, "", `Statement now: ${r.restated}`);
    if (r.error) out.push(`- error: ${r.error}`);
    out.push("");
  }
  return out.join("\n");
}

/** A run's results as --json writes them: without the evidence objects, which --apply finds again. */
export const resultsJson = (results) => results.map(({ decisions, ...r }) => ({ ...r, decisions: decisions.map(({ evidence, ...d }) => d) }));

async function main(argv) {
  const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
  const base = opt("--base");
  const apply = opt("--apply");
  if (!apply && (!base || !process.env.KB_MODEL_ENDPOINT || !process.env.KB_MODEL)) {
    console.error(
      "usage: KB_MODEL_ENDPOINT=<url> KB_MODEL=<id> node scripts/kb-reanchor.mjs --base <ref> [--only <claim-id>] [--write] [--report <file.md>] [--json <file>]\n" +
        "       node scripts/kb-reanchor.mjs --apply <file.json>   apply a reviewed run's --json decisions, without the model",
    );
    return 2;
  }
  const g = buildGraph(loadPublic(ROOT));
  const write = apply !== undefined || argv.includes("--write");
  const results = [];
  const touched = new Set();
  const settle = (r, node) => {
    results.push(r);
    process.stderr.write(`${labelOf(r)}: ${r.error ?? r.decisions.map((d) => `${d.action}/${d.verdict}${d.review ? " (check)" : ""}`).join(", ")}${r.retried ? " (asked twice)" : ""}\n`);
    if (!write || !node) return;
    applyResult(node, r);
    if (r.decisions.some((d) => d.verdict === "valid")) touched.add(node.file);
  };
  if (apply) {
    for (const { node, ...r } of replay(g, JSON.parse(fs.readFileSync(apply, "utf8")))) settle(r, node);
  } else {
    for (const unit of worklist(g, base, opt("--only"))) {
      const { node, position, statement, kept, broken } = unit;
      const r = { id: node.id, ...(position === undefined ? {} : { position }), statement, decisions: [] };
      try {
        const d = await decide({ id: unit.label, statement, context: unit.context }, kept, broken);
        r.decisions = d.decisions;
        r.retried = d.retried;
        if (d.statement !== undefined) r.restated = d.statement;
      } catch (e) {
        r.error = String(e.message ?? e);
      }
      settle(r, node);
    }
  }
  for (const { file, data } of g.files.subjects) if (touched.has(file)) fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(data, null, 2)}\n`);
  if (opt("--report")) fs.writeFileSync(opt("--report"), `${reportMarkdown(results)}\n`);
  if (opt("--json")) fs.writeFileSync(opt("--json"), `${JSON.stringify(resultsJson(results), null, 2)}\n`);
  const subjects = [...new Set(results.filter((r) => touched.has(g.nodes.get(r.id)?.file)).map((r) => r.id.split(":")[0]))];
  if (subjects.length) {
    // An edited statement or a new gap can change a spine, and fewer failing citations change the record.
    const run = (args, ok = [0]) => {
      const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
      if (!ok.includes(r.status)) throw new Error(`node ${args.join(" ")} exited ${r.status}`);
    };
    run(["scripts/gen-spine.mjs"]);
    run(["scripts/kb.mjs", "verified"], [0, 1]);
    spawnSync(process.execPath, ["scripts/kb.mjs", "check", ...subjects], { cwd: ROOT, stdio: "inherit" });
  }
  const all = results.flatMap((r) => r.decisions);
  console.log(JSON.stringify({ claims: results.length, valid: all.filter((d) => d.verdict === "valid").length, review: all.filter((d) => d.verdict === "valid" && d.review).length, unsupported: all.filter((d) => d.verdict === "unsupported").length, rejected: all.filter((d) => !["valid", "unsupported"].includes(d.verdict)).length, errors: results.filter((r) => r.error).length, retried: results.filter((r) => r.retried).length, subjects }));
  return 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
