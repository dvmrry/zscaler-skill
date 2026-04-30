---
product: deception
topic: "deception-index"
title: "Zscaler Deception reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
sources: []
author-status: reviewed
---

# Zscaler Deception reference hub

Entry point for **Zscaler Deception** questions — the active-defense threat-detection product that deploys decoys (fake servers, AD objects, endpoints, cloud assets) across an environment to detect lateral-movement attackers.

Confidence is **medium** because the skill currently has only three captured help articles (from the `zpa-07` resolution) — the operational layer, configuration deep-dives, and Endpoint / Cloud decoy specifics are not yet captured. Promote to high once a fuller capture pass lands.

## Topics

| Topic | File | Status |
|---|---|---|
| Architecture, decoy types, ZPA integration, threat model | [`./overview.md`](./overview.md) | draft |

## Why this product matters in the suite

Deception is **distinct from every other Zscaler product** in posture: where ZIA / ZPA / ZCC are inline-traffic enforcement and ZDX / ZBI / Risk360 are observation / mitigation, Deception is **active defense** — it manufactures traffic patterns (decoys appearing real) specifically to lure adversaries who have already bypassed perimeter defenses.

Where it shows up in skill answers:

- **ZPA access policy ordering** — Deception-configured access rules must evaluate before regular ZPA rules to intercept attacker traffic to decoys. See [`../zpa/policy-precedence.md § Order and editing constraints`](../zpa/policy-precedence.md) and [clarification `zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction).
- **ZPA App Connectors** — Deception integrates with ZPA via dedicated App Connectors that route attacker traffic to ZTN (Zero Trust Network) decoys.
- **Cross-product hooks** — referenced in [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).

## When to start here vs elsewhere

- **Start here** for "what is Deception?", "how do decoys work?", "should we deploy Deception?", "how does Deception integrate with ZPA?"
- **Start in [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)** for "why are Deception access rules ordered first?" — the policy-evaluation answer.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for "is Deception in scope for this skill?" — coverage tier check.

## Coverage gaps (deferred)

Captured here from the awareness-only audit:

- Endpoint decoy specifics (Landmine policies)
- Cloud decoy specifics (per-cloud-provider deployment)
- ThreatParse natural-language attack reconstruction details
- Detailed deployment runbooks
- Integration with non-Zscaler SIEMs / SOAR platforms
- Performance and footprint data for Decoy Connectors
- Pricing / packaging details

These gaps don't block answering common conceptual questions but do limit depth on operational deployments. Promote when fork-team signals Deception is in active scope.
