---
product: risk360
topic: "risk360-index"
title: "Risk360 reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: reviewed
---

# Risk360 reference hub

Entry point for **Zscaler Risk360** questions — Zscaler's cyber risk quantification framework that ingests Zscaler telemetry plus external sources to produce financial-loss risk estimates and a unified risk dashboard.

Risk360 is **executive-facing first**, operator-second. CISOs, board members, audit committees, and IT risk committees are the primary audience. Skill answers should reflect this register — financial framing, board-readiness, framework alignment (MITRE / NIST / SEC) before technical depth.

## Topics

| Topic | File | Status |
|---|---|---|
| Architecture, data sources, Monte Carlo math, dashboard surfaces, licensing, frameworks | [`./overview.md`](./overview.md) | draft |

## Why Risk360 matters in the suite

Risk360 is the **only** Zscaler product that:

- Quantifies risk in **dollar-denominated** terms (financial-loss estimation via Monte Carlo simulation).
- Maps Zscaler telemetry to external compliance frameworks (MITRE ATT&CK, NIST CSF, SEC S-K 106(b)).
- Generates board-ready output (CISO Board Slides PowerPoint export).
- Integrates third-party signals (CrowdStrike, etc.) alongside Zscaler-native telemetry.
- Computes industry-peer benchmarks.

Other Zscaler products are operational; Risk360 is **strategic / governance-tier**.

## When to start here vs elsewhere

- **Start here** for "what is Risk360?", "how does Zscaler quantify cyber risk in dollars?", "how does Risk360 integrate with our SEC compliance reporting?", "what's the Monte Carlo simulation about?"
- **Start in [`../zia/`](../zia/) or [`../zpa/`](../zpa/)** for the underlying telemetry sources Risk360 ingests.
- **Start in [`../shared/admin-rbac.md`](../shared/admin-rbac.md)** for Risk360's distinct RBAC surface.
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for "is Risk360 in scope?" — coverage tier check.

## Coverage gaps (deferred)

- Detailed factor catalog (115+ factors not enumerated in skill — would require capturing the full Factors page with paginated content)
- Per-factor weighting math (Zscaler doesn't disclose internal weights publicly)
- Specific peer-benchmarking methodology (industry classification, comparison-group sizing)
- Integration setup details for CrowdStrike and other third parties
- "Legacy UI: Risk360 Advanced" — older variant still in help portal navigation; relationship to current Risk360 not captured
- Entitlement / pricing specifics beyond the `$` add-on marker

These don't block conceptual answers; do limit operational depth.
