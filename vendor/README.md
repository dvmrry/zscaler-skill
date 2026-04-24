# vendor/

Upstream Zscaler sources, vendored as git submodules at pinned commits.

## What's here

| Path | Upstream | Why |
|---|---|---|
| `zscaler-sdk-python/` | [`zscaler/zscaler-sdk-python`](https://github.com/zscaler/zscaler-sdk-python) | Python SDK; canonical API coverage and auth flows |
| `terraform-provider-zia/` | [`zscaler/terraform-provider-zia`](https://github.com/zscaler/terraform-provider-zia) | ZIA TF resource schemas and gotchas |
| `terraform-provider-zpa/` | [`zscaler/terraform-provider-zpa`](https://github.com/zscaler/terraform-provider-zpa) | ZPA TF resource schemas and gotchas |
| `zscaler-mcp-server/` | [`zscaler/zscaler-mcp-server`](https://github.com/zscaler/zscaler-mcp-server) | Zscaler-authored operational content — 28 skills across ZIA/ZPA/ZDX/ZMS/EASM/ZINS, 20 slash commands, plus CLAUDE.md and GEMINI.md. Canonical workflow vocabulary; covers procedures but not the reasoning semantics our `references/` distill. |
| `splunk-sdk-python/` | [`splunk/splunk-sdk-python`](https://github.com/splunk/splunk-sdk-python) | Python SDK for submitting SPL searches and streaming results — used by `scripts/splunk-query.sh` to execute the SPL patterns in `references/shared/splunk-queries.md`. |

## What's intentionally not vendored

### Zscaler help site / KB articles

Web-only at `help.zscaler.com`. Zscaler-authored content we've vendored in `vendor/zscaler-help/` as a pinned bibliography — PDFs printed via the help-site "Print PDF" feature, CSVs downloaded directly, and markdown captures fetched via Playwright MCP from JS-rendered pages. Attribution and provenance are in `vendor/zscaler-help/NOTICE`. Files are committed (not gitignored) so the citations in `references/*.md` remain reproducible on a fresh clone.

### Splunk SPL reference docs

Web-only at `docs.splunk.com`. Our SPL patterns (`references/shared/splunk-queries.md`) are a narrow, Zscaler-scoped subset we curate ourselves. Splunk's full SPL reference is large and mostly irrelevant to this skill; not worth mirroring.

### Zscaler Technology Add-ons for Splunk (deferred — notes for future agents)

Distributed via Splunkbase as `.tgz` packages:

- **ZIA TA** — https://splunkbase.splunk.com/app/4394 (requires splunk.com login)
- **ZPA TA** — https://splunkbase.splunk.com/app/4734 (requires splunk.com login)

**What they'd give us:** canonical Splunk field extractions (`props.conf`, `transforms.conf`, `fields.conf`) mapping raw NSS/LSS log fields to Splunk CIM aliases. Useful for making the field tables in `references/zia/logs/*.md` and `references/zpa/logs/*.md` exact down to the Splunk-side name.

**Why deferred (April 2026):** the source field names come from Zscaler's NSS/LSS output, which is documented in the help site pages we're distilling into `references/*/logs/`. The TA adds Splunk-side CIM mapping and dashboarding — useful but not on the critical path for the skill's reasoning layer. We decided the help-site distillation gives ~90% of the value without the Splunkbase-auth friction.

**Reconsider when any of:**

- The skill starts generating SPL queries that use CIM aliases (e.g. `action`, `src`, `dest`) and needs to verify the TA's aliasing is what the user's Splunk actually does.
- We want to lint user-supplied SPL against known-extracted fields.
- Zscaler's NSS/LSS output changes and the help pages lag behind a TA release (the TA is sometimes the first authoritative publication of a new field).

**How to add later:** download both `.tgz` files from Splunkbase, extract only `props.conf`, `transforms.conf`, and `fields.conf` into `vendor/zscaler-splunk-ta/{zia,zpa}/`. Add a `NOTICE` file citing the Splunkbase URL and TA version. Leave the rest of the TA out — we only need the field-extraction config, not the Splunk runtime code or dashboards.

## Not read by Claude directly

`vendor/` is source material for **authors writing `references/` content**, not for Claude to grep on every question. The skill's routing table in `SKILL.md` points Claude at `references/` files; those files cite specific `vendor/` paths in their `sources:` frontmatter.

This keeps Claude's working context small and makes the skill's answers traceable to pinned upstream commits.

## Refresh

Bump one submodule:

```bash
git submodule update --remote vendor/terraform-provider-zia
git add vendor/terraform-provider-zia
git commit -m "vendor: bump terraform-provider-zia"
```

Bump all three:

```bash
git submodule update --remote
git add vendor/
git commit -m "vendor: bump all upstream sources"
```

When you bump, consider: does any `references/` file cite a path that may have moved? Search for the old path and update `last-verified` on anything you re-checked.

## Adding a new upstream

```bash
git submodule add https://github.com/<owner>/<repo>.git vendor/<repo>
```

Then update this file's table and anywhere in `references/` that should cite it.
