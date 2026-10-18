#!/usr/bin/env node
// scripts/kb.mjs — the knowledge-graph CLI.
//
//   validate [--no-citations]        schema + reference + prose + citation checks
//   resolve <id | text> [--overlay <dir>] [--evidence] [--cases] [--pretty]
//                                    one layer-labelled bundle (JSON on stdout)
//   render <subject-id>              the subject as Markdown (deterministic)
//   manifest                         record capture-manifest entries for cited captures
//   verified                         regenerate references/_meta/verified.json
//   export-zscalerctl                export the pinned zscalerctl catalogue (needs Go)
//   import-types                     regenerate references/_meta/types/*.json
//   migrate-links                    rewrite legacy links to converted docs as kb: links
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
  console.error("usage: kb.mjs <validate|resolve|render|manifest|verified|export-zscalerctl|import-types|migrate-links> [args]");
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
  const g = buildGraph(loadPublic(ROOT));
  if (cmd === "validate") {
    const { errors, warnings, stats } = validateGraph(g, { citations: !args.includes("--no-citations") });
    // Legacy Markdown links into the graph (written by migrate-links) must resolve.
    const { kbLinks } = await import("./kb-migrate.mjs");
    for (const { file, id } of kbLinks(ROOT)) {
      if (!g.nodes.has(id)) errors.push({ file, message: `kb:${id} does not resolve` });
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

process.exit(await main(process.argv.slice(2)));
