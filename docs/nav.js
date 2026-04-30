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
      label: 'Home',
      href: 'index.html',
      match: [/^\/?$/, /\/index\.html$/, /\/docs\/?$/],
      children: [],
    },
    {
      key: 'welcome',
      label: 'Welcome',
      href: 'welcome/',
      match: [/\/welcome\//, /readers-guide/, /onboarding/, /source\.html\?.*p=_meta/primer/],
      children: [
        { href: 'welcome/',               label: 'Index',          match: [/\/welcome\/(index\.html)?$/] },
        { href: 'readers-guide.html',     label: "Reader's Guide", match: [/readers-guide/] },
        { href: 'onboarding.html',        label: 'Slideshow',      match: [/onboarding/] },
        { href: 'source.html?p=_primer',  label: 'Documents',      match: [/source\.html\?.*p=_meta/primer/] },
      ],
    },
    {
      key: 'zia',
      label: 'ZIA',
      href: 'zia/',
      match: [/\/zia\//, /\/zia\/?$/, /source\.html\?.*p=zia(\/|$)/],
      children: [
        { href: 'zia/',                label: 'Index',              match: [/\/zia\/(index\.html)?$/] },
        { href: 'zia/guide.html',  label: 'Guide',          match: [/zia\/guide/] },
        { href: 'zia/forwarding.html', label: 'Traffic Forwarding', match: [/zia\/forwarding/] },
        { href: 'source.html?p=zia',   label: 'Documents',          match: [/source\.html\?.*p=zia(\/|$)/], external: 'source' },
      ],
    },
    {
      key: 'zpa',
      label: 'ZPA',
      href: 'zpa/',
      match: [/\/zpa\//, /\/zpa\/?$/, /source\.html\?.*p=zpa(\/|$)/],
      children: [
        { href: 'zpa/',                label: 'Index',     match: [/\/zpa\/(index\.html)?$/] },
        { href: 'zpa/guide.html',  label: 'Guide', match: [/zpa\/guide/] },
        { href: 'source.html?p=zpa',   label: 'Documents', match: [/source\.html\?.*p=zpa(\/|$)/], external: 'source' },
      ],
    },
    {
      key: 'cloud-connector',
      label: 'Cloud Connector',
      href: 'cloud-connector/',
      match: [/cloud-connector\//, /source\.html\?.*p=cloud-connector(\/|$)/],
      children: [
        { href: 'cloud-connector/',                  label: 'Index',     match: [/cloud-connector\/(index\.html)?$/] },
        { href: 'cloud-connector/guide.html',    label: 'Guide', match: [/cloud-connector\/guide/] },
        { href: 'source.html?p=cloud-connector',     label: 'Documents', match: [/source\.html\?.*p=cloud-connector(\/|$)/], external: 'source' },
      ],
    },
  ];

  const RAIL_STATE_KEY = 'zskill:rail-hidden';

  // depth: 0 if at docs/ root (index.html, readers-guide.html, onboarding.html, source.html),
  // 1 if in a subdir (zia/*, zpa/*, cloud-connector/*).
  const path = location.pathname;
  const search = location.search;
  const pathAndSearch = path + search;
  const depth = /\/(zia|zpa|cloud-connector|welcome)\//.test(path) ? 1 : 0;
  const prefix = depth === 1 ? '../' : '';

  const currentSection = sections.find(s => s.match.some(re => re.test(pathAndSearch)));

  // Apply persisted rail state synchronously, before first paint, so we
  // don't get a flash of visible rail before it hides.
  if (safeRead(RAIL_STATE_KEY) === 'yes') document.body.classList.add('no-rail');

  const css = `
    #site-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; background: #f6f2e8; border-bottom: 1px solid #d8d0c0; }
    body { padding-top: var(--site-nav-height, 70px); }
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
      display: inline-flex;
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

  // Set --site-nav-height so the sidebar and body padding-top can
  // align under the fixed nav. Recompute on resize.
  function syncNavHeight() {
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--site-nav-height', h + 'px');
  }
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight, { passive: true });

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

  // Auto-load the shared left-sidebar (file-tree navigation). Always
  // loaded — every page gets the sidebar, and the rail toggle hides
  // it when desired.
  const sidebarScript = document.createElement('script');
  sidebarScript.src = prefix + 'left-sidebar.js?v=5';
  sidebarScript.async = true;
  document.body.appendChild(sidebarScript);

  function safeRead(k) {
    try { return localStorage.getItem(k); } catch (_) { return null; }
  }
  function safeWrite(k, v) {
    try { localStorage.setItem(k, v); } catch (_) {}
  }
})();
