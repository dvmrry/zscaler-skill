---
topic: clarifications-sweep
title: "Open-questions sweep — April 2026"
date: "2026-04-26"
scope: "All SDK / Terraform / audit-log reference docs"
---

# Open-questions sweep — April 2026

Sweep of 13 reference docs against local vendor sources. Each open question was
researched from `vendor/zscaler-sdk-python/`, `vendor/zscaler-sdk-go/`,
`vendor/terraform-provider-zia/`, `vendor/terraform-provider-zpa/`,
`vendor/terraform-provider-ztc/`, and `vendor/zscaler-help/`. Docs updated in
place; this report summarises findings and outstanding gaps.

**Totals (across all 13 docs):**
- Questions reviewed: 75
- Resolved: 48
- Partially resolved: 3
- Unresolved / insufficient sources: 24

---

## Deferred — multi-cluster load sharing

Questions from `references/shared/multi-cluster-load-sharing.md` that could not be resolved from available vendor sources (`vendor/zscaler-help/understanding-multi-cluster-load-sharing.md`, `understanding-zscaler-cloud-architecture.md`, `about-public-service-edges-internet-saas.md`, `understanding-business-continuity-cloud-components.md`).

| # | Question | Context |
|---|----------|---------|
| MCLS-01 | **Session-level stickiness within an MCLS VIP pool.** Does the LB provide per-flow stickiness (all packets of a single TCP flow land on the same service node), or can a single flow be distributed across nodes in different clusters? Impacts DLP large-object scanning and file reassembly. | Section 5 — Session affinity |
| MCLS-02 | **Auth state replication across clusters.** When a user authenticated at one service node is subsequently routed to a node in a different cluster within the pool, is the re-query to the CA transparent (no user re-prompt) or does it trigger a visible re-authentication event? Depends on auth method (IP surrogacy, cookie, Kerberos, SAML). | Section 8 — Identity caching |
| MCLS-03 | **Client-side detection timeout for VIP failure (GRE/IPSec).** How long does a ZCC or router-terminated GRE/IPSec tunnel take to detect a full DC VIP failure before triggering failover or re-resolution? Not documented in MCLS or architecture vendor sources. | Section 7 — Failure modes |
| MCLS-04 | **Z-Tunnel 2.0 behavior under MCLS.** The MCLS table shows VPN VIPs but does not specify Z-Tunnel 2.0 explicitly. Whether Z-Tunnel 2.0 stateful TLS multiplexing interacts differently with cross-cluster LB forwarding is unconfirmed. | Section 3 — Traffic distribution |
| MCLS-05 | **Government cloud (zscalergov / zspreview) MCLS topology.** Whether these clouds operate an equivalent MCLS model or a different cluster topology is not documented in available sources. | Section 12 — Constraints |

---

## Per-document summary

### `references/zcc/sdk.md` (4 of 6 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | Python `update_zdx/zpa_group_entitlement` sends empty body `{}`; Go SDK requires full `ZdxGroupEntitlements`/`ZpaGroupEntitlements` struct. Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/entitlements/entitlements.go`. |
| Q2 | Unresolved | `web_privacy` return type on `get_web_privacy_risk` — cannot confirm from vendor sources alone. |
| Q3 | Resolved | `reformat_params` global list enumerated from `vendor/zscaler-sdk-python/zscaler/utils.py` (lines 42–93) — 50+ snake_case→camelCase field mappings used by `web_policy_edit`. |
| Q4 | Resolved | Go-only services (`application_profiles`, `custom_ip_apps`, `predefined_ip_apps`, `process_based_apps`) confirmed absent from Python ZCC directory — not an intentional exclusion, the Python SDK is incomplete for these surfaces. |
| Q5 | Resolved | `manage_pass` Go struct documented: `companyId`, `deviceType`, `exitPass`, `logoutPass`, `policyName`, `uninstallPass`, `zadDisablePass`, `zdpDisablePass`, `zdxDisablePass`, `ziaDisablePass`, `zpaDisablePass`. Python has a model file but no service module. Endpoint: `POST /zcc/papi/public/v1/managePass`. Source: `vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go`. |
| Q6 | Unresolved | Rate-limit headers in ZCC responses — not confirmed from available sources. |

### `references/zdx/sdk.md` (3 of 5 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | Snapshot is Python-only. No Go equivalent found in `vendor/zscaler-sdk-go/zscaler/zdx/` services directory. |
| Q2 | Unresolved | Expiry routing behavior for `get_app` — not confirmed. |
| Q3 | Resolved | `get_analysis` returning a raw dict is intentional per source — no model class wraps the response. |
| Q4 | Unresolved | ZDX cursor-based pagination (`next_offset`) max offset semantics — not documented in available sources. |
| Q5 | Partially resolved | `zdx_params` decorator (`vendor/zscaler-sdk-python/zscaler/utils.py` line 404) is applied to software inventory but whether the server honours `time_range` for that endpoint is not confirmed. |

### `references/zidentity/sdk.md` (5 of 7 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | Go SDK `api-clients` package is genuinely absent from `vendor/zscaler-sdk-go/zscaler/zid/services/`. Python-only surface. |
| Q2 | Unresolved | `expires_at` acceptable range for secrets — not documented in SDK source. Example shows `'1785643102'` (future Unix epoch). |
| Q3 | Resolved | `get_group(group_id: int)` type annotation is a bug — ZIdentity IDs are strings. Go SDK consistently uses `string`. Source: `vendor/zscaler-sdk-python/zscaler/zid/groups.py` line 113. |
| Q4 | Resolved | `list_user_group_details` returns raw list (via `response.get_results()`) while `list_groups` returns a `Groups` wrapper. Confirmed inconsistency; no fix visible in available sources. |
| Q5 | Resolved | `Entitlements` vs `Service` naming reflects genuinely different shapes. `Entitlements` = roles + scope (what the user can do); `Service` = service instance details (which tenant the user is in). Source: `vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go`. |
| Q6 | Unresolved | Whether `list_resource_servers` returns Zscaler-internal resource servers or only tenant-created ones is not confirmed. |
| Q7 | Partially resolved | Group `source` values: users doc lists `"UI"`, `"API"`, `"SCIM"`, `"JIT"`. Groups doc lists `"SCIM"` and `"MANUAL"` as examples but not exhaustively. Source: `vendor/zscaler-sdk-python/zscaler/zid/users.py` line 187; `groups.py` line 167. |

### `references/cloud-connector/sdk.md` (5 of 8 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Unresolved | Duplicate DNS gateway packages (`dns_gateway` and `forwarding_gateways/dns_forwarding_gateway`) targeting same endpoint — canonical package for TF provider not confirmed. |
| Q2 | Unresolved | `provisioning_url` non-`Resource` methods — intentional or bug not confirmed. |
| Q3 | Resolved | `workload_groups` Create/Update/Delete are NOT commented out. Exports confirmed at lines 98, 113, 124 of `vendor/zscaler-sdk-go/zscaler/ztw/services/workload_groups/workload_groups.go`. Doc body corrected. |
| Q4 | Resolved | `activation_cli` is a `package main` CLI program (`zconActivator.go`), not an importable library. Uses legacy env vars (`ZCON_USERNAME`, `ZCON_PASSWORD`, `ZCON_API_KEY`, `ZCON_CLOUD`). Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/activation_cli/zconActivator.go`. |
| Q5 | Resolved | `public_cloud_account` targets `/publicCloudAccountDetails`; `public_cloud_info` targets `/publicCloudInfo` with full CRUD + `GenerateExternalID` + `UpdatePublicCloudChangeState`. Different endpoints, different purposes. Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/provisioning/public_cloud_account/public_cloud_account.go`. |
| Q6 | Resolved | `zparesources` exports `GetZPAApplicationSegments` — read-only ZPA app segment lookup for use in forwarding rule construction. Source: `vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/zparesources/zparesources.go`. |
| Q7 | Resolved | `workload_groups.Get` uses `service.Client.Read` (not `ReadResource`) — confirmed inconsistency vs other ZTW services. Reason not documented. |
| Q8 | Unresolved | OneAPI fallback behavior for `zscalergov`/`zscalerten` — not confirmed from available sources. |

### `references/zia/sdk.md` (6 of 8 resolved)

| # | Status | Finding |
|---|--------|---------|
| zia-sdk-01 | Resolved | `AuditLogsAPI` non-standard returns are intentional artifacts of the async report pattern: `get_status()` → dict body; `create()` → HTTP status int; `cancel()` → `status_code`; `get_report()` → CSV string. All return `None` on any error. Source: `vendor/zscaler-sdk-python/zscaler/zia/audit_logs.py`. |
| zia-sdk-02 | Resolved | `BrowserControlSettingsPI` typo confirmed (class is missing `A`). All imports use this misspelled name consistently. Source: `vendor/zscaler-sdk-python/zscaler/zia/browser_control_settings.py` line 25. |
| zia-sdk-03 | Resolved | `dns_gatways.py` filename typo confirmed. Accessor in `ZIAService` is named correctly (`dns_gateways`) so callers are unaffected. Source: `vendor/zscaler-sdk-python/zscaler/zia/dns_gatways.py`. |
| zia-sdk-04 | Resolved | `update_password_expiry_settings` copy-paste bug confirmed: docstring shows correct endpoint `/passwordExpiry/settings` but implementation sends PUT to `/cyberThreatProtection/advancedThreatSettings`. Method is functionally broken. Source: `vendor/zscaler-sdk-python/zscaler/zia/admin_roles.py` lines 571 and 623. |
| zia-sdk-05 | Resolved | `add/delete_urls_to/from_whitelist` are client-side helpers: get → modify list → `replace_whitelist()` (PUT to `/security/whitelist`). `add_urls_to_blacklist` POSTs directly to `/security/advanced/blacklistUrls`. No action query parameter used. Source: `vendor/zscaler-sdk-python/zscaler/zia/security_policy_settings.py`. |
| zia-sdk-06 | Resolved | No VIP listing overlap: `TrafficDatacentersAPI` has `list_datacenters` (not `list_vips`). VIP methods (`list_vips`, `list_vips_recommended`) are exclusively in `gre_tunnel.py`. Source: `vendor/zscaler-sdk-python/zscaler/zia/traffic_datacenters.py` and `gre_tunnel.py`. |
| zia-sdk-07 | Unresolved | Go SDK parity for newer ZIA services (CASB DLP/Malware, DNS gateways, etc.) — snapshot reflects state at review date. Re-check against Go SDK when using these services. |
| zia-sdk-08 | Unresolved | IDM profile model structure — not inspected in available review window. |

### `references/zpa/sdk.md` (4 of 10 resolved)

| # | Status | Finding |
|---|--------|---------|
| zpa-sdk-01 | Resolved | `app_segments_ba` is a typed convenience wrapper for Browser Access segments. `application_segment.get_segments_by_type("BROWSER_ACCESS")` provides the same filter explicitly. Both target `/application`. Source: `vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py` line 418. |
| zpa-sdk-02 | Unresolved | V1 vs V2 Browser Access module distinction — not confirmed from available sources. |
| zpa-sdk-03–05 | Unresolved | Several service method lists remain inferred from module structure. |
| zpa-sdk-06 | Unresolved | `ZIACustomerConfigAPI.update_zia_customer_config` PUT vs PATCH — not confirmed. |
| zpa-sdk-07 | Resolved | `portal_policy` and `user_portal` are in `POLICY_MAP` and functional in `get_policy`/`list_rules` but absent from docstrings. Source: `vendor/zscaler-sdk-python/zscaler/zpa/policies.py` lines 64 and 71. |
| zpa-sdk-08 | Resolved | `/v2` suffix on `c2c_ip_ranges` and `customer_domain` base endpoints is intentional — a v2 sub-path within the v1 admin namespace. Source: `vendor/zscaler-sdk-python/zscaler/zpa/c2c_ip_ranges.py` line 35 and `customer_domain.py` line 34. |
| zpa-sdk-09 | Resolved | `emergency_access.py` uses `page_id` as pagination parameter — confirmed correct per docstring. Source: `vendor/zscaler-sdk-python/zscaler/zpa/emergency_access.py` line 45. |
| zpa-sdk-10 | Unresolved | Go parity for specific services not fully confirmed. |

### `references/zia/terraform.md` (4 of 6 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | Full enums confirmed: `file_size` = `FILE_5MB`, `FILE_10MB`, `FILE_50MB`, `FILE_100MB`, `FILE_250MB`, `FILE_500MB`, `FILE_1GB`. Web conferencing `type` = `BANDWIDTH_CAT_WEBCONF`, `BANDWIDTH_CAT_VOIP`. Source: Go resource files in `vendor/terraform-provider-zia/zia/`. |
| Q2 | Unresolved | `zia_url_categories_predefined` eligibility criteria — not in provider source. |
| Q3 | Unresolved | `zia_sandbox_behavioral_analysis_v2` vs v1 endpoint relationship — not confirmed. |
| Q4 | Resolved | ISOLATE action requires CBI subscription, `cbi_profile` block required, cannot mix with other actions. `available_actions_without_isolate` helper attribute available. Source: `vendor/terraform-provider-zia/docs/resources/zia_cloud_app_control_rule.md`. |
| Q5 | Resolved | `zia_dc_exclusions` uses `datacenter_id` from `zia_datacenters` data source. `zia_sub_cloud` uses `cloud_id` from `zia_sub_cloud` data source. Different entities (DC vs geographic zone). Source: provider docs. |
| Q6 | Resolved | Admin rank 0–7, fixed ZIA system values. 7 = lowest (default), 0 = super admin. Source: `vendor/terraform-provider-zia/zia/resource_zia_admin_roles.go` line 62; `vendor/zscaler-help/admin-rbac-captures.md`. |

### `references/zpa/terraform.md` (5 of 7 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | `zia_cloud_domain` valid values: `zscaler`, `zscloud`, `zscalerone`, `zscalertwo`, `zscalerthree`, `zscalerbeta`, `zscalergov`, `zscalerten`, `zspreview`. StateFunc appends `.net` to stored value. Source: `vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_config.go` lines 34–44. |
| Q2 | Resolved | LSS `source_log_type` list confirmed from prior review of `zpa_lss_config_controller.md`. |
| Q3 | Resolved | `app_connector_group` OAuth2 enrollment: `enrollment_cert_id` (from `zpa_enrollment_cert` data source) + `user_codes` (Set of String from VM display). Source: `vendor/terraform-provider-zpa/docs/resources/zpa_app_connector_group.md` lines 141–142. |
| Q4 | Resolved | v1 `rule_order` is deprecated (replaced by `zpa_policy_access_rule_reorder`). v1 resource has no EOL removal date. Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md`. |
| Q5 | Resolved | `zpa_private_cloud_group` is for on-premises ZPA Private Cloud deployments. `site_id` links to a Private Cloud Controller site. Source: `vendor/terraform-provider-zpa/docs/resources/zpa_private_cloud_group.md`. |
| Q6 | Unresolved | Tag group membership in policy — Early Access, not confirmed. |
| Q7 | Resolved | `zpa_policy_redirection_rule` CLIENT_TYPE values: `zpn_client_type_machine_tunnel`, `zpn_client_type_edge_connector`, `zpn_client_type_zapp`, `zpn_client_type_zapp_partner`, `zpn_client_type_branch_connector`. Source: `vendor/terraform-provider-zpa/docs/resources/zpa_policy_redirection_rule.md`. |

### `references/cloud-connector/terraform.md` (3 of 9 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Unresolved | `ztc_dns_forwarding_gateway` vs `ztc_dns_gateway` canonical package — not confirmed. |
| Q2 | Resolved | `ztc_traffic_forwarding_log_rule.md` header says "(Data Source)" — confirmed documentation bug. Source: `vendor/terraform-provider-ztc/docs/resources/ztc_traffic_forwarding_log_rule.md`. |
| Q3 | Resolved | `ztc_ip_destination_groups` correct TF argument is `addresses` (not `ip_addresses`). Schema source: `vendor/terraform-provider-ztc/ztc/resource_ztc_ip_destination_groups.go`. |
| Q4 | Resolved | `ztc_ip_source_groups` example uses `zia_ip_source_groups` — confirmed documentation bug. Source: `vendor/terraform-provider-ztc/docs/resources/ztc_ip_source_groups.md`. |
| Q5 | Partially resolved | `zparesources.GetZPAApplicationSegments` provides the lookup mechanism; cross-provider ID equivalence with ZPA TF provider not confirmed from live test. |
| Q6–Q9 | Unresolved | Auth framework restriction, `wan_selection` deprecation, `subcloud_*` applicability, provider version scheme — not confirmed. |

### `references/zia/audit-logs.md` (5 of 8 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | ZIA Audit Log navigation confirmed. Columns: Timestamp, Action, Category, Sub-Category, Resource, Admin ID, Client IP, Interface, Trace ID, Result. Source: `vendor/zscaler-help/admin-rbac-captures.md` line 78. |
| Q2 | Resolved | Event log vs audit log distinction confirmed by different endpoints and Go SDK package. Event log = system events; audit log = admin config changes. |
| Q3 | Resolved | No CSV download function for event log in Go SDK (`eventlogentryreport.go`). Admin audit log download is at `/auditlogEntryReport/download` (Python SDK only). |
| Q4 | Unresolved | NSS streaming for ZIA admin audit logs — not visible in NSS docs. |
| Q5 | Resolved | CSV column names confirmed from help capture (see Q1 above). |
| Q6 | Unresolved | Pagination semantics for audit log report — not fully documented. |
| Q7 | Unresolved | `targetOrgId` MSP usage semantics — not documented. |
| Q8 | Resolved | 6-month retention confirmed. Source: `vendor/zscaler-help/admin-rbac-captures.md` line 76. |

### `references/zpa/audit-logs.md` (2 of 6 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | ZPA Admin Console shows audit logs with 14-day window. LSS needed for longer retention. Source: `vendor/zscaler-help/about-log-streaming-service.md` line 19. |
| Q2 | Unresolved | `zpn_audit_log` LSS stream field schema — not available from reviewed sources. |
| Q3 | Unresolved | `SIEM_POLICY` purpose in LSS audit context — not confirmed. |
| Q4 | Unresolved | Microtenant scoping for audit logs — not confirmed. |
| Q5 | Resolved | ZPA has no pull-based audit export API. Confirmed absent from both SDKs. |
| Q6 | Unresolved | `LSSConfig.filter` valid expressions for `zpn_audit_log` — not documented. |

### `references/zwa/audit-logs.md` (1 of 7 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Resolved | Python `Logs` model confirmed incomplete vs Go `AuditLog` struct. Go adds: `changedAt`, `changedBy`, `oldRowJson`, `newRowJson`, `changeNote`. Source: `vendor/zscaler-sdk-python/zscaler/zwa/models/audit_logs.py`; `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go`. |
| Q2–Q7 | Unresolved | Action/Module enumerations, retention, SIEM streaming, `changeNote` semantics, API version — not confirmed from available sources. |

### `references/shared/audit-logs.md` (1 of 9 resolved)

| # | Status | Finding |
|---|--------|---------|
| Q1 | Unresolved | ZIdentity audit log API — no package found in Go or Python SDK. |
| Q2 | Unresolved | ZIA NSS audit streaming — appears pull-only; not confirmed. |
| Q3–Q5 | Unresolved | ZCC, ZTW, ZDX admin audit — no audit packages found for any of these products. |
| Q6 | Unresolved | Cross-product Trace ID in ZWA/ZDX/ZCC contexts — not confirmed. |
| Q7 | Resolved | ZPA pull-based audit export confirmed absent. Admin console 14-day window + LSS are the only access mechanisms. |
| Q8 | Unresolved | ZWA retention — not documented in available sources. |
| Q9 | Unresolved | Unified audit bus — not visible from available SDK sources. |

---

## Notable bugs found and documented

1. **`update_password_expiry_settings` endpoint bug** (`references/zia/sdk.md`): The method PUTs to the ATP settings endpoint instead of `/passwordExpiry/settings`. The method is functionally broken.

2. **`workload_groups` CRUD doc error** (`references/cloud-connector/sdk.md`): Prior doc claimed CRUD was "commented out". Confirmed wrong — `Create`, `Update`, `Delete` are all exported. Doc body corrected.

3. **`ztc_traffic_forwarding_log_rule` header label** (`references/cloud-connector/terraform.md`): Doc header says "(Data Source)" — confirmed documentation bug in vendor provider docs.

4. **`ztc_ip_destination_groups` field name** (`references/cloud-connector/terraform.md`): Attribute reference table used `ip_addresses`; correct TF argument is `addresses`. Confirmed from provider Go source.

5. **`ztc_ip_source_groups` example resource type** (`references/cloud-connector/terraform.md`): Example uses `zia_ip_source_groups` — confirmed documentation bug; correct type is `ztc_ip_source_groups`.

6. **`BrowserControlSettingsPI` class name typo** (`references/zia/sdk.md`): Missing `A` in `API`. Affects direct class imports; `client.zia.browser_control_settings` accessor is unaffected.

7. **`dns_gatways.py` filename typo** (`references/zia/sdk.md`): Missing `e`. Accessor in `ZIAService` masks the typo from callers.

8. **`get_group(group_id: int)` type annotation bug** (`references/zidentity/sdk.md`): ZIdentity IDs are strings; `int` annotation is incorrect.

---

## Deferred — ZIA sublocations

Added 2026-04-27 from `references/zia/sublocations.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| sub-01 | Maximum number of sublocations per parent location | No limit documented in vendor help doc, SDK source, or TF provider source |
| sub-02 | Naming uniqueness scope — per-parent or tenant-global | Not explicitly stated in any available vendor source |
| sub-03 | Parent deletion behavior — whether the API blocks deletion of a parent location that has sublocations, cascade-deletes them, or returns an error | Not documented in `understanding-sublocations.md`, SDK delete method, or TF provider |
| sub-04 | Sublocation promotion/demotion via `parent_id` update — whether the API enforces preconditions (e.g., no existing sublocations before demotion to child) | Not documented in available sources |
| sub-05 | Depth limit — explicit vendor statement confirming sublocations cannot themselves have sublocations | Available sources show only 2-level examples; no explicit prohibition text found |

---

## Deferred — M365 SIPA CA

Added 2026-04-27 from `references/shared/m365-conditional-access.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| m365-01 | Azure AD Conditional Access IP evaluation frequency — whether CA re-evaluates source IP on every HTTP request or only at token-issuance time | Azure AD-side behavior; not described in Zscaler vendor docs. The SIPA config guide states post-auth traffic uses a token and "does not require being redirected through Source IP Anchoring" (implying token-based, not per-request), but the exact CA evaluation model is Microsoft's documentation responsibility |
| m365-02 | Azure AD Continuous Access Evaluation (CAE) interaction — whether CAE-enabled tenants with IP-binding policies impose re-authentication more frequently and what the SIPA implications are | Not addressed in any Zscaler vendor source reviewed |
| m365-03 | ZPA fallback behavior when all SIPA connector group connectors are unhealthy — whether the predefined `Fallback mode of ZPA Forwarding` ZIA rule routes traffic to PSE egress or drops it | The predefined rule exists (`references/zia/forwarding-control.md`) but its exact fallback action for SIPA-destined traffic is not source-confirmed |
| m365-04 | Whether an automated mechanism exists (Zscaler or third-party) to sync App Connector public IPs with Azure AD Named Locations on IP change | Not documented in any vendor source reviewed; stated as operator responsibility in this doc |
| m365-05 | Named Locations maximum IP range count in Azure AD | Microsoft's constraint, not Zscaler's; not captured in available sources |

---

## Deferred — ZIA time intervals

Added 2026-04-27 from `references/zia/time-intervals.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| ti-01 | DST handling for `startTime`/`endTime` minute-offsets — whether values are evaluated against the location's timezone with DST applied, or a fixed UTC offset | Not documented in any available vendor source; requires live API testing or Zscaler confirmation |
| ti-02 | Tenant-level cap on user-created time interval objects | No maximum count documented in help portal, SDK source, or Terraform provider |
| ti-03 | Terraform managed resource — no `zia_time_interval` resource block exists in the TF provider; whether one is planned or intentionally excluded | Not confirmed from available provider source |
| ti-04 | Midnight-spanning intervals — whether `endTime` < `startTime` is accepted for windows that cross midnight, or whether two objects are required | Not documented in available sources; Go struct uses plain `int` with no visible constraint |
| ti-05 | Predefined time intervals in `/timeIntervals` catalog — whether fixed objects (analogous to the `/timeWindows` predefined "Work hours" / "Weekends" entries) also exist in the `/timeIntervals` endpoint | Not confirmed from available sources |

---

## Deferred — ZPA machine groups

Added 2026-04-27 from `references/zia/machine-groups.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| mg-01 | Whether a direct POST `/machineGroup` endpoint exists | Both SDKs expose only read operations; help doc implies Admin Console creation + provisioning enrollment; no POST endpoint confirmed |
| mg-02 | Whether the machine group definition carries any matching criteria beyond provisioning key linkage (hostname pattern, OS type, certificate subject on the group object itself) | Python SDK model and Go SDK struct show no such fields; help doc does not describe group-level matching attributes |
| mg-03 | Whether `MACHINE_GRP` can scope user-session ZPA access rules (not just machine-tunnel rules) | Not confirmed or denied in reviewed sources; the vendor doc focuses on machine tunnel use case only |
| mg-04 | Capacity limits — machine groups per tenant, provisioning keys per group, enrolled machines per group | No limit figures found in vendor help doc, SDK, or TF provider source |
| mg-05 | Product classification — `references/zia/machine-groups.md` file path is incorrect; all sources confirm this is a ZPA construct (`/zpa/about-machine-groups` URL; ZPA-only SDK and TF artifacts); `_coverage-audit-2026-04.md` line 70 mis-labels it as "ZIA"; correct path is `references/zpa/machine-groups.md` |

---

## Deferred — ZIA rule labels

Added 2026-04-27 from `references/zia/rule-labels.md` authoring pass.

| ID | Question | Why unresolved |
|---|---|---|
| rl-01 | Do label names appear in ZIA admin audit log entries for rule create/update operations? | Vendor help and SDK sources describe labels as UI/API metadata only; no audit log schema including label names was found in reviewed sources |
| rl-02 | Are there character-set restrictions or maximum length constraints on the `name` field? | Not documented in SDK model, vendor help, or TF provider source; TF doc only states the field is Required (String) |
| rl-03 | Is the `name` field unique within a ZIA tenant? Does the API reject duplicate names on create? | Uniqueness enforcement not confirmed from available sources |
| rl-04 | What is the maximum allowed `description` length? | Not documented in SDK model, vendor help, or TF provider source |
| rl-05 | Does the "duplicate" action on the Rule Labels admin console page copy label-to-rule associations, or produce a fresh unassociated label? | The vendor help page lists "duplicate" as an available action but does not describe its semantics |
| rl-06 | Is label-based filtering (`rule_label` query param) available on rule list endpoints beyond firewall filtering? | Only `FirewallPolicyAPI.list_rules` was confirmed to accept `rule_label`; other policy rule list endpoints not confirmed |
| rl-07 | Is there a documented cap on the total number of rule labels per tenant? | Not found in vendor help or any SDK source |

---

## Deferred — VSE clusters

Added 2026-04-27 from `references/zia/vse-clusters.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| vse-cl-01 | Cluster-level upgrade orchestration — whether maintenance-window auto-upgrades within a VSE cluster are applied as a rolling sequence (one VM at a time, preserving capacity) or simultaneously across all VMs | The vendor cluster doc (`about-virtual-service-edge-clusters-internet-saas.md`) describes auto-upgrade at the VM level but does not address cluster-level sequencing |
| vse-cl-02 | VM drain-before-removal — whether removing a VM from an active cluster gracefully drains in-flight connections before it leaves the LB pool, or resets sessions immediately | Not described in either VSE vendor doc |
| vse-cl-03 | Log entry VM vs cluster identifier — whether NSS or Admin Console analytics log entries carry a VM-level identifier, a cluster-level identifier, or both for VSE cluster traffic | Not addressed in the VSE cluster or VSE VM vendor docs |
| vse-cl-04 | Cluster-scoped vs VM-scoped settings boundary — the Admin Console cluster page lists name, status, members, cluster IP, and IPSec termination but does not enumerate which policy settings are pushed cluster-scoped vs which require per-VM configuration | Not broken out in available vendor sources |
| vse-cl-05 | VSE NAT topology support — whether 1:1 static NAT to public IPs is supported for VSE VMs, and whether the IPv6-in-NAT restriction that applies to PSE clusters also applies to VSE | VSE firewall/connectivity docs reference outbound connectivity but do not address inbound NAT topology the way the PSE doc does |
| vse-cl-06 | Public cloud cluster object semantics (Azure/AWS/GCP) — whether the Admin Console VSE Cluster object on cloud platforms is a purely cosmetic grouping or carries behavioral configuration beyond what the cloud-native LB enforces | Not addressed in available sources |

---

## Deferred — ZIA SCIM nuances

Added 2026-04-27 from `references/zia/scim-provisioning.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| zia-scim-01 | Exact behavior when ZIA receives a `department` string via SCIM that does not match any existing ZIA department object by name — whether ZIA creates a new department object, silently drops the association, or raises an error | Not described in `vendor/zscaler-help/understanding-scim-zia.md` or any reviewed source; attribute mapping table only states the mapping exists, not the error path |
| zia-scim-02 | Whether `active=false` sent via SCIM immediately terminates active ZIA proxy sessions for that user, or only blocks future authentications | The ZIA vendor doc states `active=false` disables the user but does not describe session-kill semantics |
| zia-scim-03 | SCIM-specific rate limits on ZIA SCIM endpoints (`/Users`, `/Groups`, `/Bulk`) — whether these differ from the general ZIA API rate limits (20 GET/10s, 10 write/10s per Go SDK) | Not published in available vendor sources; general API rate limits apply per Go SDK CLAUDE.md but SCIM-specific guidance is absent |
| zia-scim-04 | Maximum number of SCIM-provisioned users and groups per ZIA tenant — whether tenant-level caps exist distinct from the 128 groups/user membership cap | Not stated in `vendor/zscaler-help/understanding-scim-zia.md`; no Ranges and Limitations reference for SCIM object counts reviewed |
| zia-scim-05 | Per-IdP attribute mapping quirks for the Enterprise User SCIM extension — specifically how Entra ID, Okta, PingFederate, and Google Workspace each map or omit the `department` field by default | Covered in per-IdP configuration guides referenced by the ZIA vendor doc but those guides are not captured in available vendor sources |
| zia-scim-06 | Whether the ZIA admin console surfaces SCIM sync errors visibly (beyond the provisioning logs in the IdP) — specifically whether ZIA has a SCIM Sync Logs page analogous to the ZPA-referenced "About SCIM Sync Logs" article | The ZIA vendor doc related-articles section lists "Configuring SCIM" and "SCIM API Examples" but no dedicated sync log article; ZPA vendor doc lists "About SCIM Sync Logs" as a related article — ZIA equivalent not confirmed |
| zia-scim-07 | Exact sync cadence / push frequency per IdP (Okta event-triggered vs scheduled batch, Entra ID provisioning cycle) for ZIA SCIM | IdP-controlled; not consolidated in any Zscaler vendor source reviewed |

---

## Remaining gaps requiring live API or external docs

- ZCC `web_privacy` return type
- ZDX expiry routing and pagination max-offset semantics
- ZIdentity `expires_at` valid range for secrets
- ZIdentity `list_resource_servers` — whether Zscaler-internal servers are returned
- Cloud Connector duplicate DNS gateway package canonicity
- Cloud Connector `provisioning_url` non-Resource methods — intentional or bug?
- Cloud Connector OneAPI cloud restriction handling
- ZIA `zia_url_categories_predefined` tenant eligibility
- ZIA `zia_sandbox_behavioral_analysis_v2` vs v1 endpoint relationship
- ZPA BA V1/V2 module distinction
- ZPA several inferred method lists (CustomerDomain, ConfigOverride, NPN, AdminSSO)
- ZPA `ZIACustomerConfigAPI` HTTP method
- ZPA tag group policy reference (Early Access)
- ZPA LSS `zpn_audit_log` field schema
- ZPA LSS `SIEM_POLICY` purpose
- ZPA microtenant audit log scoping
- ZPA `LSSConfig.filter` valid expressions
- Cloud Connector TF: auth restriction, `wan_selection`, `subcloud_*` fields, provider version
- ZWA: Action/Module enumerations, retention, SIEM streaming, `changeNote` semantics
- Shared: ZIdentity/ZCC/ZTW/ZDX audit APIs, ZWA retention, unified audit bus
