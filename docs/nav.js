// nav.js — shared site navigation for zscaler-skill docs.
// Renders a two-tier sticky bar: top row = sections, bottom row = pages
// within the current section (only when the current section has 2+ pages).
// Path-aware so it works whether the page is at the docs/ root or one
// level down in a section subdir.
//
// Also injects a rail-toggle button (default off → rail visible) and a
// back-to-top button. The drawer (site-drawer.js) is no longer loaded —
// each page's contextual rail (TOC on reference docs, chapter list on
// the reader's guide, file tree on source.html) is the navigation
// surface, hideable on demand.
(function () {
  const sections = [
    {
      key: 'overview',
      label: 'Overview',
      href: 'index.html',
      match: [/^\/?$/, /\/index\.html$/, /\/docs\/?$/],
      children: [],
    },
    {
      key: 'welcome',
      label: 'Welcome',
      href: 'readers-guide.html',
      match: [/readers-guide/, /onboarding/],
      children: [
        { href: 'readers-guide.html', label: "Reader's Guide", match: [/readers-guide/] },
        { href: 'onboarding.html',    label: 'Deck',           match: [/onboarding/] },
      ],
    },
    {
      key: 'zia',
      label: 'ZIA',
      href: 'zia/',
      match: [/\/zia\//, /\/zia\/?$/, /source\.html\?.*p=zia(\/|$)/],
      children: [
        { href: 'zia/',                label: 'Overview',          match: [/\/zia\/(index\.html)?$/] },
        { href: 'zia/reference.html',  label: 'Reference',         match: [/zia\/reference/] },
        { href: 'zia/forwarding.html', label: 'Traffic Forwarding', match: [/zia\/forwarding/] },
        { href: 'source.html?p=zia',   label: 'Source',            match: [/source\.html\?.*p=zia(\/|$)/], external: 'source' },
      ],
    },
    {
      key: 'zpa',
      label: 'ZPA',
      href: 'zpa/',
      match: [/\/zpa\//, /\/zpa\/?$/, /source\.html\?.*p=zpa(\/|$)/],
      children: [
        { href: 'zpa/',                label: 'Overview',  match: [/\/zpa\/(index\.html)?$/] },
        { href: 'zpa/reference.html',  label: 'Reference', match: [/zpa\/reference/] },
        { href: 'source.html?p=zpa',   label: 'Source',    match: [/source\.html\?.*p=zpa(\/|$)/], external: 'source' },
      ],
    },
    {
      key: 'cloud-connector',
      label: 'Cloud Connector',
      href: 'cloud-connector/',
      match: [/cloud-connector\//, /source\.html\?.*p=cloud-connector(\/|$)/],
      children: [
        { href: 'cloud-connector/',                  label: 'Overview',  match: [/cloud-connector\/(index\.html)?$/] },
        { href: 'cloud-connector/reference.html',    label: 'Reference', match: [/cloud-connector\/reference/] },
        { href: 'source.html?p=cloud-connector',     label: 'Source',    match: [/source\.html\?.*p=cloud-connector(\/|$)/], external: 'source' },
      ],
    },
  ];

  const RAIL_STATE_KEY = 'zskill:rail-hidden';
  const RAIL_SELECTORS = '.doc .nav, .reading-rail, .sidebar';

  // depth: 0 if at docs/ root (index.html, readers-guide.html, onboarding.html, source.html),
  // 1 if in a subdir (zia/*, zpa/*, cloud-connector/*).
  const path = location.pathname;
  const search = location.search;
  const pathAndSearch = path + search;
  const depth = /\/(zia|zpa|cloud-connector)\//.test(path) ? 1 : 0;
  const prefix = depth === 1 ? '../' : '';

  const currentSection = sections.find(s => s.match.some(re => re.test(pathAndSearch)));

  // Apply persisted rail state synchronously, before first paint, so we
  // don't get a flash of visible rail before it hides.
  if (safeRead(RAIL_STATE_KEY) === 'yes') document.body.classList.add('no-rail');

  const css = `
    #site-nav { position: sticky; top: 0; z-index: 200; background: #f6f2e8; border-bottom: 1px solid #d8d0c0; }
    #site-nav .sn-row {
      display: flex; align-items: center;
      height: 38px; padding: 0 1.5rem;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 11.5px;
    }
    #site-nav .sn-row--sub {
      height: 32px;
      background: #efeadc;
      border-top: 1px solid #e2dac6;
      font-size: 11px;
    }
    #site-nav .sn-brand {
      font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      font-size: 10px; color: #1a1814; margin-right: 2rem; white-space: nowrap;
      text-decoration: none;
    }
    #site-nav .sn-links { display: flex; overflow-x: auto; }
    #site-nav a.sn-link {
      display: inline-flex; align-items: center;
      height: inherit; padding: 0 0.9rem;
      text-decoration: none; white-space: nowrap;
      color: #6a655d;
      border-bottom: 2px solid transparent;
      transition: color 0.1s;
    }
    #site-nav .sn-row--sub a.sn-link { height: 32px; color: #7a756d; }
    #site-nav a.sn-link:hover { color: #1a1814; }
    #site-nav a.sn-link.active {
      color: #8a3a1f;
      border-bottom-color: #8a3a1f;
      font-weight: 500;
    }
    #site-rail-toggle {
      display: none;
      align-items: center; justify-content: center;
      width: 28px; height: 28px;
      margin-right: 0.75rem; padding: 0;
      background: transparent;
      border: 1px solid transparent; border-radius: 3px;
      color: #6a655d;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 14px; line-height: 1;
      cursor: pointer;
      transition: background 0.1s, color 0.1s;
    }
    body[data-has-rail] #site-rail-toggle { display: inline-flex; }
    #site-rail-toggle:hover { background: #efeadc; color: #1a1814; }
    #site-rail-toggle[aria-pressed="true"] {
      background: #efeadc; color: #8a3a1f;
      border-color: #d8d0c0;
    }
    #site-to-top {
      position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 250;
      width: 36px; height: 36px; line-height: 32px;
      text-align: center; font-size: 16px;
      background: #f6f2e8; border: 1px solid #d8d0c0; border-radius: 50%;
      color: #4a4640; text-decoration: none;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s ease, color 0.1s, transform 0.1s;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
    }
    #site-to-top.visible { opacity: 1; pointer-events: auto; }
    #site-to-top:hover { color: #8a3a1f; transform: translateY(-1px); }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  const row1 = document.createElement('div');
  row1.className = 'sn-row';

  // Rail toggle — first item in row 1, before brand. Hidden by CSS
  // when the body doesn't carry data-has-rail (set below if a rail is
  // detected in the DOM).
  const railToggle = document.createElement('button');
  railToggle.id = 'site-rail-toggle';
  railToggle.type = 'button';
  railToggle.setAttribute('aria-label', 'Toggle sidebar');
  railToggle.textContent = '◧';
  syncToggleState();
  railToggle.addEventListener('click', function () {
    const hidden = document.body.classList.toggle('no-rail');
    safeWrite(RAIL_STATE_KEY, hidden ? 'yes' : 'no');
    syncToggleState();
  });
  row1.appendChild(railToggle);

  function syncToggleState() {
    const hidden = document.body.classList.contains('no-rail');
    railToggle.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    railToggle.title = hidden ? 'Show sidebar' : 'Hide sidebar';
  }

  const brand = document.createElement('a');
  brand.className = 'sn-brand';
  brand.href = prefix + 'index.html';
  brand.textContent = 'Zscaler Skill';
  row1.appendChild(brand);

  const topLinks = document.createElement('div');
  topLinks.className = 'sn-links';
  sections.forEach(function (sec) {
    const a = document.createElement('a');
    a.className = 'sn-link' + (currentSection && currentSection.key === sec.key ? ' active' : '');
    a.href = prefix + sec.href;
    a.textContent = sec.label;
    topLinks.appendChild(a);
  });
  row1.appendChild(topLinks);
  nav.appendChild(row1);

  // Sub-row whenever the current section has 2+ children.
  if (currentSection && currentSection.children.length >= 2) {
    const row2 = document.createElement('div');
    row2.className = 'sn-row sn-row--sub';
    const subLinks = document.createElement('div');
    subLinks.className = 'sn-links';
    currentSection.children.forEach(function (page) {
      const a = document.createElement('a');
      const isActive = page.match.some(re => re.test(pathAndSearch));
      a.className = 'sn-link' + (isActive ? ' active' : '');
      a.href = prefix + page.href;
      a.textContent = page.label;
      subLinks.appendChild(a);
    });
    row2.appendChild(subLinks);
    nav.appendChild(row2);
  }

  document.body.prepend(nav);

  // Back-to-top button.
  const toTop = document.createElement('a');
  toTop.id = 'site-to-top';
  toTop.href = '#top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);

  function onScroll() {
    if (window.scrollY > 400) toTop.classList.add('visible');
    else toTop.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Detect a contextual rail in the DOM and surface the toggle button
  // only on pages where it's meaningful. Run once after DOMContentLoaded
  // so dynamically-rendered rails (e.g., source.html sidebar) are seen.
  function detectRail() {
    if (document.querySelector(RAIL_SELECTORS)) {
      document.body.setAttribute('data-has-rail', '');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectRail);
  } else {
    detectRail();
  }
  // Recheck on load — source.html renders its sidebar after fetch.
  window.addEventListener('load', detectRail);

  function safeRead(k) {
    try { return localStorage.getItem(k); } catch (_) { return null; }
  }
  function safeWrite(k, v) {
    try { localStorage.setItem(k, v); } catch (_) {}
  }
})();
