---
role: investigator
artifact: grounding
title: "ZIA URL filtering precedence — investigation grounding card"
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

- [`zia.url-filtering`](kb:zia.url-filtering) — the baseline ordering model.
- [`zia.url-filtering`](kb:zia.url-filtering) — when specificity beats explicit order; the implication for "why does rule A beat rule B."
- [`zia.url-filtering`](kb:zia.url-filtering) — the pre-CONNECT vs post-CONNECT pass.
- [`zia.url-filtering`](kb:zia.url-filtering) — when CAC overrides URL filtering and vice versa.

## Load docs

- `references/zia/url-filtering.md`

## Inspect tenant config

- The overlay's IaC for `zia/url-filtering-rules` (when `overlay.json` declares `iac`), or `zscalerctl zia url-filtering-rules list` (live, read-only; only when IaC cannot answer or for drift)
- The overlay's IaC for `zia/cloud-app-control-rules`, or `zscalerctl zia cloud-app-control-rules list` (load if Cloud App Control is in the question's scope)

## Use runtime logs only when

- The tenant config shows the rule wired correctly but a specific request was blocked or allowed unexpectedly — runtime web log gives the URL classification at request time (categorization can drift), the rule that fired, and the action taken.
- Confirming whether the request was inspected (post-CONNECT pass) or not (pre-CONNECT only) — the action sequence in the web log distinguishes them.
