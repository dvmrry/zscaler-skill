// nav.js — shared site navigation for zscaler-skill docs
(function () {
  const pages = [
    { href: 'index.html',        label: 'Overview',       match: [/\/$/, /index\.html$/] },
    { href: 'readers-guide.html', label: "Reader's Guide", match: [/readers-guide/] },
    { href: 'zia-reference.html', label: 'ZIA Reference',  match: [/zia-reference/] },
    { href: 'zia-forwarding.html', label: 'ZIA Forwarding', match: [/zia-forwarding/] },
    { href: 'zpa-reference.html', label: 'ZPA Reference',  match: [/zpa-reference/] },
    { href: 'cloud-connector.html', label: 'Cloud Connector', match: [/cloud-connector/] },
    { href: 'onboarding.html',   label: 'Deck',           match: [/onboarding/] },
  ];

  const path = location.pathname;
  const current = pages.find(p => p.match.some(re => re.test(path)));

  const css = `
    #site-nav {
      position: sticky; top: 0; z-index: 200;
      display: flex; align-items: center; gap: 0;
      height: 38px; padding: 0 1.5rem;
      background: #f6f2e8;
      border-bottom: 1px solid #d8d0c0;
      font-family: 'IBM Plex Sans', 'IBM Plex Sans', system-ui, sans-serif;
      font-size: 11.5px;
    }
    #site-nav .sn-brand {
      font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      font-size: 10px; color: #1a1814; margin-right: 2rem; white-space: nowrap;
      text-decoration: none;
    }
    #site-nav .sn-links {
      display: flex; overflow-x: auto;
    }
    #site-nav a.sn-link {
      display: inline-flex; align-items: center;
      height: 38px; padding: 0 0.9rem;
      text-decoration: none; white-space: nowrap;
      color: #6a655d;
      border-bottom: 2px solid transparent;
      transition: color 0.1s;
    }
    #site-nav a.sn-link:hover { color: #1a1814; }
    #site-nav a.sn-link.active {
      color: #8a3a1f;
      border-bottom-color: #8a3a1f;
      font-weight: 500;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  const brand = document.createElement('a');
  brand.className = 'sn-brand';
  brand.href = 'index.html';
  brand.textContent = 'Zscaler Skill';
  nav.appendChild(brand);

  const links = document.createElement('div');
  links.className = 'sn-links';

  pages.forEach(function (page) {
    const a = document.createElement('a');
    a.className = 'sn-link' + (current && current.href === page.href ? ' active' : '');
    a.href = page.href;
    a.textContent = page.label;
    links.appendChild(a);
  });

  nav.appendChild(links);
  document.body.prepend(nav);
})();
