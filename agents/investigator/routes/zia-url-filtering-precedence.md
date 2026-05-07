---
role: investigator
artifact: route
title: "ZIA URL filtering precedence — investigation route card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "references/zia/url-filtering.md"
author-status: draft
---

# ZIA URL filtering precedence

## Use when

- "Why does rule A beat rule B?" — rule order or specificity question
- URL was blocked when policy seemed to allow it (or vice versa)
- Cloud App Control vs URL filtering interaction question
- HTTPS-vs-HTTP handling discrepancy (URL filtering evaluates twice on inspected HTTPS traffic — different post-CONNECT semantics)

## Expected behavior anchors

Read these *before* interpreting any web log. URL filtering precedence has two non-obvious gotchas (specificity beats order; HTTPS gets two evaluation passes) that change the hypothesis space.

- [`references/zia/url-filtering.md § Rule order and first-match semantics`](../../../references/zia/url-filtering.md) — the baseline ordering model.
- [`references/zia/url-filtering.md § The specificity rule — the non-obvious precedence gotcha`](../../../references/zia/url-filtering.md) — when specificity beats explicit order; the implication for "why does rule A beat rule B."
- [`references/zia/url-filtering.md § URL filtering evaluates twice on inspected HTTPS traffic`](../../../references/zia/url-filtering.md) — the pre-CONNECT vs post-CONNECT pass.
- [`references/zia/url-filtering.md § Cloud App Control interaction`](../../../references/zia/url-filtering.md) — when CAC overrides URL filtering and vice versa.

## Load docs

- `references/zia/url-filtering.md`

## Inspect snapshot

- `_data/snapshot/<cloud>/zia/url-filtering-rules.json`
- `_data/snapshot/<cloud>/zia/cloud-app-control-rules.json` (load if Cloud App Control is in the question's scope)

## Use runtime logs only when

- The snapshot shows the rule wired correctly but a specific request was blocked or allowed unexpectedly — runtime web log gives the URL classification at request time (categorization can drift), the rule that fired, and the action taken.
- Confirming whether the request was inspected (post-CONNECT pass) or not (pre-CONNECT only) — the action sequence in the web log distinguishes them.
