---
product: cloud-connector
topic: "cloud-connector-overview"
title: "Cloud Connector overview — architecture, groups, HA, data plane"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/cloud-branch-connector/what-zscaler-cloud-connector"
  - "vendor/zscaler-help/what-zscaler-cloud-connector.md"
  - "https://help.zscaler.com/cloud-branch-connector/understanding-high-availability-and-failover"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "https://help.zscaler.com/cloud-branch-connector/about-cloud-connector-groups"
  - "vendor/zscaler-help/cbc-about-cloud-connector-groups.md"
author-status: draft
---

# Cloud Connector overview — architecture, groups, HA, data plane

What a Cloud Connector VM actually does, how Cloud Connector Groups scale and upgrade, and how the high-availability / failover model behaves under cloud-provider load balancer failures.

## Summary

A Cloud Connector is a **virtual machine running inside the customer's cloud account** (AWS, Azure, or GCP) that forwards cloud-workload traffic to Zscaler's ZIA and ZPA clouds. Think of it as the workload-side equivalent of ZCC — same goal (get traffic into the Zero Trust Exchange for inspection), different form factor (VM not endpoint agent).

- **Multiple Cloud Connectors form a Cloud Connector Group**. Group membership is automatic on deployment (per template); the group is the policy-and-upgrade unit.
- **Cloud Connectors scale horizontally and are all active simultaneously.** No active/passive — a cloud-provider native load balancer distributes traffic across them.
- **Outbound-only model.** Cloud Connectors initiate connections to the ZTE; they don't accept inbound connections from the internet. Same pattern as ZPA App Connectors.
- **HA uses primary/secondary/tertiary gateway fallback.** If the primary gateway is unreachable, Cloud Connector fails over to secondary in ~30s, and can try a tertiary if both primary and secondary fail.
- **Default fail-close, configurable fail-open.** When all gateways are unreachable, default behavior drops internet-bound traffic (fail-close); tenants can flip to fail-open (allow direct internet egress, skipping Zscaler) at the cost of skipping inspection.

## Mechanics

### Cloud Connector Group

From *About Cloud Connector Groups*:

> Cloud Connector groups are automatically created when you deploy a Zscaler Cloud Connector in Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).

A group is the unit of:

- **Policy application** — traffic forwarding rules reference groups as criteria. "Apply this rule to Cloud Connector Group X" means VMs in that group.
- **Upgrade orchestration** — "Schedule Upgrade" applies at the group level; upgrades ripple through member VMs in a way that maintains redundancy (not all at once).
- **Autoscaling scope** — an autoscaling group (ASG / VMSS / MIG) is one Cloud Connector Group.

**Group types** (per the admin console dropdown):

- **Cloud Connector** — traditional Cloud Connector deployment model.
- **Zero Trust Gateway (ZTG)** — a newer deployment model variant.

Difference between these two is not fully documented in the captured material; flagged for future clarification.

**Cloud Connector states** (per-VM):

- `Active` — healthy, processing traffic.
- `Inactive` — enrolled but not currently processing.
- `Disabled` — admin-disabled; stops traffic processing. Distinct from "deleted" — disabled connectors stay in inventory.

### Autoscaling naming — cloud-provider nomenclature

Same concept, three different names per cloud provider:

| Cloud | Autoscaling name |
|---|---|
| AWS | Auto Scaling (Auto Scaling Group — ASG) |
| Azure | Virtual Machine Scale Sets (VMSS) |
| GCP | Managed Instance Group (MIG) with autoscaling |

The Zscaler admin console uses "autoscaling" as a generic; enabling it requires **Zscaler Support intervention** per the help docs:

> To enable Auto Scaling, VMSS, or a MIG with autoscaling, contact Zscaler Support.

**Deployment constraint**: when deploying, "only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template." Mismatching template type to deployment mode breaks deployment.

### Data plane and control plane

Per *Understanding High Availability and Failover*:

- **Data plane** — processes and forwards workload traffic. Outbound connections from each Cloud Connector's service interface to ZIA and ZPA Service Edges.
- **Control plane** — Cloud Connector's bidirectional management channel to the Zero Trust Exchange for config, heartbeat, policy updates.

Both planes are VM-to-ZTE, outbound-only. No inbound connection is ever made to a Cloud Connector from Zscaler's side.

### Load balancing and health checks

Zscaler integrates with the native load balancing services of each cloud provider:

- AWS: **Gateway Load Balancer** (GWLB). Default health-check interval: **30 seconds**.
- Azure: **Azure Load Balancer**. Default health-check interval: **15 seconds**.
- GCP: native LB (exact variant not enumerated).

Health check mechanism:

- Load balancer issues HTTP probes to each Cloud Connector VM on a configured health port.
- Cloud Connector listens at path `/cchealth` on that port.
- Healthy response: HTTP **200**.
- Unhealthy response: HTTP **503** (or no response = timeout).

Unhealthy Cloud Connectors are removed from rotation by the load balancer. New sessions route to healthy instances; **existing sessions on an unhealthy Cloud Connector may temporarily fail until they age out and the load balancer redirects them**. This is a known behavior, not a bug — operators investigating "some sessions failed during a Cloud Connector issue" shouldn't expect seamless mid-flow migration.

### Primary/secondary/tertiary gateway selection

Per Cloud Connector Group, traffic flows via an **active tunnel** to an ZIA/ZPA gateway:

1. **Primary gateway** — active tunnel; all new sessions go here.
2. **Secondary gateway** — standby; if primary fails, Cloud Connector marks secondary as active and starts sending to it. Failover takes **~30 seconds**.
3. **Tertiary gateway** — automatically tried if both primary and secondary fail. Cloud Connector is not limited to only the two user-configured gateways.

When the primary gateway becomes healthy again, **new sessions** route back to primary. Existing sessions on secondary continue until they terminate naturally. No forced migration.

**Geolocation-based selection** — if no specific gateways are configured, Cloud Connector uses geolocation to pick optimal Public Service Edges. Can be overridden per-rule to use specific Public Service Edges, Virtual Service Edges, or sub-clouds.

### Fail-close vs fail-open

**Default**: **fail-close**. If all configured gateways are unreachable, internet-bound workload traffic is **dropped**. Applications fail until ZTE connectivity is restored.

**Alternative**: fail-open. Flip a config to allow internet-bound traffic to egress directly (skipping Zscaler inspection) when all gateways are down. Trade-off: availability over security.

**This is the inverse of typical enterprise assumptions** ("fail-open means break access; fail-close means allow"). Read carefully:

| Mode | If gateways unreachable |
|---|---|
| fail-close (default) | **Traffic dropped.** Workload can't reach internet. |
| fail-open | **Traffic egresses direct.** Workload reaches internet bypassing Zscaler. |

Operators configuring this should be explicit about which semantic they want.

### ZPA enrollment (workload-to-workload)

Cloud Connectors enrolled with ZPA automatically connect to an **optimal Private Access Public Service Edge or Private Service Edge**. Similar to ZCC's ZPA microtunnel — Cloud Connector resolves the nearest ZPA edge dynamically.

Private Access traffic from workloads flows:

```
Workload → Cloud Connector → ZPA Service Edge → App Connector → destination internal app
```

App Connectors (ZPA's sibling outbound-only component — see [`../zpa/app-segments.md`](../zpa/app-segments.md)) sit at the application side; Cloud Connectors sit at the workload side. They never talk directly.

## Data plane vs control plane — why it matters

Per *Understanding High Availability and Failover*:

> Data plane is composed of outbound connections from the service interface of each Cloud Connector.

The service interface is distinct from the management interface. A Cloud Connector can have its control plane healthy (management works, admin console shows it green) while data plane is failing (traffic isn't actually going through). This is why **health probes validate the data path**, not just VM liveness.

## Cloud Connector vs App Connector

Both are outbound-only Zscaler VMs. Don't confuse them.

| Dimension | Cloud Connector | App Connector (ZPA) |
|---|---|---|
| Purpose | Forward cloud-workload traffic to ZIA/ZPA | Bridge ZPA cloud to internal application servers |
| Placement | In the workload's network (AWS/Azure/GCP customer account) | In the application's network (data center, cloud VPC hosting the app) |
| Traffic direction | Receives workload traffic, forwards to ZTE | Receives requests from ZPA cloud, forwards to app server |
| Authentication to ZTE | Via cloud provisioning template + provisioning URL | Via provisioning key + TLS client cert |
| Grouping model | Cloud Connector Group | App Connector Group |
| Scaling | Autoscaling (ASG/VMSS/MIG) | Static N+1 redundancy (all active) |
| SDK module | `ztw` (Go SDK only) | `zpa.app_connector_groups` (both SDKs) |

They **appear in the same traffic flow for workload-to-internal-app access**: Cloud Connector on the workload side, App Connector on the app side, ZPA Service Edge in the middle.

## Edge cases

- **Existing sessions fail during failover.** The ~30-second failover time applies to new-session routing; existing sessions that were on the failed Cloud Connector or gateway may time out and require retry. Applications with long-lived connections (databases, streaming) see impact.
- **Health check customization requires Support.** Default intervals (15s Azure, 30s AWS) are "optimized." Changing them requires Zscaler Support engagement.
- **Zero Trust Gateway vs Cloud Connector group types** — the difference isn't captured in help articles we've pulled. Both appear in the admin console Group Type dropdown. Likely an architectural evolution (newer = ZTG). Flag for future documentation.
- **Disabled Cloud Connector vs deleted**: disabling stops traffic processing but keeps the VM in inventory and the VM running. Useful for staged rollouts or incident response without deprovisioning.
- **Tertiary gateway is automatic, not user-configured.** A tenant that wants full control over failover sequencing has only primary/secondary configurable; tertiary is Zscaler's safety net.
- **Horizontal scale is N+1-style redundancy**. Adding more Cloud Connectors to a group increases throughput; they're all active. Remove one and throughput drops accordingly — no spare capacity unless over-provisioned.

## Open questions

- **Exact ZTG vs Cloud Connector group type semantics** — not documented in captured articles. Likely a naming evolution; lab-test or documentation search needed.
- **Whether Cloud Connector's `/cchealth` probe port is configurable** — the help article implies "configured during deployment" but doesn't specify range.
- **Fail-open + fail-close toggle location** — help article mentions "customers can change this configuration" but doesn't name the admin-portal path.

## Cross-links

- Traffic forwarding — [`./forwarding.md`](./forwarding.md)
- API / SDK / TF surface — [`./api.md`](./api.md)
- ZPA App Connector (the other outbound-only Zscaler VM) — [`../zpa/app-segments.md`](../zpa/app-segments.md) (app connectors referenced in segment config)
- ZCC forwarding profile (the endpoint-side equivalent) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- Shared cloud architecture — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
