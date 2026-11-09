#!/usr/bin/env node
// gen-text.mjs — generate the reading text: what `kb.mjs read` prints, as files an agent reads with its file tools.
//
// Many runtimes stop for a person at every shell command, and file reads and searches need no one. So the public graph
// is kept as text too, one file per thing `read` reads, under references/_meta/text/:
//   <product>/<subject id>.md   a subject as `read <subject> --no-links` prints it, with its aliases under the title,
//                               then its area's spine file and its one-hop links as file paths, ranked as `read`
//                               follows them, each with the claim that establishes it
//   types/<type id>.md          a log or config type with every field (types/zia/web-log.md)
//   codes/<code>.md             a ZPA LSS status code, as each log type that lists it gives it
//   codes/reason-<slug>.md      a ZIA policy reason, with each row of the Policy Reasons article
// A search of the directory for a name or nickname, a code or a reason someone pasted lands on the file about it.
// Company records are not here: `read --company` merges them from the overlay. Everything comes from the subject
// files; nothing is hand-written.
//
// Usage: node scripts/gen-text.mjs [--check]
//   --check  exit 1 if a committed file differs from what the subject files generate.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph, loadPublic, META } from "./kb-lib.mjs";
import { areaOf, fit, neighbours, readSubject, readText, readType, titleOf } from "./kb-resolve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = `${META}/text`;

/** Where each kind of node's text is, relative to the repo root (the paths an agent opens). */
export const subjectFile = (id) => `${DIR}/${id.split(".")[0]}/${id}.md`;
export const typeFile = (id) => `${DIR}/types/${id}.md`;
export const codeFile = (code) => `${DIR}/codes/${code}.md`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const reasonFile = (key) => `${DIR}/codes/reason-${slug(key)}.md`;
const fileOf = (g, id) => (g.nodes.get(id).kind === "type" ? typeFile(id) : subjectFile(id));

/** A subject's links as `read` ranks them, one line each: the edge, the file, and the claim that establishes it. */
function links(g, id) {
  const lines = neighbours(g, [id]).map(([to, v]) => {
    const e = v.edges.find((x) => x.because) || v.edges[0];
    const because = e.because && g.nodes.get(e.because)?.data?.statement;
    return `- ${e.rel} ${fileOf(g, to)} (${titleOf(g, to)})${e.from !== id ? `, from ${e.from}` : ""}${because ? `: ${because} [${e.because}]` : ""}`;
  });
  return lines.length ? fit("Linked (open a file only if the answer needs it):", lines, 12000, "linked subjects") : "";
}

/** A node's text with its aliases under the title line, so a search for what people call it finds the file. */
function withAliases(text, aliases = []) {
  if (!aliases.length) return text;
  const at = text.indexOf("\n");
  return `${text.slice(0, at)}\nAlso called: ${aliases.join("; ")}${text.slice(at)}`;
}

/** Every generated file, path relative to the repo root -> text. */
export function textFiles(g) {
  const files = {};
  for (const n of g.nodes.values()) {
    if (n.kind === "subject") {
      const area = areaOf(n.id);
      files[subjectFile(n.id)] = `${[withAliases(readSubject(g, n.id), n.data.aliases), `Area: ${area}, its subjects in ${META}/spine/${n.id.split(".")[0]}/${area}.json`, links(g, n.id)].filter(Boolean).join("\n\n")}\n`;
    } else if (n.kind === "type") {
      // The type's text says to read a code or reason by name with `read`; here each has its own file.
      const codes = Object.keys(n.data.status_codes || {}).length || Object.keys(n.data.policy_reasons || {}).length;
      files[typeFile(n.id)] = `${withAliases(readType(g, n.id), n.data.aliases)}${codes ? `\n\nEach status code and policy reason has its own file under ${DIR}/codes/ (\`<code>.md\`, \`reason-<the reason>.md\`): search that directory for the code or the reason's text.` : ""}\n`;
    }
  }
  for (const code of g.statusCodes.keys()) files[codeFile(code)] = readText(g, [code], null, { hops: 0 });
  for (const key of g.policyReasons.keys()) {
    const f = reasonFile(key);
    if (files[f]) throw new Error(`two policy reasons share ${f}: ${key}`);
    files[f] = readText(g, [key], null, { hops: 0 });
  }
  // Some vendor strings end in a space; committed text carries no trailing whitespace.
  for (const f of Object.keys(files)) files[f] = files[f].replace(/[ \t]+$/gm, "");
  return files;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.some((a) => a !== "--check")) {
    console.error("usage: node scripts/gen-text.mjs [--check]");
    process.exit(2);
  }
  const check = args.includes("--check");
  const want = textFiles(buildGraph(loadPublic(ROOT)));
  const stale = [];
  for (const [rel, text] of Object.entries(want)) {
    const file = path.join(ROOT, rel);
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) stale.push(rel);
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
  }
  // Files no longer generated (a removed subject, type or code) go too.
  const out = path.join(ROOT, DIR);
  const have = fs.existsSync(out) ? fs.readdirSync(out, { recursive: true }).filter((f) => fs.statSync(path.join(out, f)).isFile()) : [];
  for (const f of have) {
    const rel = `${DIR}/${f.split(path.sep).join("/")}`;
    if (want[rel]) continue;
    if (check) stale.push(rel);
    else fs.rmSync(path.join(ROOT, rel));
  }
  if (check && stale.length) {
    console.error(`reading text out of date (run node scripts/gen-text.mjs): ${stale.slice(0, 10).join(", ")}${stale.length > 10 ? ` and ${stale.length - 10} more` : ""}`);
    process.exit(1);
  }
  if (!check) {
    for (const d of fs.readdirSync(out, { recursive: true }).map((f) => path.join(out, f)).filter((p) => fs.statSync(p).isDirectory()).sort().reverse()) {
      if (!fs.readdirSync(d).length) fs.rmdirSync(d);
    }
    const bytes = Object.values(want).reduce((n, t) => n + Buffer.byteLength(t), 0);
    console.log(`wrote ${Object.keys(want).length} reading-text files to ${DIR} (${(bytes / 1e6).toFixed(1)} MB)`);
  }
}
