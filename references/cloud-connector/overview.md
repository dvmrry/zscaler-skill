---
product: cloud-connector
topic: "cloud-connector-overview"
title: "Cloud Connector overview — architecture, groups, HA, data plane"
content-type: reasoning
last-verified: "2026-06-15"
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

Source: `vendor/zscaler-help/what-zscaler-cloud-connector.md`; `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`; `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

A Cloud Connector is a **virtual machine running inside the customer's cloud account** (AWS, Azure, or GCP) that forwards cloud-workload traffic to Zscaler's ZIA and ZPA clouds. Think of it as the workload-side equivalent of ZCC — same goal (get traffic into the Zero Trust Exchange for inspection), different form factor (VM not endpoint agent).

- **Multiple Cloud Connectors form a Cloud Connector Group**. Group membership is automatic on deployment (per template); the group is the policy-and-upgrade unit.
- **Cloud Connectors scale horizontally and are all active simultaneously.** No active/passive — a cloud-provider native load balancer distributes traffic across them.
- **Outbound-only model.** Cloud Connectors initiate connections to the ZTE; they don't accept inbound connections from the internet. Same pattern as ZPA App Connectors.
- **HA uses primary/secondary/tertiary gateway fallback.** If the primary gateway is unreachable, Cloud Connector fails over to secondary in ~30s, and can try a tertiary if both primary and secondary fail.
- **Default fail-close, configurable fail-open.** When no Cloud Connector in the group can reach any gateway, default behavior drops internet-bound workload traffic (fail-close); tenants can flip to fail-open so those workloads keep reaching the internet (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). What the egress path looks like under fail-open isn't cleanly stated by the source — see Open questions.

## Mechanics

### Cloud Connector Group

Source: `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`; `vendor/zscaler-help/what-zscaler-cloud-connector.md`.

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

Source: `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`; `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

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

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

Per *Understanding High Availability and Failover*:

- **Data plane** — processes and forwards workload traffic. Outbound connections from each Cloud Connector's service interface to ZIA and ZPA Service Edges.
- **Control plane** — Cloud Connector's bidirectional management channel to the Zero Trust Exchange for config, heartbeat, policy updates.

Both planes are VM-to-ZTE, outbound-only. No inbound connection is ever made to a Cloud Connector from Zscaler's side.

### Load balancing and health checks

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

Zscaler integrates with the native load balancing services of each cloud provider:

- AWS: **Gateway Load Balancer** (GWLB). Default health-check interval: **30 seconds**.
- Azure: **Azure Load Balancer**. Default health-check interval: **15 seconds**.
- GCP: native LB (exact variant not enumerated).

Health check mechanism:

- Load balancer issues HTTP probes to each Cloud Connector VM on a configured health port.
- Cloud Connector listens on the configured port for the health-probe path the source captures as `?cchealth` (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:30`). The leading `?` is almost certainly a text-extraction artifact of the JS-rendered page (the live path is conventionally `/cchealth`), but the captured material is what's quoted here.
- Healthy response: HTTP **200**.
- Unhealthy response: HTTP **503** (or no response = timeout).

Unhealthy Cloud Connectors are removed from rotation by the load balancer. New sessions route to healthy instances; **existing sessions on an unhealthy Cloud Connector may temporarily fail until they age out and the load balancer redirects them**. This is a known behavior, not a bug — operators investigating "some sessions failed during a Cloud Connector issue" shouldn't expect seamless mid-flow migration.

### Primary/secondary/tertiary gateway selection

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

Per Cloud Connector Group, traffic flows via an **active tunnel** to an ZIA/ZPA gateway:

1. **Primary gateway** — active tunnel; all new sessions go here.
2. **Secondary gateway** — standby; if primary fails, Cloud Connector marks secondary as active and starts sending to it. Failover takes **~30 seconds**.
3. **Tertiary gateway** — automatically tried if both primary and secondary fail. Cloud Connector is not limited to only the two user-configured gateways.

When the primary gateway becomes healthy again, **new sessions** route back to primary. Existing sessions on secondary continue until they terminate naturally. No forced migration.

**Geolocation-based selection** — if no specific gateways are configured, Cloud Connector uses geolocation to pick optimal Public Service Edges. Can be overridden per-rule to use specific Public Service Edges, Virtual Service Edges, or sub-clouds.

### Fail-close vs fail-open

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

**Default**: **fail-close**. The source: "The default gateway configuration will fail-close, meaning that internet-bound traffic from workloads is dropped if none of the Cloud Connectors in the same group are able to establish connectivity to any of the Internet & SaaS Service Edges" (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). Applications fail until ZTE connectivity is restored.

**Alternative**: fail-open. The source: "Customers can change this configuration to fail-open, allowing workloads that are accessing the internet to continue doing so. The fail-open option means the egressing traffic is flowing through Zscaler for inspection and policy control" (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`).

**This is the inverse of typical enterprise assumptions** ("fail-open means break access; fail-close means allow"). Read carefully:

| Mode | If no Cloud Connector in the group can reach a gateway |
|---|---|
| fail-close (default) | **Traffic dropped.** Workload can't reach internet (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). |
| fail-open | **Workloads keep reaching the internet.** The source says egress still flows "through Zscaler for inspection and policy control" — but that wording sits oddly against "if none of the Cloud Connectors can establish connectivity," so the exact egress path is an open question (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). |

Operators configuring this should be explicit about which semantic they want, and should not assume fail-open means a direct, un-inspected internet path — the captured help text does not say that.

### ZPA enrollment (workload-to-workload)

Source: `vendor/zscaler-help/what-zscaler-cloud-connector.md`; `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

Cloud Connectors enrolled with ZPA automatically connect to an **optimal Private Access Public Service Edge or Private Service Edge**. Similar to ZCC's ZPA microtunnel — Cloud Connector resolves the nearest ZPA edge dynamically.

Private Access traffic from workloads flows:

```
Workload → Cloud Connector → ZPA Service Edge → App Connector → destination internal app
```

App Connectors (ZPA's sibling outbound-only component — see [`../zpa/app-segments.md`](../zpa/app-segments.md)) sit at the application side; Cloud Connectors sit at the workload side. They never talk directly.

## Data plane vs control plane — why it matters

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`.

Per *Understanding High Availability and Failover*:

> Data plane is composed of outbound connections from the service interface of each Cloud Connector.

The service interface is distinct from the management interface. A Cloud Connector can have its control plane healthy (management works, admin console shows it green) while data plane is failing (traffic isn't actually going through). This is why **health probes validate the data path**, not just VM liveness.

## Cloud Connector vs App Connector

Source: `vendor/zscaler-help/what-zscaler-cloud-connector.md`; `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`.

Both are outbound-only Zscaler VMs. Don't confuse them.

| Dimension | Cloud Connector | App Connector (ZPA) |
|---|---|---|
| Purpose | Forward cloud-workload traffic to ZIA/ZPA | Bridge ZPA cloud to internal application servers |
| Placement | In the workload's network (AWS/Azure/GCP customer account) | In the application's network (data center, cloud VPC hosting the app) |
| Traffic direction | Receives workload traffic, forwards to ZTE | Receives requests from ZPA cloud, forwards to app server |
| Authentication to ZTE | Via cloud provisioning template + provisioning URL | Via provisioning key + TLS client cert |
| Grouping model | Cloud Connector Group | App Connector Group |
| Scaling | Autoscaling (ASG/VMSS/MIG) | Static N+1 redundancy (all active) |
| SDK module | `ztw` (Python: `zscaler/ztw/` / Go: `zscaler/ztw/services/`) | App Connector groups (Python: `zscaler/zpa/app_connector_groups.py` / Go: `zscaler/zpa/services/appconnectorgroup/` — note camelCase, no underscores) |

SDK module paths verified against source: ZTW ships in both SDKs — Python package `vendor/zscaler-sdk-python/zscaler/ztw/account_details.py:1` (under `zscaler/ztw/`) and Go services `vendor/zscaler-sdk-go/zscaler/ztw/services/service.go:1` (under `zscaler/ztw/services/`). App Connector groups likewise span both, but the module *naming* differs: Python uses snake_case `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:1`, while Go uses camelCase with no underscores at `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go:1`. Don't assume the Python module string maps to the Go path.

They **appear in the same traffic flow for workload-to-internal-app access**: Cloud Connector on the workload side, App Connector on the app side, ZPA Service Edge in the middle.

## Edge cases

Source: `vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md`; `vendor/zscaler-help/cbc-about-cloud-connector-groups.md`; `vendor/zscaler-help/what-zscaler-cloud-connector.md`.

- **Existing sessions fail during failover.** The ~30-second failover time applies to new-session routing; existing sessions that were on the failed Cloud Connector or gateway may time out and require retry. Applications with long-lived connections (databases, streaming) see impact.
- **Health check customization requires Support.** Default intervals (15s Azure, 30s AWS) are "optimized." Changing them requires Zscaler Support engagement.
- **Zero Trust Gateway vs Cloud Connector group types** — the difference isn't captured in help articles we've pulled. Both appear in the admin console Group Type dropdown. Likely an architectural evolution (newer = ZTG). Flag for future documentation.
- **Disabled Cloud Connector vs deleted**: disabling stops traffic processing but keeps the VM in inventory and the VM running. Useful for staged rollouts or incident response without deprovisioning.
- **Tertiary gateway is automatic, not user-configured.** A tenant that wants full control over failover sequencing has only primary/secondary configurable; tertiary is Zscaler's safety net.
- **Horizontal scale is N+1-style redundancy**. Adding more Cloud Connectors to a group increases throughput; they're all active. Remove one and throughput drops accordingly — no spare capacity unless over-provisioned.
- **`profile` field on `ztc_location_management` is narrower than `zia_location_management`.** ZTC accepts `[CORPORATE, GUESTWIFI, IOT, NONE, SERVER]` (5 values per `resource_ztc_location_management.go:276`); ZIA accepts those plus `EXTRANET` and `WORKLOAD` (per `resource_zia_location_management.go:391–392`). This is **by design, not a bug**: `WORKLOAD`-typed locations are the ZIA-side concept that auto-binds to the predefined Workload Traffic Group (see [`../zia/locations.md § Surprises #6`](../zia/locations.md)) — they're the *destination* of Cloud Connector traffic, not Cloud Connector's own location entries. `EXTRANET` similarly is a ZIA partner-network concept. ZTC creates location entries that route TO Cloud Connectors; the ZIA-side concepts that ride on top are managed via ZIA's resource. Operators using both providers should NOT try to set `profile = "WORKLOAD"` on a ZTC location resource — it's the ZIA resource that owns that mapping. Surfaced by `scripts/find-asymmetries.py` Pass 1 (cross-provider).

## Open questions

- **Exact ZTG vs Cloud Connector group type semantics** — not documented in captured articles. Likely a naming evolution; lab-test or documentation search needed. See [clarification `cloud-connector-07`](../_meta/clarifications.md#cloud-connector-07-ztg-vs-cloud-connector-group-type-semantics).
- **Whether Cloud Connector's `?cchealth` probe port is configurable** — the help article implies "configured during deployment" but doesn't specify range (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:30`). Filed with the other HA mechanics as [clarification `cloud-connector-08`](../_meta/clarifications.md#cloud-connector-08-ha-mechanics-cchealth-port-fail-openclose-toggle-fail-open-egress-path).
- **Fail-open + fail-close toggle location** — help article mentions "customers can change this configuration" but doesn't name the admin-portal path (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). See [clarification `cloud-connector-08`](../_meta/clarifications.md#cloud-connector-08-ha-mechanics-cchealth-port-fail-openclose-toggle-fail-open-egress-path).
- **What the fail-open egress path actually is** — the source says fail-open lets "workloads that are accessing the internet to continue doing so" and that "the egressing traffic is flowing through Zscaler for inspection and policy control" (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:51`). These two clauses are hard to reconcile: if no Cloud Connector in the group can reach a Service Edge (the precondition for fail-open to matter), it's unclear how that same traffic would still flow "through Zscaler for inspection." Whether fail-open routes direct-to-internet (no inspection) or via some retained/degraded Zscaler path is not resolved by the captured text; needs a lab test or a clearer source. Do not document either reading as fact. See [clarification `cloud-connector-08`](../_meta/clarifications.md#cloud-connector-08-ha-mechanics-cchealth-port-fail-openclose-toggle-fail-open-egress-path).

## Cross-links

- Traffic forwarding — [`./forwarding.md`](./forwarding.md)
- API / SDK / TF surface — [`./api.md`](./api.md)
- ZPA App Connector (the other outbound-only Zscaler VM) — [`../zpa/app-segments.md`](../zpa/app-segments.md) (app connectors referenced in segment config)
- ZCC forwarding profile (the endpoint-side equivalent) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- Shared cloud architecture — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
