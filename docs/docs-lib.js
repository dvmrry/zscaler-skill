// Shared helpers for the zscaler-skill docs site.
//
// UMD-ish: in the browser it attaches to `window.ZSkill` (load it as a classic
// <script> before nav.js / hub-topics.js / left-sidebar.js and the source.html
// inline script); under Node it exports the same object so the pure helpers can
// be unit-tested. The fetch / localStorage parts are browser-only.
(function (factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.ZSkill = api;
})(function () {
  const REPO = "dvmrry/zscaler-skill";
  const BRANCH = "main";
  const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
  const VIEW = `https://github.com/${REPO}/blob/${BRANCH}`;
  const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const TREE_CACHE_KEY = "zskill:ref-tree:v1";
  const TREE_CACHE_TTL = 1000 * 60 * 30; // 30 min

  const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

  // Return href unchanged when it is safe to render, else "#". Blocks
  // javascript:, data:, vbscript:, file:, and any other scheme; in-page
  // anchors and scheme-less (relative) links are allowed.
  function safeHref(href) {
    const s = String(href == null ? "" : href).trim();
    if (s === "" || s.startsWith("#")) return href;
    const m = s.match(/^([a-z][a-z0-9+.-]*):/i);
    if (!m) return href; // no scheme -> relative
    return SAFE_SCHEMES.has(m[1].toLowerCase()) ? href : "#";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function prettify(s) {
    return String(s).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function encodePath(p) {
    return String(p).split("/").map(encodeURIComponent).join("/");
  }

  function isFreshCacheEntry(ts, now, ttl) {
    return typeof ts === "number" && now - ts <= ttl;
  }

  // Human-readable note for a failed tree fetch; calls out the unauthenticated
  // rate limit (HTTP 403) explicitly so the sidebar/topics can degrade clearly.
  function rateLimitMessage(status) {
    if (status === 403 || status === 429) {
      return "GitHub API rate limit reached (unauthenticated, 60/hour). Try again in a few minutes.";
    }
    return `GitHub API request failed (HTTP ${status}).`;
  }

  // ── Browser-only (localStorage / fetch) ──────────────────────────────

  function readCachedTree() {
    try {
      const raw = localStorage.getItem(TREE_CACHE_KEY);
      if (!raw) return null;
      const { ts, entries } = JSON.parse(raw);
      if (!isFreshCacheEntry(ts, Date.now(), TREE_CACHE_TTL)) return null;
      return entries;
    } catch (_) {
      return null;
    }
  }

  function cachedShas() {
    try {
      return JSON.parse(localStorage.getItem(`${TREE_CACHE_KEY}:shas`) || "{}");
    } catch (_) {
      return {};
    }
  }

  // Fetch the reference-file tree (paths under references/, .md only). Returns a
  // cached array when fresh. Throws an Error whose .status carries the HTTP code
  // so callers can show rateLimitMessage().
  async function loadTree() {
    const cached = readCachedTree();
    if (cached) return cached;
    const r = await fetch(TREE_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) {
      const err = new Error(rateLimitMessage(r.status));
      err.status = r.status;
      throw err;
    }
    const data = await r.json();
    const blobs = (data.tree || []).filter(
      (e) => e.type === "blob" && e.path.startsWith("references/") && e.path.endsWith(".md"),
    );
    const entries = blobs.map((e) => e.path.slice("references/".length));
    const shas = {};
    for (const e of blobs) shas[e.path.slice("references/".length)] = e.sha;
    try {
      localStorage.setItem(TREE_CACHE_KEY, JSON.stringify({ ts: Date.now(), entries }));
      localStorage.setItem(`${TREE_CACHE_KEY}:shas`, JSON.stringify(shas));
    } catch (_) {
      /* ignore quota */
    }
    return entries;
  }

  return {
    REPO,
    BRANCH,
    RAW,
    VIEW,
    TREE_API,
    TREE_CACHE_KEY,
    TREE_CACHE_TTL,
    safeHref,
    escapeHtml,
    prettify,
    encodePath,
    isFreshCacheEntry,
    rateLimitMessage,
    readCachedTree,
    cachedShas,
    loadTree,
  };
});
