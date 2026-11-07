// hub-topics.js — append a "Product knowledge" note to a section hub.
//
// Activate by setting <body data-hub-group="zia"> (or "zpa", etc.) on the hub
// page. Product knowledge under references/<product>/ is JSON subjects (claims
// with quoted evidence, gaps, divergences), read with the resolver rather than
// rendered as pages, so the section points at the command and the directory.
// The welcome hub (data-hub-group="_meta/primer") needs no note.
(function () {
  const group = document.body && document.body.dataset && document.body.dataset.hubGroup;
  if (!group) return;
  if (!window.ZSkill) { if (window.console) console.warn('hub-topics: docs-lib.js not loaded'); return; }

  const { TREE, escapeHtml } = window.ZSkill;
  const docsNav = document.querySelector('nav.docs');
  if (!docsNav || group.startsWith('_meta')) return;

  const section = document.createElement('section');
  section.className = 'topic-list-section';
  section.innerHTML =
    '<h3 class="topic-list-heading">Product knowledge</h3>' +
    '<p class="topic-list-desc">Read with <code>node scripts/kb.mjs resolve ' + escapeHtml(group) +
    '</code>: each subject carries claims with quoted evidence, gaps and divergences. ' +
    'The subjects are JSON files in <a href="' + TREE + '/references/' + encodeURIComponent(group) +
    '" target="_blank" rel="noopener"><code>references/' + escapeHtml(group) + '/</code></a>.</p>';
  docsNav.parentNode.insertBefore(section, docsNav.nextSibling);
})();
