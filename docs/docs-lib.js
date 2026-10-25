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
  const TREE = `https://github.com/${REPO}/tree/${BRANCH}`;

  // The docs that exist as Markdown, the only files the site renders or links.
  // slug: source.html?p= value (primer) or null for a GitHub link; path: repo path.
  const DOC_GROUPS = [
    { key: "primer", label: "Primer", docs: [
      { label: "Index", path: "docs/primer/index.md", slug: "_meta/primer/index" },
      { label: "Networking basics", path: "docs/primer/networking-basics.md", slug: "_meta/primer/networking-basics" },
      { label: "Proxy vs gateway vs tunnel", path: "docs/primer/proxy-vs-gateway-vs-tunnel.md", slug: "_meta/primer/proxy-vs-gateway-vs-tunnel" },
      { label: "Identity: SAML and OIDC", path: "docs/primer/identity-saml-oidc.md", slug: "_meta/primer/identity-saml-oidc" },
      { label: "Zero trust", path: "docs/primer/zero-trust.md", slug: "_meta/primer/zero-trust" },
      { label: "Zscaler platform shape", path: "docs/primer/zscaler-platform-shape.md", slug: "_meta/primer/zscaler-platform-shape" },
    ] },
    { key: "guides", label: "Guides", docs: [
      { label: "Getting started", path: "docs/getting-started.md" },
      { label: "Knowledge-graph layout", path: "docs/kb-layout.md" },
      { label: "Maintenance", path: "docs/maintenance.md" },
      { label: "Evals", path: "docs/evals.md" },
      { label: "Tooling", path: "docs/tooling.md" },
      { label: "Release", path: "docs/release.md" },
    ] },
    { key: "data-contract", label: "Data contract", docs: [
      { label: "Overview", path: "docs/data-contract/README.md" },
      { label: "Knowledge", path: "docs/data-contract/knowledge.md" },
      { label: "Cases", path: "docs/data-contract/cases.md" },
      { label: "IaC", path: "docs/data-contract/iac.md" },
    ] },
  ];


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

  // A `kb:<subject id>` link names a knowledge-graph subject; it opens the subject's JSON file on
  // GitHub, which sits at references/<id prefix>/<id>.json. Anything that is not a subject id is "#".
  function kbHref(href) {
    const m = String(href == null ? "" : href).trim().match(/^kb:([a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+)$/);
    return m ? `${VIEW}/references/${m[1].split(".")[0]}/${m[1]}.json` : "#";
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

  // Human-readable note for a failed GitHub API request (HTTP 403/429 is the
  // unauthenticated rate limit).
  function rateLimitMessage(status) {
    if (status === 403 || status === 429) {
      return "GitHub API rate limit reached (unauthenticated, 60/hour). Try again in a few minutes.";
    }
    return `GitHub API request failed (HTTP ${status}).`;
  }

  return {
    REPO,
    BRANCH,
    RAW,
    VIEW,
    TREE,
    DOC_GROUPS,
    safeHref,
    kbHref,
    escapeHtml,
    prettify,
    encodePath,
    isFreshCacheEntry,
    rateLimitMessage,
  };
});
