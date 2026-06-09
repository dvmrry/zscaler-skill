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
  if (!window.ZSkill) { if (window.console) console.warn('hub-topics: docs-lib.js not loaded'); return; }

  const { loadTree, prettify, encodePath, escapeHtml } = window.ZSkill;

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
      `<a href="../source.html?p=${encodePath(it.slug)}">${escapeHtml(it.label)}</a>`
    ).join('');
    section.innerHTML =
      '<h3 class="topic-list-heading">Documents</h3>' +
      '<p class="topic-list-desc">Each link below renders the underlying markdown directly.</p>' +
      '<div class="topic-list">' + links + '</div>';

    docsNav.parentNode.insertBefore(section, docsNav.nextSibling);
  }).catch(err => {
    if (window.console) console.warn('hub-topics: could not load tree', err);
  });
})();
