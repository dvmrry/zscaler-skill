#!/usr/bin/env node
// gen-releases.mjs — generate the release history layer from the captured release-note articles.
//
// Each release-note article on the help site (scripts/help_capture.py keeps it as vendor/zscaler-help/<page>.json)
// becomes part of references/_meta/releases/<product>.json: its dated releases and their entries, verbatim, parsed
// by kb-releases.mjs. The product is the KB product of the article's help-site section (SECTION_PRODUCT); a
// section with no mapping fails the run, so a newly captured product is assigned before its notes are read.
// Nothing is paraphrased, so the layer needs no claim audit; `kb.mjs releases` reads it.
//
// Usage: node scripts/gen-releases.mjs [--check]
//   --check  exit 1 if a committed file differs from what the captures generate, or is left over.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SECTION_PRODUCT, parseReleasePage, releaseSection } from "./kb-releases.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const HELP = path.join(ROOT, "vendor/zscaler-help");
const OUT = path.join(ROOT, "references/_meta/releases");

const layers = {};
for (const file of fs.readdirSync(HELP).filter((f) => f.endsWith(".json")).sort()) {
  const text = fs.readFileSync(path.join(HELP, file), "utf8");
  if (!text.includes("release")) continue;
  const doc = JSON.parse(text);
  const section = releaseSection(doc);
  if (!section) continue;
  const product = SECTION_PRODUCT[section];
  if (!product) throw new Error(`${file}: help section ${section} has no KB product; add it to SECTION_PRODUCT in scripts/kb-releases.mjs`);
  let releases;
  try {
    releases = parseReleasePage(doc);
  } catch (e) {
    throw new Error(`${file}: ${e.message}`);
  }
  const L = (layers[product] ||= { pages: {}, releases: [] });
  L.pages[file] = {
    title: doc.title,
    url: doc.source.url,
    captured_at: doc.captured_at,
    releases: releases.length,
    entries: releases.reduce((n, r) => n + r.entries.length, 0),
  };
  L.releases.push(...releases.map((r, order) => ({ ...r, page: file, order })));
}

const texts = {};
for (const [product, L] of Object.entries(layers).sort(([a], [b]) => a.localeCompare(b))) {
  // Newest first; one date on two pages (the app and the portal) stays two releases, each in its page's order.
  const releases = L.releases
    .sort((a, b) => b.date.localeCompare(a.date) || a.page.localeCompare(b.page) || a.order - b.order)
    .map(({ date, page, entries }) => ({ date, page, entries }));
  const out = { schema_version: 1, generated_by: "scripts/gen-releases.mjs", product, pages: L.pages, releases };
  texts[`${product}.json`] = `${JSON.stringify(out, null, 1)}\n`;
}

const existing = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((f) => f.endsWith(".json")) : [];
const leftover = existing.filter((f) => !texts[f]);
if (check) {
  const stale = Object.entries(texts).filter(([f, t]) => !fs.existsSync(path.join(OUT, f)) || fs.readFileSync(path.join(OUT, f), "utf8") !== t).map(([f]) => f);
  for (const f of stale) console.error(`references/_meta/releases/${f} is stale; run node scripts/gen-releases.mjs`);
  for (const f of leftover) console.error(`references/_meta/releases/${f} has no release-note captures behind it; run node scripts/gen-releases.mjs`);
  if (stale.length || leftover.length) process.exit(1);
  console.log(`references/_meta/releases is current (${Object.keys(texts).length} products)`);
} else {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of leftover) fs.rmSync(path.join(OUT, f));
  for (const [f, t] of Object.entries(texts)) fs.writeFileSync(path.join(OUT, f), t);
  const pages = Object.values(layers).flatMap((L) => Object.values(L.pages));
  const empty = pages.filter((p) => p.releases && !p.entries).length;
  const count = (k) => pages.reduce((n, p) => n + p[k], 0);
  console.log(`wrote references/_meta/releases: ${Object.keys(texts).length} products, ${pages.length} pages, ${count("releases")} releases, ${count("entries")} entries (${empty} pages list dates with no entries)`);
}
