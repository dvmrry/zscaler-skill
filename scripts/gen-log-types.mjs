#!/usr/bin/env node
// gen-log-types.mjs — generate ZIA NSS log types from the captured feed-format CSVs.
//
// Zscaler publishes each NSS feed format as a table (Table, Field, Description, Example, Insights Logs);
// the capture keeps it as CSV in vendor/zscaler-help/nss-<feed>-logs.csv. Each row becomes a field of
// references/zia/types/<feed>-log.json, keyed by the NSS token name (`%s{action}` -> `action`), with the
// Insights column as its label and the row itself as its evidence, so the validator re-anchors every field
// against the capture. Type-level metadata (title, names, aliases) is kept from the existing file.
//
// Usage: node scripts/gen-log-types.mjs [--check]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const FEEDS = {
  web: { title: "ZIA web log (NSS web feed)", aliases: ["nss web log", "zia web logs", "web insights logs", "zia proxy logs"] },
  firewall: { title: "ZIA firewall log (NSS firewall feed)", aliases: ["nss firewall log", "zia firewall logs", "firewall insights logs"] },
  dns: { title: "ZIA DNS log (NSS DNS feed)", aliases: ["nss dns log", "zia dns logs", "dns insights logs"] },
};

/** Parse CSV text into rows of cells, keeping each row's raw source line(s). */
function parseCsv(text) {
  const rows = [];
  let i = 0;
  while (i < text.length) {
    const start = i;
    const cells = [];
    let cell = "";
    let quoted = false;
    for (; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") { cells.push(cell); cell = ""; }
      else if (c === "\n") { i++; break; }
      else if (c !== "\r") cell += c;
    }
    cells.push(cell);
    if (cells.some((x) => x !== "")) rows.push({ cells, raw: text.slice(start, i).replace(/\r?\n$/, "") });
  }
  return rows;
}

const TYPES = { s: "string", d: "integer", ld: "integer", f: "number" };

/** A quote from the raw row: the token through the start of its description, unique in the file. */
function quoteFor(raw, token, text) {
  const at = raw.indexOf(token);
  let q = raw.slice(at, at + 90);
  if (q.length === 90) q = q.slice(0, q.lastIndexOf(" ") > token.length ? q.lastIndexOf(" ") : 90);
  q = q.replace(/[\s,"]+$/, "");
  return text.split(q).length === 2 ? q : null;
}

let stale = 0;
for (const [feed, meta] of Object.entries(FEEDS)) {
  const src = `nss-${feed}-logs.csv`;
  const text = fs.readFileSync(path.join(ROOT, "vendor/zscaler-help", src), "utf8");
  const [header, ...rows] = parseCsv(text);
  const col = Object.fromEntries(header.cells.map((h, i) => [h.trim(), i]));
  const fields = {};
  const skipped = [];
  for (const { cells, raw } of rows) {
    const token = cells[col.Field]?.trim();
    const m = token?.match(/^%(\d*)([a-z]+)\{([^}]+)\}$/);
    if (!m) { skipped.push(token); continue; }
    const name = m[3];
    if (fields[name]) { skipped.push(token); continue; } // one entry per token; the first row is the field
    const quote = quoteFor(raw, token, text);
    // The Insights column holds the console column name, or a note ("This field is ...") when there is none.
    const insights = cells[col["Insights Logs"]]?.trim() || "";
    const note = /^This field\b/.test(insights);
    fields[name] = {
      type: TYPES[m[2]] || "string",
      ...(insights && !note ? { label: insights } : {}),
      description: cells[col.Description].trim() + (note ? ` (Insights: ${insights})` : ""),
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
    evidence: [{ source: "zscaler-help", path: src, quotes: ["Table,Field,Description,Example,Insights Logs"] }],
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
