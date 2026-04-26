// site-drawer.js — slide-in file-tree navigation, available from every
// page that loads nav.js. Closed by default. Toggle is added to the
// site-nav top row (or as a floating button if no top nav is present).
//
// Shares the same 30-min localStorage tree cache as nav.js / source.html /
// hub-topics.js, so the first page that fetches the tree warms it for
// every subsequent page in the same session.
(function () {
  if (window.__siteDrawerInit) return;
  window.__siteDrawerInit = true;

  const REPO = 'dvmrry/zscaler-skill';
  const BRANCH = 'main';
  const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const CACHE_KEY = 'zskill:ref-tree:v1';
  const CACHE_TTL = 1000 * 60 * 30;
  const STATE_KEY = 'zskill:drawer-open';

  const GROUP_LABELS = {
    'zia': 'ZIA', 'zpa': 'ZPA', 'zcc': 'ZCC', 'zdx': 'ZDX',
    'zbi': 'ZBI', 'zms': 'ZMS', 'zwa': 'ZWA',
    'zidentity': 'ZIdentity', 'cloud-connector': 'Cloud Connector',
    'shared': 'Shared', 'ai-security': 'AI Security',
    'risk360': 'Risk360', 'deception': 'Deception', '_primer': 'Primer',
  };
  const GROUP_ORDER = [
    'zia', 'zpa', 'cloud-connector',
    'zcc', 'zdx', 'zidentity',
    'zbi', 'zwa', 'zms',
    'ai-security', 'risk360', 'deception',
    'shared', '_primer',
  ];

  injectStyles();
  const els = createDrawer();
  wireToggleButton(els);
  loadTreeAndRender(els);

  // ─────────────────────────────────────────────────────────────────

  function injectStyles() {
    const css = `
      #site-drawer-toggle {
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px;
        background: transparent; border: 1px solid transparent;
        color: #4a4640; cursor: pointer;
        font-size: 16px; line-height: 1; padding: 0;
        margin-right: 0.5rem; border-radius: 3px;
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
        transition: background 0.1s, color 0.1s;
      }
      #site-drawer-toggle:hover { background: #efeadc; color: #1a1814; }
      #site-drawer-backdrop {
        position: fixed; inset: 0; z-index: 300;
        background: rgba(20, 16, 12, 0.32);
        opacity: 0; pointer-events: none;
        transition: opacity 0.2s ease;
      }
      #site-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
      #site-drawer {
        position: fixed; top: 0; left: 0; bottom: 0;
        width: 320px; max-width: 80vw; z-index: 310;
        background: #f6f2e8;
        border-right: 1px solid #d8d0c0;
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.06);
        transform: translateX(-100%);
        transition: transform 0.22s ease;
        display: flex; flex-direction: column;
      }
      #site-drawer.open { transform: translateX(0); }
      .sd-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.75rem 1.25rem;
        background: #efeadc; border-bottom: 1px solid #d8d0c0;
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
      }
      .sd-header strong {
        font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        font-size: 0.7rem; color: #1a1814;
      }
      .sd-close {
        background: transparent; border: 0; cursor: pointer;
        font-size: 22px; color: #4a4640; padding: 0 0.25rem; line-height: 1;
      }
      .sd-close:hover { color: #1a1814; }
      .sd-search {
        padding: 0.7rem 1.25rem 0.55rem;
        background: #efeadc; border-bottom: 1px solid #d8d0c0;
      }
      .sd-search input {
        width: 100%; padding: 0.4rem 0.6rem;
        font-family: 'IBM Plex Sans', sans-serif; font-size: 0.78rem;
        background: #f6f2e8; color: #1a1814;
        border: 1px solid #d8d0c0; border-radius: 2px;
        -webkit-appearance: none; appearance: none;
      }
      .sd-search input:focus { outline: none; border-color: #8a3a1f; }
      .sd-tree {
        flex: 1; overflow-y: auto;
        padding: 0.75rem 0 1.5rem;
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
        font-size: 0.82rem;
      }
      .sd-tree h3 {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.66rem; font-weight: 500;
        text-transform: uppercase; letter-spacing: 0.12em;
        color: #8a8680;
        padding: 0.6rem 1.25rem 0.4rem;
        margin: 0;
      }
      .sd-tree h3:first-child { padding-top: 0; }
      .sd-tree ul { list-style: none; margin: 0 0 0.4rem; padding: 0; }
      .sd-tree li.no-match { display: none; }
      .sd-tree h3.no-match { display: none; }
      .sd-tree a {
        display: block;
        padding: 0.22rem 1.25rem;
        color: #4a4640; text-decoration: none;
        line-height: 1.35;
        border-left: 2px solid transparent;
        transition: color 0.1s, background 0.1s;
      }
      .sd-tree a:hover { color: #1a1814; background: #f0eadc; }
      .sd-tree a.active {
        color: #8a3a1f; border-left-color: #8a3a1f; font-weight: 500;
      }
      .sd-status {
        padding: 1rem 1.25rem;
        color: #8a8680; font-size: 0.74rem;
        font-family: 'IBM Plex Mono', monospace;
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createDrawer() {
    const backdrop = document.createElement('div');
    backdrop.id = 'site-drawer-backdrop';

    const drawer = document.createElement('aside');
    drawer.id = 'site-drawer';
    drawer.setAttribute('aria-label', 'Reference file tree');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="sd-header">
        <strong>References</strong>
        <button class="sd-close" type="button" aria-label="Close">&times;</button>
      </div>
      <div class="sd-search">
        <input type="search" id="sd-search-input" placeholder="Filter by title" autocomplete="off" spellcheck="false">
      </div>
      <nav class="sd-tree" id="sd-tree">
        <p class="sd-status">Loading…</p>
      </nav>
    `;

    document.body.appendChild(drawer);
    document.body.appendChild(backdrop);

    drawer.querySelector('.sd-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });

    function open() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('open');
      try { localStorage.setItem(STATE_KEY, 'open'); } catch (_) {}
    }
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('open');
      try { localStorage.setItem(STATE_KEY, 'closed'); } catch (_) {}
    }
    function toggle() {
      if (drawer.classList.contains('open')) close(); else open();
    }

    return { drawer, backdrop, open, close, toggle };
  }

  function wireToggleButton(els) {
    // Wait until nav.js has built the topbar so we can inject into it.
    // If the site-nav isn't found within ~100ms, fall back to a floating
    // button so pages without nav.js still get a toggle.
    let attempts = 0;
    const timer = setInterval(() => {
      const navBar = document.getElementById('site-nav');
      if (navBar) {
        clearInterval(timer);
        attachToNav(navBar);
      } else if (++attempts > 20) {
        clearInterval(timer);
        attachFloating();
      }
    }, 10);

    function makeBtn() {
      const btn = document.createElement('button');
      btn.id = 'site-drawer-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Toggle reference file tree');
      btn.textContent = '☰'; // ≡
      btn.addEventListener('click', els.toggle);
      return btn;
    }

    function attachToNav(navBar) {
      const row1 = navBar.querySelector('.sn-row');
      if (row1) row1.insertBefore(makeBtn(), row1.firstChild);
      else navBar.insertBefore(makeBtn(), navBar.firstChild);
    }
    function attachFloating() {
      const btn = makeBtn();
      btn.style.position = 'fixed';
      btn.style.top = '0.6rem';
      btn.style.left = '0.75rem';
      btn.style.zIndex = '320';
      btn.style.background = '#f6f2e8';
      btn.style.border = '1px solid #d8d0c0';
      document.body.appendChild(btn);
    }
  }

  // ── Tree rendering ────────────────────────────────────────────────

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
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), entries })); } catch (_) {}
    return entries;
  }

  function loadTreeAndRender(els) {
    loadTree().then(renderTree).catch(err => {
      const tree = document.getElementById('sd-tree');
      tree.innerHTML = `<p class="sd-status">Could not load file list.<br><small>${escapeHtml(err.message)}</small></p>`;
    });
  }

  function renderTree(entries) {
    const tree = document.getElementById('sd-tree');
    if (!entries || !entries.length) {
      tree.innerHTML = '<p class="sd-status">No reference files found.</p>';
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

    const sourceHref = sourceUrlPrefix();
    const html = [];

    if (topLevel.length) {
      html.push('<h3>References</h3><ul>');
      for (const f of topLevel) {
        const slug = f.path.replace(/\.md$/, '');
        html.push(item(slug, f.label, currentSlug, sourceHref));
      }
      html.push('</ul>');
    }

    const orderedKeys = [
      ...GROUP_ORDER.filter(k => groups[k]),
      ...Object.keys(groups).filter(k => !GROUP_ORDER.includes(k)).sort(),
    ];

    for (const key of orderedKeys) {
      const label = GROUP_LABELS[key] || prettify(key);
      html.push(`<h3>${escapeHtml(label)}</h3><ul>`);
      for (const f of groups[key]) {
        const slug = f.path.replace(/\.md$/, '').replace(/\/index$/, '');
        const display = f.path.endsWith('/index.md') ? 'Overview' : f.label;
        html.push(item(slug, display, currentSlug, sourceHref));
      }
      html.push('</ul>');
    }

    tree.innerHTML = html.join('');
    setupFilter();
  }

  function item(slug, label, currentSlug, sourceHref) {
    const cls = slug === currentSlug ? ' class="active"' : '';
    return `<li><a href="${sourceHref}?p=${encodePath(slug)}"${cls}>${escapeHtml(label)}</a></li>`;
  }

  function setupFilter() {
    const input = document.getElementById('sd-search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      const links = document.querySelectorAll('#sd-tree li a');
      const headers = document.querySelectorAll('#sd-tree h3');
      const visibleLists = new Set();
      links.forEach(a => {
        const text = a.textContent.toLowerCase();
        const path = a.getAttribute('href').toLowerCase();
        const matches = !q || text.includes(q) || path.includes(q);
        a.parentElement.classList.toggle('no-match', !matches);
        if (matches) {
          const list = a.closest('ul');
          if (list) visibleLists.add(list);
        }
      });
      headers.forEach(h => {
        const next = h.nextElementSibling;
        h.classList.toggle('no-match', !(next && visibleLists.has(next)));
      });
    });
  }

  // ── helpers ───────────────────────────────────────────────────────

  function sourceUrlPrefix() {
    // From any page, link to source.html at the docs/ root.
    const path = location.pathname;
    if (/\/(zia|zpa|cloud-connector)\//.test(path)) return '../source.html';
    return 'source.html';
  }

  function currentSourceSlug() {
    const onSource = /source\.html$/.test(location.pathname);
    if (!onSource) return null;
    const p = (new URLSearchParams(location.search).get('p') || '').trim()
      .replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
    return p || '_portfolio-map';
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
