---
product: zpa
topic: "zpa-app-connector"
title: "ZPA App Connector — VM architecture, groups, provisioning keys, software updates"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/about-connectors"
  - "vendor/zscaler-help/about-app-connectors.md"
  - "https://help.zscaler.com/zpa/about-connector-provisioning-keys"
  - "vendor/zscaler-help/about-connector-provisioning-keys.md"
  - "https://help.zscaler.com/zpa/understanding-connector-software-updates"
  - "vendor/zscaler-help/understanding-connector-software-updates.md"
  - "https://help.zscaler.com/zpa/about-connector-groups"
  - "vendor/zscaler-help/zpa-about-connector-groups.md"
  - "vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.pdf"
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
author-status: draft
---

# ZPA App Connector

The VM that sits at the application side of every ZPA traffic flow. Receives authenticated requests from the ZPA cloud, forwards them to the actual internal application server, and streams responses back. Outbound-only — never accepts inbound connections from the internet. Paired with the ZPA Service Edge on the cloud side; with ZCC on the user side; the three together form the end-to-end ZPA path.

Separate from ZCC's [Cloud Connector](../cloud-connector/overview.md), which is the workload-side VM for cloud workloads. See [`../cloud-connector/overview.md § Cloud Connector vs App Connector`](../cloud-connector/overview.md) for the comparison table. Both are outbound-only Zscaler VMs; they live on opposite sides of the ZPA flow.

## Summary

- **Outbound-only** — does not require inbound firewall rules. This is the architectural property that makes ZPA safe to deploy against internal apps without exposing them to the internet.
- **Typically deployed in the DMZ** or on a network segment that can reach both the internal applications AND the ZPA cloud.
- **Always active in groups** — multiple App Connectors in the same group are all active simultaneously. No active/passive. ZPA picks the closest one per request based on user location + connector-to-app latency.
- **App Connectors never communicate with each other.** Each is independent, enrolled separately.
- **Enrollment via provisioning key + TLS client cert.** Provisioning key is the shared-secret; the App Connector generates its own cert signed by a Zscaler-managed CA during enrollment.
- **Software updates are scheduled** at the group level with a 4-hour rolling window — one-at-a-time, not all at once, so the group stays available during upgrades.

## Mechanics

### Placement and scaling

From *About App Connectors* (`vendor/zscaler-help/about-app-connectors.md`) and *Understanding the Private Access Architecture*:

- Deploy in locations where internal applications reside (data center, cloud VPC, branch office with on-prem apps), OR in any location with connectivity to the applications.
- **N+1 redundancy** recommended (N = enough to carry the app load, +1 for failover). Sizing is per-group; adding connectors to a group increases capacity.
- App Connectors advertise themselves to the closest Public/Private Service Edge; the ZPA cloud selects which connector to route each request to based on geo-proximity and app-to-connector latency measurements.

**Supported platforms** (per SDK `vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py` and *About App Connectors*):

- VM image distributions for major hypervisors.
- Package installer for supported Linux distributions.
- Cloud-provider reference deployments (AWS AMI, Azure VM, GCP image).

### App Connector Groups

App Connector Groups are the policy, upgrade, and capacity unit. Per *About App Connector Groups*:

- **Every App Connector belongs to exactly one group.** Provisioning key determines group assignment at enrollment time.
- **ZPA Application Segments reference Server Groups, which reference App Connector Groups.** The indirection is intentional — the same App Connector Group can serve many segments.
- **Scheduled upgrade windows** apply at the group level (see below).
- **Latitude/longitude coordinates** on the group tell ZPA where the group is physically, for nearest-connector selection.
- **`-el8` version tracks** and `ip_anchor_type` enum fields surface in the SDK (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/`) — relevant when auditing group config.

Groups are the unit at which upgrades are orchestrated: when a new App Connector version is available, ZPA picks one connector in the group at random, upgrades it (restart + re-enroll), picks the next, and so on. The group stays available throughout because only one connector is down at a time.

### Provisioning Keys

From *About App Connector Provisioning Keys*: a long base64-ish text string that functions as the shared-secret credential for App Connector enrollment.

**Format** (example from help doc):
```
1|api.private.zscaler.com|68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/...(long payload)...
```

The pipe-delimited prefix carries the provisioning-server URL; the payload is the shared secret.

**Operational properties:**

- **Each key is bound to a single App Connector Group.** Using a key enrolls the connector into that group. Cross-group moves require re-enrollment with a different key.
- **Reuse count is trackable + configurable** — set `Maximum Reuse of Provisioning Key` at creation time. ZPA tracks utilization; when the count is reached, the key stops working for new enrollments.
- **Multiple keys per group** are supported. Useful for different deployment pipelines (prod deploy pipeline uses one key, DR restore pipeline uses another) so utilization logs differentiate.
- **Keys are treated as secrets** — Zscaler recommends not storing in cleartext. If the admin disabled *View or Export Provisioning Key After Creation* at config time, the key is never retrievable after creation and a backup must exist externally (e.g., in a credentials vault) or a new key must be generated.

**The #1 enrollment failure cause** (per MCP server's `troubleshoot-connector` skill, which drives `scripts/connector-health.py`): the provisioning key utilization count hitting its max. Symptoms: new App Connector instances fail to enroll; old ones keep working. Diagnostic: check the key's `Provisioning Key Utilization Count` against `Maximum # of App Connectors` for that key.

**Incorrect-key-copy error** (quoted verbatim from *About App Connector Provisioning Keys*):

```
notice:Checking Enrollment
notice:No valid certificate. Attempting to enroll
notice:Enroll: Connecting to api.private.zscaler.com via co2br.prod.zpath.net.
error:Login request failed - http status(401) nonce(<3|api.private.zscaler.com|0/Z6lDT...>) fingerprint(<oXaN4RRiMc...>)
notice:Certificate enrollment failed.
```

A literal copy of this error in a support ticket narrows diagnosis to "key is wrong, truncated, or utilization-exhausted."

**Zscaler Deception / Zscaler-managed keys** — if a provisioning key is Deception-configured or Zscaler-managed, Edit and Delete options are unavailable. Audit tooling should skip these.

### Software updates

From *Understanding App Connector Software Updates*:

- Scheduled at the App Connector Group level. Admin specifies day + time.
- **4-hour rolling window.** Within the window, ZPA picks one connector, upgrades it (restart + reconnect), then picks the next, and so on. Continues until the window expires or all connectors in the group are updated.
- **Unsuccessful updates retry on the next scheduled window.** Until every connector in the group is on the target version.
- **Starting with App Connector version 24.650.4+**, a version check and automated upgrade runs on initial connection — so freshly-deployed connectors may self-upgrade at first boot before the scheduled window.

**Update statuses** (visible in the App Connector list):

| Status | Meaning |
|---|---|
| `Scheduled` | Connector is in queue for its next periodic update window. Hover shows `Scheduled Version` + 4-hour window. |
| `Success` | Connector is on the target version. |
| `Failure` | Update attempted and failed. Zscaler recommends restarting the VM to recover. Update retries next window. |

**OS updates are the customer's responsibility**, not Zscaler's. App Connector software is designed to be compatible with host-OS updates, but Zscaler doesn't patch the underlying kernel/distribution — the organization does. A long-running VM with un-patched OS is a common audit finding.

**Zscaler Support may manually update connectors** if the currently-running software has a known issue. Support notifies the tenant's ZPA admins beforehand.

### Certificate enrollment and trust

From *Understanding the Private Access Architecture* (captured earlier, see [`../shared/cloud-architecture.md § Certificate and PKI model`](../shared/cloud-architecture.md)):

- App Connector generates a **TLS client certificate** during enrollment, signed by the tenant's ZPA CA.
- The certificate authenticates the App Connector to ZPA Service Edges on every subsequent connection.
- **Private keys never leave the App Connector VM** where they were generated — this is a structural security property.
- Zscaler root-signing keys live in an **offline, air-gapped signing environment**; no online CA for root.

### Health reporting and metrics

App Connectors surface health metrics that the ZPA admin console displays and that streaming log fields (per `Understanding_App_Connector_Metrics_Log_Fields.pdf`) carry. Relevant:

- **`CONNECTED` / `DISCONNECTED` / other runtime statuses** — visible per connector.
- **Current software version vs target version** — version-lag indicator.
- **Certificate expiry** — cert validity window. Connectors don't auto-rotate certs; if a cert approaches expiry, re-enrollment is required.
- **VM-cloning fingerprint issue** — when a VM template is used to deploy multiple App Connectors without unique re-enrollment, all clones share a hardware fingerprint. ZPA detects the collision and disables all but one. The remedy is re-enrollment with unique fingerprints per clone. `scripts/connector-health.py` surfaces this pattern as a suspected cause when `last_upgrade_time` is significantly older than the group's peers.

### API surface

Python SDK: `client.zpa.app_connector_groups`, `client.zpa.app_connectors`, `client.zpa.app_connector_schedule` (scheduled upgrades). See `vendor/zscaler-sdk-python/zscaler/zpa/` for the full surface.

Go SDK: `client.zpa.appconnectorcontroller`, `appconnectorgroup`, `appconnectorschedule` — parity with Python.

Typical operations:

- List App Connector Groups → per-group listing of member App Connectors.
- Fetch a specific App Connector's status, version, and certificate info.
- Generate / delete / edit provisioning keys.
- Schedule upgrades per group.

The SDK does **not** expose:
- VM deployment itself (that's the customer's cloud-provider or hypervisor tooling).
- Host-OS update.
- The provisioning-key secret after creation if the tenant disabled "View or Export" at creation time.

## Cross-product context

| Relationship | Details |
|---|---|
| **ZIA SSL Inspection's `zpa_app_segments` criterion** | Filters to Source-IP-Anchor-enabled segments; the App Connectors serving those segments are the termination point for SIPA traffic (see [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)). |
| **ZPA Application Segments** | Segment references a Server Group; Server Group references an App Connector Group. See [`./app-segments.md § Mechanics`](./app-segments.md). |
| **Cloud Connector** | Sibling outbound-only VM on the workload-side (AWS/Azure/GCP). Same general pattern, opposite side of flow. See [`../cloud-connector/overview.md`](../cloud-connector/overview.md). |
| **Microtenant sharing** | App Connectors can be associated with shared segments via Move / Share operations (Go-SDK-only). See [`./app-segments.md § Cross-microtenant Move and Share`](./app-segments.md). |
| **ZCC forwarding** | ZPA access flow: ZCC → ZPA Service Edge → App Connector → app server. The App Connector is the last hop before the real app; ZCC selects the segment client-side, ZPA Service Edge authenticates and routes to the chosen App Connector. |

## Common question shapes

| Question | Likely cause | Start |
|---|---|---|
| "Our new App Connectors won't enroll." | Provisioning key utilization count exhausted, or key copied wrong | [Provisioning Keys](#provisioning-keys) |
| "App Connector shows Failure status after upgrade." | Update failed; restart the VM. If still failing, escalate. | [Software updates](#software-updates) |
| "Connector says DISCONNECTED even though the VM is running." | Certificate expired (if connector has been running >cert validity), or outbound firewall blocking cloud reach | Health metrics fields per `Understanding_App_Connector_Metrics_Log_Fields.pdf` |
| "Users hit wrong App Connector for an app." | Geo-proximity-based selection — add connectors closer to users, or configure segment affinity | Selection logic per *About App Connectors* |
| "Multiple connectors disabled after VM clone." | Hardware-fingerprint collision from template-based deployment | Re-enroll each clone with unique fingerprint |
| "Cloned connector still enrolled, original disabled." | Fingerprint collision — ZPA keeps one, disables others | Same |
| "Upgrade window passed but some connectors still on old version." | 4-hour window expired before all connectors updated; retry next window | [Software updates](#software-updates) |
| "Provisioning key appears blank in the portal." | `View or Export Provisioning Key After Creation` was disabled at creation time. Key is not retrievable; generate a new one if needed. | [Provisioning Keys](#provisioning-keys) |

## Edge cases

- **4-hour upgrade window is not extendable.** Groups with too many connectors to finish in 4 hours get staggered across multiple nights. Pick upgrade nights carefully for large groups.
- **Upgraded connector re-enrollment is transparent** — the connector resumes service on the new version without a new provisioning key. The client-cert chain survives the upgrade.
- **"Scheduled" status locks the upgrade time** — once scheduled, the periodic-update time can't be changed for that specific connector (per help doc). Manual upgrades are still available.
- **Provisioning keys copied from the portal UI** can silently include trailing whitespace. Operators pasting the key into a deployment template should trim whitespace; the `notice:Login request failed - http status(401)` error in the error log is the giveaway.
- **Nearest-App-Connector selection** uses app-to-connector latency from Zscaler's continuous measurements, not static geography. A connector that's geographically far but has a fast link to the app can be preferred. Can be counter-intuitive for operators expecting pure geo-based routing.
- **App Connector VM sizing** depends on concurrent-user count, app throughput, and inspection feature set (Double Encryption, AppProtection add overhead). Zscaler publishes sizing guidance in their reference architecture PDFs; not captured in depth here.
- **App Connector Group must associate with both a Server Group AND a provisioning key** to serve any traffic. A group with no Server Group association silently fails to route traffic — the admin console doesn't flag the partial config as invalid. The same applies to network reachability: only associate Connector Groups with applications the connectors can actually reach. Source: *About Connector Groups* lines 16-17.

## Service Edge Group `service_edges` block — undocumented operational requirement

The same group/registration model applies to **Private Service Edges** (PSEs) via `zpa_service_edge_group`. The `service_edges` block on this resource is documented as **optional** in the Terraform registry, but **in practice it is required** if your tenant has any Service Edges actually attached to the group. Per upstream `zscaler/terraform-provider-zpa` issue #550 (closed in v4.1.3, took 27 comments to root-cause):

- **Symptom:** Terraform `apply` repeatedly tries to remove Service Edges from the group on every run, even though plan output shows "no changes." After upgrading the provider past v4.0.9, drift detection started picking up the omission.
- **Root cause:** the API returns the Service Edges currently attached to the group; if your HCL doesn't declare them in a `service_edges { id = [...] }` block, TF reads the API response, sees a populated list, sees an empty desired-state list, and tries to detach them.
- **Why this is operationally awkward:** Service Edges register *to* a group via provisioning key (deployed VM → key → registration). The PSE's UID is **not visible in the admin portal at registration time**; operators must use the API or `terraform import` to retrieve it before they can write the `service_edges` block. The TF documentation suggests the block is for advanced use only — it's actually required to prevent drift.
- **Workflow that works:**
  1. Deploy PSE VM, apply provisioning key, start services.
  2. Use the ZPA API (`GET /serviceEdge`) or `terraform plan` drift output to capture the new PSE's UID.
  3. Add the UID to the `service_edges { id = [...] }` block in the group resource.
  4. Subsequent `apply`s remain stable.
- **Provider versions affected:** v4.0.9 through v4.1.2 had drift-detection bugs around dynamic blocks for this resource. v4.1.3 stabilized. Operators on older provider versions should expect this drift behavior.

The same pattern likely applies to App Connector Groups when an `app_connector_groups` block is omitted but the group has registered connectors — though this is not documented in the issue thread.

## Logging — LSS retransmit window is shorter than NSS

ZPA's Log Streaming Service (LSS) is the equivalent of ZIA's NSS for Private Access logs, but with **stricter retransmit semantics** that catch operators off-guard:

- **Connectivity gap between Private Access and the App Connector** → LSS can retransmit at most **the last 15 minutes** of log data after restoration, and **delivery is not guaranteed**. The 15-minute window vs. ZIA NSS's 60-minute opt-in recovery is a 4× difference.
- **Connectivity gap between the App Connector and the SIEM** → no retransmit at all (audit logs are the exception). Logs generated during this gap are permanently lost from the SIEM stream.

Implication: a 30-minute App Connector outage = roughly 15 minutes of permanent ZPA log gap, even with retransmit configured. Operators familiar with NSS's 60-minute recovery often assume LSS matches; it doesn't. Source: *About the Log Streaming Service* lines 61-62.

See also [`../shared/nss-architecture.md § Surprises`](../shared/nss-architecture.md) where this is cross-referenced.

## Open questions

- **Exact App Connector-to-app latency probe cadence** — how frequently ZPA re-measures connector-to-app RTT. Not documented publicly; relevant for "our network path changed, how long until ZPA notices" questions.
- **Certificate validity window** — exactly how long an App Connector cert is valid before re-enrollment is required. Not captured.
- **Max connectors per group** — high limits but not explicitly enumerated.

## Cross-links

- App Segments (reference App Connector Groups via Server Groups) — [`./app-segments.md`](./app-segments.md)
- Policy precedence (App Connector selection happens AFTER ZPA access policy evaluates) — [`./policy-precedence.md`](./policy-precedence.md)
- Cloud Connector (sibling outbound VM on the workload side) — [`../cloud-connector/overview.md`](../cloud-connector/overview.md)
- Source IP Anchoring (SIPA) (App Connector is the egress point for SIPA traffic) — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Cloud architecture / PKI model (certificates, outbound-only model) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- Connector health script (references this doc) — `scripts/connector-health.py`
