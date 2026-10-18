#!/usr/bin/env node
// scripts/kb-eval-compare.mjs — measure the knowledge graph against file reading.
//
// For each eval that cites graph IDs (`must_cite`), ask a model the eval prompt twice:
//   files: with the Markdown docs that eval cited at --base (git), the old path;
//   graph: with the resolver bundles for its `must_cite` IDs, the new path.
// Prompt tokens come from the server's own usage report. Answers are scored with
// run-evals.py's substring rules: assertions, must_not_say traps, citations.
//
//   node scripts/kb-eval-compare.mjs --endpoint name=http://host:port/v1#model \
//     [--endpoint ...] [--reps 3] [--base main] [--temperature 0.3] [--reasoning-effort medium] [--out results.json]
//
// An endpoint's API key, if any, is read from KB_EVAL_KEY_<NAME> (uppercase).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic } from "./kb-lib.mjs";
import { resolve } from "./kb-resolve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVALS = "references/_meta/evals/evals.json";

const SYSTEM = [
  "You answer questions about Zscaler using only the reference material provided below.",
  "If the material does not establish something, say so plainly instead of filling the gap from memory.",
  "If the question presumes a fact you cannot verify from the material, say so.",
  "End with a Sources line naming what you relied on: claim or subject IDs for knowledge-graph material, file paths for documents.",
].join(" ");

function args(argv) {
  const out = { endpoints: [], reps: 3, base: "main", out: null, temperature: 0.3, effort: "medium" };
  for (let i = 0; i < argv.length; i++) {
    const [k, v] = [argv[i], argv[i + 1]];
    if (k === "--endpoint") { out.endpoints.push(parseEndpoint(v)); i++; }
    else if (k === "--reps") { out.reps = Number(v); i++; }
    else if (k === "--base") { out.base = v; i++; }
    else if (k === "--out") { out.out = v; i++; }
    else if (k === "--temperature") { out.temperature = Number(v); i++; }
    else if (k === "--reasoning-effort") { out.effort = v; i++; }
    else throw new Error(`unknown argument ${k}`);
  }
  if (!out.endpoints.length) throw new Error("need at least one --endpoint name=url#model");
  return out;
}

function parseEndpoint(spec) {
  const m = spec.match(/^([\w-]+)=(https?:\/\/[^#]+)#(.+)$/);
  if (!m) throw new Error(`bad endpoint ${spec}; expected name=http://host:port/v1#model`);
  return { name: m[1], url: m[2].replace(/\/$/, ""), model: m[3], key: process.env[`KB_EVAL_KEY_${m[1].toUpperCase()}`] };
}

/** The eval as it stood at `base` (to recover the files it cited before conversion). */
function baseEvals(base) {
  return JSON.parse(execFileSync("git", ["-C", ROOT, "show", `${base}:${EVALS}`], { encoding: "utf8" })).evals;
}

function filesContext(base, files) {
  return files.map((f) => `=== ${f} ===\n${execFileSync("git", ["-C", ROOT, "show", `${base}:${f}`], { encoding: "utf8" })}`).join("\n\n");
}

function graphContext(g, ids) {
  return ids.map((id) => `=== kb resolve ${id} ===\n${JSON.stringify(resolve(g, id))}`).join("\n\n");
}

async function ask(ep, context, prompt, opt) {
  const res = await fetch(`${ep.url}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(ep.key ? { authorization: `Bearer ${ep.key}` } : {}) },
    body: JSON.stringify({
      model: ep.model,
      temperature: opt.temperature,
      reasoning_effort: opt.effort, // identical across conditions; some servers default very high
      max_tokens: 8192,
      messages: [
        { role: "system", content: `${SYSTEM}\n\n${context}` },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${ep.name}: HTTP ${res.status} ${await res.text()}`);
  const body = await res.json();
  return { text: body.choices[0].message.content || "", usage: body.usage || {} };
}

function score(e, cites, text) {
  const lc = text.toLowerCase();
  const failedAssertions = (e.assertions || []).filter((a) => !lc.includes(a.toLowerCase()));
  const trapsHit = (e.must_not_say || []).filter((t) => lc.includes(t.toLowerCase()));
  const citesMissing = cites.filter((c) => !lc.includes(c.toLowerCase()) && !lc.includes(path.basename(c).toLowerCase()));
  return {
    assert_rate: (e.assertions || []).length ? 1 - failedAssertions.length / e.assertions.length : 1,
    traps_hit: trapsHit.length,
    cite_rate: cites.length ? 1 - citesMissing.length / cites.length : 1,
  };
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

async function main() {
  const opt = args(process.argv.slice(2));
  const g = buildGraph(loadPublic(ROOT));
  const current = JSON.parse(fs.readFileSync(path.join(ROOT, EVALS), "utf8")).evals.filter((e) => e.must_cite);
  const before = new Map(baseEvals(opt.base).map((e) => [e.id, e]));
  const rows = [];
  for (const ep of opt.endpoints) {
    for (const e of current) {
      const oldFiles = before.get(e.id)?.must_cite_files || [];
      const conditions = {
        files: { context: filesContext(opt.base, oldFiles), cites: oldFiles },
        graph: { context: graphContext(g, e.must_cite), cites: e.must_cite },
      };
      for (const [cond, c] of Object.entries(conditions)) {
        for (let r = 0; r < opt.reps; r++) {
          const t0 = Date.now();
          const { text, usage } = await ask(ep, c.context, e.prompt, opt);
          rows.push({
            endpoint: ep.name, eval: e.id, condition: cond, rep: r,
            prompt_tokens: usage.prompt_tokens ?? null, completion_tokens: usage.completion_tokens ?? null,
            reasoning_tokens: usage.completion_tokens_details?.reasoning_tokens ?? null,
            seconds: (Date.now() - t0) / 1000, ...score(e, c.cites, text), answer: text,
          });
          process.stderr.write(`${ep.name} eval ${e.id} ${cond} rep ${r}: ${usage.prompt_tokens} prompt tokens\n`);
        }
      }
    }
  }
  if (opt.out) fs.writeFileSync(opt.out, JSON.stringify(rows, null, 2) + "\n");
  // Aggregate: per endpoint × eval × condition.
  console.log("endpoint\teval\tcondition\tprompt_tok\tassert\ttraps\tcite");
  const keys = [...new Set(rows.map((r) => `${r.endpoint}\t${r.eval}\t${r.condition}`))];
  for (const k of keys) {
    const rs = rows.filter((r) => `${r.endpoint}\t${r.eval}\t${r.condition}` === k);
    console.log([k, Math.round(mean(rs.map((r) => r.prompt_tokens))), mean(rs.map((r) => r.assert_rate)).toFixed(2),
      mean(rs.map((r) => r.traps_hit)).toFixed(2), mean(rs.map((r) => r.cite_rate)).toFixed(2)].join("\t"));
  }
}

await main();
