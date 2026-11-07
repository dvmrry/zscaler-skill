// left-sidebar.js — shared left-hand navigation, available on every page that
// loads nav.js (nav.js auto-loads this).
//
// Renders an <aside class="left-sidebar"> with a title filter and the docs that
// exist as Markdown (primer, guides, data contract), plus one link per product
// to its references/<product>/ directory on GitHub. Product knowledge is JSON
// subjects read through `node scripts/kb.mjs resolve`, so there is nothing to
// render per subject. The group matching the current page auto-expands.
(function () {
  if (window.__leftSidebarInit) return;
  window.__leftSidebarInit = true;
  if (!window.ZSkill) return; // docs-lib.js must load first (bootstrapped by nav.js)

  const { VIEW, TREE, DOC_GROUPS, encodePath, escapeHtml } = window.ZSkill;

  const PRODUCTS = [
    ['zia', 'ZIA'], ['zpa', 'ZPA'], ['cloud-connector', 'ZTW / Cloud & Branch'],
    ['zcc', 'Zscaler Client Connector'], ['zdx', 'ZDX'], ['zidentity', 'ZIdentity'],
    ['zbi', 'ZBI'], ['zwa', 'ZWA'], ['zms', 'ZMS'], ['shared', 'Shared'],
    ['portfolio', 'Portfolio'],
  ];

  // Resolve relative path so file links work from any page.
  const PREFIX = /\/(zia|zpa|zcc|cloud-connector|zidentity|zdx|welcome)\//.test(location.pathname) ? '../' : '';
  const SOURCE_URL = PREFIX + 'source.html';

  const sidebar = document.createElement('aside');
  sidebar.className = 'left-sidebar';
  sidebar.id = 'left-sidebar';
  sidebar.setAttribute('aria-label', 'Documents');
  sidebar.innerHTML = `
    <div class="ls-search">
      <input type="search" id="ls-search-input" placeholder="Filter documents" autocomplete="off" spellcheck="false">
      <div class="ls-search-status" id="ls-search-status"></div>
    </div>
    <nav class="ls-tree" id="ls-tree"></nav>
  `;
  document.body.appendChild(sidebar);
  document.body.classList.add('has-left-rail');

  const currentSlug = currentSourceSlug();
  const currentGroup = currentSlug ? 'primer' : null;
  const html = [];

  for (const g of DOC_GROUPS) {
    const items = g.docs.map(d => d.slug
      ? { href: `${SOURCE_URL}?p=${encodePath(d.slug)}`, label: d.label, active: d.slug === currentSlug, external: false }
      : { href: `${VIEW}/${d.path}`, label: d.label, active: false, external: true });
    html.push(renderGroup(g.key, g.label, items, g.key === currentGroup));
  }
  html.push(renderGroup('products', 'Product knowledge (GitHub)',
    PRODUCTS.map(([dir, label]) => ({ href: `${TREE}/references/${dir}`, label, active: false, external: true })),
    false));

  document.getElementById('ls-tree').innerHTML = html.join('');
  setupGroupToggle();
  setupFilter();

  function renderGroup(key, label, items, expanded) {
    const out = [`<div class="ls-group${expanded ? ' ls-open' : ''}" data-group="${escapeHtml(key)}">`];
    out.push(`<button class="ls-group-head" type="button" aria-expanded="${expanded}">`);
    out.push(`<span class="ls-group-caret" aria-hidden="true">▸</span>`);
    out.push(`<span class="ls-group-label">${escapeHtml(label)}</span>`);
    out.push(`<span class="ls-group-count">${items.length}</span>`);
    out.push(`</button>`);
    out.push(`<div class="ls-group-list"><ul class="ls-flat-list">`);
    for (const it of items) {
      const cls = it.active ? ' class="active"' : '';
      const ext = it.external ? ' target="_blank" rel="noopener"' : '';
      out.push(`<li><a href="${escapeHtml(it.href)}"${cls}${ext}>${escapeHtml(it.label)}</a></li>`);
    }
    out.push(`</ul></div></div>`);
    return out.join('');
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

  function setupFilter() {
    const input = document.getElementById('ls-search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      const groups = document.querySelectorAll('#ls-tree .ls-group');
      document.querySelectorAll('#ls-tree li').forEach(li => {
        li.classList.toggle('no-match', !!q && !li.textContent.toLowerCase().includes(q));
      });
      groups.forEach(g => {
        const visible = !q || !!g.querySelector('li:not(.no-match)');
        g.classList.toggle('no-match', !visible);
        const open = q ? visible : g.dataset.group === currentGroup;
        g.classList.toggle('ls-open', open);
        g.querySelector('.ls-group-head').setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  // The primer slug being viewed on source.html, else null.
  function currentSourceSlug() {
    if (!/source\.html$/.test(location.pathname)) return null;
    const p = (new URLSearchParams(location.search).get('p') || '').trim()
      .replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
    return p || '_meta/primer/index';
  }
})();
