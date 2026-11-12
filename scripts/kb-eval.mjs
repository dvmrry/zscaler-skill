#!/usr/bin/env node
// kb-eval.mjs — the retrieval eval: does an agent that follows SKILL.md reach and state the facts a question needs?
//
// Each question in a question set lists its gold facts, each held by one claim. The sets are
// references/_meta/evals/facts.json (the default, worded as the graph words it) and facts-<name>.json, chosen with
// --set <name> (`users`: worded as people ask). --entry names the file the agent is told to start from: SKILL.md (the
// default, the Claude Code route) or `devin`, .devin/rules/zscaler.md (the route Devin takes, which never loads
// SKILL.md). Like the ref, the entry is what an eval compares, so it is recorded but does not break comparability. A run answers
// every question as a headless Claude Code session in a worktree of the ref under test; `judge` asks a model
// whether each answer states each fact; `report` prints, per rep: facts stated, holders reached (the holder
// claim's ID entered the context), context size, shell calls a corporate runtime would stop to approve (anything
// but read-only search), and all shell calls (a runtime with no allowlist stops at every one). Rep-to-rep noise is
// several points, so run 3 reps and read a gap under about 5 points as no change.
//
// Results are comparable only under the same harness: `run` records the Claude Code version, model, effort and the
// prompt and question hashes in <out>/meta.json, refuses to add runs to a directory recorded under different ones,
// and `report` refuses to compare such directories. --model names the model where a provider needs its own ID for
// it (the judge uses the same). It needs the `claude` CLI and spends model quota, so it runs
// by hand, never in CI. Write results outside the checkout.
//
// Usage:
//   node scripts/kb-eval.mjs run --ref <git ref> --out <dir> [--set <name>] [--entry devin] [--model <id>] [--reps 3] [--jobs 4] [--only q1,q2]
//   node scripts/kb-eval.mjs judge --out <dir> [--jobs 4]
//   node scripts/kb-eval.mjs report <dir> [<dir> ...] [--allow-mismatch]
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVALS = path.join(ROOT, "references/_meta/evals");
/** A question set's file: facts.json by default, facts-<name>.json for a named set. */
export function setFile(name) {
  if (name !== undefined && !/^[a-z0-9-]+$/.test(name)) throw new Error(`bad question set name: ${name}`);
  return path.join(EVALS, name ? `facts-${name}.json` : "facts.json");
}
/** Every question set file. */
export const setFiles = () => fs.readdirSync(EVALS).filter((f) => /^facts(-[a-z0-9-]+)?\.json$/.test(f)).map((f) => path.join(EVALS, f));
export const MODEL = "claude-haiku-5-5";
export const EFFORT = "high";
// What a corporate runtime typically allows without asking (its file read and search tools, read-only search
// commands), plus the KB CLI the skill runs.
const TOOLS = ["Read", "Grep", "Glob", "Bash(rg *)", "Bash(grep *)", "Bash(find *)", "Bash(ls *)", "Bash(node scripts/kb.mjs *)"];
export const PROMPT = `A colleague asks you this about Zscaler. Answer it the way this repository's SKILL.md says to: read SKILL.md first,
retrieve what you need from the knowledge base, then answer for the colleague. Do not answer from memory.

{turn}`;
// The file each entry starts the agent from; the prompt differs only in that name, so prompt_sha stays the template's.
export const ENTRIES = { skill: "SKILL.md", devin: ".devin/rules/zscaler.md" };
export function promptFor(entry = "skill") {
  if (!ENTRIES[entry]) throw new Error(`bad entry: ${entry} (one of ${Object.keys(ENTRIES).join(", ")})`);
  return PROMPT.replaceAll("SKILL.md", ENTRIES[entry]);
}
const JUDGE = `Below is an answer to a Zscaler question, then a numbered list of facts. For each fact, say whether the answer
states it (same meaning; wording may differ). Reply with only a JSON object mapping each fact number to true or false.

QUESTION:
{turn}

ANSWER:
{answer}

FACTS:
{facts}`;
// Commands a corporate runtime auto-approves; any other segment of a shell command needs a person.
const READ_ONLY = /^\s*(grep|rg|find|ls|cat|head|tail|sed -n|wc|sort|uniq|cut|echo)\b/;
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);

export function loadQuestions(file = setFile()) {
  return JSON.parse(fs.readFileSync(file, "utf8")).questions;
}

/** What makes two result directories comparable. */
export function harness(questions, claudeVersion, model = MODEL) {
  return { claude_version: claudeVersion, model, effort: EFFORT, tools: TOOLS, prompt_sha: sha(PROMPT), facts_sha: sha(JSON.stringify(questions)) };
}

/** The keys on which two metas differ (ref and commit excepted: those are what an eval compares). */
export function mismatch(a, b) {
  return Object.keys(harness([], "")).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
}

/** A run transcript (stream-json) as the text tools returned, the final answer and the tool calls. */
export function parseRun(text) {
  const ctx = [];
  const calls = [];
  let answer = "";
  for (const line of text.split("\n")) {
    let m;
    try {
      m = JSON.parse(line);
    } catch {
      continue;
    }
    if (m.type === "result") answer = m.result || "";
    for (const b of (typeof m.message === "object" && m.message?.content) || []) {
      if (b?.type === "tool_use") calls.push({ name: b.name, input: b.input || {} });
      if (b?.type === "tool_result") ctx.push(typeof b.content === "string" ? b.content : (b.content || []).map((x) => x?.text || "").join("\n"));
    }
  }
  return { ctx: ctx.join("\n"), answer, calls };
}

/** Shell calls a corporate runtime would stop to approve: any segment that is not a read-only command. */
export function approvals(calls) {
  return calls.filter((c) => c.name === "Bash" && String(c.input.command || "").split(/\s*(?:\|\||&&|;|\||\n)\s*/).some((p) => p.trim() && !READ_ONLY.test(p))).length;
}

/** Every shell call: a runtime with no allowlist stops for a person at each one, read-only or not. */
export const shellCalls = (calls) => calls.filter((c) => c.name === "Bash").length;

/**
 * The judge's verdict on `count` facts from `claude -p --output-format json`: one result object, or, under some
 * versions and settings, a list of events that ends in one. Null when there is none to read: no result, an error
 * result, or a reply that does not give every fact its true or false (an API error's JSON, a reply cut short).
 */
export function verdictOf(res, count) {
  try {
    const parsed = JSON.parse(res);
    const last = Array.isArray(parsed) ? parsed.findLast((m) => m?.type === "result") : parsed;
    if (last?.is_error) return null;
    const verdict = JSON.parse(last.result.match(/\{[\s\S]*\}/)[0]);
    for (let i = 1; i <= count; i++) if (typeof verdict[String(i)] !== "boolean") return null;
    return verdict;
  } catch {
    return null;
  }
}

/** Whether the holder claim reached the context: its qualified ID as `read` prints it, or its key in its subject file. */
export function reached(ctx, claim) {
  if (ctx.includes(claim)) return true;
  const [subject, local] = claim.split(":");
  return ctx.includes(`"id": "${subject}"`) && ctx.includes(`"${local}": {`);
}

function claudeVersion() {
  return execFileSync("claude", ["--version"], { encoding: "utf8" }).trim();
}

function readMeta(out) {
  const f = path.join(out, "meta.json");
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null;
}

/** Run `fn` over `items`, `jobs` at a time. */
async function pool(items, jobs, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

function claude(args, { cwd, stdout }) {
  return new Promise((resolve, reject) => {
    const child = spawn("claude", args, { cwd, stdio: ["ignore", stdout ? "pipe" : "ignore", "ignore"] });
    const chunks = [];
    child.stdout?.on("data", (d) => chunks.push(d));
    const timer = setTimeout(() => child.kill("SIGTERM"), 15 * 60_000);
    child.on("error", reject);
    child.on("close", () => {
      clearTimeout(timer);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
  });
}

async function run({ ref, out, reps, jobs, only, set, entry = "skill", model = MODEL }) {
  const all = loadQuestions(setFile(set));
  const questions = all.filter((q) => !only || only.includes(q.id));
  const commit = execFileSync("git", ["-C", ROOT, "rev-parse", ref], { encoding: "utf8" }).trim();
  // The set is recorded so judge and report read the same questions; the default set records none, as before.
  const prompt = promptFor(entry);
  const meta = { ref, commit, ...(set ? { set } : {}), ...(entry !== "skill" ? { entry } : {}), ...harness(all, claudeVersion(), model) };
  const prev = readMeta(out);
  if (prev && (prev.commit !== commit || (prev.entry || "skill") !== entry || mismatch(prev, meta).length)) {
    const held = { ...((prev.entry || "skill") !== entry ? { entry: prev.entry || "skill" } : {}), ...Object.fromEntries(mismatch(prev, meta).map((k) => [k, prev[k]])) };
    throw new Error(`${out} holds runs of ${prev.commit.slice(0, 8)} under ${JSON.stringify(held)}; use a new --out`);
  }
  fs.mkdirSync(path.join(out, "runs"), { recursive: true });
  fs.writeFileSync(path.join(out, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  const wt = path.join(out, "worktree");
  if (!fs.existsSync(wt)) execFileSync("git", ["-C", ROOT, "worktree", "add", "--detach", wt, commit], { stdio: "ignore" });
  const todo = questions.flatMap((q) => Array.from({ length: reps }, (_, r) => ({ q, r })))
    .filter(({ q, r }) => !fs.existsSync(path.join(out, "runs", `${q.id}-${r}.jsonl`)));
  let done = 0;
  await pool(todo, jobs, async ({ q, r }) => {
    const file = path.join(out, "runs", `${q.id}-${r}.jsonl`);
    const text = await claude(["-p", prompt.replace("{turn}", q.turn), "--model", model, "--effort", EFFORT,
      "--output-format", "stream-json", "--verbose", "--permission-mode", "dontAsk", "--allowedTools", ...TOOLS,
      "--disallowedTools", "Agent", "Task", "--no-session-persistence"], { cwd: wt, stdout: true });
    fs.writeFileSync(file, text);
    console.log(`${++done}/${todo.length} ${q.id}-${r}`);
  });
}

/** The questions a result directory was run with. */
const questionsOf = (out) => loadQuestions(setFile(readMeta(out)?.set));

async function judge({ out, jobs }) {
  const byId = new Map(questionsOf(out).map((q) => [q.id, q]));
  // The judge is the model the runs used, under the ID they were run with.
  const model = readMeta(out)?.model || MODEL;
  const unreadable = [];
  const file = path.join(out, "judged.json");
  const judged = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  const todo = fs.readdirSync(path.join(out, "runs")).filter((f) => f.endsWith(".jsonl") && !judged[f]);
  await pool(todo, jobs, async (f) => {
    const q = byId.get(f.replace(/-\d+\.jsonl$/, ""));
    if (!q) return;
    const { answer } = parseRun(fs.readFileSync(path.join(out, "runs", f), "utf8"));
    const facts = q.facts.map((x, i) => `${i + 1}. ${x.fact}`).join("\n");
    const res = await claude(["-p", JUDGE.replace("{turn}", q.turn).replace("{answer}", answer).replace("{facts}", facts),
      "--model", model, "--output-format", "json", "--no-session-persistence", "--tools", ""], { cwd: out, stdout: true });
    const verdict = verdictOf(res, q.facts.length);
    // An unreadable verdict is not recorded as "states nothing": the run stays unjudged, and the next judge retries it.
    if (!verdict) return unreadable.push(f);
    judged[f] = Object.fromEntries(q.facts.map((x, i) => [x.id, verdict[String(i + 1)] === true]));
    fs.writeFileSync(file, `${JSON.stringify(judged, null, 1)}\n`);
  });
  if (unreadable.length) {
    console.error(`${unreadable.length} verdict(s) unreadable, left unjudged (run judge again): ${unreadable.slice(0, 5).join(", ")}${unreadable.length > 5 ? " ..." : ""}`);
    process.exitCode = 1;
  }
}

/** One result directory's numbers, per rep and overall. */
export function summarize(out, questions = questionsOf(out)) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const judgedFile = path.join(out, "judged.json");
  const judged = fs.existsSync(judgedFile) ? JSON.parse(fs.readFileSync(judgedFile, "utf8")) : {};
  const reps = {};
  for (const f of fs.readdirSync(path.join(out, "runs")).filter((x) => x.endsWith(".jsonl")).sort()) {
    const [, qid, rep] = f.match(/^(.+)-(\d+)\.jsonl$/) || [];
    const q = byId.get(qid);
    if (!q) continue;
    const { ctx, calls } = parseRun(fs.readFileSync(path.join(out, "runs", f), "utf8"));
    reps[rep] ||= { runs: 0, unjudged: 0, facts: 0, stated: 0, reached: 0, ctx_tokens: 0, approvals: 0, shell: 0, over_guardrail: 0 };
    const r = reps[rep];
    const n = approvals(calls);
    r.runs++;
    if (!judged[f]) r.unjudged++;
    r.facts += q.facts.length;
    r.stated += Object.values(judged[f] || {}).filter(Boolean).length;
    r.reached += q.facts.filter((x) => reached(ctx, x.claim)).length;
    r.ctx_tokens += Math.round(ctx.length / 4);
    r.approvals += n;
    r.shell += shellCalls(calls);
    if (n > 8) r.over_guardrail++;
  }
  return reps;
}

function report(dirs, { allowMismatch }) {
  const metas = dirs.map(readMeta);
  for (const [i, m] of metas.entries()) {
    if (!m) throw new Error(`${dirs[i]} has no meta.json`);
    const diff = mismatch(metas[0], m);
    if (diff.length && !allowMismatch) throw new Error(`${dirs[i]} differs from ${dirs[0]} in ${diff.join(", ")}: not comparable (--allow-mismatch to print anyway)`);
  }
  for (const [i, dir] of dirs.entries()) {
    const reps = summarize(dir);
    const pct = (a, b) => `${b ? Math.round((100 * a) / b) : 0}%`;
    const total = Object.values(reps).reduce((t, r) => Object.fromEntries(Object.keys(r).map((k) => [k, (t[k] || 0) + r[k]])), {});
    console.log(`${metas[i].ref}${metas[i].entry ? ` via ${metas[i].entry}` : ""} (${metas[i].commit.slice(0, 8)}, ${metas[i].claude_version}, ${metas[i].model})`);
    for (const [rep, r] of Object.entries(reps)) console.log(`  rep ${rep}: stated ${r.stated}/${r.facts} = ${pct(r.stated, r.facts)}, holder reached ${pct(r.reached, r.facts)}`);
    console.log(`  all: stated ${pct(total.stated, total.facts)}, reached ${pct(total.reached, total.facts)}, context ${Math.round(total.ctx_tokens / total.runs)} tokens/answer, approvals ${(total.approvals / total.runs).toFixed(1)}/answer (shell calls ${(total.shell / total.runs).toFixed(1)}), ${total.over_guardrail} run(s) over 8`);
    if (total.unjudged) console.log(`  ${total.unjudged} run(s) not judged yet, counted as stating nothing: run judge`);
  }
}

function option(args, name, fallback) {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
}

async function main(argv) {
  const [cmd, ...args] = argv;
  const out = option(args, "--out") && path.resolve(option(args, "--out"));
  if (out && !path.relative(ROOT, out).startsWith("..")) throw new Error(`--out must be outside the checkout: ${out}`);
  const jobs = Number(option(args, "--jobs", 4));
  if (cmd === "run" && option(args, "--ref") && out) {
    return run({ ref: option(args, "--ref"), out, reps: Number(option(args, "--reps", 3)), jobs, only: option(args, "--only")?.split(","), set: option(args, "--set"), entry: option(args, "--entry"), model: option(args, "--model") });
  }
  if (cmd === "judge" && out) return judge({ out, jobs });
  if (cmd === "report" && args.filter((a) => !a.startsWith("--")).length) {
    return report(args.filter((a) => !a.startsWith("--")).map((d) => path.resolve(d)), { allowMismatch: args.includes("--allow-mismatch") });
  }
  console.error("usage: kb-eval.mjs run --ref <ref> --out <dir> [--set <name>] [--entry devin] [--model <id>] [--reps 3] [--jobs 4] [--only q1,q2] | judge --out <dir> | report <dir> ...");
  process.exitCode = 2;
}

if (import.meta.main) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(`kb-eval: ${e.message}`);
    process.exitCode = 1;
  });
}
