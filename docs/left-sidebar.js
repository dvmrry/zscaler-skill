// left-sidebar.js — shared left-hand file-tree navigation, available
// on every page that loads nav.js (nav.js auto-loads this).
//
// Renders an <aside class="left-sidebar"> into the document body with
// a search input on top, then the references/ tree grouped by
// product. Groups are collapsible; the group matching the current
// page's section auto-expands on first render.
//
// On source.html the sidebar replaces the page's inline file tree
// (so source.html's body is just the markdown content).
(function () {
  if (window.__leftSidebarInit) return;
  window.__leftSidebarInit = true;

  const REPO = 'dvmrry/zscaler-skill';
  const BRANCH = 'main';
  const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
  const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const TREE_CACHE_KEY = 'zskill:ref-tree:v1';
  const TREE_CACHE_TTL = 1000 * 60 * 30;
  const CONTENT_KEY_PREFIX = 'zskill:content:v1:';

  // Hub display labels. Some references/ folders correspond to a hub
  // (welcome, zia, zpa, cloud-connector); others are standalone product
  // sections that don't yet have articles.
  const GROUP_LABELS = {
    '_primer': 'Welcome',
    'zia': 'ZIA',
    'zpa': 'ZPA',
    'cloud-connector': 'Cloud Connector',
    'zcc': 'ZCC',
    'zdx': 'ZDX',
    'zbi': 'ZBI',
    'zms': 'ZMS',
    'zwa': 'ZWA',
    'zidentity': 'ZIdentity',
    'shared': 'Shared',
    'ai-security': 'AI Security',
    'risk360': 'Risk360',
    'deception': 'Deception',
  };
  const GROUP_ORDER = [
    '_primer',  // Welcome
    'zia', 'zpa', 'cloud-connector',
    'zcc', 'zdx', 'zidentity',
    'zbi', 'zwa', 'zms',
    'ai-security', 'risk360', 'deception',
    'shared',
  ];

  // Resolve relative path so file links work from any page.
  const PREFIX = /\/(zia|zpa|cloud-connector|welcome)\//.test(location.pathname) ? '../' : '';
  const SOURCE_URL = PREFIX + 'source.html';


  let treeShas = (() => {
    try { return JSON.parse(localStorage.getItem(TREE_CACHE_KEY + ':shas') || '{}'); }
    catch (_) { return {}; }
  })();

  // Inject the sidebar shell synchronously so layout settles before
  // the tree fetch completes.
  const sidebar = document.createElement('aside');
  sidebar.className = 'left-sidebar';
  sidebar.id = 'left-sidebar';
  sidebar.setAttribute('aria-label', 'References');
  sidebar.innerHTML = `
    <div class="ls-search">
      <input type="search" id="ls-search-input" placeholder="Search references" autocomplete="off" spellcheck="false">
      <div class="ls-search-status" id="ls-search-status"></div>
    </div>
    <nav class="ls-tree" id="ls-tree">
      <p class="ls-status">Loading file list…</p>
    </nav>
  `;
  document.body.appendChild(sidebar);
  document.body.classList.add('has-left-rail');

  loadTree().then(renderSidebar).catch(err => {
    document.getElementById('ls-tree').innerHTML =
      `<p class="ls-status">Could not load file list.<br><small>${escapeHtml(err.message)}</small></p>`;
  });

  // ── Tree fetch ────────────────────────────────────────────────────

  function readCachedTree() {
    try {
      const raw = localStorage.getItem(TREE_CACHE_KEY);
      if (!raw) return null;
      const { ts, entries } = JSON.parse(raw);
      if (Date.now() - ts > TREE_CACHE_TTL) return null;
      return entries;
    } catch (_) { return null; }
  }

  async function loadTree() {
    const cached = readCachedTree();
    if (cached) return cached;
    const r = await fetch(TREE_API, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(`tree API ${r.status}`);
    const data = await r.json();
    const entries = (data.tree || [])
      .filter(e => e.type === 'blob' && e.path.startsWith('references/') && e.path.endsWith('.md'))
      .map(e => e.path.slice('references/'.length));
    const shas = {};
    for (const e of (data.tree || [])) {
      if (e.type === 'blob' && e.path.startsWith('references/') && e.path.endsWith('.md')) {
        shas[e.path.slice('references/'.length)] = e.sha;
      }
    }
    try {
      localStorage.setItem(TREE_CACHE_KEY, JSON.stringify({ ts: Date.now(), entries }));
      localStorage.setItem(TREE_CACHE_KEY + ':shas', JSON.stringify(shas));
    } catch (_) {}
    treeShas = shas;
    return entries;
  }

  // ── Render ────────────────────────────────────────────────────────

  function renderSidebar(entries) {
    if (!entries || !entries.length) {
      document.getElementById('ls-tree').innerHTML =
        '<p class="ls-status">No reference files found.</p>';
      return;
    }

    const groups = {};
    const topLevel = [];
    for (const path of entries) {
      const parts = path.split('/');
      if (parts.length === 1) {
        topLevel.push({ path, label: prettify(parts[0].replace(/\.md$/, '')) });
      } else {
        const g = parts[0];
        if (!groups[g]) groups[g] = [];
        const fileLabel = parts.slice(1).join('/').replace(/\.md$/, '');
        groups[g].push({ path, label: prettify(fileLabel) });
      }
    }
    for (const k of Object.keys(groups)) {
      groups[k].sort((a, b) => {
        if (a.path.endsWith('/index.md')) return -1;
        if (b.path.endsWith('/index.md')) return 1;
        return a.label.localeCompare(b.label);
      });
    }
    topLevel.sort((a, b) => a.label.localeCompare(b.label));

    const currentSlug = currentSourceSlug();
    const slugFirstSeg = currentSlug ? currentSlug.split('/')[0] : null;
    const currentGroup = (slugFirstSeg && groups[slugFirstSeg]) ? slugFirstSeg : null;
    const html = [];

    if (topLevel.length) {
      const items = topLevel.map(f => ({
        slug: f.path.replace(/\.md$/, ''),
        label: f.label,
        path: f.path,
      }));
      html.push(renderGroup('_top', 'References', items, currentSlug, currentGroup === null));
    }

    const orderedKeys = [
      ...GROUP_ORDER.filter(k => groups[k]),
      ...Object.keys(groups).filter(k => !GROUP_ORDER.includes(k)).sort(),
    ];

    for (const key of orderedKeys) {
      const label = GROUP_LABELS[key] || prettify(key);
      const docs = groups[key].map(f => ({
        slug: f.path.replace(/\.md$/, '').replace(/\/index$/, ''),
        // index.md → "Index" (matches the filename). Some sections
        // also have an overview.md, so labelling index.md as "Overview"
        // produced a duplicate entry.
        label: f.path.endsWith('/index.md') ? 'Index' : f.label,
        path: f.path,
      }));
      html.push(renderGroup(key, label, docs, currentSlug, key === currentGroup));
    }

    document.getElementById('ls-tree').innerHTML = html.join('');
    setupGroupToggle();
    setupSearch(entries);
  }

  function renderGroup(key, label, docs, currentSlug, expanded) {
    const cls = 'ls-group' + (expanded ? ' ls-open' : '');
    const out = [`<div class="${cls}" data-group="${escapeHtml(key)}">`];
    out.push(`<button class="ls-group-head" type="button" aria-expanded="${expanded}">`);
    out.push(`<span class="ls-group-caret" aria-hidden="true">▸</span>`);
    out.push(`<span class="ls-group-label">${escapeHtml(label)}</span>`);
    out.push(`<span class="ls-group-count">${docs.length}</span>`);
    out.push(`</button>`);
    out.push(`<div class="ls-group-list"><ul class="ls-flat-list">`);
    for (const d of docs) out.push(renderItem(d.slug, d.label, currentSlug, d.path));
    out.push(`</ul></div></div>`);
    return out.join('');
  }

  function renderItem(slug, label, currentSlug, path) {
    const isActive = currentSlug && slug === currentSlug;
    const cls = isActive ? ' class="active"' : '';
    const dataPath = path ? ` data-path="${escapeHtml(path)}"` : '';
    return `<li><a href="${SOURCE_URL}?p=${encodePath(slug)}"${cls}${dataPath}>${escapeHtml(label)}</a></li>`;
  }

  function setupGroupToggle() {
    document.querySelectorAll('#ls-tree .ls-group').forEach(g => {
      const head = g.querySelector('.ls-group-head');
      head.addEventListener('click', () => {
        const open = g.classList.toggle('ls-open');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  // ── Search ────────────────────────────────────────────────────────

  function setupSearch(entries) {
    const input = document.getElementById('ls-search-input');
    const status = document.getElementById('ls-search-status');
    if (!input || !status) return;

    const contentCache = {};
    let indexed = 0;
    const total = entries.length;

    for (const path of entries) {
      const sha = treeShas[path];
      if (!sha) continue;
      try {
        const cached = localStorage.getItem(CONTENT_KEY_PREFIX + sha);
        if (cached !== null) { contentCache[path] = cached; indexed++; }
      } catch (_) {}
    }
    updateStatus();
    setTimeout(() => loadAllContent(entries), 250);

    async function loadAllContent(entries) {
      for (const path of entries) {
        if (contentCache[path] !== undefined) continue;
        try {
          const r = await fetch(`${RAW}/references/${path}`);
          if (!r.ok) continue;
          const text = await r.text();
          const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').toLowerCase();
          contentCache[path] = body;
          indexed++;
          const sha = treeShas[path];
          if (sha) { try { localStorage.setItem(CONTENT_KEY_PREFIX + sha, body); } catch (_) {} }
          if (indexed % 5 === 0) updateStatus();
          await new Promise(res => setTimeout(res, 25));
        } catch (_) {}
      }
      updateStatus();
      if (input.value.trim()) onInput();
    }

    function updateStatus() {
      status.textContent = indexed >= total ? '' : `Indexing ${indexed}/${total}…`;
    }

    function onInput() {
      const q = input.value.trim().toLowerCase();
      const links = document.querySelectorAll('#ls-tree li a');
      const groups = document.querySelectorAll('#ls-tree .ls-group');

      if (!q) {
        links.forEach(a => a.parentElement.classList.remove('no-match'));
        groups.forEach(g => g.classList.remove('no-match'));
        const cur = getCurrentGroup();
        groups.forEach(g => {
          const head = g.querySelector('.ls-group-head');
          const isCurrent = g.dataset.group === cur;
          g.classList.toggle('ls-open', isCurrent);
          if (head) head.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
        });
        return;
      }

      const visibleGroups = new Set();
      links.forEach(a => {
        const path = a.dataset.path;
        const labelText = a.textContent.toLowerCase();
        const titleMatch = labelText.includes(q);
        const body = path && contentCache[path];
        const contentMatch = body !== undefined && body.includes(q);
        const matches = titleMatch || contentMatch;
        a.parentElement.classList.toggle('no-match', !matches);
        if (matches) {
          const group = a.closest('.ls-group');
          if (group) visibleGroups.add(group);
        }
      });
      groups.forEach(g => {
        const visible = visibleGroups.has(g);
        g.classList.toggle('no-match', !visible);
        if (visible) {
          g.classList.add('ls-open');
          const head = g.querySelector('.ls-group-head');
          if (head) head.setAttribute('aria-expanded', 'true');
        }
      });
    }

    function getCurrentGroup() {
      const slug = currentSourceSlug();
      if (!slug) return null;
      return slug.split('/')[0];
    }

    input.addEventListener('input', onInput);
  }

  // ── Helpers ───────────────────────────────────────────────────────

  // Returns the slug of the file the user is currently viewing (for
  // active-link highlighting and to decide which group to expand).
  // On source.html, that's the ?p= param; on a hub or article page,
  // it's derived from the URL section.
  function currentSourceSlug() {
    const onSource = /source\.html$/.test(location.pathname);
    if (onSource) {
      const p = (new URLSearchParams(location.search).get('p') || '').trim()
        .replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
      return p || '_portfolio-map';
    }
    // On non-source pages, infer the section from the URL path.
    const m = location.pathname.match(/\/(zia|zpa|cloud-connector|zcc|zdx|zidentity|zbi|zwa|zms|ai-security|risk360|deception|shared|_primer)(?:\/|$)/);
    if (m) return m[1];
    // Reader's guide and onboarding live under Welcome → expand the
    // _primer group since those primers are conceptually part of the
    // welcome cluster.
    if (/(readers-guide|onboarding)\.html$/.test(location.pathname)) return '_primer';
    return null;
  }

  function prettify(s) {
    return s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  function encodePath(p) {
    return p.split('/').map(encodeURIComponent).join('/');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
