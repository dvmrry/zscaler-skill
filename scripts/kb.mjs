#!/usr/bin/env node
// scripts/kb.mjs — the knowledge-graph CLI.
//
//   validate [--no-citations]        schema + reference + prose + citation checks
//   lint [--json] [--strict]         deterministic Tier A evidence checks (version, identifier, number);
//                                    --strict exits 1 on any error-level finding
//   resolve <id | text> [--overlay <dir> | --no-overlay] [--evidence] [--cases] [--pretty]
//   resolve --each <id> <id> ...     one bundle per argument, as a JSON array (one call for several subjects)
//     The overlay defaults to $ZSCALER_KB_OVERLAY, then <runtime-data mount>/overlay if it has overlay.json.
//                                    one layer-labelled bundle (JSON on stdout)
//   render <subject-id>              the subject as Markdown (deterministic)
//   manifest                         record capture-manifest entries for cited captures
//   verified                         regenerate references/_meta/verified.json
//   export-zscalerctl                export the pinned zscalerctl catalogue (needs Go)
//   import-types                     regenerate references/_meta/types/*.json
//   migrate-links                    rewrite legacy links to converted docs as kb: links
//   requote [--write] [--json]       re-quote capture quotes a re-render broke only by spacing (kb-requote.mjs);
//                                    without --write, lists what it would change
//   move-claim <from> <to> [--merge] move a claim to another subject, rewriting every reference to it;
//                                    --merge drops it in favour of an existing claim that says the same
//   surface <query>                  API, SDK and Terraform surface for a product key (zia, zdx, zid, ...), a Terraform name, API path,
//                                    Go SDK package, or Python module, class or method (generated layer)
//
// Exit codes: 0 ok, 1 validation failed, 2 usage error.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic, validateGraph } from "./kb-lib.mjs";
import { exportZscalerctl, importTypes } from "./kb-types.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage(msg) {
  if (msg) console.error(`kb: ${msg}`);
  console.error("usage: kb.mjs <validate|lint|resolve|render|manifest|verified|export-zscalerctl|import-types|migrate-links|requote|move-claim|surface|freshness> [args]");
  process.exit(2);
}

function option(args, name) {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
}

async function main(argv) {
  const [cmd, ...args] = argv;
  if (!cmd) usage();
  if (cmd === "export-zscalerctl") {
    const out = exportZscalerctl(ROOT);
    console.log(`exported ${out.resources.length} resources, ${out.references.length} reference edges, ${out.commands.length} commands`);
    return 0;
  }
  if (cmd === "import-types") {
    const { written, unmatched } = importTypes(ROOT);
    for (const f of written) console.log(`wrote ${f}`);
    if (unmatched.length) console.log(`${unmatched.length} types have no infrawright Terraform mapping: ${unmatched.join(", ")}`);
    return 0;
  }
  if (cmd === "move-claim") {
    const merge = args.includes("--merge");
    const ids = args.filter((a) => a !== "--merge");
    if (ids.length !== 2) usage("move-claim needs <from> <to>");
    const { moveClaim } = await import("./kb-move.mjs");
    const { from, to, rewritten } = moveClaim(ROOT, ids[0], ids[1], { merge });
    console.log(`${merge ? "merged" : "moved"} ${from} -> ${to}; rewrote ${rewritten.length} file(s)${rewritten.length ? `: ${rewritten.join(", ")}` : ""}`);
    return 0;
  }
  if (cmd === "surface") {
    if (!args[0]) usage("surface needs a query");
    const { lookupSurface } = await import("./kb-surface.mjs");
    const hits = lookupSurface(ROOT, args[0]);
    console.log(JSON.stringify(hits, null, 2));
    return hits.length ? 0 : 1;
  }
  const g = buildGraph(loadPublic(ROOT));
  if (cmd === "freshness") {
    const { freshness, freshnessText } = await import("./kb-freshness.mjs");
    const json = args.includes("--json");
    const days = Number(option(args, "--days") || 365);
    const r = freshness(g, { days, upstream: args.includes("--upstream") });
    process.stdout.write(json ? `${JSON.stringify(r, null, 2)}\n` : freshnessText(r));
    return 0;
  }
  if (cmd === "requote") {
    const { requote } = await import("./kb-requote.mjs");
    const r = requote(g, { write: args.includes("--write") });
    if (args.includes("--json")) process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
    else {
      for (const f of r.fixed) console.log(`${f.where}: "${f.from.slice(0, 70)}" -> "${f.to.slice(0, 70)}"`);
      for (const b of r.broken) console.log(`still broken: ${b.where}: ${b.errors[0]}`);
    }
    console.error(`kb requote: ${r.fixed.length} quotes ${args.includes("--write") ? "re-quoted" : "to re-quote"} in ${r.files.length} files; ${r.broken.length} entries need a person`);
    return 0;
  }
  if (cmd === "lint") {
    const { lintGraph } = await import("./kb-lint.mjs");
    const findings = lintGraph(g);
    if (args.includes("--json")) process.stdout.write(`${JSON.stringify(findings, null, 2)}\n`);
    else for (const f of findings) console.log(`${f.level}: ${f.file}: ${f.id}: ${f.check} not in evidence: ${f.missing.join(", ")}`);
    const count = (level) => findings.filter((f) => f.level === level).length;
    console.error(`kb lint: ${count("error")} errors, ${count("warning")} warnings`);
    return args.includes("--strict") && count("error") ? 1 : 0;
  }
  if (cmd === "validate") {
    const { errors, warnings, stats } = validateGraph(g, { citations: !args.includes("--no-citations") });
    // Legacy Markdown links into the graph (written by migrate-links) must resolve.
    const { kbLinks, staleMentions } = await import("./kb-migrate.mjs");
    for (const { file, id } of kbLinks(ROOT)) {
      if (!g.nodes.has(id)) errors.push({ file, message: `kb:${id} does not resolve` });
    }
    for (const { file, moved, id } of staleMentions(ROOT)) {
      errors.push({ file, message: `mentions ${moved}, which was converted; use kb:${id}` });
    }
    const evalsFile = "references/_meta/evals/evals.json";
    for (const e of JSON.parse(fs.readFileSync(path.join(ROOT, evalsFile), "utf8")).evals) {
      for (const id of e.must_cite || []) {
        if (!g.nodes.has(id)) errors.push({ file: evalsFile, message: `eval ${e.id} must_cite ${id} does not resolve` });
      }
    }
    for (const w of warnings) console.log(`warning: ${w.file}: ${w.message}`);
    for (const e of errors) console.error(`error: ${e.file}: ${e.message}`);
    console.log(`kb: ${Object.entries(stats).map(([k, v]) => `${v} ${k}`).join(", ")}; ${errors.length} errors, ${warnings.length} warnings`);
    return errors.length ? 1 : 0;
  }
  const { runCommand } = await import("./kb-resolve.mjs");
  return runCommand(ROOT, g, cmd, args, { option, usage });
}

// exitCode, not process.exit(): exit() can end the process before a large bundle has drained into a pipe,
// handing the reader truncated JSON.
process.exitCode = await main(process.argv.slice(2));
