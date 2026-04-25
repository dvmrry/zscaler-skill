---
product: cloud-connector
topic: "cloud-connector-api"
title: "Cloud Connector API — Go SDK + Terraform provider"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "https://help.zscaler.com/cloud-branch-connector/configuring-cloud-provisioning-template"
  - "vendor/zscaler-help/cbc-configuring-cloud-provisioning-template.md"
  - "https://help.zscaler.com/legacy-apis/understanding-zscaler-cloud-branch-connector-api"
  - "vendor/zscaler-help/cbc-understanding-zscaler-cloud-branch-connector-api.md"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/"
  - "vendor/terraform-provider-ztc/ztc/"
author-status: draft
---

# Cloud Connector API surface

How to manage Cloud Connector programmatically. Three programmatic paths now exist:

1. **Python SDK** (added in v2.0.0, 2026-04-22) — module path `vendor/zscaler-sdk-python/zscaler/ztw/`. The Python SDK historically lacked ZTW coverage; the v2.0.0 release closed this gap. Service modules: `account_details`, `activation`, `admin_roles`, `admin_users`, `api_keys`, `ec_groups`, `forwarding_gateways`, `forwarding_rules`, `ip_destination_groups`, `ip_groups`, `ip_source_groups`, `location_management`, `location_template`, `nw_service`, `nw_service_groups`, `provisioning_url`, plus a `legacy` auth module and a `ztw_service` entry point.
2. **Go SDK** under `client.ztw.*` — module path `vendor/zscaler-sdk-go/zscaler/ztw/`. Slightly broader coverage than Python (still includes `partner_integrations`, `policy_management`, `policyresources`, `provisioning`, `workload_groups` as dedicated services that Python folds into broader modules).
3. **Terraform provider** with `ztc_*` resources — path `vendor/terraform-provider-ztc/ztc/`.

For automation that's been pinned to Python pre-v2.0.0, the historical workaround was direct HTTP via `requests` or shelling out to the Go-based Zscaler Terraformer. The v2.0.0 SDK supersedes those workarounds.

## Go SDK service surface

From `vendor/zscaler-sdk-go/zscaler/ztw/services/`:

| Service | Purpose |
|---|---|
| `activation` | Apply pending configuration changes (same pattern as ZIA's activation gate). |
| `activation_cli` | CLI-driven activation (likely an internal convenience). |
| `adminuserrolemgmt` | Admin user and role RBAC for the Cloud Connector portal. |
| `ecgroup` | **Edge Connector Group** — the logical grouping of Cloud Connector VMs. Corresponds to "Cloud Connector Group" in the admin UI. See [`./overview.md § Cloud Connector Group`](./overview.md). |
| `dns_gateway` | DNS gateway CRUD — named DNS destinations used in rule forwarding. |
| `forwarding_gateways` | Forwarding gateway CRUD — named endpoint pairs (primary/secondary) for ZIA or DNS paths. |
| `locationmanagement` | Location CRUD — deployment locations where Cloud Connectors run. Complementary to ZIA's location management. |
| `partner_integrations` | Partner integrations — includes AWS workload-discovery via CloudFormation templates. |
| `policy_management` | Traffic forwarding rules, DNS rules, traffic log rules. |
| `policyresources` | Policy resource objects (IP source groups, IP destination groups, network services). |
| `provisioning` | Provisioning URL, public cloud info (AWS account, Azure subscription, GCP project). |
| `workload_groups` | Workload group CRUD — tag-based workload abstractions for policy. |
| `common` | Shared models. |

**Go-SDK endpoint prefix**: cloud connector's API lives at the same OneAPI gateway as the rest of Zscaler; exact path prefix not captured here. Authentication follows the standard OneAPI OAuth 2.0 client-credentials flow via ZIdentity — same `ZSCALER_CLIENT_ID` / `ZSCALER_CLIENT_SECRET` / `ZSCALER_VANITY_DOMAIN` env vars.

## Terraform provider resources

From `vendor/terraform-provider-ztc/ztc/`:

Resources (manage state):

- `ztc_account_groups`
- `ztc_activation_status` — trigger activation as a Terraform apply step
- `ztc_dns_forwarding_gateway`
- `ztc_dns_gateway`
- `ztc_forwarding_gateway`
- `ztc_ip_destination_groups`
- `ztc_ip_pool_groups` — **TF-only** (no Go SDK equivalent surfaced in cross-SDK sweep)
- `ztc_ip_source_groups`
- `ztc_location_management`
- `ztc_location_template`
- `ztc_network_services`
- `ztc_network_services_groups`
- `ztc_provisioning_url`
- `ztc_public_cloud_info`
- `ztc_traffic_forwarding_dns_rule`
- `ztc_traffic_forwarding_rule`

Data sources (read-only lookups): parallel data sources exist for most of the above (`data_source_ztc_*`) for read-only lookups of existing resources. Plus data sources for `edge_connector_group`, `provisioning_url`, `supported_regions`, `public_cloud_info` that offer introspection without creation.

**TF-specific resource**: `ztc_ip_pool_groups` doesn't map to a Go SDK service. Appears to be a Terraform abstraction over a lower-level API. Fork teams modeling IP pools via TF can use this; doing the same in Go or direct HTTP requires checking for the underlying API manually.

## Provisioning workflow

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

Cloud Connector has an **activation gate** parallel to ZIA's (see [`../shared/activation.md`](../shared/activation.md) for the cross-product treatment). Config changes are pending until activated.

### Wire-format endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/ztw/api/v1/ecAdminActivateStatus` | Current activation status |
| POST | `/ztw/api/v1/ecAdminActivateStatus/activate` | Apply pending config changes |
| POST | `/ztw/api/v1/ecAdminActivateStatus/forceActivate` | Force-activate when normal activation is blocked |

**`activate` vs `forceActivate`:** The plain `activate` endpoint runs the normal activation flow — which can fail or be blocked (config validation errors, edit-lock conflicts). `forceActivate` is the bypass — used when normal activation is stuck. **Treat `forceActivate` as last resort**: it sidesteps validation that protects against pushing broken config to live. The fact that two endpoints exist (parallel to plain ZIA which has only `activate`) is itself the signal that CBC's activation pipeline is more failure-prone than ZIA's.

### Terraform / SDK equivalents

- Go SDK: `client.ztw.activation.*` (method names not inspected in detail; expect `Activate()` and likely `ForceActivate()`).
- Terraform: `ztc_activation_status` resource — runs activation during `terraform apply`.

**This is a ZIA-style pattern, not ZPA-style.** ZPA propagates on write; Cloud Connector stages and requires explicit activation. Match the pattern to the familiar ZIA model, not ZPA.

## Partner integrations

`ztw/services/partner_integrations/` exposes:

- **AWS workload discovery** via CloudFormation template. Zscaler provides a CloudFormation stack that tags AWS workloads for visibility; the discovery data feeds into Cloud Connector's policy decisions.

Scope of "partner integrations" beyond AWS discovery isn't captured in detail. Azure / GCP equivalents likely exist but weren't found in this pass.

## Rate limiting

CBC uses the **same weight-based rate-limit model as ZIA** — Heavy (DELETE) / Medium (POST, PUT) / Light (GET). See [`../shared/oneapi.md § Cloud & Branch Connector — same as ZIA weight model`](../shared/oneapi.md) for the table. 429 response body shape:

```json
{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }
```

## Python automation

**Python SDK coverage landed in v2.0.0 (2026-04-22)** with 17 ZTW service modules: `account_details`, `activation`, `admin_roles`, `admin_users`, `api_keys`, `ec_groups`, `forwarding_gateways`, `forwarding_rules`, `ip_destination_groups`, `ip_groups`, `ip_source_groups`, `location_management`, `location_template`, `nw_service`, `nw_service_groups`, `provisioning_url`, plus `ztw_service`. The Python SDK is now at parity with Go for the most-needed surfaces.

Fork teams on Python SDK versions ≤ v1.9.22 historically had to:

- Call the Cloud Connector API directly via `requests` / `httpx`, authenticating via OneAPI OAuth (auth flow same as ZIA/ZPA).
- Use Go-based tooling for Cloud Connector automation and Python for other products.

These workarounds are no longer required as of v2.0.0.

## Common SDK patterns

The most-used call patterns inline. For full method signatures see `vendor/zscaler-sdk-python/zscaler/ztw/`. Use `client.ztw.*` for all Cloud Connector operations (note: `ztw` not `cbc` — see [`./overview.md`](./overview.md) on the five-name product family).

```python
from zscaler import ZscalerClient

client = ZscalerClient({...})  # OneAPI; same client as ZIA/ZPA, ZTW resources via .ztw

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
status, _, err = client.ztw.activation.get_status()
if err: raise RuntimeError(f"get_status: {err}")
if status.status == "PENDING":
    _, _, err = client.ztw.activation.activate()
    if err: raise RuntimeError(f"activate: {err}")
# See ../shared/activation.md for the full staged-vs-live treatment.

# Pattern 3: forceActivate — last resort when standard activate is stuck
# CBC has a forceActivate endpoint that ZIA doesn't have; treat it as escape hatch.
# Per ./api.md § Activation: forceActivate sidesteps validation that protects
# against pushing broken config. Don't use it as a default; only when ./api.md
# § "activate vs forceActivate" diagnostic flow says you need it.
# _, _, err = client.ztw.activation.force_activate()  # ← uncomment only if needed

# Pattern 4: error-handling wrapper
def call(method, *args, **kwargs):
    data, resp, err = method(*args, **kwargs)
    if err: raise RuntimeError(f"{method.__qualname__} failed: {err}")
    return data
```

For troubleshooting these patterns, see [`../_runbooks.md § Troubleshooting flows`](../_runbooks.md).

## Snapshotting Cloud Connector config

`scripts/snapshot-refresh.py` doesn't include Cloud Connector yet. As of SDK v2.0.0, adding ZTW is now native Python — `client.ztw.ec_groups.list_groups()`, `client.ztw.forwarding_rules.list_rules()`, etc. Pre-v2.0.0 the workaround was Go SDK or Zscaler Terraformer CLI; that workaround is no longer required.

Alternative: use `terraform plan -out` against the `ztc` provider and parse the plan JSON for config state. Workable; not elegant.

## Open questions

- **Exact endpoint paths for each `client.ztw.*` service** — not inspected line-by-line in this pass.
- **Rate limit specifics** — the rate-limits article exists but isn't captured.
- ~~**Python SDK timeline**~~ — **Resolved 2026-04-22**: Python SDK v2.0.0 landed full ZTW coverage (17 service modules). Pre-v2.0.0 the gap was real; current pinned submodule version has parity with Go.
- **Partner integrations beyond AWS** — Azure / GCP discovery integrations likely exist; not documented here.
- **`ztc_ip_pool_groups` underlying API** — TF resource exists without Go SDK equivalent; the wire format underneath is unclear.

## Cross-links

- Overview (what these APIs manage) — [`./overview.md`](./overview.md)
- Traffic forwarding (the main rule surface) — [`./forwarding.md`](./forwarding.md)
- Shared activation mechanics — [`../shared/activation.md`](../shared/activation.md)
- Shared cloud architecture (where Cloud Connector sits in the platform) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
