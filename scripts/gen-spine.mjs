#!/usr/bin/env node
// gen-spine.mjs — generate the spine: the tree an agent reads before it reads any subject.
//
// Two levels under references/_meta/spine/, in the style of a table-of-contents index (llms.txt, PageIndex):
//   <product>.json         every area of the product with its summary and the areas its subjects' typed edges
//                          reach (decided-by, scoped-by, interacts-with, depends-on, reached-via, logged-in);
//                          API, SDK and Terraform areas are listed apart, as reference areas.
//   <product>/<area>.json  every subject of the area with its title, its lead (its opening claim) and its typed
//                          edges to other subjects.
// An agent reads the product file, opens the area files that bear on the question, picks subjects by their leads
// and edges, and reads those with `kb.mjs read`. Everything comes from the subject files; nothing is hand-written.
//
// Usage: node scripts/gen-spine.mjs [--check]
//   --check  exit 1 if a committed spine file differs from what the subject files generate.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic, META } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, META, "spine");
const EDGES = ["decided-by", "scoped-by", "reached-via", "interacts-with", "depends-on", "logged-in"];

/** The subject's opening claim: the first claim its prose inlines, else its first claim; one sentence, clipped. */
function leadOf(s) {
  const first = JSON.stringify(s.prose || []).match(/\{\{([a-z0-9]+(?:-[a-z0-9]+)*)\}\}/)?.[1];
  const claim = s.claims?.[first] || Object.values(s.claims || {})[0];
  if (!claim) return undefined;
  const sentence = claim.statement.replace(/\s+/g, " ").match(/^.+?[.!?](?=\s|$)/)?.[0] || claim.statement;
  return sentence.length > 160 ? `${sentence.slice(0, 157)}...` : sentence;
}

// An area whose name marks it as reference material (wire formats, SDK and provider behaviour).
const REFERENCE = /^(api|sdk-|terraform|ansible|mcp-server|legacy-api)/;
// A type (`zia/web-log`) is its own target; a subject belongs to the area its first two segments name.
const areaOf = (id) => (id.includes("/") ? id : id.split(".").slice(0, 2).join("."));

export function spines(g) {
  const products = new Map();
  const subjects = [...g.nodes.values()].filter((n) => n.kind === "subject").sort((a, b) => a.id.localeCompare(b.id));
  for (const n of subjects) {
    const product = n.id.split(".")[0];
    const area = areaOf(n.id);
    if (!products.has(product)) products.set(product, new Map());
    const areas = products.get(product);
    if (!areas.has(area)) areas.set(area, []);
    const s = n.data;
    const edges = {};
    for (const e of s.related || []) {
      if (!EDGES.includes(e.rel)) continue;
      edges[e.rel] ||= [];
      edges[e.rel].push(e.to);
    }
    const lead = leadOf(s);
    areas.get(area).push({ id: n.id, title: s.title, ...(lead ? { lead } : {}), ...(Object.keys(edges).length ? { edges } : {}) });
  }
  const out = {};
  for (const [product, areas] of products) {
    out[product] = {
      product,
      generated_by: "scripts/gen-spine.mjs",
      read_with: "node scripts/kb.mjs read <area | subject | type> ...",
      areas: [...areas].map(([id, subs]) => ({ id, ...(g.nodes.get(id)?.kind === "subject" ? { title: g.nodes.get(id).data.title } : {}), subjects: subs })),
    };
  }
  return out;
}

/** An area's entry in its product file: summary, size and the other areas its subjects' typed edges reach. */
function areaEntry(a) {
  const hub = a.subjects.find((x) => x.id === a.id);
  // An area whose hub has no claim of its own is summarised by what its subjects are about.
  const summary = hub?.lead || a.subjects.filter((x) => x.id !== a.id).slice(0, 5).map((x) => x.title).join("; ") || undefined;
  const reach = {};
  for (const x of a.subjects) {
    for (const [rel, tos] of Object.entries(x.edges || {})) {
      for (const t of tos) {
        if (areaOf(t) === a.id) continue;
        reach[rel] ||= new Set();
        reach[rel].add(areaOf(t));
      }
    }
  }
  const edges = Object.fromEntries(EDGES.filter((r) => reach[r]).map((r) => [r, [...reach[r]].sort()]));
  return { id: a.id, title: a.title || hub?.title || a.id, ...(summary ? { summary } : {}), subjects: a.subjects.length, ...(Object.keys(edges).length ? { edges } : {}) };
}

/** The spine's files, path relative to the spine directory -> text. */
export function spineFiles(g) {
  const files = {};
  for (const spine of Object.values(spines(g))) {
    const isRef = (a) => REFERENCE.test(a.id.split(".")[1] || "");
    // Log types are authored, one file each under references/<product>/types/; API types are generated and many.
    const logTypes = [...g.nodes.values()].filter((n) => n.kind === "type" && n.authored && n.file.startsWith(`references/${spine.product}/types/`))
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((n) => ({ id: n.id, title: n.data.title || n.id, fields: Object.keys(n.data.fields || {}).length }));
    files[`${spine.product}.json`] = lines({
      product: spine.product,
      generated_by: "scripts/gen-spine.mjs",
      open: `an area's subjects are in references/_meta/spine/${spine.product}/<area id>.json, e.g. references/_meta/spine/${spine.product}/${spine.areas[0].id}.json`,
      ...(logTypes.length ? { log_fields: "read a log type, or only some of its fields: kb.mjs read <type>#<field> ..." } : {}),
    }, { areas: spine.areas.filter((a) => !isRef(a)).map(areaEntry), log_types: logTypes, reference_areas: spine.areas.filter(isRef).map(areaEntry) });
    for (const a of spine.areas) {
      files[`${spine.product}/${a.id}.json`] = lines({ area: a.id, title: a.title || a.id, read_with: "node scripts/kb.mjs read <subject> ..." }, { subjects: a.subjects });
    }
  }
  return files;
}

/**
 * One entry per line: the file stays valid JSON, reads top to bottom like an index, and stays small enough for one
 * file read. Indenting every key would double its size.
 */
function lines(head, lists) {
  const out = Object.entries(head).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  for (const [k, items] of Object.entries(lists)) {
    if (!items.length) continue;
    out.push(`  ${JSON.stringify(k)}: [\n${items.map((x) => `    ${JSON.stringify(x)}`).join(",\n")}\n  ]`);
  }
  return `{\n${out.join(",\n")}\n}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes("--check");
  const g = buildGraph(loadPublic(ROOT));
  const want = spineFiles(g);
  const stale = [];
  for (const [rel, text] of Object.entries(want)) {
    const file = path.join(OUT, rel);
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) stale.push(path.relative(ROOT, file));
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
  }
  // Files no longer generated (a removed area or product) go too.
  const have = fs.existsSync(OUT) ? fs.readdirSync(OUT, { recursive: true }).filter((f) => f.endsWith(".json")) : [];
  for (const rel of have) {
    if (want[rel]) continue;
    if (check) stale.push(path.relative(ROOT, path.join(OUT, rel)));
    else fs.rmSync(path.join(OUT, rel));
  }
  if (check && stale.length) {
    console.error(`spine out of date (run node scripts/gen-spine.mjs): ${stale.slice(0, 10).join(", ")}${stale.length > 10 ? ` and ${stale.length - 10} more` : ""}`);
    process.exit(1);
  }
  if (!check) {
    for (const d of fs.readdirSync(OUT, { withFileTypes: true })) if (d.isDirectory() && !fs.readdirSync(path.join(OUT, d.name)).length) fs.rmdirSync(path.join(OUT, d.name));
    console.log(`wrote ${Object.keys(want).length} spine files to ${path.relative(ROOT, OUT)}`);
  }
}
