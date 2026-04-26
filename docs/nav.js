// nav.js — shared site navigation for zscaler-skill docs.
// Renders a two-tier sticky bar: top row = sections, bottom row = pages
// within the current section (only when the current section has 2+ pages).
// Path-aware so it works whether the page is at the docs/ root or one
// level down in a section subdir.
//
// "Source" sub-row links point at source.html?p=<path>, which renders
// the underlying markdown directly from the references/ tree.
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

  // depth: 0 if at docs/ root (index.html, readers-guide.html, onboarding.html, source.html),
  // 1 if in a subdir (zia/*, zpa/*, cloud-connector/*).
  const path = location.pathname;
  const search = location.search;
  const pathAndSearch = path + search;
  const depth = /\/(zia|zpa|cloud-connector)\//.test(path) ? 1 : 0;
  const prefix = depth === 1 ? '../' : '';

  const currentSection = sections.find(s => s.match.some(re => re.test(pathAndSearch)));

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

  // Sub-row whenever the current section has 2+ children (every section
  // with content does now, since each adds a "Source" link).
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

  // Back-to-top button — fades in once you've scrolled past the fold.
  // Inserted on every page that loads nav.js. Hidden in scroll-less
  // contexts (e.g., the deck) by virtue of always being below the
  // visibility threshold.
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

  // Auto-load the site drawer (shared file-tree navigation). Loaded
  // here instead of via per-page <script> tags so a single update to
  // nav.js / site-drawer.js propagates everywhere.
  const drawerScript = document.createElement('script');
  drawerScript.src = prefix + 'site-drawer.js?v=2';
  drawerScript.async = true;
  document.body.appendChild(drawerScript);
})();
