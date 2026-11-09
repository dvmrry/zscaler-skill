#!/usr/bin/env node
// scripts/kb-reanchor.mjs — repair claim quotes that a reworded help page or a moved vendor pin broke, with a
// model as a narrow judge.
//
// `kb.mjs requote` repairs what changed only by spacing. What is left is a page the vendor reworded, or vendor code
// that changed at a new pin. For every claim whose quotes in a help capture or a pinned file no longer anchor, this
// finds each broken quote's passage as it was at --base (the capture then, or the file at the pin --base recorded)
// and the same part of the source now (or, when that part is gone, its most similar lines), and asks the model for
// one decision per broken quote:
//   replace              the new text says the same thing: a new quote, copied from the new text
//   replace_and_restate  the new text changed something the statement relies on: a new quote and a restated claim
//   old_version          (a pinned file) the claim is about one version, so the evidence is pinned to the old one
//   unsupported          the source no longer says it: left broken, for a person (or a gap)
// A broken `after` context anchor is re-anchored the same way. The model sees the claim's statement, its other
// quotes and the passages; it never edits a file. A new quote must occur exactly once in the new text (after its
// anchor, when it has one), and a restated statement is taken only with a valid restate decision. With --write the
// decisions are applied, the spines and verified.json are regenerated, and `kb.mjs check` runs on the subjects they
// touched. The claim audit is still the check of what a restated statement says. A quote the source no longer
// supports is left broken: turn its claim into a gap, or restate it from what the source now says.
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
import { allEvidence, anchorEvidence, buildGraph, captureText, loadPublic, normalizeWs } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUOTE_MIN = 8;
const QUOTE_MAX = 320;

/** Anchoring text as quotes match it: whitespace normalized, bold markers dropped. */
export const plain = (s) => normalizeWs(s.replaceAll("**", ""));
const tokens = (s) => [...s.matchAll(/\S+/g)].map((x) => ({ w: x[0], at: x.index, end: x.index + x[0].length }));

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
 * Where `quote` (found in `oldText`) went in `newText`: the old passage with the quote marked, and the new text
 * around the words of it that survive in place. `near` is null when none survive near the old position.
 */
export function counterpart(oldText, newText, quote, context = 500) {
  const at = oldText.indexOf(quote);
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

/** The `n` lines of `newText` most like `quote`, for a passage that moved away from where it was. */
export function similarLines(newText, quote, n = 2) {
  return newText
    .split("\n")
    .map((line) => ({ line, score: overlap(quote, line) }))
    .filter((x) => x.score >= 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.line);
}

/** One claim's request: its statement, the quotes that still anchor, and each broken quote with its two passages. */
export function buildPrompt({ id, statement }, kept, broken) {
  const lines = [`Claim: ${id}`, `Statement: ${statement}`, ""];
  lines.push(kept.length ? "Other quotes of this claim, which still appear in their sources and stay as they are:" : "This claim has no other quotes that still appear.");
  for (const k of kept) lines.push(`- (${k.page}) "${k.quote}"`);
  lines.push("", "The statement must stay supported by all of the claim's quotes together: keep every part of it that the other quotes support.", "");
  broken.forEach((b, i) => {
    const what = b.anchor ? "Broken context anchor (the quotes after it are found after this text)" : "Broken quote";
    lines.push(`${what} ${i + 1} (${b.pinned ? "file" : "page"} ${b.page}): "${b.quote}"`);
    if (b.releases?.length) lines.push(`This evidence is also checked at ${b.releases.join(", ")}, where it still holds; "replace" makes the claim follow the current code instead.`);
    lines.push(`OLD text around it (between ⟦ and ⟧): ${b.old}`);
    if (b.near) lines.push(`NEW text at the same place: ${b.near}`);
    else if (b.similar.length) lines.push(`It is no longer at the same place. The NEW text's most similar lines:\n${b.similar.map((x) => `  ${x}`).join("\n")}`);
    else lines.push("NEW text at the same place: (not found; it may have been removed)");
    lines.push("");
  });
  lines.push(
    "For each broken item choose exactly one action:",
    '- "replace": the NEW text says the same thing the old text said. Give "new_quote": an exact copy of a contiguous part of the NEW text, 8 to 320 characters, that states what the old text stated. Copy every character exactly as it appears in the NEW text.',
    '- "replace_and_restate": the NEW text changed something the statement relies on (a name, a value, a list of options, a condition, a behavior). Give "new_quote" as above, and give "statement": the statement with only the words that change rewritten, so it says what all the quotes now support.',
    '- "unsupported": the NEW text no longer says what the old text said.',
  );
  if (broken.some((b) => b.pinned)) {
    lines.push('- "old_version": only for a file: the claim is about one version or release (a version number, a dependency pin, a changelog entry, the code as it was in a named release), so it stays true of the old version. The quote stays and the evidence is pinned to the version it was quoted from.');
  }
  lines.push("", 'Reply with only this JSON: {"decisions": [{"quote": 1, "action": "replace", "new_quote": "...", "reason": "one short sentence"}], "statement": "the statement, changed only if an action is replace_and_restate"}');
  return lines.join("\n");
}

/**
 * A decision checked against the source it quotes. A new context anchor must occur once in the new text; a new
 * quote under an anchor must occur after it (`from`, the anchor's end); any other new quote must occur exactly once.
 * `old_version` is valid only for a pinned file.
 */
export function checkDecision(decision, broken, from = new Map()) {
  const b = broken[decision.quote - 1];
  if (!b) return { ...decision, verdict: "no such quote" };
  const base = { ...decision, old: b.quote, evidence: b.evidence, ei: b.ei, anchor: b.anchor };
  if (decision.action === "unsupported") return { ...base, verdict: "unsupported" };
  if (decision.action === "old_version") return { ...base, pin: b.oldRef, verdict: b.pinned && b.oldRef ? "valid" : "not a pinned file" };
  if (decision.action !== "replace" && decision.action !== "replace_and_restate") return { ...base, verdict: "unknown action" };
  const q = b.norm(decision.new_quote || "");
  if (q.length < QUOTE_MIN || q.length > QUOTE_MAX) return { ...base, verdict: "bad length" };
  const scoped = !b.anchor && b.evidence.after !== undefined;
  const start = scoped ? (from.get(b.evidence) ?? b.from ?? 0) : 0;
  const first = b.newText.indexOf(q, start);
  if (first === -1) return { ...base, verdict: scoped ? "not after its anchor" : "not in the source" };
  if (!scoped && b.newText.indexOf(q, first + 1) !== -1) return { ...base, verdict: "occurs twice" };
  return { ...base, new_quote: q, verdict: "valid" };
}

/** Check a claim's decisions: anchors first, so quotes under a re-anchored context are checked after its new place. */
export function checkAll(decisions, broken) {
  const from = new Map();
  const out = [];
  for (const d of decisions.filter((x) => broken[x.quote - 1]?.anchor)) {
    const c = checkDecision(d, broken);
    if (c.verdict === "valid" && c.new_quote) from.set(c.evidence, broken[d.quote - 1].newText.indexOf(c.new_quote) + c.new_quote.length);
    out.push(c);
  }
  for (const d of decisions.filter((x) => !broken[x.quote - 1]?.anchor)) out.push(checkDecision(d, broken, from));
  return decisions.map((d) => out.find((c) => c.quote === d.quote && c.action === d.action) ?? checkDecision(d, broken, from));
}

const SYSTEM =
  "You repair citations in a knowledge base. Each claim's statement rests on verbatim quotes from vendor help pages and pinned vendor files (SDK and provider code, changelogs). The vendor changed a page or a file, so some quotes no longer appear in it. Decide, for each broken quote, how to repair it using only the NEW text you are given. Reply with JSON only.";

/** Ask the configured OpenAI-compatible endpoint; returns the parsed JSON reply. */
async function ask(content) {
  const { KB_MODEL_ENDPOINT: endpoint, KB_MODEL: model, KB_MODEL_API_KEY: key } = process.env;
  const r = await fetch(`${endpoint.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
    body: JSON.stringify({ model, temperature: 0.1, max_tokens: 6000, messages: [{ role: "system", content: SYSTEM }, { role: "user", content }] }),
  });
  if (!r.ok) throw new Error(`${endpoint}: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  const text = (await r.json()).choices?.[0]?.message?.content ?? "";
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
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

/** The claims with broken quotes in help captures or pinned files: for each, its kept and broken quotes with their passages. */
export function worklist(g, base, only) {
  const cache = new Map();
  const claims = new Map();
  for (const { node, ev } of allEvidence(g)) {
    if (node.kind !== "claim" || (only && node.id !== only)) continue;
    const kind = g.sources.sources[ev.source]?.kind;
    const entry = claims.get(node.id) ?? { node, kept: [], broken: [] };
    claims.set(node.id, entry);
    // An entry checked at fixed refs only never breaks on a pin move; one that also lists HEAD breaks at HEAD alone.
    const repairable = (kind === "capture" || kind === "submodule") && ev.quotes && (!ev.at || ev.at.includes("HEAD")) && ev.pointer === undefined;
    if (!repairable || anchorEvidence(g, ev, cache).ok) {
      for (const q of ev.quotes || []) entry.kept.push({ page: ev.path, quote: q });
      continue;
    }
    const t = sourceTexts(g, ev, base);
    if (!t.newText) continue;
    const item = (quote, extra) => {
      const c = t.oldText ? counterpart(t.oldText, t.newText, t.norm(quote)) : null;
      return {
        page: ev.path, quote, evidence: ev, ei: node.data.evidence.indexOf(ev), newText: t.newText, norm: t.norm, pinned: Boolean(t.pinned), oldRef: t.oldRef,
        releases: (ev.at || []).filter((r) => r !== "HEAD"),
        old: c?.old ?? `⟦${quote}⟧`, near: c?.near ?? null, similar: c?.near ? [] : similarLines(t.newText, t.norm(quote)), ...extra,
      };
    };
    // The context anchor, when an entry has one: quotes are looked for after it.
    let from = 0;
    if (ev.after !== undefined) {
      const a = t.norm(ev.after);
      const at = t.newText.indexOf(a);
      if (at === -1 || t.newText.indexOf(a, at + 1) !== -1) entry.broken.push(item(ev.after, { anchor: true }));
      else from = at + a.length;
    }
    for (const q of ev.quotes) {
      const nq = t.norm(q);
      const first = t.newText.indexOf(nq, from);
      const ok = first !== -1 && (ev.after !== undefined || t.newText.indexOf(nq, first + 1) === -1);
      if (ok) entry.kept.push({ page: ev.path, quote: q });
      else entry.broken.push(item(q, { from }));
    }
  }
  return [...claims.values()].filter((c) => c.broken.length);
}

/**
 * A reviewed run's decisions, re-attached to the claims they are about so they can be applied without asking the model
 * again. A decision whose old quote (or anchor) is no longer in its evidence entry is dropped and named.
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
      const evidence = node.data.evidence?.[d.ei];
      const present = evidence && (d.anchor ? evidence.after === d.old : evidence.quotes?.includes(d.old));
      return present ? { ...d, evidence } : { ...d, verdict: d.verdict === "valid" ? "stale" : d.verdict };
    });
    out.push({ ...r, node, decisions });
  }
  return out;
}

/**
 * Apply a claim's valid decisions to its evidence. An `old_version` pins the whole entry and wins over its other edits:
 * an entry checked at releases and HEAD keeps its releases, any other is pinned to the old pin's release or commit.
 * A replaced quote follows the current pin, so the entry's release refs come off.
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
    else d.evidence.quotes[d.evidence.quotes.indexOf(d.old)] = d.new_quote;
    delete d.evidence.at;
  }
}

export function reportMarkdown(results) {
  const n = (v) => results.flatMap((r) => r.decisions).filter((d) => d.verdict === v).length;
  const out = [`## Re-anchored quotes`, "", `${results.length} claim(s): ${n("valid")} quote(s) re-anchored, ${n("unsupported")} no longer supported by their source, ${results.flatMap((r) => r.decisions).length - n("valid") - n("unsupported")} rejected.`, ""];
  for (const r of results) {
    out.push(`### \`${r.id}\``, "");
    for (const d of r.decisions) {
      out.push(`- **${d.action}** (${d.verdict}): ${d.reason ?? ""}`, `  - was: "${d.old}"`);
      if (d.verdict === "valid") out.push(d.action === "old_version" ? `  - kept, with the evidence pinned to ${d.pin}` : `  - now: "${d.new_quote}"`);
    }
    if (r.restated) out.push("", `Statement was: ${r.statement}`, "", `Statement now: ${r.restated}`);
    if (r.error) out.push(`- error: ${r.error}`);
    out.push("");
  }
  return out.join("\n");
}

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
    process.stderr.write(`${r.id}: ${r.error ?? r.decisions.map((d) => `${d.action}/${d.verdict}`).join(", ")}\n`);
    if (!write || !node) return;
    applyDecisions(r.decisions);
    if (r.restated) node.data.statement = r.restated;
    if (r.decisions.some((d) => d.verdict === "valid")) touched.add(node.file);
  };
  if (apply) {
    for (const { node, ...r } of replay(g, JSON.parse(fs.readFileSync(apply, "utf8")))) settle(r, node);
  } else {
    for (const { node, kept, broken } of worklist(g, base, opt("--only"))) {
      const r = { id: node.id, statement: node.data.statement, decisions: [] };
      try {
        const reply = await ask(buildPrompt({ id: node.id, statement: node.data.statement }, kept, broken));
        r.decisions = checkAll(reply.decisions || [], broken);
        const restate = r.decisions.some((d) => d.action === "replace_and_restate" && d.verdict === "valid");
        if (restate && reply.statement && reply.statement !== node.data.statement) r.restated = reply.statement;
      } catch (e) {
        r.error = String(e.message ?? e);
      }
      settle(r, node);
    }
  }
  for (const { file, data } of g.files.subjects) if (touched.has(file)) fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(data, null, 2)}\n`);
  if (opt("--report")) fs.writeFileSync(opt("--report"), `${reportMarkdown(results)}\n`);
  if (opt("--json")) fs.writeFileSync(opt("--json"), `${JSON.stringify(results.map(({ decisions, ...r }) => ({ ...r, decisions: decisions.map(({ evidence, ...d }) => d) })), null, 2)}\n`);
  const subjects = [...new Set(results.filter((r) => touched.has(g.nodes.get(r.id).file)).map((r) => r.id.split(":")[0]))];
  if (subjects.length) {
    // An edited statement or a new gap can change a spine, and fewer failing citations change the record.
    const run = (args, ok = [0]) => {
      const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
      if (!ok.includes(r.status)) throw new Error(`node ${args.join(" ")} exited ${r.status}`);
    };
    run(["scripts/gen-spine.mjs"]);
    run(["scripts/gen-text.mjs"]);
    run(["scripts/kb.mjs", "verified"], [0, 1]);
    spawnSync(process.execPath, ["scripts/kb.mjs", "check", ...subjects], { cwd: ROOT, stdio: "inherit" });
  }
  const all = results.flatMap((r) => r.decisions);
  console.log(JSON.stringify({ claims: results.length, valid: all.filter((d) => d.verdict === "valid").length, unsupported: all.filter((d) => d.verdict === "unsupported").length, rejected: all.filter((d) => !["valid", "unsupported"].includes(d.verdict)).length, errors: results.filter((r) => r.error).length, subjects }));
  return 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
