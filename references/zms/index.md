---
product: zms
topic: "zms-index"
title: "ZMS reference hub"
content-type: reference
last-verified: "2026-04-25"
confidence: medium
sources: []
author-status: reviewed
---

# ZMS reference hub

Entry point for **Zscaler Microsegmentation (ZMS)** questions — workload-to-workload (east-west) policy enforcement via host-installed agents, AI-powered policy recommendations, and cloud control plane.

Confidence is **medium** — all coverage from marketing material + one help-portal article. **No SDK module** (`zms` does not exist in either Python or Go SDK), no Terraform provider, no Postman collection. Configuration is portal-only.

## Topics

| Topic | File | Status |
|---|---|---|
| Architecture (cloud + agents + WFP/nftables), AI policy recommendations, deployment, ZPA-add-on framing, edge cases | [`./overview.md`](./overview.md) | draft |

## Why ZMS matters in the suite

ZMS is the **east-west complement to ZPA's north-south**:

- **ZPA** = users → private apps (north-south, App Connector model).
- **ZMS** = workloads → workloads (east-west, host-agent + WFP/nftables model).

A common architecture uses both: ZPA fronts user access to a tier-1 app, ZMS contains lateral movement between that app's servers and the rest of the environment. Skill answers should connect the two when an operator question implies one but the answer requires the other.

ZMS is also the only Zscaler product (alongside Cloud Connector with VMs) where **enforcement runs on customer infrastructure** rather than in Zscaler's cloud — an important shift in failure mode and operational ownership compared to the inline-traffic products.

## When to start here vs elsewhere

- **Start here** for: "what is ZMS?" / "how does microsegmentation work in Zscaler?" / "what's the difference between ZPA and ZMS?" / "can ZMS replace our datacenter firewalls?"
- **Start in [`../zpa/app-segments.md`](../zpa/app-segments.md)** for: "how do I segment access to my private app?" — that's a north-south question, ZPA territory.
- **Start in [`../cloud-connector/overview.md`](../cloud-connector/overview.md)** for: "how do my AWS workloads send traffic through Zscaler?" — that's north-south workload traffic, Cloud Connector territory.
- **Start in [`../_portfolio-map.md`](../_portfolio-map.md)** for: "is ZMS in scope for this skill?" — coverage tier check.
- **Recognize ZMS aliases** — "Zscaler Microsegmentation", "Zero Trust Microsegmentation", "ZMS", "ZPA microsegmentation" all map to this product.

## Coverage gaps (deferred)

- API / SDK surface — none captured; portal-only configuration.
- Container / Kubernetes integration model.
- Conflict resolution with other host firewalls (Defender via GPO, host-IDS, custom nftables).
- Observation → enforcement transition runbook.
- Cloud-native firewall integration (AWS SG / Azure NSG / GCP firewall) — does ZMS replace, integrate with, or ignore these?
- Multi-cloud workload identity model.
- Pricing / packaging (bundled with ZPA edition? separate SKU?).
- Region availability beyond US (control plane was US-only at capture date — may have changed).

These gaps don't block conceptual answers but limit operational depth. Promote when fork team signals ZMS is in active scope.
