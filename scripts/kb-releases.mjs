// scripts/kb-releases.mjs — parse release-note captures and look up the generated release history layer.
//
// Zscaler publishes each product's release notes as yearly help articles ("Release Upgrade Summary (2025)",
// "App Connector Release Summary (2025)"): a `####` heading per release date, then for each entry a `#####`
// status ("Feature Available", "Feature in Limited Availability") and a `######` title, then its text.
// scripts/gen-releases.mjs writes every captured page into references/_meta/releases/<product>.json, one release
// per dated heading with its entries verbatim (rendered as captureText renders the capture, so a quote taken from an
// entry anchors in the capture); `kb.mjs releases` filters them by product, date and text.
import fs from "node:fs";
import path from "node:path";
import { captureText } from "./kb-lib.mjs";

/** A help-site section's KB product: the product whose subjects cite that section's articles. */
export const SECTION_PRODUCT = {
  aem: "aem",
  "agentic-soc": "soc-workbench",
  "ai-asset-mgmt": "ai-security",
  "authentication-service": "zidentity",
  "breach-predictor": "breach-predictor",
  "business-insights": "business-insights",
  deception: "deception",
  dspm: "dspm",
  easm: "easm",
  "identity-protection": "identity-protection",
  itdr: "identity-protection",
  risk360: "risk360",
  "secure-ai-apps-infra": "ai-security",
  "secure-ai-users": "ai-security",
  uvm: "uvm",
  "workflow-automation": "zwa",
  "zero-trust-branch": "zero-trust-branch",
  "zero-trust-cloud": "cloud-connector",
  "zscaler-cellular": "zscaler-cellular",
  "zscaler-client-connector": "zcc",
  zdx: "zdx",
  zia: "zia",
  zpa: "zpa",
  zpc: "zpc",
  // The Zscaler SDK (ZSDK) has no product directory; its subjects are shared.zsdk.*.
  zsdk: "shared",
};

const PAGE = /^https:\/\/help\.zscaler\.com\/([^/]+)\/[a-z0-9-]*release(?:-upgrade)?-summary-\d{4}$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** The help-site section of a release-note article ("zia", "zero-trust-cloud"), or null for any other capture. */
export function releaseSection(doc) {
  if (doc?.kind !== "help-article") return null;
  return doc.source?.url?.match(PAGE)?.[1] ?? null;
}

function isoDate(heading) {
  const m = heading.match(/^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/);
  const month = m ? MONTHS.indexOf(m[1]) + 1 : 0;
  if (!month) throw new Error(`release heading is not a date: ${heading}`);
  return `${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

/**
 * One page's releases in page order: { date, entries: [{ status, title, body }] }, body being the entry's lines.
 * A layout the parser does not know (a `####` that is not a date, text outside an entry) throws: the vendor
 * changed the page and a person decides how to read it.
 */
export function parseReleasePage(doc) {
  const releases = [];
  let release = null;
  let status = null;
  let entry = null;
  for (const b of doc.blocks) {
    const level = b.heading === undefined ? 0 : b.level;
    if (level === 4) {
      release = { date: isoDate(b.heading), entries: [] };
      releases.push(release);
      status = entry = null;
    } else if (!release) {
      continue; // the article's introduction
    } else if (level === 5) {
      status = b.heading;
      entry = null;
    } else if (level === 6) {
      if (!status) throw new Error(`${release.date}: entry ${b.heading} has no status heading`);
      entry = { status, title: b.heading, blocks: [] };
      release.entries.push(entry);
    } else if (!entry) {
      throw new Error(`${release.date}: text outside an entry: ${JSON.stringify(b).slice(0, 80)}`);
    } else {
      entry.blocks.push(b);
    }
  }
  return releases.map((r) => ({
    date: r.date,
    entries: r.entries.map(({ blocks, ...e }) => ({ ...e, body: blocks.length ? captureText(blocks).trimEnd().split("\n") : [] })),
  }));
}

export function loadReleases(root) {
  const dir = path.join(root, "references/_meta/releases");
  if (!fs.existsSync(dir)) return {};
  return Object.fromEntries(
    fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort().map((f) => [path.basename(f, ".json"), JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))]),
  );
}

/** The layer keys a query names: a KB product key, a help-site section, or a product's title or alias. */
function productKeys(root, layers, query) {
  const q = query.trim().toLowerCase();
  const { products } = JSON.parse(fs.readFileSync(path.join(root, "references/_meta/products.json"), "utf8"));
  const titled = Object.entries(products).find(([, p]) => [p.title, ...(p.aliases || [])].some((n) => n.toLowerCase() === q));
  const key = layers[q] ? q : SECTION_PRODUCT[q] || titled?.[0];
  return key && layers[key] ? [key] : null;
}

/**
 * The releases matching a query, newest first: { product, date, page, title, url, entries }. `since` and `until`
 * are date prefixes (YYYY, YYYY-MM or YYYY-MM-DD; `until` includes the whole period it names); `grep` keeps the
 * entries whose status, title or text contains it, ignoring case. Without a product, every product is searched.
 * Returns null when the product names no layer.
 */
export function lookupReleases(root, { product, since, until, grep } = {}) {
  const layers = loadReleases(root);
  const keys = product ? productKeys(root, layers, product) : Object.keys(layers);
  if (!keys) return null;
  const needle = grep?.toLowerCase();
  const matches = (e) => [e.status, e.title, ...e.body].some((s) => s.toLowerCase().includes(needle));
  const out = [];
  for (const key of keys) {
    for (const r of layers[key].releases) {
      if (since && r.date < since) continue;
      if (until && r.date.slice(0, until.length) > until) continue;
      const entries = needle ? r.entries.filter(matches) : r.entries;
      if (needle && !entries.length) continue;
      const page = layers[key].pages[r.page];
      out.push({ product: key, date: r.date, page: r.page, title: page.title, url: page.url, entries });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date) || a.product.localeCompare(b.product) || a.page.localeCompare(b.page));
}

/** Reading text: a heading per release with its page and capture, an entry per line, and each entry's text when `full`. */
export function releasesText(hits, { full = false } = {}) {
  const lines = [];
  for (const r of hits) {
    lines.push(`## ${r.date} ${r.product}: ${r.title} <${r.url}> (vendor/zscaler-help/${r.page})`);
    if (!r.entries.length) lines.push("- (the capture lists this date with no entries)");
    for (const e of r.entries) {
      lines.push(`- ${e.status}: ${e.title}`);
      if (full) lines.push(...e.body.map((l) => `    ${l}`));
    }
  }
  return lines.length ? `${lines.join("\n")}\n` : "";
}
