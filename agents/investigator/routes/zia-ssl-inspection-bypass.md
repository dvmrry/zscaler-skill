---
role: investigator
artifact: route
title: "ZIA SSL inspection bypass — investigation route card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "references/zia/ssl-inspection.md"
author-status: draft
---

# ZIA SSL inspection bypass

## Use when

- SSL inspection bypass scope question (which sites / categories are bypassed and why?)
- "Why did inspection skip / apply for site X?" question
- Bypass rule hygiene audit
- TLS error or downstream policy failure that ties back to whether traffic was inspected
- "Do Not Inspect" rule semantics (the two variants behave differently — see anchor below)

## Expected behavior anchors

Read these *before* interpreting any web log or transaction record. SSL inspection bypass has two structural traps: the two "Do Not Inspect" variants are semantically different, and bypass is a cross-policy gate (it affects what subsequent policies can see).

- [`references/zia/ssl-inspection.md § The two "Do Not Inspect" variants — read this carefully`](../../../references/zia/ssl-inspection.md) — the variant trap.
- [`references/zia/ssl-inspection.md § SSL bypass is a cross-policy gate`](../../../references/zia/ssl-inspection.md) — what depends on inspection (URL filtering, DLP, sandboxing) and what's invisible without it.
- [`references/zia/ssl-inspection.md § Bypass rule hygiene — anti-patterns`](../../../references/zia/ssl-inspection.md) — over-broad bypass patterns and what they cost.
- [`references/zia/ssl-inspection.md § Audit rubric for SSL bypass rules`](../../../references/zia/ssl-inspection.md) — checklist for evaluating an existing bypass rule.

## Load docs

- `references/zia/ssl-inspection.md`

## Inspect snapshot

- `_data/snapshot/<cloud>/zia/ssl-inspection-rules.json`

## Use runtime logs only when

- A specific transaction needs to be confirmed as inspected vs bypassed (the action sequence in the web log gives this).
- A TLS error or downstream policy outcome (URL block that should have applied, DLP rule that didn't fire, sandbox detonation that didn't happen) is the symptom, and the question is whether the bypass was the upstream cause.
