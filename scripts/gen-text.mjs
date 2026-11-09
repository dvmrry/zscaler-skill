#!/usr/bin/env node
// gen-text.mjs — generate the reading text: what `kb.mjs read` prints, as files an agent reads with its file tools.
//
// Many runtimes stop for a person at every shell command, and file reads and searches need no one. So the public graph
// is kept as text too, one file per thing `read` reads, under references/_meta/text/:
//   <product>/<subject id>.md   one subject as `read` prints it (only that subject: `read` of a hub's ID reads its whole
//                               area), with its aliases and former IDs under the title, then its area's spine file
//                               and its one-hop links as file paths, ranked as `read` follows them, each with the
//                               claim that establishes it. An area with no hub subject gets an index file under its
//                               ID, so every area ID names a file.
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
import { areaOf, fit, neighbours, readSubject, readText, readType, spines, textFile, titleOf } from "./kb-resolve.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = `${META}/text`;
const fileOf = (g, id) => (g.nodes.get(id).kind === "type" ? textFile.type(id) : textFile.subject(id));

/** A subject's links as `read` ranks them, one line each: the edge, the file, and the claim that establishes it. */
function links(g, id) {
  const lines = neighbours(g, [id]).map(([to, v]) => {
    const e = v.edges.find((x) => x.because) || v.edges[0];
    const because = e.because && g.nodes.get(e.because)?.data?.statement;
    return `- ${e.rel} ${fileOf(g, to)} (${titleOf(g, to)})${e.from !== id ? `, from ${e.from}` : ""}${because ? `: ${because} [${e.because}]` : ""}`;
  });
  return lines.length ? fit("Linked (open a file only if the answer needs it):", lines, 12000, "linked subjects") : "";
}

/**
 * A node's text with what else it is called under the title line (its aliases, and the ledger IDs it replaced), so a
 * search for what people call it, or for an old ID someone cites, finds the file.
 */
function withNames(text, aliases = [], former = []) {
  const names = [aliases.length && `Also called: ${aliases.join("; ")}`, former.length && `Former IDs: ${former.join(", ")}`].filter(Boolean);
  if (!names.length) return text;
  const at = text.includes("\n") ? text.indexOf("\n") : text.length;
  return `${text.slice(0, at)}\n${names.join("\n")}${text.slice(at)}`;
}

/** Every generated file, path relative to the repo root -> text. */
export function textFiles(g) {
  const files = {};
  // An old ledger ID names a subject or one of its claims; it is listed on the subject.
  const former = new Map();
  for (const [old, to] of g.formerIds) {
    const id = g.nodes.get(to)?.subject || to;
    former.set(id, [...(former.get(id) || []), old]);
  }
  for (const n of g.nodes.values()) {
    if (n.kind === "subject") {
      const area = areaOf(n.id);
      const head = withNames(readSubject(g, n.id), n.data.aliases, (former.get(n.id) || []).sort());
      files[textFile.subject(n.id)] = `${[head, `Area: ${area}, its subjects in ${META}/spine/${n.id.split(".")[0]}/${area}.json`, links(g, n.id)].filter(Boolean).join("\n\n")}\n`;
    } else if (n.kind === "type") {
      files[textFile.type(n.id)] = `${withNames(readType(g, n.id, null, { files: true }), n.data.aliases)}\n`;
    }
  }
  // An area whose ID is no subject still names a file: the index of its subjects, as its spine file lists them.
  for (const spine of Object.values(spines(g))) {
    for (const a of spine.areas) {
      if (g.nodes.has(a.id)) continue;
      files[textFile.subject(a.id)] = `${[`# ${a.id}: an area with no hub subject`, fit(`Its subjects (open the ones the question needs):`, a.subjects.map((x) => `- ${textFile.subject(x.id)} (${x.title})`), Infinity, "subjects")].join("\n\n")}\n`;
    }
  }
  for (const code of g.statusCodes.keys()) files[textFile.code(code)] = readText(g, [code], null, { hops: 0 });
  for (const key of g.policyReasons.keys()) {
    const f = textFile.reason(key);
    if (files[f]) throw new Error(`two policy reasons share ${f}: ${key}`);
    files[f] = readText(g, [key], null, { hops: 0 });
  }
  // Some vendor strings end in a space; committed text carries no trailing whitespace.
  for (const f of Object.keys(files)) files[f] = files[f].replace(/[ \t]+$/gm, "");
  return files;
}

/**
 * Bring `root`'s reading-text directory to `want`, or with `check` only list what differs: files missing, changed or
 * no longer generated (a removed subject, type or code). Returns those paths.
 */
export function sync(root, want, { check = false } = {}) {
  const stale = [];
  for (const [rel, text] of Object.entries(want)) {
    const file = path.join(root, rel);
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) stale.push(rel);
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
    }
  }
  const out = path.join(root, DIR);
  // Only what this writes: a stray file (an editor's or Finder's) is neither stale nor removed.
  const have = fs.existsSync(out) ? fs.readdirSync(out, { recursive: true }).filter((f) => f.endsWith(".md") && fs.statSync(path.join(out, f)).isFile()) : [];
  for (const f of have) {
    const rel = `${DIR}/${f.split(path.sep).join("/")}`;
    if (want[rel]) continue;
    stale.push(rel);
    if (!check) fs.rmSync(path.join(root, rel));
  }
  if (!check && fs.existsSync(out)) {
    for (const d of fs.readdirSync(out, { recursive: true }).map((f) => path.join(out, f)).filter((p) => fs.statSync(p).isDirectory()).sort().reverse()) {
      if (!fs.readdirSync(d).length) fs.rmdirSync(d);
    }
  }
  return stale;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.some((a) => a !== "--check")) {
    console.error("usage: node scripts/gen-text.mjs [--check]");
    process.exit(2);
  }
  const check = args.includes("--check");
  const want = textFiles(buildGraph(loadPublic(ROOT)));
  const stale = sync(ROOT, want, { check });
  if (check && stale.length) {
    console.error(`reading text out of date (run node scripts/gen-text.mjs): ${stale.slice(0, 10).join(", ")}${stale.length > 10 ? ` and ${stale.length - 10} more` : ""}`);
    process.exit(1);
  }
  if (!check) {
    const bytes = Object.values(want).reduce((n, t) => n + Buffer.byteLength(t), 0);
    console.log(`wrote ${Object.keys(want).length} reading-text files to ${DIR} (${(bytes / 1e6).toFixed(1)} MB)`);
  }
}
