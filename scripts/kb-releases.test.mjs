import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { lookupReleases, parseReleasePage, releaseSection, releasesText } from "./kb-releases.mjs";

const page = (blocks, url = "https://help.zscaler.com/zia/release-upgrade-summary-2025") => ({ kind: "help-article", title: "Release Upgrade Summary (2025)", source: { url }, blocks });

test("a release-note article is a dated release summary page; other articles are not", () => {
  assert.equal(releaseSection(page([])), "zia");
  assert.equal(releaseSection(page([], "https://help.zscaler.com/zpa/app-connector-release-summary-2026")), "zpa");
  assert.equal(releaseSection(page([], "https://help.zscaler.com/zero-trust-cloud/zscaler-client-connector-vdi-release-summary-2024")), "zero-trust-cloud");
  assert.equal(releaseSection(page([], "https://help.zscaler.com/zia/about-url-filtering")), null);
  assert.equal(releaseSection({ ...page([]), kind: "help-api-spec" }), null);
});

test("each dated heading is a release; a status carries to every entry under it; the body renders as the capture does", () => {
  const releases = parseReleasePage(page([
    { text: "This article provides a summary of all new features." },
    { heading: "December 9, 2025", level: 4 },
    { heading: "Feature Available", level: 5 },
    { heading: "Paginated rules", level: 6 },
    { text: "Rules are paginated." },
    { heading: "Filters", level: 1 },
    { item: "Rule Name", depth: 0 },
    { table: [["Policy"], ["Block"]] },
    { heading: "Bare entry", level: 6 },
    { heading: "Feature in Limited Availability", level: 5 },
    { heading: "Preview", level: 6 },
    { text: "Limited." },
    { heading: "November 21, 2025", level: 4 },
  ]));
  assert.deepEqual(releases, [
    {
      date: "2025-12-09",
      entries: [
        { status: "Feature Available", title: "Paginated rules", body: ["Rules are paginated.", "# Filters", "- Rule Name", "| Policy |", "|---|", "| Block |"] },
        { status: "Feature Available", title: "Bare entry", body: [] },
        { status: "Feature in Limited Availability", title: "Preview", body: ["Limited."] },
      ],
    },
    { date: "2025-11-21", entries: [] },
  ]);
});

test("a layout the parser does not know fails instead of being guessed at", () => {
  assert.throws(() => parseReleasePage(page([{ heading: "Coming Soon", level: 4 }])), /not a date: Coming Soon/);
  assert.throws(() => parseReleasePage(page([{ heading: "May 1, 2025", level: 4 }, { text: "loose" }])), /text outside an entry/);
  assert.throws(() => parseReleasePage(page([{ heading: "May 1, 2025", level: 4 }, { heading: "Untyped", level: 6 }])), /no status heading/);
});

function fixtureRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-releases-"));
  fs.mkdirSync(path.join(root, "references/_meta/releases"), { recursive: true });
  fs.writeFileSync(path.join(root, "references/_meta/products.json"), JSON.stringify({ products: { "cloud-connector": { title: "Cloud & Branch Connector", aliases: ["ZTW"] }, zia: { title: "Zscaler Internet Access", aliases: ["ZIA"] } } }));
  const layer = (product, url, releases) => ({ product, pages: { "p.json": { title: "Release Upgrade Summary (2025)", url } }, releases: releases.map((r) => ({ ...r, page: "p.json" })) });
  const entry = (title, body = []) => ({ status: "Feature Available", title, body });
  const write = (l) => fs.writeFileSync(path.join(root, `references/_meta/releases/${l.product}.json`), JSON.stringify(l));
  write(layer("zia", "https://help.zscaler.com/zia/r", [
    { date: "2025-07-01", entries: [entry("URL Filtering pagination", ["Up to 100 rules per page."]), entry("DLP dictionaries")] },
    { date: "2025-06-30", entries: [entry("Firewall logs")] },
    { date: "2025-05-15", entries: [] },
  ]));
  write(layer("cloud-connector", "https://help.zscaler.com/zero-trust-cloud/r", [{ date: "2025-06-10", entries: [entry("Branch Connector url filtering")] }]));
  return root;
}

test("a product is named by its key, its help-site section, or its title or alias", () => {
  const root = fixtureRoot();
  for (const q of ["zia", "ZIA", "Zscaler Internet Access"]) assert.deepEqual(lookupReleases(root, { product: q }).map((r) => r.date), ["2025-07-01", "2025-06-30", "2025-05-15"]);
  for (const q of ["zero-trust-cloud", "ztw"]) assert.equal(lookupReleases(root, { product: q })[0].product, "cloud-connector");
  assert.equal(lookupReleases(root, { product: "zpa" }), null);
});

test("--until includes the whole period it names; --since starts at its first day", () => {
  const root = fixtureRoot();
  const dates = (q) => lookupReleases(root, { product: "zia", ...q }).map((r) => r.date);
  assert.deepEqual(dates({ until: "2025-06" }), ["2025-06-30", "2025-05-15"]);
  assert.deepEqual(dates({ since: "2025-06" }), ["2025-07-01", "2025-06-30"]);
  assert.deepEqual(dates({ since: "2025-06-30", until: "2025-06-30" }), ["2025-06-30"]);
  assert.deepEqual(dates({ since: "2026" }), []);
});

test("--grep keeps matching entries across every product, ignoring case, and drops releases left empty", () => {
  const root = fixtureRoot();
  const hits = lookupReleases(root, { grep: "URL filtering" });
  assert.deepEqual(hits.map((r) => [r.product, r.date, r.entries.map((e) => e.title)]), [
    ["zia", "2025-07-01", ["URL Filtering pagination"]],
    ["cloud-connector", "2025-06-10", ["Branch Connector url filtering"]],
  ]);
  assert.deepEqual(lookupReleases(root, { product: "zia", grep: "100 RULES" })[0].entries.map((e) => e.title), ["URL Filtering pagination"]);
  const text = releasesText(lookupReleases(root, { product: "zia", until: "2025-05" }));
  assert.match(text, /^## 2025-05-15 zia: Release Upgrade Summary \(2025\) <https:\/\/help\.zscaler\.com\/zia\/r> \(vendor\/zscaler-help\/p\.json\)\n- \(the capture lists this date with no entries\)\n$/);
  assert.match(releasesText(hits, { full: true }), /- Feature Available: URL Filtering pagination\n {4}Up to 100 rules per page\.\n/);
});
