#!/usr/bin/env node
// gen-log-types.mjs — generate log types from captured help articles: ZIA NSS feeds, ZPA LSS log types and
// Cloud & Branch Connector NSS feeds.
//
// Zscaler publishes each NSS feed format as a help article ("NSS Feed Output Format: Web Logs") whose
// tables list Field, Description, Example and Insights Logs, one table per field category under its own
// heading. scripts/help_capture.py keeps the article as vendor/zscaler-help/nss-feed-output-format-<feed>-logs.json.
// Each table row becomes a field of references/zia/types/<feed>-log.json, keyed by the NSS token name
// (`%s{action}` -> `action`), with the Insights column as its label and the row as its evidence, so the
// validator re-anchors every field against the capture. Type-level metadata (title, names, aliases) is
// kept from the existing file.
//
// ZPA LSS types come from one field-table article per log type, plus the default templates in the LSS API
// article: a field the default template writes gets `default_format` (its json entry and csv token) and
// its type is what the json template emits; a field only the template writes is added under its JSON key.
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

// ZPA Log Streaming Service types: one help article per log type, one Field / Description / Supported
// Field Format Specifications table. The type comes from the formats the field supports (per the LSS
// content-format article: %f a float, %d / %x an integer, %s / %j / %J / %o a string, JSON or hash).
const ZPA = {
  "user-activity-log": { src: "understanding-user-activity-log-fields.json", lss: "zpn_trans_log", aliases: ["user activity log", "zpa access log", "lss user activity"] },
  "user-status-log": { src: "understanding-user-status-log-fields.json", lss: "zpn_auth_log", aliases: ["user status log", "zpa auth log"] },
  "app-connector-status-log": { src: "app-connector-status-log-fields.json", lss: "zpn_ast_auth_log", aliases: ["app connector status log", "connector status log"] },
  "app-connector-metrics-log": { src: "understanding-app-connector-metrics-log-fields.json", lss: "zpn_ast_comprehensive_stats", aliases: ["app connector metrics log", "connector metrics log"] },
  "browser-access-log": { src: "browser-access-log-fields.json", lss: "zpn_http_trans_log", aliases: ["browser access log", "zpa http log"] },
  "audit-log": { src: "understanding-audit-log-fields.json", lss: "zpn_audit_log", aliases: ["zpa audit log", "admin audit log"] },
  "appprotection-log": { src: "understanding-appprotection-log-fields.json", lss: "zpn_waf_http_exchanges_log", aliases: ["appprotection log", "inspection log", "zpa waf log"] },
  "private-service-edge-status-log": { src: "private-service-edge-status-log-fields.json", lss: "zpn_sys_auth_log", aliases: ["private service edge status log", "pse status log"] },
  "private-service-edge-metrics-log": { src: "private-service-edge-metrics-log-fields.json", lss: "zpn_pbroker_comprehensive_stats", aliases: ["private service edge metrics log", "pse metrics log"] },
  "private-cloud-controller-status-log": { src: "private-cloud-controller-status-log-fields.json", lss: "zpn_sitec_auth_log", aliases: ["private cloud controller status log"] },
  "private-cloud-controller-metrics-log": { src: "private-cloud-controller-metrics-log-fields.json", lss: "zpn_sitec_comprehensive_stats", aliases: ["private cloud controller metrics log"] },
  "microsegmentation-flow-log": { src: "microsegmentation-flow-log-fields.json", lss: "zms_flow_log", aliases: ["microsegmentation flow log", "zms flow log"] },
};

function zpaType(formats) {
  const kinds = new Set([...formats.matchAll(/%(?:\[[A-Z]+\])?([a-zA-Z])/g)].map((m) => m[1]));
  return kinds.has("f") ? "number" : kinds.has("d") || kinds.has("x") ? "integer" : "string";
}

// The vendor's default templates: the LSS API article's "Getting Details of All LSS Log Formats" example
// response gives, per log type, the tsv, csv and json format a new receiver starts with. The field tables
// and the templates do not always agree on a field's name (`TimestampUnAuthnetication` in the table,
// `TimestampUnAuthentication` in the template) and a template can carry fields the table lacks. The
// json template writes `"Key": %j{Variable}`, and Key is what a JSON consumer sees, so a table field
// matches a template entry by Key, then by Variable, then either case-insensitively; nothing fuzzier.
const FORMATS_SRC = "configuring-log-streaming-service-configurations-using-api.json";
const TOKEN = /%(?:\[[A-Z]+\])?([a-zA-Z])(?:\([^)]*\))?\{([^}:]+)(?::[^}]+)?\}/g;
const JSON_TYPES = { d: "integer", f: "number", j: "string", s: "string" };

function defaultTemplates() {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, "vendor/zscaler-help", FORMATS_SRC), "utf8"));
  const out = {};
  let on = false;
  let lss = null;
  for (const b of doc.blocks) {
    if (b.heading !== undefined) { on = b.heading.startsWith("Getting Details of All LSS Log Formats"); continue; }
    if (!on || b.item === undefined) continue;
    const t = b.item.trim();
    const key = t.match(/^"(\w+)":\{$/);
    if (key) { lss = key[1]; out[lss] = { anchor: t, csv: {}, json: [] }; continue; }
    const fmt = t.match(/^"(csv|json)":"(.*)",?$/);
    if (!lss || !fmt) continue;
    if (fmt[1] === "csv") {
      for (const m of fmt[2].matchAll(TOKEN)) out[lss].csv[m[2]] ??= m[0];
    } else {
      // "Key": %j{Var} or "Key": [%j(,){Var}], with the quotes escaped in the capture.
      const entry = /\\"(\w+)\\":\s*(\[?)(%(?:\[[A-Z]+\])?([a-zA-Z])(?:\([^)]*\))?\{([^}:]+)(?::[^}]+)?\})\]?/g;
      for (const m of fmt[2].matchAll(entry)) {
        out[lss].json.push({ key: m[1], variable: m[5], raw: m[0], text: m[0].replaceAll('\\"', '"'), type: m[2] ? "array" : JSON_TYPES[m[4]] || "string" });
      }
    }
  }
  return { doc, out };
}

/** The template entry for a table field: by JSON key, then variable, then either ignoring case. */
function templateEntry(entries, field) {
  const lower = field.toLowerCase();
  return entries.find((e) => e.key === field) || entries.find((e) => e.variable === field)
    || entries.find((e) => e.key.toLowerCase() === lower || e.variable.toLowerCase() === lower);
}

let stale = 0;
const write = (target, out, count, skipped) => {
  const json = JSON.stringify(out, null, 2) + "\n";
  const rel = path.relative(ROOT, target);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== json) { console.error(`${rel} is stale`); stale++; }
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, json);
    console.log(`wrote ${rel}: ${count} fields${skipped.length ? `; skipped ${skipped.length} rows (${skipped.slice(0, 4).join(", ")})` : ""}`);
  }
};

const templates = defaultTemplates();
const templatesText = captureText(templates.doc.blocks);

/** Evidence for a template entry: its json text, first after the log type's key in the example response. */
function templateEvidence(tpl, e) {
  if (templatesText.split(tpl.anchor).length !== 2) return [];
  return [{ source: "zscaler-help", path: FORMATS_SRC, after: tpl.anchor, quotes: [e.raw] }];
}

/** How the default template writes a field: its json entry and, when present, its csv token. */
const defaultFormat = (tpl, e) => ({ json: e.text, ...(tpl.csv[e.variable] ? { csv: tpl.csv[e.variable] } : {}) });

for (const [name, meta] of Object.entries(ZPA)) {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, "vendor/zscaler-help", meta.src), "utf8"));
  const text = captureText(doc.blocks);
  const tpl = templates.out[meta.lss];
  if (!tpl) throw new Error(`gen-log-types: no default template for ${meta.lss} in ${FORMATS_SRC}`);
  const fields = {};
  const skipped = [];
  const used = new Set();
  for (const { cells, row } of tableRows(doc)) {
    const field = cells.Field?.trim();
    if (!field || !/^[\w.:-]+$/.test(field) || fields[field]) { skipped.push(field); continue; }
    const quote = quoteFor(row, text);
    const formats = cells["Supported Field Format Specifications"]?.trim() || "";
    const e = templateEntry(tpl.json, field);
    if (e) used.add(e);
    fields[field] = {
      // The type a default JSON receiver emits; the table's formats otherwise.
      type: e ? e.type : zpaType(formats),
      description: cells.Description.trim() + (formats ? ` (LSS formats: ${formats})` : ""),
      ...(e ? { default_format: defaultFormat(tpl, e) } : {}),
      evidence: [
        ...(quote ? [{ source: "zscaler-help", path: meta.src, quotes: [quote] }] : []),
        ...(e ? templateEvidence(tpl, e) : []),
      ],
    };
    if (!fields[field].evidence.length) delete fields[field].evidence;
  }
  // Fields the default template emits that the table does not list, keyed as a JSON consumer sees them.
  for (const e of tpl.json) {
    if (used.has(e) || fields[e.key]) continue;
    fields[e.key] = {
      type: e.type,
      description: `Emitted by the default ${meta.lss} template; the field table does not list it.`,
      default_format: defaultFormat(tpl, e),
      evidence: templateEvidence(tpl, e),
    };
  }
  const target = path.join(ROOT, "references/zpa/types", `${name}.json`);
  const prev = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : {};
  write(target, {
    schema_version: 1,
    id: `zpa/${name}`,
    kind: "log",
    product: "zpa",
    title: prev.title || `ZPA ${doc.title.replace(/^Understanding /, "").replace(/ Fields$/, "")} (LSS ${meta.lss})`,
    aliases: prev.aliases || [meta.lss, ...meta.aliases],
    evidence: [{ source: "zscaler-help", path: meta.src, quotes: [text.split("\n")[0].slice(0, 120).replace(/\s+\S*$/, "")] }],
    fields,
  }, Object.keys(fields).length, skipped);
}

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
  write(target, out, Object.keys(fields).length, skipped);
}
// Cloud & Branch Connector NSS feeds (API and SDK scope `ztw`): one "NSS Feed Output Format" article per feed,
// tables of Field (or "Field in Logs"), Description and Example under category headings. The metrics article
// holds three record kinds, each under its own top-level heading (VM, Instance, Resource) with the same
// category headings below it, so each kind is its own type. An Events row can carry two tokens
// (`%s{attr1_name}, %s{attr1_val}`); each token becomes a field.
const ZTW = {
  "session-log": { src: "cbc-nss-feed-output-format-session-logs.json", aliases: ["cloud connector session log", "branch connector session log", "cbc session logs"] },
  "dns-log": { src: "cbc-nss-feed-output-format-dns-logs.json", aliases: ["cloud connector dns log", "branch connector dns log", "cbc dns logs"] },
  "event-log": { src: "cbc-nss-feed-output-format-event-logs.json", aliases: ["cloud connector event log", "branch connector event log", "cbc event logs"] },
  "metrics-vm-log": { src: "cbc-nss-feed-output-format-metrics-logs.json", section: "VM", aliases: ["cloud connector vm metrics log", "cbc vm metrics"] },
  "metrics-instance-log": { src: "cbc-nss-feed-output-format-metrics-logs.json", section: "Instance", aliases: ["cloud connector instance metrics log", "cbc instance metrics"] },
  "metrics-resource-log": { src: "cbc-nss-feed-output-format-metrics-logs.json", section: "Resource", aliases: ["cloud connector resource metrics log", "cbc resource metrics"] },
};
const ZTW_SECTIONS = new Set(["VM", "Instance", "Resource"]);

for (const [name, meta] of Object.entries(ZTW)) {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, "vendor/zscaler-help", meta.src), "utf8"));
  const text = captureText(doc.blocks);
  const fields = {};
  const skipped = [];
  let section = null;
  let heading = null;
  for (const b of doc.blocks) {
    if (b.heading !== undefined) {
      if (ZTW_SECTIONS.has(b.heading)) section = b.heading;
      heading = b.heading;
      continue;
    }
    if (!b.table || (meta.section && section !== meta.section)) continue;
    const [header, ...body] = b.table;
    for (const row of body) {
      const cells = Object.fromEntries(header.map((h, i) => [h.trim(), row[i] ?? ""]));
      const tokens = [...(cells.Field ?? cells["Field in Logs"] ?? "").matchAll(/%(\d*)([a-z]*)\{([^}]+)\}/g)]; // one DNS row is written `%{...}`, without a type letter
      if (!tokens.length) { skipped.push(cells.Field ?? cells["Field in Logs"]); continue; }
      const quote = quoteFor(row, text);
      for (const m of tokens) {
        if (fields[m[3]]) { skipped.push(m[0]); continue; }
        fields[m[3]] = {
          type: TYPES[m[2]] || "string",
          description: `${cells.Description.trim()}${cells.Example?.trim() ? ` (example: ${cells.Example.trim()})` : ""} [${heading}]`,
          ...(quote ? { evidence: [{ source: "zscaler-help", path: meta.src, quotes: [quote] }] } : {}),
        };
      }
    }
  }
  const target = path.join(ROOT, "references/cloud-connector/types", `${name}.json`);
  const prev = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : {};
  write(target, {
    schema_version: 1,
    id: `ztw/${name}`,
    kind: "log",
    product: "ztw",
    title: prev.title || `Cloud & Branch Connector ${doc.title.replace(/^NSS Feed Output Format: /, "").replace(/ Logs$/, "")}${meta.section ? ` (${meta.section})` : ""} log (NSS feed)`,
    aliases: prev.aliases || meta.aliases,
    evidence: [{ source: "zscaler-help", path: meta.src, quotes: [text.split("\n")[0].slice(0, 120).replace(/\s+\S*$/, "")] }],
    fields,
  }, Object.keys(fields).length, skipped);
}

if (check) {
  if (stale) { console.error("run node scripts/gen-log-types.mjs"); process.exit(1); }
  console.log("log types are current");
}
