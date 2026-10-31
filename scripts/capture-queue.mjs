#!/usr/bin/env node
// capture-queue.mjs — the help pages the pinned vendor material links to that are not captured yet.
//
// A page every source points at can still be missing: the specs, providers and SDKs link the help article that
// explains a field or a status, and nothing captures it unless someone goes looking. This lists those pages,
// ranked by how many vendor files link each one and how many of those files claims cite, so the capture work
// starts where the graph already leans. Offline and deterministic: it reads committed files only. A link to an old
// address of a captured page is cleared with `python3 scripts/help_capture.py alias <url> ...`, which records the
// redirect; a new page is captured with `python3 scripts/help_capture.py capture <url>`. refresh-discovery.mjs is
// the other direction: what the help site published since the last run.
//
// Usage: node scripts/capture-queue.mjs [--json] [--limit <n>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allEvidence, buildGraph, loadPublic } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HELP = "https://help.zscaler.com";
const TEXT = /\.(md|mdx|json|go|py|tf|ya?ml|txt|html?|rst|ts|js|mjs)$/i;
const MAX_FILE = 20 << 20;
// Absolute links anywhere; root-relative hrefs only inside help captures, whose HTML is the help site's own.
const ABSOLUTE = /https?:\/\/help\.zscaler\.com(\/[A-Za-z0-9/_.%-]+)/g;
const RELATIVE = /href=\\?"(\/[a-z][A-Za-z0-9/_.%-]+)\\?"/g;

/** A help path as one key: lower case, no trailing slash or punctuation; null for a product root or a file. */
export function helpKey(p) {
  const key = decodeURIComponent(p).toLowerCase().replace(/[.)\],;:]+$/, "").replace(/\/+$/, "");
  const parts = key.split("/").filter(Boolean);
  if (parts.length < 2 || parts[0] === "sites" || /\.[a-z0-9]{2,4}$/.test(key)) return null;
  return `${HELP}${key}`;
}

function* files(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(full);
    else if (TEXT.test(e.name)) yield full;
  }
}

/** The vendor files claims cite, repo-relative. */
export function citedFiles(g) {
  const cited = new Set();
  for (const { ev } of allEvidence(g)) {
    const src = g.sources.sources[ev.source];
    if (src) cited.add(`${src.root}/${ev.path}`);
  }
  return cited;
}

/**
 * The queue: one entry per uncaptured help page with the files that link it (repo-relative), how many of those a
 * claim cites, and the link count. Sorted by cited linkers, then linking files, then links, then URL.
 */
export function captureQueue(root = ROOT, cited = citedFiles(buildGraph(loadPublic(root)))) {
  const captured = new Set();
  const helpDir = path.join(root, "vendor/zscaler-help");
  for (const f of fs.existsSync(helpDir) ? files(helpDir) : []) {
    if (!f.endsWith(".json")) continue;
    try {
      // A capture answers for its page's URL and for the old addresses that redirect to it.
      const src = JSON.parse(fs.readFileSync(f, "utf8"))?.source;
      for (const url of [src?.url, ...(src?.aliases || [])]) if (url?.startsWith(HELP)) captured.add(helpKey(url.slice(HELP.length)) ?? url);
    } catch {
      // Not a capture (or not JSON): it can still link pages, below.
    }
  }
  const pages = new Map();
  const vendor = path.join(root, "vendor");
  for (const f of fs.existsSync(vendor) ? files(vendor) : []) {
    if (fs.statSync(f).size > MAX_FILE) continue;
    const text = fs.readFileSync(f, "utf8");
    const rel = path.relative(root, f).split(path.sep).join("/");
    const keys = [...text.matchAll(ABSOLUTE)].map((m) => helpKey(m[1]));
    if (rel.startsWith("vendor/zscaler-help/")) keys.push(...[...text.matchAll(RELATIVE)].map((m) => helpKey(m[1])));
    for (const key of keys) {
      if (!key || captured.has(key)) continue;
      if (!pages.has(key)) pages.set(key, { url: key, files: new Set(), links: 0 });
      const p = pages.get(key);
      p.files.add(rel);
      p.links++;
    }
  }
  return [...pages.values()]
    .map((p) => {
      const linked = [...p.files].sort();
      return { url: p.url, cited_linkers: linked.filter((x) => cited.has(x)).length, linking_files: linked.length, links: p.links, examples: linked.slice(0, 3) };
    })
    .sort((a, b) => b.cited_linkers - a.cited_linkers || b.linking_files - a.linking_files || b.links - a.links || a.url.localeCompare(b.url));
}

/** The queue as a Markdown table, the first `limit` entries. */
export function markdown(queue, limit = 25) {
  const rows = queue.slice(0, limit).map((q) => `| ${q.url} | ${q.cited_linkers} | ${q.linking_files} | ${q.links} | \`${q.examples[0]}\` |`);
  return [
    `${queue.length} help pages are linked from vendor material but not captured (top ${Math.min(limit, queue.length)}).`,
    "",
    "| Page | Cited linking files | Linking files | Links | For example |",
    "|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}

function main(argv) {
  const limitAt = argv.indexOf("--limit");
  const limit = limitAt === -1 ? 25 : Number(argv[limitAt + 1]);
  if (!Number.isInteger(limit) || limit < 1) {
    console.error("usage: capture-queue.mjs [--json] [--limit <n>]");
    return 2;
  }
  const queue = captureQueue();
  process.stdout.write(argv.includes("--json") ? `${JSON.stringify(queue.slice(0, limit), null, 2)}\n` : markdown(queue, limit));
  return 0;
}

// exitCode, not exit(): exit() drops stdout still buffered for a pipe.
if (import.meta.main) process.exitCode = main(process.argv.slice(2));
