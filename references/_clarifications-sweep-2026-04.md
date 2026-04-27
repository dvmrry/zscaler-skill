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

## Deferred — ZCC API rate limits

Added 2026-04-27 from `references/zcc/api-rate-limits.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| zcc-rl-01 | Exact JSON body shape of ZCC 429 responses — whether the body contains a `message`, `code`, or `Retry-After` field | Not documented in `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`; the vendor doc only describes the `X-Rate-Limit-Retry-After-Seconds` header, not the response body |
| zcc-rl-02 | Whether the 3 calls/day cap for download endpoints is a combined pool across all three endpoints or a per-endpoint cap of 3 | The vendor doc states "3 API calls per day" for the group; the Python SDK comment describes them as individually capped; the exact scoping (combined vs per-endpoint) is not confirmed by a single authoritative statement |
| zcc-rl-03 | Whether `X-Rate-Limit-Remaining` is present on every ZCC response (proactive header) or only on 429 responses | The vendor doc describes headers in the context of rate-limit enforcement but does not explicitly state whether they appear on all 2xx responses |
| zcc-rl-04 | Maximum number of UDIDs accepted per `/forceRemoveDevices` or `/removeDevices` call | Not documented in the vendor help or SDK source; the SDK accepts an arbitrary list with no visible client-side cap |
| zcc-rl-05 | Whether the `RequestExecutor` (shared OneAPI SDK transport) automatically reads and honors `X-Rate-Limit-Retry-After-Seconds` on the modern ZCC path, or whether only `LegacyZCCClientHelper` implements this retry behavior | Not confirmed from available SDK source; Q6 in `references/zcc/sdk.md § Open questions` notes this as unresolved |
| zcc-rl-06 | Whether the 100 calls/hour limit is strictly per IP address or also per API credential pair (i.e., two different API keys from the same IP share the same bucket or maintain separate budgets) | Vendor doc states "per IP address" with no mention of per-credential sub-buckets; the combined behavior of multiple credentials on the same IP is not confirmed |

---

## Deferred — ZCC macOS install

Added 2026-04-27 from `references/zcc/macos-install-customization.md` authoring pass.

| ID | Claim requiring confirmation | Source gap |
|---|---|---|
| macos-01 | The preference domain for ZCC managed preferences is `com.zscaler.zclient` | Primary vendor doc ("Customizing ZCC with Install Options for macOS") redirected at capture time; exact preference domain not confirmed |
| macos-02 | ZCC `.pkg` post-install behavior when System Extension profile arrives after package install (whether a reboot is needed) | Not confirmed in captured sources; macOS behavior varies by version |
| macos-03 | Exact path to the Zscaler-provided uninstall script on macOS | Primary vendor doc unavailable; uninstall script path is typically inside the app bundle but not confirmed |
| macos-04 | Whether `launchTray = 0` prevents only the UI or also prevents system extension activation | Not disambiguated in the parameters vendor doc |
| macos-05 | App Store-distributed ZCC plist/MDM managed-app-config support — whether App Store build accepts managed preferences the same way as the `.pkg` build | Not addressed in captured vendor sources |
| macos-06 | Exact Team ID and System Extension bundle identifier for current ZCC release | Version-specific; must be obtained from installed package or current Zscaler Jamf/Intune deployment guide |
| macos-07 | Whether Full Disk Access via PPPC is required for all ZCC features or only for endpoint DLP and specific posture checks | Not enumerated in captured vendor sources |
| macos-08 | Minimum supported macOS version (explicit statement) | Not found in captured vendor sources |
| macos-09 | Whether a portal-side plist key controls the macOS update channel (e.g., stable vs. early-access) | Not found in captured vendor sources |
| macos-10 | Confirmed behavior of ZCC System Extension after `launchTray = 0` on macOS 13+ with Login Items restrictions | Not addressed in vendor parameters doc |

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

---

## Deferred — ZCC end-user notifications

Added 2026-04-27 from `references/zcc/end-user-notifications.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| zen-01 | Notification Templates — field schema, supported languages, branding options, whether templates can be scoped per App Profile | The vendor help doc references "Configuring Notification Templates for Zscaler Client Connector" as a related article, but that article was not captured in available vendor sources |
| zen-02 | Per-App-Profile ZPA reauthentication interval override — whether the global "Show ZPA Reauthentication Notifications Every (In Minutes)" setting can be overridden per App Profile / Web Policy | Not found in Web Policy SDK model fields or vendor App Profile help doc |
| zen-03 | AUP multi-language support — whether the AUP tab supports per-locale templates or only a single HTML blob | Not described in `vendor/zscaler-help/configuring-acceptable-use-policy-zscaler-app.md`; the Notification Templates doc (not captured) may address this |
| zen-04 | Posture-failure notification — whether ZCC emits a distinct OS-level toast notification when a device posture check fails, or only updates in-app status | Not described in the vendor notification doc; posture failure behavior in ZCC is not covered as a toast trigger in reviewed sources |
| zen-05 | Certificate trust failure notification — whether ZCC emits a ZCC-level OS toast or only a macOS/Windows system-level certificate error dialog when a cert cannot be trusted | Not addressed in the vendor notification doc; the event type is listed in vendor notification overview but behavior is not confirmed in reviewed sources |
| zen-06 | Notification delivery logging — whether "notification shown", "user dismissed", or "AUP acknowledged" events appear in any Zscaler cloud log feed (ZIA analytics, ZPA analytics, ZCC audit, NSS) | Not addressed in any reviewed vendor source; local ZCC diagnostic logs likely capture this but cloud-side visibility is not confirmed |
| zen-07 | Notification Templates localization fallback — what language ZCC falls back to if no template matches the user's OS locale | Not confirmed from reviewed sources; requires Notification Templates doc capture |
| zen-08 | Linux notification behavior — whether ZCC on Linux emits any OS-level desktop notifications (e.g., via libnotify / D-Bus), or only updates in-app status | Not addressed in the vendor notification doc; Linux platform is referenced in Web Policy sub-policies but not in the notification framework section |
| zen-09 | ChromeOS notification behavior — whether ZCC on ChromeOS surfaces OS-level notifications and whether the Android notification framework applies | The install parameters doc covers Android/ChromeOS together but the notification framework exclusions in the vendor doc only explicitly name iOS and Android as unsupported; ChromeOS status is ambiguous |

---

## Deferred — ZCC support options

Added 2026-04-27 from `references/zcc/support-options.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| supp-01 | App Supportability API endpoint path — the vendor help doc describes the UI flow (Administration > Client Connector Support > App Supportability) but does not publish the underlying API endpoint path or request schema for the four toggles (Enable Support Access, Admin Email, Zscaler Ticket Submission, Hide Logging Control). Neither the Python SDK nor the Go SDK exposes a named service module for this surface. | No SDK source found; endpoint not published in available vendor docs |
| supp-02 | Default states for App Supportability toggles — whether "Enable Support Access" and "Hide Logging Control" are on or off for a newly provisioned tenant is inferred from the configuration steps described in the vendor doc, not explicitly stated | Vendor doc describes configuration steps, not explicit default values |
| supp-03 | Mobile platform (iOS, Android) exact password gate field availability — whether `disable_password` appears in iosPolicy and androidPolicy sub-policy objects or only `logout_password` | Available sources describe desktop platform sub-policies in detail; mobile sub-policy field enumeration is incomplete in reviewed sources |
| supp-04 | Diagnostic bundle contents — specific files, directories, and log types included in the encrypted bundle submitted via Report an Issue | Vendor doc states the bundle is encrypted logs but does not enumerate contents; PII scope (specific fields, redaction behavior) is not documented |
| supp-05 | Bundle storage path on endpoint before upload — whether ZCC stages the bundle to a local temp directory before attaching it, and whether that staging path is predictable (relevant to DLP controls scanning outbound email attachments) | Not described in available vendor sources |
| supp-06 | Admin-side event log for Report an Issue submissions — whether ZCC logs the time, device, and user when a Report an Issue form is submitted, separately from the email delivery receipt | No admin-side submission log found in reviewed sources; shared audit-logs.md confirms no ZCC audit API package found in either SDK |

---

## Deferred — ZCC Firefox integration

Added 2026-04-27 from `references/zcc/firefox-integration.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| ff-01 | Linux support — whether ZCC Firefox integration applies to Linux at all | The vendor doc (`configuring-firefox-integration-zscaler-client-connector.md`) mentions only "macOS and Windows devices" without addressing Linux; Firefox snap isolation on Ubuntu adds further complexity |
| ff-02 | `security.enterprise_roots.enabled` — whether ZCC's integration mechanism sets this preference (causing Firefox to inherit the OS certificate store) or whether certificate trust requires a separate enterprise policy action | The vendor doc states certificate installation is a manual step if integration is disabled, but does not describe the cert-trust mechanism when integration is enabled |
| ff-03 | Exact Firefox preference keys ZCC writes — whether ZCC sets `network.proxy.type`, `network.proxy.autoconfig_url`, or another key set; and whether it is delivered via a preference file write, `policies.json`, the Firefox preference API, or another mechanism | Not described in the vendor doc; the doc states only that ZCC "enables the Use system proxy settings feature in Firefox" |
| ff-04 | Persistence across Firefox major version upgrades — whether settings pushed by ZCC's integration mechanism survive a Firefox major-version update, or whether ZCC must re-apply them after each upgrade | Not addressed in available vendor sources; known risk with `prefs.js`-based settings generally |
| ff-05 | ZCC version scope — whether Firefox integration behavior is consistent across ZCC 4.x releases or whether specific ZCC versions introduced changes to the integration mechanism | No version-specific notes in the vendor doc |

---

## Deferred — ZCC AUP page

Added 2026-04-27 from `references/zcc/acceptable-use-policy.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| zcc-aup-01 | Whether updating the AUP message text in the portal causes ZCC to re-display the AUP to users who have already accepted, independently of the frequency setting | The vendor source describes frequency as the only display trigger; policy-change-triggered re-prompt is not mentioned |
| zcc-aup-02 | Whether the ZCC AUP screen includes a Decline button, and what happens if the user declines (tunnel blocked, logout forced, or nothing) | The vendor source describes the screen as a gate users "must accept" but does not mention a decline action |
| zcc-aup-03 | Whether the AUP message field supports a URL redirect to an external policy page, or whether all content must be embedded in the HTML field | Not described in the vendor source; only the HTML content field and image support are documented |
| zcc-aup-04 | Whether ZCC supports a signature-capture or checkbox-confirmation variant of the AUP (vs. a simple Accept button) | Not described in available vendor sources |
| zcc-aup-05 | Whether the AUP can be configured to show both Accept and Decline as user choices, or whether it is Accept-only | Not documented; framing in vendor source implies Accept-only |
| zcc-aup-06 | Minimum ZCC agent version required to display the AUP, and whether older agent versions silently skip the AUP or generate an error | Not documented in the vendor source or in the install-parameters docs |
| zcc-aup-07 | Whether the AUP Settings tab is suppressed when the tenant uses Notification Templates (analogous to the End User Notifications tab being hidden in that mode) | The vendor source describes the End User Notifications tab being hidden when Notification Templates are in use, but does not address the AUP tab specifically |
| zcc-aup-08 | Whether ZCC logs individual user AUP accept/decline events — in the ZCC portal audit log, in ZIA NSS streams, or elsewhere | Not described in the AUP vendor source or in the shared audit-logs reference |
| zcc-aup-09 | Multi-language support — whether ZCC can display the AUP in the user's device locale, or whether only a single-language message is supported | Not described; the AUP message is a single HTML field with no documented locale variant mechanism |
| zcc-aup-10 | Confirmed message size limit for the ZCC AUP HTML field | The ZIA ranges-and-limitations doc records 15K–30K bytes for notification/AUP messages in a ZIA context; applicability to ZCC AUP not explicitly confirmed |
| zcc-aup-11 | Behavior in machine tunnel and kiosk scenarios — whether the AUP is shown before user login (machine tunnel), and whether kiosk/shared-device deployments can bypass the AUP | Not documented in the AUP vendor source or in the install-parameters docs |
| zcc-aup-12 | Whether a change to AUP frequency or message in the ZCC Portal takes effect immediately on the next user connect, or only after the next agent policy refresh cycle | The agent downloads app profile changes on logout/restart; whether AUP notification config follows the same cadence or updates server-side on demand is not confirmed |

---

## Deferred — ZCC user logging controls

Added 2026-04-27 from `references/zcc/user-logging-controls.md` authoring pass.

| # | Question | Why unresolved |
|---|---|---|
| ulc-01 | Default `logMode` for a newly created App Profile — whether Info, Warn, or another mode is the out-of-box default when an App Profile is created in the ZCC Portal | Vendor help doc describes available log modes but does not state the factory default; SDK model carries the field without a default value annotation |
| ulc-02 | `logLevel` vs `logMode` distinction — whether `logLevel` and `logMode` on the `WebPolicy` object are the same concept with different naming conventions at API vs UI layers, or represent independent configuration dimensions | Both fields exist on the `WebPolicy` model; vendor help doc uses "log mode" only; SDK field names suggest a possible distinction but semantics are not documented in available sources |
| ulc-03 | `logFileSize` values and rotation semantics — the exact units (bytes, MB), allowed range, default value, and whether ZCC keeps multiple rotated archives or overwrites in place | The `WebPolicy` model carries `logFileSize` as an untyped field; no enumeration of allowed values or rotation behavior found in vendor help or SDK source |
| ulc-04 | `enable_auto_log_snippet` field — present as a parameter on `set_web_privacy_info` in the SDK service file but absent from the `WebPrivacy` model class; function not described in any reviewed source | Discovered as a service-file parameter without a model mapping; vendor doc does not mention it |
| ulc-05 | Per-platform log path defaults — the filesystem paths where ZCC writes log files on Windows, macOS, Linux, Android, and iOS are not enumerated in available vendor sources | Help doc mentions "Show/Hide Logs" reveals the path to the user; no canonical path table found |
| ulc-06 | Windows Event Log integration — whether ZCC writes any events to the Windows Application or System event log in addition to its own log file, and if so which Event IDs | `WindowsPolicy.flow_logger_config` field on the SDK model hints at a Windows-specific logging subsystem; relationship to Windows Event Log not described in available sources |
| ulc-07 | macOS Unified Log integration — whether ZCC emits entries to OSLog (subsystem identifier, category) in addition to its own log files | Not addressed in macOS vendor docs or SDK model |
| ulc-08 | Linux syslog/journald integration — whether ZCC on Linux writes to the system journal, and if so what facility/priority it uses | `LinuxPolicy` SDK model has no log-configuration fields; Linux-specific logging behavior not documented in reviewed sources |
| ulc-09 | iOS log access limitations — whether iOS platform sandboxing restricts ZCC from exposing a user-accessible log view, and what the actual iOS-specific capabilities are under the App Supportability toggle | No iOS-specific log caveats in vendor help; iOS platform constraints on background log access are significant |
| ulc-10 | Diagnostic bundle file inventory — specific files included in the ZIP produced by "Export Logs" and in the encrypted bundle sent via "Report an Issue"; whether the bundle includes OS network configuration, driver info, or other artifacts beyond ZCC log files | Vendor doc states bundle is encrypted logs; specific file inventory not enumerated (overlaps with supp-04) |
| ulc-11 | In-UI log viewer vs diagnostic bundle consistency — whether the in-app log view and the exported ZIP always reflect the same content, or whether the viewer applies session/mode filters that exclude older rotated log data present in the ZIP | Not addressed in available sources |
| ulc-12 | ZIA-side URL visibility in ZCC log files — whether ZCC operational logs at any verbosity level include URL paths (not just hostnames/IPs), and whether this depends on forwarding mode (PAC vs tunnel) | Inferred that ZCC is transport-layer and does not log URL paths, but not explicitly confirmed |

---

## Deferred — ZCC troubleshooting

Added 2026-04-27 from `references/zcc/troubleshooting.md` authoring pass.

| ID | Claim requiring confirmation | Source gap |
|---|---|---|
| zcc-ts-01 | Exact ZCC log file paths on Windows (`%ProgramData%\Zscaler\logs\`) and macOS (`/Library/Application Support/Zscaler/logs/`) | Paths are consistent with packaging conventions and community reports but not explicitly stated in captured vendor help sources (ulc-05 from the user-logging-controls sweep also covers this) |
| zcc-ts-02 | Windows Event Log source name for ZCC events — whether source name is "Zscaler", "ZscalerApp", or another string | Not documented in captured vendor sources; overlaps with ulc-06 |
| zcc-ts-03 | macOS Unified Log subsystem identifier for ZCC (`com.zscaler`) | Not confirmed in any captured vendor source; derived from standard macOS bundle ID conventions; overlaps with ulc-07 |
| zcc-ts-04 | Android logcat tag for ZCC events — whether it is "ZscalerApp" or another tag | Not confirmed in captured vendor sources; overlaps with ulc-09 context for Android |
| zcc-ts-05 | Whether "Fetch Logs" on the ZCC Portal Enrolled Devices Device Details page requires a specific admin role permission beyond read access | Not documented in the app-supportability vendor source |
| zcc-ts-06 | HTTP 500 labeled "Not Implemented" in `legacy-about-error-codes-zcc.md` — whether this reflects an intentional API distinction from the conventional HTTP 500 (Internal Server Error) or is a documentation error | The conventional HTTP status for "Not Implemented" is 501; the vendor doc maps 500 to "Not Implemented"; no clarifying explanation given |
| zcc-ts-07 | Whether HTTP 503 is returned by the ZCC portal API during maintenance (503 is documented in the ZIA/ZPA legacy API reference but not in the ZCC-specific API reference) | Applicability of 503 to ZCC portal API is inferred from shared platform behavior; not explicitly confirmed for ZCC |
| zcc-ts-08 | Whether a macOS user denial of the ZCC Network Extension (in System Settings → Privacy & Security) surfaces a specific ZCC error code or admin-visible alert | Not described in captured vendor sources |
