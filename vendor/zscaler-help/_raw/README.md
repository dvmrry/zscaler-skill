# `vendor/zscaler-help/_raw/` — raw scrape captures

First-pass JSON captures from the Zscaler help-doc scraping pipeline. Each file holds the raw `{title, url, text, links}` extraction for one source page.

## Why these are kept

The pipeline that captures Zscaler help articles does it in two passes:

1. **Raw capture** (this directory): the unprocessed JSON dump of one URL — title, body text, and outbound links.
2. **Cleaned capture** (parent directory `vendor/zscaler-help/automate-zscaler/*.md`): the body text reformatted as readable Markdown, with provenance front-matter.

Most of the time, raw → clean is 1:1. But the pipeline only converted a *subset* of pages into clean MDs. The raw captures here cover content that has **no clean MD equivalent** — notably:

- Per-product rate-limit pages (`rate-limiting-zia-raw.json`, `-zpa-`, `-zcc-`, `-zdx-`, `-bi-`, `-ztw-`) — only the general `guides-rate-limiting.md` exists in clean form
- Tools-intro and several analytics variants

## When to use a raw capture

- A reference doc needs content that's only in the raw form (rare)
- Cross-checking between the cleaner MD and the original page text
- Re-running the pipeline if a clean MD was inadvertently lost

For everyday citation, prefer the clean MDs. Only fall back to `_raw/` when the clean version doesn't exist or is suspect.

## Provenance

All files in this directory were captured 2026-04-24 against `automate.zscaler.com`. The `url` field inside each JSON is the source page.

## Why not delete

Considered. Decided against because (a) some content here has no clean equivalent and (b) re-scraping has cost (rate limiting, drift risk, requires the scrape pipeline to be working). Cheaper to keep the raw captures than to risk losing source material.
