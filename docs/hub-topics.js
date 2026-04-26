// hub-topics.js — augment a section hub with a compact list of every
// markdown file in the corresponding references/ subdir.
//
// Activate by setting <body data-hub-group="zia"> (or "zpa", etc.) on
// the hub page, then including this script. It fetches the GitHub
// trees API once (sharing the same 30-min localStorage cache as nav.js
// and source.html), filters to the named group, and appends a "Topics"
// section after the main <nav class="docs"> with one link per file.
(function () {
  const group = document.body && document.body.dataset && document.body.dataset.hubGroup;
  if (!group) return;

  const REPO = 'dvmrry/zscaler-skill';
  const BRANCH = 'main';
  const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const CACHE_KEY = 'zskill:ref-tree:v1';
  const CACHE_TTL = 1000 * 60 * 30;

  function readCachedTree() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, entries } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null;
      return entries;
    } catch (_) { return null; }
  }

  async function loadTree() {
    const cached = readCachedTree();
    if (cached) return cached;
    const r = await fetch(TREE_API, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error('tree API ' + r.status);
    const data = await r.json();
    const entries = (data.tree || [])
      .filter(e => e.type === 'blob' && e.path.startsWith('references/') && e.path.endsWith('.md'))
      .map(e => e.path.slice('references/'.length));
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), entries })); } catch (_) { /* quota */ }
    return entries;
  }

  function prettify(s) {
    return s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function encodePath(p) {
    return p.split('/').map(encodeURIComponent).join('/');
  }

  loadTree().then(entries => {
    const items = entries
      .filter(p => p.startsWith(group + '/') && !p.endsWith('/index.md'))
      .map(p => {
        const rel = p.slice(group.length + 1).replace(/\.md$/, '');
        return { slug: group + '/' + rel, label: prettify(rel) };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    if (!items.length) return;

    const docsNav = document.querySelector('nav.docs');
    if (!docsNav) return;

    const section = document.createElement('section');
    section.className = 'topic-list-section';
    const links = items.map(it =>
      `<a href="../source.html?p=${encodePath(it.slug)}">${it.label}</a>`
    ).join('');
    section.innerHTML =
      '<h3 class="topic-list-heading">Source</h3>' +
      '<p class="topic-list-desc">Each link below renders the underlying markdown directly via the Source view.</p>' +
      '<div class="topic-list">' + links + '</div>';

    docsNav.parentNode.insertBefore(section, docsNav.nextSibling);
  }).catch(err => {
    if (window.console) console.warn('hub-topics: could not load tree', err);
  });
})();
