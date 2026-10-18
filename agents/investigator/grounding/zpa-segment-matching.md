---
role: investigator
artifact: grounding
title: "ZPA segment matching — investigation grounding card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "`kb:zpa.app-segments`"
  - "`kb:zpa.server-groups`"
  - "`kb:zpa.policy`"
author-status: draft
---

# ZPA segment matching

## Use when

- ZPA segment isn't matching for user X (policy allows but app doesn't resolve)
- Wildcard or specificity question (which of two overlapping segments wins?)
- Multimatch behavior (one app, two segments, which one fired?)
- Port-mismatch suspicion (`*.internal.corp:443` matches but actual port differs)

## Expected behavior anchors

Read these *before* interpreting any policy log. Segment matching has a non-obvious specificity rule that determines which of two overlapping segments takes precedence — without reading it first, the hypothesis space is wrong.

- [`zpa.app-segments`](kb:zpa.app-segments) — wildcard/literal/port specificity; the "carved out" default; bypass precedence.
- [`zpa.app-segments`](kb:zpa.app-segments) — how a port mismatch makes a segment look like it matches when it doesn't.
- [`zpa.policy`](kb:zpa.policy) — access-policy ordering for segment-resolved traffic.

## Load docs

- `kb:zpa.app-segments`
- `kb:zpa.server-groups`
- `kb:zpa.policy`

## Inspect tenant config

- The overlay's IaC (when `overlay.json` declares `iac`) for `zpa/app-segments`, `zpa/segment-groups`, and `zpa/access-policy-rules`
- Live, read-only, only when IaC cannot answer or for drift: `zscalerctl zpa app-segments list`, `zscalerctl zpa segment-groups list`, `zscalerctl zpa access-policy-rules list`

## Use runtime logs only when

- Tenant config shows two segments that could plausibly match, and a runtime record is needed to confirm which actually fired.
- IdP attribute drift is suspected (segment scope depends on a SAML/SCIM attribute and the value at request time may not match the configured value).
