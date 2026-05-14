---
role: investigator
artifact: grounding
title: "ZPA segment matching — investigation grounding card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "references/zpa/app-segments.md"
  - "references/zpa/segment-server-groups.md"
  - "references/zpa/policy-precedence.md"
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

- [`references/zpa/app-segments.md § The specificity-wins rule (covers eval Q6)`](../../../references/zpa/app-segments.md) — wildcard/literal/port specificity; the "carved out" default; bypass precedence.
- [`references/zpa/app-segments.md § Worked example — port-mismatch footgun`](../../../references/zpa/app-segments.md) — how a port mismatch makes a segment look like it matches when it doesn't.
- [`references/zpa/policy-precedence.md`](../../../references/zpa/policy-precedence.md) — access-policy ordering for segment-resolved traffic.

## Load docs

- `references/zpa/app-segments.md`
- `references/zpa/segment-server-groups.md`
- `references/zpa/policy-precedence.md`

## Inspect snapshot

- `_data/snapshot/<cloud>/zpa/app-segments.json`
- `_data/snapshot/<cloud>/zpa/segment-groups.json`
- `_data/snapshot/<cloud>/zpa/access-policy-rules.json`

## Use runtime logs only when

- Snapshot shows two segments that could plausibly match, and a runtime record is needed to confirm which actually fired.
- IdP attribute drift is suspected (segment scope depends on a SAML/SCIM attribute and the value at request time may not match the configured value).
