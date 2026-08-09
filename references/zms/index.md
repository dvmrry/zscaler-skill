---
product: zms
topic: "zms-index"
title: "ZMS reference hub"
content-type: reference
last-verified: "2026-06-14"
verified-against:
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
confidence: medium
sources:
  - "vendor/zscaler-help/about-application-catalog-microsegmentation.md"
  - "vendor/zscaler-help/about-ml-tag-recommendations-page.md"
  - "vendor/zscaler-help/about-tags.md"
  - "vendor/zscaler-help/about-agent-provisioning-keys.md"
  - "vendor/zscaler-help/editing-agent-provisioning-keys.md"
  - "vendor/zscaler-sdk-python/zscaler/zms/**"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zms/**"
author-status: reviewed
---

# ZMS reference hub

Entry point for **Zscaler Microsegmentation (ZMS)** questions — workload-to-workload (east-west) policy enforcement via host-installed agents, AI-powered policy recommendations, and cloud control plane.

Confidence is **medium** — current Help now covers the Application Catalog, ML
tag recommendations, tag administration, and agent provisioning keys, while the
implemented Python SDK and MCP surfaces expose read-only ZMS GraphQL queries
(`vendor/zscaler-sdk-python/zscaler/zms/zms_service.py:36-105`;
`vendor/zscaler-mcp-server/rules/zms-graphql-conventions.mdc:8`). The portal
documents write workflows, but those Help articles do not publish the
underlying mutation names or payloads; do not turn a client-coverage boundary
into a claim that no server-side write API exists
(`vendor/zscaler-help/about-ml-tag-recommendations-page.md:27-43`,
`vendor/zscaler-help/about-tags.md:16-32`,
`vendor/zscaler-help/editing-agent-provisioning-keys.md:10-29`).

## Topics

| Topic | File | Status |
|---|---|---|
| Architecture (cloud + agents + WFP/nftables), AI policy recommendations, deployment, ZPA-add-on framing, edge cases | [`./overview.md`](./overview.md) | draft |
| Portal operations for Application Catalog, ML tag recommendations, namespace/key/value tags, and group-scoped provisioning keys | [`./overview.md`](./overview.md) | draft |
| GraphQL API surface (read-only) — query conventions: `eyez_id`, dual pagination, three-level tag hierarchy, managed/unmanaged resource groups | [`./api.md`](./api.md) | draft |

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
- **Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)** for: "is ZMS in scope for this skill?" — coverage tier check.
- **Recognize ZMS aliases** — "Zscaler Microsegmentation", "Zero Trust Microsegmentation", "ZMS", "ZPA microsegmentation" all map to this product.

## Coverage gaps (deferred)

- Kubernetes enforcement granularity (per pod, node, workload, or host agent).
- Conflict resolution with other host firewalls (Defender via GPO, host-IDS, custom nftables).
- Observation → enforcement transition runbook.
- Cloud-native firewall integration (AWS SG / Azure NSG / GCP firewall) — does ZMS replace, integrate with, or ignore these?
- Multi-cloud workload identity model.
- Pricing / packaging (bundled with ZPA edition? separate SKU?).
- Region availability beyond US (control plane was US-only at capture date — may have changed).

These gaps don't block conceptual answers but limit operational depth. Promote when fork team signals ZMS is in active scope.
