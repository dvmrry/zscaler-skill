---
product: zpa
topic: "zpa-api"
title: "ZPA API surface"
content-type: reference
last-verified: "2026-04-23"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/README.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/lss.py"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_segment_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_controller.md"
author-status: draft
---

# ZPA API surface

API reference for the slice of ZPA this skill covers — application segments, segment groups, server groups, access policies, and LSS log-streaming config. Derived from the Zscaler Python SDK and the Terraform provider.

## Authentication

Same two-framework model as ZIA — see [`../zia/api.md`](../zia/api.md#authentication-two-frameworks) for the full description. Summary:

- **OneAPI** (current, OAuth 2.0 via ZIdentity): unified `ZscalerClient` exposes `.zpa` as the ZPA resource root.
- **Legacy** (older, ZPA-specific credentials): `from zscaler.oneapi_client import LegacyZPAClient`. Use for pre-ZIdentity tenants and ZPA gov clouds (`GOV`, `GOVUS`), which do not support OneAPI.

ZPA-legacy auth uses a Client ID + Client Secret + customer ID issued in the ZPA Admin Portal. Per SDK README, these map to env vars when using the unified client under legacy mode.

## API base structure

The ZPA API uses a customer-scoped URL pattern: most endpoints live under `/mgmtconfig/v1/admin/customers/{customerId}/...`. Example from `vendor/terraform-provider-zpa/docs/resources/zpa_application_segment.md` API reference link: `https://help.zscaler.com/zpa/configuring-application-segments-using-api`.

The SDK abstracts this — you don't manually build customer-scoped URLs, but log exports, direct curl debugging, or third-party tooling will see the customerId in every path.

## SDK response shape

Same pattern as ZIA per SDK README:

```python
result, response, error = client.zpa.application_segment.list_segments()
```

- `result` — Python dict or list-of-dicts.
- `response` — raw HTTP response with `has_next()` / `next()` for pagination.
- `error` — None on success.

Some ZPA endpoints use POST-based search semantics rather than GET for listing. Per SDK README:

> Some endpoints use POST `/resource/search` with filterBy/pageBy/sortBy; use `_post_search_all_pages` or `CommonFilterSearch`.

## Endpoints and resources relevant to this skill

### Application Segments

Canonical SDK module: `vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py`.

Additional SDK modules for segment variants:

- `app_segments_ba.py`, `app_segments_ba_v2.py` — Browser Access segments
- `app_segments_pra.py` — Privileged Remote Access segments
- `app_segments_inspection.py` — Inspection (AppProtection) segments
- `app_segment_by_type.py` — type-scoped lookup

TF resources at `vendor/terraform-provider-zpa/docs/resources/`:

- `zpa_application_segment` — the canonical defined-application segment
- `zpa_application_segment_browser_access` — Browser Access variant
- `zpa_application_segment_inspection` — AppProtection variant
- `zpa_application_segment_pra` — Privileged Remote Access variant
- `zpa_application_segment_weightedlb_config` — load-balancing
- `zpa_application_segment_multimatch_bulk` — bulk INCLUSIVE/EXCLUSIVE updates (see `./app-segments.md` Multimatch)

Canonical TF example (excerpt from `zpa_application_segment.md`):

```terraform
resource "zpa_application_segment" "this" {
  name              = "Example"
  description       = "Example"
  enabled           = true
  health_reporting  = "ON_ACCESS"
  bypass_type       = "NEVER"
  is_cname_enabled  = true
  tcp_port_ranges   = ["8080", "8080"]
  domain_names      = ["server.acme.com"]
  segment_group_id  = zpa_segment_group.this.id
  server_groups {
    id = [zpa_server_group.this.id]
  }
}
```

**SDK-level findings** (`zscaler/zpa/models/application_segment.py`):

- **`enabled` defaults to `True`** on newly-constructed segment objects. An admin who forgets to set `enabled` ends up with a live segment, not a draft.
- **`match_style`**: two values — `EXCLUSIVE` and `INCLUSIVE`. Confirms the resolved behavior in clarification `zpa-03`.
- **Two parallel port-range formats coexist**:
  - `tcpPortRanges` / `udpPortRanges` — list of strings, e.g. `["80", "8080-8090"]`
  - `tcpPortRange` / `udpPortRange` — list of `{from, to}` dicts
  - SDK `request_format()` sends both. Different API endpoints may require one or the other; the SDK tolerates both.
- **`inspect_traffic_with_zia`** (bool) — enables ZIA inline inspection for ZPA traffic at the segment level. This is the ZPA-side hook for ZIA+ZPA integration (distinct from ZIA's `zpa_app_segments` on SSL inspection rules).
- **`policy_style`** — present but no enum values in the SDK; server-assigned. [inferred]
- **`read_only`, `restriction_type`, `zscaler_managed`** are server-assigned governance flags appearing across App Segments, Segment Groups, App Connector Groups, and Policy Rules. Any object with `read_only=True` or `zscaler_managed=True` should be treated as immutable by the skill.

**TF-level findings** (`terraform-provider-zpa/zpa/resource_zpa_application_segment.go`):

- **`select_connector_close_to_app` is `ForceNew`** (`:197`). Toggling connector-proximity routing on an existing segment requires **destroy and recreate** — the API refuses in-place updates to this flag. Plan for access interruption when changing it. Applies to all segment variants (base, `_pra`, `_inspection`, `_browser_access`).
- **`bypass_type` enum (3 values)**: `ALWAYS`, `NEVER`, `ON_NET` (`:83-87`). **`ON_NET`** (bypass only for on-network users) is undocumented in most App Segment help articles.
- **`icmp_access_type` enum**: `PING_TRACEROUTING`, `PING`, `NONE` (default `NONE`) (`:180-184`). Controls ICMP handling on the segment.
- **`health_reporting` enum**: `NONE`, `ON_ACCESS`, `CONTINUOUS` (default `NONE`) (`:170-174`).
- **`log_features` enum**: `DEFAULT`, `SIEM` (default `DEFAULT`) (`:109-113`).
- **`tcp_keep_alive` is a string enum `"0"` / `"1"`, not a native boolean** (`:228-230`). Wire-format quirk — callers constructing payloads programmatically must send strings.

**PRA segment extras** (`resource_zpa_application_segment_pra.go`):

- **`apps_config.app_types` enum**: `RDP`, `SSH`, `VNC` (`:252-254`). Full set of PRA protocols.
- **RDP `connection_security` enum (6 values)**: `ANY`, `NLA`, `NLA_EXT`, `TLS`, `VM_CONNECT`, `RDP` (`:260-262`). **`VM_CONNECT`** is PRA-only, absent from help docs — used for Hyper-V VM Connect tunneling.

**Browser Access extras** (`resource_zpa_application_segment_browser_access.go`):

- **Programmatic constraint (not in schema)**: setting `certificate_id` while `ext_label` or `ext_domain` is configured is **rejected at Create/Update** (`:43-50`). Invisible to schema inspection alone — a common pitfall when migrating BA configs.
- **`clientless_apps[].protocol` enum**: `HTTP`, `HTTPS` only (`:278-281`).

### Segment Groups

SDK: `segment_groups.py`. TF: `zpa_segment_group`.

**SDK-level findings** (`zscaler/zpa/models/segment_group.py`):

- **`tcp_keep_alive_enabled`** (bool, at group level) exists separately from the per-segment `tcp_keep_alive`. TCP keep-alive is configurable at segment-group granularity, not only per segment.
- **`policy_migrated`** (server-assigned) — indicates whether a segment group's policies have been migrated from V1 to V2 policy format. Useful when reasoning about which policy model applies.

### Server Groups

SDK: `server_groups.py` (present in SDK listing). TF: `zpa_server_group`.

### App Connector Groups

SDK: `app_connector_groups.py`. TF: `zpa_app_connector_group`, `zpa_app_connector_assistant_schedule`.

**SDK-level findings** (`zscaler/zpa/models/app_connector_groups.py`):

- **`pra_enabled`** (bool, default `False`) — **required to be `True` on a connector group for Privileged Remote Access sessions to work through it.** PRA-expecting rules against a `pra_enabled=False` group silently won't function.
- **`waf_disabled`** (bool, default `False`) — per-group toggle to disable WAF on that group. Affects AppProtection inspection.
- **`lss_app_connector_group`** (bool, default `False`) — marks the group as dedicated to LSS. [inferred] Using an LSS-designated group for regular app access may be unsupported.
- **Three TCP Quick-ACK controls**, all default `False`:
  - `tcp_quick_ack_app` — app traffic
  - `tcp_quick_ack_assistant` — assistant
  - `tcp_quick_ack_read_assistant` — read ops
- **`NPAssistantGroup` sub-object** — carries `LanSubnet` and `NPDnsNsRecord` for Network Protection DNS NS delegation. Undocumented NP-related infrastructure for private DNS namespaces.

### Access Policy rules

SDK: policy module (see `policyset_controller_v1` referenced in `models/lss.py`, and `policyset_controller_v2` for current policy). TF: `zpa_policy_access_rule`.

Per *Access Policy Deployment and Operations Guide* (vendored PDF) p.3, rule order in the API uses the `order` field; changing it reorders the access policy. Activation is not required for ZPA the way it is for ZIA — ZPA changes propagate automatically per SDK observations.

**SDK-level findings** (`zscaler/zpa/models/policyset_controller_v2.py`):

- **Two distinct reauth fields**:
  - `reauth_timeout` — session duration before full re-auth is required
  - `reauth_idle_timeout` — idle duration before re-auth
  - Both default to `None` → tenant-global setting applies if omitted.
- **`device_posture_failure_notification_enabled`** (bool) — controls whether users see a posture-denial notification.
- **Conditional cross-field dependencies**:
  - `zpn_isolation_profile_id` — relevant only when `action = ISOLATE`
  - `zpn_inspection_profile_id` / `zpn_inspection_profile_name` — relevant only when `action = INSPECT`
  - The SDK doesn't validate mismatches; API behavior for setting an irrelevant profile ID is unstated.
- **`credential` and `credential_pool`** are nested sub-objects for PRA rules — attach privileged credentials directly to a policy rule. **Mutual exclusion enforced at the schema level** on Credential Access rules via `ExactlyOneOf: ["credential", "credential_pool"]` (`resource_zpa_policy_credential_access_rule.go:125, 138`) — must set exactly one.
- **`Operand` match forms are mutually exclusive**:
  - `values` — list of IDs (for most object types)
  - `entry_values` — list of `{lhs, rhs}` pairs (for SAML/SCIM/SCIM_GROUP attribute matching)

**TF-level findings on policy rules:**

- **`reauth_timeout` and `reauth_idle_timeout` are `ForceNew`** in the shared policy schema (`common.go:554-562`). **Changing either on an existing rule requires Terraform to destroy and recreate it** — the API refuses in-place updates. Correction to earlier threading in `references/zpa/policy-precedence.md`: editing these fields isn't just a normal update; it's an in-place disruption that can renumber the rule. Plan carefully.
- **v2 policy `object_type` enum — 19 values** (`resource_zpa_policy_access_rule_v2.go:112-132`): `APP`, `APP_GROUP`, `LOCATION`, `IDP`, `SAML`, `SCIM`, `SCIM_GROUP`, `CLIENT_TYPE`, `POSTURE`, `TRUSTED_NETWORK`, `BRANCH_CONNECTOR_GROUP`, `EDGE_CONNECTOR_GROUP`, `MACHINE_GRP`, `COUNTRY_CODE`, `PLATFORM`, `RISK_FACTOR_TYPE`, `CHROME_ENTERPRISE`, `CHROME_POSTURE_PROFILE`, `WORKLOAD_TAG_GROUP`. v2 adds materially more types than v1 (`LOCATION`, `BRANCH_CONNECTOR_GROUP`, `EDGE_CONNECTOR_GROUP`, `MACHINE_GRP`, `COUNTRY_CODE`, `PLATFORM`, `RISK_FACTOR_TYPE`, `CHROME_ENTERPRISE`, `CHROME_POSTURE_PROFILE`, `WORKLOAD_TAG_GROUP`). When answering v1-vs-v2 behavior questions, the surface-area delta is structural.
- **Access rule `action` enum**: `ALLOW`, `DENY`, `REQUIRE_APPROVAL` (both v1 and v2). `REQUIRE_APPROVAL` is a first-class API value corresponding to the Conditional Access / step-up pattern described in `zpa-06`.
- **Timeout rule `action` is `RE_AUTH` only** (`resource_zpa_policy_access_timeout_rule.go:31-33`) — single-value enum.
- **Forwarding rule `action` enum (v2)**: `BYPASS`, `INTERCEPT`, `INTERCEPT_ACCESSIBLE` (`resource_zpa_policy_access_forwarding_rule_v2.go:43-47`). **`INTERCEPT_ACCESSIBLE`** is undocumented in forwarding rule action docs — appears to be a variant of INTERCEPT for accessibility-gated flows.
- **Inspection rule `action` enum (v2)**: `INSPECT`, `BYPASS_INSPECT` only (`resource_zpa_policy_access_inspection_rule_v2.go:42-45`).

### LSS (Log Streaming Service) config

SDK: `lss.py` + `models/lss.py`. Handles config for the log streams we document in [`./logs/access-log-schema.md`](./logs/access-log-schema.md).

**SDK-level findings** (`zscaler/zpa/lss.py`, `zscaler/zpa/models/lss.py`):

- **`source_log_type` wire-format mapping** — the SDK normalizes 8 human-readable aliases to the `zpn_*` values the API actually requires. Passing the human label directly to the API would fail:

  | Human alias | API wire value |
  |---|---|
  | `app_connector_metrics` | `zpn_ast_comprehensive_stats` |
  | `app_connector_status` | `zpn_ast_auth_log` |
  | `audit_logs` | `zpn_audit_log` |
  | `browser_access` | `zpn_http_trans_log` |
  | `private_svc_edge_status` | `zpn_sys_auth_log` |
  | `user_activity` | `zpn_trans_log` |
  | `user_status` | `zpn_auth_log` |
  | `web_inspection` | `zpn_waf_http_exchanges_log` |

  If a user sees `zpn_trans_log` in a config dump, that's the User Activity log.
- **`use_tls` defaults to `False`** — LSS log-stream TLS encryption is opt-in. Surprising default; easy security oversight.
- **LSS resources embed a `policyRule` directly** — the only place **V1 policy format** (`PolicySetControllerV1`) remains actively used. Everywhere else in ZPA, V2 is current. This matters when reasoning about LSS access controls: different model, different fields.

**TF-level additions** (`terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go`):

- **TF validator enumerates 9 `source_log_type` values** (`:216-226`): 8 match the SDK-normalized aliases (see table above) plus **`zpn_pbroker_comprehensive_stats`** (ninth — P-Broker / Private Service Edge metric logs, not in the SDK mapping table). Check both sources when correlating tenant config.
- **LSS `action` is `LOG` only** (`:22-24`) — single-value enum.
- **`config` and `policy_rule_resource` blocks both have `MaxItems: 1`** (`:139, 161`) — each LSS controller has exactly one config block and one policy rule block.

### App Connector Groups — TF additions

Beyond the SDK findings above (`pra_enabled`, `waf_disabled`, etc.):

- **`version_profile_name` enum (6 values)**: `Default`, `Previous Default`, `New Release`, **`Default - el8`**, **`New Release - el8`**, **`Previous Default - el8`** (`resource_zpa_app_connector_group.go:182-186`). The `-el8` variants are RHEL/Enterprise-Linux-8-specific connector upgrade tracks. Not visible in the console's dropdown description.
- **`ip_anchor_type` enum**: `IPV4_IPV6`, `IPV4`, `IPV6` (`:85-89`). Dual-stack vs single-stack anchoring selection.
- **`latitude` and `longitude` normalize to 6 decimal places** via `DiffSuppressFuncCoordinate` (`:100-113`). Higher-precision inputs don't generate plan diffs — useful if a tenant pulls coordinates from a more-precise source.

### Server Groups

- **Programmatic constraint**: `servers` must be **non-empty when `dynamic_discovery = false`** (`resource_zpa_server_group.go:214, 283-284`). Enforced in Create/Update code, not schema — invisible to static schema inspection.
- `dynamic_discovery = true` allows an empty `servers` list — servers are discovered automatically by the connector.

### Service Edge Groups

- **Grace distance triplet**: `grace_distance_enabled`, `grace_distance_value`, `grace_distance_value_unit` form a `RequiredWith` group (`resource_zpa_service_edge_group.go:224, 245`) — set all three or none. `grace_distance_value_unit` enum: `MILES`, `KMS`.
- **`service_edges` membership is externally managed**: the field's `DiffSuppressFunc` suppresses diffs entirely if the field is not explicitly set in config (`:132-139`). Provider comment notes it will be deprecated. Do not recommend setting it in HCL.
- **`grace_distance_value` normalizes to 1 decimal place** via `DiffSuppressFunc` (`:226-237`).

TF resources for LSS configuration (each maps to a specific log type):

| TF Resource | Log Type |
|---|---|
| `zpa_lss_config_user_activity` | User Activity (the primary access log) |
| `zpa_lss_config_user_status` | User Status (auth/enrollment events) |
| `zpa_lss_config_controller` | Base controller; generic LSS config |
| `zpa_lss_app_connector_metrics` | App Connector metrics |
| `zpa_lss_app_connector_status` | App Connector status |
| `zpa_lss_private_service_metrics` | Private Service Edge metrics |
| `zpa_lss_private_service_edge_status` | Private Service Edge status |
| `zpa_lss_audit_logs` | Admin audit logs |
| `zpa_lss_app_protection` | AppProtection |
| `zpa_lss_web_browser` | Browser Access |

`models/lss.py` defines `LSSResourceModel` with these top-level fields: `id`, `connector_groups`, `config` (LSSConfig), `policy_rule`, `policy_rule_resource`. `LSSConfig` carries `name`, `description`, `enabled`, `source_log_type`, `modified_time`, `creation_time`, `modified_by`, plus the log-stream content template.

## Go-SDK-only surfaces (cross-SDK audit 2026-04-24)

Cross-check against `vendor/zscaler-sdk-go/zscaler/zpa/services/` surfaced services the Python SDK at `vendor/zscaler-sdk-python/zscaler/zpa/` doesn't expose:

- **`applicationsegment_move`** / **`applicationsegment_share`** (Go) — explicit microtenant-cross-segment operations: `AppSegmentMicrotenantMove` and `AppSegmentMicrotenantShare`. Python's `application_segment` has no equivalent methods. Any tooling that needs to move application segments across microtenants or share segments between microtenant boundaries must use the Go SDK or call the API directly.
- **Microtenant-sharing sub-objects on `ApplicationSegmentResource`** (Go) — `SharedMicrotenantDetails`, `SharedFromMicrotenant`, `SharedToMicrotenant` are typed sub-structs. Python's `application_segment.py` passes these through as unvalidated dicts. Tenants using microtenants should expect these fields to appear in snapshot JSON.
- **`scim_api`** (Go) — full ZPA SCIM CRUD. Python has `scim_groups` and `scim_attributes` modules but they don't cover the full SCIM provisioning surface the Go SDK exposes.

Python-only modules the Go SDK doesn't carry (some of these are Python's way of splitting what Go bundles; some are newer features): `tag_key`, `tag_namespace`, all five `pra_*` modules (`pra_approval`, `pra_console`, `pra_credential`, `pra_credential_pool`, `pra_portal`), and all four `cbi_*` modules (`cbi_banner`, `cbi_certificate`, `cbi_profile`, `cbi_region`). The PRA and CBI surfaces exist in Go under different paths — the module split differs rather than the API coverage.

## Read/write shape asymmetries

Cross-cutting hub for fields where `GET` and `POST`/`PUT` disagree on shape, value, or presence semantics. Detail lives in topical docs; this section is the discovery point for "API round-trip will bite me, where?" questions.

| Asymmetry | Topical home | Severity |
|---|---|---|
| **`clientless_app_ids` key-presence vs truthiness on Application Segments.** A standard segment's `GET` includes `clientless_app_ids: null`. On `PUT`, you must **omit the key entirely** — including it with `None` triggers a `BROWSER_ACCESS` segment lookup that fails with "No matching clientless App found." Same key, presence-vs-absence asymmetry across read and write. | [`./app-segments.md § Edge cases`](./app-segments.md) | High — common round-trip pattern; failure mode is confusing |
| **LSS `source_log_type` aliases.** SDK normalizes 8 human-readable aliases (`user_activity`, `browser_access`, ...) on read against the API's wire values (`zpn_trans_log`, `zpn_http_trans_log`, ...). Code that reads via SDK and writes via raw HTTP (or vice versa) must translate. | [§ LSS (Log Streaming Service) config](#lss-log-streaming-service-config) (this doc) | Medium — only bites mixed-toolchain callers |
| **Provisioning key `association_type` — resource accepts more types than data source.** `data_source_zpa_provisioning_key.go:102–104` accepts `[CONNECTOR_GRP, SERVICE_EDGE_GRP]` (description: "supported values are CONNECTOR_GRP and SERVICE_EDGE_GRP"); `resource_zpa_provisioning_key.go:131` accepts those plus `[EXPORTER_GRP, NP_ASSISTANT_GRP, SITE_CONTROLLER_GRP]`. Implication: a provisioning key created via TF resource for `EXPORTER_GRP` cannot be looked up via the TF data source by association_type — the data source rejects the type at validation. Operators creating non-standard provisioning keys should use direct ID lookup, not type-based search. Surfaced by `scripts/find-asymmetries.py` Pass 1 (intra-provider). | [`./app-connector.md § Provisioning Keys`](./app-connector.md) | Low — only affects EXPORTER / NP_ASSISTANT / SITE_CONTROLLER use cases |

**Adding entries here:** when a new asymmetry is documented in a topical doc, add a one-line cross-link row above. Do not duplicate the detail.

## Pagination

Per SDK README: built-in `resp.has_next()` / `resp.next()`. Same idiom as ZIA.

For ZPA's POST-search endpoints (some list APIs use POST with `filterBy`/`pageBy`/`sortBy` in the body), use `_post_search_all_pages` or `CommonFilterSearch` per SDK README.

## JMESPath client-side filtering

Per SDK README, every `resp` supports `resp.search("<expression>")` for in-client JMESPath filtering/projection. Example:

```python
result, resp, error = client.zpa.application_segment.list_segments()
enabled_only = resp.search("[?enabled]")
```

`query_params` remains the primary mechanism for server-side filtering; JMESPath is additive.

## No activation step

Unlike ZIA (which requires a separate `POST /status/activate` after changes), ZPA config changes take effect on write. This means no equivalent of ZIA's `zia_activation_status` resource is needed.

## Microtenants

Several ZPA resources accept a microtenant scope. Per `vendor/zscaler-sdk-python/zscaler/zpa/microtenants.py` (SDK module listing) and the ZPA Configuring Defined Application Segments PDF p.19: "Microtenants aren't supported" for some features like Extranet settings. The microtenant context must be specified at the client level or per-request; see SDK module for the exact pattern.

## Scripts in this repo that use these endpoints

- **`scripts/snapshot-refresh.py [--zpa-only]`** — dumps ZPA `application_segment.list_segments`, `segment_groups.list_groups`, `server_groups.list_groups`, and `policies.list_rules` to `snapshot/zpa/*.json`. Uses the same `ZscalerClient` authentication documented here; see `references/zia/api.md` for the full env-var list (shared between products under OneAPI). Handles SDK pagination via `resp.has_next()` / `resp.next()`.

## Cross-links

- Application segment matching — [`./app-segments.md`](./app-segments.md)
- Access policy precedence — [`./policy-precedence.md`](./policy-precedence.md)
- LSS access log schema — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- ZIA API counterpart (auth framework is identical) — [`../zia/api.md`](../zia/api.md)
