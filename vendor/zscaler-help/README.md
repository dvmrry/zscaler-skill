# Zscaler help content — pinned bibliography

This directory holds documentation artifacts published by Zscaler (PDFs, CSVs, HTML exports from `help.zscaler.com`). They are the **pinned bibliography** our `references/*.md` cite as primary source. Committing them keeps those citations reproducible: anyone cloning the repo can open the exact artifact a reference doc quotes from, regardless of whether Zscaler later updates the source page.

See [`NOTICE`](./NOTICE) for attribution and provenance. The content is Zscaler's; we include it in good faith as reference material accompanying our derivative `references/` distillation.

## Drop convention

- **Format:** PDF preferred. `help.zscaler.com` has a "Print PDF" option on most articles. Markdown captures from Playwright MCP (for JS-rendered pages) are also welcome as `.md` here.
- **Naming:** `<topic>.pdf` at the flat level of this directory. Use descriptive snake_case:
  - `zia-url-filtering-policy.pdf`
  - `zia-url-categories.pdf`
  - `zia-ssl-inspection-pipeline.pdf`
  - `zia-cloud-app-control.pdf`
  - `zia-nss-web-output-format.pdf`
  - `zia-nss-firewall-output-format.pdf`
  - `zia-nss-dns-output-format.pdf`
  - `zpa-access-policy-evaluation.pdf`
  - `zpa-application-segments.pdf`
  - `zpa-lss-output-format.pdf`
- **Multi-page topics:** numeric suffixes — `zia-url-filtering-policy-1.pdf`, `-2.pdf`.

## Workflow

1. Author (or Claude Code acting as author) identifies which `references/*.md` stub they're working on.
2. Author reads the corresponding PDF(s) here.
3. Author writes distilled content into the `references/` file.
4. `sources:` frontmatter in the reference file cites the help URL and fetch date (**not** the local PDF path, so the reference doc stays useful even when the PDF isn't present).

## Refresh

When Zscaler updates a help page:

1. Redownload the PDF (overwrites the previous version — filename stays stable).
2. Re-read and update any `references/*.md` files that cite it.
3. Bump `last-verified` on each updated reference file to today's date.

## What's in this directory

All files here are committed — PDFs, CSVs, and Playwright-captured markdown. This is the pinned bibliography the `references/*.md` files cite. See `NOTICE` for attribution and provenance.
