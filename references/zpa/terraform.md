---
product: zpa
topic: "zpa-terraform"
title: "ZPA Terraform provider — resource catalog"
content-type: reference
last-verified: "2026-07-22"
verified-against:
  vendor/terraform-provider-zpa: 5326dc43ff3c006369864de337d80b693574ca88
confidence: medium
source-tier: code
sources:
  - "vendor/terraform-provider-zpa/docs/index.md"
  - "vendor/terraform-provider-zpa/README.md"
  - "vendor/terraform-provider-zpa/docs/guides/release-notes.md"
  - "vendor/terraform-provider-zpa/CHANGELOG.md"
  - "vendor/terraform-provider-zpa/go.mod"
  - "vendor/terraform-provider-zpa/zpa/provider.go"
  - "vendor/terraform-provider-zpa/zpa/config.go"
  - "vendor/terraform-provider-zpa/zpa/provider_skip_credentials_test.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_portal_access_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go"
  - "vendor/terraform-provider-zpa/zpa/utils.go"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_browser_access.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_inspection.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_pra.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_multimatch_bulk.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_weightedlb_config.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_server.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_segment_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_server_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_assistant_schedule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_provisioning_key.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_assistant_schedule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_ba_certificate.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_microtenant_controller.md"
  # LSS: 10 doc files (1 zpa_lss_config_controller resource + 9 usage-example aliases)
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_connector_metrics.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_connector_status.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_protection.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_private_service_edge_status.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_private_service_metrics.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_web_browser.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_activity.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_status.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_lss_config_log_type_formats.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_pra_approval_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_pra_console_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_pra_credential_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_pra_credential_pool.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_pra_portal_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_inspection_profile.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_inspection_custom_controls.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_banner.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_certificate.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_external_profile.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md"
  - "vendor/terraform-provider-zpa/zpa/common.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_v2.go"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_application_segment.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_browser_access.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_posture_profile.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_risk_factor.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_saml.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_attribute.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_trusted_networks.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_reorder.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_timeout_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_timeout_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_capabilities_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_credential_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_browser_protection_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_portal_access_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_redirection_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_emergency_access_user.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_private_cloud.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_c2c_ip_ranges.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_zia_cloud_config.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_aup.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_controller.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_link.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_tag_namespace.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_tag_key.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_tag_group.md"
author-status: draft
---

# ZPA Terraform provider — resource catalog

Complete listing of every Terraform resource and data source in the `zscaler/zpa` provider, grouped by functional area. Derived from provider doc files in `vendor/terraform-provider-zpa/docs/`. Policy v1/v2 API distinctions, gotchas, and known open questions are noted throughout.

> **For HCL authoring guidance** — best practices, decision tables, anti-patterns, CI/CD with the activation step, secret hygiene — see Zscaler's official skill bundle, vendored at [`vendor/zscaler-terraform-skills/skills/zpa-skill/`](../../vendor/zscaler-terraform-skills/skills/zpa-skill/) (upstream: `zscaler/zscaler-terraform-skills`, MIT). This doc covers the resource catalog and provider internals; their skill covers how to *write* HCL against the catalog.

---

## Provider overview

### Provider v4.4.11 configuration behavior

`skip_credentials_validation` is an optional provider attribute for plans and
applies where every `zpa_*` resource and data source is conditionally disabled
(for example, `count = 0`). It can also be set with
`ZSCALER_SKIP_CREDENTIALS_VALIDATION`
(`vendor/terraform-provider-zpa/zpa/provider.go:104-112`). This is an inert
client mode, not a validation-only switch: because the OneAPI SDK authenticates
inside its constructor, the provider does not initialize an SDK client, returns
an inert client with a configure-time warning, and leaves `Service` nil
(`vendor/terraform-provider-zpa/zpa/provider.go:337-356`;
`vendor/terraform-provider-zpa/zpa/config.go:40-46`). Any resource or data
source that still attempts an API call, including an import, returns a
descriptive provider error; the provider wraps all CRUD and import handlers for
this purpose (`vendor/terraform-provider-zpa/zpa/provider.go:294-302,372-423`).
These are Terraform-provider lifecycle semantics, not a claim about ZPA API
availability or backend behavior. Remove the setting and provide valid
credentials before enabling any ZPA object in that configuration.

There is a provider-side precedence bug when both configuration sources are
present. `config.go` reads the explicit value with `d.GetOk` and falls back to
the environment variable when `ok` is false
(`vendor/terraform-provider-zpa/zpa/config.go:100-104`). In Terraform Plugin
SDK v2.40.1, `GetOk` treats the boolean zero value `false` as not set, whereas
`GetOkExists` checks presence (`github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema/resource_data.go@v2.40.1:190-222`; the provider pins that SDK in `vendor/terraform-provider-zpa/go.mod:12-14`).
Therefore `skip_credentials_validation = false` does not override
`ZSCALER_SKIP_CREDENTIALS_VALIDATION=true`; the environment value enables the
inert mode. The current focused tests cover explicit `true`, environment
`true`, and missing credentials, but not this false-plus-environment case
(`vendor/terraform-provider-zpa/zpa/provider_skip_credentials_test.go:26-85`).
This is a Terraform-provider precedence defect; the true/env skip modes and
the inert-client CRUD/import guard above remain source behavior, not a claim
about backend validation.

The provider still accepts `parallelism` for compatibility, but it is deprecated
and ignored and is scheduled for removal in a future major release. The
provider documents rate-limit handling as automatic: it honors the `Retry-After`
header on a 429 response and retries transparently
(`vendor/terraform-provider-zpa/zpa/provider.go:140-146`). The release notes
also remove the older recommendation to limit individual policy resource types
to one concurrent request; Terraform's `-parallelism` flag applies to the
entire run rather than to a resource type
(`vendor/terraform-provider-zpa/docs/guides/release-notes.md:31-38`). This is
provider/tooling behavior and should not be read as a ZPA backend concurrency
contract.

Provider v4.4.10 extends the existing enrollment-certificate resolver to both
create and update for `zpa_app_connector_group`, `zpa_service_edge_group`, and
`zpa_private_cloud_group`. The release describes this as the provider remedy
for a reported `missing.mandatory.params` update failure when
`enrollment_cert_id` is empty in state
(`vendor/terraform-provider-zpa/CHANGELOG.md:3-12`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:233-245,342-347`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:281-289,385-390`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:184-192,270-275`).

For all three resources, `enrollment_cert_id` is `Optional` and `Computed`.
The shared resolver preserves any nonempty value already in Terraform
`ResourceData`; for a missing or empty value it looks up `Connector` for App Connector and
Private Cloud groups or `Service Edge` for Service Edge groups, rejects lookup
errors and empty IDs, and sets the resolved ID
(`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:203-208`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:251-256`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:154-159`;
`vendor/terraform-provider-zpa/zpa/utils.go:378-398`). Reads hydrate the field
from the backend response, and expansion sends the value currently held in
state (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:278-325,423-440`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:315-368,453-470`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:216-253,333-347`).

This lifecycle has three practical consequences. An explicit empty string
selects provider lookup/defaulting rather than clearing the certificate;
removing an explicit ID can retain the current computed value; and refresh
alone only reads backend state, so an empty legacy state is healed when an
update actually runs the resolver
(`vendor/terraform-provider-zpa/zpa/utils.go:383-398`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:269-365`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:313-404`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:216-290`).
Imports resolve the group ID or name and then rely on Read to hydrate state;
they do not invoke the enrollment-certificate resolver
(`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:20-52,269-325`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:21-53,313-368`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:18-50,216-253`).

`user_codes` is independent of certificate resolution: the resolver runs for
every create/update, while code verification runs only for nonempty codes on
create or for changed, nonempty codes on update
(`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:233-266,342-382`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:281-310,385-421`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:184-213,270-306`).
The historical v4.4.10 enrollment-certificate behavior above was reviewed
against the v4.4.10 dependency baseline. The current v4.4.11 provider compiles
`zscaler-sdk-go/v3` v3.8.47
(`vendor/terraform-provider-zpa/go.mod:5-15`); that dependency change does not
by itself add every SDK operation to the Terraform resource/data-source
surface, so use the catalog and provider source for Terraform coverage.

Provider v4.4.9 added the optional
`device_posture_failure_notification_enabled` field to both
`zpa_policy_access_rule` and `zpa_policy_access_rule_v2`; the provider carries
it through schema, read, and write paths
(`vendor/terraform-provider-zpa/CHANGELOG.md:14-24`;
`vendor/terraform-provider-zpa/zpa/common.go:594-598`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule.go:169,263`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_v2.go:71-75,320,420`).

Provider v4.4.8 added `JOIN_SESSION` and `CONTROL_SESSION` options to the
privileged capabilities supported by `zpa_policy_capabilities_rule`
(`vendor/terraform-provider-zpa/CHANGELOG.md:27-36`).

Provider v4.4.7 changed two operationally relevant surfaces. It added three
portal-access capability fields—`access_uninspected_file_sandbox`,
`upload_inspected_sandbox`, and `upload_inspected_scan`—and changed transient or
cancelled read failures for application segments, server groups, Service Edge
groups, and LSS configurations from provider panics into recoverable Terraform
errors (`vendor/terraform-provider-zpa/docs/guides/release-notes.md:53-66`;
`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_portal_access_rule.go:118-157`).

### Invocation

```hcl
terraform {
  required_providers {
    zpa = {
      source  = "zscaler/zpa"
      version = "~> 4.0.0"
    }
  }
}

provider "zpa" {
  # OneAPI (OAuth 2.0) — recommended
  client_id      = var.client_id
  client_secret  = var.client_secret
  vanity_domain  = "acme"
  customer_id    = var.customer_id
}
```

### Authentication frameworks

The provider supports two mutually exclusive auth frameworks. The framework is selected by the presence or absence of `use_legacy_client = true`.

**OneAPI (OAuth 2.0, recommended)**

| Attribute | Env var | Notes |
|---|---|---|
| `client_id` | `ZSCALER_CLIENT_ID` | OAuth client from ZIdentity |
| `client_secret` | `ZSCALER_CLIENT_SECRET` | Sensitive; use env var or secret store |
| `private_key` | `ZSCALER_PRIVATE_KEY` | Alternative to `client_secret` |
| `vanity_domain` | `ZSCALER_VANITY_DOMAIN` | Customer-specific vanity subdomain |
| `zscaler_cloud` | `ZSCALER_CLOUD` | Optional for production commercial clouds; use `gov` or `govus` for FedRAMP OneAPI |
| `customer_id` | `ZPA_CUSTOMER_ID` | ZPA customer ID (tenant-level) |

FedRAMP OneAPI requires ZPA provider v4.4.6 or later and
`zscaler_cloud = "gov"` or `"govus"` (equivalently,
`ZSCALER_CLOUD=gov|govus`). The provider documents these environments as
dedicated ZIdentity and API-gateway paths
(`vendor/terraform-provider-zpa/docs/index.md:100-105,118-133`). Provider
routing support does not by itself prove that a particular government tenant
is entitled or has a ZIdentity API client configured.

**Legacy (ZPA-native credentials)**

Add `use_legacy_client = true` to the provider block for pre-ZIdentity tenants.
For FedRAMP government clouds, also use the legacy path when the provider is
older than v4.4.6; commercial OneAPI support dates to v4.0.0. The legacy client
continues to use the uppercase `GOV` / `GOVUS` `zpa_cloud` values
(`vendor/terraform-provider-zpa/docs/index.md:30-34,110-127,178-182,214-218`).

| Attribute | Env var |
|---|---|
| `zpa_client_id` | `ZPA_CLIENT_ID` |
| `zpa_client_secret` | `ZPA_CLIENT_SECRET` |
| `zpa_customer_id` | `ZPA_CUSTOMER_ID` |
| `zpa_cloud` | `ZPA_CLOUD` |

### Microtenant support

Any resource that supports `microtenant_id` (optional string attribute) can be scoped to a child microtenant. The env var `ZPA_MICROTENANT_ID` sets the default for all resources in the run. Microtenant functionality requires a separate Zscaler license.

---

## Resource catalog

Resources are grouped by functional area. The dependency chain for most ZPA objects runs:

```
segment_group
  └── application_segment (references segment_group + server_group)
        └── server_group (references app_connector_group)
              └── app_connector_group
```

Policy rules reference application segments and segment groups. PRA adds its own credential/pool/portal/console chain above the policy layer.

---

### Application segments

#### `zpa_application_segment`

Standard application segment. The primary object used to publish internal applications.

**Required:** `name`, `domain_names` (list), `server_groups.id` (set of server group IDs), `segment_group_id`, TCP or UDP port ranges (`tcp_port_ranges` / `udp_port_ranges` or the newer `tcp_port_range` / `udp_port_range` blocks).

**Key optional fields:**

| Field | Values / notes |
|---|---|
| `bypass_type` | `ALWAYS`, `NEVER`, `ON_NET` |
| `health_reporting` | `NONE`, `ON_ACCESS`, `CONTINUOUS` |
| `match_style` | `INCLUSIVE` (any) or `EXCLUSIVE` (one-to-one multimatch) |
| `zpn_er_id` | Extranet resource partner ID |
| `icmp_access_type` | ICMP passthrough option |
| `ip_anchored` | Boolean; pins traffic to specific connector |
| `microtenant_id` | Microtenant scoping |

**Gotchas:**
- Port ranges must be globally unique across all segments in the tenant. Duplicate domain + port combinations are rejected at plan-time by the API.
- Removing TCP/UDP port ranges requires explicitly setting the attribute to an empty list; omitting it does not clear existing ports.
- `tcp_port_ranges` (flat list of `"from"/"to"` pairs) is the older form; `tcp_port_range` blocks are preferred in provider v3+.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment.md`.

---

#### `zpa_application_segment_browser_access`

Extends a standard segment with clientless (browser-based) access via a reverse-proxy URL. Inherits all fields from `zpa_application_segment` and adds:

**Required additional block — `clientless_apps`:**

| Field | Notes |
|---|---|
| `name` | Display name for the clientless app entry |
| `application_protocol` | `HTTP` or `HTTPS` |
| `application_port` | Port number (string) |
| `domain` | Must also appear in the segment's `domain_names` list |
| `ext_label` | External label used to build the access URL |
| `ext_domain` | External domain for the URL |
| `certificate_id` | Optional; omit to use Zscaler-managed certificate |

**Gotchas:**
- `domain` in each `clientless_apps` block must appear in the parent segment's `domain_names`.
- Removing TCP/UDP ports requires an explicit empty assignment, not omission.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_browser_access.md`.

---

#### `zpa_application_segment_inspection`

Segment that routes traffic through AppProtection (inline inspection). Inherits standard segment fields and adds:

**Required additional block — `common_apps_dto.apps_config`:**

| Field | Value |
|---|---|
| `app_types` | `["INSPECT"]` (literal) |
| `application_protocol` | `HTTP` or `HTTPS` |
| `application_port` | Port |
| `domain` | Must appear in `domain_names` |
| `certificate_id` | Required when `application_protocol = HTTPS`; NOT supported for HTTP |

**Gotchas:**
- `certificate_id` on `apps_config` is distinct from segment-level cert fields. Providing it for HTTP causes an API error.
- Domain/port values in `apps_config` must be consistent with the segment's own `domain_names` and port ranges.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_inspection.md`.

---

#### `zpa_application_segment_pra`

Privileged Remote Access segment. Enables RDP/SSH access via the PRA portal.

**Required additional block — `common_apps_dto.apps_config`:**

| Field | Value |
|---|---|
| `app_types` | `["SECURE_REMOTE_ACCESS"]` |
| `application_protocol` | `RDP` or `SSH` |
| `connection_security` | Required for RDP (`ANY`, `NLA`, `NLA_EXT`, `TLS`, `CLASSIC`). Must NOT be set for SSH. |

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_pra.md`.

---

#### `zpa_application_segment_multimatch_bulk`

Bulk setter for the multimatch (`match_style`) attribute across a list of existing segments. Not a full CRUD resource — it does not create segments.

**Required:** `application_ids` (list of segment IDs), `match_style` (`EXCLUSIVE` or `INCLUSIVE`).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_multimatch_bulk.md`.

---

#### `zpa_application_segment_weightedlb_config`

Configures weighted load balancing for a single application segment. Maps the segment to server groups with weights.

**Required:** `application_id` or `application_name` (one of the two; provider resolves ID from name automatically).

**Key block — `application_to_server_group_mappings`:**

| Field | Notes |
|---|---|
| `name` | Server group name |
| `weight` | Integer weight value |
| `passive` | Boolean; marks group as passive failover |

**Optional:** `weighted_load_balancing` (Boolean, enables the feature).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_weightedlb_config.md`.

---

### Application servers

#### `zpa_application_server`

Defines a static backend server (IP or FQDN). Only used when the server group has `dynamic_discovery = false`.

**Required:** `name`, `address` (IP or FQDN).

**Optional:** `app_server_group_ids` (list), `enabled`, `config_space` (`DEFAULT` or `SIEM`).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_application_server.md`.

---

### Server and segment groups

#### `zpa_segment_group`

Groups application segments for policy attachment and access control.

**Required:** `name`.

**Optional:** `description`, `enabled` (Boolean, default `true`).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_segment_group.md`.

---

#### `zpa_server_group`

Associates app connectors with backend servers. All application segments reference server groups.

**Required:** `name`, `app_connector_groups.id` (set of connector group IDs).

**Key optional fields:**

| Field | Notes |
|---|---|
| `dynamic_discovery` | Boolean. When `false`, `servers` block is required. |
| `servers` | Static server list; only valid when `dynamic_discovery = false` |
| `extranet_dto` | Block for extranet config; requires `extranet_enabled = true` |
| `microtenant_id` | Microtenant scoping |

**Gotchas:**
- `servers` block is mandatory when `dynamic_discovery = false`; omitting it causes a plan error.
- Extranet connectivity requires `extranet_enabled = true` at the group level before `extranet_dto` is applied.
- Destroying a Terraform-managed Server Group can create noisy App Segment update history. As of terraform-provider-zpa v4.4.4, upstream issue [zscaler/terraform-provider-zpa#658](https://github.com/zscaler/terraform-provider-zpa/issues/658) reports that `zpa_server_group` deletion updates every App Segment, not only segments that referenced the deleted group. Treat Server Group destroys as change-window operations and cross-check [`segment-server-groups.md`](./segment-server-groups.md) before relying on audit history during the same window.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_server_group.md`.

---

### App connectors

#### `zpa_app_connector_group`

Logical grouping of App Connectors deployed in a location or region.

**Required:** `name`, `enabled`, `latitude`, `longitude`, `location`, `city_country`, `country_code`.

**Key optional fields:**

| Field | Values / notes |
|---|---|
| `upgrade_day` | Day of week for auto-upgrade |
| `upgrade_time_in_secs` | Time within day (seconds from midnight) |
| `override_version_profile` | Boolean; enables version pinning |
| `version_profile_id` | `0` = Default, `1` = Previous, `2` = New Release |
| `version_profile_name` | Alternative to `version_profile_id` |
| `dns_query_type` | `IPV4`, `IPV6`, `IPV4_IPV6` |
| `tcp_quick_ack_app` | Boolean |
| `tcp_quick_ack_assistant` | Boolean |
| `tcp_quick_ack_read_assistant` | Boolean |
| `pra_enabled` | Boolean; must be `true` for PRA segments |
| `waf_disabled` | Boolean; disables WAF when `true` |
| `lss_app_connector_group` | Boolean; marks group for LSS metric collection |
| `enrollment_cert_id` | Optional+Computed; a nonempty value is preserved, while an omitted/empty value resolves the `Connector` enrollment certificate before create or update (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:203-208,233-245,342-347`) |
| `user_codes` | Optional set of VM user codes; verification is independent of certificate resolution and runs only for provided/nonempty codes on create or changed/nonempty codes on update (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:209-213,252-264,368-380`) |

**Gotchas:**
- `tcp_quick_ack_app`, `tcp_quick_ack_assistant`, and `tcp_quick_ack_read_assistant` must all be set to the same value. Setting them inconsistently produces an API error.
- `pra_enabled = true` is required before PRA segments can route through this group.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_group.md`.

---

#### `zpa_app_connector_assistant_schedule`

Configures the automated cleanup schedule for offline App Connector instances.

**Required:** `customer_id`, `frequency` (`"days"` — only valid value), `frequency_interval` (one of: `5`, `7`, `14`, `30`, `60`, `90`).

**Optional:** `enabled`, `delete_disabled`.

**Gotcha:** Import is not supported. This resource must be created fresh.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_assistant_schedule.md`.

---

### Service edges

#### `zpa_service_edge_group`

Logical grouping of Private Service Edges (PSEs) deployed in a location.

**Required:** `name`, `latitude`, `longitude`, `location`, `city_country`, `country_code`.

**Key optional fields:**

| Field | Notes |
|---|---|
| `is_public` | Boolean; exposes PSE to external clients |
| `grace_distance_enabled` | Boolean |
| `grace_distance_value` | Numeric distance |
| `grace_distance_value_unit` | `MILES` or `KMS` |
| `use_in_dr_mode` | Boolean; marks group for DR failover |
| `trusted_networks` | Block with `id` set for trusted network association |
| `service_edges` | Block — **deprecated, do not use for membership management** |
| `version_profile_id` | Same scheme as connector groups |
| `override_version_profile` | Boolean |
| `upgrade_day` / `upgrade_time_in_secs` | Auto-upgrade schedule |
| `enrollment_cert_id` | Optional+Computed; a nonempty value is preserved, while an omitted/empty value resolves the `Service Edge` enrollment certificate before create or update (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:251-256,281-289,385-390`) |
| `user_codes` | Optional set of PSE VM user codes; verification is independent of certificate resolution and runs only for provided/nonempty codes on create or changed/nonempty codes on update (`vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go:257-262,296-308,407-419`) |

**Gotcha:** The `service_edges` block within this resource is deprecated. Manage PSE membership via the PSE device enrollment workflow, not this attribute.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_group.md`.

---

#### `zpa_service_edge_assistant_schedule`

Same pattern as `zpa_app_connector_assistant_schedule` but for Service Edge cleanup. No import support.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_service_edge_assistant_schedule.md`.

---

### Provisioning and enrollment

#### `zpa_provisioning_key`

Generates enrollment tokens used to register App Connectors and Service Edges.

**Required:** `name`, `max_usage` (integer), `enrollment_cert_id`, `zcomponent_id` (ID of the group being provisioned), `association_type`.

**`association_type` values:** `CONNECTOR_GRP`, `SERVICE_EDGE_GRP`, `SITE_CONTROLLER_GRP`, `EXPORTER_GRP`, `NP_ASSISTANT_GRP`.

**Optional:** `enabled`, `ip_acl` (list of IP ranges allowed to use the key), `ui_config`.

**Read-only output:** `provisioning_key` (sensitive token string), `usage_count`.

**Gotcha:** `provisioning_key` is stored in Terraform state in plaintext. Use a secure remote backend (Vault, encrypted S3, Terraform Cloud with encryption) for any production deployment.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_provisioning_key.md`.

---

### Browser access certificates

#### `zpa_ba_certificate`

Uploads a TLS certificate for use with browser-access or PRA portal domains.

**Required:** `name`, `cert_blob` (PEM string — must concatenate private key and full certificate chain in one value, sensitive).

**Optional:** `description`.

**Gotcha:** No import support — certificates must be re-uploaded via Terraform if the state is lost. The `cert_blob` must include both the private key and the certificate/chain in a single PEM block.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_ba_certificate.md`.

---

### Microtenants

#### `zpa_microtenant_controller`

Creates a child microtenant within a parent ZPA tenant.

**Required:** `name`, `criteria_attribute` (`"AuthDomain"`), `criteria_attribute_values` (list of domain strings that identify users belonging to this microtenant).

**Optional:** `description`, `enabled`, `privileged_approvals_enabled`.

**Output attributes:** `user` block containing `microtenant_id`, `username`, `password` (all sensitive).

**Gotcha:** Microtenant creation requires a separate Zscaler license. Limited availability — contact Zscaler before using.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_microtenant_controller.md`.

---

### Log Streaming Service (LSS)

The ZPA provider exposes a single Terraform resource type for LSS regardless of the log stream type. The provider now ships ten LSS doc files (`zpa_lss_config_controller.md` plus nine usage-example aliases: `zpa_lss_app_connector_metrics.md`, `zpa_lss_app_connector_status.md`, `zpa_lss_app_protection.md`, `zpa_lss_audit_logs.md`, `zpa_lss_config_user_activity.md`, `zpa_lss_config_user_status.md`, `zpa_lss_private_service_edge_status.md`, `zpa_lss_private_service_metrics.md`, `zpa_lss_web_browser.md`), all of which configure the same `zpa_lss_config_controller` resource with different `source_log_type` values. The provider also exposes `zpa_lss_config_log_type_formats` as the source for valid log type metadata.

#### `zpa_lss_config_controller`

Streams ZPA log data to an external SIEM over TCP.

**Required block — `config`:**

| Field | Notes |
|---|---|
| `name` | Display name |
| `format` | `JSON`, `CSV`, or `TSV` |
| `lss_host` | Destination IP or FQDN |
| `lss_port` | Destination TCP port |
| `source_log_type` | See table below |

**Required:** `connector_groups.id` (set of App Connector Group IDs that forward the logs).

**Optional `config` fields:** `description`, `enabled`, `use_tls`, `filter` (list of status codes to include/exclude).

**Optional:** `policy_rule_resource` block — the User Activity (`zpn_trans_log`) and User Status (`zpn_auth_log`) example docs include one; it uses the same v2-style condition syntax as policy access rules, and its `action` must be `LOG`. (See Open questions for which other log types accept or require this block.)

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_activity.md:77`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_status.md:61`.

**`source_log_type` values** (the provider's log-type table maps each token to a display name; the same table appears verbatim in every LSS doc):

| Value | Display name | Demonstrating alias doc |
|---|---|---|
| `zpn_trans_log` | User Activity | `zpa_lss_config_user_activity.md` |
| `zpn_auth_log` | User Status | `zpa_lss_config_user_status.md` |
| `zpn_ast_auth_log` | App Connector Status | `zpa_lss_app_connector_status.md` |
| `zpn_http_trans_log` | Web Browser | `zpa_lss_web_browser.md` |
| `zpn_audit_log` | Audit Logs | `zpa_lss_audit_logs.md` |
| `zpn_sys_auth_log` | Private Service Edge Status | `zpa_lss_private_service_edge_status.md` |
| `zpn_ast_comprehensive_stats` | App Connector Metrics | `zpa_lss_app_connector_metrics.md` |
| `zpn_pbroker_comprehensive_stats` | Private Service Edge Metrics | `zpa_lss_private_service_metrics.md` |
| `zpn_waf_http_exchanges_log` | ZPA App Protection | `zpa_lss_app_protection.md` |

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_controller.md:88`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_protection.md:98`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_audit_logs.md:93`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_private_service_edge_status.md:96`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_private_service_metrics.md:97`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_connector_metrics.md:96`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_app_connector_status.md:93`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_activity.md:278`; `vendor/terraform-provider-zpa/docs/resources/zpa_lss_web_browser.md:92`; `vendor/terraform-provider-zpa/docs/data-sources/zpa_lss_config_log_type_formats.md`.

---

### Privileged Remote Access (PRA)

PRA objects must be created in order: credential (or pool) → portal → console → policy. PRA segments also require `pra_enabled = true` in the App Connector Group.

#### `zpa_pra_credential_controller`

Defines a single set of credentials injected by the PRA gateway.

**Required:** `name`, `domain`, `credential_type`, `user_domain`, `username`.

**`credential_type` values:** `USERNAME_PASSWORD`, `SSH_KEY`, `PASSWORD`.

**Gotcha:** `credential_type` and its dependent fields (`password`, `private_key`, etc.) are immutable after creation. To change the type, destroy and recreate the resource.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_pra_credential_controller.md`.

---

#### `zpa_pra_credential_pool`

Groups multiple credentials of the same type for rotation or load distribution.

**Required:** `name`, `domain`, `credential_type`, `credentials.id` (list of individual credential IDs).

**Gotcha:** `credential_type` is immutable after creation, same constraint as `zpa_pra_credential_controller`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_pra_credential_pool.md`.

---

#### `zpa_pra_portal_controller`

Hosts the PRA session endpoint that end users connect to.

**Required:** `name`, `domain`.

**Optional:** `certificate_id` (omit for Zscaler-managed cert), `description`, `enabled`, `user_notification`, `user_notification_enabled`, `ext_label`, `ext_domain`, `ext_domain_name`, `ext_domain_translation`, `user_portal_gid`, `approval_reviewers` (list of approver email addresses).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_pra_portal_controller.md`.

---

#### `zpa_pra_console_controller`

Configures a named PRA console that links a PRA application (from a segment's `apps_config`) to one or more PRA portals.

**Required:** `name`, `pra_application.id`, `pra_portals.id` (list).

**Gotcha:** `pra_application.id` is the ID of the `apps_config` entry within the segment's `common_apps_dto` — not the top-level segment ID. Retrieve it from the segment resource's output or data source.

**Optional:** `description`, `enabled`, `icon_text`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_pra_console_controller.md`.

---

#### `zpa_pra_approval_controller`

Creates a time-bounded privileged access approval for specific users.

**Required:** `email_ids` (list, but API accepts only one entry), `start_time` (RFC 3339), `end_time` (RFC 3339), `applications.id` (list of application IDs), `working_hours` block.

**`working_hours` block fields:** `days` (list, e.g., `["MON","TUE"]`), `start_time`, `start_time_cron`, `end_time`, `end_time_cron`, `timezone` (IANA tz name).

**Optional:** `status` — `INVALID`, `ACTIVE`, `FUTURE`, `EXPIRED` (read-only in practice; computed by API).

**Gotchas:**
- `start_time` cannot be more than one hour in the past at plan time.
- `end_time` cannot be more than 365 days in the future.
- Despite `email_ids` being a list type, the API only processes the first entry. Submit a single ID per resource.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_pra_approval_controller.md`.

---

### AppProtection (inline inspection)

#### `zpa_inspection_profile`

Defines an AppProtection inspection policy applied to AppProtection segments via `zpa_policy_inspection_rule`.

**Required:** `name`, `paranoia_level` (integer `1`-`4`; higher = more rules enforced), `predefined_controls` block for the preprocessors group (mandatory).

**Key optional fields:**

| Field | Notes |
|---|---|
| `custom_controls` | Block referencing `zpa_inspection_custom_controls` IDs |
| `web_socket_controls` | Controls applied to WebSocket traffic |
| `threat_labz_controls` | Zscaler Threat Intelligence controls |
| `global_control_actions` | Default action for unmatched traffic |
| `common_global_override_actions_config` | Map of control-ID to overridden action |
| `zs_defined_control_choice` | `ALL` or `SPECIFIC` |

**Gotcha:** The `predefined_controls` block for the preprocessors group must always be present. Removing it causes the profile to be rejected by the API.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_inspection_profile.md`.

---

#### `zpa_inspection_custom_controls`

Defines a custom WAF-like rule for inclusion in an inspection profile.

**Required:** `name`, `paranoia_level` (1-4), `severity` (`CRITICAL`, `ERROR`, `WARNING`, `INFO`), `type` (`REQUEST` or `RESPONSE`), `rules` block with `conditions` and `names`.

**Optional:** `default_action` (`PASS`, `BLOCK`, `REDIRECT`), `default_action_value` (redirect URL — only valid when `default_action = REDIRECT`).

**Gotcha:** Setting `default_action_value` when `default_action` is not `REDIRECT` produces an API validation error.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_inspection_custom_controls.md`.

---

### Cloud Browser Isolation (CBI)

CBI objects are built bottom-up: banner and certificate first, then the external profile that references both.

#### `zpa_cloud_browser_isolation_banner`

Customises the CBI session banner displayed to end users.

**Required:** `name`, `primary_color` (hex, e.g., `#0076BE`), `text_color` (hex), `notification_title`, `notification_text`, `logo` (base64-encoded PNG or JPEG, max 100 KB).

**Optional:** `banner` (Boolean), `persist` (Boolean), `is_default` (Boolean).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_banner.md`.

---

#### `zpa_cloud_browser_isolation_certificate`

Uploads a TLS certificate for CBI domain termination.

**Required:** `name`, `pem` (PEM certificate string).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_certificate.md`.

---

#### `zpa_cloud_browser_isolation_external_profile`

The top-level CBI profile that combines a banner, certificates, regions, and security controls.

**Required:** `name`, `banner_id` (from `zpa_cloud_browser_isolation_banner`).

**Key optional fields:**

| Field | Notes |
|---|---|
| `certificate_ids` | List of CBI certificate IDs |
| `region_ids` | List of CBI region IDs; at least 2 required for HA |
| `security_controls.copy_paste` | `none`, `all` |
| `security_controls.upload_download` | `none`, `all`, `upstream` |
| `security_controls.document_viewer` | Boolean |
| `security_controls.local_render` | Boolean |
| `security_controls.allow_printing` | Boolean |
| `security_controls.restrict_keystrokes` | Boolean |
| `security_controls.flattened_pdf` | Boolean |
| `security_controls.deep_link` | Boolean |
| `security_controls.watermark` | Boolean |
| `user_experience.session_persistence` | Boolean |
| `user_experience.browser_in_browser` | Boolean |
| `user_experience.forward_to_zia` | Boolean |
| `user_experience.translate` | Boolean |
| `user_experience.persist_isolation_bar` | Boolean |

**Gotchas:**
- `security_controls.flattened_pdf` must be `false` when `upload_download = "all"`.
- `security_controls.upload_download` must be `"none"` or `"upstream"` when `flattened_pdf = true`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_cloud_browser_isolation_external_profile.md`.

---

### User portals

#### `zpa_user_portal_controller`

Creates a user-facing portal endpoint (for PRA or clientless access).

**Required:** `name`.

**Optional:**

| Field | Notes |
|---|---|
| `certificate_id` | Omit for Zscaler-managed certificate |
| `domain` | Portal domain label |
| `enabled` | Boolean |
| `description` | — |
| `user_notification` | Message shown to users at portal |
| `user_notification_enabled` | Boolean |
| `ext_domain` | External domain |
| `ext_domain_name` | Full external domain name |
| `ext_domain_translation` | Translation hint for managed certs |
| `ext_label` | Label for managed-cert URL construction |
| `microtenant_id` | — |

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_controller.md`.

---

#### `zpa_user_portal_link`

Adds a bookmarked link entry visible within a user portal.

**Required:** `name`.

**Optional:** `description`, `enabled`, `icon_text`, `link` (URL), `link_path`, `protocol` (e.g., `"https://"`), `microtenant_id`, `user_portals.id` (set of portal IDs this link appears in).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_link.md`.

---

#### `zpa_user_portal_aup`

Configures an Acceptable Use Policy (AUP) page displayed at portal login.

**Required:** `name`.

**Optional:** `description`, `enabled`, `aup` (AUP text body), `email`, `phone_num`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_user_portal_aup.md`.

---

### Tags (Early Access)

Tags provide a structured labelling system scoped to namespaces. All three resources are flagged Early Access and may change.

#### `zpa_tag_namespace`

Top-level container for a set of related tags.

**Required:** `name`.

**Optional:** `description`, `enabled`, `microtenant_id`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_tag_namespace.md`.

---

#### `zpa_tag_key`

Defines a key within a namespace, along with its allowed values.

**Required:** `name`, `namespace_id` (ForceNew — changing this destroys and recreates the key).

**Optional:** `description`, `enabled`, `microtenant_id`, `tag_values` blocks (each with `name`).

**Import:** Composite format `<namespace_id>/<tag_key_id>` or `<namespace_id>/<tag_key_name>`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_tag_key.md`.

---

#### `zpa_tag_group`

Groups a set of tag values for use in policy conditions.

**Required:** `name`.

**Optional:** `description`, `tags` (set of tag value IDs from `zpa_tag_key.tag_values[*].id`), `microtenant_id`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_tag_group.md`.

---

### Other / utility resources

#### `zpa_emergency_access_user`

Provisions an emergency (break-glass) access user.

**Required:** `email_id`, `first_name`, `last_name`, `user_id`.

**Gotcha:** No import support.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_emergency_access_user.md`.

---

#### `zpa_private_cloud_group`

Groups Private Service Edge nodes deployed in a private (on-premises) cloud context.

**Required:** `name`.

**Optional:** `city_country`, `country_code`, `description`, `enabled`, `is_public`, `latitude`, `longitude`, `location`, `override_version_profile`, `microtenant_id`, `site_id`, `upgrade_day`, `upgrade_time_in_secs`, `version_profile_id`, `enrollment_cert_id`, `user_codes`. `enrollment_cert_id` is also Computed and resolves the `Connector` certificate when omitted/empty before create or update; `user_codes` independently triggers verification only when nonempty on create or changed/nonempty on update (`vendor/terraform-provider-zpa/zpa/resource_zpa_private_cloud_group.go:154-164,184-213,270-306`).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md`.

---

#### `zpa_c2c_ip_ranges`

Defines Cloud-to-Cloud IP range objects used in forwarding and network policy.

**Required:** `name`.

**Optional:** `description`, `enabled`, `ip_range_begin`, `ip_range_end` (use either begin/end pair or `subnet_cidr`), `subnet_cidr`, `location`, `location_hint`, `sccm_flag`, `country_code`, `latitude_in_db`, `longitude_in_db`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_c2c_ip_ranges.md`.

---

#### `zpa_zia_cloud_config`

Stores ZIA API credentials in the ZPA tenant so that ZPA can perform file-inspection calls to the ZIA Sandbox. Required when using `zpa_policy_capabilities_rule` with file inspection capabilities.

**Required:** `zia_username`, `zia_password` (sensitive), `zia_cloud_service_api_key` (sensitive), `zia_sandbox_api_token` (sensitive), `zia_cloud_domain`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_zia_cloud_config.md`.

---

### Policy rules

ZPA has two generations of the policy API. The provider exposes both. v2 is recommended for new deployments and is required when a rule has more than 1,000 condition criteria.

**v1 condition operand shape:**
```hcl
conditions {
  operator = "OR"
  operands {
    object_type = "APP"
    lhs         = "id"
    rhs         = zpa_application_segment.this.id
  }
}
```

**v2 condition operand shape (preferred):**
```hcl
conditions {
  operator = "OR"
  operands {
    object_type = "APP"
    values      = [zpa_application_segment.this.id]
  }
}
# Or, for IdP-scoped attributes:
conditions {
  operator = "OR"
  operands {
    object_type = "SAML"
    entry_values {
      lhs = saml_attribute_id
      rhs = "engineering"
    }
  }
}
```

**`object_type` values available across policy rule types:**

| object_type | Description |
|---|---|
| `APP` | Application segment IDs |
| `APP_GROUP` | Segment group IDs |
| `SAML` | SAML attribute / value pairs |
| `IDP` | Identity provider IDs |
| `CLIENT_TYPE` | Client type (e.g., `zpn_client_type_exporter`, `zpn_client_type_browser_isolation`) |
| `TRUSTED_NETWORK` | Trusted network IDs |
| `POSTURE` | Posture profile / status pairs |
| `SCIM` | SCIM attribute values |
| `SCIM_GROUP` | SCIM group IDs |
| `MACHINE_GRP` | Machine group IDs |
| `PLATFORM` | OS/platform (windows, mac, android, ios, linux) |
| `COUNTRY_CODE` | ISO 3166-1 alpha-2 country codes |
| `EDGE_CONNECTOR_GROUP` | Cloud connector group IDs — the primary validator resolves these against the cloud connector group getter (`vendor/terraform-provider-zpa/zpa/common.go:107-111`) |
| `BRANCH_CONNECTOR_GROUP` | Branch connector group IDs — a distinct object type, not an alias of `EDGE_CONNECTOR_GROUP`; handled only by the resource-level validator (`vendor/terraform-provider-zpa/zpa/common.go:1045`) and the v1→v2 aggregation switch (`vendor/terraform-provider-zpa/zpa/common.go:1339`) |
| `RISK_FACTOR_TYPE` | Risk score values |
| `CHROME_ENTERPRISE` | Chrome Enterprise device signals |
| `CHROME_POSTURE_PROFILE` | Chrome posture profile IDs |
| `LOCATION` | Location controller IDs |
| `EXTRANET` | Extranet resource IDs |
| `CONSOLE` | PRA console IDs (credential rules only) |
| `PRIVILEGE_PORTAL` | User portal IDs (portal access rules only) |
| `USER_PORTAL` | User portal IDs (browser protection rules only) |

**Gotcha (all rule types):** `microtenant_id` is NOT supported inside `operands` for the following object types: `SAML`, `SCIM`, `SCIM_GROUP`, `IDP`, `POSTURE`, `TRUSTED_NETWORK`. These types always look up objects in the parent tenant context.

**Gotcha (all rule types):** The `rule_order` attribute on individual policy rule resources is deprecated. Use `zpa_policy_access_rule_reorder` to manage ordering.

---

#### `zpa_policy_access_rule` / `zpa_policy_access_rule_v2`

Standard access control rule (allow/deny/require approval).

**Required:** `name`.

**Key fields:**

| Field | Values |
|---|---|
| `action` | `ALLOW`, `DENY`, `REQUIRE_APPROVAL` |
| `conditions` | One or more condition blocks |
| `device_posture_failure_notification_enabled` | Optional boolean on both v1 and v2 access-rule resources |
| `app_connector_groups` | Block; optional connector pinning |
| `app_server_groups` | Block; optional server group pinning |

For v2 rules, the top-level `operator` joins separate `conditions` blocks and
supports only `AND`; omitting it lets ZPA supply `AND`. Each condition block has
its own `AND`/`OR` operator for the operands inside that block, while multiple
values inside one operand are always ORed. The API rejects a repeated
`object_type` inside one condition block with `duplicate.operand.found`; use
separate condition blocks when the same type needs independent grouping
(`vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md:264-272,316-343,365-366`).

The provider documentation also warns that a block combining different object
types with `OR` may be valid through Terraform/API but not safely round-trip
through the Admin GUI; re-saving such a rule in the GUI can drop operands the
builder cannot represent
(`vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md:344-350`).

The access-rule variant doc files are usage examples showing different `object_type` configurations in conditions — not distinct resources. They are: `zpa_policy_access_rule_application_segment.md` (`object_type = "APP"`), `zpa_policy_access_rule_browser_access.md`, `zpa_policy_access_rule_posture_profile.md`, `zpa_policy_access_rule_risk_factor.md`, `zpa_policy_access_rule_saml.md`, `zpa_policy_access_rule_scim_attribute.md`, `zpa_policy_access_rule_scim_group.md`, and `zpa_policy_access_rule_trusted_networks.md`. Each configures the same `zpa_policy_access_rule` / `zpa_policy_access_rule_v2` resource.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_application_segment.md:31`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_browser_access.md:34`.

---

#### `zpa_policy_timeout_rule` / `zpa_policy_timeout_rule_v2`

Sets re-authentication timeouts.

**Required:** `name`.

| Field | v1 | v2 |
|---|---|---|
| `action` | `RE_AUTH` | `RE_AUTH` |
| `reauth_timeout` | Integer seconds | Human-readable string (`"10 Days"`, `"1 Hours"`, `"Never"`) |
| `reauth_idle_timeout` | Integer seconds | Human-readable string |

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_timeout_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_timeout_rule_v2.md`.

---

#### `zpa_policy_forwarding_rule` / `zpa_policy_forwarding_rule_v2`

Controls traffic forwarding to ZPA vs. bypass.

**Required:** `name`.

**`action` values:** `BYPASS`, `INTERCEPT`, `INTERCEPT_ACCESSIBLE`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule_v2.md`.

---

#### `zpa_policy_inspection_rule` / `zpa_policy_inspection_rule_v2`

Routes matching traffic through AppProtection.

**Required:** `name`.

**`action` values:** `INSPECT`, `BYPASS_INSPECT`.

**Required when `action = INSPECT`:** `zpn_inspection_profile_id`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md`.

---

#### `zpa_policy_isolation_rule` / `zpa_policy_isolation_rule_v2`

Routes matching sessions through Cloud Browser Isolation.

**Required:** `name`.

**`action` values:** `ISOLATE`, `BYPASS_ISOLATE`.

**Required when `action = ISOLATE`:** `zpn_isolation_profile_id`.

**v2 additions:** Supports `CHROME_ENTERPRISE` and `CHROME_POSTURE_PROFILE` object types.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule_v2.md`.

---

#### `zpa_policy_capabilities_rule`

Controls which PRA capabilities are available in a session.

**Required:** `name`.

**`action`:** `CHECK_CAPABILITIES`.

**Required:** `privileged_capabilities` block with Boolean fields:

`clipboard_copy`, `clipboard_paste`, `file_download`, `file_upload`, `inspect_file_download`, `inspect_file_upload`, `monitor_session`, `record_session`, `share_session`, `join_session`, `control_session`. The two v4.4.8 additions are Boolean schema fields (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go:174-183`).

| Terraform field | Capability value | Mapping |
|---|---|---|
| `join_session` | `JOIN_SESSION` | `true` appends `JOIN_SESSION` to the outgoing capability list (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go:431-433`) |
| `control_session` | `CONTROL_SESSION` | `true` appends `CONTROL_SESSION` to the outgoing capability list (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go:434-435`) |

**Conditions limited to:** `APP`, `APP_GROUP`, `SAML`, `SCIM`, `SCIM_GROUP`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_capabilities_rule.md:94-105`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go:174-183`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_capabilities_access_rule.go:431-435`.

---

#### `zpa_policy_credential_rule`

Injects PRA credentials into sessions matching the rule.

**Required:** `name`, `credential.id`.

**`action`:** `INJECT_CREDENTIALS`.

**Conditions:** First `conditions` block must use `object_type = CONSOLE` with the relevant PRA console IDs. Additional blocks can use `SAML`, `SCIM`, or `SCIM_GROUP`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_credential_rule.md`.

---

#### `zpa_policy_browser_protection_rule`

Configures monitoring behaviour for browser-access sessions.

**Required:** `name`.

**`action` values:** `MONITOR`, `DO_NOT_MONITOR`.

**Supported `object_type` additions:** `USER_PORTAL`, `CLIENT_TYPE` (in addition to standard `APP`, `APP_GROUP`).

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_browser_protection_rule.md`.

---

#### `zpa_policy_portal_access_rule`

Controls portal-access capabilities, including approval workflows and file access.

**Required:** `name`.

**`action`:** `CHECK_PRIVILEGED_PORTAL_CAPABILITIES`.

**Optional/computed:** `privileged_portal_capabilities` block with Boolean fields:
`delete_file`, `access_uninspected_file`, `access_uninspected_file_sandbox`,
`request_approvals`, `review_approvals`, `upload_inspected_sandbox`, and
`upload_inspected_scan`. The two inspected-upload fields map to the API
capabilities `UPLOAD_INSPECTED_SANDBOX` and `UPLOAD_INSPECTED_SCAN`
(`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_portal_access_rule.go:118-157,333-390`).

**Supported `object_type` values:** `PRIVILEGE_PORTAL`, `COUNTRY_CODE`, `SAML`, `SCIM`, `SCIM_GROUP`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_portal_access_rule.md`.

---

#### `zpa_policy_redirection_rule`

Redirects matching sessions to specific Service Edge groups.

**Required:** `name`.

**`action` values:** `REDIRECT_DEFAULT`, `REDIRECT_ALWAYS`, `REDIRECT_PREFERRED`.

**Required when action is `REDIRECT_ALWAYS` or `REDIRECT_PREFERRED`:** `service_edge_groups` block with `id` set.

**Conditions limited to:** `CLIENT_TYPE`, `COUNTRY_CODE`.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_redirection_rule.md`.

---

#### `zpa_policy_access_rule_reorder`

Manages the order of rules within a policy set. Replaces deprecated `rule_order` attribute.

**Required:** `policy_type`, `rules` block (list of `{id, order}` objects).

**`policy_type` values:** `ACCESS_POLICY`, `TIMEOUT_POLICY`, `BYPASS_POLICY`, `INSPECTION_POLICY`, `ISOLATION_POLICY`, `CREDENTIAL_POLICY`, `CAPABILITIES_POLICY`, `CLIENTLESS_SESSION_PROTECTION_POLICY`.

**Gotcha:** For `ACCESS_POLICY`, Deception rules must be assigned lower (earlier) order numbers than standard access rules.

Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_reorder.md`.

---

## Data sources

The provider exposes data sources for all major resource types, enabling lookup by name or ID. Data sources follow the naming convention `data.zpa_<resource_type>.<label>`. The data-source set mirrors the resource list (the `docs/data-sources/` directory currently holds 70 doc files, several of which are alias/usage examples rather than distinct data sources) with the following additions:

| Data source | Purpose |
|---|---|
| `zpa_access_policy_client_types` | Returns all valid `CLIENT_TYPE` values for policy conditions |
| `zpa_access_policy_platforms` | Returns all valid `PLATFORM` values |
| `zpa_application_segment_by_type` | Look up segments filtered by type (standard/browser/PRA/inspection) |
| `zpa_ba_certificate` | Fetch certificate by name (used in browser-access and portal configs) |
| `zpa_branch_connector_group` | Branch connector group lookup |
| `zpa_browser_protection` | Browser protection profile lookup |
| `zpa_cloud_browser_isolation_region` | Lists available CBI regions (needed for `zpa_cloud_browser_isolation_external_profile.region_ids`) |
| `zpa_cloud_browser_isolation_zpa_profile` | Reads the tenant's CBI ZPA profile |
| `zpa_cloud_connector_group` | Cloud connector group lookup |
| `zpa_customer_version_profile` | Version profile lookup (`Default`, `Previous`, `New Release`) |
| `zpa_enrollment_cert` | Enrollment certificate lookup (for provisioning keys) |
| `zpa_extranet_resource_partner` | Extranet partner lookup |
| `zpa_idp_controller` | Identity provider lookup (needed for SAML/SCIM conditions) |
| `zpa_inspection_all_predefined_controls` | Returns all predefined AppProtection controls |
| `zpa_inspection_predefined_controls` | Filtered predefined control lookup |
| `zpa_isolation_profile` | CBI isolation profile lookup (for isolation policy rules) |
| `zpa_location_controller` | Location lookup |
| `zpa_location_controller_summary` | Summarised location list |
| `zpa_location_group_controller` | Location group lookup |
| `zpa_lss_config_client_types` | Valid LSS client type values |
| `zpa_lss_config_log_type_formats` | Log format metadata per `source_log_type` |
| `zpa_lss_config_status_codes` | Valid status codes for LSS filters |
| `zpa_machine_group` | Machine group lookup (for `MACHINE_GRP` conditions) |
| `zpa_managed_browser_profile` | Managed browser profile lookup |
| `zpa_policy_type` | Lists policy set IDs by type |
| `zpa_posture_profile` | Posture profile lookup (for `POSTURE` conditions) |
| `zpa_private_cloud_controller` | Private cloud controller lookup |
| `zpa_private_cloud` | Private Cloud lookup by name or ID; returns group associations, SIEM/exporter/broker relationships, fire-drill settings, management flags, and microtenant metadata |
| `zpa_risk_score_values` | Valid risk score values for `RISK_FACTOR_TYPE` conditions |
| `zpa_saml_attribute` | SAML attribute lookup by IdP (for SAML conditions) |
| `zpa_scim_attribute_header` | SCIM attribute header lookup |
| `zpa_scim_groups` | SCIM group lookup |
| `zpa_service_edge_controller` | Individual PSE lookup |
| `zpa_trusted_network` | Trusted network lookup |
| `zpa_workload_tag_group` | Workload tag group lookup |

**Common usage pattern:**

```hcl
data "zpa_idp_controller" "okta" {
  name = "Okta_IdP"
}

data "zpa_saml_attribute" "email" {
  name   = "Email"
  idp_id = data.zpa_idp_controller.okta.id
}
```

Most read-only data sources accept `name` or `id` and export the full resource schema for use in `operands` or dependent resource arguments.

---

## Open questions register

Source: `vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_config.go`; `vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_group.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_redirection_rule.md`.

Resolved items below cite the specific provider files used for verification inline.

1. **Resolved 2026-04-26.** `zia_cloud_domain` valid values confirmed from provider source. `validation.StringInSlice` enforces: `zscaler`, `zscloud`, `zscalerone`, `zscalertwo`, `zscalerthree`, `zscalerbeta`, `zscalergov`, `zscalerten`, `zspreview`. The provider's `StateFunc` automatically appends `.net` to the stored value (e.g., `zscloud` → `zscloud.net`) but the raw input should not include the `.net` suffix.

2. **Resolved 2026-06-15.** LSS `source_log_type` canonical list re-verified against the current provider docs. The log-type → display-name table is identical across all ten LSS doc files (e.g. `vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_controller.md:88`). The LSS section table in this doc was corrected accordingly: `zpn_http_trans_log` is "Web Browser" (not "HTTP transactions"), the App Connector Metrics token is `zpn_ast_comprehensive_stats` (the doc previously listed `zpn_cnx_apps_stats`), and two new tokens were added — `zpn_audit_log` → Audit Logs and `zpn_waf_http_exchanges_log` → ZPA App Protection. For runtime verification, use the `zpa_lss_config_log_type_formats` data source.

   - **Still open:** which `source_log_type` values accept or require a `policy_rule_resource` block. Only the User Activity (`zpn_trans_log`) and User Status (`zpn_auth_log`) example docs ship one (`vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_activity.md:77`); the other eight LSS docs (including App Connector Status, Private Service Edge Metrics, and App Protection) do not. The prior claim here that `zpn_ast_auth_log` and `zpn_pbroker_comprehensive_stats` require the block could not be confirmed from any provider doc and has been removed from the LSS section pending source confirmation. (Tracked as [`zpa-76`](../_meta/clarifications.md#zpa-76-which-lss-source_log_type-values-require-a-policy_rule_resource-block).)

3. **Resolved 2026-04-26; lifecycle re-verified in provider v4.4.10.** `app_connector_group` exposes `enrollment_cert_id` (Optional+Computed String) and `user_codes` (optional Set of String), but they are not configuration-coupled. The provider preserves or auto-resolves the `Connector` certificate before every create/update; the user-code verification API runs only when nonempty codes are supplied on create or changed on update (`vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go:203-213,233-266,342-382`).

4. **Resolved 2026-04-26.** Policy rule v1 deprecation timeline: `rule_order` attribute is deprecated as of the provider docs reviewed (replaced by `zpa_policy_access_rule_reorder`). The v1 resource (`zpa_policy_access_rule`) itself has no removal schedule stated in the docs. The `policy_set_id` attribute was made optional in v3.2.0. No EOL date for v1 resource confirmed.

5. **Resolved 2026-04-26.** `zpa_private_cloud_group` uses `site_id` (String) to link a private cloud group to a Site Controller site. The distinction from `zpa_app_connector_group`: private cloud groups are for ZPA Private Cloud (on-premises ZPA deployments using Private Cloud Controllers), while app connector groups are for standard cloud-hosted ZPA. The `site_id` references the Private Cloud Controller's site identifier.

6. **Tag group membership in policy** — Tags and tag groups are Early Access. Whether `zpa_tag_group` IDs can currently be referenced in policy rule conditions as an `object_type` is not confirmed from available sources. Remains unresolved. (Tracked as [`zpa-77`](../_meta/clarifications.md#zpa-77-tag-tag-group-membership-referenced-in-policy-rule-conditions).)

7. **Resolved 2026-04-26.** `zpa_policy_redirection_rule` CLIENT_TYPE values confirmed. Valid `CLIENT_TYPE` values: `zpn_client_type_machine_tunnel`, `zpn_client_type_edge_connector`, `zpn_client_type_zapp`, `zpn_client_type_zapp_partner`, `zpn_client_type_branch_connector`. These are the values to use in the `values` list under a condition with `object_type = "CLIENT_TYPE"`.
