#!/usr/bin/env node
// scripts/kb-reanchor.mjs — repair claim quotes that a reworded help page broke, with a model as a narrow judge.
//
// `kb.mjs requote` repairs what changed only by spacing. What is left is a page the vendor reworded. For every claim
// whose capture quotes no longer anchor, this finds each broken quote's passage in the page as it was at --base
// and the same part of the page now (or, when that part is gone, the most similar passage anywhere in it), and asks
// the model for one decision per broken quote:
//   replace              the new text says the same thing: a new quote, copied from the new text
//   replace_and_restate  the new text changed something the statement relies on: a new quote and a restated claim
//   unsupported          the page no longer says it: left broken, for a person (or a gap)
// The model sees the claim's statement, its other quotes and the two passages; it never edits a file. Every new
// quote must occur exactly once in the new text, and a restated statement is taken only with a valid restate
// decision. With --write the decisions are applied, the spines and verified.json are regenerated, and `kb.mjs check`
// runs on the subjects they touched. The claim audit is still the check of what a restated statement says. A quote
// the page no longer supports is left broken: turn its claim into a gap, or restate it from what the page now says.
//
// The model is any OpenAI-compatible chat endpoint: KB_MODEL_ENDPOINT (base URL, for example
// http://localhost:8080/v1 for a local server or https://openrouter.ai/api/v1), KB_MODEL (its model ID) and, if it needs one,
// KB_MODEL_API_KEY.
//
// Usage: node scripts/kb-reanchor.mjs --base <ref> [--only <claim-id>] [--write] [--report <file.md>] [--json <file>]
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
  lines.push(kept.length ? "Other quotes of this claim, which still appear in their pages and stay as they are:" : "This claim has no other quotes that still appear.");
  for (const k of kept) lines.push(`- (${k.page}) "${k.quote}"`);
  lines.push("", "The statement must stay supported by all of the claim's quotes together: keep every part of it that the other quotes support.", "");
  broken.forEach((b, i) => {
    lines.push(`Broken quote ${i + 1} (page ${b.page}): "${b.quote}"`);
    lines.push(`OLD page text around it (the quote is between ⟦ and ⟧): ${b.old}`);
    if (b.near) lines.push(`NEW page text at the same place: ${b.near}`);
    else if (b.similar.length) lines.push(`The passage is no longer at the same place. The NEW page's most similar lines:\n${b.similar.map((s) => `  ${s}`).join("\n")}`);
    else lines.push("NEW page text at the same place: (not found; the passage may have been removed)");
    lines.push("");
  });
  lines.push(
    "For each broken quote choose exactly one action:",
    '- "replace": the NEW text says the same thing the old quote said. Give "new_quote": an exact copy of a contiguous part of the NEW text, 8 to 320 characters, that states what the old quote stated. Copy every character exactly as it appears in the NEW text.',
    '- "replace_and_restate": the NEW text changed something the statement relies on (a name, a value, a list of options, a condition). Give "new_quote" as above, and give "statement": the statement with only the words that change rewritten, so it says what all the quotes now support.',
    '- "unsupported": the NEW text no longer says what the old quote said.',
    "",
    'Reply with only this JSON: {"decisions": [{"quote": 1, "action": "replace", "new_quote": "...", "reason": "one short sentence"}], "statement": "the statement, changed only if an action is replace_and_restate"}',
  );
  return lines.join("\n");
}

/** A decision checked against the page it quotes: `valid` only for a new quote that occurs exactly once there. */
export function checkDecision(decision, broken) {
  const b = broken[decision.quote - 1];
  if (!b) return { ...decision, verdict: "no such quote" };
  if (decision.action === "unsupported") return { ...decision, old: b.quote, verdict: "unsupported" };
  if (decision.action !== "replace" && decision.action !== "replace_and_restate") return { ...decision, old: b.quote, verdict: "unknown action" };
  const q = plain(decision.new_quote || "");
  const first = b.newText.indexOf(q);
  if (q.length < QUOTE_MIN || q.length > QUOTE_MAX) return { ...decision, old: b.quote, verdict: "bad length" };
  if (first === -1) return { ...decision, old: b.quote, verdict: "not in the page" };
  if (b.newText.indexOf(q, first + 1) !== -1) return { ...decision, old: b.quote, verdict: "occurs twice" };
  return { ...decision, new_quote: q, old: b.quote, evidence: b.evidence, verdict: "valid" };
}

const SYSTEM =
  "You repair citations in a knowledge base. Each claim's statement rests on verbatim quotes from vendor help pages. The vendor edited a page, so some quotes no longer appear in it. Decide, for each broken quote, how to repair it using only the NEW page text you are given. Reply with JSON only.";

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

function pageText(g, ev, ref) {
  const src = g.sources.sources[ev.source];
  const file = path.join(src.root, ev.path);
  try {
    const json = ref ? execFileSync("git", ["-C", g.root, "show", `${ref}:${file}`], { encoding: "utf8", maxBuffer: 1 << 28 }) : fs.readFileSync(path.join(g.root, file), "utf8");
    return plain(captureText(JSON.parse(json).blocks));
  } catch {
    return null;
  }
}

/** The claims with broken capture quotes: for each, its kept and broken quotes with the passages a model needs. */
export function worklist(g, base, only) {
  const cache = new Map();
  const claims = new Map();
  for (const { node, ev } of allEvidence(g)) {
    if (node.kind !== "claim" || (only && node.id !== only)) continue;
    const src = g.sources.sources[ev.source];
    const entry = claims.get(node.id) ?? { node, kept: [], broken: [] };
    const capture = src?.kind === "capture" && ev.quotes && !ev.at;
    if (!capture || anchorEvidence(g, ev, cache).ok) {
      for (const q of ev.quotes || []) entry.kept.push({ page: ev.path, quote: q });
      claims.set(node.id, entry);
      continue;
    }
    const newText = pageText(g, ev);
    const oldText = pageText(g, ev, base);
    for (const q of ev.quotes) {
      if (newText?.includes(plain(q))) { entry.kept.push({ page: ev.path, quote: q }); continue; }
      const c = oldText && newText ? counterpart(oldText, newText, plain(q)) : null;
      entry.broken.push({
        page: ev.path, quote: q, evidence: ev, newText: newText ?? "",
        old: c?.old ?? `⟦${q}⟧`, near: c?.near ?? null, similar: c?.near || !newText ? [] : similarLines(newText, plain(q)),
      });
    }
    claims.set(node.id, entry);
  }
  return [...claims.values()].filter((c) => c.broken.length);
}

export function reportMarkdown(results) {
  const n = (v) => results.flatMap((r) => r.decisions).filter((d) => d.verdict === v).length;
  const out = [`## Re-anchored quotes`, "", `${results.length} claim(s): ${n("valid")} quote(s) re-anchored, ${n("unsupported")} no longer supported by their page, ${results.flatMap((r) => r.decisions).length - n("valid") - n("unsupported")} rejected.`, ""];
  for (const r of results) {
    out.push(`### \`${r.id}\``, "");
    for (const d of r.decisions) {
      out.push(`- **${d.action}** (${d.verdict}): ${d.reason ?? ""}`, `  - was: "${d.old}"`);
      if (d.verdict === "valid") out.push(`  - now: "${d.new_quote}"`);
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
  if (!base || !process.env.KB_MODEL_ENDPOINT || !process.env.KB_MODEL) {
    console.error("usage: KB_MODEL_ENDPOINT=<url> KB_MODEL=<id> node scripts/kb-reanchor.mjs --base <ref> [--only <claim-id>] [--write] [--report <file.md>] [--json <file>]");
    return 2;
  }
  const g = buildGraph(loadPublic(ROOT));
  const results = [];
  const touched = new Set();
  for (const { node, kept, broken } of worklist(g, base, opt("--only"))) {
    const r = { id: node.id, statement: node.data.statement, decisions: [] };
    try {
      const reply = await ask(buildPrompt({ id: node.id, statement: node.data.statement }, kept, broken));
      r.decisions = (reply.decisions || []).map((d) => checkDecision(d, broken));
      const restate = r.decisions.some((d) => d.action === "replace_and_restate" && d.verdict === "valid");
      if (restate && reply.statement && reply.statement !== node.data.statement) r.restated = reply.statement;
    } catch (e) {
      r.error = String(e.message ?? e);
    }
    results.push(r);
    process.stderr.write(`${node.id}: ${r.error ?? r.decisions.map((d) => `${d.action}/${d.verdict}`).join(", ")}\n`);
    if (argv.includes("--write")) {
      for (const d of r.decisions) if (d.verdict === "valid") d.evidence.quotes[d.evidence.quotes.indexOf(d.old)] = d.new_quote;
      if (r.restated) node.data.statement = r.restated;
      if (r.decisions.some((d) => d.verdict === "valid")) touched.add(node.file);
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
    run(["scripts/kb.mjs", "verified"], [0, 1]);
    spawnSync(process.execPath, ["scripts/kb.mjs", "check", ...subjects], { cwd: ROOT, stdio: "inherit" });
  }
  const all = results.flatMap((r) => r.decisions);
  console.log(JSON.stringify({ claims: results.length, valid: all.filter((d) => d.verdict === "valid").length, unsupported: all.filter((d) => d.verdict === "unsupported").length, rejected: all.filter((d) => !["valid", "unsupported"].includes(d.verdict)).length, errors: results.filter((r) => r.error).length, subjects }));
  return 0;
}

if (import.meta.main) process.exitCode = await main(process.argv.slice(2));
