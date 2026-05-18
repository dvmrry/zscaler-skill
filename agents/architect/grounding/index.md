---
role: architect
artifact: grounding
title: "Architect grounding - cloud, network, and capacity context"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "https://www.nist.gov/publications/zero-trust-architecture"
  - "https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model"
  - "https://aws.amazon.com/architecture/well-architected/"
  - "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas"
  - "https://cloud.google.com/architecture/framework"
  - "references/shared/cloud-architecture.md"
  - "references/_meta/primer/networking-basics.md"
  - "references/cloud-connector/overview.md"
  - "references/cloud-connector/aws-deployment.md"
  - "references/cloud-connector/azure-deployment.md"
  - "references/zpa/app-connector.md"
  - "references/zpa/logs/app-connector-metrics.md"
dependencies: []
author-status: draft
---

# Architect grounding - cloud, network, and capacity context

Use this grounding index before `/z-architect` makes capacity, topology, or scaling recommendations.

## Public architecture anchors

Use these public frameworks as discipline, not tenant truth:

- **Zero trust architecture** - treat identity, device posture, policy decision, policy enforcement, and telemetry as separate design concerns. Network location alone is not trust.
- **Cloud landing zones / well-architected frameworks** - separate connectivity, identity, security, operations, and workload ownership. Name the boundary where a Zscaler control depends on cloud routing, DNS, private connectivity, or logging.
- **Reliability and blast radius** - call out single points of failure, shared fate, asymmetric failover, hidden regional dependencies, and designs that fail open or fail silently.
- **Operational readiness** - a design recommendation should name observable signals, rollback path, and owner before implying it is production-ready.

## Always load for architecture review

- [`references/shared/cloud-architecture.md`](../../../references/shared/cloud-architecture.md) - shared cloud placement and dependency concepts
- [`references/_meta/primer/networking-basics.md`](../../../references/_meta/primer/networking-basics.md) - routing, DNS, private connectivity, and load-balancing vocabulary

## Load when scope names Cloud Connector

- [`references/cloud-connector/overview.md`](../../../references/cloud-connector/overview.md)
- [`references/cloud-connector/forwarding.md`](../../../references/cloud-connector/forwarding.md)
- [`references/cloud-connector/dns-subsystem.md`](../../../references/cloud-connector/dns-subsystem.md)
- [`references/cloud-connector/insights-monitoring.md`](../../../references/cloud-connector/insights-monitoring.md)

## Load when scope names a cloud provider

- AWS: [`references/cloud-connector/aws-deployment.md`](../../../references/cloud-connector/aws-deployment.md), [`references/cloud-connector/aws-workload-discovery.md`](../../../references/cloud-connector/aws-workload-discovery.md)
- Azure: [`references/cloud-connector/azure-deployment.md`](../../../references/cloud-connector/azure-deployment.md), [`references/zcc/azure-vm-deployment.md`](../../../references/zcc/azure-vm-deployment.md)

No GCP-specific grounding exists yet. If the scope names GCP, say that provider-specific grounding is missing and proceed from generic cloud/networking references plus user-provided evidence.

## Load when scope names ZPA capacity

- [`references/zpa/app-connector.md`](../../../references/zpa/app-connector.md)
- [`references/zpa/app-segments.md`](../../../references/zpa/app-segments.md)
- [`references/zpa/segment-server-groups.md`](../../../references/zpa/segment-server-groups.md)
- [`references/zpa/logs/app-connector-metrics.md`](../../../references/zpa/logs/app-connector-metrics.md)

## Discipline

- Provider docs ground vocabulary and likely dependency points; they do not prove tenant state.
- Capacity claims need config, metrics, or user-provided evidence.
- If only generic grounding is available, keep confidence at `Medium` or lower unless the structural issue is config-evident.
- Prefer reversible validation and observability improvements before proposing topology changes.
