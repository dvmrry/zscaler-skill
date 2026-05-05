---
product: zpa
topic: "zpa-app-connector"
title: "ZPA App Connector — VM architecture, groups, provisioning keys, software updates"
content-type: reasoning
last-verified: "2026-05-05"
confidence: high
source-tier: doc
verified-against:
  vendor/terraform-aws-zpa-app-connector-modules: afea191a839ecd8bb153bdaed3a5dad17cf1a54b
  vendor/terraform-azurerm-zpa-app-connector-modules: 4b9faa39bdf06a7aaec8729d7966e9e8f0d9fc03
sources:
  - "https://help.zscaler.com/zpa/about-connectors"
  - "vendor/zscaler-help/about-app-connectors.md"
  - "https://help.zscaler.com/zpa/about-connector-provisioning-keys"
  - "vendor/zscaler-help/about-connector-provisioning-keys.md"
  - "https://help.zscaler.com/zpa/understanding-connector-software-updates"
  - "vendor/zscaler-help/understanding-connector-software-updates.md"
  - "https://help.zscaler.com/zpa/about-connector-groups"
  - "vendor/zscaler-help/zpa-about-connector-groups.md"
  - "vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt"
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
  - "vendor/terraform-aws-zpa-app-connector-modules/README.md"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-sg-aws/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-iam-aws/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/examples/README.md"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/README.md"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvm-azure/variables.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvmss-azure/variables.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvmss-azure/main.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-nsg-azure/main.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf"
  - "vendor/terraform-azurerm-zpa-app-connector-modules/examples/README.md"
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
- **Scheduled upgrade windows** apply at the group level (see below). The Terraform module defaults to `SUNDAY` at `66600` seconds (18:30 UTC) (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf:39-49`).
- **DNS query type** defaults to `IPV4_IPV6`; valid values are `IPV4_IPV6`, `IPV4`, `IPV6` (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf:72-85`).
- **Version profile** defaults to `override_version_profile=true`, `version_profile_id=0` (Default track) (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf:51-70`).
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

**`association_type` write-vs-read schema asymmetry.** The TF resource accepts five association types (`CONNECTOR_GRP, SERVICE_EDGE_GRP, EXPORTER_GRP, NP_ASSISTANT_GRP, SITE_CONTROLLER_GRP` per `resource_zpa_provisioning_key.go:131`) but the matching data source accepts only two (`CONNECTOR_GRP, SERVICE_EDGE_GRP` per `data_source_zpa_provisioning_key.go:102`). Operators creating provisioning keys for the three "extended" types must look up by ID rather than association_type-plus-name through the data source. The data source's own description explicitly says "supported values are CONNECTOR_GRP and SERVICE_EDGE_GRP" — this is by design at the TF layer, not a stale validator. Implication: tooling that auto-discovers provisioning keys via the data source will silently miss keys for the three extended types. Cross-listed in [`./api.md § Read/write shape asymmetries`](./api.md).

**Provisioning key validation asymmetry between AWS and Azure Terraform modules.** The AWS App Connector Terraform module hard-validates `provisioning_key_association_type` to `CONNECTOR_GRP` only — the validation block rejects any other value at plan time (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf:26-36`). The Azure module accepts both `CONNECTOR_GRP` and `SERVICE_EDGE_GRP` (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf:29-40`). Practical consequence: a `SERVICE_EDGE_GRP` key cannot be created via the AWS module — operators must use the ZPA API directly or the raw `zscaler/terraform-provider-zpa` resource. The same key *can* be created via the Azure module. Operators who are scripting provisioning key creation cross-cloud should branch on the target cloud or use the API layer uniformly.

### Reference deployment examples

Zscaler publishes reference Terraform configurations in two vendor-maintained repositories. As of module versions AWS v1.4.0 / Azure v1.1.0, all App Connectors are deployed on RHEL 9 (`vendor/terraform-aws-zpa-app-connector-modules/README.md:19`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md:19`).

**AWS examples** (`vendor/terraform-aws-zpa-app-connector-modules/examples/`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | VPC + NAT gateway + bastion host — networking foundation only, no App Connectors |
| `base_ac` | Greenfield | `base` + 2 standalone App Connectors (1 per AZ); default `m5.large` (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf:37`), `ac_count=1` per module call |
| `base_ac_asg` | Greenfield | `base` + Auto Scaling Group; defaults: `min_size=2`, `max_size=4`, target CPU 50% (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/variables.tf:113-184`) |
| `ac` | Brownfield | 2 standalone App Connectors deployed into existing VPC/subnets |
| `ac_asg` | Brownfield | ASG-based App Connectors deployed into existing infrastructure |

**Azure examples** (`vendor/terraform-azurerm-zpa-app-connector-modules/examples/`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | VNet + NAT gateway + bastion host — networking foundation only, no App Connectors |
| `base_ac` | Greenfield | `base` + 2 standalone App Connectors in an availability set (or zones if `zones_enabled=true`); default `Standard_D4s_v5` (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvm-azure/variables.tf:48`), `ac_count=1` per module call (valid range 1–250 per `:101`) |
| `base_ac_vmss` | Greenfield | `base` + VMSS; defaults: `vmss_default_acs=2`, `vmss_min_acs=2`, `vmss_max_acs=10`, scale-out at 70% CPU / scale-in at 50%, 5-min evaluation, 15-min cooldown (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvmss-azure/variables.tf:153-217`) |
| `ac` | Brownfield | 2 standalone App Connectors deployed into existing VNet/subnets |
| `ac_vmss` | Brownfield | VMSS-based App Connectors deployed into existing infrastructure |

**Security group / NSG defaults across all examples:**

- AWS: egress unrestricted (all protocols / all ports / `0.0.0.0/0`); ingress SSH (port 22 TCP) from VPC CIDR only (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-sg-aws/main.tf:18-46`).
- Azure: inbound SSH (port 22 TCP) and ICMP from `VirtualNetwork` scope only; outbound unrestricted (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-nsg-azure/main.tf:10-44`).

**Hardening defaults:**

- AWS: IMDSv2 enforced (`imdsv2_enabled=true`) on both standalone and ASG launch templates (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf:92-96`); EBS encrypted by default with AWS-managed keys (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/variables.tf:40-50`); IAM AssumeRole principal is `ec2.amazonaws.com` (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-iam-aws/main.tf:8-19`).
- Azure: OS disk hardcoded to `Premium_LRS` storage with `ReadWrite` caching (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvmss-azure/main.tf:44-47`); marketplace image — publisher `zscaler`, offer `zscaler-private-access`, SKU `zpa-con-azure`, version `latest` (`vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvm-azure/variables.tf:72-94`).

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

App Connectors surface health metrics that the ZPA admin console displays and that streaming log fields (per `Understanding_App_Connector_Metrics_Log_Fields.txt`) carry. Relevant:

- **`CONNECTED` / `DISCONNECTED` / other runtime statuses** — visible per connector. The connector reports status via its M-Tunnel control channel to a Public/Private Service Edge; loss of that channel is what flips the status.
- **Active connections to Service Edges** — `ActiveConnectionsToPublicSE` / `ActiveConnectionsToPrivateSE` in App Connector Metrics indicate how many M-Tunnels the connector currently holds open to ZPA infrastructure. Zero active connections to either ⇒ connector is effectively offline regardless of VM uptime.
- **Per-segment target reachability** — driven by the segment's `health_reporting` setting (`NONE` / `ON_ACCESS` / `CONTINUOUS`). Surfaced in App Connector Metrics as `TargetCount` (configured) vs `AliveTargetCount` (currently reachable from this connector's network position). `AliveTargetCount < TargetCount` means some configured targets are not reachable from this connector right now.
- **Current software version vs target version** — version-lag indicator.
- **Certificate expiry** — cert validity window. Connectors don't auto-rotate certs; if a cert approaches expiry, re-enrollment is required.
- **VM-cloning fingerprint issue** — when a VM template is used to deploy multiple App Connectors without unique re-enrollment, all clones share a hardware fingerprint. ZPA detects the collision and disables all but one. The remedy is re-enrollment with unique fingerprints per clone. `scripts/connector-health.py` surfaces this pattern as a suspected cause when `last_upgrade_time` is significantly older than the group's peers.

### How sessions are assigned to App Connectors

Connector **health and target reachability gate eligibility** for session assignment. ZPA's connector-selection step happens in two phases — eligibility filtering, then latency-based selection — and the metrics surfaced above are the inputs to the eligibility phase.

**Phase 1 — eligibility filter (a connector must pass all of these to be a candidate):**

1. Connector is a member of an App Connector Group that's associated with the Server Group referenced by the matching Application Segment. (Configuration-time linkage; see [`./app-segments.md § Mechanics`](./app-segments.md).)
2. Connector reports `CONNECTED` to a Service Edge — i.e., has an active M-Tunnel control channel.
3. Connector's recent reachability probe shows the target is alive. The probe cadence depends on the segment's `health_reporting`: `NONE` = probe only at access time; `ON_ACCESS` = probe at access, cache result; `CONTINUOUS` = probe on a regular cadence regardless of access. The `AliveTargetCount` field in App Connector Metrics is the LSS-visible output of this probing.

**Phase 2 — selection from surviving candidates**: ZPA picks by app-to-connector latency from continuous Zscaler-side measurements (not static geography). A geographically distant but low-latency connector can be preferred over a closer high-latency one. If `select_connector_close_to_app = false` is set on a Server Group, selection is round-robin instead of latency-based.

**Operational consequence**: a sick connector or a connector that currently cannot reach the target is **filtered out before assignment** — a session never tries to use a known-bad connector and fail at the app-server hop. The failure modes split cleanly:

| Symptom | What happened | Where to look |
|---|---|---|
| LSS `ConnectionStatus = Close`, **no `Connector` populated**, no policy block in `Policy` | Eligibility filter rejected every candidate — no connector was assigned | All connectors `DISCONNECTED`? Server Group → App Connector Group association missing or pointing at the wrong group? `health_reporting` set to `NONE` for a segment whose targets are intermittently reachable? `AliveTargetCount = 0` across the group? |
| LSS `ConnectionStatus = Close`, `Connector` populated, high `ConnectionSetupTime`, connector-side `InternalReason` | Eligible at assignment, target failed during the connection attempt (race with a state change, transient network gap, app-server flap) | App Connector logs for that target; `AliveTargetCount` over time |
| LSS `ConnectionStatus = Open` / `Active` but elevated `ConnectionSetupTime` / `ServerSetupTime` | Eligible and assigned, just slow | Latency between connector and app; `select_connector_close_to_app` setting; whether closer connectors should be added to the group |

**Common weak-model mistake**: hypothesizing "the assigned connector tried to reach the app and failed" without first checking whether a connector was assigned at all. If the `Connector` field is empty, no connector was assigned — meaning eligibility filtering rejected every candidate, and the fix is on the eligibility side (group association, connector status, target reachability, `health_reporting` configuration), not the connector-to-app hop.

**Confidence note**: the inputs to eligibility (`CONNECTED` status, target reachability, group association) are documented; the exact internal ordering of the filter and the algorithm Zscaler uses to combine inputs are not publicly published. Treat the two-phase model as the operational principle, not as a verbatim algorithm.

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
| "Connector says DISCONNECTED even though the VM is running." | Certificate expired (if connector has been running >cert validity), or outbound firewall blocking cloud reach | Health metrics fields per `Understanding_App_Connector_Metrics_Log_Fields.txt` |
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
