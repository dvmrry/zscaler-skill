---
product: shared
topic: "siem-emission-discipline"
title: "SIEM emission discipline — agent execution modes, public/private boundary"
content-type: reference
last-verified: "2026-04-29"
confidence: high
source-tier: practice
sources:
  - "references/shared/troubleshooting-methodology.md"
  - "references/shared/splunk-queries.md"
author-status: draft
---

# SIEM emission discipline

How the agent emits queries against any SIEM (Splunk, Sentinel, Chronicle, Elastic, Sumo, etc.) when investigating Zscaler issues. Generic — applies regardless of the SIEM's query language or table model. SIEM-specific catalogs (e.g., [`splunk-queries.md`](./splunk-queries.md)) reference this doc rather than duplicating it.

## Execution modes

The agent driving an investigation may or may not have direct API access to the SIEM. All three modes are first-class and can interleave within a single investigation:

| Mode | Who runs the query | Where results enter the journal |
|---|---|---|
| **Agent-direct** | Agent runs via SIEM API or SDK (Splunk SDK, Sentinel REST, Chronicle UDM API, Elastic client, etc.) | Agent captures results inline as a `Confirmed (medium\|high)` claim, query as source |
| **User-handoff** | Agent emits query template; user runs it in their SIEM; pastes result back | User (or agent on next turn) captures pasted results as a `Confirmed (medium)` claim, query + result rows as source |
| **Coworking** | Mix — agent runs cheap exploratory queries, user runs ones requiring tenant-specific scopes or sensitive data | Same journal; each claim notes who executed |

The discovery journal (per [`troubleshooting-methodology.md`](./troubleshooting-methodology.md)) is the shared artifact. A handoff between agent and user (in either direction) doesn't change claim status — only fresh evidence (or system change) does.

## Universal rules (all modes, all SIEMs)

1. **Plumbing is placeholder in public catalogs.** All log-destination identifiers (`index=` / `sourcetype=` for Splunk; table names for Sentinel/Chronicle; index patterns for Elastic; source categories for Sumo; etc.) are env-var placeholders or `<your_*>` markers in the public skill. Actual per-tenant values must never appear in this repo. At execution time, the agent (or user) substitutes from local config.

2. **Field names are Zscaler-published only.** Every field used in queries traces back to an NSS or LSS schema reference under `references/{zia,zpa,zcc}/logs/`. Customer-renamed fields, custom enrichments, internal log-generator fields, and TA-specific aliases beyond the documented CIM mappings do not appear in public queries. If a tenant has renamed fields locally, they remap at run time, not in the catalog.

3. **Cite patterns by name, not by inlining.** When the agent emits a query as an evidence source, reference a named pattern from the relevant SIEM-specific catalog (e.g., "use `§ rule-hit-history` from `splunk-queries.md`"). The catalog stays the single source of truth.

4. **Cite the schema for any field used.** E.g., `references/zpa/logs/access-log-schema.md` for `InternalReason`, `references/zia/logs/web-log-schema.md` for `urlcategory`. Keeps results reproducible and prevents field-name drift.

5. **Treat the query as a plan until results exist.**
   - Agent-direct: after running, capture results as `Confirmed (medium)` or `(high)` with the query as source.
   - User-handoff: until the user reports back, the claim stays `Open (likely)` or `Open (uncertain)`. When results arrive, capture them as `Confirmed (medium)` with the query + result rows as source.
   - Either mode: if the underlying system changed between query time and now (connector restart, policy update, re-auth), mark the claim `Stale` and re-run.

6. **Handoffs don't change claim status.** A claim's status reflects evidence quality, not who gathered it.

## Where user plumbing lives

When the agent has access to per-tenant SIEM plumbing, it substitutes the placeholders; otherwise it emits placeholders with a one-line "fill these in" note. Storage options for user plumbing (in order of automation):

- **CLAUDE.md** at project or user level — e.g., `My Splunk: index=zscaler_prod, sourcetypes are zscalernss-web / zscalerlss-zpa`. Auto-loaded; agent picks up immediately.
- **Auto-memory** — same content, persists across sessions.
- **A private fork's local config** that overrides placeholder env vars at run time.

The catalog placeholder names (e.g., `$INDEX_ZIA_WEB`, `<zia-web-log-destination>`) are documented per SIEM in the relevant catalog and in [`siem-log-mapping.md`](./siem-log-mapping.md).

## What stays private

Out of scope for this public skill; lives in the user's private side:

- Per-tenant index / table / sourcetype / source-category / log-type-name values
- Internally-generated synthetic logs and the generators that produce them
- Custom TA / data-connector / parser enrichments and lookup tables
- Anything from an internal log pipeline that diverges from Zscaler-published schemas
- Specific tenant identifiers (customer ID, cloud name, etc.) appearing in stored queries

The public skill assumes Zscaler-published schemas only. The private side (the user's fork, CLAUDE.md, synthetic data, custom enrichments) holds the rest.

## Cross-links

- [`siem-log-mapping.md`](./siem-log-mapping.md) — catalog of Zscaler log types and how they typically land per SIEM
- [`splunk-queries.md`](./splunk-queries.md) — Splunk-specific SPL pattern catalog
- [`troubleshooting-methodology.md`](./troubleshooting-methodology.md) — discovery journal, claim status, anti-patterns
- [`investigate-prompt.md`](./investigate-prompt.md) — `/z-investigator` slash command playbook
