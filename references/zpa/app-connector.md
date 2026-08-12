---
product: zpa
topic: "zpa-app-connector"
title: "ZPA App Connector — VM architecture, groups, provisioning keys, software updates"
content-type: reasoning
last-verified: "2026-07-22"
confidence: high
source-tier: mixed
verified-against:
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/terraform-aws-zpa-app-connector-modules: a866e4988f002d0b50dcc0db10c06e46db4bf0e7
  vendor/terraform-azurerm-zpa-app-connector-modules: a03b6651d45b80b774661b19acb8ae3954694aa5
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
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
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/app_connector_groups.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_app_connector_groups.py"
  - "vendor/terraform-provider-zpa/CHANGELOG.md"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go"
  - "vendor/terraform-provider-zpa/zpa/utils.go"
  - "vendor/terraform-aws-zpa-app-connector-modules/CHANGELOG.md"
  - "vendor/terraform-aws-zpa-app-connector-modules/README.md"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/main.tf"
  - "https://github.com/zscaler/terraform-aws-zpa-app-connector-modules/issues/52"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-sg-aws/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-iam-aws/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/main.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf"
  - "vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/main.tf"
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
  - "vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/app_connectors.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/lss.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/service_edges.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/lss.py"
  - "vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md"
  - "vendor/zscaler-mcp-server/commands/troubleshoot-connector.md"
  - "vendor/zscaler-help/app-connector-status-log-fields.md"
  - "vendor/zscaler-help/private-service-edge-status-log-fields.md"
  - "vendor/zscaler-help/private-cloud-controller-status-log-fields.md"
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md"
author-status: draft
---

# ZPA App Connector

The VM that sits at the application side of every ZPA traffic flow. Receives authenticated requests from the ZPA cloud, forwards them to the actual internal application server, and streams responses back. Outbound-only — never accepts inbound connections from the internet. Paired with the ZPA Service Edge on the cloud side; with ZCC on the user side; the three together form the end-to-end ZPA path.

Separate from ZCC's [Cloud Connector](../cloud-connector/overview.md), which is the workload-side VM for cloud workloads. See [`../cloud-connector/overview.md § Cloud Connector vs App Connector`](../cloud-connector/overview.md) for the comparison table. Both are outbound-only Zscaler VMs; they live on opposite sides of the ZPA flow.

## Summary

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/zscaler-help/understanding-connector-software-updates.md`; `vendor/zscaler-help/zpa-about-connector-groups.md`; `vendor/zscaler-help/understanding-private-access-architecture.md`.

- **Outbound-only** — does not require inbound firewall rules. This is the architectural property that makes ZPA safe to deploy against internal apps without exposing them to the internet.
- **Typically deployed in the DMZ** or on a network segment that can reach both the internal applications AND the ZPA cloud.
- **Always active in groups** — multiple App Connectors in the same group are all active simultaneously. No active/passive. ZPA picks the closest one per request based on user location + connector-to-app latency.
- **App Connectors never communicate with each other.** Each is independent, enrolled separately.
- **Two enrollment paths.** Provisioning-key enrollment uses a shared secret and results in a TLS client certificate; current AWS and Azure reference modules default to OAuth2 user-code enrollment and retain provisioning keys as a supported alternative.
- **Software updates are scheduled** at the group level with a 4-hour rolling window — one-at-a-time, not all at once, so the group stays available during upgrades.

## Mechanics

### Placement and scaling

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/understanding-private-access-architecture.md`; `vendor/terraform-aws-zpa-app-connector-modules/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md`.

From *About App Connectors* (`vendor/zscaler-help/about-app-connectors.md`) and *Understanding the Private Access Architecture*:

- Deploy in locations where internal applications reside (data center, cloud VPC, branch office with on-prem apps), OR in any location with connectivity to the applications.
- **N+1 redundancy** recommended (N = enough to carry the app load, +1 for failover). Sizing is per-group; adding connectors to a group increases capacity.
- App Connectors advertise themselves to the closest Public/Private Service Edge; the ZPA cloud selects which connector to route each request to based on geo-proximity and app-to-connector latency measurements.

**Supported platforms** (per SDK `vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py` and *About App Connectors*):

- VM image distributions for major hypervisors.
- Package installer for supported Linux distributions.
- Cloud-provider reference deployments (AWS AMI, Azure VM, GCP image).

### App Connector Groups

Source: `vendor/zscaler-help/zpa-about-connector-groups.md`; `vendor/zscaler-help/understanding-connector-software-updates.md`; `vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf`; `vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf`.

App Connector Groups are the policy, upgrade, and capacity unit. Per *About App Connector Groups*:

- **Every App Connector belongs to exactly one group.** A provisioning key determines group assignment for the classic flow; the OAuth2 flow supplies connector `user_codes` to the target group with the `Connector` enrollment certificate.
- **ZPA Application Segments reference Server Groups, which reference App Connector Groups.** The indirection is intentional — the same App Connector Group can serve many segments.
- **Scheduled upgrade windows** apply at the group level (see below). The Terraform module defaults to `SUNDAY` at `66600` seconds (18:30 UTC) (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf:39-49`).
- **DNS query type** defaults to `IPV4_IPV6`; valid values are `IPV4_IPV6`, `IPV4`, `IPV6` (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf:72-85`).
- **Version profile defaults changed.** Both current reference modules default `override_version_profile` to `false`. Azure sends profile ID `0`; AWS sends `0` when override is disabled and resolves the tenant's `Default` profile only when override is enabled without an explicit ID. Existing configurations that relied on the older override-enabled defaults can show a plan diff after a module update. (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf`; `vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-app-connector-group/variables.tf`.)
- **SDK group and connector telemetry is richer than the older model.** Current Python models include group enrollment/private-cloud fields plus connector creation, broker-connect, enrollment, OS/Sarge upgrade, platform, and read-only/managed-state metadata. Treat these as observed runtime and version-track fields, not group membership or proof of health by themselves.
- **Ansible onboarding convenience:** the ZPA Ansible App Connector Group module can resolve the default enrollment certificate named `Connector` when `enrollment_cert_id` is omitted, and can verify OAuth `user_codes` after create/update. Treat the resolved enrollment certificate ID and user-code verification result as automation evidence; group creation alone is not proof that connectors enrolled successfully.
- **Terraform parity:** in provider v4.4.10, `enrollment_cert_id` is Optional+Computed and a nonempty `ResourceData` value is preserved; when it is missing/empty, the provider resolves the `Connector` certificate before both create and update. `user_codes` is independent: verification runs only for nonempty codes on create or changed/nonempty codes on update (`vendor/terraform-provider-zpa/CHANGELOG.md:3-12`; `vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:203-213,233-266,342-382`; `vendor/terraform-provider-zpa/zpa/utils.go:378-398`).
- **Latitude/longitude coordinates** on the group tell ZPA where the group is physically, for nearest-connector selection.
- **`city_country` is a normal optional input in the current modules.** The current AWS module no longer masks post-create changes with `ignore_changes`. Review a plan diff instead of automatically dismissing it as API-derived readback drift.
- **`-el8` version tracks** and `ip_anchor_type` enum fields surface in the SDK (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/`) — relevant when auditing group config.
- **Group editing from application-serving context** became available on July
  16, 2026: App Connector groups can be edited from the "Where are my apps being
  served from?" view to resolve unknown hosting or location details
  (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:79-82`).

Groups are the unit at which upgrades are orchestrated: when a new App Connector version is available, ZPA picks one connector in the group at random, upgrades it (restart + re-enroll), picks the next, and so on. The group stays available throughout because only one connector is down at a time.

### Provisioning Keys

Source: `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf`; `vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zpa-provisioning-key/variables.tf`.

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

**The #1 enrollment failure cause** (per MCP server's `troubleshoot-connector` skill): the provisioning key utilization count hitting its max. Symptoms: new App Connector instances fail to enroll; old ones keep working. Diagnostic: check the key's `Provisioning Key Utilization Count` against `Maximum # of App Connectors` for that key.

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

**App Connectors enroll two ways: provisioning key or OAuth2 user code.** Alongside the long-standing provisioning-key shared secret, ZPA App Connector Groups accept OAuth2 `user_codes` for enrollment. The current AWS and Azure Terraform reference modules expose `onboarding_method`, default it to `oauth`, and retain `provisioning_key` as the secondary path. AWS relays OAuth2 codes through SSM Parameter Store; Azure uses Key Vault with the VM's managed identity. Pick one method per deployment. Staying on, or returning to, provisioning-key onboarding is supported at the module level; this is not a one-way module migration.

#### SDK field shape and Python-vs-Go divergence

Source: `vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go`.

The provisioning-key object's field set diverges sharply between the two SDKs. The Python `ProvisioningKey` model reads a smaller set of attributes off the raw config than the Go struct defines. The Go struct adds many fields the Python model never reads.

| Wire key (json) | Python attr | Go field | Type (Go) | Python line | Go line |
|---|---|---|---|---|---|
| `id` | `id` | `ID` | string | `:30` | `:30` |
| `name` | `name` | `Name` | string | `:34` | `:35` |
| `creationTime` | `creation_time` | `CreationTime` | string | `:32` | `:27` |
| `modifiedTime` | `modified_time` | `ModifiedTime` | string | `:31` | `:34` |
| `modifiedBy` | `modified_by` | `ModifiedBy` | string | `:33` | `:33` |
| `enabled` | `enabled` | `Enabled` | bool | `:38` | `:28` |
| `usageCount` | `usage_count` | `UsageCount` | string | `:35` | `:40` |
| `maxUsage` | `max_usage` | `MaxUsage` | string | `:36` | `:32` |
| `zcomponentId` | `zcomponent_id` | `ZcomponentID` | string | `:37` | `:41` |
| `zcomponentName` | `zcomponent_name` | `ZcomponentName` | string | `:39` | `:42` |
| `provisioningKey` | `provisioning_key` | `ProvisioningKey` | string | `:40` | `:36` |
| `enrollmentCertId` | `enrollment_cert_id` | `EnrollmentCertID` | string | `:41` | `:37` |
| `enrollmentCertName` | `enrollment_cert_name` | `EnrollmentCertName` | string | `:42` | `:38` |
| `appConnectorGroupId` | — (absent) | `AppConnectorGroupID` | string | — | `:25` |
| `appConnectorGroupName` | — (absent) | `AppConnectorGroupName` | string | — | `:26` |
| `expirationInEpochSec` | — (absent) | `ExpirationInEpochSec` | string | — | `:29` |
| `ipAcl` | — (absent) | `IPACL` | []string | — | `:31` |
| `uiConfig` | — (absent) | `UIConfig` | string | — | `:39` |
| `associationType` | — (absent) | `AssociationType` | string | — | `:43` |
| `readOnly` | — (absent) | `ReadOnly` | bool | — | `:44` |
| `restrictionType` | — (absent) | `RestrictionType` | string | — | `:45` |
| `zscalerManaged` | — (absent) | `ZscalerManaged` | bool | — | `:46` |
| `microtenantId` | — (absent) | `MicroTenantID` | string | — | `:47` |
| `microtenantName` | — (absent) | `MicroTenantName` | string | — | `:48` |

Notes:

- **The provisioning key is returned in cleartext on GET.** The `provisioningKey` field appears in the GET/list response model and, unlike a write-only credential, is read back and stored to Terraform state (`Sensitive: true` masks logs, not the state file). This makes read access to provisioning keys equivalent to connector-enrollment capability — see [`../shared/secret-bearing-api-surfaces.md`](../shared/secret-bearing-api-surfaces.md) for the read-surface secret inventory and the least-privilege API-client exclusion list.
- The Python model defines only the first 13 fields (`vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:30-42`); fields like `appConnectorGroupId`/`appConnectorGroupName`, `expirationInEpochSec`, `ipAcl`, `uiConfig`, `associationType`, `readOnly`, `restrictionType`, `zscalerManaged`, and `microtenantId`/`microtenantName` are present only in the Go struct (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:25-48`). If you need those fields, read them via the Go SDK or the raw API response, not the Python model.
- MCP v0.15.0 removed its summary/detail output views for provisioning keys, LSS configurations, and Service Edges and now returns the full record supplied by the Python SDK model (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:111-214`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/lss.py:96-135`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/service_edges.py:90-160`). This removes MCP-side field trimming but cannot restore fields the Python SDK model never captured.
- **`maxUsage` is typed `string` in Go** (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:32`), but the Python model stores `max_usage` untyped from the raw config (`vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:36`) and the MCP create tool declares its `max_usage` parameter as `int` (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:45-64`, especially `:50`). Treat the wire type as string when round-tripping.
- **`usageCount` and `maxUsage` are both present in the Python model** (`vendor/zscaler-sdk-python/zscaler/zpa/models/provisioning_keys.py:35-36`), so "max usage reached" is detectable from the object as `usage_count == max_usage`. The exhaustion predicate is stated in the MCP troubleshooting skill: "`max_usage` vs current enrollment count -- if equal, no new enrollments can use this key" (`vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:122`). A sibling ZMS skill states the same condition as `>=` — "`usageCount >= maxUsage`" (`vendor/zscaler-mcp-server/skills/zms/troubleshoot-agent-deployment/SKILL.md:175`).

#### Association types — three in Go, two in Python

Source: `vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go`; `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py`.

The two SDKs disagree on how many association types exist for provisioning keys:

| Association type | Go SDK | Python SDK |
|---|---|---|
| `CONNECTOR_GRP` | yes (`:19`) | yes — mapped from `key_type == "connector"` (`:36-37`) |
| `SERVICE_EDGE_GRP` | yes (`:20`) | yes — mapped from `key_type == "service_edge"` (`:38-39`) |
| `NP_ASSISTANT_GRP` | yes (`:21`) | no path |

- Go enumerates all three in `ProvisioningKeyAssociationTypes` (`vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go:18-22`).
- Python's `simplify_key_type` maps only `connector` → `CONNECTOR_GRP` and `service_edge` → `SERVICE_EDGE_GRP`, and raises `ValueError("Unexpected key type.")` for anything else — there is no `NP_ASSISTANT_GRP` path in Python (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:36-41`).

This is wider than the TF-layer asymmetry already documented above (`./api.md § Read/write shape asymmetries`): the divergence here is in the SDK source itself, not just the Terraform validators.

#### Create payload and endpoints (Python SDK)

Source: `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py`.

On create, the Python SDK `add_provisioning_key` pops `name`/`max_usage` and sets a body of `{name, maxUsage, enrollmentCertId, zcomponentId}` — so `enrollment_cert_id` maps to the `enrollmentCertId` wire key and `component_id` maps to `zcomponentId` (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:312-319`).

All provisioning-key endpoints are keyed by the association-type segment derived from `key_type`:

| Operation | URL (under `/zpa/mgmtconfig/v1/admin/customers/{customerId}`) | Line |
|---|---|---|
| Base endpoint | `/zpa/mgmtconfig/v1/admin/customers/{customerId}` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:53` |
| List | `/associationType/{TYPE}/provisioningKey` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:112-115` |
| Get | `/associationType/{TYPE}/provisioningKey/{key_id}` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:174-177` |
| Create (POST) | `/associationType/{TYPE}/provisioningKey` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:302-305` |
| Update (PUT) | `/associationType/{TYPE}/provisioningKey/{key_id}` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:375-378` |
| Delete (DELETE) | `/associationType/{TYPE}/provisioningKey/{key_id}` | `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:441-444` |

`{TYPE}` is the output of `simplify_key_type(key_type)` — `CONNECTOR_GRP` or `SERVICE_EDGE_GRP` (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:36-41`).

#### Enrollment cert requirement by key type (client-side only)

Source: `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py`; `vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py`.

- The MCP create tool raises `ValueError("enrollment_cert_id is required for 'connector' key_type")` **only when `key_type == "connector"`**, leaving `service_edge` keys free to omit it (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:161-169`). The tool's own field annotation documents the parameter as "Enrollment certificate ID (required for 'connector')" (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:55-58`).
- This requirement is **enforced only client-side in the tool.** The SDK's `add_provisioning_key` treats `enrollment_cert_id` as a plain optional kwarg for both key types (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:314`). Whether the ZPA API itself rejects a connector key without a cert is not shown in source (see Open questions).

#### Missing-key handling and lookup-error gap

Source: `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py`.

The MCP delete tool performs an existence lookup before deletion. If the lookup returns either an error or no object, it reports success with `"Provisioning key {key_id} does not exist or was already deleted"` and does not call delete (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:225-244`). This makes a genuinely missing key a safe no-op, but it also treats **any lookup error** as successful absence, so authentication, transport, or service errors can be masked as "already deleted" — a tooling gap.

The tool docstring gives component deletion as an example of how a key might already be gone (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:225-230`), but no source states that group deletion *actively* auto-deletes the key (see Open questions). The Python group-delete signatures carry no cascade/force parameter — `delete_connector_group(group_id, microtenant_id)` (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:435`) and `delete_service_edge_group(group_id, microtenant_id)` (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py:320`).

#### Connector status field naming — `controlChannelStatus`, not `runtime_status`

Source: `vendor/zscaler-sdk-python/zscaler/zpa/models/app_connectors.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go`; `vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go`.

Both SDKs expose the connector control-connection field as **`controlChannelStatus`** — Python `control_channel_status` (`vendor/zscaler-sdk-python/zscaler/zpa/models/app_connectors.py:46`) and Go `ControlChannelStatus` (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:24`). Neither SDK model defines a field named `runtime_status`/`runtimeStatus`. Service Edges share this shape: the Python Service Edge model carries `control_channel_status`, `provisioning_key_id`, `service_edge_group_id`, and `enrollment_cert` (`vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py:47,68,70,72-74`), and the Go Service Edge controller uses only `ControlChannelStatus` (`vendor/zscaler-sdk-go/zscaler/zpa/services/serviceedgecontroller/zpa_service_edge_controller.go:23`).

The `runtime_status` name and the `ZPN_STATUS_*` enum table appear **only in MCP-server skill/command markdown**, not as SDK enum constants:

| `runtime_status` value | Meaning (per SKILL.md) | In SKILL.md | In command doc |
|---|---|---|---|
| `ZPN_STATUS_AUTHENTICATED` | Healthy, control connection established | yes (`:99`) | yes (`:30`) |
| `ZPN_STATUS_DISCONNECTED` | Lost connection to ZPA cloud | yes (`:100`) | yes (`:31`) |
| `ZPN_STATUS_NOT_ENROLLED` | Never enrolled or enrollment failed | yes (`:101`) | yes (`:32`) |
| `ZPN_STATUS_PENDING` | Enrollment in progress | yes (`:102`) | no |

- The full four-value table is in `vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:99-102`.
- The `troubleshoot-connector` command doc lists only `AUTHENTICATED`/`DISCONNECTED`/`NOT_ENROLLED` and omits `PENDING` (`vendor/zscaler-mcp-server/commands/troubleshoot-connector.md:28-32`).
- `ZPN_STATUS_NOT_ENROLLED` is the enrollment-failure status; the SKILL.md remediation lists it under "Enrollment Failure" with provisioning-key, DNS, and connectivity causes (`vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:195-209`).

**The LSS `SessionStatus` codes are a distinct family.** The App Connector status log `SessionStatus` field defines a three-value set — `ZPN_STATUS_AUTHENTICATED`, `ZPN_STATUS_AUTH_FAILED`, `ZPN_STATUS_DISCONNECTED` (`vendor/zscaler-help/app-connector-status-log-fields.md:16`) — and the same trio is defined for Private Service Edge status logs (`vendor/zscaler-help/private-service-edge-status-log-fields.md:16`) and Private Cloud Controller status logs (`vendor/zscaler-help/private-cloud-controller-status-log-fields.md:16`). `ZPN_STATUS_AUTH_FAILED` ("failed to authenticate") appears in the LSS `SessionStatus` set but not in the connector `runtime_status` enum, confirming the two sets are different families. The MCP LSS tool exposes the dynamically fetched `get_status_codes` result as an LSS session-status catalog (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/lss.py:178-192`). The SDK fetches LSS status codes dynamically from the API at runtime rather than hardcoding them (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:609`).

#### Deleting a Service Edge requires re-enrollment

Source: `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/service_edges.py`.

Deleting a Service Edge is destructive, and the edge must be re-provisioned to reconnect (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/service_edges.py:171-202`).

### Reference deployment examples

Source: `vendor/terraform-aws-zpa-app-connector-modules/README.md`; `vendor/terraform-aws-zpa-app-connector-modules/examples/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/examples/README.md`; `vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf`; `vendor/terraform-azurerm-zpa-app-connector-modules/modules/terraform-zsac-acvm-azure/variables.tf`.

Zscaler publishes reference Terraform configurations in two vendor-maintained repositories. As of module versions AWS v1.4.0 / Azure v1.1.0, all App Connectors are deployed on RHEL 9 (`vendor/terraform-aws-zpa-app-connector-modules/README.md:66`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md:19`).

**AWS examples** (`vendor/terraform-aws-zpa-app-connector-modules/examples/`):

| Example | Type | Description |
|---|---|---|
| `base` | Greenfield | VPC + NAT gateway + bastion host — networking foundation only, no App Connectors |
| `base_ac` | Greenfield | `base` + 2 standalone App Connectors (1 per AZ); default `m5.large` (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-acvm-aws/variables.tf:37`), `ac_count=1` per module call |
| `base_ac_asg` | Greenfield | `base` + Auto Scaling Group; defaults: `min_size=2`, `max_size=4`, target CPU 50% (`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/variables.tf:113-184`) |
| `ac` | Brownfield | 2 standalone App Connectors deployed into existing VPC/subnets |
| `ac_asg` | Brownfield | ASG-based App Connectors deployed into existing infrastructure |

**AWS v2.0.1 ASG launch-template rotation boundary.**

At the pinned AWS module version 2.0.1, the App Connector Auto Scaling Group
references a launch template but declares no `instance_refresh` block
(`vendor/terraform-aws-zpa-app-connector-modules/modules/terraform-zsac-asg-aws/main.tf:65-76`;
`:101-104`). Upstream issue
[#52](https://github.com/zscaler/terraform-aws-zpa-app-connector-modules/issues/52)
reports that changing user data / the launch template and running
`terraform apply` updates configuration without automatically replacing the
existing ASG instances. The issue proposes a rolling `instance_refresh`, but
that proposal is not present at this pin.

For v2.0.1 deployments, do not assume a successful apply has put changed user
data onto already-running App Connectors. Include a separately planned and
verified ASG instance rotation when the launch template change must reach the
fleet, and re-check this caveat when upgrading the module.

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

### Remote network inspection and settings

The July 13, 2026 release added a **Get Network Interfaces** command that
collects the network-interface inventory used by an App Connector
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:90-93`). The same
release introduced limited-availability remote App Connector network settings
that can enable SSH on the operating system and update software-interface
settings on ZPA virtual machines in AWS, Azure, and GCP
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:94-96`).

### Software updates

Source: `vendor/zscaler-help/understanding-connector-software-updates.md`; `vendor/zscaler-help/zpa-about-connector-groups.md`.

From *Understanding App Connector Software Updates*:

- Scheduled at the App Connector Group level. Admin specifies day + time.
- **4-hour rolling window.** Within the window, ZPA picks one connector, upgrades it (restart + reconnect), then picks the next, and so on. Continues until the window expires or all connectors in the group are updated.
- **Unsuccessful updates retry on the next scheduled window.** Until every connector in the group is on the target version.
- **Starting with App Connector version 24.650.4+**, a version check and automated upgrade runs on initial connection — so freshly-deployed connectors may self-upgrade at first boot before the scheduled window.

Current release artifacts span both images and Manager RPMs, but they are
separate release entries with different scopes:

- The July 23 release supplies updated RHEL 9 App Connector images for AWS, GCP,
  and Azure, plus App Connector images for Nutanix AHV and VMware. It also moves
  the App Connector Docker image to high ciphers for `microdnf` calls, and says
  the image set includes a 4 GB boot partition for seamless OS updates
  (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:37-50`).
- The August 4 release identifies Manager software version `26.56.1` and App
  Connector RPM packages for RHEL 8.x and 9.x, downloadable from the Zscaler
  repository
  (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:12-23`). That
  entry is RPM-specific and does not establish a new Docker, VM, hypervisor, or
  cloud-marketplace image (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:25-28`).

**Update statuses** (visible in the App Connector list):

| Status | Meaning |
|---|---|
| `Scheduled` | Connector is in queue for its next periodic update window. Hover shows `Scheduled Version` + 4-hour window. |
| `Success` | Connector is on the target version. |
| `Failure` | Update attempted and failed. Zscaler recommends restarting the VM to recover. Update retries next window. |

**OS updates are the customer's responsibility**, not Zscaler's. App Connector software is designed to be compatible with host-OS updates, but Zscaler doesn't patch the underlying kernel/distribution — the organization does. A long-running VM with un-patched OS is a common audit finding.

**Zscaler Support may manually update connectors** if the currently-running software has a known issue. Support notifies the tenant's ZPA admins beforehand.

### Certificate enrollment and trust

Source: `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/zscaler-help/understanding-private-access-architecture.md`.

From *Understanding the Private Access Architecture* (captured earlier, see [`../shared/cloud-architecture.md § Certificate and PKI model`](../shared/cloud-architecture.md)):

- App Connector generates a **TLS client certificate** during enrollment, signed by the tenant's ZPA CA.
- The certificate authenticates the App Connector to ZPA Service Edges on every subsequent connection.
- **Private keys never leave the App Connector VM** where they were generated — this is a structural security property.
- Zscaler root-signing keys live in an **offline, air-gapped signing environment**; no online CA for root.

### Health reporting and metrics

Source: `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`; `vendor/zscaler-help/about-app-connectors.md`.

App Connectors surface health metrics that the ZPA admin console displays and that streaming log fields (per `Understanding_App_Connector_Metrics_Log_Fields.txt`) carry. Relevant:

- **`CONNECTED` / `DISCONNECTED` / other runtime statuses** — visible per connector. The connector reports status via its M-Tunnel control channel to a Public/Private Service Edge; loss of that channel is what flips the status.
- **Active connections to Service Edges** — `ActiveConnectionsToPublicSE` / `ActiveConnectionsToPrivateSE` in App Connector Metrics indicate how many M-Tunnels the connector currently holds open to ZPA infrastructure. Zero active connections to either ⇒ connector is effectively offline regardless of VM uptime.
- **Per-segment target reachability** — driven by the segment's `health_reporting` setting (`NONE` / `ON_ACCESS` / `CONTINUOUS`). Surfaced in App Connector Metrics as `TargetCount` (configured) vs `AliveTargetCount` (currently reachable from this connector's network position). `AliveTargetCount < TargetCount` means some configured targets are not reachable from this connector right now.
- **Current software version vs target version** — version-lag indicator.
- **Certificate expiry** — cert validity window. Connectors don't auto-rotate certs; if a cert approaches expiry, re-enrollment is required.
- **VM-cloning fingerprint issue** — when a VM template is used to deploy multiple App Connectors without unique re-enrollment, all clones share a hardware fingerprint. ZPA detects the collision and disables all but one. The remedy is re-enrollment with unique fingerprints per clone. A suspected signal is a connector whose `last_upgrade_time` is significantly older than the group's peers.

### How sessions are assigned to App Connectors

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/zpa-about-connector-groups.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`.

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

Source: `vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py`; `vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go`; `vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_group.md`.

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

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/understanding-private-access-architecture.md`; `vendor/terraform-aws-zpa-app-connector-modules/README.md`; `vendor/terraform-azurerm-zpa-app-connector-modules/README.md`.

| Relationship | Details |
|---|---|
| **ZIA SSL Inspection's `zpa_app_segments` criterion** | Filters to Source-IP-Anchor-enabled segments; the App Connectors serving those segments are the termination point for SIPA traffic (see [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)). |
| **ZPA Application Segments** | Segment references a Server Group; Server Group references an App Connector Group. See [`./app-segments.md § Mechanics`](./app-segments.md). |
| **Cloud Connector** | Sibling outbound-only VM on the workload-side (AWS/Azure/GCP). Same general pattern, opposite side of flow. See [`../cloud-connector/overview.md`](../cloud-connector/overview.md). |
| **Microtenant sharing** | App Connectors can be associated with shared segments via Move / Share operations (Go-SDK-only). See [`./app-segments.md § Cross-microtenant Move and Share`](./app-segments.md). |
| **ZCC forwarding** | ZPA access flow: ZCC → ZPA Service Edge → App Connector → app server. The App Connector is the last hop before the real app; ZCC selects the segment client-side, ZPA Service Edge authenticates and routes to the chosen App Connector. |

## Common question shapes

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/zscaler-help/understanding-connector-software-updates.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`.

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

Source: `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/zscaler-help/understanding-connector-software-updates.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`.

- **4-hour upgrade window is not extendable.** Groups with too many connectors to finish in 4 hours get staggered across multiple nights. Pick upgrade nights carefully for large groups.
- **Upgraded connector re-enrollment is transparent** — the connector resumes service on the new version without a new provisioning key. The client-cert chain survives the upgrade.
- **"Scheduled" status locks the upgrade time** — once scheduled, the periodic-update time can't be changed for that specific connector (per help doc). Manual upgrades are still available.
- **Provisioning keys copied from the portal UI** can silently include trailing whitespace. Operators pasting the key into a deployment template should trim whitespace; the `notice:Login request failed - http status(401)` error in the error log is the giveaway.
- **Nearest-App-Connector selection** uses app-to-connector latency from Zscaler's continuous measurements, not static geography. A connector that's geographically far but has a fast link to the app can be preferred. Can be counter-intuitive for operators expecting pure geo-based routing.
- **App Connector VM sizing** depends on concurrent-user count, app throughput, and inspection feature set (Double Encryption, AppProtection add overhead). Zscaler publishes sizing guidance in their reference architecture PDFs; not captured in depth here.
Source: `vendor/zscaler-help/zpa-about-connector-groups.md`.

- **App Connector Group must associate with both a Server Group AND a provisioning key** to serve any traffic. A group with no Server Group association silently fails to route traffic — the admin console doesn't flag the partial config as invalid. The same applies to network reachability: only associate Connector Groups with applications the connectors can actually reach.

## Service Edge Group `service_edges` block — undocumented operational requirement

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`.

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

Source: `vendor/zscaler-help/about-log-streaming-service.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`.

ZPA's Log Streaming Service (LSS) is the equivalent of ZIA's NSS for Private Access logs, but with **stricter retransmit semantics** that catch operators off-guard:

- **Connectivity gap between Private Access and the App Connector** → LSS can retransmit at most **the last 15 minutes** of log data after restoration, and **delivery is not guaranteed**. The 15-minute window vs. ZIA NSS's 60-minute opt-in recovery is a 4× difference.
- **Connectivity gap between the App Connector and the SIEM** → no retransmit at all (audit logs are the exception). Logs generated during this gap are permanently lost from the SIEM stream.

Implication: a 30-minute App Connector outage = roughly 15 minutes of permanent ZPA log gap, even with retransmit configured. Operators familiar with NSS's 60-minute recovery often assume LSS matches; it doesn't.

See also [`../shared/nss-architecture.md § Surprises`](../shared/nss-architecture.md) where this is cross-referenced.

## Open questions

Source: `vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/about-connector-provisioning-keys.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`.

- **Exact App Connector-to-app latency probe cadence** — how frequently ZPA re-measures connector-to-app RTT. Not documented publicly; relevant for "our network path changed, how long until ZPA notices" questions. (Tracked as [`zpa-27`](../_meta/clarifications.md#zpa-27-app-connector-to-app-latency-probe-cadence).)
- **Certificate validity window** — exactly how long an App Connector cert is valid before re-enrollment is required. Not captured. (Tracked as [`zpa-28`](../_meta/clarifications.md#zpa-28-app-connector-certificate-validity-window-before-re-enrollment).)
- **Max connectors per group** — high limits but not explicitly enumerated. (Tracked as [`zpa-29`](../_meta/clarifications.md#zpa-29-maximum-app-connectors-per-group).)
- **Provisioning-key auto-delete on group delete — unverified.** No vendor source states that deleting an App Connector Group / Service Edge Group *actively* auto-deletes its provisioning keys. The only indirect evidence is the MCP delete tool's docstring, which gives component deletion as an example of why a key may already be absent (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:225-230`); the implementation itself cannot establish the cause and treats any lookup error as absence (`:234-244`). The Python group-delete signatures carry no cascade/force parameter (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:435`; `vendor/zscaler-sdk-python/zscaler/zpa/service_edge_group.py:320`). Treat auto-delete as inferred behavior, not source-stated. (Tracked as [`zpa-30`](../_meta/clarifications.md#zpa-30-provisioning-key-auto-delete-on-group-delete-api-behavior).)
- **`ZPN_STATUS_PENDING` as a real runtime status — unverified.** It appears only in the one SKILL.md status table (`vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:102`); it is absent from the `troubleshoot-connector` command doc (`vendor/zscaler-mcp-server/commands/troubleshoot-connector.md:30-32`), from all SDK source, and from the zscaler-help status-log-field docs. Its existence as a real ZPA runtime status is not confirmed beyond that single table. (Tracked as `zpa-20` in [`references/_meta/clarifications.md`](../_meta/clarifications.md#zpa-20-zpn_status_pending-as-a-real-runtime-status).)
- **Whether the ZPA API itself requires an enrollment cert for connector keys — unverified.** The `enrollment_cert_id`-required-for-`connector` rule is enforced only client-side in the MCP create tool (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/provisioning_key.py:161-169`); neither SDK's add/update path enforces or documents a per-key-type cert requirement, and the SDK treats it as a plain optional kwarg (`vendor/zscaler-sdk-python/zscaler/zpa/provisioning.py:314`). Whether the API rejects a connector key without a cert is not shown in source. (Tracked as [`zpa-31`](../_meta/clarifications.md#zpa-31-whether-the-zpa-api-requires-an-enrollment-cert-for-connector-type-provisioning-keys).)
- **Wire-level semantics distinguishing `ZPN_STATUS_NOT_ENROLLED` vs `ZPN_STATUS_PENDING` — unverified.** No source defines what `controlChannelStatus`/`runtime_status` value distinguishes these states at the API level; the meanings are prose in SKILL.md tables only (`vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:99-102`), not from a server enum. The full `ZPN_STATUS_*` enum cannot be enumerated from SDK source because LSS status codes are fetched dynamically at runtime (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:609`).

## Cross-links

- App Segments (reference App Connector Groups via Server Groups) — [`./app-segments.md`](./app-segments.md)
- Policy precedence (App Connector selection happens AFTER ZPA access policy evaluates) — [`./policy-precedence.md`](./policy-precedence.md)
- Cloud Connector (sibling outbound VM on the workload side) — [`../cloud-connector/overview.md`](../cloud-connector/overview.md)
- Source IP Anchoring (SIPA) (App Connector is the egress point for SIPA traffic) — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Cloud architecture / PKI model (certificates, outbound-only model) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
