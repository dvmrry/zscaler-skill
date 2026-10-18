#!/usr/bin/env node
// gen-log-types.mjs — generate ZIA NSS log types from the captured NSS feed-format articles.
//
// Zscaler publishes each NSS feed format as a help article ("NSS Feed Output Format: Web Logs") whose
// tables list Field, Description, Example and Insights Logs, one table per field category under its own
// heading. scripts/help_capture.py keeps the article as vendor/zscaler-help/nss-feed-output-format-<feed>-logs.json.
// Each table row becomes a field of references/zia/types/<feed>-log.json, keyed by the NSS token name
// (`%s{action}` -> `action`), with the Insights column as its label and the row as its evidence, so the
// validator re-anchors every field against the capture. Type-level metadata (title, names, aliases) is
// kept from the existing file.
//
// Usage: node scripts/gen-log-types.mjs [--check]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { captureText } from "./kb-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const FEEDS = {
  web: { title: "ZIA web log (NSS web feed)", aliases: ["nss web log", "zia web logs", "web insights logs", "zia proxy logs"] },
  firewall: { title: "ZIA firewall log (NSS firewall feed)", aliases: ["nss firewall log", "zia firewall logs", "firewall insights logs"] },
  dns: { title: "ZIA DNS log (NSS DNS feed)", aliases: ["nss dns log", "zia dns logs", "dns insights logs"] },
};

/** The article's table rows, each with the heading of the table it is in. */
function tableRows(doc) {
  const rows = [];
  let heading = null;
  for (const b of doc.blocks) {
    if (b.heading !== undefined) heading = b.heading;
    if (!b.table) continue;
    const [header, ...body] = b.table;
    for (const cells of body) rows.push({ heading, cells: Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ""])), row: cells });
  }
  return rows;
}

const TYPES = { s: "string", d: "integer", ld: "integer", f: "number" };

/** A quote from the row as the anchoring text writes it: the start of the row, unique in the text. */
function quoteFor(row, text) {
  const line = `| ${row.map((c) => c.replaceAll("|", "\\|")).join(" | ")} |`;
  let q = line.slice(0, 90);
  if (q.length === 90) q = q.slice(0, q.lastIndexOf(" ") > 20 ? q.lastIndexOf(" ") : 90);
  q = q.replace(/[\s|]+$/, "");
  return text.split(q).length === 2 ? q : null;
}

let stale = 0;
for (const [feed, meta] of Object.entries(FEEDS)) {
  const src = `nss-feed-output-format-${feed}-logs.json`;
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, "vendor/zscaler-help", src), "utf8"));
  const text = captureText(doc.blocks);
  const fields = {};
  const skipped = [];
  for (const { cells, row } of tableRows(doc)) {
    const token = cells.Field?.trim();
    const m = token?.match(/^%(\d*)([a-z]+)\{([^}]+)\}$/);
    if (!m) { skipped.push(token); continue; }
    const name = m[3];
    if (fields[name]) { skipped.push(token); continue; } // one entry per token; the first row is the field
    const quote = quoteFor(row, text);
    // The Insights column holds the console column name, or a note ("This field is ...") when there is none.
    const insights = cells["Insights Logs"]?.trim() || "";
    const note = /^This field\b/.test(insights);
    fields[name] = {
      type: TYPES[m[2]] || "string",
      ...(insights && !note ? { label: insights } : {}),
      description: cells.Description.trim() + (note ? ` (Insights: ${insights})` : ""),
      ...(quote ? { evidence: [{ source: "zscaler-help", path: src, quotes: [quote] }] } : {}),
    };
  }
  const target = path.join(ROOT, "references/zia/types", `${feed}-log.json`);
  const prev = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : {};
  const out = {
    schema_version: 1,
    id: `zia/${feed}-log`,
    kind: "log",
    product: "zia",
    title: prev.title || meta.title,
    names: prev.names || { nss: feed },
    aliases: prev.aliases || meta.aliases,
    evidence: [{ source: "zscaler-help", path: src, quotes: [text.split("\n")[0].slice(0, 120).replace(/\s+\S*$/, "")] }],
    fields,
  };
  const json = JSON.stringify(out, null, 2) + "\n";
  const rel = path.relative(ROOT, target);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== json) { console.error(`${rel} is stale`); stale++; }
  } else {
    fs.writeFileSync(target, json);
    console.log(`wrote ${rel}: ${Object.keys(fields).length} fields${skipped.length ? `; skipped ${skipped.length} rows (${skipped.slice(0, 4).join(", ")})` : ""}`);
  }
}
if (check) {
  if (stale) { console.error("run node scripts/gen-log-types.mjs"); process.exit(1); }
  console.log("log types are current");
}
