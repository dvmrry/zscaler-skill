---
product: zpa
topic: "public-service-edges"
title: "ZPA Public Service Edges — Zscaler-managed session brokers"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
verified-against:
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
sources:
  - "vendor/zscaler-help/about-private-service-edges.md"
  - "vendor/zscaler-help/about-private-service-edge-groups.md"
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_service_edge.go"
author-status: draft
---

# ZPA Public Service Edges — Zscaler-managed session brokers

> **Scope.** This document covers the ZPA **Public** Service Edge — the Zscaler-operated, multi-tenant session-broker tier — plus the Service Edge Group API surface that distinguishes a public (Zscaler-managed) group from a private (operator-deployed) one. Customer-deployed brokering is the ZPA **Private** Service Edge, covered in full at [`./private-service-edges.md`](./private-service-edges.md); this doc cross-links rather than re-derives that detail.
>
> **No "Virtual Service Edge" in ZPA.** "Virtual Service Edge (VSE)" is a **ZIA-only** product term (a customer-run VM that does inline internet/SaaS inspection). It has no ZPA equivalent — the string appears nowhere in the ZPA Python SDK, Go SDK, or Terraform provider. ZPA's customer-deployed edge is the **Private Service Edge**. Earlier revisions of this doc described ZIA VSE sizing/clustering (VMware/Hyper-V tables, CARP, DSR, Marvell SSL cards) as if it were ZPA; that content was ZIA and has been removed. See [`../zia/private-service-edge.md`](../zia/private-service-edge.md) for the ZIA edge products.

---

## 1. What ZPA Public Service Edges are

A ZPA Public Service Edge is a **session broker hosted in a Zscaler data center on multi-tenant infrastructure** — Private Access "runs on a unique multi-tenant infrastructure, separate from that of Internet & SaaS" (`vendor/zscaler-help/understanding-private-access-architecture.md:16`). Functionally it does exactly what a ZPA Private Service Edge does — "As with a Public Service Edge, a Private Service Edge manages the connections between Zscaler Client Connector and App Connectors. It registers with the Private Access Cloud. This allows a Private Service Edge to download the relevant policies and configurations so it can enforce all Private Access policies. It also caches path selection decisions" — the difference is only *where it runs* and *who manages it*: Public Service Edges "are deployed in Zscaler data centers around the world", whereas Private Service Edges are "single-tenant instance brokers" the organization hosts (`vendor/zscaler-help/about-private-service-edges.md:10,12`).

A Public Service Edge does **not** run SSL/inline inspection engines, sandboxing, firewall, or DLP. Those are ZIA functions. A ZPA Service Edge's job is brokering: Public and Private Service Edges "enforce user policies and provide secure transport to App Connectors", authenticate Zscaler Client Connector (ZCC) and App Connectors using public-key cryptography, and create/manage the Microtunnels (M-Tunnels) that carry application sessions end-to-end (`vendor/zscaler-help/understanding-private-access-architecture.md:29,31,35`). Best-path App Connector selection is attributed to **Private Access** as a whole rather than the Service Edge specifically — "Private Access identifies the best-path App Connector for the internal web application and connects them to it" (`vendor/zscaler-help/understanding-private-access-architecture.md:79`), selecting "the closest App Connector given the location of the user and the App Connector-to-application latency" (`vendor/zscaler-help/understanding-private-access-architecture.md:44`).

Public Service Edges are **Zscaler-maintained and deployed globally** — "Maintained by Zscaler and deployed globally, Public Service Edges are the cloud-based portion of the Private Access data forwarding path" (`vendor/zscaler-help/understanding-private-access-architecture.md:29`). The operator does not deploy, configure, or update them. A tenant can see Zscaler-managed Service Edges in the Admin Console, but "Private Service Edges that are managed by Zscaler are read only and cannot be configured" — the same read-only posture applies to the Public tier (`vendor/zscaler-help/about-private-service-edges.md:49`).

**Authentication / key handling.** A Service Edge "use[s] only public keys for authenticating all remote systems and clients connecting with it. No private keys are stored or used, with the exception of the [Service Edge's] identity" (`vendor/zscaler-help/understanding-private-access-architecture.md:33`). ZCC and App Connectors authenticate with the organization's PKI; Service Edges authenticate with Zscaler's PKI (see [`./private-service-edges.md`](./private-service-edges.md) for Z-Tunnel/M-Tunnel mechanics, which are identical across the Public and Private tiers).

---

## 2. Public vs Private — when each is used

A ZPA tenant can use both tiers at once: Public Service Edges as the default global path, and Private Service Edges for specific sites, regulated workloads, or business-continuity. The Public tier is the default; the Private tier is deployed only when a specific driver requires operator-controlled, on-prem brokering. The full driver list, deployment model, sizing, enrollment, and HA design for the customer-deployed tier live in [`./private-service-edges.md`](./private-service-edges.md).

| Dimension | Public Service Edge | Private Service Edge |
|---|---|---|
| Where it runs | Zscaler data center / PoP | Operator's DC, private cloud, or cloud VPC |
| Who manages it | Zscaler (read-only to the tenant) | Operator deploys VM; Zscaler manages the software image |
| Tenancy | Multi-tenant | Single-tenant (`vendor/zscaler-help/about-private-service-edges.md:10`) |
| Selection | Automatic, by proximity / CA routing | Operator-influenced (trusted networks, grace distance) |
| Operator deploys / configures | No | Yes — via provisioning key + Service Edge Group |
| Default path | Yes | No — deployed for a specific driver |

Drivers for adding a Private Service Edge (regulatory / data-residency, air-gapped networks, latency, business continuity, private-only routing) and the deployment detail are documented in [`./private-service-edges.md`](./private-service-edges.md); they are not repeated here.

---

## 3. The `is_public` flag — how a group is marked public vs private

A Service Edge Group carries an explicit boolean that marks whether the group is a public (Zscaler-reachable) group or a private one. This is the on-API mechanism that distinguishes the two tiers.

- **Python model:** `is_public` ← wire key `isPublic` (`vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py:54`).
- **Terraform:** `is_public`, "Enable or disable public access for the Service Edge Group", default `false` (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:91-96`). On the Go API the boolean is serialized to an uppercased string (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:451`).
- **Admin Console label:** "Publicly Accessible — Choose if the Private Service Edge group with specific trusted networks mapping is also available publicly for all users outside of these trusted networks. It is important to ensure the Private Service Edge is reachable over a public IP address if you need remote users to be able to connect to it" (`vendor/zscaler-help/about-private-service-edge-groups.md:38`).

The related **grace-distance** controls let a Private Service Edge Group win over a *closer* Public Service Edge: `grace_distance_enabled` "allows ZPA Private Service Edge Groups within the specified distance to be prioritized over a closer ZPA Public Service Edge" (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:214-218`), with `grace_distance_value` the maximum distance and `grace_distance_value_unit` one of `MILES`/`KMS` (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:220-249`). This is the proximity-override the Admin Console calls "Public Service Edge Proximity Override" (`vendor/zscaler-help/about-private-service-edge-groups.md:45`).

---

## 4. How Public Service Edges appear in operator workflows

1. **LSS access-log records.** ZPA LSS emits per-session records reported "primarily by the Public Service Edges or Private Service Edges" (`vendor/zscaler-help/understanding-private-access-architecture.md:89`). The operator sees the Service Edge that brokered a session but cannot influence which Public Service Edge was selected.

2. **Automatic geo-selection.** Public Service Edges are Zscaler-deployed globally and selected automatically; the operator has no direct control over Public-tier selection. To bias selection toward an operator-run group, the levers are trusted-network mapping and grace distance on a *Private* Service Edge Group (§3), not configuration of the Public tier.

3. **Read-only health.** The `control_channel_status` and broker connect/disconnect timestamps on the ServiceEdge object surface connectivity state (§5.2). For Zscaler-managed edges these are read-only — Public Service Edge health issues are Zscaler operational matters, not tenant configuration.

---

## 5. API / SDK surface

### 5.1 ServiceEdge individual instances — Python SDK

| Property | `client.zpa.service_edges` |
|---|---|
| Class | `ServiceEdgeControllerAPI` (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:26`) |
| File | `zscaler/zpa/service_edges.py` |
| Go parity | `serviceedgecontroller/` |

The `/serviceEdge` endpoint exposes individual Service Edge instances. In practice these are the operator's **enrolled Private** Service Edge nodes — there is no API path to enroll or configure a Public (Zscaler-managed) Service Edge; those remain read-only.

**Methods** (all under `_zpa_base_endpoint = /zpa/mgmtconfig/v1/admin/customers/{customer_id}`):

| Method | HTTP | Endpoint | Notes |
|---|---|---|---|
| `list_service_edges(query_params=None)` | GET | `.../serviceEdge` | Paginated (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:38,78`) |
| `get_service_edge(service_edge_id, **kwargs)` | GET | `.../serviceEdge/{id}` | (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:103,124`) |
| `update_service_edge(service_edge_id, **kwargs)` | PUT | `.../serviceEdge/{id}` | (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:140,172`) |
| `delete_service_edge(service_edge_id, **kwargs)` | DELETE | `.../serviceEdge/{id}` | Deregisters a Private SE (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:201,222`) |
| `bulk_delete_service_edges(service_edge_ids, **kwargs)` | POST | `.../serviceEdge/bulkDelete` | Batch deregister (`vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py:238,250`) |

### 5.2 Key fields on the ServiceEdge model

All wire keys below are read from `vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py`.

| Python field | Wire key | Line | Notes |
|---|---|---|---|
| `id` / `name` | `id` / `name` | 31-32 | Object ID / display name |
| `enabled` | `enabled` | 38 | |
| `fingerprint` | `fingerprint` | 36 | Hardware fingerprint the enrolled cert is pinned to |
| `issued_cert_id` | `issuedCertId` | 37 | The TLS client cert issued to this Service Edge |
| `enrollment_cert` | `enrollmentCert.name` | 72-74 | Enrollment certificate name (nested object) |
| `latitude` / `longitude` / `location` | — | 39-41 | Geo of the PoP or customer site |
| `private_ip` / `public_ip` | `privateIp` / `publicIp` | 59-60 | Routable IPs of the node |
| `platform` | `platform` | 61 | Host platform |
| `runtime_os` | `runtimeOS` | 62 | Runtime OS string |
| `platform_detail` | `platformDetail` | 65 | Extended platform descriptor |
| `control_channel_status` | `controlChannelStatus` | 47 | CA connectivity state |
| `ctrl_broker_name` | `ctrlBrokerName` | 48 | The CA broker this SE is connected to |
| `current_version` / `expected_version` | `currentVersion` / `expectedVersion` | 42-43 | Software version state |
| `upgrade_status` / `upgrade_attempt` | `upgradeStatus` / `upgradeAttempt` | 45-46 | Upgrade lifecycle |
| `last_broker_connect_time` / `last_broker_disconnect_time` | `lastBrokerConnectTime` / `lastBrokerDisconnectTime` | 49,53 | CA channel timestamps |
| `service_edge_group_id` / `service_edge_group_name` | `serviceEdgeGroupId` / `serviceEdgeGroupName` | 70-71 | Owning Service Edge Group |
| `provisioning_key_id` / `provisioning_key_name` | `provisioningKeyId` / `provisioningKeyName` | 68-69 | Private-SE enrollment only |
| `sarge_version` | `sargeVersion` | 64 | Internal Zscaler component version |
| `zpn_sub_module_upgrade_list` | `zpnSubModuleUpgradeList` | 77 | Per-module upgrade state (list) |

`provisioning_key_id` / `provisioning_key_name` / `enrollment_cert` populate only on operator-enrolled Private Service Edges.

### 5.3 Service Edge Group — `ServiceEdgeGroupAPI`

The group is the administrative unit for Service Edges. For the **operator-deployed Private** tier this is the create/configure surface (grouping, geo, trusted-network binding, upgrade scheduling, DR mode); a Zscaler-managed (public) group is read-only. Full Terraform-resource detail for the Private tier — required args, version-profile values, enrollment via `user_codes` / `enrollment_cert_id`, AWS/Azure modules — is in [`./private-service-edges.md`](./private-service-edges.md).

| Property | `client.zpa.service_edge_group` |
|---|---|
| Class | `ServiceEdgeGroupAPI` (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py:26`) |
| File | `zscaler/zpa/service_edge_group.py` |
| Go parity | `serviceedgegroup/` |

**Methods** (endpoint `.../serviceEdgeGroup[/{id}]`):

| Method | HTTP | Line |
|---|---|---|
| `list_service_edge_groups(query_params=None)` | GET | 37,78 |
| `get_service_edge_group(group_id, query_params=None)` | GET | 102,124 |
| `add_service_edge_group(**kwargs)` | POST | 148,219 |
| `update_service_edge_group(group_id, **kwargs)` | PUT | 249,282 |
| `delete_service_edge_group(group_id, microtenant_id=None)` | DELETE | 320,343 |

(All from `vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py`.)

**Group fields that distinguish public vs private and drive selection** — from `vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py`:

| Python field | Wire key | Line | Purpose |
|---|---|---|---|
| `is_public` | `isPublic` | 54 | Marks the group public (Zscaler-reachable) vs private. See §3. |
| `grace_distance_enabled` | `graceDistanceEnabled` | 56 | Allow this (private) group to override a closer Public SE within the grace distance |
| `grace_distance_value` | `graceDistanceValue` | 57 | Override distance threshold |
| `grace_distance_value_unit` | `graceDistanceValueUnit` | 58 | `MILES` / `KMS` |
| `use_in_dr_mode` | `useInDrMode` | 65 | Hold the group in reserve for disaster recovery |
| `version_profile_id` | `versionProfileId` | 43 | Software release track binding |
| `version_profile_name` | `versionProfileName` | 44 | Release-track name |
| `version_profile_visibility_scope` | `versionProfileVisibilityScope` | 46 | Visibility scope of the version profile |
| `trusted_networks` | `trustedNetworks` | 68 | Trusted Networks whose users are preferentially routed to this group |
| `latitude` / `longitude` / `location` | — | 40-42 | Geo of the group |
| `microtenant_id` / `microtenant_name` | `microtenantId` / `microtenantName` | 59-60 | Microtenant scope |

The Go Terraform resource confirms the same distinguishing fields: `is_public` (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:91`), `use_in_dr_mode` (122), and `grace_distance_*` (214-249). Its OAuth2 fields are adjacent but not configuration-coupled: `enrollment_cert_id` is Optional+Computed and auto-resolves `Service Edge` before create/update when missing or empty, while `user_codes` verification runs only for nonempty codes on create or changed/nonempty codes on update (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:251-262,281-310,385-421`).

### 5.4 Terraform

The TF provider exposes a **data source** for individual Service Edge instances (`data_source_zpa_service_edge.go`); there is no resource to create/manage individual instances — enrollment is done by the Private SE appliance via provisioning key (or the `user_codes`/`enrollment_cert_id` OAuth2 path on the group). The manageable resource is `resource_zpa_service_edge_group`, documented for the Private tier in [`./private-service-edges.md`](./private-service-edges.md).

---

## Open questions

- **Public-tier-specific behavior is inferred, not directly documented.** No ZPA-specific *Public* Service Edge help page is present in vendor sources (`help.zscaler.com/zpa/about-public-service-edges` and `.../understanding-service-edges` are referenced from `about-private-service-edges.md:10` and `understanding-private-access-architecture.md:37` but not captured). The Public-tier description in §1 is derived from the Private-SE page's "provide the functionality of a Public Service Edge" framing plus the architecture page. The earlier draft's quantitative claims about the Public tier ("hundreds of thousands of concurrent users with millions of concurrent sessions", per-second CA heartbeat, Safe-mode, default URL-block policy) came from the **ZIA** page `about-public-service-edges-internet-saas.md` and described ZIA gateway behavior, not ZPA — they have been removed. Whether any of those scale/Safe-mode behaviors apply to the ZPA broker tier is unconfirmed against a ZPA source. (Tracked as [`zpa-58`](../_meta/clarifications.md#zpa-58-zpa-public-tier-specific-behavior-scale-safe-mode).)
- **Public-tier policy-caching / CA-reconnect semantics.** The Private-SE page states a Service Edge "registers with the Private Access Cloud … download[s] the relevant policies and configurations … also caches path selection decisions" (`about-private-service-edges.md:12`), but does not specify cache-invalidation, heartbeat cadence, or any fail-open/fail-closed behavior for the ZPA Public tier. Left unstated rather than imported from ZIA. (Tracked as [`zpa-59`](../_meta/clarifications.md#zpa-59-zpa-public-tier-policy-caching-ca-reconnect-semantics).)
- **`upgrade_priority` semantics.** The Python `ServiceEdgeGroup` model exposes `upgrade_priority` (`models/service_edge_groups.py:63`) but no vendor source defines its allowed values or effect for the ZPA tier. (Tracked as [`zpa-60`](../_meta/clarifications.md#zpa-60-upgrade_priority-allowed-values-and-effect-for-the-zpa-service-edge-tier).)

---

## Cross-links

- ZPA Private Service Edges (customer-deployed broker tier — sizing, enrollment, HA, Terraform) — [`./private-service-edges.md`](./private-service-edges.md)
- Service Edge form factors and M-Tunnel architecture — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- App Connector (the other endpoint of the M-Tunnel) — [`./app-connector.md`](./app-connector.md)
- Policy precedence and session gating — [`./policy-precedence.md`](./policy-precedence.md)
- LSS access log schema (where Service Edge identity appears) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- ZIA edge products (Public Service Edge, Virtual Service Edge — different product) — [`../zia/private-service-edge.md`](../zia/private-service-edge.md)
- Trusted Networks — group ↔ Trusted Network binding — [`./trusted-networks.md`](./trusted-networks.md)
- SDK ServiceEdgeGroupAPI — [`./sdk.md`](./sdk.md)
