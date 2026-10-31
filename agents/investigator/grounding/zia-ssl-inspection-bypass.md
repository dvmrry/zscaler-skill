---
role: investigator
artifact: grounding
title: "ZIA SSL inspection bypass — investigation grounding card"
content-type: reference
last-verified: "2026-05-07"
confidence: medium
source-tier: practice
sources:
  - "kb:zia.ssl-inspection"
  - "kb:zia.ssl-inspection.actions"
  - "kb:zia.ssl-inspection.bypass-impact"
  - "kb:zia.ssl-inspection.exemptions"
  - "kb:zia.ssl-inspection.rules"
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

- [`zia.ssl-inspection.actions`](kb:zia.ssl-inspection.actions) — the variant trap.
- [`zia.ssl-inspection.bypass-impact`](kb:zia.ssl-inspection.bypass-impact) — what depends on inspection (URL filtering, DLP, sandboxing) and what's invisible without it.
- [`zia.ssl-inspection.exemptions`](kb:zia.ssl-inspection.exemptions) — over-broad bypass patterns and what they cost.
- [`zia.ssl-inspection.rules`](kb:zia.ssl-inspection.rules) — checklist for evaluating an existing bypass rule.

## Load docs

- `kb:zia.ssl-inspection`
- `kb:zia.ssl-inspection.actions`
- `kb:zia.ssl-inspection.bypass-impact`
- `kb:zia.ssl-inspection.exemptions`
- `kb:zia.ssl-inspection.rules`

## Inspect tenant config

- The overlay's IaC for `zia/ssl-inspection-rules` (when `overlay.json` declares `iac`)
- `zscalerctl zia ssl-inspection-rules list` (live, read-only; only when IaC cannot answer or for drift)

## Use runtime logs only when

- A specific transaction needs to be confirmed as inspected vs bypassed (the action sequence in the web log gives this).
- A TLS error or downstream policy outcome (URL block that should have applied, DLP rule that didn't fire, sandbox detonation that didn't happen) is the symptom, and the question is whether the bypass was the upstream cause.
