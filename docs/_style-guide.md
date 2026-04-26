# Docs style guide

A short primer on the design system used by the Zscaler skill docs site (`docs/*.html`). Read this before generating a new doc page — it replaces the need to read a full 1,500-line reference doc just to learn the tokens and components.

## Aesthetic

Editorial, paper-and-ink. Newspaper / quiet-tech feel — Source Serif 4 for body, IBM Plex Sans for UI labels, IBM Plex Mono for code and metadata. Warm off-white background, dark brown ink, a single burnt-sienna accent used sparingly.

**Do not** use emojis, drop shadows, gradients, rounded-everything, neon accents, or marketing-style hero blocks. The look is closer to *The New Yorker* or *Stripe Docs* than to a SaaS landing page.

## Tokens

All tokens live in `docs/site.css`:

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1a1814` | Primary text |
| `--ink-2` | `#4a4640` | Secondary text |
| `--ink-3` | `#8a8680` | Meta, eyebrows, ghost UI |
| `--ink-ghost` | `#b8b3aa` | Separators within ink-on-ink |
| `--paper` | `#f6f2e8` | Page background |
| `--paper-deep` | `#efeadc` | Sidebar / callout / pre block bg |
| `--paper-card` | `#f0eadc` | Hover backgrounds |
| `--accent` | `#8a3a1f` | Active state, links in body, single-strike emphasis |
| `--accent-ink` | `#6e2d18` | Hover on accent |
| `--rule` | `#d8d0c0` | Borders, dividers |
| `--warn` | `#8a3a1f` | Warning callout border |
| `--font-serif` | Source Serif 4 → Iowan Old Style → Georgia | Body |
| `--font-sans` | IBM Plex Sans → system-ui | UI, labels, eyebrows, table headers |
| `--font-mono` | IBM Plex Mono → JetBrains Mono | Code, metadata, breadcrumbs, mono labels |

Use the token, not the literal value, in any new CSS.

## Page archetypes

Three layouts, in order of frequency:

### 1. Hub page

Single-column landing. Used by the homepage and each product section's `index.html`. Skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>X — Zscaler Skill</title>
  <link rel="stylesheet" href="../site.css">
</head>
<body>
  <div class="hub-page">
    <header>
      <span class="eyebrow"><a href="../index.html">dvmrry / zscaler-skill</a> &nbsp;·&nbsp; X</span>
      <h1>Section <em>Name</em></h1>
      <p class="subtitle">One short sentence on what's in this section.</p>
    </header>

    <nav class="docs">
      <a class="doc-link" href="reference.html">
        <div>
          <div class="doc-title">Title</div>
          <div class="doc-desc">One short sentence describing the page.</div>
        </div>
        <span class="doc-meta">Reference</span>
      </a>
      <!-- repeat .doc-link per child page -->
    </nav>

    <footer>Generated from zscaler-skill · dvmrry/zscaler-skill</footer>
  </div>
<script src="../nav.js"></script>
</body>
</html>
```

`site.css` provides every class above. The page typically needs zero per-file CSS.

### 2. Reference doc

Dense, scannable. Used for `zia/reference.html`, `zia/forwarding.html`, `zpa/reference.html`, `cloud-connector/reference.html`. Three-column grid: sticky sidebar nav (left), main body (center, ~48rem), margin-note rail (right). Plus topbar with breadcrumbs above and a triage table + open-clarifications register at the bottom.

These docs are not yet migrated to import `site.css`; they each have their own complete stylesheet. When generating a new reference doc, copy the structure of `cloud-connector/reference.html` (the most recent and cleanest example) and reuse its CSS verbatim. Sections to include:

- Topbar with breadcrumbs (`Zscaler Skill › <Group> › <Doc>`)
- "At a glance" summary block (`#glance`)
- Body sections with anchor IDs
- Field anatomy tables
- Triage table (symptom → cause → reference)
- Open clarifications register (id, status pill, question)
- Margin notes positioned via `positionNotes()` JS

### 3. Source view

Implemented once in `docs/source.html`. Live-renders any markdown file in `references/` via marked.js + a 280px file-tree sidebar. Don't replicate; link to it via `source.html?p=<group>/<topic>`.

## Components

### Topbar (reference docs + source view)

```html
<div class="topbar">
  <a class="brand" href="../index.html">Zscaler Skill</a>
  <span class="sep">·</span>
  <span class="crumbs">
    <a href="../index.html">…</a>
    <span class="sep"> › </span>
    <span style="color: var(--ink);">Current page</span>
  </span>
</div>
```

### Callouts

Three variants — `.warn` (⚠), `.note` (→), `.tip` (✓). Plain prose inside; the icon is positioned absolutely via `::before` so the body flows as one block. **Do not** use `display: grid` for callouts — earlier attempts caused every text node and inline `<code>` to land in its own grid cell, splitting the message into a fragmented column.

### Tables

Plain HTML tables. Header row: IBM Plex Sans, uppercase, 0.04em letter-spacing, `var(--paper-deep)` background. Body cells: `var(--font-sans)`, 0.88rem, 1px `var(--rule)` bottom border between rows. Padding `0.55rem 0.75rem`.

### Status pills

Inline labels for clarification register, status, etc. Three variants:
- `.pill-open` — burnt orange, "needs work"
- `.pill-partial` — sandstone, "in progress"
- `.pill-resolved` — sage green, "done"

### Hub doc-link cards

Defined in `site.css`. Use `<a class="doc-link">` with three children: a `<div>` containing `.doc-title` and `.doc-desc`, plus a `<span class="doc-meta">` for the right-aligned tag (e.g., "Reference", "≈ 28 min", "18 slides").

## Conventions

- **No comments in HTML output** unless they're load-bearing (section dividers in long files are OK).
- **No audience callouts.** Don't write "operators should…", "you'll need to…". Factual third-person. The exception is the deck (`onboarding.html`) which has speaker notes by design.
- **Em-dashes**, not hyphens with spaces, for parenthetical asides.
- **Backticks** for `--token-names`, code identifiers, file paths.
- **Anchor IDs** are kebab-case nouns (`#triage`, `#ssl-anatomy`, not `#table-of-triage-cases`).
- **One H1 per page.** Section heads are H2; sub-heads H3; component labels (e.g., margin-note titles) are H4 in `var(--font-sans)` uppercase.

## What goes where

When asked to add new content, choose the surface deliberately:

| Content shape | Surface |
|---|---|
| New topic or product area, dense reference, multi-section | New reference doc under `docs/<group>/` |
| Single-page note, runbook, primer | Markdown file in `references/<group>/` — auto-rendered via Source view |
| Cross-product editorial, narrative reading path | New top-level HTML in `docs/` (rare) |
| Slide-style overview | Add to `onboarding.html` (rarer) |

Default to a markdown file in `references/` unless the content shape genuinely calls for a curated HTML synthesis.
