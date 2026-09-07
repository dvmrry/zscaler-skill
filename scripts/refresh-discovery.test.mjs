import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  LIMITS,
  URLS,
  extractAutomateAssetUrls,
  loadBaseline,
  parseArgs,
  parseGitlinks,
  parseGitmodules,
  parseSitemap,
  renderMarkdown,
  runDiscovery,
} from "./refresh-discovery.mjs";

const GITMODULES = `[submodule "sdk"]
\tpath = vendor/example-sdk
\turl = https://github.com/example/example-sdk.git
`;
const GITLINKS = "160000 abcdef0123456789 0\tvendor/example-sdk\0";
const HELP_V1 = `<?xml version="1.0"?><urlset>
  <url><loc>https://help.zscaler.com/zia/first</loc><lastmod>2026-09-01</lastmod></url>
  <url><loc>https://help.zscaler.com/zpa/second</loc><lastmod>2026-08-01</lastmod></url>
</urlset>`;
const HELP_V2 = `<?xml version="1.0"?><urlset>
  <url><loc>https://help.zscaler.com/zia/first</loc><lastmod>2026-09-07</lastmod></url>
  <url><loc>https://help.zscaler.com/zcc/new</loc><lastmod>2026-09-06</lastmod></url>
</urlset>`;
const AUTOMATE_HOME = `<html><script src="/assets/js/runtime~main.1.js"></script><script src="/assets/js/main.1.js"></script><script src="/assets/js/chunk.1.js"></script></html>`;
const AUTOMATE_HOME_V2 = `<html><script src="/assets/js/runtime~main.2.js"></script><script src="/assets/js/main.1.js"></script></html>`;

function response(body, { status = 200, headers = {}, url } = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers,
    url,
    async text() { return body; },
  };
}

function fakeGit() {
  return async (args) => {
    if (args[0] === "ls-files") return { status: 0, stdout: GITLINKS, stderr: "" };
    throw new Error(`unexpected git command: ${args.join(" ")}`);
  };
}

function fakeGh({ head = "1111111111111111111111111111111111111111", tag = "v1.0.0", fail = false } = {}) {
  return async (args) => {
    if (fail) return { status: 1, stdout: "", stderr: "private token should not be copied" };
    const endpoint = args[1];
    if (endpoint === "repos/example/example-sdk") return { status: 0, stdout: JSON.stringify({ default_branch: "main" }), stderr: "" };
    if (endpoint.includes("/commits/")) return { status: 0, stdout: JSON.stringify({ sha: head }), stderr: "" };
    if (endpoint.endsWith("/releases/latest")) return { status: 0, stdout: JSON.stringify({ tag_name: tag, published_at: "2026-09-01T00:00:00Z", html_url: "https://github.com/example/example-sdk/releases/tag/v1.0.0" }), stderr: "" };
    throw new Error(`unexpected gh command: ${args.join(" ")}`);
  };
}

function fakeFetch({ help = HELP_V1, home = AUTOMATE_HOME, assetBodies = { "runtime~main.1.js": "runtime-one", "main.1.js": "main-one" }, fail = false, notModified = false } = {}) {
  return async (url) => {
    if (fail) throw new Error("network unavailable");
    if (notModified) return response("", { status: 304, headers: { etag: "same" }, url });
    if (url === URLS.helpSitemap) return response(help, { headers: { etag: "help-v1" }, url });
    if (url === URLS.automateHome) return response(home, { headers: { etag: "home-v1" }, url });
    const name = path.posix.basename(new URL(url).pathname);
    if (Object.hasOwn(assetBodies, name)) return response(assetBodies[name], { headers: { etag: `${name}-etag` }, url });
    return response("missing", { status: 404, url });
  };
}

function cleanOptions() {
  return {
    delay: async () => {},
  };
}

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "refresh-discovery-root-"));
  fs.writeFileSync(path.join(root, ".gitmodules"), GITMODULES);
  return root;
}

test("parses .gitmodules/index gitlinks, sitemap lastmod, and only main/runtime assets", () => {
  assert.deepEqual(parseGitmodules(GITMODULES), [{ name: "sdk", path: "vendor/example-sdk", url: "https://github.com/example/example-sdk.git" }]);
  assert.equal(parseGitlinks(GITLINKS).get("vendor/example-sdk"), "abcdef0123456789");
  assert.equal(parseSitemap(HELP_V1).urls.length, 2);
  assert.deepEqual(extractAutomateAssetUrls(AUTOMATE_HOME), [
    { url: "https://automate.zscaler.com/assets/js/main.1.js", role: "main" },
    { url: "https://automate.zscaler.com/assets/js/runtime~main.1.js", role: "runtime" },
  ]);
});

test("CLI requires explicit external JSON/Markdown paths and validates since", () => {
  const root = makeRoot();
  assert.throws(() => parseArgs(["--markdown", "/tmp/report.md"], { defaultRoot: root }), /--output is required/);
  assert.throws(() => parseArgs(["--output", path.join(root, "report.json"), "--markdown", "/tmp/report.md"], { defaultRoot: root }), /outside the repository/);
  const options = parseArgs(["--output", "/tmp/report.json", "--markdown", "/tmp/report.md", "--since", "2026-09-01"], { defaultRoot: root });
  assert.equal(options.since, "2026-09-01");
});

test("sitemap XML entities are decoded exactly once", () => {
  const sitemap = `<urlset><url><loc>https://help.zscaler.com/zia/page?a=1&amp;b=2&amp;lt;literal&amp;#x2f;&#x41;&#66;&quot;&apos;</loc></url></urlset>`;
  assert.equal(parseSitemap(sitemap).urls[0].url, "https://help.zscaler.com/zia/page?a=1&b=2&lt;literal&#x2f;AB\"'");
});

test("first run bootstraps bounded coverage without calling all URLs changes", async () => {
  const root = makeRoot();
  const result = await runDiscovery({ root, baselineData: {}, baselineExists: false, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch() });
  assert.equal(result.report.bootstrap.firstRun, true);
  assert.deepEqual(result.advancedSources, ["vendor", "help", "automate"]);
  assert.equal(result.report.sources.vendor.status, "bootstrap");
  assert.equal(result.report.sources.help.status, "bootstrap");
  assert.equal(result.report.sources.automate.status, "bootstrap");
  assert.equal(result.report.sources.help.changes.count, 0);
  assert.deepEqual(result.report.sources.help.changes.candidates, []);
  assert.equal(result.report.sources.automate.changes.count, 0);
  assert.equal(result.report.sources.automate.captureRecommendation, "bootstrap");
  assert.match(result.report.sources.automate.message, /Bootstrap observations/);
  assert.match(renderMarkdown(result.report), /no page bodies are emitted|No Help pages/);
});

test("unchanged second run uses 304 observations and recommends no full Automate capture", async () => {
  const root = makeRoot();
  const first = await runDiscovery({ root, baselineData: {}, baselineExists: false, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch() });
  const second = await runDiscovery({ root, baselineData: first.nextBaseline, baselineExists: true, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch({ notModified: true }) });
  assert.equal(second.report.sources.help.status, "success");
  assert.equal(second.report.sources.help.changes.count, 0);
  assert.equal(second.report.sources.automate.status, "success");
  assert.equal(second.report.sources.automate.captureRecommendation, "none");
  assert.match(second.report.sources.automate.message, /no full Automate capture/i);
});

test("source changes produce bounded candidates and do not claim semantic integration", async () => {
  const root = makeRoot();
  const first = await runDiscovery({ root, baselineData: {}, baselineExists: false, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch() });
  const changed = await runDiscovery({ root, baselineData: first.nextBaseline, baselineExists: true, since: "2026-09-01", ...cleanOptions(), git: fakeGit(), gh: fakeGh({ head: "2222222222222222222222222222222222222222", tag: "v2.0.0" }), fetcher: fakeFetch({ help: HELP_V2, home: AUTOMATE_HOME_V2, assetBodies: { "runtime~main.2.js": "runtime-two", "main.1.js": "main-one" } }) });
  assert.ok(changed.report.sources.vendor.changes.count >= 2);
  assert.ok(changed.report.sources.help.changes.count >= 2);
  assert.equal(changed.report.sources.help.changes.productCounts.zia, 1);
  assert.equal(changed.report.sources.automate.changes.count >= 1, true);
  assert.equal(changed.report.sources.automate.captureRecommendation, "candidate-only");
  assert.match(changed.report.sources.automate.changes.examples[0].note, /semantic API delta/);
  assert.doesNotMatch(JSON.stringify(changed.report), /incorporated/i);
});

test("failed upstream checks are unknown and preserve the previous baseline", async () => {
  const root = makeRoot();
  const first = await runDiscovery({ root, baselineData: {}, baselineExists: false, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch() });
  const priorJson = JSON.stringify(first.nextBaseline);
  const failed = await runDiscovery({ root, baselineData: first.nextBaseline, baselineExists: true, ...cleanOptions(), git: fakeGit(), gh: fakeGh({ fail: true }), fetcher: fakeFetch({ fail: true }) });
  assert.equal(failed.report.sources.vendor.status, "unknown");
  assert.equal(failed.report.sources.help.status, "unknown");
  assert.equal(failed.report.sources.automate.status, "unknown");
  assert.deepEqual(failed.advancedSources, []);
  assert.equal(JSON.stringify(failed.nextBaseline), priorJson);
  assert.match(JSON.stringify(failed.report), /request failed|unavailable/);
  assert.doesNotMatch(JSON.stringify(failed.report), /private token should not be copied/);
});

test("failed baseline restore is unknown and cannot publish a replacement baseline", async () => {
  const root = makeRoot();
  const result = await runDiscovery({
    root,
    baselineData: {},
    baselineExists: false,
    baselineRestoreFailed: true,
    ...cleanOptions(),
    git: fakeGit(),
    gh: fakeGh(),
    fetcher: fakeFetch(),
  });
  assert.equal(result.report.overall.status, "unknown");
  assert.deepEqual(result.report.overall.unknownSources, ["vendor", "help", "automate"]);
  assert.equal(result.report.baseline.restoreFailed, true);
  assert.deepEqual(result.advancedSources, []);
  assert.equal(result.report.sources.vendor.baselineAdvanced, false);
  assert.match(result.report.bootstrap.note, /could not be restored|replacement baseline/i);
  assert.match(renderMarkdown(result.report), /baseline restore failed/i);
});

test("incomplete Help sitemap coverage does not emit removals or advance Help baseline", async () => {
  const root = makeRoot();
  const first = await runDiscovery({
    root,
    baselineData: {},
    baselineExists: false,
    ...cleanOptions(),
    git: fakeGit(),
    gh: fakeGh(),
    fetcher: fakeFetch(),
  });
  const child = "https://help.zscaler.com/sitemap-child.xml";
  const missing = "https://help.zscaler.com/sitemap-missing.xml";
  const incompleteRoot = `<sitemapindex><sitemap><loc>${child}</loc></sitemap><sitemap><loc>${missing}</loc></sitemap></sitemapindex>`;
  const incompleteChild = `<urlset><url><loc>https://help.zscaler.com/zia/first</loc><lastmod>2026-09-07</lastmod></url></urlset>`;
  const fallback = fakeFetch();
  const fetcher = async (url) => {
    if (url === URLS.helpSitemap) return response(incompleteRoot, { url });
    if (url === child) return response(incompleteChild, { url });
    if (url === missing) return response("upstream unavailable", { status: 503, url });
    return fallback(url);
  };
  const result = await runDiscovery({
    root,
    baselineData: first.nextBaseline,
    baselineExists: true,
    ...cleanOptions(),
    git: fakeGit(),
    gh: fakeGh(),
    fetcher,
  });
  assert.equal(result.report.sources.help.status, "partial");
  assert.match(JSON.stringify(result.report.sources.help.failures), /sitemap-missing|503/);
  assert.equal(result.report.sources.help.removals.count, 0);
  assert.ok(result.report.sources.help.changes.count >= 1);
  assert.ok(!result.advancedSources.includes("help"));
  assert.deepEqual(result.nextBaseline.sources.help, first.nextBaseline.sources.help);
});

test("gh 404 release response is the only release absence accepted", async () => {
  const root = makeRoot();
  const gh = async (args) => {
    const endpoint = args[1];
    if (endpoint === "repos/example/example-sdk") return { status: 0, stdout: JSON.stringify({ default_branch: "main" }), stderr: "" };
    if (endpoint.includes("/commits/")) return { status: 0, stdout: JSON.stringify({ sha: "1111111111111111111111111111111111111111" }), stderr: "" };
    return { status: 1, stdout: "", stderr: "gh: Not Found (HTTP 404)" };
  };
  const result = await runDiscovery({ root, ...cleanOptions(), git: fakeGit(), gh, fetcher: fakeFetch() });
  assert.equal(result.report.sources.vendor.coverage.successful, 1);
  assert.equal(result.report.sources.vendor.failures.length, 0);
  assert.equal(result.nextBaseline.sources.vendor.observations["vendor/example-sdk"].latestRelease, null);
});

test("credential-bearing submodule URLs are redacted before report/baseline output", async () => {
  const root = makeRoot();
  fs.writeFileSync(path.join(root, ".gitmodules"), `[submodule "sdk"]\npath = vendor/example-sdk\nurl = https://token-user:super-secret-token@github.com/example/example-sdk.git?private=1\n`);
  const result = await runDiscovery({ root, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch() });
  const serialized = JSON.stringify({ report: result.report, baseline: result.nextBaseline });
  assert.doesNotMatch(serialized, /super-secret-token|token-user|private=1/);
  assert.equal(result.report.sources.vendor.inventory[0].url, "https://github.com/example/example-sdk.git");
});

test("the JSON queue retains candidates beyond the bounded Markdown examples", async () => {
  const root = makeRoot();
  const count = LIMITS.maxExamples + 5;
  const help = `<urlset>${Array.from({ length: count }, (_, i) =>
    `<url><loc>https://help.zscaler.com/zia/candidate-${i}</loc><lastmod>2026-09-07</lastmod></url>`).join("")}</urlset>`;
  const result = await runDiscovery({ root, since: "2026-09-01", ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher: fakeFetch({ help }) });
  const changes = result.report.sources.help.changes;
  assert.equal(changes.count, count);
  assert.equal(changes.candidates.length, count);
  assert.equal(changes.examples.length, LIMITS.maxExamples);
  assert.equal((renderMarkdown(result.report).match(/\/zia\/candidate-\d+/g) ?? []).length, LIMITS.maxExamples);
});

test("an unchanged sitemap index does not hide a changed child sitemap", async () => {
  const root = makeRoot();
  const child = "https://help.zscaler.com/sitemap-child.xml";
  const index = `<sitemapindex><sitemap><loc>${child}</loc></sitemap></sitemapindex>`;
  const fallback = fakeFetch();
  let currentHelp = HELP_V1;
  let childReads = 0;
  const fetcher = async (url) => {
    if (url === URLS.helpSitemap) return response(index, { headers: { etag: "same-index" }, url });
    if (url === child) {
      childReads += 1;
      return response(currentHelp, { url });
    }
    return fallback(url);
  };
  const first = await runDiscovery({ root, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher });
  currentHelp = HELP_V2;
  const second = await runDiscovery({ root, baselineExists: true, baselineData: first.nextBaseline, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher });
  assert.equal(childReads, 2);
  assert.equal(second.report.sources.help.status, "success");
  assert.ok(second.report.sources.help.changes.count > 0);
});

test("oversized streamed responses are aborted and cancelled without advancing the source", async () => {
  const root = makeRoot();
  const fallback = fakeFetch();
  const signals = [];
  let cancelled = 0;
  const fetcher = async (url, options) => {
    if (url !== URLS.helpSitemap) return fallback(url);
    signals.push(options.signal);
    return {
      status: 200, ok: true, headers: {}, url,
      body: {
        getReader() {
          return {
            async read() { return { done: false, value: new Uint8Array(LIMITS.maxBytes + 1) }; },
            async cancel() { cancelled += 1; },
            releaseLock() {},
          };
        },
      },
    };
  };
  const result = await runDiscovery({ root, ...cleanOptions(), git: fakeGit(), gh: fakeGh(), fetcher });
  assert.equal(result.report.sources.help.status, "unknown");
  assert.ok(!result.advancedSources.includes("help"));
  assert.ok(signals.length > 0);
  assert.ok(cancelled >= signals.length);
  assert.ok(signals.every(signal => signal.aborted));
});
