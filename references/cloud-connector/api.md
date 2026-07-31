---
product: cloud-connector
topic: "cloud-connector-api"
title: "Cloud Connector API — SDKs + Terraform provider"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/cloud-branch-connector/configuring-cloud-provisioning-template"
  - "vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md"
  - "https://help.zscaler.com/legacy-apis/understanding-zscaler-cloud-branch-connector-api"
  - "vendor/zscaler-help/cbc-understanding-zscaler-cloud-branch-connector-api.md"
  - "vendor/zscaler-sdk-python/zscaler/__init__.py"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/activation.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/ip_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/discovery_service.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py"
  - "vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/v2_client_ratelimit_test.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipgroups/ipgroups.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go"
  - "vendor/terraform-provider-ztc/ztc/provider.go"
  - "vendor/terraform-provider-ztc/ztc/config.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_location_management.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_location_management.go"
author-status: draft
---

# Cloud Connector API surface

Source: `vendor/zscaler-help/cbc-understanding-zscaler-cloud-branch-connector-api.md`; `vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py`; `vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go`; `vendor/terraform-provider-ztc/ztc/provider.go`; `vendor/terraform-provider-ztc/ztc/config.go`.

How to manage Cloud Connector programmatically. Three programmatic paths exist:

1. **Python SDK** — module path `vendor/zscaler-sdk-python/zscaler/ztw/`. ZTW (Cloud Connector) is GA on the v1.x line; the current vendored SDK is **v1.9.33** (`vendor/zscaler-sdk-python/zscaler/__init__.py:32`). ZTW coverage was added incrementally starting at **v1.0.1 (April 22 2025)** when the `zcon` package was renamed `ztw` and the policy-management / policy-resources endpoints landed (`vendor/zscaler-sdk-python/CHANGELOG.md:2200`, PR #258 / PR #260 ZTW blocks at `:3261` and `:2461`), then refined through later 1.9.x releases. The `ZTWService` entry point exposes ~20 accessors (`vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py:47-219`): `account_details`, `activate`, `admin_roles`, `admin_users`, `ec_groups`, `location_management`, `location_template`, `api_keys`, `provisioning_url`, `forwarding_gateways`, `forwarding_rules`, `ip_destination_groups`, `ip_source_groups`, `ip_groups`, `nw_service_groups`, `nw_service`, `public_cloud_info`, `account_groups`, `discovery_service`, `workload_groups`.
2. **Go SDK** under package-level `ztw/services/*` functions — module path `vendor/zscaler-sdk-go/zscaler/ztw/`. Same product family, organized into dedicated service packages (`partner_integrations`, `policy_management`, `policyresources`, `provisioning`, `workload_groups`) that the Python SDK groups under flatter accessors.
3. **Terraform provider** with `ztc_*` resources — path `vendor/terraform-provider-ztc/ztc/`.

> **Not in v2.0.0.** The Python SDK's `2.0.0bN` beta (`vendor/zscaler-sdk-python/CHANGELOG.md:125`, "1.9.23 — Public Preview / Beta") is a ground-up OpenAPI-generated rewrite, but its beta product coverage is **ZIA, ZDX, ZIdentity only** — the CHANGELOG states plainly that "ZPA, ZCC, ZTW, ZTB, and ZWA remain on v1.x for now" (`:144`). So Cloud Connector automation runs on the v1.x GA SDK; v1.x "remains the recommended GA release." Do not pin ZTW work to v2.x expecting Cloud Connector support.

## Go SDK service surface

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/adminuserrolemgmt/adminroles/adminroles.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/ecgroup/ecgroup.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/dns_gateway/dns_gateway.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/networkservices/networkservices.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/provisioning_url/provisioning_url.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go`.

From the inspected Go ZTW service files:

Endpoint paths below are the SDK `*Endpoint` consts (Tier A), all under the `/ztw/api/v1` base.

| Service | Endpoint(s) | Purpose |
|---|---|---|
| `activation` | `/ecAdminActivateStatus` (+ `/activate`, `/forcedActivate`) | Apply pending configuration changes (same pattern as ZIA's activation gate). See § Activation. (`activation/activation.go:11-13`) |
| `activation_cli` | — | CLI-driven activation variant (separate `activation_cli` service package). |
| `adminuserrolemgmt` | — | Admin user and role RBAC for the Cloud Connector portal. |
| `ecgroup` | `/ecgroup` (+ `/lite`) | **Edge Connector Group** — the logical grouping of Cloud Connector VMs. Corresponds to "Cloud Connector Group" in the admin UI. See [`./overview.md § Cloud Connector Group`](./overview.md). (`ecgroup/ecgroup.go:16`) |
| `dns_gateway` | `/dnsGateways` (+ `/lite`) | DNS gateway CRUD — named DNS destinations used in rule forwarding. (`dns_gateway/dns_gateway.go:15`) |
| `forwarding_gateways` | `/gateways` (ZIA gw), `/dnsGateways` (DNS gw) | Forwarding gateway CRUD — named endpoint pairs (primary/secondary) for ZIA or DNS paths. (`forwarding_gateways/zia_forwarding_gateway/zia_forwarding_gateway.go:16`) |
| `locationmanagement` | `/location` (+ `/lite`), `/locationTemplate` | Location CRUD — deployment locations where Cloud Connectors run. Complementary to ZIA's location management. (`locationmanagement/location/location.go:15`) |
| `partner_integrations` | `/publicCloudInfo`, `/discoveryService/...`, `/accountGroups` | Workload discovery + cloud-account management. See § Partner integrations. (`partner_integrations/partner_integrations.go:13`, `72-82`) |
| `policy_management` | `/ecRules/ecRdr` (fwd), `/ecRules/ecDns` (DNS), `/ecRules/self` (log) | Traffic forwarding rules, DNS rules, traffic log rules. (`policy_management/forwarding_rules/forwarding_rules.go:17`) |
| `policyresources` | `/ipSourceGroups`, `/ipDestinationGroups`, `/ipGroups`, `/networkServices`, `/networkServiceGroups` | Policy resource objects (IP source/destination groups, IP pools, network services/groups). (`policyresources/ipgroups/ipgroups.go:15`, `policyresources/networkservices/networkservices.go:15`) |
| `provisioning` | `/provUrl`, `/apiKeys` (+ `/regenerate`), `/publicCloudAccountDetails` (+ `/lite`, status) | Cloud provisioning URLs for VM auto-enrollment, provisioning API keys, and public-cloud account-detail records (AWS account / Azure subscription). (`provisioning/provisioning_url/provisioning_url.go:16`, `provisioning/api_keys/provisioning.go:14-15`, `provisioning/public_cloud_account/public_cloud_account.go:13-15`) |
| `workload_groups` | `/workloadGroups` | Workload group **read-only** in the Go SDK (Get/GetByName/GetAll) — Create/Update/Delete are commented out in the Go source (`workload_groups.go:97-132`) and absent from the Python SDK. Tag-based workload abstractions for policy. (`workload_groups/workload_groups.go:13`) |
| `common` | — | Shared models. |

**Location `profile`-tag asymmetry vs ZIA.** ZTW/Cloud Connector location management exposes the same `profile` tag as ZIA (same field, same "defaults to `Unassigned`" semantics) but accepts a **narrower** value set: `NONE`, `CORPORATE`, `SERVER`, `GUESTWIFI`, `IOT` (`vendor/terraform-provider-ztc/ztc/resource_ztc_location_management.go:276-281`). ZIA additionally accepts `WORKLOAD` and `EXTRANET` (`vendor/terraform-provider-zia/zia/resource_zia_location_management.go:385-392`). So a Cloud Connector deployment location **cannot** be tagged `WORKLOAD` or `EXTRANET` — those two profile types are ZIA-only. Verified against both TF provider validators (Tier A).

**Go-SDK authentication status**: the Go ZTW client supports **both** auth paths. ZTW (Cloud Connector) is a first-class OneAPI/ZIdentity service — the unified client routes `ztw` to its own `ZTWHTTPClient` (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:372-373`) and rate limiter (`:207-208`) — *and* the legacy CBC/ZTC credential surface (`ZTC_USERNAME`, `ZTC_PASSWORD`, `ZTC_API_KEY`, `ZTC_CLOUD`, plus optional `ZSCALER_PARTNER_ID`) remains available. OneAPI is not offered for the `zscalergov`/`zscalerten` clouds. See `sdk.md` § Authentication and `api-divergences.md` for detail.

## Terraform provider resources

Source: `vendor/terraform-provider-ztc/ztc/provider.go`; `vendor/terraform-provider-ztc/ztc/config.go`; `vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go`; `vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_rule.md`; `vendor/terraform-provider-ztc/docs/data-sources/ztc_edge_connector_group.md`.

From the Terraform provider schema and generated docs:

Resources (manage state):

- `ztc_account_groups`
- `ztc_activation_status` — trigger activation as a Terraform apply step
- `ztc_dns_forwarding_gateway`
- `ztc_dns_gateway`
- `ztc_forwarding_gateway`
- `ztc_ip_destination_groups`
- `ztc_ip_pool_groups` — maps to the **IP pools** API (`/ipGroups`); SDK-backed in both SDKs (see note below)
- `ztc_ip_source_groups`
- `ztc_location_template`
- `ztc_network_services`
- `ztc_network_service_groups`
- `ztc_provisioning_url`
- `ztc_public_cloud_info`
- `ztc_traffic_forwarding_dns_rule`
- `ztc_traffic_forwarding_log_rule`
- `ztc_traffic_forwarding_rule`

Data sources (read-only lookups): parallel data sources exist for most of the above (`data_source_ztc_*`) for read-only lookups of existing resources. Plus data sources for `edge_connector_group`, `location_management`, `provisioning_url`, `supported_regions`, `public_cloud_info`, `workload_groups` that offer introspection without creation. Note: `ztc_location_management` is a **data source only** in the ZTC provider (`provider.go:DataSourcesMap`) — there is no `ztc_location_management` resource; location management records are read via this data source, not created/updated/deleted through Terraform.

**`ztc_ip_pool_groups` is fully SDK-backed** — it manages **IP pools** via the `/ipGroups` API ("Retrieves the list of IP pools", `vendor/zscaler-sdk-python/CHANGELOG.md:2461`). Both SDKs cover it: Python `client.ztw.ip_groups` hits `/ipGroups` (`vendor/zscaler-sdk-python/zscaler/ztw/ip_groups.py:72-74`), and Go uses `policyresources/ipgroups` against the full path `/ztw/api/v1/ipGroups` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipgroups/ipgroups.go:15`). So IP pools can be managed via Terraform, Python, or Go — not a TF-only abstraction.

## Provisioning workflow

Source: `vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md`.

From *Configuring a Cloud Provisioning Template*:

**Goal**: create a *cloud provisioning URL* that's used when deploying the Cloud Connector VM in a cloud provider. The URL carries tenant identity, group assignment, location, and VM-size configuration so the VM auto-enrolls on boot.

**Workflow:**

1. **Create a provisioning template** in the admin portal (`Infrastructure > Connectors > Cloud > Management > Provisioning`).
2. **Configure the template tabs:**
   - *General Information*: template name + description.
   - *Cloud Provider*: AWS / Azure / GCP.
   - *Location*: `Location Creation: Automatic` (auto-creates a location) + select a Location Template.
   - *Group Information*: `Cloud Connector Group Creation: Automatic` + VM Size (AWS: Small/Medium/Large; Azure: Small; GCP: Small) + Auto Scaling toggle.
3. **Save** — the admin portal generates a Cloud Provisioning URL.
4. **Use the URL in cloud-provider deployment** — CloudFormation (AWS), Azure Resource Manager, GCP deployment templates, or Zscaler's Terraform modules.

**Key constraint** (from the help article): "only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template." Mismatching template type to deployment mode breaks deployment. Two separate provisioning templates if a tenant runs both ASG and non-ASG deployments.

**Auto Scaling provisioning requires Zscaler Support** — enabling ASG/VMSS/MIG-autoscaling deployment isn't self-service; contact Support for entitlement.

## Activation

Source: `vendor/zscaler-help/automate-zscaler/getting-started.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-sdk-python/zscaler/ztw/activation.py`; `vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go`; `vendor/terraform-provider-ztc/ztc/resource_ztc_activation_status.go`.

Cloud Connector has an **activation gate** parallel to ZIA's (see [`../shared/activation.md`](../shared/activation.md) for the cross-product treatment). Config changes are pending until activated.

### Wire-format endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/ztw/api/v1/ecAdminActivateStatus` | Current activation status |
| PUT | `/ztw/api/v1/ecAdminActivateStatus/activate` | Apply pending config changes |
| PUT | `/ztw/api/v1/ecAdminActivateStatus/forcedActivate` | Force-activate when normal activation is blocked |

**`activate` vs `forcedActivate`:** The plain `activate` endpoint runs the normal activation flow — which can fail or be blocked (config validation errors, edit-lock conflicts). `forcedActivate` is the bypass — used when normal activation is stuck. **Treat forced activation as last resort**: it sidesteps validation that protects against pushing broken config to live. The fact that two endpoints exist is itself the signal that CBC's activation pipeline has an escape path that ordinary ZIA activation does not expose in the same way.

### Terraform / SDK equivalents

- Python SDK: `client.ztw.activate.get_status()` and `client.ztw.activate.activate(force=True|False)`.
- Go SDK: package-level `activation.GetActivationStatus`, `activation.UpdateActivationStatus`, and `activation.ForceActivationStatus`.
- Terraform: `ztc_activation_status` resource — runs activation during `terraform apply`.

**This is a ZIA-style pattern, not ZPA-style.** ZPA propagates on write; Cloud Connector stages and requires explicit activation. Match the pattern to the familiar ZIA model, not ZPA.

## Partner integrations (workload discovery)

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go`; `vendor/zscaler-sdk-python/zscaler/ztw/discovery_service.py`; `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py`; `vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py`.

The partner-integration surface is a full discovery / account-management API, SDK-backed in both SDKs (Tier A). It is the programmatic side of cloud workload discovery — see [`./aws-workload-discovery.md`](./aws-workload-discovery.md) for the AWS deployment treatment. `publicCloudInfo` records hold the per-account cloud identity (AWS account / Azure subscription / GCP project — see § Go SDK service surface, `partner_integrations`).

| Endpoint (path under `/ztw/api/v1`) | Purpose | Go | Python |
|---|---|---|---|
| `/publicCloudInfo` (+ `/lite`, `/{id}`, `/count`) | CRUD on registered cloud accounts (AWS/Azure/GCP) | `partner_integrations/public_cloud_info` (`public_cloud_info.go:14`) | `client.ztw.public_cloud_info` (`public_cloud_info.py:88-89`) |
| `/publicCloudInfo/supportedRegions` | List supported cloud regions | `GetSupportedRegions` (`partner_integrations.go:33-35`) | — |
| `/publicCloudInfo/cloudFormationTemplate` | Get the AWS CloudFormation template URL (optional `awsAccountId`) | `GetCloudFormationTemplateURL` (`partner_integrations.go:56-58`) | — |
| `/discoveryService/workloadDiscoverySettings` | Read discovery trust settings (`TrustedAccountId`, `TrustedRoleName`) | `GetWorkloadDiscoverySettings` (`partner_integrations.go:72-74`) | `client.ztw.discovery_service` (`discovery_service.py:50-51`) |
| `/discoveryService/{id}/permissions` | Set discovery permissions (`DiscoveryRole`, `ExternalID`) for an AWS account | `UpdateDiscoveryPermissions` (`partner_integrations.go:81-82`) | `discovery_service.py:90-91` |
| `/accountGroups` (+ `/lite`, `/{id}`, `/count`) | CRUD on account groups | `partner_integrations/account_groups` (`account_groups.go:14`) | `client.ztw.account_groups` (`account_groups.py:74-75`) |

The discovery model is AWS-centric in the cited source: trust is established via a Zscaler-owned AWS account (`TrustedAccountId`) and a trusted role (`TrustedRoleName`), with the customer side providing a `DiscoveryRole` + `ExternalID` (`partner_integrations.go:15-30`). The `publicCloudInfo` records themselves span AWS/Azure/GCP account identities, but the discovery-permission/CloudFormation flow in this capture is AWS-specific.

## Rate limiting

Source: `vendor/zscaler-sdk-go/zscaler/ztw/v2_client_ratelimit_test.go`; `vendor/zscaler-help/legacy-api-response-codes-and-error-messages.md`.

ZTW does **not** use ZIA's three-tier Heavy/Medium/Light weight model. The Go SDK's own ZTW rate-limiter test enforces a **two-bucket** model — reads in one bucket, all writes in another (`vendor/zscaler-sdk-go/zscaler/ztw/v2_client_ratelimit_test.go:111-140`):

| Bucket | Methods | Limit |
|---|---|---|
| Reads | GET | 20 per 10s |
| Writes | POST, PUT, DELETE | 10 per 10s |

Note DELETE is bucketed **with** POST/PUT (the test names the bucket "POST/PUT/DELETE", `:128`/`:140`), not in a separate "Heavy" tier as it is for ZIA. 429 response body shape:

```json
{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }
```

## Python automation

Source: `vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py`; `vendor/zscaler-sdk-python/zscaler/ztw/activation.py`; `vendor/zscaler-sdk-python/CHANGELOG.md`.

ZTW (Cloud Connector) is covered by the Python SDK's **v1.x GA line** (current `v1.9.33`, `vendor/zscaler-sdk-python/zscaler/__init__.py:32`). Coverage was added at **v1.0.1 (April 22 2025)** — the `zcon`→`ztw` rename plus the policy-management and policy-resources endpoint sets (`vendor/zscaler-sdk-python/CHANGELOG.md:2200`, ZTW endpoint blocks at `:2461`/`:3261`) — and extended through later 1.9.x releases (e.g. `provisioning_url` CRUD at 1.9.13, PR #450, `:348`). The full accessor list is in the § three-paths section above.

**Stay on v1.x for Cloud Connector.** The Python `2.0.0bN` beta does **not** include ZTW: "ZPA, ZCC, ZTW, ZTB, and ZWA remain on v1.x for now" (`vendor/zscaler-sdk-python/CHANGELOG.md:144`). v1.x is the recommended GA release; do not migrate ZTW automation to v2.x expecting Cloud Connector support.

## Common SDK patterns

Source: `vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py`; `vendor/zscaler-sdk-python/zscaler/ztw/activation.py`; `vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go`; `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go`.

The most-used call patterns inline. For full method signatures see the Python `ztw_service.py` accessors and the service modules they return. Use `client.ztw.*` for all Cloud Connector operations (note: `ztw` not `cbc` — see [`./overview.md`](./overview.md) on the five-name product family).

```python
from zscaler import ZscalerClient

client = ZscalerClient({...})  # ZTW resources via .ztw

# Pattern 1: list-and-paginate
def list_all(method, **kwargs):
    items, resp, err = method(**kwargs)
    if err: raise RuntimeError(f"{method.__qualname__}: {err}")
    out = list(items)
    while resp.has_next():
        more, resp, err = resp.next()
        if err: raise RuntimeError(f"pagination: {err}")
        out.extend(more)
    return out

ec_groups = list_all(client.ztw.ec_groups.list_groups)
fwd_rules = list_all(client.ztw.forwarding_rules.list_rules)
locations = list_all(client.ztw.location_management.list_locations)

# Pattern 2: activate (CBC has same staged-vs-live model as ZIA)
status, _, err = client.ztw.activate.get_status()
if err: raise RuntimeError(f"get_status: {err}")
if status.status == "PENDING":
    _, _, err = client.ztw.activate.activate()
    if err: raise RuntimeError(f"activate: {err}")
# See ../shared/activation.md for the full staged-vs-live treatment.

# Pattern 3: forcedActivate — last resort when standard activate is stuck
# CBC has a forcedActivate endpoint that ZIA doesn't have; treat it as escape hatch.
# Per ./api.md § Activation: forcedActivate sidesteps validation that protects
# against pushing broken config. Don't use it as a default; only when ./api.md
# § "activate vs forcedActivate" diagnostic flow says you need it.
# _, _, err = client.ztw.activate.activate(force=True)  # ← uncomment only if needed

# Pattern 4: error-handling wrapper
def call(method, *args, **kwargs):
    data, resp, err = method(*args, **kwargs)
    if err: raise RuntimeError(f"{method.__qualname__} failed: {err}")
    return data
```

For troubleshooting these patterns, see [`../_meta/runbooks.md § Troubleshooting flows`](../_meta/runbooks.md).

## Snapshotting Cloud Connector config

Source: `vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py`; `vendor/zscaler-sdk-python/zscaler/ztw/ec_groups.py`; `vendor/zscaler-sdk-python/zscaler/ztw/forwarding_rules.py`; `vendor/terraform-provider-ztc/ztc/provider.go`.

ZTW config reads are native Python on the v1.x GA SDK (current `v1.9.33`) via the `client.ztw.ec_groups` and `client.ztw.forwarding_rules` service accessors (`vendor/zscaler-sdk-python/zscaler/ztw/ztw_service.py:80`, `:133`). No Go SDK or Terraformer workaround is needed for snapshotting.

Alternative: use `terraform plan -out` against the `ztc` provider and parse the plan JSON for config state. Workable; not elegant.

## Open questions

Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go`; `vendor/zscaler-sdk-go/zscaler/ztw/v2_config.go`.

- **`adminuserrolemgmt` / `activation_cli` endpoint paths** — these two Go service packages weren't inspected for their `*Endpoint` consts in this pass (the rest of the § Go SDK service surface table now carries verified paths). Filed with the Azure/GCP-discovery and Go-ZIdentity questions as [clarification `cloud-connector-18`](../_meta/clarifications.md#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth).
- **Whether `publicCloudInfo` exposes discovery automation for Azure/GCP** — `publicCloudInfo` records carry AWS/Azure/GCP account identities, but the discovery-permission and CloudFormation-template flows in the current Go source (`partner_integrations.go:56-82`) are AWS-specific. No Azure/GCP equivalent of `cloudFormationTemplate` or `discoveryService/{id}/permissions` was found. See [clarification `cloud-connector-18`](../_meta/clarifications.md#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth).
- **Resolved: Go ZTW supports OneAPI/ZIdentity.** The unified Go client routes `ztw` to a dedicated OneAPI HTTP client (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:372-373`), so ZIdentity OAuth is a supported path alongside the legacy `ZTC_*` credentials (see § Go-SDK authentication status). Tracked in [clarification `cloud-connector-18`](../_meta/clarifications.md#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth).

## Cross-links

- Overview (what these APIs manage) — [`./overview.md`](./overview.md)
- Traffic forwarding (the main rule surface) — [`./forwarding.md`](./forwarding.md)
- Shared activation mechanics — [`../shared/activation.md`](../shared/activation.md)
- Shared cloud architecture (where Cloud Connector sits in the platform) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
