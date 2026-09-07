#!/usr/bin/env node

/* Read-only, bounded publication discovery for the skill maintenance cadence. */

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs as parseNodeArgs } from "node:util";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_NAMES = ["vendor", "help", "automate"];
export const URLS = Object.freeze({
  helpSitemap: "https://help.zscaler.com/sitemap.xml",
  automateHome: "https://automate.zscaler.com/",
});
export const LIMITS = Object.freeze({
  concurrency: 4,
  retries: 2,
  timeoutMs: 15_000,
  rateLimitMs: 250,
  retryDelayMs: 500,
  maxExamples: 12,
  maxSitemaps: 8,
  maxUrls: 10_000,
  maxBytes: 8 * 1024 * 1024,
});

const REPORT_VERSION = 1;
const BASELINE_VERSION = 1;

function showUsage(code = 0) {
  const stream = code === 0 ? process.stdout : process.stderr;
  stream.write(`Usage: node scripts/refresh-discovery.mjs --output <path> --markdown <path>
  [--baseline <path>] [--since YYYY-MM-DD] [--root <path>]

The scan reads .gitmodules/index gitlinks, GitHub default heads/releases,
the Help sitemap, and Automate main/runtime assets. It never writes tracked
knowledge, captures Help pages, or treats an observation as acceptance.
Output and optional baseline paths must be outside the repository.
Use --restore-failed when an external baseline restore failed; this keeps the
run unknown and prevents a replacement baseline from hiding that failure.
`);
  process.exit(code);
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("--since must use YYYY-MM-DD");
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("--since must be a real calendar date");
  }
  return value;
}

function externalPath(raw, root, flag) {
  const value = path.resolve(raw);
  const relative = path.relative(path.resolve(root), value);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    throw new Error(`${flag} must be outside the repository`);
  }
  return value;
}

/** CLI parsing is intentionally small: safety bounds are fixed in LIMITS. */
export function parseArgs(argv, { defaultRoot = ROOT } = {}) {
  let parsed;
  try {
    parsed = parseNodeArgs({
      args: argv,
      options: {
        output: { type: "string" },
        markdown: { type: "string" },
        baseline: { type: "string" },
        since: { type: "string" },
        root: { type: "string" },
        "restore-failed": { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
      strict: true,
      allowPositionals: false,
    });
  } catch (error) {
    throw new Error(`invalid arguments: ${error.message}`);
  }
  if (parsed.values.help) showUsage(0);
  const root = path.resolve(parsed.values.root || defaultRoot);
  if (!parsed.values.output) throw new Error("--output is required");
  if (!parsed.values.markdown) throw new Error("--markdown is required");
  const options = {
    root,
    output: externalPath(parsed.values.output, root, "--output"),
    markdown: externalPath(parsed.values.markdown, root, "--markdown"),
    baseline: parsed.values.baseline ? externalPath(parsed.values.baseline, root, "--baseline") : null,
    since: parsed.values.since ? validateDate(parsed.values.since) : null,
    restoreFailed: Boolean(parsed.values["restore-failed"]),
  };
  const paths = new Set([options.output, options.markdown, options.baseline].filter(Boolean));
  if (paths.size !== (options.baseline ? 3 : 2)) throw new Error("output paths must be different");
  return options;
}

function exec(command, args, cwd) {
  return new Promise((resolve) => {
    execFile(command, args, { cwd, encoding: "utf8", timeout: 30_000, maxBuffer: 2 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({ status: error ? (Number.isInteger(error.code) ? error.code : 1) : 0, stdout: stdout || "", stderr: stderr || "" });
    });
  });
}

function okay(result) {
  return result && Number(result.status) === 0;
}

function parseSections(text) {
  const sections = [];
  let current;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    const header = /^\[submodule\s+["']?([^\]"']+)["']?\]$/i.exec(line);
    if (header) {
      current = { name: header[1], values: {} };
      sections.push(current);
    } else if (current) {
      const pair = /^([A-Za-z0-9_.-]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (pair) current.values[pair[1]] = pair[2];
    }
  }
  return sections;
}

export function parseGitmodules(text) {
  return parseSections(text)
    .filter((section) => section.values.path)
    .map((section) => ({ name: section.name, path: section.values.path, url: section.values.url || null }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function parseGitlinks(text) {
  const links = new Map();
  for (const entry of String(text).split("\0")) {
    const match = /^(?:160000\s+commit\s+|160000\s+)([0-9a-f]{7,64})(?:\s+\d+)?\t(.+)$/.exec(entry);
    if (match) links.set(match[2], match[1].toLowerCase());
  }
  return links;
}

function githubRepo(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  let owner;
  let repo;
  try {
    if (raw.startsWith("git@github.com:")) {
      [owner, repo] = raw.slice("git@github.com:".length).split("/");
    } else {
      const url = new URL(raw);
      if (url.hostname.toLowerCase() !== "github.com" || url.username || url.password || url.search || url.hash) return null;
      [owner, repo] = url.pathname.replace(/^\//, "").split("/");
    }
  } catch {
    return null;
  }
  repo = repo?.replace(/\.git$/, "");
  return /^[A-Za-z0-9_.-]+$/.test(owner || "") && /^[A-Za-z0-9_.-]+$/.test(repo || "")
    ? `${owner}/${repo}`
    : null;
}

function publicSubmoduleUrl(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (/^git@github\.com:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com" || !/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(url.pathname)) return "[redacted submodule URL]";
    return `https://github.com${url.pathname}`;
  } catch {
    return "[redacted submodule URL]";
  }
}

async function gitLinks(root, git) {
  let index;
  try { index = await git(["ls-files", "--stage", "-z"], { cwd: root }); } catch { index = null; }
  if (okay(index)) return { links: parseGitlinks(index.stdout), source: "index" };
  let tree;
  try { tree = await git(["ls-tree", "-rz", "--full-tree", "HEAD"], { cwd: root }); } catch { tree = null; }
  if (okay(tree)) return { links: parseGitlinks(tree.stdout), source: "head-tree" };
  return { links: new Map(), source: null, failure: "gitlink inventory unavailable" };
}

async function ghRepo(repo, gh, root) {
  const infoResult = await gh(["api", `repos/${repo}`], { cwd: root });
  if (!okay(infoResult)) return { ok: false, error: "repository metadata unavailable" };
  let info;
  try { info = JSON.parse(infoResult.stdout); } catch { return { ok: false, error: "repository metadata invalid" }; }
  const branch = typeof info.default_branch === "string" ? info.default_branch.trim() : "";
  if (!branch) return { ok: false, error: "repository default branch unavailable" };
  const headResult = await gh(["api", `repos/${repo}/commits/${encodeURIComponent(branch)}`], { cwd: root });
  if (!okay(headResult)) return { ok: false, error: "default head unavailable" };
  let head;
  try { head = JSON.parse(headResult.stdout); } catch { return { ok: false, error: "default head invalid" }; }
  if (!/^[0-9a-f]{7,64}$/i.test(head.sha || "")) return { ok: false, error: "default head SHA unavailable" };
  const releaseResult = await gh(["api", `repos/${repo}/releases/latest`], { cwd: root });
  let release = null;
  // `gh api` exits non-zero for HTTP errors, including the normal "no release"
  // case. Accept only an explicit 404 marker; auth/transport failures remain
  // failures and therefore cannot advance a stale observation.
  const noRelease = Number(releaseResult?.status) === 404 || /\bHTTP\s*404\b|\bstatus\s*[:=]\s*404\b/i.test(releaseResult?.stderr || "");
  if (noRelease) {
    release = null;
  } else if (!okay(releaseResult)) {
    return { ok: false, error: "latest release unavailable" };
  } else {
    try {
      const value = JSON.parse(releaseResult.stdout);
      if (!value.tag_name) return { ok: false, error: "latest release tag unavailable" };
      release = { tag: value.tag_name, publishedAt: value.published_at || null, url: value.html_url || null };
    } catch { return { ok: false, error: "latest release invalid" }; }
  }
  return { ok: true, branch, head: head.sha.toLowerCase(), release };
}

async function limited(items, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function consume() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(LIMITS.concurrency, items.length) }, consume));
  return results;
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

async function discoverVendor({ root, previous, baselinePresent, git, gh, now }) {
  const source = {
    status: "unknown",
    bootstrap: !baselinePresent,
    coverage: { configured: 0, gitlinks: 0, checked: 0, successful: 0, failures: 0 },
    inventory: [],
    changes: { count: 0, candidates: [], examples: [] },
    removals: { count: 0, candidates: [], examples: [] },
    failures: [],
    baselineAdvanced: false,
  };
  let modules;
  try { modules = parseGitmodules(fs.readFileSync(path.join(root, ".gitmodules"), "utf8")); }
  catch { source.failures.push({ key: ".gitmodules", error: ".gitmodules unavailable" }); return { source, baseline: null }; }
  const linked = await gitLinks(root, git);
  source.coverage.configured = modules.length;
  source.coverage.gitlinks = modules.filter((item) => linked.links.has(item.path)).length;
  const inventory = modules.map((item) => ({ ...item, gitlink: linked.links.get(item.path) || null, repository: githubRepo(item.url) }));
  source.coverage.checked = inventory.length;
  const queried = await limited(inventory, async (item) => {
    if (!item.repository) return { ...item, ok: false, error: "unsupported GitHub repository URL" };
    let result;
    try { result = await ghRepo(item.repository, gh, root); }
    catch { result = { ok: false, error: "GitHub observation failed" }; }
    return result.ok
      ? {
          ...item,
          ok: true,
          observation: {
            path: item.path,
            url: publicSubmoduleUrl(item.url),
            repository: item.repository,
            gitlink: item.gitlink,
            defaultBranch: result.branch,
            defaultHead: result.head,
            latestRelease: result.release,
            observedAt: now(),
            present: true,
          },
        }
      : { ...item, ok: false, error: result.error };
  });
  if (linked.failure) source.failures.push({ key: "gitlinks", error: linked.failure });
  source.coverage.successful = queried.filter((item) => item.ok).length;
  source.coverage.failures = queried.filter((item) => !item.ok).length + (linked.failure ? 1 : 0);
  source.inventory = queried.map((item) => ({
    path: item.path,
    url: publicSubmoduleUrl(item.url),
    repository: item.repository,
    gitlink: item.gitlink,
    defaultBranch: item.observation?.defaultBranch || null,
    defaultHead: item.observation?.defaultHead || null,
    latestRelease: item.observation?.latestRelease || null,
    observationStatus: item.ok ? "observed" : "unknown",
  }));
  for (const item of queried.filter((entry) => !entry.ok)) source.failures.push({ key: item.path, path: item.path, error: item.error });
  const old = previous?.observations || {};
  const changes = [];
  for (const item of queried.filter((entry) => entry.ok)) {
    const prior = old[item.path];
    if (!baselinePresent || !prior) continue;
    if (prior.defaultHead !== item.observation.defaultHead) {
      changes.push({
        key: item.path,
        path: item.path,
        repository: item.repository,
        kind: "changed",
        field: "default-head",
        previous: prior.defaultHead || null,
        current: item.observation.defaultHead,
      });
    }
    if ((prior.latestRelease?.tag || null) !== (item.observation.latestRelease?.tag || null)) {
      changes.push({
        key: item.path,
        path: item.path,
        repository: item.repository,
        kind: "changed",
        field: "latest-release",
        previous: prior.latestRelease?.tag || null,
        current: item.observation.latestRelease?.tag || null,
      });
    }
  }
  const removals = [];
  if (baselinePresent && source.failures.length === 0) {
    const paths = new Set(queried.map((item) => item.path));
    for (const [key, value] of Object.entries(old)) {
      if (value.present !== false && !paths.has(key)) {
        removals.push({
          key,
          path: key,
          repository: value.repository || null,
          kind: "removed-publication",
          note: "Publication observation only; retirement was not evaluated.",
        });
      }
    }
  }
  source.changes = { count: changes.length, candidates: changes, examples: changes.slice(0, LIMITS.maxExamples) };
  source.removals = { count: removals.length, candidates: removals, examples: removals.slice(0, LIMITS.maxExamples) };
  source.status = source.coverage.successful === 0 ? "unknown" : source.failures.length || linked.failure ? "partial" : baselinePresent ? "success" : "bootstrap";
  const observations = Object.fromEntries(queried.filter((item) => item.ok).map((item) => [item.path, item.observation]));
  const next = { ...old, ...observations };
  if (source.failures.length === 0) for (const key of Object.keys(next)) if (!observations[key]) next[key] = { ...next[key], present: false };
  source.baselineAdvanced = Object.keys(observations).length > 0 && !linked.failure;
  return { source, baseline: source.baselineAdvanced ? { observations: next, checkedAt: now() } : null };
}

function decodeXml(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)));
}

function tag(block, name) {
  const match = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(block);
  return match ? decodeXml(match[1].trim()) : null;
}

export function parseSitemap(text) {
  const urls = new Map();
  const sitemaps = [];
  for (const match of String(text).matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)) {
    const url = tag(match[1], "loc");
    if (!url) continue;
    const lastmod = tag(match[1], "lastmod");
    if (!urls.has(url) || (lastmod && !urls.get(url).lastmod)) urls.set(url, { url, lastmod: lastmod || null });
  }
  for (const match of String(text).matchAll(/<sitemap\b[^>]*>([\s\S]*?)<\/sitemap>/gi)) {
    const url = tag(match[1], "loc");
    if (url) sitemaps.push(url);
  }
  return { kind: urls.size ? "urlset" : sitemaps.length ? "index" : "unknown", urls: [...urls.values()].slice(0, LIMITS.maxUrls), sitemaps, truncated: urls.size > LIMITS.maxUrls };
}

function header(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === "function") return headers.get(name) || null;
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key]) : null;
}

function sha(value) { return createHash("sha256").update(value).digest("hex"); }

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function rateWait(state, delay) {
  const turn = state.queue.then(async () => {
    const waitFor = Math.max(0, state.nextAt - Date.now());
    if (waitFor) await delay(waitFor);
    state.nextAt = Date.now() + LIMITS.rateLimitMs;
  });
  state.queue = turn.catch(() => {});
  return turn;
}

async function fetchText(url, { fetcher, state, expectedHost, headers = {}, delay = sleep }) {
  let requested;
  try { requested = new URL(url); } catch { return { ok: false, error: "invalid source URL" }; }
  if (requested.protocol !== "https:" || requested.username || requested.password || requested.host !== expectedHost) {
    return { ok: false, error: "source URL is not approved HTTPS" };
  }
  let lastError = "request failed";
  for (let attempt = 0; attempt <= LIMITS.retries; attempt += 1) {
    await rateWait(state, delay);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LIMITS.timeoutMs);
    let response;
    try {
      response = await fetcher(url, { method: "GET", headers, redirect: "follow", signal: controller.signal });
      const finalUrl = new URL(response.url || url);
      if (finalUrl.protocol !== "https:" || finalUrl.host !== expectedHost) {
        controller.abort();
        await cancelResponse(response);
        clearTimeout(timeout);
        return { ok: false, error: "redirect left approved source host" };
      }
      if (response.status === 304) {
        clearTimeout(timeout);
        return { ok: true, notModified: true, status: 304, headers: response.headers };
      }
      if (!response.ok && response.status !== 200) {
        controller.abort();
        await cancelResponse(response);
        clearTimeout(timeout);
        lastError = `HTTP ${response.status || 0}`;
        if (![408, 425, 429, 500, 502, 503, 504].includes(response.status) || attempt === LIMITS.retries) return { ok: false, error: lastError };
        await delay(Math.min(LIMITS.retryDelayMs * 2 ** attempt, 10_000));
        continue;
      }
      const body = await readResponseText(response, controller);
      clearTimeout(timeout);
      return { ok: true, status: response.status || 200, headers: response.headers, body };
    } catch (error) {
      controller.abort();
      await cancelResponse(response);
      clearTimeout(timeout);
      lastError = error?.name === "AbortError"
        ? "request timed out"
        : error?.message === "response exceeded byte limit" ? error.message : "request failed";
      if (attempt === LIMITS.retries || lastError === "response exceeded byte limit") return { ok: false, error: lastError };
      await delay(Math.min(LIMITS.retryDelayMs * 2 ** attempt, 10_000));
    }
  }
  return { ok: false, error: lastError };
}

async function cancelResponse(response) {
  try {
    const body = response?.body;
    if (typeof body?.cancel === "function") {
      await body.cancel();
    } else if (typeof body?.getReader === "function") {
      const reader = body.getReader();
      if (typeof reader.cancel === "function") await reader.cancel();
    } else if (typeof body?.return === "function") {
      await body.return();
    }
  } catch {
    // The body may already be locked or cancelled; the request is still aborted.
  }
}

async function readResponseText(response, controller) {
  const chunks = [];
  let size = 0;
  let reader;
  const append = (chunk) => {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > LIMITS.maxBytes) throw new Error("response exceeded byte limit");
    chunks.push(buffer);
  };
  try {
    if (response.body?.getReader) {
      reader = response.body.getReader();
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        append(next.value);
      }
      return Buffer.concat(chunks, size).toString("utf8");
    }
    if (response.body?.[Symbol.asyncIterator]) {
      for await (const chunk of response.body) append(chunk);
      return Buffer.concat(chunks, size).toString("utf8");
    }
    if (typeof response.text !== "function") throw new Error("response has no body reader");
    const body = await response.text();
    append(body);
    return Buffer.concat(chunks, size).toString("utf8");
  } catch (error) {
    controller?.abort();
    try {
      if (reader?.cancel) await reader.cancel();
      else await cancelResponse(response);
    } catch {
      // Preserve the original read/size error for the bounded retry policy.
    }
    throw error;
  }
}

function normalizeUrl(raw, base, host) {
  try {
    const url = new URL(raw, base);
    if (url.protocol !== "https:" || url.host !== host || url.username || url.password) return null;
    url.hash = "";
    return url.href;
  } catch { return null; }
}

function product(url) {
  return new URL(url).pathname.split("/").filter(Boolean)[0] || "root";
}

function sinceDate(value, since) {
  if (!value || !since) return false;
  const valueTime = new Date(value).valueOf();
  const sinceTime = new Date(`${since}T00:00:00.000Z`).valueOf();
  return !Number.isNaN(valueTime) && valueTime >= sinceTime;
}

function candidate(item, note) {
  return {
    key: item.url || item.key,
    url: item.url || null,
    path: item.path || null,
    repository: item.repository || null,
    kind: item.kind,
    field: item.field || null,
    previous: item.previous ?? null,
    current: item.current ?? null,
    note: note || item.note || "Observed source change; acceptance was not evaluated.",
  };
}

function compareHelp(current, previous, baselinePresent, since, allowRemovals = true) {
  const old = previous?.observations || {};
  const candidates = [];
  const currentUrls = new Set(current.map((item) => item.url));
  for (const item of current) {
    const prior = old[item.url];
    if (!baselinePresent) {
      if (sinceDate(item.lastmod, since)) {
        candidates.push(candidate(
          { ...item, kind: "changed-since", field: "lastmod", current: item.lastmod },
          "Observed Help lastmod meets --since; page capture and acceptance were not evaluated.",
        ));
      }
    } else if (!prior || prior.present === false) {
      candidates.push(candidate({ ...item, kind: prior ? "restored" : "new", field: "url", previous: prior?.lastmod || null, current: item.lastmod }));
    } else if (since && sinceDate(item.lastmod, since)) {
      candidates.push(candidate({ ...item, kind: "changed-since", field: "lastmod", previous: prior.lastmod || null, current: item.lastmod }));
    } else if (item.lastmod !== prior.lastmod && (item.lastmod || prior.lastmod)) {
      candidates.push(candidate({ ...item, kind: "changed", field: "lastmod", previous: prior.lastmod || null, current: item.lastmod }));
    }
  }
  const removals = [];
  if (baselinePresent && allowRemovals) {
    for (const [url, prior] of Object.entries(old)) {
      if (prior.present !== false && !currentUrls.has(url)) {
        removals.push(candidate(
          { url, kind: "removed-publication", field: "url", previous: prior.lastmod || null },
          "Publication observation only; page or knowledge retirement was not evaluated.",
        ));
      }
    }
  }
  const productCounts = {};
  for (const item of candidates) {
    const name = item.url ? product(item.url) : "unknown";
    productCounts[name] = (productCounts[name] || 0) + 1;
  }
  return {
    candidates,
    removals,
    productCounts,
    observations: Object.fromEntries(current.map((item) => [item.url, { ...item, present: true }])),
  };
}

async function helpEntries({ previous, baselinePresent, fetcher, delay, since }) {
  const state = { queue: Promise.resolve(), nextAt: 0 };
  const old = previous?.observations || {};
  const sitemap = previous?.sitemap || {};
  const conditional = {};
  const failures = [];
  // A sitemap index can remain byte-identical while one of its child maps
  // changes. Only reuse a 304 for a direct URL set; index children are always
  // checked on a successful run.
  if (sitemap.kind !== "index") {
    if (sitemap.etag) conditional["If-None-Match"] = sitemap.etag;
    if (sitemap.lastModified) conditional["If-Modified-Since"] = sitemap.lastModified;
  }
  const root = await fetchText(URLS.helpSitemap, {
    fetcher,
    delay,
    state,
    headers: conditional,
    expectedHost: new URL(URLS.helpSitemap).host,
  });
  if (!root.ok) return { ok: false, error: root.error };
  let entries;
  let complete = true;
  let sitemapKind = sitemap.kind || "urlset";
  if (root.notModified) {
    if (sitemap.kind === "index") return { ok: false, error: "sitemap index returned 304 without child checks" };
    entries = Object.entries(old).filter(([, value]) => value.present !== false).map(([url, value]) => ({ url, lastmod: value.lastmod || null }));
    if (!entries.length) return { ok: false, error: "sitemap returned 304 without a prior observation" };
  } else {
    const parsed = parseSitemap(root.body);
    sitemapKind = parsed.kind;
    entries = [...parsed.urls];
    complete = !parsed.truncated;
    if (parsed.truncated) {
      failures.push({ key: URLS.helpSitemap, url: URLS.helpSitemap, error: "sitemap URL list exceeded the bounded limit" });
    }
    if (parsed.kind === "index") {
      if (parsed.sitemaps.length > LIMITS.maxSitemaps) {
        complete = false;
        failures.push({ key: URLS.helpSitemap, url: URLS.helpSitemap, error: "sitemap index exceeded the bounded child limit" });
      }
      const nested = await limited(parsed.sitemaps.slice(0, LIMITS.maxSitemaps), async (url) => {
        const approvedUrl = normalizeUrl(url, URLS.helpSitemap, new URL(URLS.helpSitemap).host);
        if (!approvedUrl) return { ok: false, url, error: "child sitemap URL is not approved HTTPS" };
        const response = await fetchText(approvedUrl, {
          fetcher,
          delay,
          state,
          expectedHost: new URL(URLS.helpSitemap).host,
        });
        if (!response.ok) return { ok: false, url: approvedUrl, error: response.error || "child sitemap request failed" };
        if (response.notModified) return { ok: false, url: approvedUrl, error: "child sitemap returned 304; child contents unavailable" };
        const child = parseSitemap(response.body);
        if (child.kind !== "urlset" || !child.urls.length) return { ok: false, url: approvedUrl, error: "child sitemap contained no approved URL observations" };
        return { ok: true, url: approvedUrl, urls: child.urls, truncated: child.truncated };
      });
      for (const result of nested) {
        if (!result.ok) {
          complete = false;
          failures.push({ key: result.url || URLS.helpSitemap, url: result.url || null, error: result.error || "child sitemap request failed" });
        }
        else {
          entries.push(...result.urls);
          if (result.truncated) {
            complete = false;
            failures.push({ key: result.url, url: result.url, error: "child sitemap URL list exceeded the bounded limit" });
          }
        }
      }
      if (entries.length > LIMITS.maxUrls) {
        entries.length = LIMITS.maxUrls;
        complete = false;
        failures.push({ key: URLS.helpSitemap, url: URLS.helpSitemap, error: "combined sitemap URL list exceeded the bounded limit" });
      }
    }
  }
  const host = new URL(URLS.helpSitemap).host;
  const normalized = [...new Map(
    entries
      .map((item) => [normalizeUrl(item.url, URLS.helpSitemap, host), item.lastmod || null])
      .filter(([url]) => url),
  ).entries()]
    .map(([url, lastmod]) => ({ url, lastmod }))
    .sort((a, b) => a.url.localeCompare(b.url));
  if (!normalized.length) return { ok: false, error: "sitemap contained no approved URL observations" };
  const comparison = compareHelp(normalized, previous, baselinePresent, since, complete);
  const next = { ...old, ...comparison.observations };
  if (complete) for (const key of Object.keys(next)) if (!comparison.observations[key]) next[key] = { ...next[key], present: false };
  return {
    ok: true,
    complete,
    entries: normalized,
    comparison,
    failures,
    baseline: complete
      ? {
          sitemap: {
            kind: sitemapKind,
            etag: header(root.headers, "etag"),
            lastModified: header(root.headers, "last-modified"),
            observedAt: new Date().toISOString(),
          },
          observations: next,
        }
      : null,
  };
}

export function extractAutomateAssetUrls(html, base = URLS.automateHome) {
  const host = new URL(base).host;
  const found = new Map();
  for (const match of String(html).matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    let url;
    try { url = new URL(match[1], base); } catch { continue; }
    if (url.protocol !== "https:" || url.host !== host || !url.pathname.startsWith("/assets/js/")) continue;
    const name = path.posix.basename(url.pathname);
    const role = /^main(?:[.~_-].*)?\.js$/i.test(name) ? "main" : /^runtime(?:~main|[.~_-].*)?\.js$/i.test(name) ? "runtime" : null;
    if (!role) continue;
    url.search = ""; url.hash = "";
    found.set(url.href, { url: url.href, role });
  }
  return [...found.values()].sort((a, b) => a.url.localeCompare(b.url));
}

function assetChanged(old, current) {
  if (!old) return true;
  return (old.sha256 || old.etag || old.lastModified || old.contentLength) !== (current.sha256 || current.etag || current.lastModified || current.contentLength) || old.role !== current.role;
}

async function automate({ previous, baselinePresent, fetcher, delay }) {
  const state = { queue: Promise.resolve(), nextAt: 0 };
  const oldHome = previous?.home || {};
  const old = previous?.observations || {};
  const conditional = {};
  if (oldHome.etag) conditional["If-None-Match"] = oldHome.etag;
  if (oldHome.lastModified) conditional["If-Modified-Since"] = oldHome.lastModified;
  const home = await fetchText(URLS.automateHome, {
    fetcher,
    delay,
    state,
    headers: conditional,
    expectedHost: new URL(URLS.automateHome).host,
  });
  if (!home.ok) return { ok: false, error: home.error };
  let assets;
  let homeMeta;
  if (home.notModified) {
    assets = (oldHome.assetUrls || []).map((item) => typeof item === "string" ? { url: item, role: "unknown" } : item).filter((item) => item?.url);
    if (!assets.length) return { ok: false, error: "home returned 304 without prior asset URLs" };
    homeMeta = { ...oldHome, observedAt: new Date().toISOString() };
  } else {
    assets = extractAutomateAssetUrls(home.body);
    if (!assets.length) return { ok: false, error: "home page exposed no main/runtime assets" };
    homeMeta = {
      etag: header(home.headers, "etag"),
      lastModified: header(home.headers, "last-modified"),
      sha256: sha(home.body),
      assetUrls: assets,
      observedAt: new Date().toISOString(),
    };
  }
  const checked = await limited(assets, async (asset) => {
    const prior = old[asset.url];
    const headers = {};
    if (prior?.etag) headers["If-None-Match"] = prior.etag;
    if (prior?.lastModified) headers["If-Modified-Since"] = prior.lastModified;
    const response = await fetchText(asset.url, {
      fetcher,
      delay,
      state,
      headers,
      expectedHost: new URL(URLS.automateHome).host,
    });
    if (!response.ok) return { asset, ok: false, error: response.error };
    if (response.notModified) {
      if (!prior) return { asset, ok: false, error: "asset returned 304 without a prior observation" };
      return {
        asset,
        ok: true,
        observation: { ...prior, role: asset.role, observedAt: new Date().toISOString(), present: true },
        unchanged: true,
      };
    }
    return {
      asset,
      ok: true,
      unchanged: false,
      observation: {
        url: asset.url,
        role: asset.role,
        etag: header(response.headers, "etag"),
        lastModified: header(response.headers, "last-modified"),
        contentLength: header(response.headers, "content-length") || String(Buffer.byteLength(response.body)),
        sha256: sha(response.body),
        observedAt: new Date().toISOString(),
        present: true,
      },
    };
  });
  const changes = [];
  const observations = {};
  for (const item of checked.filter((entry) => entry.ok)) {
    observations[item.asset.url] = item.observation;
    const prior = old[item.asset.url];
    if (baselinePresent && (!prior || prior.present === false)) {
      changes.push(candidate(
        {
          url: item.asset.url,
          kind: prior ? "restored" : "new",
          field: item.asset.role,
          previous: prior?.sha256 || prior?.etag || null,
          current: item.observation.sha256 || item.observation.etag || null,
        },
        "Observed Automate asset publication change; capture is a candidate, not a semantic API delta.",
      ));
    } else if (baselinePresent && prior && prior.present !== false && assetChanged(prior, item.observation)) {
      changes.push(candidate(
        {
          url: item.asset.url,
          kind: "changed",
          field: item.asset.role,
          previous: prior.sha256 || prior.etag || null,
          current: item.observation.sha256 || item.observation.etag || null,
        },
        "Observed Automate asset change; capture is a candidate, not a semantic API delta.",
      ));
    }
  }
  const failures = checked.filter((entry) => !entry.ok).map((entry) => ({ key: entry.asset.url, url: entry.asset.url, error: entry.error }));
  const removals = [];
  if (!failures.length && baselinePresent) {
    const current = new Set(checked.map((entry) => entry.asset.url));
    for (const [url, prior] of Object.entries(old)) {
      if (prior.present !== false && !current.has(url)) {
        removals.push(candidate(
          {
            url,
            kind: "removed-publication",
            field: prior.role || "asset",
            previous: prior.sha256 || prior.etag || null,
          },
          "Publication observation only; an asset removal is not a semantic retirement conclusion.",
        ));
      }
    }
  }
  const next = { ...old, ...observations };
  if (!failures.length) for (const key of Object.keys(next)) if (!observations[key]) next[key] = { ...next[key], present: false };
  const successful = checked.filter((entry) => entry.ok).length;
  const status = successful === 0 ? "unknown" : failures.length ? "partial" : baselinePresent ? "success" : "bootstrap";
  const captureRecommendation = failures.length
    ? "unknown"
    : !baselinePresent
      ? "bootstrap"
      : changes.length ? "candidate-only" : "none";
  const message = failures.length
    ? "Some assets could not be checked; retry before capture decisions."
    : !baselinePresent
      ? "Bootstrap observations recorded; no change comparison is possible until a baseline exists."
      : changes.length
        ? "Changed main/runtime assets are bounded capture candidates; no semantic API delta is inferred."
        : "Main/runtime assets are unchanged; no full Automate capture is needed.";
  return {
    ok: true,
    source: {
      status,
      bootstrap: !baselinePresent,
      coverage: {
        assets: assets.length,
        successful,
        failures: failures.length,
        complete: !failures.length,
      },
      assets: assets.map((item) => ({
        url: item.url,
        role: item.role,
        observationStatus: checked.find((entry) => entry.asset.url === item.url)?.ok ? "observed" : "unknown",
      })),
      changes: {
        count: changes.length,
        candidates: changes,
        examples: changes.slice(0, LIMITS.maxExamples),
      },
      removals: {
        count: removals.length,
        candidates: removals,
        examples: removals.slice(0, LIMITS.maxExamples),
      },
      captureRecommendation,
      message,
      failures,
      baselineAdvanced: !failures.length && Object.keys(observations).length > 0,
    },
    baseline: !failures.length && Object.keys(observations).length
      ? { home: homeMeta, observations: next }
      : null,
  };
}

function normalizeBaseline(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("baseline must be a JSON object");
  const sources = {};
  for (const name of SOURCE_NAMES) {
    const source = raw.sources?.[name] || {};
    const observations = source.observations && typeof source.observations === "object" && !Array.isArray(source.observations) ? source.observations : {};
    sources[name] = {
      ...source,
      observations: name === "vendor"
        ? Object.fromEntries(Object.entries(observations).map(([key, value]) => [key, { ...value, url: publicSubmoduleUrl(value?.url) }]))
        : observations,
    };
  }
  return { schemaVersion: Number(raw.schemaVersion || BASELINE_VERSION), generatedAt: raw.generatedAt || null, sources };
}

export function loadBaseline(file) {
  if (!file || !fs.existsSync(file)) return { exists: false, data: normalizeBaseline({}) };
  try { return { exists: true, data: normalizeBaseline(JSON.parse(fs.readFileSync(file, "utf8"))) }; }
  catch (error) { throw new Error(`baseline is not valid JSON: ${error.message}`); }
}

function hasObservations(source) { return Boolean(source?.observations && Object.keys(source.observations).length); }

export async function runDiscovery({ root = ROOT, baselineData = normalizeBaseline({}), baselineExists = false, baselineRestoreFailed = false, since = null, fetcher = globalThis.fetch, git = (args, { cwd }) => exec("git", args, cwd), gh = (args, { cwd }) => exec("gh", args, cwd), delay = sleep } = {}) {
  const baseline = normalizeBaseline(baselineData);
  const vendor = await discoverVendor({ root, previous: baseline.sources.vendor, baselinePresent: baselineExists && hasObservations(baseline.sources.vendor), git, gh, now: () => new Date().toISOString() });
  let helpResult;
  try { helpResult = await helpEntries({ previous: baseline.sources.help, baselinePresent: baselineExists && hasObservations(baseline.sources.help), fetcher, delay, since }); }
  catch { helpResult = { ok: false, error: "sitemap request failed" }; }
  const help = helpResult.ok
    ? {
        status: helpResult.complete
          ? baselineExists && hasObservations(baseline.sources.help) ? "success" : "bootstrap"
          : "partial",
        bootstrap: !baselineExists,
        coverage: {
          urls: helpResult.entries.length,
          withLastmod: helpResult.entries.filter((item) => item.lastmod).length,
          complete: helpResult.complete,
        },
        sitemap: helpResult.baseline?.sitemap || baseline.sources.help.sitemap || {},
        changes: {
          count: helpResult.comparison.candidates.length,
          productCounts: helpResult.comparison.productCounts,
          candidates: helpResult.comparison.candidates,
          examples: helpResult.comparison.candidates.slice(0, LIMITS.maxExamples),
        },
        removals: {
          count: helpResult.comparison.removals.length,
          candidates: helpResult.comparison.removals,
          examples: helpResult.comparison.removals.slice(0, LIMITS.maxExamples),
        },
        failures: helpResult.failures || [],
        baselineAdvanced: Boolean(helpResult.baseline),
      }
    : {
        status: "unknown",
        bootstrap: !baselineExists,
        coverage: { urls: 0, withLastmod: 0, complete: false },
        sitemap: {},
        changes: { count: 0, productCounts: {}, candidates: [], examples: [] },
        removals: { count: 0, candidates: [], examples: [] },
        failures: [{ key: URLS.helpSitemap, url: URLS.helpSitemap, error: helpResult.error || "sitemap request failed" }],
        baselineAdvanced: false,
      };
  let automateResult;
  try { automateResult = await automate({ previous: baseline.sources.automate, baselinePresent: baselineExists && hasObservations(baseline.sources.automate), fetcher, delay }); }
  catch { automateResult = { ok: false, error: "Automate request failed" }; }
  const automateSource = automateResult.ok
    ? automateResult.source
    : {
        status: "unknown",
        bootstrap: !baselineExists,
        coverage: { assets: 0, successful: 0, failures: 0, complete: false },
        assets: [],
        changes: { count: 0, candidates: [], examples: [] },
        removals: { count: 0, candidates: [], examples: [] },
        captureRecommendation: "unknown",
        message: "Automate publication state is unknown until the home page and assets are checked.",
        failures: [{ key: URLS.automateHome, url: URLS.automateHome, error: automateResult.error || "Automate request failed" }],
        baselineAdvanced: false,
      };
  const results = { vendor: vendor.source, help, automate: automateSource };
  const next = copy(baseline);
  const advancedSources = [];
  if (vendor.baseline) { next.sources.vendor = { ...next.sources.vendor, ...vendor.baseline }; advancedSources.push("vendor"); }
  if (helpResult.baseline) { next.sources.help = { ...next.sources.help, ...helpResult.baseline }; advancedSources.push("help"); }
  if (automateResult.baseline) { next.sources.automate = { ...next.sources.automate, ...automateResult.baseline }; advancedSources.push("automate"); }
  if (baselineRestoreFailed) {
    for (const name of SOURCE_NAMES) {
      results[name].status = "unknown";
      results[name].baselineAdvanced = false;
      results[name].failures.push({ key: "baseline", error: "baseline restore failed; replacement baseline was not published" });
    }
    advancedSources.length = 0;
  }
  const unknown = SOURCE_NAMES.filter((name) => ["unknown", "partial"].includes(results[name].status));
  const observed = SOURCE_NAMES.some((name) => (results[name].coverage.successful || results[name].coverage.urls || 0) > 0);
  const generatedAt = new Date().toISOString();
  const report = {
    schemaVersion: REPORT_VERSION,
    generatedAt,
    since,
    semantics: {
      mode: "observed-source-changes",
      knowledgeAcceptance: "not-evaluated",
      readOnly: true,
      removalInterpretation: "publication-observation-only",
    },
    baseline: {
      supplied: baselineExists,
      restoreFailed: baselineRestoreFailed,
      bootstrap: !baselineExists || advancedSources.length < SOURCE_NAMES.length,
      advancedSources,
      preservedSources: SOURCE_NAMES.filter((name) => !advancedSources.includes(name)),
    },
    bootstrap: {
      firstRun: !baselineExists,
      sources: !baselineExists ? SOURCE_NAMES : SOURCE_NAMES.filter((name) => !hasObservations(baseline.sources[name])),
      note: baselineRestoreFailed
        ? "The prior observation baseline could not be restored. Coverage was not promoted to a replacement baseline; review the restore failure."
        : !baselineExists
          ? "No prior observation baseline was available. Coverage counts are bootstrap observations; examples are bounded and no page bodies are emitted."
          : null,
    },
    sources: results,
    overall: {
      status: baselineRestoreFailed ? "unknown" : unknown.length ? (observed ? "partial" : "unknown") : "success",
      unknownSources: baselineRestoreFailed ? SOURCE_NAMES : unknown,
      observedCandidateCount: SOURCE_NAMES.reduce((sum, name) => sum + results[name].changes.count, 0),
    },
  };
  return { report, nextBaseline: next, advancedSources };
}

function count(value) { return Number(value || 0).toLocaleString("en-US"); }
function examples(items) { return items?.length ? items.map((item) => `- \`${item.kind}${item.field ? ` (${item.field})` : ""}\` — ${item.url || item.path || item.key}`).join("\n") : "- None in the bounded example set."; }

export function renderMarkdown(report) {
  const lines = ["# Refresh discovery observation", "", `Generated: ${report.generatedAt}`, "", "> Read-only publication observations. Source changes are review candidates, not acceptance or integration decisions. No Help pages or Automate operation content is captured.", "", "## Summary", "", `- Overall status: **${report.overall.status}**`, `- Bootstrap source classes: ${report.bootstrap.sources.length ? report.bootstrap.sources.join(", ") : "none"}`, `- Unknown or partial source classes: ${report.overall.unknownSources.length ? report.overall.unknownSources.join(", ") : "none"}`, "", "## Vendor default heads and releases", "", `- Status: **${report.sources.vendor.status}**; configured ${count(report.sources.vendor.coverage.configured)}, gitlinks ${count(report.sources.vendor.coverage.gitlinks)}, successful remote observations ${count(report.sources.vendor.coverage.successful)}.`, `- Observed candidates: ${count(report.sources.vendor.changes.count)}; publication removals: ${count(report.sources.vendor.removals.count)}.`, "", "Bounded examples:", examples(report.sources.vendor.changes.examples), "", "## Help sitemap", "", `- Status: **${report.sources.help.status}**; observed ${count(report.sources.help.coverage.urls)} URLs, ${count(report.sources.help.coverage.withLastmod)} with \`lastmod\`.`, `- Complete coverage: **${report.sources.help.coverage.complete ? "yes" : "no"}**; observed candidates ${count(report.sources.help.changes.count)}; publication removals ${count(report.sources.help.removals.count)}.`, "", "Candidates by product:"];
  const products = Object.entries(report.sources.help.changes.productCounts || {}).sort(([a], [b]) => a.localeCompare(b));
  lines.push(...(products.length ? products.map(([name, value]) => `- \`${name}\`: ${count(value)}`) : ["- None in the bounded candidate set."]), "", "Bounded examples:", examples(report.sources.help.changes.examples), "", "Publication removals (not retirement conclusions):", examples(report.sources.help.removals.examples), "", "## Automate main/runtime assets", "", `- Status: **${report.sources.automate.status}**; observed ${count(report.sources.automate.coverage.successful)} of ${count(report.sources.automate.coverage.assets)} assets.`, `- Capture recommendation: **${report.sources.automate.captureRecommendation}** — ${report.sources.automate.message}`, `- Changed asset candidates ${count(report.sources.automate.changes.count)}; publication removals ${count(report.sources.automate.removals.count)}.`, "", "Bounded examples:", examples(report.sources.automate.changes.examples), "", "## Failures", "");
  const failures = SOURCE_NAMES.flatMap((name) => report.sources[name].failures.map((failure) => `- **${name}** — ${failure.key}: ${failure.error}`));
  lines.push(...(failures.length ? failures : ["- None observed."]), "", "The baseline advances only for successfully checked observations; failures preserve prior observations and remain unknown/partial. This helper makes no issue writes or external notifications.", "");
  return `${lines.join("\n")}\n`;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  fs.renameSync(temp, file);
}

async function main() {
  let options;
  try { options = parseArgs(process.argv.slice(2)); } catch (error) { process.stderr.write(`refresh-discovery: ${error.message}\n`); process.exitCode = 2; return; }
  let loaded;
  try { loaded = loadBaseline(options.baseline); } catch (error) { process.stderr.write(`refresh-discovery: ${error.message}\n`); process.exitCode = 2; return; }
  try {
    const result = await runDiscovery({ root: options.root, baselineData: loaded.data, baselineExists: loaded.exists, baselineRestoreFailed: options.restoreFailed, since: options.since });
    writeJson(options.output, result.report);
    fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
    fs.writeFileSync(options.markdown, renderMarkdown(result.report), { encoding: "utf8", mode: 0o600 });
    if (options.baseline && result.advancedSources.length) writeJson(options.baseline, { schemaVersion: BASELINE_VERSION, generatedAt: result.report.generatedAt, sources: result.nextBaseline.sources });
    process.stdout.write(`${result.report.overall.status}: ${result.report.overall.observedCandidateCount} observed candidate(s); ${result.advancedSources.length} source class(es) advanced\n`);
    if (result.report.overall.status !== "success") process.exitCode = 1;
  } catch (error) { process.stderr.write(`refresh-discovery: ${error.message}\n`); process.exitCode = 1; }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) await main();
